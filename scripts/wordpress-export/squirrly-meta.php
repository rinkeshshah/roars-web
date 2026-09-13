<?php
/**
 * Export every Squirrly SEO value for every published document.
 *
 * Run with WP-CLI ON THE SERVER, from the WordPress root:
 *
 *   wp eval-file docs/roars-v2-build-handoff/export/squirrly-meta.php \
 *       docs/roars-v2-build-handoff/squirrly-meta.csv
 *
 * WHY THIS IS NOT THE ONE-LINE QUERY IN THE HANDOFF
 *
 * The handoff proposes:
 *
 *   SELECT ... FROM wp_posts p JOIN wp_postmeta m ON m.post_id = p.ID
 *   WHERE m.meta_key LIKE '_sq%' OR m.meta_key LIKE 'sq_%';
 *
 * That misses most of the data. Squirrly SEO keeps its snippets in its own
 * table, not in postmeta:
 *
 *   wp_qss  (plugin constant _SQ_DB_ = 'qss', see squirrly-seo/config/config.php)
 *     id, blog_id, post, URL, url_hash, seo, date_time
 *
 * `seo` and `post` are both PHP-serialised arrays (models/Qss.php writes them
 * through maybe_serialize). `seo` is where the title, description, OG and
 * Twitter values actually live. The row is keyed by url_hash, not by post ID.
 *
 * postmeta carries only a handful of per-post overrides — `_sq_title`,
 * `_sq_description`, `_sq_keywords`, `_sq_old_slug`, `_sq_sla`, `_sq_video`,
 * `_sq_jsonld_custom`, `_sq_jsonld_builder`, `_sq_pixel_custom`,
 * `_sq_woocommerce`, `_sq_image_downloaded`. Of those, `_sq_title` and
 * `_sq_description` are read as overrides in models/domain/Sq.php.
 *
 * The `sq_%` half of that WHERE clause matches nothing in postmeta. Every
 * `sq_*` name in the plugin (`sq_seosettings`, `sq_manage_snippet`, and so on)
 * is an option in wp_options, not post meta.
 *
 * So this script exports BOTH stores into one CSV, unpacking the serialised
 * qss blob into one row per key so the output is directly usable by the
 * migration script. Columns:
 *
 *   source      'qss' | 'postmeta'
 *   post_id     resolved where possible ('' for qss rows with no match)
 *   post_type
 *   post_name
 *   post_title
 *   url         the qss URL, or the permalink for postmeta rows
 *   meta_key    the unpacked key, e.g. 'title', 'description', '_sq_title'
 *   meta_value
 *   date_time   qss row timestamp, '' for postmeta
 *
 * It writes NOTHING back to the database.
 */

if ( ! defined( 'WP_CLI' ) || ! WP_CLI ) {
	fwrite( STDERR, "Run via: wp eval-file " . __FILE__ . " <out.csv>\n" );
	exit( 1 );
}

global $wpdb;

$args = $args ?? array();
$out  = isset( $args[0] ) ? $args[0] : 'docs/roars-v2-build-handoff/squirrly-meta.csv';

$dir = dirname( $out );
if ( ! is_dir( $dir ) && ! mkdir( $dir, 0775, true ) ) {
	WP_CLI::error( "Cannot create directory: $dir" );
}

$fh = fopen( $out, 'w' );
if ( ! $fh ) {
	WP_CLI::error( "Cannot write: $out" );
}

fputcsv( $fh, array(
	'source', 'post_id', 'post_type', 'post_name', 'post_title',
	'url', 'meta_key', 'meta_value', 'date_time',
) );

/**
 * Flatten a decoded value to a single CSV cell. Scalars pass through;
 * nested arrays are JSON-encoded so nothing is silently dropped.
 */
function sq_cell( $v ) {
	if ( is_scalar( $v ) || is_null( $v ) ) {
		return (string) $v;
	}
	return wp_json_encode( $v );
}

$rows_written = 0;

/* ------------------------------------------------------------------
 * 1. wp_qss — the primary snippet store
 * ------------------------------------------------------------------ */

$qss_table  = $wpdb->prefix . 'qss';
$qss_exists = $wpdb->get_var( $wpdb->prepare( 'SHOW TABLES LIKE %s', $qss_table ) ) === $qss_table;

$qss_count   = 0;
$qss_min     = null;
$qss_max     = null;
$qss_orphans = 0;

