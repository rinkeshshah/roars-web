var e={"roar-wave":`precision highp float;
uniform vec2 R; uniform float T; uniform vec2 M; uniform float MA; uniform vec3 C1; uniform vec3 C2; uniform vec3 C3; uniform vec3 BG;
float h1(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
vec2 h2(vec2 p){return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);}
float ns(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h1(i),h1(i+vec2(1,0)),f.x),mix(h1(i+vec2(0,1)),h1(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*ns(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return v;}
vec3 pal(float t,vec3 a,vec3 b,vec3 c,vec3 d){return a+b*cos(6.28318*(c*t+d));}
float b2(vec2 a){a=mod(floor(a),8.);return fract(dot(a,vec2(.5,a.y*.75)));}
float b4(vec2 a){return b2(.5*a)*.25+b2(a);}
float b8(vec2 a){return b4(.5*a)*.25+b2(a);}
void main(){
 vec2 uv=gl_FragCoord.xy/R; float ar=R.x/R.y; vec2 p=vec2(uv.x*ar,uv.y); vec2 m=vec2(M.x*ar,M.y);
 float md=length(p-m); vec3 col=vec3(0.);

  float px=3.; vec2 g=floor(gl_FragCoord.xy/px)*px/R; vec2 gp=vec2(g.x*ar,g.y); float th=b8(gl_FragCoord.xy/px)+.001;
  vec2 S=vec2(ar*.79,.47); vec2 S2=mix(vec2(ar*.6,.2+.08*sin(T*.4)),m,MA);
  float d=length(gp-S)+.035*fbm(gp*3.+T*.2); float d2=length(gp-S2);
  float amp=.55+.45*sin(d*4.5-T*1.8);
  float w1=sin(d*44.-T*4.)*amp*exp(-d*1.3); float w2=sin(d2*44.-T*4.4)*exp(-d2*2.4)*(.35+.65*MA);
  float f=smoothstep(-.1,.85,w1+w2)*.95; f=max(f,step(d,.075)); f=max(f,.5*step(d,.11)*step(.5,sin(d*140.)));
  f*=smoothstep(.4,.6,uv.x);
  col=mix(BG,C2,step(th,f));
 col+=(h1(gl_FragCoord.xy+fract(T)*97.)-.5)*.045;
 gl_FragColor=vec4(max(col,0.),1.);
}`,"carbon-heat":`precision highp float;
uniform vec2 R; uniform float T; uniform vec2 M; uniform float MA; uniform vec3 C1; uniform vec3 C2; uniform vec3 C3; uniform vec3 BG;
float h1(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
vec2 h2(vec2 p){return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);}
float ns(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h1(i),h1(i+vec2(1,0)),f.x),mix(h1(i+vec2(0,1)),h1(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*ns(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return v;}
vec3 pal(float t,vec3 a,vec3 b,vec3 c,vec3 d){return a+b*cos(6.28318*(c*t+d));}
float b2(vec2 a){a=mod(floor(a),8.);return fract(dot(a,vec2(.5,a.y*.75)));}
float b4(vec2 a){return b2(.5*a)*.25+b2(a);}
float b8(vec2 a){return b4(.5*a)*.25+b2(a);}
void main(){
 vec2 uv=gl_FragCoord.xy/R; float ar=R.x/R.y; vec2 p=vec2(uv.x*ar,uv.y); vec2 m=vec2(M.x*ar,M.y);
 float md=length(p-m); vec3 col=vec3(0.);

  float px=4.; vec2 g=floor(gl_FragCoord.xy/px)*px/R; vec2 gp=vec2(g.x*ar,g.y);
  float f=fbm(gp*2.2+vec2(T*.08,-T*.05)); f+=.35*fbm(gp*5.-T*.12);
  f+=.9*exp(-pow(length(gp-vec2(ar*.74,.42))/.42,2.));
  f+=MA*1.1*exp(-pow(length(gp-m)/.16,2.));
  f=clamp((f-.55)*1.1,0.,1.);
  float th=b8(gl_FragCoord.xy/px);
  vec3 cool=C1, hot=C2, white=C3;
  float l1=step(th,f), l2=step(th,f-.45), l3=step(th,f-.8);
  col=cool*l1; col=mix(col,hot,l2); col=mix(col,white,l3);
 float lx=smoothstep(.02,.46,uv.x); col*=mix(.16,1.,lx);
 col*=mix(.55,1.,smoothstep(1.,.72,uv.y)*.5+.5*lx);
 col*=1.-.35*pow(length(uv-vec2(.62,.45)),2.);
 col+=(h1(gl_FragCoord.xy+fract(T)*97.)-.5)*.045;
 gl_FragColor=vec4(max(col,0.),1.);
}`},t={"roar-wave":{shader:`roar-wave`,colors:{C1:[1,.831,0],C2:[.043,.043,.043],C3:[.043,.043,.043],BG:[1,.831,0]},cssBackground:`#FFD400`,stillTime:6,timeOffset:9*3.7},"carbon-heat":{shader:`carbon-heat`,colors:{C1:[.26,.25,.22],C2:[1,.831,0],C3:[1,.98,.86],BG:[1,.831,0]},cssBackground:`#070706`,stillTime:9,timeOffset:7.4}};function n(n,r={}){let i=t[r.variant??`roar-wave`];if(!i)throw Error(`Unknown dither variant `+r.variant);let a=r.pixelScale??1.5,o=Math.min(1,Math.max(0,r.inkStrength??1)),s=r.speed??1,c=r.interactive??!0,l=r.static??matchMedia(`(prefers-reduced-motion: reduce)`).matches,u=r.hoverTarget??n.parentElement??n;n.style.imageRendering=`pixelated`,n.style.background=i.cssBackground;let d=n.getContext(`webgl`,{antialias:!1,alpha:!1,preserveDrawingBuffer:!1});if(!d)return{live:!1,setSpeed(){},destroy(){}};let f,p,m=()=>{let t=(e,t)=>{let n=d.createShader(e);return d.shaderSource(n,t),d.compileShader(n),d.getShaderParameter(n,d.COMPILE_STATUS)||console.error(d.getShaderInfoLog(n)),n};f=d.createProgram(),d.attachShader(f,t(d.VERTEX_SHADER,`attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}`)),d.attachShader(f,t(d.FRAGMENT_SHADER,e[i.shader])),d.linkProgram(f),d.useProgram(f);let n=d.createBuffer();d.bindBuffer(d.ARRAY_BUFFER,n),d.bufferData(d.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),d.STATIC_DRAW);let r=d.getAttribLocation(f,`a`);d.enableVertexAttribArray(r),d.vertexAttribPointer(r,2,d.FLOAT,!1,0,0),p=e=>d.getUniformLocation(f,e);let a=e=>o>=1?e:[i.colors.BG[0]+(e[0]-i.colors.BG[0])*o,i.colors.BG[1]+(e[1]-i.colors.BG[1])*o,i.colors.BG[2]+(e[2]-i.colors.BG[2])*o];for(let e of[`C1`,`C2`,`C3`])d.uniform3fv(p(e),a(i.colors[e]));d.uniform3fv(p(`BG`),i.colors.BG)};m();let h=()=>{let e=n.getBoundingClientRect(),t=Math.max(1,Math.round(e.width/a)),r=Math.max(1,Math.round(e.height/a));(n.width!==t||n.height!==r)&&(n.width=t,n.height=r),d.viewport(0,0,t,r)},g={m:[.72,.45],mt:[.72,.45],ma:0,mat:0,t:0,last:performance.now(),vis:!0,raf:0},_=e=>{d.uniform2f(p(`R`),n.width,n.height),d.uniform1f(p(`T`),e),d.uniform2f(p(`M`),g.m[0],g.m[1]),d.uniform1f(p(`MA`),g.ma),d.drawArrays(d.TRIANGLES,0,3)},v=e=>{let t=u.getBoundingClientRect();g.mt=[(e.clientX-t.left)/t.width,1-(e.clientY-t.top)/t.height],g.mat=1},y=()=>{g.mat=0};c&&!l&&(u.addEventListener(`pointermove`,v),u.addEventListener(`pointerleave`,y));let b=e=>{let t=Math.min(.05,(e-g.last)/1e3);g.last=e,g.vis&&(g.t+=t*s,g.m[0]+=(g.mt[0]-g.m[0])*.08,g.m[1]+=(g.mt[1]-g.m[1])*.08,g.ma+=(g.mat-g.ma)*.05,_(g.t+i.timeOffset)),g.raf=requestAnimationFrame(b)},x=new ResizeObserver(()=>{h(),l&&_(i.stillTime)});x.observe(n);let S=new IntersectionObserver(e=>e.forEach(e=>g.vis=e.isIntersecting),{rootMargin:`100px`});S.observe(n);let C=()=>{g.last=performance.now()};document.addEventListener(`visibilitychange`,C);let w=e=>{e.preventDefault(),cancelAnimationFrame(g.raf)},T=()=>{m(),h(),l?_(i.stillTime):g.raf=requestAnimationFrame(b)};return n.addEventListener(`webglcontextlost`,w),n.addEventListener(`webglcontextrestored`,T),h(),_(i.stillTime),l||(g.raf=requestAnimationFrame(b)),{live:!0,setSpeed(e){s=e},destroy(){cancelAnimationFrame(g.raf),x.disconnect(),S.disconnect(),document.removeEventListener(`visibilitychange`,C),n.removeEventListener(`webglcontextlost`,w),n.removeEventListener(`webglcontextrestored`,T),u.removeEventListener(`pointermove`,v),u.removeEventListener(`pointerleave`,y),d.getExtension(`WEBGL_lose_context`)?.loseContext()}}}function r(){let e=document.querySelectorAll(`canvas[data-dither-hero]`);if(!e.length)return null;e.length>1&&console.warn(`dither-hero: ${e.length} on this page, mounting the first. One context per document.`);let t=e[0],r=t.dataset.ditherHero||`roar-wave`,i=Number(t.dataset.pixelScale),a=Number(t.dataset.inkStrength),o=t.dataset.interactive===`false`,s=matchMedia(`(max-width: 1040px)`).matches;return n(t,{variant:r,pixelScale:Number.isFinite(i)&&i>0?i:void 0,inkStrength:Number.isFinite(a)?a:void 0,interactive:!o&&void 0,static:s||void 0})}r();