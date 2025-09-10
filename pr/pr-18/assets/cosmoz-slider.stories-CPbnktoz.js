import{f as gt,B as vt,p as $t,v as _,s as w,M as R,T as S,m as _t,E as H,x as v,i as yt}from"./iframe-ZnWXCguy.js";import"./preload-helper-D9Z9MdNV.js";let L,ct=0;function W(t){L=t}function J(){L=null,ct=0}function At(){return ct++}const D=Symbol("haunted.phase"),T=Symbol("haunted.hook"),tt=Symbol("haunted.update"),et=Symbol("haunted.commit"),y=Symbol("haunted.effects"),k=Symbol("haunted.layoutEffects"),Q="haunted.context";class St{update;host;virtual;[T];[y];[k];constructor(e,s){this.update=e,this.host=s,this[T]=new Map,this[y]=[],this[k]=[]}run(e){W(this);let s=e();return J(),s}_runEffects(e){let s=this[e];W(this);for(let i of s)i.call(this);J()}runEffects(){this._runEffects(y)}runLayoutEffects(){this._runEffects(k)}teardown(){this[T].forEach(s=>{typeof s.teardown=="function"&&s.teardown()})}}const Ct=Promise.resolve().then.bind(Promise.resolve());function lt(){let t=[],e;function s(){e=null;let i=t;t=[];for(var n=0,r=i.length;n<r;n++)i[n]()}return function(i){t.push(i),e==null&&(e=Ct(s))}}const wt=lt(),st=lt();class xt{renderer;host;state;[D];_updateQueued;constructor(e,s){this.renderer=e,this.host=s,this.state=new St(this.update.bind(this),s),this[D]=null,this._updateQueued=!1}update(){this._updateQueued||(wt(()=>{let e=this.handlePhase(tt);st(()=>{this.handlePhase(et,e),st(()=>{this.handlePhase(y)})}),this._updateQueued=!1}),this._updateQueued=!0)}handlePhase(e,s){switch(this[D]=e,e){case et:this.commit(s),this.runEffects(k);return;case tt:return this.render();case y:return this.runEffects(y)}}render(){return this.state.run(()=>this.renderer.call(this.host,this.host))}runEffects(e){this.state._runEffects(e)}teardown(){this.state.teardown()}}const Et=(t="")=>t.replace(/-+([a-z])?/g,(e,s)=>s?s.toUpperCase():"");function kt(t){class e extends xt{frag;renderResult;constructor(n,r,a){super(n,a||r),this.frag=r}commit(n){this.renderResult=t(n,this.frag)}}function s(i,n,r){const a=(r||n||{}).baseElement||HTMLElement,{observedAttributes:o=[],useShadowDOM:l=!0,shadowRootInit:p={},styleSheets:f}=r||n||{};class d extends a{_scheduler;static get observedAttributes(){return i.observedAttributes||o||[]}constructor(){if(super(),l===!1)this._scheduler=new e(i,this);else{const c=this.attachShadow({mode:"open",...p});f&&(c.adoptedStyleSheets=f),this._scheduler=new e(i,c,this)}}connectedCallback(){this._scheduler.update(),this._scheduler.renderResult?.setConnected(!0)}disconnectedCallback(){this._scheduler.teardown(),this._scheduler.renderResult?.setConnected(!1)}attributeChangedCallback(c,b,g){if(b===g)return;let $=g===""?!0:g;Reflect.set(this,Et(c),$)}}function m(u){let c=u,b=!1;return Object.freeze({enumerable:!0,configurable:!0,get(){return c},set(g){b&&c===g||(b=!0,c=g,this._scheduler&&this._scheduler.update())}})}const h=new Proxy(a.prototype,{getPrototypeOf(u){return u},set(u,c,b,g){let $;return c in u?($=Object.getOwnPropertyDescriptor(u,c),$&&$.set?($.set.call(g,b),!0):(Reflect.set(u,c,b,g),!0)):(typeof c=="symbol"||c[0]==="_"?$={enumerable:!0,configurable:!0,writable:!0,value:b}:$=m(b),Object.defineProperty(g,c,$),$.set&&$.set.call(g,b),!0)}});return Object.setPrototypeOf(d.prototype,h),d}return s}class q{id;state;constructor(e,s){this.id=e,this.state=s}}function Mt(t,...e){let s=At(),i=L[T],n=i.get(s);return n||(n=new t(s,L,...e),i.set(s,n)),n.update(...e)}function P(t){return Mt.bind(null,t)}function dt(t){return P(class extends q{callback;lastValues;values;_teardown;constructor(e,s,i,n){super(e,s),t(s,this)}update(e,s){this.callback=e,this.values=s}call(){const e=!this.values||this.hasChanged();this.lastValues=this.values,e&&this.run()}run(){this.teardown(),this._teardown=this.callback.call(this.state)}teardown(){typeof this._teardown=="function"&&this._teardown()}hasChanged(){return!this.lastValues||this.values.some((e,s)=>this.lastValues[s]!==e)}})}function ht(t,e){t[y].push(e)}const Z=dt(ht),qt=t=>t instanceof Element?t:t.startNode||t.endNode||t.parentNode,Pt=P(class extends q{Context;value;_ranEffect;_unsubscribe;constructor(t,e,s){super(t,e),this._updater=this._updater.bind(this),this._ranEffect=!1,this._unsubscribe=null,ht(e,this)}update(t){return this.Context!==t&&(this._subscribe(t),this.Context=t),this.value}call(){this._ranEffect||(this._ranEffect=!0,this._unsubscribe&&this._unsubscribe(),this._subscribe(this.Context),this.state.update())}_updater(t){this.value=t,this.state.update()}_subscribe(t){const e={Context:t,callback:this._updater};qt(this.state.host).dispatchEvent(new CustomEvent(Q,{detail:e,bubbles:!0,cancelable:!0,composed:!0}));const{unsubscribe:i=null,value:n}=e;this.value=i?n:t.defaultValue,this._unsubscribe=i}teardown(){this._unsubscribe&&this._unsubscribe()}});function It(t){return e=>{const s={Provider:class extends HTMLElement{listeners;_value;constructor(){super(),this.listeners=new Set,this.addEventListener(Q,this)}disconnectedCallback(){this.removeEventListener(Q,this)}handleEvent(i){const{detail:n}=i;n.Context===s&&(n.value=this.value,n.unsubscribe=this.unsubscribe.bind(this,n.callback),this.listeners.add(n.callback),i.stopPropagation())}unsubscribe(i){this.listeners.delete(i)}set value(i){this._value=i;for(let n of this.listeners)n(i)}get value(){return this._value}},Consumer:t(function({render:i}){const n=Pt(s);return i(n)},{useShadowDOM:!1}),defaultValue:e};return s}}const z=P(class extends q{value;values;constructor(t,e,s,i){super(t,e),this.value=s(),this.values=i}update(t,e){return this.hasChanged(e)&&(this.values=e,this.value=t()),this.value}hasChanged(t=[]){return t.some((e,s)=>this.values[s]!==e)}}),X=(t,e)=>z(()=>t,e);function Ot(t,e){t[k].push(e)}const it=dt(Ot),I=P(class extends q{args;constructor(t,e,s){super(t,e),this.updater=this.updater.bind(this),typeof s=="function"&&(s=s()),this.makeArgs(s)}update(){return this.args}updater(t){const[e]=this.args;typeof t=="function"&&(t=t(e)),!Object.is(e,t)&&(this.makeArgs(t),this.state.update())}makeArgs(t){this.args=Object.freeze([t,this.updater])}});P(class extends q{reducer;currentState;constructor(t,e,s,i,n){super(t,e),this.dispatch=this.dispatch.bind(this),this.currentState=n!==void 0?n(i):i}update(t){return this.reducer=t,[this.currentState,this.dispatch]}dispatch(t){this.currentState=this.reducer(this.currentState,t),this.state.update()}});function Tt(t){return z(()=>({current:t}),[])}function Lt({render:t}){const e=kt(t),s=It(e);return{component:e,createContext:s}}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const K={ATTRIBUTE:1,CHILD:2},O=t=>(...e)=>({_$litDirective$:t,values:e});let G=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,s,i){this._$Ct=e,this._$AM=s,this._$Ci=i}_$AS(e,s){return this.update(e,s)}update(e,s){return this.render(...s)}};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const M=(t,e)=>{const s=t._$AN;if(s===void 0)return!1;for(const i of s)i._$AO?.(e,!1),M(i,e);return!0},j=t=>{let e,s;do{if((e=t._$AM)===void 0)break;s=e._$AN,s.delete(t),t=e}while(s?.size===0)},mt=t=>{for(let e;e=t._$AM;t=e){let s=e._$AN;if(s===void 0)e._$AN=s=new Set;else if(s.has(t))break;s.add(t),Gt(e)}};function zt(t){this._$AN!==void 0?(j(this),this._$AM=t,mt(this)):this._$AM=t}function jt(t,e=!1,s=0){const i=this._$AH,n=this._$AN;if(n!==void 0&&n.size!==0)if(e)if(Array.isArray(i))for(let r=s;r<i.length;r++)M(i[r],!1),j(i[r]);else i!=null&&(M(i,!1),j(i));else M(this,t)}const Gt=t=>{t.type==K.CHILD&&(t._$AP??=jt,t._$AQ??=zt)};class ft extends G{constructor(){super(...arguments),this._$AN=void 0}_$AT(e,s,i){super._$AT(e,s,i),mt(this),this.isConnected=e._$AU}_$AO(e,s=!0){e!==this.isConnected&&(this.isConnected=e,e?this.reconnected?.():this.disconnected?.()),s&&(M(this,e),j(this))}setValue(e){if(gt(this._$Ct))this._$Ct._$AI(e,this);else{const s=[...this._$Ct._$AH];s[this._$Ci]=e,this._$Ct._$AI(s,this,0)}}disconnected(){}reconnected(){}}const{component:N}=Lt({render:vt});/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const nt=(t,e,s)=>{const i=new Map;for(let n=e;n<=s;n++)i.set(t[n],n);return i},Nt=O(class extends G{constructor(t){if(super(t),t.type!==K.CHILD)throw Error("repeat() can only be used in text expressions")}dt(t,e,s){let i;s===void 0?s=e:e!==void 0&&(i=e);const n=[],r=[];let a=0;for(const o of t)n[a]=i?i(o,a):a,r[a]=s(o,a),a++;return{values:r,keys:n}}render(t,e,s){return this.dt(t,e,s).values}update(t,[e,s,i]){const n=$t(t),{values:r,keys:a}=this.dt(e,s,i);if(!Array.isArray(n))return this.ut=a,r;const o=this.ut??=[],l=[];let p,f,d=0,m=n.length-1,h=0,u=r.length-1;for(;d<=m&&h<=u;)if(n[d]===null)d++;else if(n[m]===null)m--;else if(o[d]===a[h])l[h]=_(n[d],r[h]),d++,h++;else if(o[m]===a[u])l[u]=_(n[m],r[u]),m--,u--;else if(o[d]===a[u])l[u]=_(n[d],r[u]),w(t,l[u+1],n[d]),d++,u--;else if(o[m]===a[h])l[h]=_(n[m],r[h]),w(t,n[d],n[m]),m--,h++;else if(p===void 0&&(p=nt(a,h,u),f=nt(o,d,m)),p.has(o[d]))if(p.has(o[m])){const c=f.get(a[h]),b=c!==void 0?n[c]:null;if(b===null){const g=w(t,n[d]);_(g,r[h]),l[h]=g}else l[h]=_(b,r[h]),w(t,n[d],b),n[c]=null;h++}else R(n[m]),m--;else R(n[d]),d++;for(;h<=u;){const c=w(t,l[u+1]);_(c,r[h]),l[h++]=c}for(;d<=m;){const c=n[d++];c!==null&&R(c)}return this.ut=a,_t(t,l),S}}),B=new WeakMap,Rt=O(class extends ft{render(t){return H}update(t,[e]){const s=e!==this.G;return s&&this.G!==void 0&&this.rt(void 0),(s||this.lt!==this.ct)&&(this.G=e,this.ht=t.options?.host,this.rt(this.ct=t.element)),H}rt(t){if(this.isConnected||(t=void 0),typeof this.G=="function"){const e=this.ht??globalThis;let s=B.get(e);s===void 0&&(s=new WeakMap,B.set(e,s)),s.get(this.G)!==void 0&&this.G.call(this.ht,void 0),s.set(this.G,t),t!==void 0&&this.G.call(this.ht,t)}else this.G.value=t}get lt(){return typeof this.G=="function"?B.get(this.ht??globalThis)?.get(this.G):this.G?.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}});/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const pt="important",Dt=" !"+pt,Xt=O(class extends G{constructor(t){if(super(t),t.type!==K.ATTRIBUTE||t.name!=="style"||t.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(t){return Object.keys(t).reduce(((e,s)=>{const i=t[s];return i==null?e:e+`${s=s.includes("-")?s:s.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${i};`}),"")}update(t,[e]){const{style:s}=t.element;if(this.ft===void 0)return this.ft=new Set(Object.keys(e)),this.render(e);for(const i of this.ft)e[i]==null&&(this.ft.delete(i),i.includes("-")?s.removeProperty(i):s[i]=null);for(const i in e){const n=e[i];if(n!=null){this.ft.add(i);const r=typeof n=="string"&&n.endsWith(Dt);i.includes("-")||r?s.setProperty(i,r?n.slice(0,-11):n,r?pt:""):s[i]=n}}return S}});/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Bt={},Y=O(class extends G{constructor(){super(...arguments),this.ot=Bt}render(t,e){return e()}update(t,[e,s]){if(Array.isArray(e)){if(Array.isArray(this.ot)&&this.ot.length===e.length&&e.every(((i,n)=>i===this.ot[n])))return S}else if(this.ot===e)return S;return this.ot=Array.isArray(e)?Array.from(e):e,this.render(e,s)}});class Ut extends Promise{constructor(e){const s={};super((i,n)=>Object.assign(s,{resolve:i,reject:n})),Object.assign(this,s),e?.(s.resolve,s.reject)}resolve=()=>{}}const bt={host:{position:"relative",display:"flex",overflow:"hidden"},slide:{position:"static",width:"100%",height:"100%"}},Ht=t=>{const{slide:e}=t,[s,i]=I([]);return it(()=>void Object.assign(t.style,bt.host),[]),Z(()=>{if(e==null)return;const n={animationEnd$:new Ut,...e};i((r=[])=>{const a=r.findIndex(({id:o,out:l})=>o===n.id&&l!==!0);return a!==-1?[...r.slice(0,a),n,...r.slice(a+1,r.length)]:[...r,n]})},[e]),it(async()=>{if(s.filter(l=>!l.out).length<2){const l=s[0];l&&requestAnimationFrame(()=>requestAnimationFrame(()=>l.animationEnd$.resolve()));return}const n=s[s.length-1],r=s[s.length-2],a=n.el,o=r.el;r.out=!0,a&&o&&await n.animation?.(a,o),i((l=[])=>l.filter(p=>p!==r))},[s]),{slides:s}},Qt=t=>v`<div
		${Rt(e=>Object.assign(t,{el:e}))}
		class="slide"
		style=${Xt(bt.slide)}
	>
		${Y([t],()=>t.content??t.render?.(t))}
	</div>`,Vt=({slides:t})=>Y([t],()=>Nt(t,({id:e})=>e,Qt)),Ft=t=>Vt(Ht(t));customElements.define("cosmoz-slider",N(Ft,{useShadowDOM:!1}));const C=(t,e)=>{const s=t.animate([{position:"absolute",transform:"translateX(100%)"},{transform:"translateX(0%)"}],{duration:200,fill:"none",easing:"ease-in-out"}),i=e.animate([{},{position:"absolute",transform:"translateX(-100%)"}],{duration:200,fill:"none",easing:"ease-in-out"});return Promise.all([s.finished,i.finished])},V=(t,e)=>{const s=t.animate([{position:"absolute",transform:"translateX(-100%)"},{transform:"translateX(0%)"}],{duration:200,fill:"none",easing:"ease-in-out"}),i=e.animate([{},{position:"absolute",transform:"translateX(100%)"}],{duration:200,fill:"none",easing:"ease-in-out"});return Promise.all([s.finished,i.finished])},Zt=t=>{const e=Tt(void 0);return Z(()=>void(e.current=t),[t]),e.current},Kt=t=>t,Yt=(t,e,s)=>t.find(i=>s(i)===s(e))??t[0],Wt=()=>({id:Math.random(),content:H,animation:C}),Jt=(t,{initial:e,render:s,id:i=Kt,loop:n})=>{const[r,a]=I(()=>e??t[0]),o=z(()=>t.indexOf(r),[t,r]),l=Zt(o),p=X(()=>a(()=>n?t[(o-1+t.length)%t.length]:t[Math.max(0,Math.min(t.length-1,o-1))]),[t,o,n]),f=X(()=>a(()=>n?t[(o+1)%t.length]:t[Math.max(0,Math.min(t.length-1,o+1))]),[t,o,n]),d=X(c=>a(()=>t[c]),[t]),m=n?!1:o<=0,h=n?!1:o===t.length-1,u=o>(l??-1)?n&&o===t.length-1&&l===0?V:C:n&&o===0&&l===t.length-1?C:V;return Z(()=>a(c=>c?t.indexOf(c)>=0?c:Yt(t,c,i):t[0]),[t]),{index:o,item:r,slide:z(()=>r==null?Wt():{id:i(r),render:c=>s(r,{next:f,prev:p,goto:d,first:m,last:h,...c}),animation:u},[r,s]),prev:p,next:f,goto:d,first:m,last:h}},U=()=>Math.trunc(Math.random()*256),te=()=>`rgb(${U()}, ${U()}, ${U()})`,rt=t=>({id:t,content:v`
			<style>
				div {
					display: flex;
					justify-content: center;
					align-items: center;
					position: absolute;
					top: 0;
					bottom: 0;
					left: 0;
					right: 0;
					user-select: none;
				}
			</style>
			<div style="background-color: ${te()}">
				<div>Click me!</div>
			</div>
		`,animation:C}),ee=()=>{const[t,e]=I(rt(1));return v`
			<style>
				cosmoz-slider {
					height: 80vh;
				}
			</style>
			<cosmoz-slider .slide=${t} @click=${()=>e(i=>rt(i.id+1))}></cosmoz-slider>
		`};customElements.define("demo-basic-slider",N(ee));const F={about:v`<h1>About</h1>
			<p>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
				tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
				veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
				commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
				velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
				occaecat cupidatat non proident, sunt in culpa qui officia deserunt
				mollit anim id est laborum.
			</p>`,mission:v`<h1>Mission</h1>
			<p>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
				tempor incididunt ut labore et dolore magna aliqua. Ut placerat orci
				nulla pellentesque dignissim. A diam maecenas sed enim ut sem viverra.
				Enim eu turpis egestas pretium aenean pharetra magna ac placerat.
				Suscipit adipiscing bibendum est ultricies integer quis auctor elit. Id
				neque aliquam vestibulum morbi blandit cursus risus at ultrices. Quam
				nulla porttitor massa id neque. Diam vel quam elementum pulvinar etiam
				non quam lacus suspendisse. Velit aliquet sagittis id consectetur.
				Venenatis urna cursus eget nunc. Arcu ac tortor dignissim convallis
				aenean et tortor at. Neque laoreet suspendisse interdum consectetur
				libero id faucibus nisl tincidunt. Pharetra massa massa ultricies mi
				quis hendrerit. Pellentesque nec nam aliquam sem et tortor consequat id.
				Semper feugiat nibh sed pulvinar proin gravida.
			</p>`,contact:v`<h1>Contact</h1>
			<p>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
				tempor incididunt ut labore et dolore magna aliqua. Suscipit adipiscing
				bibendum est ultricies integer quis auctor elit sed. Id aliquet risus
				feugiat in. Amet cursus sit amet dictum sit amet justo donec enim.
				Lectus sit amet est placerat in egestas erat imperdiet. Imperdiet sed
				euismod nisi porta lorem. Facilisi morbi tempus iaculis urna id
				volutpat. Lectus nulla at volutpat diam ut. Blandit turpis cursus in hac
				habitasse platea dictumst quisque sagittis. In nibh mauris cursus mattis
				molestie a iaculis at. Iaculis eu non diam phasellus vestibulum lorem
				sed risus. Pharetra massa massa ultricies mi quis hendrerit. Ridiculus
				mus mauris vitae ultricies. Aliquam sem et tortor consequat id porta
				nibh venenatis. Amet volutpat consequat mauris nunc. Mattis ullamcorper
				velit sed ullamcorper.
			</p>`},se=(t,e)=>{const s=Object.keys(F);return s.indexOf(t)<s.indexOf(e)?C:V},ie=()=>{const[t,e]=I({id:"about",content:F.about,animation:C}),s=i=>()=>e(n=>({id:i,content:F[i],animation:se(n.id,i)}));return v`
			<style>
				cosmoz-slider {
					height: 80vh;
				}
			</style>
			<button @click=${s("about")}>About</button>
			<button @click=${s("mission")}>Mission</button>
			<button @click=${s("contact")}>Contact</button>
			<cosmoz-slider .slide=${t}></cosmoz-slider>
		`};customElements.define("demo-tab-slider",N(ie));/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class ne{constructor(e){this.G=e}disconnect(){this.G=void 0}reconnect(e){this.G=e}deref(){return this.G}}class re{constructor(){this.Y=void 0,this.Z=void 0}get(){return this.Y}pause(){this.Y??=new Promise((e=>this.Z=e))}resume(){this.Z?.(),this.Y=this.Z=void 0}}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ot=t=>!yt(t)&&typeof t.then=="function",at=1073741823;class oe extends ft{constructor(){super(...arguments),this._$Cwt=at,this._$Cbt=[],this._$CK=new ne(this),this._$CX=new re}render(...e){return e.find((s=>!ot(s)))??S}update(e,s){const i=this._$Cbt;let n=i.length;this._$Cbt=s;const r=this._$CK,a=this._$CX;this.isConnected||this.disconnected();for(let o=0;o<s.length&&!(o>this._$Cwt);o++){const l=s[o];if(!ot(l))return this._$Cwt=o,l;o<n&&l===i[o]||(this._$Cwt=at,n=0,Promise.resolve(l).then((async p=>{for(;a.get();)await a.get();const f=r.deref();if(f!==void 0){const d=f._$Cbt.indexOf(l);d>-1&&d<f._$Cwt&&(f._$Cwt=d,f.setValue(p))}})))}return S}disconnected(){this._$CK.disconnect(),this._$CX.pause()}reconnected(){this._$CK.reconnect(this),this._$CX.resume()}}const ae=O(oe),ue=(t,{animationEnd$:e})=>[v`<h1>my slide ${t.id}</h1>
			<p>${Math.random()}</p>
			<img
				src="${t.pic}"
				width="1200"
				height="300"
				style="background:gray;width:100%; height: auto;"
			/> `,Y(e,()=>ae(e.then(()=>v`<p>Animation done</p>`),v`<p>Animating...</p>`))],ut=[{id:1,pic:"https://picsum.photos/1200/300?random=1"},{id:2,pic:"https://picsum.photos/1200/300?random=2"},{id:3,pic:"https://picsum.photos/1200/300?random=3"},{id:4,pic:"https://picsum.photos/1200/300?random=4"}],ce=({loop:t})=>{const[e,s]=I(ut),{index:i,slide:n,prev:r,next:a,first:o,last:l}=Jt(e,{loop:t,render:ue,id:u=>u?.id}),p=()=>s(u=>[...u,{id:u.length+1,pic:"https://picsum.photos/1200/300?random="+(u.length+1)}]),f=()=>s(ut),d=()=>s(u=>u.concat().sort(()=>Math.random()>.5?1:-1)),m=()=>s([]),h=()=>s(u=>[...u.slice(0,i),{...u[i],pic:"https://picsum.photos/1200/300?random="+Math.round(Math.random()*100)},...u.slice(i+1)]);return v`
			<style>
				cosmoz-slider {
					width: 90vw;
					height: 500px;
					background: lightgray;
					text-wrap: nowrap;
				}
			</style>

			<cosmoz-slider .slide=${n}></cosmoz-slider>
			${i+1} / ${e.length}
			<button @click=${r} ?disabled=${o}>Prev</button>
			<button @click=${a} ?disabled=${l}>Next</button>
			<button @click=${p}>Add item</button>
			<button @click=${f}>Reset items</button>
			<button @click=${d}>Shuffle items</button>
			<button @click=${m}>Empty items</button>
			<button @click=${h}>Update item</button>
		`};customElements.define("demo-advanced-slider",N(ce,{observedAttributes:["loop"]}));const me={title:"Cosmoz Slider",tags:["autodocs"]},x=()=>v`<demo-basic-slider></demo-basic-slider>`;x.parameters={docs:{description:{story:"The basic version of Slider"}}};const E=()=>v`<demo-tab-slider></demo-tab-slider>`;E.parameters={docs:{description:{story:"The tab version of Slider"}}};const A=({loop:t})=>v`<demo-advanced-slider ?loop=${t}></demo-advanced-slider>`;A.args={loop:!1};A.parameters={docs:{description:{story:"The advanced version of Slider"}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:"() => html`<demo-basic-slider></demo-basic-slider>`",...x.parameters?.docs?.source}}};E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:"() => html`<demo-tab-slider></demo-tab-slider>`",...E.parameters?.docs?.source}}};A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:"({\n  loop\n}) => html`<demo-advanced-slider ?loop=${loop}></demo-advanced-slider>`",...A.parameters?.docs?.source}}};const fe=["BasicSlider","TabSlider","AdvancedSlider"];export{A as AdvancedSlider,x as BasicSlider,E as TabSlider,fe as __namedExportsOrder,me as default};
