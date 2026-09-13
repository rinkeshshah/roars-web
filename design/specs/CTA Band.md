# CTA Band — element spec

Source prototype: `design/Roars v2 - CTA Band.dc.html`  ·  desktop canvas 1440px wide, all desktop elements absolutely positioned inside their section (coordinates are relative to the section unless noted).

## Head / global CSS
```
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&amp;display=swap" rel="stylesheet">
<style>
  html, body { margin:0; padding:0; background:#0B0B0B; }
  body { font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif; -webkit-font-smoothing:antialiased; }
  * { box-sizing:border-box; }
  a { color:inherit; text-decoration:none; }
  a:hover { color:#FFD400; }
</style>
```

## Tweakable props (data-props)
```json
{
  "$preview": {
    "width": 1440,
    "height": 540
  }
}
```

## Desktop sections

### Callback (mobile)  (top 0, height auto)
background: rgb(11,11,11)  ·  overflow: visible

- div — display:flex; flex-direction:column; gap:14px
  - div — h:1.5px  |  background:rgba(180,174,174,.35)
  - span — type 13px / 600 / -0.06em / rgb(145,145,145)
      text: "A to B"
- span — type 34px / 600 / 42px / -0.05em / rgb(255,255,255)
    text: "Find how we can help you get from A to B"
- span — type 15px / 500 / 23px / -0.04em / rgba(255,255,255,.72)
    text: "Our love for innovation design and technology is evident in all our works. No detail is too small. Together, we’ll make your business grow, manifold."
- a — h:52px  |  background:rgb(255,255,255); border-radius:60px; display:flex; align-items:center; justify-content:space-between; padding:0 24px  |  HOVER { background:#FFD400 }  |  href="https://meet.roarsinc.com/sales"
  - span — type 14px / 500 / -0.03em / rgb(11,11,11)
      text: "Request a Callback"
  - span — display:flex; gap:3px
    - span — w:8px h:8px  |  background:rgba(11,11,11,.35); border-radius:50%
    - span — w:8px h:8px  |  background:rgb(11,11,11); border-radius:50%
- span — type 13px / 500 / 20px / -0.04em / rgba(255,255,255,.5)
    text: "USA +1 (302) 505-1200 · UK +44 (7537) 183399"

### Callback  (top 0, height 540px)
background: rgb(11,11,11)  ·  overflow: hidden

- div — l:40px t:100px w:1362px h:1.5px  |  background:rgba(180,174,174,.35)
- span — l:40px t:124px  |  type 14px / 600 / 19px / -0.06em / rgb(145,145,145)  |  white-space:nowrap
    text: "A to B"
- span — l:33px t:190px w:760px h:110px  |  type 42px / 600 / 52px / -0.05em / rgb(255,255,255)
    text: "Find how we can help you get from A to B"
- span — l:962px t:196px w:440px h:90px  |  type 16px / 500 / 23px / -0.04em / rgba(255,255,255,.72)
    text: "Our love for innovation design and technology is evident in all our works. No detail is too small. Together, we’ll make your business grow, manifold."
- a — l:962px t:340px w:204px h:47px  |  background:rgb(255,255,255); border-radius:60px; display:block  |  HOVER { background:#FFD400 }  |  href="https://meet.roarsinc.com/sales"
  - span — l:25px t:14px  |  type 14px / 500 / 20px / -0.03em / rgb(11,11,11)  |  white-space:nowrap
      text: "Request a Callback"
  - span — l:167px t:20px w:8px h:8px  |  background:rgba(11,11,11,.35); border-radius:50%
  - span — l:177px t:20px w:8px h:8px  |  background:rgb(11,11,11); border-radius:50%
- span — l:40px t:350px w:500px h:40px  |  type 14px / 500 / 20px / -0.04em / rgba(255,255,255,.5)
    text: "USA +1 (302) 505-1200 · UK +44 (7537) 183399"

## Mobile layout (≤760px, normal document flow)

### M1 div
padding: — · background: — · layout: flex column gap 14px
- div — h:1.5px  |  background:rgba(180,174,174,.35)
- span — type 13px / 600 / -0.06em / rgb(145,145,145)
    text: "A to B"

### M2 span
padding: — · background: — · layout: block  gap —


### M3 span
padding: — · background: — · layout: block  gap —


### M4 a
padding: 0 24px · background: rgb(255,255,255) · layout: flex  gap —
- span — type 14px / 500 / -0.03em / rgb(11,11,11)
    text: "Request a Callback"
- span — display:flex; gap:3px
  - span — w:8px h:8px  |  background:rgba(11,11,11,.35); border-radius:50%
  - span — w:8px h:8px  |  background:rgb(11,11,11); border-radius:50%

### M5 span
padding: — · background: — · layout: block  gap —


## Behaviour + data (logic class, verbatim)
```js
class Component extends DCLogic {
  componentDidMount() {
    this.mq = matchMedia('(max-width: 760px)');
    this.fit = () => {
      const band = document.querySelector('[data-band]');
      const mob = document.querySelector('[data-mobile]');
      if (!band || !mob) return;
      const m = this.mq.matches;
      mob.style.display = m ? 'flex' : 'none';
      band.style.display = m ? 'none' : 'block';
      if (m) return;
      const w = (band.parentElement ? band.parentElement.clientWidth : innerWidth) || 1440;
      const s = Math.min(1, w / 1440);
      band.style.transform = 'scale(' + s + ')';
      band.style.height = (540 * s) + 'px';
    };
    this.reveal = () => {
      const mob = document.querySelector('[data-mobile]');
      if (!mob || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const items = [...mob.querySelectorAll('[data-mrev]')];
      items.forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(18px)';
        el.style.transition = 'transform .7s cubic-bezier(.22,.68,.28,1) ' + (i * 70) + 'ms, opacity .55s ease ' + (i * 70) + 'ms';
      });
      this.io = new IntersectionObserver(ens => {
        ens.forEach(en => {
          if (!en.isIntersecting) return;
          en.target.style.opacity = '1';
          en.target.style.transform = 'none';
          this.io.unobserve(en.target);
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
      items.forEach(el => this.io.observe(el));
    };
    this.fit();
    this.reveal();
    addEventListener('resize', this.fit);
    if (this.mq.addEventListener) this.mq.addEventListener('change', this.fit);
  }

  componentWillUnmount() {
    removeEventListener('resize', this.fit);
    if (this.io) this.io.disconnect();
    if (this.mq && this.mq.removeEventListener) this.mq.removeEventListener('change', this.fit);
  }
}
```