if ( ! $qss_exists ) {
	WP_CLI::warning( "$qss_table does not exist. Squirrly snippets are either "
		. 'unused on this install or stored elsewhere. Exporting postmeta only.' );
} else {
	// Resolve URL -> post once, so qss rows can carry a post_id.
	$by_url = array();
	$posts  = $wpdb->get_results(
		"SELECT ID, post_type, post_name, post_title
		   FROM {$wpdb->posts}
		  WHERE post_status = 'publish'"
	);
	foreach ( $posts as $p ) {
		$link = get_permalink( $p->ID );
		if ( $link ) {
			$by_url[ untrailingslashit( $link ) ] = $p;
		}
	}

	$qss_rows = $wpdb->get_results( "SELECT post, URL, url_hash, seo, date_time FROM `$qss_table`" );

	foreach ( $qss_rows as $r ) {
		$qss_count ++;
		if ( $r->date_time ) {
			$qss_min = ( $qss_min === null || $r->date_time < $qss_min ) ? $r->date_time : $qss_min;
			$qss_max = ( $qss_max === null || $r->date_time > $qss_max ) ? $r->date_time : $qss_max;
		}

		$key = untrailingslashit( $r->URL );
		$p   = isset( $by_url[ $key ] ) ? $by_url[ $key ] : null;
		if ( ! $p ) {
			$qss_orphans ++;
		}

		$seo = maybe_unserialize( $r->seo );
		if ( ! is_array( $seo ) ) {
			$seo = array( 'seo_raw' => $r->seo );
		}

		foreach ( $seo as $k => $v ) {
			if ( $v === '' || $v === null || $v === array() ) {
				continue;
			}
			fputcsv( $fh, array(
				'qss',
				$p ? $p->ID : '',
				$p ? $p->post_type : '',
				$p ? $p->post_name : '',
				$p ? $p->post_title : '',
				$r->URL,
				$k,
				sq_cell( $v ),
				$r->date_time,
			) );
			$rows_written ++;
		}
	}
}

/* ------------------------------------------------------------------
 * 2. wp_postmeta — the per-post overrides
 * ------------------------------------------------------------------ */

$meta_rows = $wpdb->get_results(
	"SELECT p.ID, p.post_type, p.post_name, p.post_title, m.meta_key, m.meta_value
	   FROM {$wpdb->posts} p
	   JOIN {$wpdb->postmeta} m ON m.post_id = p.ID
	  WHERE p.post_status = 'publish'
	    AND m.meta_key LIKE '\_sq%'
	  ORDER BY p.ID, m.meta_key"
);

foreach ( $meta_rows as $m ) {
	if ( $m->meta_value === '' || $m->meta_value === null ) {
		continue;
	}
	fputcsv( $fh, array(
		'postmeta',
		$m->ID,
		$m->post_type,
		$m->post_name,
		$m->post_title,
		get_permalink( $m->ID ),
		$m->meta_key,
		sq_cell( maybe_unserialize( $m->meta_value ) ),
		'',
	) );
	$rows_written ++;
}

fclose( $fh );

/* ------------------------------------------------------------------
 * 3. Freshness report — is this database stale versus production?
 * ------------------------------------------------------------------ */

$newest = $wpdb->get_var(
	"SELECT MAX(post_modified_gmt) FROM {$wpdb->posts} WHERE post_status = 'publish'"
);
$newest_pub = $wpdb->get_var(
	"SELECT MAX(post_date_gmt) FROM {$wpdb->posts} WHERE post_status = 'publish'"
);
$published = $wpdb->get_var(
	"SELECT COUNT(*) FROM {$wpdb->posts} WHERE post_status = 'publish'
	   AND post_type NOT IN ('attachment','revision','nav_menu_item')"
);

WP_CLI::log( '' );
WP_CLI::log( '--- squirrly-meta export ---' );
WP_CLI::log( "written              : $rows_written rows -> $out" );
WP_CLI::log( "qss table            : " . ( $qss_exists ? "$qss_table, $qss_count rows" : 'MISSING' ) );
if ( $qss_exists ) {
	WP_CLI::log( "qss date_time range  : " . ( $qss_min ?: 'n/a' ) . '  ..  ' . ( $qss_max ?: 'n/a' ) );
	WP_CLI::log( "qss rows w/o a post  : $qss_orphans  (retired URLs, or URLs whose slug changed)" );
}
WP_CLI::log( "postmeta _sq_* rows  : " . count( $meta_rows ) );
WP_CLI::log( '' );
WP_CLI::log( '--- freshness (compare these against production) ---' );
WP_CLI::log( "published documents  : $published" );
WP_CLI::log( "newest post_date_gmt : " . ( $newest_pub ?: 'n/a' ) );
WP_CLI::log( "newest post_modified : " . ( $newest ?: 'n/a' ) );
WP_CLI::log( '' );
WP_CLI::log( 'Production was crawled 13 Sep 2026 and had 194 published URLs.' );
WP_CLI::log( 'If the count above is materially lower, or newest post_modified predates' );
WP_CLI::log( 'the newest lastmod in docs/roars-v2-build-handoff/docs/URL-INVENTORY.csv,' );
WP_CLI::log( 'this database is behind production and the export should be treated as' );
WP_CLI::log( 'indicative rather than authoritative. Run compare-freshness.py to see' );
WP_CLI::log( 'the per-URL drift.' );
