#!/bin/bash
# Run this from a machine that can reach the site. Read-only: only GET/HEAD.
#
# Each line prints the full hop chain. What you want to see is exactly one
# 301 landing on a 200, and nothing ending in a 404.
hops() {
  printf '%-62s ' "$1"
  curl -sIL --max-time 20 "$1" \
    | awk 'BEGIN{ORS=""} /^HTTP/{print $2" "} tolower($1)=="location:"{sub(/\r/,"",$2); print "-> "$2" "}'
  echo
}

echo "== the eight from Search Console =="
for u in \
  https://www.roarsinc.com/resources/innovation-flowchart \
  https://www.roarsinc.com/s/digital-business-transformation-services \
  http://www.roarsinc.com/ \
  https://www.roarsinc.com/work/warehouse-compliance-checklist-app \
  https://www.roarsinc.com/s/mvp-development \
  https://www.roarsinc.com/industries/retail-ecommerce-development \
  https://www.roarsinc.com/our-journal/5-simple-guidelines-for-mobile-app-design \
  https://www.roarsinc.com/our-journal/loyalty-reward-program-app
do hops "$u"; done

echo
echo "== host and scheme variants =="
for u in \
  http://roarsinc.com/ \
  https://roarsinc.com/ \
  http://www.roarsinc.com/s/mvp-development \
  https://roarsinc.com/s/mvp-development \
  http://roarsinc.com/s/mvp-development
do hops "$u"; done

echo
echo "== must NOT gain a slash, must NOT redirect =="
for u in \
  https://www.roarsinc.com/robots.txt \
  https://www.roarsinc.com/sitemap-index.xml \
  https://www.roarsinc.com/sitemap-0.xml
do hops "$u"; done

echo
echo "== the two resource archives (both must be 200) =="
for u in \
  https://www.roarsinc.com/resource/tools/ \
  https://www.roarsinc.com/resource/staff-picks/ \
  https://www.roarsinc.com/resources/guides/
do hops "$u"; done
