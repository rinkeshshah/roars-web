# Project Detail — element spec

Source prototype: `design/Roars  v2 - Project Detail.dc.html` (note the filename contains a double space after "Roars")

## Head / global CSS
```
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&amp;display=swap" rel="stylesheet">
<style>
  html, body { margin:0; padding:0; background:#FFFFFF; }
  body { font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif; -webkit-font-smoothing:antialiased; }
  * { box-sizing:border-box; }
  a { color:inherit; text-decoration:none; }
  a:hover { color:#FFD400; }
</style>
```

## Fixed top bar (desktop)
- div — l:0 t:0 w:1440px h:150px  |  z-index:50
  - div
    - div — l:39px t:36px w:1366px h:111px  |  overflow:hidden
      - a — l:-9px t:-4px w:52px h:52px  |  border-radius:999px; display:flex; align-items:center; justify-content:center  |  href="Roars v2 - Main.dc.html"
        - span — background:conic-gradient(#FFD400 0turn,rgba(255,212,0,.14) 0turn); border-radius:999px; opacity:0
        - img — w:26px h:auto  |  display:block  |  src="brand/roars-mark.png"  |  alt="Roars"
      - div — l:929px t:0 w:285px h:111px  |  overflow:hidden
        - span — l:0 t:71px w:160px h:40px  |  type 14px / 500 / 20px / -0.04em / rgb(255,255,255)  |  opacity:.75
            text: "Reach out to start your project"
        - div — l:0 t:0 w:285px h:42px
          - div — l:0 t:0 w:42px h:42px  |  background:rgb(255,255,255); border-radius:60px; overflow:hidden
            - img — l:5px t:5px w:32px h:32px  |  border-radius:60px; object-fit:cover  |  src="https://www.roarsinc.com/wp-content/uploads/elementor/thumbs/rinkesh-shah-r1yz7f0mes7oppcabus8b850ve7xiekiv4lpok466c.webp"  |  alt="Riinkesh A Sshah"
          - a — l:42px t:0 w:243px h:42px  |  border-radius:60px; box-shadow:inset 0 0 0 2px rgba(255,255,255,.25); display:block  |  HOVER { box-shadow:inset 0 0 0 2px #FFD400 }  |  href="Roars v2 - Contact.dc.html"
            - span — l:18px t:11px  |  type 12px / 500 / 20px / -0.03em / rgb(255,255,255)  |  white-space:nowrap
                text: "Contact Now"
            - span — l:205px t:17px w:8px h:8px  |  background:rgb(153,152,149); border-radius:50%
            - span — l:216px t:17px w:8px h:8px  |  background:rgb(255,255,255); border-radius:50%
      - div — l:1340px t:18px w:26px h:6px  |  display:flex; flex-direction:column; justify-content:space-between
        - span — w:26px h:2px  |  background:rgb(255,255,255); display:block
        - span — w:26px h:2px  |  background:rgb(255,255,255); display:block

## Fixed top bar (mobile)
- div — l:0 t:0 h:60px  |  right:0; background:rgba(255,255,255,.86); border-bottom:1px solid rgba(153,152,149,.25); display:none; align-items:center; justify-content:space-between; padding:0 16px; z-index:60
  - a — w:44px h:44px  |  display:flex; align-items:center; justify-content:center  |  href="Roars v2 - Main.dc.html"
    - img — w:24px h:auto  |  display:block; filter:brightness(0)  |  src="brand/roars-mark.png"  |  alt="Roars"
  - div — display:flex; align-items:center; gap:12px
    - a — h:34px  |  type 12px / 500 / -0.03em / rgb(15,15,15)  |  border-radius:60px; box-shadow:inset 0 0 0 1.5px rgba(15,15,15,.28); display:flex; align-items:center; padding:0 16px  |  href="Roars v2 - Contact.dc.html"
        text: "Contact"
    - a — w:44px h:44px  |  display:flex; flex-direction:column; align-items:flex-end; justify-content:center; gap:5px  |  href="Roars v2 - Menu.dc.html"
      - span — w:24px h:2px  |  background:rgb(15,15,15); display:block
      - span — w:24px h:2px  |  background:rgb(15,15,15); display:block

## Desktop sections

### Header  (top 0, height 196px)
background: rgb(0,0,0)

- img — l:0 t:0 w:1440px h:196px  |  object-fit:cover  |  src="assets/space.jpg"
- div — background:rgba(0,0,0,.35)

### Project  (top 196px, height 5534px)
background: rgb(255,255,255)

- div — l:42px t:102px w:1358px h:330px
  - div — l:0 t:206px w:149px h:19px
    - a — l:0 t:0 w:118px h:19px  |  type 18px / 600 / 19px / -0.06em / rgb(0,0,0)  |  white-space:nowrap  |  href="Roars v2 - Projects.dc.html"
        text: "See all Projects"
    - span — l:130px t:7px w:8px h:8px  |  background:rgb(153,152,149); border-radius:50%; opacity:.6
    - span — l:141px t:7px w:8px h:8px  |  background:rgb(20,20,20); border-radius:50%
  - span — l:452px t:182px w:526px h:86px  |  type 124px / 600 / 86px / -0.04em / rgb(20,20,20)  |  white-space:nowrap
      text: "Snowman"
  - span — l:457px t:311px w:106px h:19px  |  type 20px / 500 / 19px / -0.06em / rgb(0,0,0)  |  white-space:nowrap
      text: "Feb 18, 2026"
  - div — l:926px t:0 w:432px h:134px
    - img — l:0 t:8px w:40px h:40px  |  background:rgb(217,217,217); border-radius:60px; object-fit:cover  |  src="https://www.roarsinc.com/wp-content/uploads/elementor/thumbs/rinkesh-shah-r1yz7f0mes7oppcabus8b850ve7xiekiv4lpok466c.webp"  |  alt="Riinkesh A Sshah"
    - img — l:43px t:0 w:40px h:40px  |  background:rgb(217,217,217); border-radius:60px; object-fit:cover  |  src="https://www.roarsinc.com/wp-content/uploads/2022/07/Chetna.webp"  |  alt="Chetna Shah"
    - img — l:0 t:55px w:40px h:40px  |  background:rgb(217,217,217); border-radius:60px; object-fit:cover  |  src="https://www.roarsinc.com/wp-content/uploads/2022/07/suzanne.webp"  |  alt="Suzanne Martin"
    - img — l:43px t:47px w:40px h:40px  |  background:rgb(217,217,217); border-radius:60px; object-fit:cover  |  src="https://www.roarsinc.com/wp-content/uploads/2022/07/Abhishek.webp"  |  alt="Kevin Jacob"
    - img — l:43px t:94px w:40px h:40px  |  background:rgb(217,217,217); border-radius:60px; object-fit:cover  |  src="https://www.roarsinc.com/wp-content/uploads/2022/07/Nitin.webp"  |  alt="Avinash Kumar"
    - span — l:117px t:4px w:180px h:48px  |  type 18px / 500 / 24px / -0.03em / rgb(20,20,20)
        text: "Team MembersInvolved"
      - br
- div — l:42px t:459px w:1358px h:737px  |  background:rgb(30,30,30); border-radius:12px; overflow:hidden
  - img — w:100% h:100%  |  display:block; object-fit:cover  |  src="https://www.roarsinc.com/wp-content/uploads/2026/02/Snowman-Logistics-app-solution.jpg"  |  alt="Snowman Logistics warehouse platform"
- div — l:42px t:1279px w:1358px h:588px
  - span — l:0 t:0 w:48px h:24px  |  type 16px / 500 / 24px / -0.04em / rgb(71,71,71)  |  opacity:.8; white-space:nowrap
      text: "About:"
  - span — l:461px t:0 w:689px h:185px  |  type 26px / 600 / 37px / -0.04em / rgb(0,0,0)
      text: "A centralised warehouse operations system for Snowman Logistics — replacing manual checklists and fragmented reporting with real-time visibility, structured compliance and scalable control across every site."
  - div — l:457px t:259px w:901px h:329px
    - sc-for
      - div — l:0 t:{{ m.y }} w:897px h:42px
        - div — l:0 t:0 w:897px h:.5px  |  background:rgb(71,71,71); opacity:.2
        - span — l:0 t:17px w:136px h:24px  |  type 14px / 500 / 24px / -0.02em / rgb(71,71,71)  |  opacity:.8
            text: "{{ m.k }}"
        - span — l:465px t:18px w:432px h:24px  |  type 16px / 500 / 24px / -0.04em / rgb(0,0,0)  |  white-space:nowrap
            text: "{{ m.v }}"
    - a — l:0 t:282px w:299px h:47px  |  background:rgb(0,0,0); border-radius:60px; display:block  |  HOVER { background:#FFD400 }  |  href="Roars v2 - Contact.dc.html"
      - span — l:25px t:14px  |  type 14px / 500 / 20px / -0.03em / rgb(255,255,255)  |  white-space:nowrap
          text: "Live Version"
      - span — l:260px t:20px w:8px h:8px  |  background:rgb(153,152,149); border-radius:50%; opacity:.6
      - span — l:270px t:20px w:8px h:8px  |  background:rgb(255,255,255); border-radius:50%
- div — l:42px t:1968.726px w:1358px h:359.274px  |  overflow:hidden
  - div — l:0 t:0 w:662px h:359.274px  |  background:rgb(30,30,30); border-radius:12px; overflow:hidden
    - img — w:100% h:100%  |  display:block; object-fit:cover  |  src="https://www.roarsinc.com/wp-content/uploads/2026/04/aboutus-strategy.jpg"
  - div — l:696px t:0 w:662px h:359.274px  |  background:rgb(30,30,30); border-radius:12px; overflow:hidden
    - img — w:100% h:100%  |  display:block; object-fit:cover  |  src="https://www.roarsinc.com/wp-content/uploads/2025/04/beautiful-experience.jpg"
- div — l:42px t:2410px w:1168px h:268px
  - span — l:0 t:0 w:380px h:74px  |  type 26px / 600 / 37px / -0.04em / rgb(0,0,0)
      text: "Goals of the Project:"
  - span — l:461px t:0 w:707px h:148px  |  type 26px / 600 / 37px / -0.04em / rgb(0,0,0)
      text: "To give every site one source of truth — checklists on the floor, photo evidence attached, timestamped sign-off, and reporting that rolls up to regional and national views."
  - span — l:461px t:162px w:707px h:96px  |  type 18px / 500 / 28px / -0.03em / rgb(71,71,71)  |  opacity:.85
      text: "To make compliance simple, fast and visually clear for the people doing it — so a problem surfaces while it can still be fixed."
- div — l:42px t:2770px w:1358px h:2271px  |  overflow:hidden
  - sc-for
    - div — l:{{ s.x }} t:{{ s.y }} w:{{ s.w }} h:{{ s.h }}  |  background-color:rgb(30,30,30); background-image:{{ s.bg }}; border-radius:12px
- div — l:42px t:5123px w:1168px h:268px
  - span — l:0 t:0 w:380px h:74px  |  type 26px / 600 / 37px / -0.04em / rgb(0,0,0)
      text: "Outcome:"
  - span — l:461px t:0 w:707px h:148px  |  type 26px / 600 / 37px / -0.04em / rgb(0,0,0)
      text: "Intuitive control at every level — an app built for gloves and cold storage, with large targets, offline capture and no typing where a tap will do."
  - span — l:461px t:162px w:707px h:96px  |  type 18px / 500 / 28px / -0.03em / rgb(71,71,71)  |  opacity:.85
      text: "A streamlined system that highlights what matters and drives stronger engagement, with clear navigation and exception-first reporting for managers."

### Footer  (top 5730px, height 1105px)
background: rgb(11,11,11)

- img — l:-37px t:-10px w:1672.305px h:1115.006px  |  transform:scaleY(-1); object-fit:cover  |  src="assets/space.jpg"
- div — l:44px t:61px w:1073px h:192px  |  overflow:hidden
  - img — l:0 t:0 w:21px h:21px  |  filter:invert(1)  |  src="assets/mark.svg"  |  alt="Roars"
  - div — l:458px t:5px w:384px h:187px  |  overflow:hidden
    - span — l:0 t:0 w:384px h:120px  |  type 22px / 500 / 30px / -0.04em / rgb(147,147,147)
        text: "Find how we can help you get from A to B. Our love for innovation design and technology is evident in all our work. No detail is too small."
    - div — l:0 t:145px w:170px h:42px
      - img — l:0 t:0 w:42px h:42px  |  border-radius:60px; object-fit:cover  |  src="https://www.roarsinc.com/wp-content/uploads/elementor/thumbs/rinkesh-shah-r1yz7f0mes7oppcabus8b850ve7xiekiv4lpok466c.webp"
      - span — l:56px t:3px  |  type 14px / 600 / 20px / -0.05em / rgba(255,255,255,.95)  |  white-space:nowrap
          text: "Riinkesh A Sshah"
      - span — l:56px t:23px  |  type 14px / 500 / 20px / -0.05em / rgba(255,255,255,.6)  |  white-space:nowrap
          text: "CEO / Founder"
  - span — l:921px t:11px w:180px h:48px  |  type 18px / 500 / 24px / -0.02em / rgb(255,255,255)
      text: "Space of ProductSolutions"
    - br
    - span — type #FFD400
        text: "*"
- div — l:43px t:378px w:1356px h:258px  |  overflow:hidden
  - div — l:0 t:36px w:249px h:81px
    - div — l:1px t:0 w:16px h:1.5px  |  background:rgba(180,174,174,.7)
    - span — l:0 t:34px  |  type 12px / 500 / 17px / -0.04em / rgba(255,255,255,.8)  |  white-space:nowrap
        text: "USA +1 (302) 505-1200"
    - a — l:1px t:57px  |  type 20px / 600 / 24px / -0.02em / rgba(255,255,255,.95)  |  white-space:nowrap  |  href="mailto:sales@roarsinc.com"
        text: "sales@roarsinc.com"
  - span — l:459px t:0  |  type 14px / 600 / 19px / -0.06em / rgb(145,145,145)  |  white-space:nowrap
      text: "Navigation"
  - div — l:459px t:39px w:16px h:1.5px  |  background:rgba(153,152,149,.7)
  - div — l:459px t:58px w:200px h:200px  |  type 24px / 600 / 40px / -0.06em / rgba(255,255,255,.9)  |  display:flex; flex-direction:column
    - a — href="Roars v2 - Main.dc.html"
        text: "Home"
    - a — href="Roars v2 - Agency.dc.html"
        text: "Agency"
    - a — href="Roars v2 - Projects.dc.html"
        text: "Projects"
    - a — href="Roars v2 - Insights.dc.html"
        text: "Insights"
    - a — href="Roars v2 - Contact.dc.html"
        text: "Contact"
  - div — l:692px t:64px w:120px h:90px  |  type 16px / 500 / 30px / -0.06em / rgba(255,255,255,.78)  |  display:flex; flex-direction:column
    - a — href="https://www.twitter.com/roarstech"
        text: "Twitter"
    - a — href="https://www.instagram.com/roarstech"
        text: "Instagram"
    - a — href="https://in.linkedin.com/company/roars-technologies-pvt.-ltd./"
        text: "LinkedIn"
  - span — l:925px t:0  |  type 14px / 600 / 19px / -0.06em / rgb(145,145,145)  |  white-space:nowrap
      text: "Subscribe our News"
  - div — l:926px t:39px w:16px h:1.5px  |  background:rgba(153,152,149,.7)
  - div — l:926px t:70px w:430px h:182px  |  overflow:hidden
    - span — l:0 t:0  |  type 16px / 400 / 19px / -0.06em / rgb(255,255,255)  |  white-space:nowrap
        text: "Your name *"
    - div — l:0 t:40px w:430px h:1px  |  background:rgba(231,231,231,.3)
    - span — l:0 t:66px  |  type 16px / 400 / 19px / -0.06em / rgb(255,255,255)  |  white-space:nowrap
        text: "Email *"
    - div — l:0 t:106px w:430px h:1px  |  background:rgba(231,231,231,.3)
    - div — l:0 t:140px w:195px h:42px  |  border-radius:60px; box-shadow:inset 0 0 0 2px rgba(255,255,255,.25)
      - span — l:21px t:10px  |  type 12px / 500 / 20px / rgb(255,255,255)  |  white-space:nowrap
          text: "Subscribe"
      - span — l:158px t:17px w:8px h:8px  |  background:rgb(153,152,149); border-radius:50%
      - span — l:169px t:17px w:8px h:8px  |  background:rgb(255,255,255); border-radius:50%
- div — l:43px t:734px w:1053px h:310px  |  overflow:hidden
  - div — l:459px t:0 w:594px h:186px  |  overflow:hidden
    - img — l:5px t:61px w:58px h:7px  |  transform:rotate(6.7deg); filter:invert(1)  |  src="assets/asteroids.svg"
    - span — l:0 t:0 w:555px h:186px  |  type 182px / 600 / 86px / -0.04em / rgb(255,255,255)  |  white-space:nowrap
        text: "roars"
    - div — l:443px t:28px w:31px h:31px  |  background:#FFD400; border-radius:60px
      - span — l:0 t:0 w:31px h:31px  |  type 13px / 600 / 1 / 0 / rgb(31,31,31)  |  display:flex; align-items:center; justify-content:center
          text: "®"
  - div — l:0 t:238px w:1053px h:72px  |  overflow:hidden
    - span — l:0 t:5px  |  type 12px / 500 / 17px / -0.04em / rgba(255,255,255,.5)  |  white-space:nowrap
        text: "© 2026"
    - span — l:0 t:27px  |  type 12px / 500 / 17px / -0.04em / rgba(255,255,255,.5)  |  white-space:nowrap
        text: "Roars Technologies"
    - div — l:459px t:0 w:247px h:72px  |  type 12px / 500 / 21px / -0.04em / rgba(255,255,255,.8)  |  display:flex; flex-direction:column
      - a — href="#"
          text: "Privacy Policy"
      - a — href="#"
          text: "Terms of Service"
      - a — href="https://link.roars.in/F39Mv"
          text: "Company Profile"
    - span — l:692px t:3px  |  type 12px / 500 / 17px / -0.04em / rgba(255,255,255,.5)  |  white-space:nowrap
        text: "Offices"
    - span — l:692px t:27px  |  type 12px / 500 / 17px / -0.04em / rgba(255,255,255,.8)  |  white-space:nowrap
        text: "USA · UK · India"
    - span — l:926px t:3px  |  type 12px / 500 / 17px / -0.04em / rgba(255,255,255,.5)  |  white-space:nowrap
        text: "Built by"
    - span — l:926px t:27px  |  type 12px / 500 / 17px / -0.04em / rgba(255,255,255,.8)  |  white-space:nowrap
        text: "Roars Technologies"

## Mobile layout (≤760px)

### M1 section
padding: 84px 20px 36px · background: #fff · flex column gap 24px
- a — type 16px / 600 / -0.06em / rgb(0,0,0)  |  display:flex; align-items:center; gap:10px  |  href="Roars v2 - Projects.dc.html"
  - span
      text: "See all Projects"
  - span — display:flex; gap:3px
    - span — w:8px h:8px  |  background:rgba(153,152,149,.6); border-radius:50%
    - span — w:8px h:8px  |  background:rgb(20,20,20); border-radius:50%
- div — display:flex; flex-direction:column; gap:8px
  - span — type 62px / 600 / 62px / -0.04em / rgb(20,20,20)
      text: "Snowman"
  - span — type 18px / 500 / -0.06em / rgb(0,0,0)
      text: "Feb 18, 2026"
- div — display:flex; align-items:center; gap:14px
  - div — display:flex; align-items:center
    - img — w:38px h:38px  |  border-radius:60px; box-shadow:0 0 0 2px #fff; object-fit:cover  |  src="https://www.roarsinc.com/wp-content/uploads/elementor/thumbs/rinkesh-shah-r1yz7f0mes7oppcabus8b850ve7xiekiv4lpok466c.webp"
    - img — w:38px h:38px  |  border-radius:60px; box-shadow:0 0 0 2px #fff; object-fit:cover  |  src="https://www.roarsinc.com/wp-content/uploads/2022/07/Chetna.webp"
    - img — w:38px h:38px  |  border-radius:60px; box-shadow:0 0 0 2px #fff; object-fit:cover  |  src="https://www.roarsinc.com/wp-content/uploads/2022/07/suzanne.webp"
    - img — w:38px h:38px  |  border-radius:60px; box-shadow:0 0 0 2px #fff; object-fit:cover  |  src="https://www.roarsinc.com/wp-content/uploads/2022/07/Abhishek.webp"
    - img — w:38px h:38px  |  border-radius:60px; box-shadow:0 0 0 2px #fff; object-fit:cover  |  src="https://www.roarsinc.com/wp-content/uploads/2022/07/Nitin.webp"
  - span — type 15px / 500 / 21px / -0.03em / rgb(20,20,20)
      text: "Team MembersInvolved"
    - br
- div — background:rgb(30,30,30); border-radius:12px; overflow:hidden
  - img — w:100% h:100%  |  display:block; object-fit:cover  |  src="https://www.roarsinc.com/wp-content/uploads/2026/02/Snowman-Logistics-app-solution.jpg"  |  alt="Snowman Logistics warehouse platform"

### M2 section
padding: 0 20px 48px · background: #fff · flex column gap 24px
- div — display:flex; flex-direction:column; gap:12px
  - span — type 15px / 500 / -0.04em / rgb(71,71,71)  |  opacity:.8
      text: "About:"
  - span — type 22px / 600 / 31px / -0.04em / rgb(0,0,0)
      text: "A centralised warehouse operations system for Snowman Logistics — replacing manual checklists and fragmented reporting with real-time visibility, structured compliance and scalable control across every site."
- div — display:flex; flex-direction:column
  - sc-for
    - div — border-top:.5px solid rgba(71,71,71,.25); display:flex; align-items:baseline; justify-content:space-between; gap:16px; padding:14px 0
      - span — type 14px / 500 / -0.02em / rgb(71,71,71)  |  opacity:.8
          text: "{{ m.k }}"
      - span — type 15px / 500 / -0.04em / rgb(0,0,0)  |  flex:1
          text: "{{ m.v }}"
- a — h:52px  |  background:rgb(0,0,0); border-radius:60px; display:flex; align-items:center; justify-content:space-between; padding:0 24px  |  HOVER { background:#FFD400 }  |  href="Roars v2 - Contact.dc.html"
  - span — type 14px / 500 / -0.03em / rgb(255,255,255)
      text: "Live Version"
  - span — display:flex; gap:3px
    - span — w:8px h:8px  |  background:rgba(153,152,149,.6); border-radius:50%
    - span — w:8px h:8px  |  background:#fff; border-radius:50%

### M3 section
padding: 0 20px 48px · background: #fff · flex column gap 14px
- div — background:rgb(30,30,30); border-radius:12px; overflow:hidden
  - img — w:100% h:100%  |  display:block; object-fit:cover  |  src="https://www.roarsinc.com/wp-content/uploads/2026/04/aboutus-strategy.jpg"
- div — background:rgb(30,30,30); border-radius:12px; overflow:hidden
  - img — w:100% h:100%  |  display:block; object-fit:cover  |  src="https://www.roarsinc.com/wp-content/uploads/2025/04/beautiful-experience.jpg"

### M4 section
padding: 0 20px 48px · background: #fff · flex column gap 14px
- div — border-top:1.5px solid rgba(153,152,149,.55); display:flex; flex-direction:column; gap:14px
  - span — type 22px / 600 / 30px / -0.04em / rgb(0,0,0)
      text: "Goals of the Project:"
  - span — type 22px / 600 / 31px / -0.04em / rgb(0,0,0)
      text: "To give every site one source of truth — checklists on the floor, photo evidence attached, timestamped sign-off, and reporting that rolls up to regional and national views."
  - span — type 16px / 500 / 25px / -0.03em / rgb(71,71,71)  |  opacity:.85
      text: "To make compliance simple, fast and visually clear for the people doing it — so a problem surfaces while it can still be fixed."

### M5 section
padding: 0 20px 48px · background: #fff · flex column gap 14px
- sc-for
  - div — background-color:rgb(30,30,30); background-image:{{ s.bg }}; border-radius:12px

### M6 section
padding: 0 20px 64px · background: #fff · flex column gap 14px
- div — border-top:1.5px solid rgba(153,152,149,.55); display:flex; flex-direction:column; gap:14px
  - span — type 22px / 600 / 30px / -0.04em / rgb(0,0,0)
      text: "Outcome:"
  - span — type 22px / 600 / 31px / -0.04em / rgb(0,0,0)
      text: "Intuitive control at every level — an app built for gloves and cold storage, with large targets, offline capture and no typing where a tap will do."
  - span — type 16px / 500 / 25px / -0.03em / rgb(71,71,71)  |  opacity:.85
      text: "A streamlined system that highlights what matters and drives stronger engagement, with clear navigation and exception-first reporting for managers."
- a — h:52px  |  background:rgb(0,0,0); border-radius:60px; display:flex; align-items:center; justify-content:space-between; padding:0 24px  |  HOVER { background:#FFD400 }  |  href="Roars v2 - Projects.dc.html"
  - span — type 14px / 500 / -0.03em / rgb(255,255,255)
      text: "Next Project"
  - span — display:flex; gap:3px
    - span — w:8px h:8px  |  background:rgba(153,152,149,.6); border-radius:50%
    - span — w:8px h:8px  |  background:#fff; border-radius:50%

### M7 section
padding: 56px 20px 40px · background: rgb(11,11,11) · flex column gap 34px
- img — l:0 t:-6% w:100% h:112%  |  opacity:.55; transform:scaleY(-1); object-fit:cover  |  src="assets/space.jpg"
- div — l:0 t:0  |  right:0; bottom:0; background:linear-gradient(180deg,rgba(11,11,11,.6) 0%,rgba(11,11,11,.9) 100%)
- div — display:flex; flex-direction:column; gap:34px
  - div — display:flex; flex-direction:column; gap:18px
    - img — w:21px h:21px  |  filter:invert(1)  |  src="assets/mark.svg"  |  alt="Roars"
    - span — type 18px / 500 / 26px / -0.02em / rgb(255,255,255)
        text: "Space of ProductSolutions"
      - br
      - span — type #FFD400
          text: "*"
    - span — type 17px / 500 / 26px / -0.04em / rgb(147,147,147)
        text: "Find how we can help you get from A to B. Our love for innovation design and technology is evident in all our work. No detail is too small."
    - div — display:flex; align-items:center; gap:12px
      - img — w:42px h:42px  |  border-radius:60px; object-fit:cover  |  src="https://www.roarsinc.com/wp-content/uploads/elementor/thumbs/rinkesh-shah-r1yz7f0mes7oppcabus8b850ve7xiekiv4lpok466c.webp"
      - div — display:flex; flex-direction:column; gap:2px
        - span — type 12px / 400 / -0.06em / rgba(255,255,255,.9)
            text: "Riinkesh A Sshah"
        - span — type 12px / 400 / -0.06em / rgba(255,255,255,.5)
            text: "CEO / Founder"
  - div — border-top:1px solid rgba(180,174,174,.35); display:flex; flex-direction:column; gap:8px
    - span — type 12px / 500 / -0.04em / rgba(255,255,255,.8)
        text: "USA +1 (302) 505-1200"
    - a — type 20px / 600 / -0.02em / rgba(255,255,255,.95)  |  href="mailto:sales@roarsinc.com"
        text: "sales@roarsinc.com"
  - div — display:flex; gap:40px
    - div — display:flex; flex-direction:column; gap:8px
      - span — type 13px / 600 / -0.06em / rgb(145,145,145)
          text: "Navigation"
      - div — w:16px h:1.5px  |  background:rgba(153,152,149,.7)
      - div — type 20px / 600 / 30px / -0.06em / rgba(255,255,255,.9)  |  display:flex; flex-direction:column; gap:4px
        - a — href="Roars v2 - Main.dc.html"
            text: "Home"
        - a — href="Roars v2 - Agency.dc.html"
            text: "Agency"
        - a — href="Roars v2 - Projects.dc.html"
            text: "Projects"
        - a — href="Roars v2 - Insights.dc.html"
            text: "Insights"
        - a — href="Roars v2 - Contact.dc.html"
            text: "Contact"
    - div — type 15px / 500 / 26px / -0.06em / rgba(255,255,255,.78)  |  display:flex; flex-direction:column; gap:6px
      - a — href="https://www.twitter.com/roarstech"
          text: "Twitter"
      - a — href="https://www.instagram.com/roarstech"
          text: "Instagram"
      - a — href="https://in.linkedin.com/company/roars-technologies-pvt.-ltd./"
          text: "LinkedIn"
  - div — border-top:1px solid rgba(180,174,174,.35); display:flex; flex-direction:column; gap:14px
    - span — type 13px / 600 / -0.06em / rgb(145,145,145)
        text: "Subscribe our News"
    - div — display:flex; flex-direction:column; gap:6px
      - span — type 15px / 400 / -0.06em / rgb(255,255,255)
          text: "Your name *"
      - div — h:1px  |  background:rgba(231,231,231,.3)
    - div — display:flex; flex-direction:column; gap:6px
      - span — type 15px / 400 / -0.06em / rgb(255,255,255)
          text: "Email *"
      - div — h:1px  |  background:rgba(231,231,231,.3)
    - div — h:46px  |  border-radius:60px; box-shadow:inset 0 0 0 2px rgba(255,255,255,.25); display:flex; align-items:center; justify-content:space-between; padding:0 20px
      - span — type 12px / 500 / rgb(255,255,255)
          text: "Subscribe"
      - span — display:flex; gap:3px
        - span — w:8px h:8px  |  background:rgb(153,152,149); border-radius:50%
        - span — w:8px h:8px  |  background:#fff; border-radius:50%
  - div — display:flex; align-items:flex-start; gap:8px
    - span — type 84px / 600 / 72px / -0.04em / rgb(255,255,255)
        text: "roars"
    - span — w:24px h:24px  |  type 11px / 600 / rgb(31,31,31)  |  background:#FFD400; border-radius:60px; display:flex; align-items:center; justify-content:center
        text: "®"
  - div — type 12px / 500 / 19px / -0.04em  |  border-top:1px solid rgba(180,174,174,.25); display:flex; gap:22px 40px
    - div — display:flex; flex-direction:column
      - span — type rgba(255,255,255,.5)
          text: "© 2026"
      - span — type rgba(255,255,255,.5)
          text: "Roars Technologies"
    - div — type rgba(255,255,255,.8)  |  display:flex; flex-direction:column
      - a — href="#"
          text: "Privacy Policy"
      - a — href="#"
          text: "Terms of Service"
      - a — href="https://link.roars.in/F39Mv"
          text: "Company Profile"
    - div — display:flex; flex-direction:column
      - span — type rgba(255,255,255,.5)
          text: "Offices"
      - span — type rgba(255,255,255,.8)
          text: "USA · UK · India"
    - div — display:flex; flex-direction:column
      - span — type rgba(255,255,255,.5)
          text: "Built by"
      - span — type rgba(255,255,255,.8)
          text: "Roars Technologies"

## Behaviour + data (logic class, verbatim)
```js
class Component extends DCLogic {
  componentDidMount() {
    this.mq = matchMedia('(max-width: 760px)');
    this.fit = () => {
      const wrap = document.querySelector('[data-fit]');
      const canvas = document.querySelector('[data-canvas]');
      if (!wrap || !canvas) return;
      const m = this.mq.matches;
      const mob = document.querySelector('[data-mobile]');
      const barM = document.querySelector('[data-topbar-m]');
      const barD = document.querySelector('[data-topbar]');
      if (mob) mob.style.display = m ? 'block' : 'none';
      if (barM) barM.style.display = m ? 'flex' : 'none';
      if (barD) barD.style.display = m ? 'none' : 'block';
      canvas.style.display = m ? 'none' : 'block';
      if (m) { wrap.style.height = 'auto'; return; }
      const s = wrap.clientWidth / 1440;
      canvas.style.transform = 'scale(' + s + ')';
      wrap.style.height = (6835 * s) + 'px';
      const bar = document.querySelector('[data-topbar]');
      if (bar) {
        bar.style.transform = 'scale(' + s + ')';
        bar.style.left = wrap.getBoundingClientRect().left + 'px';
      }
    };

    const DARK = [[0, 196], [5730, 6835]];
    this.tint = () => {
      const wrap = document.querySelector('[data-fit]');
      const bar = document.querySelector('[data-topbar]');
      if (!wrap || !bar) return;
      const s = wrap.clientWidth / 1440;
      const yy = (scrollY + 60) / s;
      const onDark = DARK.some(r => yy >= r[0] && yy < r[1]);
      const ink = onDark ? 'rgb(255,255,255)' : 'rgb(15,15,15)';
      const contact = bar.querySelector('[data-contact]');
      if (contact) {
        const gone = scrollY > 80;
        contact.style.opacity = gone ? '0' : '1';
        contact.style.transform = gone ? 'translateY(-12px)' : 'none';
        contact.style.pointerEvents = gone ? 'none' : 'auto';
      }
      bar.querySelectorAll('[data-ink]').forEach(el => { el.style.color = ink; });
      bar.querySelectorAll('[data-fill]').forEach(el => { el.style.background = ink; });
      bar.querySelectorAll('[data-ring]').forEach(el => {
        el.style.boxShadow = 'inset 0 0 0 2px ' + (onDark ? 'rgba(255,255,255,.25)' : 'rgba(15,15,15,.28)');
      });
      const mark = bar.querySelector('[data-mark]');
      if (mark) {
        const ring = mark.querySelector('[data-logo-ring]');
        const img = mark.querySelector('[data-logo-img]');
        const doc = document.documentElement;
        const max = Math.max(1, doc.scrollHeight - innerHeight);
        const prog = Math.min(1, Math.max(0, scrollY / max));
        const onLight = !onDark;
        if (ring) {
          ring.style.background = 'conic-gradient(#FFD400 ' + prog.toFixed(4) + 'turn, rgba(255,212,0,.14) 0turn)';
          ring.style.opacity = onLight ? '1' : '0';
        }
        mark.style.background = onLight ? '#FBFBF9' : 'transparent';
        mark.style.boxShadow = onLight ? '0 1px 0 rgba(10,10,10,.06)' : 'none';
        if (img) {
          img.style.filter = onLight
            ? 'brightness(0)'
            : 'brightness(0) invert(84%) sepia(72%) saturate(1400%) hue-rotate(357deg) brightness(104%)';
          img.style.transform = onLight ? 'rotate(45deg) scale(.92)' : 'rotate(0deg) scale(1)';
        }
      }
    };

    this.logoIntro = () => {
      const img0 = document.querySelector('[data-logo-img]');
      if (!img0 || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      img0.animate(
        [{ transform: 'scale(.2) rotate(-90deg)', opacity: 0.001 },
         { transform: 'scale(1.12) rotate(8deg)', opacity: 1, offset: 0.62 },
         { transform: 'scale(1) rotate(0deg)', opacity: 1 }],
        { duration: 1100, delay: 300, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'both' }
      );
    };
    this.logoIntro();
    this.tint();
    addEventListener('scroll', this.tint, { passive: true });
    // subtle scroll reveal: direct blocks of each section rise and fade in once
    this.reveal = () => {
      const canvas = document.querySelector('[data-canvas]');
      if (!canvas) return;
      const items = [];
      [...canvas.querySelectorAll('[data-screen-label]')].forEach(sec => {
        [...sec.children].forEach(el => {
          if (el.tagName === 'IMG' && el.parentElement === sec) return;
          if (el.dataset.slide !== undefined || el.dataset.slideA !== undefined) return;
          if (!el.style || el.style.position !== 'absolute') return;
          el.style.willChange = 'transform,opacity';
          el.style.transition = 'transform .72s cubic-bezier(.22,.68,.28,1), opacity .62s ease';
          el.style.opacity = '0';
          items.push(el);
        });
      });
      const base = new Map();
      items.forEach(el => base.set(el, el.style.transform || ''));
      items.forEach(el => { el.style.transform = (base.get(el) + ' translateY(26px)').trim(); });
      const io = new IntersectionObserver(entries => {
        entries.forEach(en => {
          if (!en.isIntersecting) return;
          const el = en.target;
          el.style.transform = base.get(el);
          el.style.opacity = '1';
          io.unobserve(el);
        });
      }, { rootMargin: '0px 0px -12% 0px', threshold: 0.06 });
      items.forEach(el => io.observe(el));
      this.io = io;
    };
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) requestAnimationFrame(() => this.reveal());

    this.fit();
    this.mobileMotion = () => {
      const mob = document.querySelector('[data-mobile]');
      if (!mob || this.mio) return;
      const soft = matchMedia('(prefers-reduced-motion: reduce)').matches;
      const bar = document.querySelector('[data-topbar-m]');
      if (bar && !bar.querySelector('[data-mprog]')) {
        const p = document.createElement('span');
        p.setAttribute('data-mprog', '1');
        p.style.cssText = 'position:absolute;left:0;bottom:-1px;height:2px;width:0;background:#FFD400;transition:width .12s linear';
        bar.appendChild(p);
      }
      if (!soft) {
        [...mob.querySelectorAll('[data-mrev]')].forEach(el => {
          el.style.opacity = '0';
          el.style.transform = 'translateY(24px) scale(.985)';
          el.style.transition = 'transform .8s cubic-bezier(.22,.68,.28,1), opacity .6s ease';
          [...el.children].forEach((c, i) => {
            if (i > 7) return;
            c.style.opacity = '0';
            c.style.transform = 'translateY(12px)';
            c.style.transition = 'transform .66s cubic-bezier(.22,.68,.28,1) ' + (60 + i * 70) + 'ms, opacity .5s ease ' + (60 + i * 70) + 'ms';
          });
        });
        this.mio = new IntersectionObserver(ens => {
          ens.forEach(en => {
            if (!en.isIntersecting) return;
            const el = en.target;
            el.style.opacity = '1';
            el.style.transform = 'none';
            [...el.children].forEach(c => { c.style.opacity = '1'; c.style.transform = 'none'; });
            const dot = el.querySelector('[data-mdot]');
            if (dot) { dot.style.background = '#FFD400'; dot.style.boxShadow = 'inset 0 0 0 1.5px rgba(20,20,20,.15)'; }
            this.mio.unobserve(el);
          });
        }, { rootMargin: '0px 0px -8% 0px', threshold: 0.04 });
        [...mob.querySelectorAll('[data-mrev]')].forEach(el => this.mio.observe(el));
      }
      const darks = [...mob.querySelectorAll('[data-mdark]')];
      const pars = [...mob.querySelectorAll('[data-mpar]')];
      this.mtint = () => {
        if (!this.mq.matches) return;
        const doc = document.documentElement;
        const prog = Math.min(1, Math.max(0, scrollY / Math.max(1, doc.scrollHeight - innerHeight)));
        const pb = bar && bar.querySelector('[data-mprog]');
        if (pb) pb.style.width = (prog * 100).toFixed(2) + '%';
        if (!soft) pars.forEach(el => {
          const r = el.getBoundingClientRect();
          const k = parseFloat(el.getAttribute('data-mpar')) || 0.06;
          const off = (r.top + r.height / 2 - innerHeight / 2) * -k;
          const flip = (el.style.transform || '').indexOf('scaleY(-1)') >= 0 ? ' scaleY(-1)' : '';
          el.style.transform = 'translate3d(0,' + off.toFixed(1) + 'px,0)' + flip;
        });
        if (!bar) return;
        const onDark = darks.some(s => { const r = s.getBoundingClientRect(); return r.top <= 30 && r.bottom > 30; });
        bar.style.background = onDark ? 'rgba(10,10,10,.55)' : 'rgba(255,255,255,.86)';
        bar.style.borderBottomColor = onDark ? 'rgba(255,255,255,.16)' : 'rgba(153,152,149,.25)';
        const ink = onDark ? 'rgb(255,255,255)' : 'rgb(15,15,15)';
        bar.querySelectorAll('[data-mbar-line]').forEach(el => { el.style.background = ink; });
        const pill = bar.querySelector('[data-mbar-pill]');
        if (pill) { pill.style.color = ink; pill.style.boxShadow = 'inset 0 0 0 1.5px ' + (onDark ? 'rgba(255,255,255,.3)' : 'rgba(15,15,15,.28)'); }
        const img = bar.querySelector('[data-mbar-img]');
        if (img) img.style.filter = onDark ? 'brightness(0) invert(84%) sepia(72%) saturate(1400%) hue-rotate(357deg) brightness(104%)' : 'brightness(0)';
      };
      // ── mobile: tap-to-open accordions ──────────────────────────────
      const maccs = [...mob.querySelectorAll('[data-macc]')];
      maccs.forEach(acc => {
        if (acc.dataset.wired) return;
        acc.dataset.wired = '1';
        const head = acc.querySelector('[data-macc-head]');
        const body = acc.querySelector('[data-macc-body]');
        const inner = acc.querySelector('[data-macc-inner]');
        const ico = acc.querySelector('[data-macc-ico]');
        if (!head || !body || !inner) return;
        const set = on => {
          acc.dataset.open = on ? '1' : '';
          body.style.height = on ? inner.offsetHeight + 'px' : '0px';
          if (ico) {
            ico.style.transform = on ? 'rotate(45deg)' : 'none';
            ico.style.color = on ? '#FFD400' : 'rgba(20,20,20,.5)';
          }
        };
        acc.__set = set;
        head.addEventListener('click', () => {
          const on = acc.dataset.open !== '1';
          maccs.forEach(o => { if (o !== acc && o.__set) o.__set(false); });
          set(on);
        });
      });

      // ── mobile: filter chips ────────────────────────────────────────
      const mchips = [...mob.querySelectorAll('[data-mfilter]')];
      const mcards = [...mob.querySelectorAll('[data-mcard]')];
      if (mchips.length && mcards.length) {
        const mcount = mob.querySelector('[data-mcount]');
        const applyM = key => {
          let n = 0;
          mcards.forEach(c => {
            const on = key === 'all' || (' ' + c.getAttribute('data-mcat') + ' ').indexOf(' ' + key + ' ') >= 0;
            c.style.display = on ? 'flex' : 'none';
            if (on) n += 1;
          });
          if (mcount) mcount.textContent = n + ' / ' + mcards.length;
          mchips.forEach(ch => {
            const on = ch.getAttribute('data-mfilter') === key;
            ch.style.background = on ? '#FFD400' : 'transparent';
            ch.style.boxShadow = 'inset 0 0 0 1px ' + (on ? '#FFD400' : 'rgba(20,20,20,.16)');
          });
        };
        mchips.forEach(ch => ch.addEventListener('click', () => applyM(ch.getAttribute('data-mfilter'))));
      }

      // ── mobile: stagger children + reveal, progress bar, parallax ───
      const soft2 = matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (bar && !bar.querySelector('[data-mprog]')) {
        const pb0 = document.createElement('span');
        pb0.setAttribute('data-mprog', '1');
        pb0.style.cssText = 'position:absolute;left:0;bottom:-1px;height:2px;width:0;background:#FFD400;transition:width .12s linear';
        bar.appendChild(pb0);
      }
      if (!soft2) {
        mob.querySelectorAll('section > img').forEach(im => {
          if (!im.hasAttribute('data-mpar') && !im.hasAttribute('data-mpar2')) {
            im.setAttribute('data-mpar2', '0.05');
            im.style.willChange = 'transform';
          }
        });
        const revs = [...mob.querySelectorAll('[data-mrev]')];
        revs.forEach(el => {
          el.style.willChange = 'transform,opacity';
          if (!el.style.transition) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(24px) scale(.985)';
            el.style.transition = 'transform .8s cubic-bezier(.22,.68,.28,1), opacity .6s ease';
          }
          [...el.children].forEach((c, i) => {
            if (i > 7 || c.dataset.stag) return;
            c.dataset.stag = '1';
            c.style.opacity = '0';
            c.style.transform = 'translateY(12px)';
            c.style.transition = 'transform .66s cubic-bezier(.22,.68,.28,1) ' + (60 + i * 70) + 'ms, opacity .5s ease ' + (60 + i * 70) + 'ms';
          });
        });
        this.mio2 = new IntersectionObserver(ens => {
          ens.forEach(en => {
            if (!en.isIntersecting) return;
            const el = en.target;
            el.style.opacity = '1';
            el.style.transform = 'none';
            [...el.children].forEach(c => { c.style.opacity = '1'; c.style.transform = 'none'; });
            const dot = el.querySelector('[data-mdot]');
            if (dot) { dot.style.background = '#FFD400'; dot.style.boxShadow = 'inset 0 0 0 1.5px rgba(20,20,20,.15)'; }
            this.mio2.unobserve(el);
          });
        }, { rootMargin: '0px 0px -8% 0px', threshold: 0.04 });
        revs.forEach(el => this.mio2.observe(el));
      }
      const pars2 = [...mob.querySelectorAll('[data-mpar2]')];
      this.mextra = () => {
        if (!this.mq.matches) return;
        const pb = bar && bar.querySelector('[data-mprog]');
        if (pb) {
          const prog = Math.min(1, Math.max(0, scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight)));
          pb.style.width = (prog * 100).toFixed(2) + '%';
        }
        if (soft2) return;
        pars2.forEach(el => {
          const r = el.getBoundingClientRect();
          const k = parseFloat(el.getAttribute('data-mpar2')) || 0.05;
          const off = (r.top + r.height / 2 - innerHeight / 2) * -k;
          const flip = (el.getAttribute('style') || '').indexOf('scaleY(-1)') >= 0 ? ' scaleY(-1)' : '';
          el.style.transform = 'translate3d(0,' + off.toFixed(1) + 'px,0)' + flip;
        });
      };
      this.mextra();
      addEventListener('scroll', this.mextra, { passive: true });

      this.mtint();
      addEventListener('scroll', this.mtint, { passive: true });
    };
    this.mobileMotion();
    this.onMq = () => this.fit();
    if (this.mq.addEventListener) this.mq.addEventListener('change', this.onMq);

    addEventListener('resize', this.fit);
    const wrap = document.querySelector('[data-fit]');
    if (wrap && window.ResizeObserver) {
      this.ro = new ResizeObserver(() => this.fit());
      this.ro.observe(wrap);
    }
  }

  componentWillUnmount() {
    if (this.mtint) removeEventListener('scroll', this.mtint);
    if (this.mio) this.mio.disconnect();
    if (this.mio2) this.mio2.disconnect();
    if (this.mextra) removeEventListener('scroll', this.mextra);
    if (this.mq && this.mq.removeEventListener) this.mq.removeEventListener('change', this.onMq);
    removeEventListener('resize', this.fit);
    removeEventListener('scroll', this.tint);
    if (this.io) this.io.disconnect();
    if (this.ro) this.ro.disconnect();
  }

  renderVals() {
    const U = 'https://www.roarsinc.com/wp-content/uploads/';
    return {
      meta: [
        { y: '0px', k: 'Industry', v: 'Logistics & Cold Chain' },
        { y: '60px', k: 'Services', v: 'Product Strategy, UX, Mobile, Web' },
        { y: '120px', k: 'Client', v: 'Snowman Logistics' },
        { y: '180px', k: 'Year', v: '2026' }
      ],
      shots: [
        { x: '0px', y: '0px', w: '1358px', h: '737px', bg: 'url("' + U + '2025/07/parqly-parking-mobile-app.jpg")' },
        { x: '0px', y: '777px', w: '662px', h: '700px', bg: 'url("' + U + '2025/07/concierge-ai-home.jpg")' },
        { x: '696px', y: '777px', w: '662px', h: '700px', bg: 'url("' + U + '2025/07/ai-fitness-home.jpg")' },
        { x: '0px', y: '1517px', w: '1358px', h: '754px', bg: 'url("' + U + '2024/11/roars-office-upscale-768x768.jpg")' }
      ]
    };
  }
}
```