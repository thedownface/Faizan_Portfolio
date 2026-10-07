// Scroll-scrubbed tunnel scene, ported from "Faizan Tunnel Scroll.dc.html".
// Framework-agnostic: works in Vite/React, and in Next.js from a 'use client' component.
import gsap from 'gsap';

const R='#E3392A',K='#EDE7DA',I='#17161A',NS='http://www.w3.org/2000/svg';
function mk(tag,a,p){const e=document.createElementNS(NS,tag);if(a)for(const k in a)e.setAttribute(k,a[k]);if(p)p.appendChild(e);return e;}
function rng(s){return function(){s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
const POSE={
 CARRY:{torso:4,head:0,uaF:-18,laF:-100,uaB:12,laB:-24,thF:-4,shF:4,thB:6,shB:2},
 WIND:{torso:-16,head:-6,uaF:140,laF:18,uaB:132,laB:24,thF:-20,shF:14,thB:16,shB:10},
 HIT:{torso:20,head:8,uaF:-92,laF:-6,uaB:-84,laB:-10,thF:-28,shF:6,thB:24,shB:4},
 FOLLOW:{torso:26,head:10,uaF:-64,laF:-4,uaB:-58,laB:-8,thF:-30,shF:10,thB:26,shB:6},
 DOWN:{torso:34,head:14,uaF:-50,laF:-8,uaB:-46,laB:-10,thF:-30,shF:20,thB:28,shB:8},
 POINT:{torso:-4,head:-10,uaF:-150,laF:-10,uaB:20,laB:-30,thF:-6,shF:4,thB:8,shB:2},
 RUB:{torso:8,head:6,uaF:-55,laF:-70,uaB:-50,laB:-75,thF:-4,shF:4,thB:6,shB:2},
 CLIMB:{torso:0,head:-4,uaF:172,laF:-8,uaB:168,laB:-8,thF:-46,shF:58,thB:-30,shB:50},
 LOOK:{torso:-2,head:-18,uaF:-18,laF:-100,uaB:12,laB:-24,thF:-4,shF:4,thB:6,shB:2},
 LEAN:{torso:62,head:-20,uaF:-62,laF:0,uaB:-58,laB:0,thF:-8,shF:6,thB:10,shB:0},
 HAND:{rot:180,torso:0,head:0,uaF:180,laF:0,uaB:180,laB:0,thF:-10,shF:0,thB:10,shB:0},
 PLAN:{rot:270,torso:0,head:-14,uaF:90,laF:0,uaB:90,laB:0,thF:0,shF:0,thB:0,shB:0}
};
export const DUR=61.5;
// Scroll position 0 opens on this frame: the carved "FAIZAN KHAN" identity shot.
export const START=14.4;

export class TunnelScene {
  // wrap: fixed viewport element; stage: element the SVG layers are built into.
  // ui: optional per-frame callback receiving (scroll progress 0-1, time, duration).
  constructor(wrap,stage,ui){this.wrap=wrap;this.stage=stage;this.ui=ui;this.cur=0;this.target=0;this.V=null;}

  start(t=0){
    this.build(innerWidth<innerHeight,t);this.cur=this.target=t;
    this.ro=new ResizeObserver(()=>{const nv=innerWidth<innerHeight;if(nv!==this.V)this.build(nv,this.cur);else this.fit();});this.ro.observe(this.wrap);
    this.tick=()=>this.onTick();gsap.ticker.add(this.tick);
  }
  setProgress(p){this.target=START+Math.min(1,Math.max(0,p))*(DUR-START);}
  dispose(){if(this.tl)this.tl.kill();if(this.tick)gsap.ticker.remove(this.tick);if(this.ro)this.ro.disconnect();this.stage.innerHTML='';}

  fit(){const w=this.wrap,s=this.stage;if(!w||!s)return;const W=this.W,H=this.H;const sc=Math.min(w.clientWidth/W,w.clientHeight/H);
    s.style.width=W+'px';s.style.height=H+'px';s.style.transform=`translate(${(w.clientWidth-W*sc)/2}px,${(w.clientHeight-H*sc)/2}px) scale(${sc})`;}

  onTick(){if(!this.tl)return;const dlt=this.target-this.cur;this.cur=Math.abs(dlt)<.002?this.target:this.cur+dlt*.09;
    if(Math.abs(this.tl.time()-this.cur)>.0005)this.tl.time(this.cur);
    if(this.ui)this.ui((this.cur-START)/(DUR-START),this.cur,DUR);
    const now=performance.now();if(!this.lb||now-this.lb>83){this.lb=now;this.bf=(this.bf+1)%3;const id='url(#boil'+this.bf+')';for(const g of this.boilEls)g.setAttribute('filter',id);}}

  build(V,startT){
    if(this.tl)this.tl.kill();
    const stage=this.stage;stage.innerHTML='';
    const W=V?1080:1920,H=V?1920:1080;this.W=W;this.H=H;this.V=V;this.fit();
    const P=(h,v)=>V?v:h;
    const rnd=rng(7),rr=(a,b)=>a+(b-a)*rnd();
    const svg=mk('svg',{viewBox:`0 0 ${W} ${H}`,width:W,height:H,style:'position:absolute;inset:0;display:block'},stage);
    const hud=mk('svg',{viewBox:`0 0 ${W} ${H}`,width:W,height:H,style:'position:absolute;inset:0;display:block;pointer-events:none'},stage);
    const grain=mk('svg',{viewBox:`0 0 ${W} ${H}`,width:W,height:H,style:'position:absolute;inset:0;display:block;pointer-events:none;will-change:transform'},stage);
    const defs=mk('defs',{},svg);
    [3,11,23].forEach((s,i)=>{const f=mk('filter',{id:'boil'+i,x:'-15%',y:'-15%',width:'130%',height:'130%'},defs);mk('feTurbulence',{type:'fractalNoise',baseFrequency:'0.04',numOctaves:'2',seed:s},f);mk('feDisplacementMap',{in:'SourceGraphic',scale:'4.5',xChannelSelector:'R',yChannelSelector:'G'},f);});
    const gd=mk('defs',{},grain);const gf=mk('filter',{id:'grainF',x:0,y:0,width:'100%',height:'100%'},gd);
    mk('feTurbulence',{type:'fractalNoise',baseFrequency:'0.9',numOctaves:'2',stitchTiles:'stitch'},gf);
    mk('feColorMatrix',{type:'matrix',values:'0 0 0 0 0.09  0 0 0 0 0.086  0 0 0 0 0.1  2.2 0 0 0 -1.05'},gf);
    mk('rect',{width:W,height:H,filter:'url(#grainF)',opacity:'.35'},grain);
    this.boilEls=[];this.bf=0;
    const world=mk('g',{},svg);const fgL=mk('g',{},svg);
    mk('rect',{x:-4000,y:-3000,width:20000,height:9000,fill:R},world);

    const tl=gsap.timeline({paused:true,onUpdate:()=>this.render()});this.tl=tl;
    const cam={x:P(960,800),y:540,s:P(1,.8)},sh={x:0,y:0};
    const rig={x:-160,y:700,rot:0,sx:1,sy:1,walk:0,wp:0,climb:0,cp:0,pin:0,px:0,py:0,pick:1,...POSE.CARRY};
    const dig1={x:0},shaft={y:700},cav={x:7000},flow={t:0};
    this.cam=cam;this.sh=sh;this.rig=rig;

    // ---------- geometry helpers
    const roughPoly=(pts,j=4,step=38)=>{const o=[];for(let i=0;i<pts.length;i++){const a=pts[i],b=pts[(i+1)%pts.length];const n=Math.max(1,Math.round(Math.hypot(b[0]-a[0],b[1]-a[1])/step));for(let s=0;s<n;s++){const t=s/n;o.push([a[0]+(b[0]-a[0])*t+rr(-j,j),a[1]+(b[1]-a[1])*t+rr(-j,j)]);}}return 'M'+o.map(p=>p[0].toFixed(1)+' '+p[1].toFixed(1)).join('L')+'Z';};
    const rect=(x,y,w,h,j,st)=>roughPoly([[x,y],[x+w,y],[x+w,y+h],[x,y+h]],j,st);
    const blob=(cx,cy,r,n=7)=>{const p=[];for(let i=0;i<n;i++){const a=i/n*Math.PI*2+rr(-.3,.3);const q=r*rr(.6,1.1);p.push((cx+Math.cos(a)*q).toFixed(1)+' '+(cy+Math.sin(a)*q).toFixed(1));}return 'M'+p.join('L')+'Z';};
    const speckPath=(x0,x1,y0,y1,n,grad=1)=>{let d='';let c=0,g=0;while(c<n&&g<n*8){g++;const x=rr(x0,x1),y=rr(y0,y1);const f=(y-y0)/(y1-y0);if(rnd()>Math.pow(f,grad)*0.85+0.15)continue;const s=rr(1.6,4.2)*(rnd()<.08?1.9:1);d+=blob(x,y,s,4);c++;}return d;};
    const w2s=(x,y,c)=>[W/2+(x-c.x)*c.s,H/2+(y-c.y)*c.s];

    // ---------- speckles
    const spk=mk('g',{},world);
    const openSp=[];for(let i=0;i<4;i++)openSp.push(mk('path',{d:speckPath(-400,2600,720,1900,800,1.6),fill:I},spk));
    [[-600,2600,-700,380,60,1],[2600,5200,880,1900,800,1.2],[3300,6000,800,2600,700,1],[3900,7300,2100,3800,900,1.1],[6900,11400,2860,3800,1000,1.2],[6900,11400,1300,2300,260,1]].forEach(a=>mk('path',{d:speckPath(...a),fill:I},spk));

    // ---------- strata textures
    const strat=mk('g',{fill:K},world);
    [800,1450,2050].forEach(y=>mk('path',{d:rect(3400,y-5,2500,10,3,60)},strat));
    for(let i=0;i<70;i++)mk('path',{d:blob(rr(4720,5700),rr(840,1420),rr(8,26),rnd()<.5?5:6)},strat);
    for(let r=0;r<8;r++){const y=1480+r*68;for(let c=-1;c<8;c++){const x=4720+c*134+(r%2?67:0);if(x<4700||x+120>5760)continue;mk('path',{d:rect(x,y,120,52,2,40)},strat);}}
    for(let i=0;i<3;i++){const x=4780+i*240;mk('path',{d:rect(x-20,2090,160,28,2,40)},strat);mk('path',{d:rect(x,2118,120,300,3,40)},strat);mk('path',{d:rect(x-20,2418,160,28,2,40)},strat);}

    // ---------- carved: tunnel 1 + pipeline
    const clip1=mk('clipPath',{id:'c1'},defs);const c1r=mk('rect',{x:-2000,y:300,width:0,height:700},clip1);
    const t1=mk('g',{'clip-path':'url(#c1)'},world);
    mk('path',{d:rect(-1700,400,6350,300,5,42),fill:K},t1);
    mk('path',{d:rect(1760,772,2560,56,3,40),fill:K},t1);
    const pebG=mk('g',{opacity:0},t1);const pebs=[];for(let i=0;i<46;i++)pebs.push(mk('path',{d:blob(0,0,rr(7,11),6),fill:I},pebG));
    const stX=[1900,2460,3020,3580,4140],stN=['SOURCE','DEBEZIUM','KAFKA','SPARK','DELTA LAKE'];const stations=[];
    stX.forEach((x,i)=>{const g=mk('g',{},t1);mk('path',{d:rect(x-155,728,310,144,4,36),fill:K},g);const tx=mk('text',{x:x,y:815,'text-anchor':'middle','font-family':'DM Mono','font-weight':500,'font-size':42,fill:I},g);tx.textContent=stN[i];stations.push(g);
      if(i<4){const mx=x+280;mk('path',{d:`M${mx-12} 786L${mx+10} 800L${mx-12} 814`,stroke:I,'stroke-width':6,fill:'none'},g);}});
    const face1=mk('path',{d:roughPoly([[-2,398],[46,400],[30,440],[62,488],[34,540],[52,600],[18,650],[24,702],[-2,702]],3,30),fill:K,opacity:0},world);
    const crack=mk('path',{d:'M-20 552 L60 548 L110 556 L170 546 L240 553 L300 549 L380 555 L460 550 L520 552',fill:'none',stroke:K,'stroke-width':4,'stroke-dasharray':600,'stroke-dashoffset':600},world);

    // shaft
    const clip2=mk('clipPath',{id:'c2'},defs);const c2r=mk('rect',{x:4380,y:690,width:340,height:0},clip2);
    const shG=mk('g',{'clip-path':'url(#c2)'},world);
    mk('path',{d:rect(4440,690,220,1920,5,40),fill:K},shG);
    mk('path',{d:'M4505 700V2850M4595 700V2850',stroke:I,'stroke-width':4},shG);
    let rungs='';for(let y=740;y<2850;y+=46)rungs+=`M4505 ${y}L4595 ${y+rr(-4,4)}`;mk('path',{d:rungs,stroke:I,'stroke-width':4},shG);

    // agents
    const synRays=mk('g',{transform:'translate(6700,2705)'},world);const synRaysIn=mk('g',{},synRays);
    for(let i=0;i<14;i++){const a=i/14*Math.PI*2,b=a+0.13,L=i%2?380:520;mk('path',{d:`M0 0L${Math.cos(a)*L} ${Math.sin(a)*L}L${Math.cos(b)*L} ${Math.sin(b)*L}Z`,fill:K},synRaysIn);}
    const AG=[[5700,2290],[5700,2450],[5700,3010],[5700,3170]];
    const tunA=[],tunB=[],agG=[];
    AG.forEach((a,i)=>{const s0=i<2?[4980+i*110,2610]:[4980+(i-2)*110,2835];const e0=i<2?[6300-i*110,2610]:[6300-(i-2)*110,2835];
      const pa=mk('path',{d:`M${s0[0]} ${s0[1]}L${(s0[0]+a[0])/2+rr(-20,20)} ${(s0[1]+a[1])/2+rr(-15,15)}L${a[0]-100} ${a[1]}`,stroke:K,'stroke-width':48,fill:'none','stroke-linejoin':'round'},world);
      const pb=mk('path',{d:`M${a[0]+100} ${a[1]}L${(e0[0]+a[0])/2+rr(-20,20)} ${(e0[1]+a[1])/2+rr(-15,15)}L${e0[0]} ${e0[1]}`,stroke:K,'stroke-width':48,fill:'none','stroke-linejoin':'round'},world);
      tunA.push(pa);tunB.push(pb);});
    mk('path',{d:rect(4250,2580,650,272,5,40),fill:K},world);
    mk('path',{d:rect(4880,2588,1560,264,5,40),fill:K},world);
    AG.forEach(a=>agG.push(mk('path',{d:rect(a[0]-125,a[1]-72,250,144,4,34),fill:K},world)));
    const syn=mk('path',{d:rect(6400,2560,600,292,5,40),fill:I},world);

    // cavern + tunnel 2
    const clip3=mk('clipPath',{id:'c3'},defs);const c3r=mk('rect',{x:6990,y:1900,width:0,height:1000},clip3);
    const cvG=mk('g',{'clip-path':'url(#c3)'},world);
    mk('path',{d:roughPoly([[7000,2060],[7300,2020],[7800,2034],[8300,2018],[8310,2550],[8960,2550],[8960,2852],[7000,2852]],6,40),fill:K},cvG);
    const NODES=[[7330,2520],[7460,2680],[7560,2470],[7650,2765],[7760,2590],[7860,2450],[7940,2720],[8040,2560],[8150,2780],[8210,2470],[7400,2790],[8080,2420]];
    const EDGES=[[0,1],[0,2],[1,3],[1,4],[2,4],[2,5],[3,6],[4,6],[4,7],[5,7],[5,11],[6,8],[7,8],[7,9],[9,11],[1,10],[3,10]];
    const edgeD=e=>{const a=NODES[e[0]],b=NODES[e[1]];const mx=(a[0]+b[0])/2+rr(-18,18),my=(a[1]+b[1])/2+rr(-18,18);return `M${a[0]} ${a[1]}L${mx} ${my}L${b[0]} ${b[1]}`;};
    const edges=EDGES.map(e=>{const d=edgeD(e);return [mk('path',{d,stroke:I,'stroke-width':6,fill:'none','stroke-dasharray':400,'stroke-dashoffset':400},cvG),d];});
    const litEdges=edges.map(e=>mk('path',{d:e[1],stroke:R,'stroke-width':6,fill:'none','stroke-dasharray':400,'stroke-dashoffset':400},cvG));
    const nodes=NODES.map(n=>{const r=rr(13,20);return mk('path',{d:`M${n[0]} ${n[1]-r*1.3}L${n[0]+r} ${n[1]}L${n[0]} ${n[1]+r*1.3}L${n[0]-r} ${n[1]}Z`,fill:I,stroke:I,'stroke-width':4},cvG);});
    const DX=[7380,7595,7810,8025,8240],DN=[0,2,5,11,9];const doors=[],dpaths=[];
    DX.forEach((x,i)=>{mk('path',{d:rect(x-65,2122,130,150,3,30),fill:R},cvG);const dr=mk('rect',{x:x-65,y:2122,width:130,height:150,fill:I},cvG);mk('rect',{x:x+38,y:2196,width:10,height:10,fill:K},cvG);doors.push(dr);
      const t=mk('text',{x:x,y:2106,'text-anchor':'middle','font-family':'DM Mono','font-weight':500,'font-size':42,fill:I},cvG);t.textContent='MCP';
      const n=NODES[DN[i]];dpaths.push(mk('path',{d:`M${x} 2272L${x+rr(-10,10)} 2340L${n[0]} ${n[1]}`,stroke:R,'stroke-width':8,fill:'none','stroke-dasharray':400,'stroke-dashoffset':400},cvG));});
    const bound=mk('path',{d:'M7030 2340L8290 2340',stroke:R,'stroke-width':9,'stroke-dasharray':'28 14',opacity:0},cvG);
    const boundL=mk('text',{x:7030,y:2392,'font-family':'DM Mono','font-weight':500,'font-size':38,fill:I,opacity:0},cvG);boundL.textContent='VALIDATION BOUNDARY';
    const face2=mk('path',{d:roughPoly([[-2,2548],[40,2550],[22,2610],[56,2680],[28,2760],[44,2852],[-2,2852]],3,30),fill:K,opacity:0},world);

    // treasure chamber
    mk('path',{d:rect(8950,2300,1350,552,6,40),fill:K},world);
    const lanternsG=mk('g',{},world);
    const labelsG=mk('g',{},world);
    const coverG=mk('g',{},world);const covers=[];const cx=[8930,9280,9620,9960,10320];
    for(let i=0;i<4;i++){const g=mk('g',{},coverG);mk('path',{d:roughPoly([[cx[i]-(i?24:0),2280],[cx[i+1]+24,2280],[cx[i+1]+24,2560],[cx[i+1]+24,2870],[cx[i]-(i?24:0),2870],[cx[i]-(i?24:0),2580]],4,40),fill:R},g);mk('path',{d:speckPath(cx[i]+20,cx[i+1]-20,2300,2850,40,1),fill:I},g);covers.push(g);}
    const TOOLS=['PYTHON','SQL','PYSPARK','DATABRICKS','KAFKA','AIRFLOW','LANGGRAPH','MCP','CLAUDE','FASTAPI','AZURE','POSTGRES'];
    const rocks=TOOLS.map((n,i)=>{const c=i%4,r=Math.floor(i/4);const x=8970+c*288,y=2852-(r+1)*100;const g=mk('g',{},world);const inn=mk('g',{},g);
      mk('path',{d:rect(x,y+3,280,96,5,30),fill:K},inn);const t=mk('text',{x:x+140,y:y+64,'text-anchor':'middle','font-family':'DM Mono','font-weight':500,'font-size':40,fill:I},inn);t.textContent=n;return {el:inn,x:x+140,y:y+50};});
    const chestRays=mk('g',{transform:'translate(9550,2700)'},world);const crIn=mk('g',{},chestRays);
    for(let i=0;i<18;i++){const a=i/18*Math.PI*2,b=a+0.12,L=i%2?1500:2400;mk('path',{d:`M0 0L${Math.cos(a)*L} ${Math.sin(a)*L}L${Math.cos(b)*L} ${Math.sin(b)*L}Z`,fill:K},crIn);}
    const flood=mk('circle',{cx:9550,cy:2700,r:0,fill:K},world);
    const chest=mk('g',{},world);
    mk('path',{d:rect(9430,2712,240,140,2,30),fill:I},chest);
    mk('rect',{x:9478,y:2712,width:14,height:140,fill:K},chest);mk('rect',{x:9608,y:2712,width:14,height:140,fill:K},chest);
    mk('rect',{x:9536,y:2736,width:28,height:34,fill:K},chest);mk('rect',{x:9546,y:2748,width:8,height:14,fill:I},chest);
    const lidO=mk('g',{transform:'translate(9670,2712)'},chest);const lid=mk('g',{},lidO);
    mk('path',{d:'M-240 0 L-240 -30 Q-120 -78 0 -30 L0 0Z',fill:I},lid);mk('path',{d:'M-198 -4 L-198 -44 L-184 -46 L-184 -4Z M-62 -4 L-62 -46 L-48 -44 L-48 -4Z',fill:K},lid);

    // pickaxe drawing
    const pickD=(p,sc)=>{const g=mk('g',{},p);mk('path',{d:'M-3.5 -14L3.5 -14L4 116L-4 116Z',fill:I},g);mk('path',{d:'M-46 122 Q-14 98 0 104 Q16 98 52 108 L50 115 Q14 110 0 117 Q-14 112 -44 129 Z',fill:I},g);return g;};
    const planted=mk('g',{opacity:0},world);pickD(planted);

    // ---------- digger rig
    const dg=mk('g',{},world);const hip=mk('g',{},dg);
    const limb=(p,w1,w2,L)=>mk('path',{d:`M${-w1} 0L${w1} 0L${w2} ${L}L${-w2} ${L}Z`,fill:I},p);
    const mkArm=(px)=>{const ua=mk('g',{},null);limb(ua,7,6,40);const la=mk('g',{},ua);limb(la,6,5,38);mk('circle',{cx:0,cy:37,r:6.5,fill:I},la);const hand=mk('g',{transform:'translate(0,36)'},la);return {ua,la,hand,px};};
    const mkLeg=(px)=>{const th=mk('g',{},hip);limb(th,10,8.5,52);const sn=mk('g',{},th);limb(sn,8.5,7,52);mk('path',{d:'M-9 46L22 47L24 56L-9 56Z',fill:I},sn);return {th,sn,px};};
    const legB=mkLeg(-4);
    const torso=mk('g',{},hip);
    const armB=mkArm(-2);torso.appendChild(armB.ua);
    const pickBack=mk('g',{transform:'translate(-6,-58) rotate(205)'},torso);pickD(pickBack);
    mk('path',{d:'M-18 10L18 10L20 -66L13 -80L-13 -80L-20 -66Z',fill:I},torso);
    mk('path',{d:'M-6 -80L6 -80L0 -62Z',fill:K},torso);mk('path',{d:'M-2 -76L2 -76L3 -60L0 -56L-3 -60Z',fill:I},torso);
    const head=mk('g',{},torso);mk('rect',{x:-5,y:-14,width:10,height:16,fill:I},head);mk('path',{d:blob(1,-30,16.5,9),fill:I},head);mk('path',{d:'M-14 -38 Q0 -52 16 -38 L17 -34 L-15 -34Z',fill:I},head);
    const legF=mkLeg(4);hip.insertBefore(legF.th,torso);
    const armF=mkArm(2);torso.appendChild(armF.ua);
    const pickHand=pickD(armF.hand);
    this.R={dg,hip,torso,head,armB,armF,legB,legF,pickBack,pickHand};
    const fx=mk('g',{},world);
    // fg dust
    let fd='';for(let i=0;i<700;i++){fd+=blob(rr(-2500,14500),rr(-800,4800),rr(2.5,5.5),5);}mk('path',{d:fd,fill:I,opacity:.85},fgL);

    // ---------- HUD
    const hudT=mk('g',{},hud);const endBg=mk('rect',{x:0,y:0,width:W,height:H,fill:R,opacity:0},hud);
    const panel=mk('rect',{x:0,y:0,width:W,height:H,fill:K,opacity:0},hud);const endG=mk('g',{},hud);
    const engulf=mk('circle',{cx:0,cy:0,r:0,fill:K},hud);
    const lbH=P(138,250);const lbT=mk('rect',{x:0,y:-lbH,width:W,height:lbH,fill:I},hud);const lbB=mk('rect',{x:0,y:H,width:W,height:lbH,fill:I},hud);

    // ---------- text
    const cv=document.createElement('canvas').getContext('2d');
    const meas=(s,sz,f,wt)=>{cv.font=`${wt||400} ${sz}px "${f}"`;return cv.measureText(s).width;};
    const text=(parent,lines,o)=>{const font=o.font||'Titan One',wt=o.wt||400;let size=o.size;
      if(o.maxW){const mw=Math.max(...lines.map(l=>meas(l,size,font,wt)));if(mw>o.maxW)size*=o.maxW/mw;}
      const g=mk('g',{},parent);if(o.boil!==false&&font==='Titan One')this.boilEls.push(g);
      const L=[];let wi=0;
      lines.forEach((ln,li)=>{const y=o.y+li*size*(o.lh||1.02);let x0=o.x;if(o.anchor==='middle')x0-=meas(ln,size,font,wt)/2;
        for(let i=0;i<ln.length;i++){const ch=ln[i];if(ch===' '){wi++;continue;}const b=meas(ln.slice(0,i),size,font,wt),w=meas(ch,size,font,wt);const cx=x0+b+w/2;
          const out=mk('g',{transform:`translate(${cx.toFixed(1)},${y.toFixed(1)})`},g);const inn=mk('g',{},out);const t=mk('text',{x:0,y:0,'text-anchor':'middle','font-family':font,'font-weight':wt,'font-size':size.toFixed(1),fill:o.fill||K},inn);t.textContent=ch;
          L.push({el:inn,cx,cy:y-size*.35,size,word:wi});}
        wi++;});
      L.forEach(l=>gsap.set(l.el,{opacity:0}));return L;};
    const popIn=(T,L,st=.045)=>L.forEach((l,i)=>{const t=T+i*st;gsap.set(l.el,{scaleX:0,scaleY:0,transformOrigin:'50% 90%'});
      tl.to(l.el,{keyframes:[{opacity:1,scaleX:1.45,scaleY:.45,duration:.05,ease:'none'},{scaleX:.76,scaleY:1.34,y:-l.size*.2,duration:.09,ease:'power2.out'},{scaleX:1.1,scaleY:.9,y:0,duration:.08,ease:'power2.in'},{scaleX:1,scaleY:1,rotation:rr(-2,2),duration:.45,ease:'elastic.out(1.2,.35)'}]},t);});
    const tumbleIn=(T,L,st=.07)=>L.forEach((l,i)=>{const t=T+i*st;gsap.set(l.el,{y:-H*.7-200,rotation:rr(-170,170),transformOrigin:'50% 90%'});
      tl.set(l.el,{opacity:1},t);tl.to(l.el,{y:0,duration:.7,ease:'bounce.out'},t);tl.to(l.el,{rotation:rr(-2,2),duration:.5,ease:'power3.out'},t);
      tl.to(l.el,{keyframes:[{scaleX:1.32,scaleY:.68,duration:.05},{scaleX:.9,scaleY:1.1,duration:.08},{scaleX:1,scaleY:1,duration:.22,ease:'elastic.out(1,.4)'}]},t+.25);});
    const burstIn=(T,L,px,py,st=.04)=>L.forEach((l,i)=>{const t=T+i*st;gsap.set(l.el,{x:px-l.cx,y:py-l.cy,scale:.25,rotation:rr(-300,300),transformOrigin:'50% 90%'});
      tl.set(l.el,{opacity:1},t);tl.to(l.el,{x:0,duration:.75,ease:'power2.out'},t);tl.to(l.el,{y:0,duration:.75,ease:'back.out(1.5)'},t);tl.to(l.el,{scale:1,duration:.4,ease:'power2.out'},t);tl.to(l.el,{rotation:rr(-2,2),duration:.75,ease:'power3.out'},t);});
    const carveIn=(T,L,st=.06)=>L.forEach((l,i)=>{const t=T+i*st;gsap.set(l.el,{scale:0,transformOrigin:'50% 70%'});
      tl.to(l.el,{keyframes:[{opacity:1,scale:1.55,rotation:rr(-12,12),duration:.05,ease:'none'},{scale:.9,duration:.07},{scale:1,rotation:rr(-2,2),duration:.35,ease:'elastic.out(1,.4)'}]},t);
      burst(t,l.cx,l.cy+l.size*.2,{n:3,kind:'speck',speed:260,spread:2,dir:0,dur:.6});});
    const typeOn=(T,L,st=.025)=>L.forEach((l,i)=>tl.set(l.el,{opacity:1},T+i*st));
    const dropOut=(T,L,st=.018)=>L.forEach((l,i)=>tl.to(l.el,{keyframes:[{y:-l.size*.3,duration:.12,ease:'power2.out'},{y:H*1.1,rotation:rr(-120,120),duration:.65,ease:'power2.in'}]},T+i*st));
    const popEl=(T,e,d=.45)=>{gsap.set(e,{scale:0,transformOrigin:'50% 50%'});tl.to(e,{scale:1,duration:d,ease:'back.out(2.6)'},T);};

    // ---------- fx
    const burst=(T,x,y,o)=>{const n=o.n||8,sp=o.speed||420,gr=o.g||2200,dm=o.dur||1;
      for(let i=0;i<n;i++){let e;const kind=o.kind||'chip';
        if(kind==='chip')e=mk('path',{d:blob(0,0,rr(7,o.size||20),5),fill:o.fill||R,opacity:0},fx);
        else if(kind==='speck')e=mk('path',{d:blob(0,0,rr(2.5,5),4),fill:I,opacity:0},fx);
        else e=mk('circle',{cx:0,cy:0,r:rr(10,24),fill:K,stroke:I,'stroke-width':3,opacity:0},fx);
        const ang=o.dir===0?rr(-Math.PI,0):(o.dir<0?rr(-Math.PI*.95,-Math.PI*.55):rr(-Math.PI*.45,-Math.PI*.05));
        const s=sp*rr(.45,1);const vx=Math.cos(ang)*s*(o.spread||1),vy=Math.sin(ang)*s;const d=rr(.55,1)*dm,rot=rr(-720,720);const p={t:0};
        const puff=kind==='puff';
        tl.to(p,{t:1,duration:d,ease:'none',onUpdate:()=>{if(p.t<=0||p.t>=1){e.setAttribute('opacity',0);return;}const tt=p.t*d;e.setAttribute('opacity',1);
          if(puff){const sc=.3+1.1*Math.pow(p.t,.5)*(1-p.t*.6);e.setAttribute('transform',`translate(${x+vx*.25*tt},${y-60*tt}) scale(${sc})`);}
          else e.setAttribute('transform',`translate(${x+vx*tt},${y+vy*tt+.5*gr*tt*tt}) rotate(${rot*p.t})`);}},T);}};
    const flash=(T,x,y,r=70)=>{let d='M';for(let i=0;i<20;i++){const a=i/20*Math.PI*2,q=i%2?r*.38:r*rr(.8,1.2);d+=(x+Math.cos(a)*q).toFixed(1)+' '+(y+Math.sin(a)*q).toFixed(1)+(i<19?'L':'Z');}
      const e=mk('path',{d,fill:K,stroke:I,'stroke-width':3,opacity:0},fx);tl.set(e,{opacity:1},T);tl.set(e,{opacity:0},T+.067);};
    const shake=(T,a=10)=>tl.to(sh,{keyframes:[{x:a,y:-a*.6,duration:.03},{x:-a*.8,y:a*.5,duration:.04},{x:a*.5,y:-a*.3,duration:.04},{x:-a*.2,y:a*.15,duration:.04},{x:0,y:0,duration:.05}]},T);
    const impact=(T,x,y,o={})=>{const k=o.k||1;flash(T,x,y,70*k);shake(T,(o.amp||10)*k);burst(T,x,y,{n:o.chips??7,dir:o.dir??-1,speed:480*k,size:22*k,dur:o.slow?2:1,g:o.slow?900:2200});burst(T,x,y,{n:10,kind:'speck',dir:o.dir??-1,speed:560,dur:o.slow?2:1,g:o.slow?900:2200});burst(T,x,y+30,{n:3,kind:'puff',dir:0,speed:120,dur:o.slow?1.6:.8});};
    const pose=(T,p,d=.25,ease='power2.inOut')=>tl.to(rig,{...p,duration:d,ease},T);
    let wpC=0;const walk=(T,to,d,ease='none')=>{const dist=Math.abs(to-(rig._lx??rig.x));rig._lx=to;wpC+=dist/240*Math.PI*2;tl.to(rig,{x:to,duration:d,ease},T);tl.to(rig,{wp:wpC,duration:d,ease},T);tl.to(rig,{walk:1,duration:.15},T);tl.to(rig,{walk:0,duration:.18},T+d-.18);};
    const strike=(T,o={})=>{const w=o.wind??.45,h=o.hit??.08,f=o.follow??.2;
      tl.to(rig,{...(o.windPose||POSE.WIND),sx:o.sxw??1.04,sy:o.syw??.95,duration:w,ease:o.windEase||'power2.out'},T-h-w);
      tl.to(rig,{...(o.hitPose||POSE.HIT),duration:h,ease:'power3.in'},T-h);
      tl.to(rig,{keyframes:[{sx:1.14,sy:.86,duration:.05},{sx:.96,sy:1.04,duration:.08},{sx:1,sy:1,duration:.14}]},T);
      tl.to(rig,{...(o.followPose||POSE.FOLLOW),duration:f,ease:'power2.out'},T);
      if(o.rest!==false)tl.to(rig,{...(o.rest||POSE.CARRY),duration:o.restDur||.35,ease:'power2.inOut'},T+f);
      if(o.at)impact(T,o.at[0],o.at[1],o);};
    const camTo=(T,d,h,v,ease='power2.inOut')=>tl.to(cam,{...(V?v:h),duration:d,ease},T);
    const tag=(T,str,pos,end)=>{const L=text(hudT,[str],{x:pos[0],y:pos[1],size:P(28,38),font:'DM Mono',wt:500,maxW:W-2*pos[0]});typeOn(T,L);if(end)dropOut(end,L);return L;};
    const placed=(p,s,o)=>Object.assign({x:P(120,90),maxW:P(1680,900),size:s},o,{y:p});

    // ================= TIMELINE =================
    // OPEN 0-5
    openSp.forEach((p,i)=>{gsap.set(p,{y:-160-i*40,opacity:0});tl.to(p,{y:0,opacity:1,duration:2.2,ease:'power2.out'},.1+i*.3);});
    tl.to(crack,{attr:{'stroke-dashoffset':0},duration:.6,ease:'power2.in'},1.6);
    const T0=text(hudT,P(['NOTHING IS GIVEN.'],['NOTHING','IS GIVEN.']),{x:P(120,90),y:P(300,580),size:P(150,180),maxW:P(1680,900)});
    tumbleIn(2.4,T0,.07);dropOut(5.0,T0);
    // DIGGER 5-11
    tl.set(face1,{opacity:1},5.0);tl.to(dig1,{x:1100,duration:.6,ease:'power2.out'},5.0);shake(5.0,6);burst(5.3,600,560,{n:8,kind:'puff',dir:0,speed:300,dur:.9,spread:3});
    walk(5.6,880,2.0);
    pose(7.6,POSE.CARRY,.2);tl.set(rig,{pick:0},7.75);tl.set(planted,{opacity:1,attr:{transform:'translate(1040,592) rotate(-14)'}},7.75);
    pose(7.8,POSE.RUB,.15);tl.to(rig,{keyframes:[{laF:-90,laB:-55,duration:.08},{laF:-55,laB:-92,duration:.08},{laF:-92,laB:-55,duration:.08},{laF:-55,laB:-92,duration:.08},{laF:-80,laB:-70,duration:.08}]},7.96);
    pose(8.38,POSE.CARRY,.12);tl.set(rig,{pick:1},8.42);tl.set(planted,{opacity:0},8.42);
    strike(9.0,{at:[1090,576],wind:.45});tl.to(dig1,{x:1160,duration:.1,ease:'power2.out'},9.0);
    const sp1=w2s(1090,576,{x:P(960,800),y:540,s:P(1,.8)});
    const T1=text(hudT,P(['EVERYTHING IS HELD.'],['EVERYTHING','IS HELD.']),{x:P(120,90),y:P(290,580),size:P(150,170),maxW:P(1680,900)});
    burstIn(9.02,T1,sp1[0],sp1[1],.035);
    const held=T1.filter(l=>l.word===2);const hc=held.reduce((a,l)=>a+l.cx,0)/held.length;
    held.forEach(l=>tl.to(l.el,{x:(hc-l.cx)*.16,scaleX:.8,scaleY:1.14,rotation:0,duration:.14,ease:'power3.in'},10.5));
    dropOut(11.2,T1);
    // IDENTITY 11-15
    walk(11.3,950,.4,'power1.inOut');
    strike(12.0,{at:[1158,576]});tl.to(dig1,{x:1450,duration:.4,ease:'power3.out'},12.02);
    camTo(11.6,1.4,{x:1100},{x:840});
    const id1=text(world,['FAIZAN KHAN'],{x:200,y:565,size:104,fill:I});const id2=text(world,['DATA + AI ENGINEER'],{x:204,y:648,size:52,fill:I});
    carveIn(12.25,id1,.075);carveIn(13.1,id2,.045);
    walk(12.7,1240,.7,'power1.inOut');
    // CDC 15-23
    strike(15.0,{at:[1448,576],wind:.42});tl.to(dig1,{x:4650,duration:1.35,ease:'power2.inOut'},15.04);
    stations.forEach((s,i)=>popEl(15.5+i*.17,s,.5));gsap.set(stations.map(s=>s),{transformOrigin:'50% 50%'});
    tl.set(pebG,{opacity:1},16.1);tl.to(flow,{t:7.4,duration:7.4,ease:'none'},16.1);
    camTo(15.2,1.2,{x:2300,y:610,s:.8},{x:1700,y:650,s:.7});
    tl.to(cam,{x:P(3600,4300),duration:6,ease:'none'},16.4);
    const tg1=tag(15.6,'LAYER I · CHANGE DATA CAPTURE',P([120,86],[90,1820]),22.4);
    const T2=text(hudT,P(['READ THE LOG, NOT THE TABLE.'],['READ THE LOG,','NOT THE TABLE.']),{x:P(120,90),y:P(250,1360),size:P(110,130),maxW:P(1680,900)});
    popIn(16.8,T2,.045);dropOut(21.8,T2);
    walk(15.8,4380,6.4);
    // MEDALLION 23-31
    strike(22.85,{at:[4500,700],hitPose:POSE.DOWN,followPose:POSE.DOWN,rest:false,dir:1,wind:.4});tl.to(shaft,{y:1000,duration:.25,ease:'power2.out'},22.87);
    tl.set(rig,{pick:2},23.1);pose(23.1,POSE.CLIMB,.3);tl.to(rig,{x:4550,duration:.3,ease:'power2.out'},23.1);tl.to(rig,{keyframes:[{y:660,duration:.12,ease:'power2.out'},{y:820,duration:.18,ease:'power2.in'}]},23.1);
    tl.to(rig,{y:2850,duration:7.1,ease:'none'},23.4);tl.to(rig,{cp:Math.PI*2*9,duration:7.1,ease:'none'},23.4);tl.to(rig,{climb:1,duration:.2},23.4);tl.to(rig,{climb:0,duration:.2},30.3);
    tl.to(shaft,{y:2610,duration:6.6,ease:'none'},23.4);
    camTo(22.4,1.0,{x:4560,y:900,s:.9},{x:4560,y:1000,s:.7});
    tl.to(cam,{y:P(2380,2450),duration:7,ease:'sine.inOut'},23.4);
    tag(23.4,'LAYER II · MEDALLION LAKEHOUSE',P([120,1040],[90,1820]),30.2);
    const SL=[['BRONZE · RAW',1160,24.0],['SILVER · CLEAN',1780,26.4],['GOLD · READY',2330,28.6]];
    SL.forEach(s=>popIn(s[2],text(labelsG,[s[0]],{x:3700,y:s[1],size:76,maxW:700}),.05));
    // AGENTS 31-40
    pose(30.4,POSE.CARRY,.3);tl.set(rig,{pick:1},30.5);rig._lx=4550;walk(30.6,4720,.45,'power1.inOut');
    camTo(30.4,1.4,{x:5620,y:2720,s:.58},{x:4880,y:2720,s:.6});
    tag(31.0,'LAYER III · MULTI-AGENT ORCHESTRATION',P([1200,64],[90,1820]),39.4);tl.to(synRaysIn,{scale:0,duration:.4,ease:'steps(3)'},40.0);
    gsap.set(chest,{opacity:0});tl.set(chest,{opacity:1},52.9);
    const supL=text(labelsG,['SUPERVISOR'],{x:4272,y:2642,size:46,font:'DM Mono',wt:500,fill:I});popIn(31.2,supL,.03);
    pose(32.0,{...POSE.POINT,uaF:-120,torso:-10},.3,'power2.out');pose(32.32,POSE.POINT,.08,'power3.in');
    [...tunA,...tunB].forEach(p=>{const L=p.getTotalLength();p.setAttribute('stroke-dasharray',L+5);p.setAttribute('stroke-dashoffset',L+5);});
    tunA.forEach((p,i)=>{tl.to(p,{attr:{'stroke-dashoffset':0},duration:.35,ease:'power2.out'},32.4+i*.3);popEl(32.7+i*.3,agG[i],.4);burst(32.75+i*.3,AG[i][0],AG[i][1],{n:4,kind:'speck',dir:0,speed:300});});
    AG.forEach(a=>{});agG.forEach(g=>gsap.set(g,{transformOrigin:'50% 50%'}));
    const agL=text(labelsG,['SPECIALIST AGENTS'],{x:5860,y:2245,size:50,font:'DM Mono',wt:500});popIn(33.6,agL,.025);
    const T3=text(hudT,P(['EVIDENCE, NOT VERDICTS.'],['EVIDENCE,','NOT VERDICTS.']),{x:P(120,90),y:P(960,1370),size:P(80,130),maxW:P(1680,900)});popIn(33.0,T3,.045);dropOut(39.0,T3);
    const sub=text(hudT,[P('LANGGRAPH · FASTAPI · VECTOR SEARCH','LANGGRAPH · FASTAPI')].concat(P([],['VECTOR SEARCH'])),{x:P(122,90),y:P(1036,1630),size:P(32,40),font:'DM Mono',wt:500,lh:1.4});typeOn(34.2,sub,.02);dropOut(39.0,sub);
    pose(34.0,POSE.CARRY,.35);
    tunB.forEach((p,i)=>tl.to(p,{attr:{'stroke-dashoffset':0},duration:.4,ease:'power2.out'},34.6+i*.15));
    const lan=AG.map((a,i)=>{const g=mk('g',{opacity:0},lanternsG);const inn=mk('g',{},g);mk('path',{d:'M-10 -46 Q0 -60 10 -46',stroke:I,'stroke-width':5,fill:'none'},inn);mk('path',{d:rect(-18,-44,36,48,2,20),fill:I},inn);mk('rect',{x:-8,y:-34,width:16,height:24,fill:K},inn);mk('rect',{x:-22,y:2,width:44,height:8,fill:I},inn);
      g.setAttribute('transform',`translate(${a[0]},${a[1]+40})`);return g;});
    lan.forEach((g,i)=>{const a=AG[i];tl.set(g,{opacity:1},34.0+i*.1);gsap.set(g.firstChild,{scale:0,transformOrigin:'50% 100%'});tl.to(g.firstChild,{scale:1,duration:.4,ease:'back.out(3)'},34.0+i*.1);
      const e0=i<2?[6300-i*110,2610]:[6300-(i-2)*110,2835];const pts=[[a[0],a[1]+40],[a[0]+100,a[1]+30],[e0[0],e0[1]+(i<2?40:0)],[6490+i*120,2850]];const p={t:0};const T=35.0+i*.22;
      tl.to(p,{t:1,duration:1.5,ease:'power1.inOut',onUpdate:()=>{const f=p.t*3,k=Math.min(2,Math.floor(f)),u=f-k;const A=pts[k],B=pts[k+1]||pts[k];g.setAttribute('transform',`translate(${A[0]+(B[0]-A[0])*u},${A[1]+(B[1]-A[1])*u-Math.abs(Math.sin(p.t*Math.PI*6))*10})`);}},T);});
    camTo(34.6,2.0,{},{x:6000});
    gsap.set(synRaysIn,{scale:0});tl.to(synRaysIn,{scale:1,duration:.6,ease:'steps(4)'},37.2);tl.set(syn,{attr:{fill:K}},37.2);flash(37.2,6700,2700,140);shake(37.2,6);
    const synL=text(labelsG,['SYNTHESIS'],{x:6430,y:2628,size:46,font:'DM Mono',wt:500,fill:I});popIn(37.4,synL,.03);
    walk(37.0,6680,2.6,'power1.inOut');camTo(37.0,2.6,{},{x:6650});
    // KG 40-47
    strike(40.2,{at:[6990,2724],wind:.4});tl.set(face2,{opacity:1},40.2);tl.to(cav,{x:8300,duration:.7,ease:'power2.out'},40.25);
    camTo(39.8,1.3,{x:7650,y:2470,s:.95},{x:7650,y:2470,s:.7});
    tag(40.6,'LAYER IV · KNOWLEDGE GRAPH + MCP',P([120,64],[90,1820]),46.0);
    walk(40.6,7130,.8,'power1.inOut');
    edges.forEach((e,i)=>tl.to(e[0],{attr:{'stroke-dashoffset':0},duration:.4,ease:'power2.out'},41.2+i*.06));
    nodes.forEach((n,i)=>{gsap.set(n,{transformOrigin:'50% 50%'});popEl(41.3+i*.08,n,.4);});
    tl.set(bound,{opacity:1},42.2);gsap.set(bound,{scaleX:0,transformOrigin:'0% 50%'});tl.to(bound,{scaleX:1,duration:.5,ease:'power2.out'},42.2);tl.set(boundL,{opacity:1},42.6);popEl(42.6,boundL,.35);
    const T4=text(hudT,P(['TRUSTED DATA, AGENT-READY.'],['TRUSTED DATA,','AGENT-READY.']),{x:P(120,90),y:P(1035,1440),size:P(84,130),maxW:P(1680,900)});popIn(42.8,T4,.045);dropOut(46.0,T4);
    pose(43.4,POSE.LOOK,.4);
    doors.forEach((d,i)=>{const T=43.8+i*.3;gsap.set(d,{transformOrigin:'0% 50%'});tl.to(d,{scaleX:.1,duration:.2,ease:'back.out(2)'},T);tl.to(dpaths[i],{attr:{'stroke-dashoffset':0},duration:.3,ease:'power2.in'},T+.12);tl.set(nodes[DN[i]],{attr:{fill:R}},T+.42);});
    litEdges.forEach((e,i)=>tl.to(e,{attr:{'stroke-dashoffset':0},duration:.3},45.3+i*.03));
    nodes.forEach((n,i)=>tl.set(n,{attr:{fill:R}},45.45+i*.03));
    // INSTRUMENTS 47-51
    pose(45.9,POSE.CARRY,.2);tl.to(cav,{x:8952,duration:.6,ease:'power2.out'},46.0);
    walk(46.0,8745,1.1,'power2.inOut');tl.to(rig,{torso:16,duration:.3},46.1);tl.to(rig,{torso:4,duration:.3},46.8);
    camTo(46.0,1.2,{x:9500,y:2650,s:.85},{x:9420,y:2650,s:.75});
    tag(46.8,'INSTRUMENTS',P([120,64],[90,1820]),50.9);
    rocks.forEach((r,i)=>{const T=47.4+i*.3;strike(T,{at:[8952,2726],wind:.16,hit:.05,follow:.07,rest:i===11?POSE.CARRY:false,chips:4,amp:6});
      gsap.set(r.el,{y:-900,rotation:rr(-90,90),transformOrigin:'50% 100%'});tl.to(r.el,{y:0,duration:.34,ease:'bounce.out'},T+.02);tl.to(r.el,{rotation:rr(-3,3),duration:.3,ease:'power2.out'},T+.02);burst(T+.14,r.x,r.y+50,{n:3,kind:'puff',dir:0,speed:100,dur:.6});});
    // TREASURE 51-56
    tl.to(lbT,{attr:{y:0},duration:.5,ease:'power3.out'},51.0);tl.to(lbB,{attr:{y:H-lbH},duration:.5,ease:'power3.out'},51.0);
    camTo(51.0,5.0,{x:9450,y:2680,s:1.1},{x:9300,y:2690,s:.9},'power1.inOut');
    strike(52.85,{at:[8952,2726],wind:1.35,hit:.12,follow:.6,windPose:{...POSE.WIND,torso:-26,uaF:128,uaB:120},sxw:1.07,syw:.92,windEase:'power2.inOut',k:2.2,amp:9,slow:true,chips:14,dir:1,restDur:.5});
    rocks.forEach((r,i)=>tl.to(r.el,{y:rr(700,1100),x:rr(100,500),rotation:rr(-200,200),duration:rr(.9,1.3),ease:'power2.in'},52.9+i*.035));
    covers.forEach((c,i)=>tl.to(c,{y:900,rotation:rr(-25,25),transformOrigin:'50% 100%',duration:1.1,ease:'power2.in'},52.95+i*.07));
    gsap.set(lid,{transformOrigin:'100% 100%'});tl.to(lid,{keyframes:[{rotation:14,duration:.14},{rotation:9,duration:.12},{rotation:38,duration:.16},{rotation:32,duration:.1},{rotation:112,duration:.26,ease:'power2.out'}]},53.7);
    gsap.set(crIn,{scale:0});tl.to(crIn,{scale:1,duration:.6,ease:'steps(5)'},54.2);flash(54.2,9550,2690,180);
    tl.to(flood,{attr:{r:1700},duration:.6,ease:'steps(4)'},54.55);
    rig._lx=8745;walk(53.5,9330,.6,'power2.inOut');
    tl.set(rig,{pick:0},54.2);tl.set(planted,{opacity:1,attr:{transform:'translate(9270,2742) rotate(-8)'}},54.2);burst(54.2,9270,2850,{n:3,kind:'puff',dir:0,speed:120,dur:.7});
    tl.set(rig,{px:9445,py:2712},54.2);
    pose(54.3,POSE.LEAN,.3);tl.to(rig,{pin:1,duration:.3,ease:'power2.inOut'},54.3);
    pose(54.62,{...POSE.HAND,thF:-40,shF:60},.26,'power2.out');pose(54.88,POSE.HAND,.14);
    pose(55.05,POSE.PLAN,.38,'power2.inOut');
    // END 56-61.5
    tl.to(lbT,{attr:{y:-lbH},duration:.5,ease:'power3.in'},56.0);tl.to(lbB,{attr:{y:H},duration:.5,ease:'power3.in'},56.0);
    const cs=w2s(9550,2700,P({x:9450,y:2680,s:1.1},{x:9300,y:2690,s:.9}));engulf.setAttribute('cx',cs[0]);engulf.setAttribute('cy',cs[1]);
    tl.to(engulf,{attr:{r:Math.hypot(W,H)},duration:.4,ease:'steps(4)'},56.0);
    tl.set([endBg,panel],{opacity:1},56.42);tl.set(engulf,{opacity:0},56.42);
    const PN=P({x:160,y:170,width:1600,height:640},{x:90,y:380,width:900,height:1060});
    tl.to(panel,{attr:PN,duration:.75,ease:'power3.inOut'},56.5);
    const ex=PN.x+P(80,60);
    const eT=text(endG,['Nothing is given. Everything is held.'],{x:ex,y:PN.y+P(110,120),size:P(36,36),font:'DM Mono',wt:500,fill:I,maxW:PN.width-P(160,120)});typeOn(57.0,eT,.018);
    const eN=text(endG,P(['FAIZAN KHAN'],['FAIZAN','KHAN']),{x:ex,y:PN.y+P(330,380),size:P(190,210),fill:I,maxW:PN.width-P(160,120)});popIn(57.3,eN,.06);
    const eR=text(endG,P(['DATA + AI ENGINEER'],['DATA + AI','ENGINEER']),{x:ex,y:PN.y+P(480,800),size:P(92,104),fill:I,maxW:PN.width-P(160,120)});popIn(58.0,eR,.035);
    const eF=text(endG,P(['faizankhan.io · github.com/thedownface · linkedin.com/in/faizan-khan-a64443213'],['faizankhan.io','github.com/thedownface','linkedin.com/in/faizan-khan-a64443213']),{x:P(160,90),y:P(900,1560),size:P(28,38),font:'DM Mono',wt:500,lh:1.6,maxW:P(1600,900)});typeOn(58.6,eF,.012);
    const ep=mk('g',{},endG);const epi=mk('g',{},ep);pickD(epi);
    const pb=P([1830,800],[968,1436]),psc=P(2.1,1.8);ep.setAttribute('transform',`translate(${pb[0]},${pb[1]}) scale(${psc})`);
    gsap.set(epi,{rotation:180,opacity:0,svgOrigin:'0 0'});tl.set(epi,{opacity:1},57.4);tl.to(epi,{rotation:158,duration:.7,ease:'bounce.out',svgOrigin:'0 0'},57.4);
    const dust=mk('path',{d:blob(0,0,6,5),fill:I,opacity:0},endG);const dx=PN.x+PN.width*.72;
    tl.set(dust,{opacity:1},59.2);tl.fromTo(dust,{attr:{transform:`translate(${dx},${PN.y-260})`}},{attr:{transform:`translate(${dx+30},${PN.y-6})`},duration:1.4,ease:'sine.inOut',immediateRender:false},59.2);
    tl.to({},{duration:.01},DUR-.01);

    // render state
    this.els={world,fgL,c1r,face1,c2r,c3r,face2,pebs};this.dig1=dig1;this.shaft=shaft;this.cav=cav;this.flow=flow;
    this.render();
    tl.time(startT);this.render();
  }

  render(){const {world,fgL,c1r,face1,c2r,c3r,face2,pebs}=this.els;const c=this.cam,s=this.sh,W=this.W,H=this.H;
    world.setAttribute('transform',`translate(${W/2+s.x},${H/2+s.y}) scale(${c.s}) translate(${-c.x},${-c.y})`);
    fgL.setAttribute('transform',`translate(${W/2+s.x*1.6},${H/2+s.y*1.6}) scale(${c.s}) translate(${-c.x*1.25},${-c.y*1.25})`);
    c1r.setAttribute('width',Math.max(0,this.dig1.x+2000));face1.setAttribute('transform',`translate(${Math.min(this.dig1.x,4650)},0)`);
    c2r.setAttribute('height',Math.max(0,this.shaft.y-690));
    c3r.setAttribute('width',Math.max(0,this.cav.x-6990));face2.setAttribute('transform',`translate(${this.cav.x-8952},0)`);
    const Lp=2540;pebs.forEach((p,i)=>{const x=1760+((i/pebs.length)*Lp+this.flow.t*620)%Lp;p.setAttribute('transform',`translate(${x.toFixed(1)},${800+Math.sin(i*1.7)*8})`);});
    this.renderRig();}

  renderRig(){const r=this.rig,G=this.R;let {torso,head,uaF,laF,uaB,laB,thF,shF,thB,shB}=r;
    if(r.walk>0){const p=r.wp,w=r.walk;thF+=-28*Math.sin(p)*w;thB+=28*Math.sin(p)*w;shF+=(14+14*Math.cos(p+.6))*w;shB+=(14-14*Math.cos(p+.6))*w;uaB+=16*Math.sin(p)*w;torso+=3*w;}
    if(r.climb>0){const p=r.cp,w=r.climb;uaF+=16*Math.sin(p)*w;uaB-=16*Math.sin(p)*w;thF+=22*Math.sin(p)*w;thB-=22*Math.sin(p)*w;}
    const bob=r.walk>0?-4*Math.abs(Math.cos(r.wp))*r.walk:0;
    let X=r.x,Y=r.y;
    if(r.pin>0){const d=Math.PI/180,Rt=(a,v)=>[v[0]*Math.cos(a*d)-v[1]*Math.sin(a*d),v[0]*Math.sin(a*d)+v[1]*Math.cos(a*d)];
      const ad=(a,b)=>[a[0]+b[0],a[1]+b[1]];let hp=[0,-102];let shp=ad(hp,Rt(torso,[2,-72]));let el=ad(shp,Rt(torso+uaF,[0,40]));let hd=ad(el,Rt(torso+uaF+laF,[0,37]));
      const o=Rt(r.rot,[hd[0]*r.sx,hd[1]*r.sy]);X+=(r.px-o[0]-X)*r.pin;Y+=(r.py-o[1]-Y)*r.pin;}
    G.dg.setAttribute('transform',`translate(${X.toFixed(2)},${Y.toFixed(2)}) rotate(${r.rot}) scale(${r.sx},${r.sy})`);
    G.hip.setAttribute('transform',`translate(0,${-102+bob})`);
    G.torso.setAttribute('transform',`rotate(${torso})`);G.head.setAttribute('transform',`translate(0,-80) rotate(${head})`);
    G.armB.ua.setAttribute('transform',`translate(-2,-72) rotate(${uaB})`);G.armB.la.setAttribute('transform',`translate(0,40) rotate(${laB})`);
    G.armF.ua.setAttribute('transform',`translate(2,-72) rotate(${uaF})`);G.armF.la.setAttribute('transform',`translate(0,40) rotate(${laF})`);
    G.legB.th.setAttribute('transform',`translate(-4,0) rotate(${thB})`);G.legB.sn.setAttribute('transform',`translate(0,50) rotate(${shB})`);
    G.legF.th.setAttribute('transform',`translate(4,0) rotate(${thF})`);G.legF.sn.setAttribute('transform',`translate(0,50) rotate(${shF})`);
    G.pickHand.setAttribute('opacity',r.pick===1?1:0);G.pickBack.setAttribute('opacity',r.pick===2?1:0);}
}
