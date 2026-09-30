function e(e,t,n){let r=matchMedia(`(prefers-reduced-motion: reduce)`).matches,i=document.createElement(`canvas`);i.setAttribute(`aria-hidden`,`true`),Object.assign(i.style,{position:`absolute`,inset:`0`,width:`100%`,height:`100%`,display:`block`,pointerEvents:`none`,zIndex:`0`}),e.prepend(i);let a={mx:.5,my:.5,tx:.5,ty:.5,a:0,at:0},o=t=>{let n=e.getBoundingClientRect();a.tx=(t.clientX-n.left)/n.width,a.ty=1-(t.clientY-n.top)/n.height,a.at=1},s=()=>{a.at=0},c=()=>{setTimeout(()=>{a.at=0},600)},l=!0,u=new IntersectionObserver(e=>e.forEach(e=>l=e.isIntersecting),{rootMargin:`100px`});u.observe(e);let d=i,f=null,p=null,m=null,h=null,g=null,_=0,v=3,y=performance.now(),b=()=>{let r=e.getBoundingClientRect(),i=t.getBoundingClientRect(),a=n.getBoundingClientRect();return{yCss:(i.bottom+a.top)/2-r.top,xCss:i.left+i.width/2-r.left,w:r.width,h:r.height}},x=()=>{if(p=d.getContext(`webgl`,{antialias:!1}),!p)return!1;let e=(e,t)=>{let n=p.createShader(e);return p.shaderSource(n,t),p.compileShader(n),p.getShaderParameter(n,p.COMPILE_STATUS)||console.error(p.getShaderInfoLog(n)),n},t=p.createProgram();p.attachShader(t,e(p.VERTEX_SHADER,`attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}`)),p.attachShader(t,e(p.FRAGMENT_SHADER,`precision highp float;
uniform vec2 R; uniform float T; uniform vec2 M; uniform float MA; uniform float Y0; uniform float WX; uniform float K; uniform float SIG;
float h1(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float b2(vec2 a){a=floor(a);return fract(dot(a,vec2(.5,a.y*.75)));}
float b4(vec2 a){return b2(.5*a)*.25+b2(a);}
float b8(vec2 a){return b4(.5*a)*.25+b2(a);}
void main(){
 float ar=R.x/R.y; float px=3.;
 vec2 g=floor(gl_FragCoord.xy/px)*px/R; float th=b8(gl_FragCoord.xy/px)+.001;
 vec2 u0=gl_FragCoord.xy/R; vec2 p0=vec2(u0.x*ar,u0.y);
 vec3 bg=vec3(.036,.035,.032);
 bg+=vec3(.05,.044,.022)*exp(-pow(length(p0-vec2(ar*.1,1.05))/.75,2.));
 bg+=vec3(.038,.032,.014)*exp(-pow(length(p0-vec2(ar*(WX+.02),.38))/.55,2.));
 bg*=1.-.28*smoothstep(.45,1.1,length((u0-vec2(.5,.55))*vec2(1.,1.3)));
 bg+=vec3(.06,.052,.024)*exp(-pow(length(p0-vec2(ar*.08,1.1))/.9,2.));
 bg+=vec3(.07,.058,.018)*exp(-pow((u0.y-Y0)/(.16*K),2.))*exp(-pow((u0.x-WX)/.34,2.));
 bg+=vec3(.03,.026,.012)*smoothstep(.6,1.,u0.x)*smoothstep(.3,1.,u0.y);
 bg+=(h1(gl_FragCoord.xy)-.5)*.006;
 float x=g.x; float env=exp(-pow((x-WX)/.2,2.));
 float y=Y0+K*(.018*env*sin(x*60.-T*2.2)*(.6+.4*sin(T*.7))+.006*sin(x*23.+T*.9));
 y+=K*MA*.05*exp(-pow((x-M.x)/.05,2.))*sin(x*140.-T*6.);
 float dd=abs(g.y-y);
 float f=.95*smoothstep(.006*K,0.,dd)*(.35+.65*env+MA*exp(-pow((x-M.x)/.08,2.)));
 f=max(f,.3*exp(-dd*55./K)*(.4+.6*env));
 f*=smoothstep(0.,.12,x)*smoothstep(1.,.88,x);
 f*=SIG;
 vec3 col=bg;
 col=mix(col,vec3(.19,.185,.16),step(th,f));
 col=mix(col,vec3(1.,.831,0.),step(th,f-.5));
 gl_FragColor=vec4(col,1.);
}`)),p.linkProgram(t),p.useProgram(t);let n=p.createBuffer();p.bindBuffer(p.ARRAY_BUFFER,n),p.bufferData(p.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),p.STATIC_DRAW);let r=p.getAttribLocation(t,`a`);p.enableVertexAttribArray(r),p.vertexAttribPointer(r,2,p.FLOAT,!1,0,0);let i=e=>p.getUniformLocation(t,e);return m={R:i(`R`),T:i(`T`),M:i(`M`),MA:i(`MA`),Y0:i(`Y0`),WX:i(`WX`),K:i(`K`),SIG:i(`SIG`)},!0},S=()=>{g=b();let e=g.w>=768?`gl`:`2d`;if(e!==f){let t=d.cloneNode();if(d.replaceWith(t),d=t,f=e,p=null,h=null,f===`gl`&&!x()){f=`2d`;let e=d.cloneNode();d.replaceWith(e),d=e}f===`2d`&&(h=d.getContext(`2d`))}if(f===`gl`&&p)d.width=Math.round(g.w*2/3),d.height=Math.round(g.h*2/3),p.viewport(0,0,d.width,d.height);else{let e=Math.min(2,window.devicePixelRatio||1);d.width=Math.round(g.w*e),d.height=Math.round(g.h*e)}T(performance.now(),!0)},C=()=>{if(!p||!m||!g)return;let e=d.width,t=d.height;p.uniform2f(m.R,e,t),p.uniform1f(m.T,v),p.uniform2f(m.M,a.mx,a.my),p.uniform1f(m.MA,a.a),p.uniform1f(m.Y0,1-g.yCss/g.h),p.uniform1f(m.WX,g.xCss/g.w),p.uniform1f(m.K,720/g.h),p.uniform1f(m.SIG,0),p.drawArrays(p.TRIANGLES,0,3)},w=()=>{if(!h||!g)return;let e=d.width/g.w,t=g.w,n=g.h,r=g.yCss;h.setTransform(e,0,0,e,0,0),h.fillStyle=`#0A0A09`,h.fillRect(0,0,t,n);let i=h.createRadialGradient(0,0,0,0,0,t*1.3);i.addColorStop(0,`rgba(92,82,36,.42)`),i.addColorStop(1,`rgba(92,82,36,0)`),h.fillStyle=i,h.fillRect(0,0,t,n),h.save(),h.translate(t*.5,r),h.scale(1,.35),i=h.createRadialGradient(0,0,0,0,0,t*.75),i.addColorStop(0,`rgba(120,98,28,.38)`),i.addColorStop(1,`rgba(120,98,28,0)`),h.fillStyle=i,h.fillRect(-t,-t*2,t*2,t*4),h.restore(),i=h.createLinearGradient(0,0,0,n),i.addColorStop(.55,`rgba(0,0,0,0)`),i.addColorStop(1,`rgba(0,0,0,.35)`),h.fillStyle=i,h.fillRect(0,0,t,n)};function T(e,t){let n=Math.min(.05,(e-y)/1e3);y=e,(l&&!r||t)&&(r||(v+=t?0:n),a.mx+=(a.tx-a.mx)*.08,a.my+=(a.ty-a.my)*.08,a.a+=(a.at-a.a)*(f===`gl`?.05:.06),f===`gl`?C():h&&w()),t||(_=requestAnimationFrame(T))}let E=new ResizeObserver(()=>S());return E.observe(e),document.fonts?.ready&&document.fonts.ready.then(()=>S()),S(),{destroy(){cancelAnimationFrame(_),E.disconnect(),u.disconnect(),e.removeEventListener(`pointermove`,o),e.removeEventListener(`pointerdown`,o),e.removeEventListener(`pointerleave`,s),e.removeEventListener(`pointerup`,c),d.remove()}}}function t(){let t=document.querySelector(`[data-footer-signal]`);if(!t)return null;let n=t.querySelector(`[data-footer-wordmark]`),r=t.querySelector(`[data-footer-legal]`);return!n||!r?(console.warn(`footer-signal: no wordmark or legal row to place the line against.`),null):e(t,n,r)}t();