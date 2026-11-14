var $1=globalThis,T1=$1.ShadowRoot&&($1.ShadyCSS===void 0||$1.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,a2=Symbol(),D2=new WeakMap,Z1=class{constructor(C,H,V){if(this._$cssResult$=!0,V!==a2)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=C,this.t=H}get styleSheet(){let C=this.o,H=this.t;if(T1&&C===void 0){let V=H!==void 0&&H.length===1;V&&(C=D2.get(H)),C===void 0&&((this.o=C=new CSSStyleSheet).replaceSync(this.cssText),V&&D2.set(H,C))}return C}toString(){return this.cssText}},N2=r=>new Z1(typeof r=="string"?r:r+"",void 0,a2),g=(r,...C)=>{let H=r.length===1?r[0]:C.reduce((V,e,M)=>V+(i=>{if(i._$cssResult$===!0)return i.cssText;if(typeof i=="number")return i;throw Error("Value passed to 'css' function must be a 'css' function result: "+i+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(e)+r[M+1],r[0]);return new Z1(H,r,a2)},W2=(r,C)=>{if(T1)r.adoptedStyleSheets=C.map(H=>H instanceof CSSStyleSheet?H:H.styleSheet);else for(let H of C){let V=document.createElement("style"),e=$1.litNonce;e!==void 0&&V.setAttribute("nonce",e),V.textContent=H.cssText,r.appendChild(V)}},A2=T1?r=>r:r=>r instanceof CSSStyleSheet?(C=>{let H="";for(let V of C.cssRules)H+=V.cssText;return N2(H)})(r):r;var{is:R5,defineProperty:E5,getOwnPropertyDescriptor:D5,getOwnPropertyNames:N5,getOwnPropertySymbols:W5,getPrototypeOf:I5}=Object,F1=globalThis,I2=F1.trustedTypes,U5=I2?I2.emptyScript:"",G5=F1.reactiveElementPolyfillSupport,S1=(r,C)=>r,d2={toAttribute(r,C){switch(C){case Boolean:r=r?U5:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,C){let H=r;switch(C){case Boolean:H=r!==null;break;case Number:H=r===null?null:Number(r);break;case Object:case Array:try{H=JSON.parse(r)}catch{H=null}}return H}},G2=(r,C)=>!R5(r,C),U2={attribute:!0,type:String,converter:d2,reflect:!1,useDefault:!1,hasChanged:G2};Symbol.metadata??=Symbol("metadata"),F1.litPropertyMetadata??=new WeakMap;var J=class extends HTMLElement{static addInitializer(C){this._$Ei(),(this.l??=[]).push(C)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(C,H=U2){if(H.state&&(H.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(C)&&((H=Object.create(H)).wrapped=!0),this.elementProperties.set(C,H),!H.noAccessor){let V=Symbol(),e=this.getPropertyDescriptor(C,V,H);e!==void 0&&E5(this.prototype,C,e)}}static getPropertyDescriptor(C,H,V){let{get:e,set:M}=D5(this.prototype,C)??{get(){return this[H]},set(i){this[H]=i}};return{get:e,set(i){let A=e?.call(this);M?.call(this,i),this.requestUpdate(C,A,V)},configurable:!0,enumerable:!0}}static getPropertyOptions(C){return this.elementProperties.get(C)??U2}static _$Ei(){if(this.hasOwnProperty(S1("elementProperties")))return;let C=I5(this);C.finalize(),C.l!==void 0&&(this.l=[...C.l]),this.elementProperties=new Map(C.elementProperties)}static finalize(){if(this.hasOwnProperty(S1("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(S1("properties"))){let H=this.properties,V=[...N5(H),...W5(H)];for(let e of V)this.createProperty(e,H[e])}let C=this[Symbol.metadata];if(C!==null){let H=litPropertyMetadata.get(C);if(H!==void 0)for(let[V,e]of H)this.elementProperties.set(V,e)}this._$Eh=new Map;for(let[H,V]of this.elementProperties){let e=this._$Eu(H,V);e!==void 0&&this._$Eh.set(e,H)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(C){let H=[];if(Array.isArray(C)){let V=new Set(C.flat(1/0).reverse());for(let e of V)H.unshift(A2(e))}else C!==void 0&&H.push(A2(C));return H}static _$Eu(C,H){let V=H.attribute;return V===!1?void 0:typeof V=="string"?V:typeof C=="string"?C.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(C=>this.enableUpdating=C),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(C=>C(this))}addController(C){(this._$EO??=new Set).add(C),this.renderRoot!==void 0&&this.isConnected&&C.hostConnected?.()}removeController(C){this._$EO?.delete(C)}_$E_(){let C=new Map,H=this.constructor.elementProperties;for(let V of H.keys())this.hasOwnProperty(V)&&(C.set(V,this[V]),delete this[V]);C.size>0&&(this._$Ep=C)}createRenderRoot(){let C=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return W2(C,this.constructor.elementStyles),C}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(C=>C.hostConnected?.())}enableUpdating(C){}disconnectedCallback(){this._$EO?.forEach(C=>C.hostDisconnected?.())}attributeChangedCallback(C,H,V){this._$AK(C,V)}_$ET(C,H){let V=this.constructor.elementProperties.get(C),e=this.constructor._$Eu(C,V);if(e!==void 0&&V.reflect===!0){let M=(V.converter?.toAttribute!==void 0?V.converter:d2).toAttribute(H,V.type);this._$Em=C,M==null?this.removeAttribute(e):this.setAttribute(e,M),this._$Em=null}}_$AK(C,H){let V=this.constructor,e=V._$Eh.get(C);if(e!==void 0&&this._$Em!==e){let M=V.getPropertyOptions(e),i=typeof M.converter=="function"?{fromAttribute:M.converter}:M.converter?.fromAttribute!==void 0?M.converter:d2;this._$Em=e;let A=i.fromAttribute(H,M.type);this[e]=A??this._$Ej?.get(e)??A,this._$Em=null}}requestUpdate(C,H,V,e=!1,M){if(C!==void 0){let i=this.constructor;if(e===!1&&(M=this[C]),V??=i.getPropertyOptions(C),!((V.hasChanged??G2)(M,H)||V.useDefault&&V.reflect&&M===this._$Ej?.get(C)&&!this.hasAttribute(i._$Eu(C,V))))return;this.C(C,H,V)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(C,H,{useDefault:V,reflect:e,wrapped:M},i){V&&!(this._$Ej??=new Map).has(C)&&(this._$Ej.set(C,i??H??this[C]),M!==!0||i!==void 0)||(this._$AL.has(C)||(this.hasUpdated||V||(H=void 0),this._$AL.set(C,H)),e===!0&&this._$Em!==C&&(this._$Eq??=new Set).add(C))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(H){Promise.reject(H)}let C=this.scheduleUpdate();return C!=null&&await C,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[e,M]of this._$Ep)this[e]=M;this._$Ep=void 0}let V=this.constructor.elementProperties;if(V.size>0)for(let[e,M]of V){let{wrapped:i}=M,A=this[e];i!==!0||this._$AL.has(e)||A===void 0||this.C(e,void 0,M,A)}}let C=!1,H=this._$AL;try{C=this.shouldUpdate(H),C?(this.willUpdate(H),this._$EO?.forEach(V=>V.hostUpdate?.()),this.update(H)):this._$EM()}catch(V){throw C=!1,this._$EM(),V}C&&this._$AE(H)}willUpdate(C){}_$AE(C){this._$EO?.forEach(H=>H.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(C)),this.updated(C)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(C){return!0}update(C){this._$Eq&&=this._$Eq.forEach(H=>this._$ET(H,this[H])),this._$EM()}updated(C){}firstUpdated(C){}};J.elementStyles=[],J.shadowRootOptions={mode:"open"},J[S1("elementProperties")]=new Map,J[S1("finalized")]=new Map,G5?.({ReactiveElement:J}),(F1.reactiveElementVersions??=[]).push("2.1.2");var x2=globalThis,Q2=r=>r,R1=x2.trustedTypes,z2=R1?R1.createPolicy("lit-html",{createHTML:r=>r}):void 0,J2="$lit$",e1=`lit$${Math.random().toFixed(9).slice(2)}$`,C5="?"+e1,Q5=`<${C5}>`,o1=document,g1=()=>o1.createComment(""),f1=r=>r===null||typeof r!="object"&&typeof r!="function",u2=Array.isArray,z5=r=>u2(r)||typeof r?.[Symbol.iterator]=="function",n2=`[ 	
\f\r]`,h1=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,j2=/-->/g,K2=/>/g,t1=RegExp(`>|${n2}(?:([^\\s"'>=/]+)(${n2}*=${n2}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),q2=/'/g,X2=/"/g,H5=/^(?:script|style|textarea|title)$/i,c2=r=>(C,...H)=>({_$litType$:r,strings:C,values:H}),t=c2(1),P=c2(2),l3=c2(3),a1=Symbol.for("lit-noChange"),o=Symbol.for("lit-nothing"),Y2=new WeakMap,i1=o1.createTreeWalker(o1,129);function V5(r,C){if(!u2(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return z2!==void 0?z2.createHTML(C):C}var j5=(r,C)=>{let H=r.length-1,V=[],e,M=C===2?"<svg>":C===3?"<math>":"",i=h1;for(let A=0;A<H;A++){let a=r[A],d,u,s=-1,h=0;for(;h<a.length&&(i.lastIndex=h,u=i.exec(a),u!==null);)h=i.lastIndex,i===h1?u[1]==="!--"?i=j2:u[1]!==void 0?i=K2:u[2]!==void 0?(H5.test(u[2])&&(e=RegExp("</"+u[2],"g")),i=t1):u[3]!==void 0&&(i=t1):i===t1?u[0]===">"?(i=e??h1,s=-1):u[1]===void 0?s=-2:(s=i.lastIndex-u[2].length,d=u[1],i=u[3]===void 0?t1:u[3]==='"'?X2:q2):i===X2||i===q2?i=t1:i===j2||i===K2?i=h1:(i=t1,e=void 0);let O=i===t1&&r[A+1].startsWith("/>")?" ":"";M+=i===h1?a+Q5:s>=0?(V.push(d),a.slice(0,s)+J2+a.slice(s)+e1+O):a+e1+(s===-2?A:O)}return[V5(r,M+(r[H]||"<?>")+(C===2?"</svg>":C===3?"</math>":"")),V]},O1=class r{constructor({strings:C,_$litType$:H},V){let e;this.parts=[];let M=0,i=0,A=C.length-1,a=this.parts,[d,u]=j5(C,H);if(this.el=r.createElement(d,V),i1.currentNode=this.el.content,H===2||H===3){let s=this.el.content.firstChild;s.replaceWith(...s.childNodes)}for(;(e=i1.nextNode())!==null&&a.length<A;){if(e.nodeType===1){if(e.hasAttributes())for(let s of e.getAttributeNames())if(s.endsWith(J2)){let h=u[i++],O=e.getAttribute(s).split(e1),k=/([.?@])?(.*)/.exec(h);a.push({type:1,index:M,name:k[2],strings:O,ctor:k[1]==="."?p2:k[1]==="?"?m2:k[1]==="@"?s2:l1}),e.removeAttribute(s)}else s.startsWith(e1)&&(a.push({type:6,index:M}),e.removeAttribute(s));if(H5.test(e.tagName)){let s=e.textContent.split(e1),h=s.length-1;if(h>0){e.textContent=R1?R1.emptyScript:"";for(let O=0;O<h;O++)e.append(s[O],g1()),i1.nextNode(),a.push({type:2,index:++M});e.append(s[h],g1())}}}else if(e.nodeType===8)if(e.data===C5)a.push({type:2,index:M});else{let s=-1;for(;(s=e.data.indexOf(e1,s+1))!==-1;)a.push({type:7,index:M}),s+=e1.length-1}M++}}static createElement(C,H){let V=o1.createElement("template");return V.innerHTML=C,V}};function n1(r,C,H=r,V){if(C===a1)return C;let e=V!==void 0?H._$Co?.[V]:H._$Cl,M=f1(C)?void 0:C._$litDirective$;return e?.constructor!==M&&(e?._$AO?.(!1),M===void 0?e=void 0:(e=new M(r),e._$AT(r,H,V)),V!==void 0?(H._$Co??=[])[V]=e:H._$Cl=e),e!==void 0&&(C=n1(r,e._$AS(r,C.values),e,V)),C}var l2=class{constructor(C,H){this._$AV=[],this._$AN=void 0,this._$AD=C,this._$AM=H}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(C){let{el:{content:H},parts:V}=this._$AD,e=(C?.creationScope??o1).importNode(H,!0);i1.currentNode=e;let M=i1.nextNode(),i=0,A=0,a=V[0];for(;a!==void 0;){if(i===a.index){let d;a.type===2?d=new b1(M,M.nextSibling,this,C):a.type===1?d=new a.ctor(M,a.name,a.strings,this,C):a.type===6&&(d=new v2(M,this,C)),this._$AV.push(d),a=V[++A]}i!==a?.index&&(M=i1.nextNode(),i++)}return i1.currentNode=o1,e}p(C){let H=0;for(let V of this._$AV)V!==void 0&&(V.strings!==void 0?(V._$AI(C,V,H),H+=V.strings.length-2):V._$AI(C[H])),H++}},b1=class r{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(C,H,V,e){this.type=2,this._$AH=o,this._$AN=void 0,this._$AA=C,this._$AB=H,this._$AM=V,this.options=e,this._$Cv=e?.isConnected??!0}get parentNode(){let C=this._$AA.parentNode,H=this._$AM;return H!==void 0&&C?.nodeType===11&&(C=H.parentNode),C}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(C,H=this){C=n1(this,C,H),f1(C)?C===o||C==null||C===""?(this._$AH!==o&&this._$AR(),this._$AH=o):C!==this._$AH&&C!==a1&&this._(C):C._$litType$!==void 0?this.$(C):C.nodeType!==void 0?this.T(C):z5(C)?this.k(C):this._(C)}O(C){return this._$AA.parentNode.insertBefore(C,this._$AB)}T(C){this._$AH!==C&&(this._$AR(),this._$AH=this.O(C))}_(C){this._$AH!==o&&f1(this._$AH)?this._$AA.nextSibling.data=C:this.T(o1.createTextNode(C)),this._$AH=C}$(C){let{values:H,_$litType$:V}=C,e=typeof V=="number"?this._$AC(C):(V.el===void 0&&(V.el=O1.createElement(V5(V.h,V.h[0]),this.options)),V);if(this._$AH?._$AD===e)this._$AH.p(H);else{let M=new l2(e,this),i=M.u(this.options);M.p(H),this.T(i),this._$AH=M}}_$AC(C){let H=Y2.get(C.strings);return H===void 0&&Y2.set(C.strings,H=new O1(C)),H}k(C){u2(this._$AH)||(this._$AH=[],this._$AR());let H=this._$AH,V,e=0;for(let M of C)e===H.length?H.push(V=new r(this.O(g1()),this.O(g1()),this,this.options)):V=H[e],V._$AI(M),e++;e<H.length&&(this._$AR(V&&V._$AB.nextSibling,e),H.length=e)}_$AR(C=this._$AA.nextSibling,H){for(this._$AP?.(!1,!0,H);C!==this._$AB;){let V=Q2(C).nextSibling;Q2(C).remove(),C=V}}setConnected(C){this._$AM===void 0&&(this._$Cv=C,this._$AP?.(C))}},l1=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(C,H,V,e,M){this.type=1,this._$AH=o,this._$AN=void 0,this.element=C,this.name=H,this._$AM=e,this.options=M,V.length>2||V[0]!==""||V[1]!==""?(this._$AH=Array(V.length-1).fill(new String),this.strings=V):this._$AH=o}_$AI(C,H=this,V,e){let M=this.strings,i=!1;if(M===void 0)C=n1(this,C,H,0),i=!f1(C)||C!==this._$AH&&C!==a1,i&&(this._$AH=C);else{let A=C,a,d;for(C=M[0],a=0;a<M.length-1;a++)d=n1(this,A[V+a],H,a),d===a1&&(d=this._$AH[a]),i||=!f1(d)||d!==this._$AH[a],d===o?C=o:C!==o&&(C+=(d??"")+M[a+1]),this._$AH[a]=d}i&&!e&&this.j(C)}j(C){C===o?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,C??"")}},p2=class extends l1{constructor(){super(...arguments),this.type=3}j(C){this.element[this.name]=C===o?void 0:C}},m2=class extends l1{constructor(){super(...arguments),this.type=4}j(C){this.element.toggleAttribute(this.name,!!C&&C!==o)}},s2=class extends l1{constructor(C,H,V,e,M){super(C,H,V,e,M),this.type=5}_$AI(C,H=this){if((C=n1(this,C,H,0)??o)===a1)return;let V=this._$AH,e=C===o&&V!==o||C.capture!==V.capture||C.once!==V.once||C.passive!==V.passive,M=C!==o&&(V===o||e);e&&this.element.removeEventListener(this.name,this,V),M&&this.element.addEventListener(this.name,this,C),this._$AH=C}handleEvent(C){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,C):this._$AH.handleEvent(C)}},v2=class{constructor(C,H,V){this.element=C,this.type=6,this._$AN=void 0,this._$AM=H,this.options=V}get _$AU(){return this._$AM._$AU}_$AI(C){n1(this,C)}};var K5=x2.litHtmlPolyfillSupport;K5?.(O1,b1),(x2.litHtmlVersions??=[]).push("3.3.3");var L5=(r,C,H)=>{let V=H?.renderBefore??C,e=V._$litPart$;if(e===void 0){let M=H?.renderBefore??null;V._$litPart$=e=new b1(C.insertBefore(g1(),M),M,void 0,H??{})}return e._$AI(r),e};var Z2=globalThis,f=class extends J{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let C=super.createRenderRoot();return this.renderOptions.renderBefore??=C.firstChild,C}update(C){let H=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(C),this._$Do=L5(H,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return a1}};f._$litElement$=!0,f.finalized=!0,Z2.litElementHydrateSupport?.({LitElement:f});var q5=Z2.litElementPolyfillSupport;q5?.({LitElement:f});(Z2.litElementVersions??=[]).push("4.2.2");var _="carbu",p1=r=>r.callWS({type:`${_}/vehicles`}),e5=(r,C)=>r.callWS({type:`${_}/dashboard`,vehicle_id:C}),E1=r=>r.callWS({type:`${_}/categories`}),M5=(r,C)=>r.callWS({type:`${_}/fuel/defaults`,vehicle_id:C}),r5=(r,C,H={})=>r.callWS({type:`${_}/fuel/list`,vehicle_id:C,...H}),t5=(r,C,H)=>r.callWS({type:`${_}/fuel/save`,vehicle_id:C,...H}),D1=(r,C,H)=>r.callWS({type:`${_}/fuel/delete`,vehicle_id:C,entry_id:H}),i5=(r,C,H={})=>r.callWS({type:`${_}/expense/list`,vehicle_id:C,...H}),o5=(r,C,H)=>r.callWS({type:`${_}/expense/save`,vehicle_id:C,...H}),N1=(r,C,H)=>r.callWS({type:`${_}/expense/delete`,vehicle_id:C,expense_id:H}),S2=(r,C)=>`/api/${_}/attachment/${encodeURIComponent(r)}/${encodeURIComponent(C)}`;async function a5(r,C,H,V){let e=new FormData;e.append("file",V);let M=await r.fetchWithAuth(S2(C,H),{method:"POST",body:e});if(!M.ok){let i=String(M.status);try{i=(await M.json()).code??i}catch{}throw new Error(i)}}async function A5(r,C,H){await r.fetchWithAuth(S2(C,H),{method:"DELETE"})}async function d5(r,C,H){let{path:V}=await r.callWS({type:"auth/sign_path",path:S2(C,H),expires:30});return V}var W1=(r,C)=>r.connection.subscribeMessage(()=>C(),{type:`${_}/subscribe`}),n5=(r,C)=>r.callWS({type:`${_}/reminders`,vehicle_id:C}),l5=(r,C,H)=>r.callWS({type:`${_}/reminder/save`,vehicle_id:C,...H}),p5=(r,C,H)=>r.callWS({type:`${_}/reminder/delete`,vehicle_id:C,reminder_id:H}),m5=(r,C,H)=>r.callWS({type:`${_}/reminder/done`,vehicle_id:C,reminder_id:H}),s5=(r,C,H)=>r.callWS({type:`${_}/stats`,vehicle_id:C,period:H});async function h2(r,C,H,V){let e=new FormData;e.append("file",H);let M=`/api/${_}/import/${encodeURIComponent(C)}${V?"?apply=1":""}`,i=await r.fetchWithAuth(M,{method:"POST",body:e}),A=await i.json().catch(()=>({}));if(!i.ok)throw new Error(String(A.code??i.status));return A}var v5=(r,C)=>r.callWS({type:`${_}/recurring`,vehicle_id:C}),x5=(r,C,H)=>r.callWS({type:`${_}/recurring/save`,vehicle_id:C,...H}),u5=(r,C,H)=>r.callWS({type:`${_}/recurring/delete`,vehicle_id:C,recurring_id:H}),c5=(r,C)=>r.callWS({type:`${_}/export`,vehicle_id:C});var l=r=>t`<svg class="mdi" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d=${r}></path>
  </svg>`;var I1=g`
  dl.kpis {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 10px;
    margin: 0;
  }
  .kpi {
    --c: var(--group-color, var(--vl-accent));
    position: relative;
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-areas:
      "chip value"
      "chip label";
    align-items: center;
    column-gap: 10px;
    padding: 10px 12px;
    margin: 0;
    border-radius: 14px;
    background: var(--vl-surface);
    border: 1px solid transparent;
    transition:
      transform 0.18s ease,
      border-color 0.18s ease,
      background-color 0.18s ease;
  }
  .kpi:hover {
    transform: translateY(-2px);
    border-color: color-mix(in srgb, var(--c) 45%, transparent);
    background: color-mix(in srgb, var(--c) 7%, transparent);
  }
  .kpi.no-chip {
    grid-template-columns: 1fr;
    grid-template-areas:
      "value"
      "label";
  }
  .chip {
    grid-area: chip;
    width: 36px;
    height: 36px;
    border-radius: 11px;
    display: grid;
    place-items: center;
    color: var(--c);
    background: color-mix(in srgb, var(--c) 18%, transparent);
  }
  /* La puce est dans le <dt> (HTML valide) ; display: contents en fait un
     élément de la grille. */
  .kpi dt {
    display: contents;
  }
  .kpi .label {
    grid-area: label;
    font-size: 0.8125rem;
    color: var(--vl-muted);
    min-width: 0;
  }
  .kpi dd {
    grid-area: value;
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    line-height: 1.25;
    font-variant-numeric: tabular-nums;
    min-width: 0;
    overflow-wrap: anywhere;
  }
  .kpi dd small {
    font-size: 0.8125rem;
    font-weight: 400;
    color: var(--vl-muted);
  }
  .kpi.main {
    grid-column: 1 / -1;
    background:
      linear-gradient(
        135deg,
        color-mix(in srgb, var(--c) 16%, transparent),
        color-mix(in srgb, var(--c) 4%, transparent)
      );
  }
  .kpi.main dd {
    font-size: 1.6rem;
  }
`;function M1(r,C,H="",V={}){let e=[V.color?`--c:${V.color}`:"",V.index!==void 0?`--i:${V.index}`:""].filter(Boolean).join(";"),M=["kpi","rise",V.main?"main":"",V.icon?"":"no-chip"].filter(Boolean).join(" ");return t`<div class=${M} style=${e}>
    <dt>
      ${V.icon?t`<span class="chip" aria-hidden="true">${l(V.icon)}</span>`:o}<span class="label">${r}</span>
    </dt>
    <dd>${C}${H?t` <small>${H}</small>`:o}</dd>
  </div>`}var X5={"card.name":"Carbu \xB7 carnet de bord","card.description":"Vue d'ensemble, saisie rapide d'un plein, d\xE9penses mensuelles.","journal.name":"Carbu \xB7 journal du v\xE9hicule","journal.description":"Pleins et d\xE9penses : liste filtrable, modification, suppression.","common.loading":"Chargement\u2026","common.no_vehicle":"Aucun v\xE9hicule. Ajoutez-en un depuis la page de l'int\xE9gration Carbu.","common.not_loaded":"L'int\xE9gration Carbu n'est pas charg\xE9e.","common.cancel":"Annuler","last_fill.title":"Dernier plein","next_fill.title":"Prochain plein estim\xE9","next_fill.unknown":"Encore quelques pleins et Carbu saura estimer le prochain (il faut 3 pleins et une semaine de relev\xE9s).","next_fill.in_days":"Dans {days} jour(s)","next_fill.today":"Aujourd'hui","next_fill.overdue":"Plein attendu : vous roulez plus que d'habitude","next_fill.around":"vers {odometer}","next_fill.progress":"{percent} % de la distance habituelle entre deux pleins parcourue","next_fill.basis":"D'apr\xE8s vos habitudes : un plein tous les {interval}, {rate} par jour.","editor.show_next_fill":"Afficher le prochain plein estim\xE9","last_fill.distance":"Parcourus depuis le plein pr\xE9c\xE9dent","last_fill.consumption":"Consommation","last_fill.worse":"+{value} par rapport \xE0 la moyenne","last_fill.better":"\u2212{value} par rapport \xE0 la moyenne","last_fill.partial":"Plein partiel : la consommation sera calcul\xE9e au prochain plein complet.","fuel.grade":"Carburant \xE0 la pompe","fuel.grade_unknown":"Non pr\xE9cis\xE9","stats.group_carbon":"Bilan carbone","stats.co2_total":"\xC9missions de la p\xE9riode","stats.co2_per_distance":"Par {unit}","stats.co2_per_month":"Par mois","stats.co2_source":"\xC9missions calcul\xE9es \xE0 partir des quantit\xE9s r\xE9ellement achet\xE9es et des facteurs de l'ADEME (Base Empreinte, combustion et production du carburant).","stats.price_change":"\xC9volution du prix","stats.price_curve":"Prix du carburant","stats.price_point":"Prix pay\xE9","stats.price_empty":"Pas encore de plein sur la p\xE9riode.","stats.price_summary":"Prix pay\xE9 \xE0 {count} pleins, du {start} au {end}.","stats.grade_unknown":"Qualit\xE9 non pr\xE9cis\xE9e","stats.group_consumption":"Consommation","stats.group_distance":"Distance","stats.group_costs":"Co\xFBts","stats.best":"Meilleur plein","stats.worst":"Moins bon plein","stats.distance_per_fill":"Moyenne entre deux pleins","stats.per_month":"Par mois","stats.avg_price":"Prix moyen ({unit})","panel.vehicle":"V\xE9hicule","panel.sections":"Sections de la page","panel.section_overview":"Aper\xE7u","panel.section_journal":"Journal","panel.section_stats":"Statistiques","panel.version":"Carbu {version}","panel.outdated":"Cette page affiche Carbu {page}, mais Home Assistant ex\xE9cute Carbu {server}. Si vous venez de mettre \xE0 jour Carbu, red\xE9marrez Home Assistant, puis rechargez cette page.","panel.reload":"Recharger la page","panel.stats":"Statistiques","panel.journal":"Journal","panel.no_vehicle":"Aucun v\xE9hicule pour l'instant.","panel.open_integration":"Ajouter un v\xE9hicule depuis la page de l'int\xE9gration Carbu.","common.save":"Enregistrer","common.delete":"Supprimer","common.edit":"Modifier","common.close":"Fermer","common.more":"Plus d'options","common.load_more":"Afficher plus","common.none":"Aucune entr\xE9e.","common.error":"Erreur : {message}","common.optional":"facultatif","action.add_fuel":"Plein","action.add_expense":"D\xE9pense","action.add_fuel_long":"Ajouter un plein","action.add_expense_long":"Ajouter une d\xE9pense","tile.consumption":"Consommation moyenne","tile.month_cost":"Co\xFBt du mois","tile.cost_per_distance":"Co\xFBt par {unit}","tile.odometer":"Kilom\xE9trage","tile.distance_month":"Distance ce mois-ci","section.recent_fuel":"Derniers pleins","section.recent_expenses":"Derni\xE8res d\xE9penses","section.monthly":"D\xE9penses mensuelles","chart.total":"Total","chart.empty":"Aucune d\xE9pense sur la p\xE9riode.","chart.summary":"D\xE9penses des {count} derniers mois, empil\xE9es par cat\xE9gorie.","chart.month":"Mois","fuel.title_new":"Nouveau plein","fuel.title_edit":"Modifier le plein","fuel.odometer":"Kilom\xE9trage ({unit})","fuel.volume":"Quantit\xE9 ({unit})","fuel.total":"Montant ({currency})","fuel.unit_price":"Prix unitaire ({currency}/{unit})","fuel.computed":"Calcul\xE9 automatiquement","fuel.full_tank":"Plein complet","fuel.partial":"partiel","fuel.date":"Date","fuel.time":"Heure","fuel.fuel_type":"Carburant","fuel.station":"Station","fuel.notes":"Notes","fuel.need_two":"Saisissez au moins deux valeurs parmi quantit\xE9, montant et prix unitaire.","fuel.warnings":"V\xE9rifiez la saisie :","fuel.save_anyway":"Enregistrer quand m\xEAme","fuel.delete_confirm":"Supprimer le plein du {date} ? Les calculs seront mis \xE0 jour.","expense.title_new":"Nouvelle d\xE9pense","expense.title_edit":"Modifier la d\xE9pense","expense.amount":"Montant ({currency})","expense.category":"Cat\xE9gorie","expense.odometer":"Kilom\xE9trage ({unit})","expense.description":"Description","expense.attachment":"Pi\xE8ce jointe (photo ou PDF, 10 Mo max)","expense.attachment_view":"Voir la pi\xE8ce jointe","expense.attachment_remove":"Retirer la pi\xE8ce jointe","expense.attachment_error":"La pi\xE8ce jointe n'a pas \xE9t\xE9 enregistr\xE9e ({code}).","expense.delete_confirm":"Supprimer la d\xE9pense du {date} ({amount}) ?","journal.tab_fuel":"Pleins","journal.tab_expenses":"D\xE9penses","journal.filters":"Filtres","journal.from":"Du","journal.to":"Au","journal.min":"Montant min.","journal.max":"Montant max.","journal.categories":"Cat\xE9gories","journal.all":"Toutes","journal.reset":"R\xE9initialiser","journal.count":"{count} entr\xE9e(s), total {sum}","journal.period_month":"Ce mois-ci","journal.period_3m":"3 mois","journal.period_year":"Cette ann\xE9e","journal.period_all":"Tout","fuel_type.gasoline":"Essence","fuel_type.diesel":"Diesel","fuel_type.lpg":"GPL","fuel_type.cng":"GNV","category.fuel":"Carburant","warning.odometer_below_previous":"Kilom\xE9trage inf\xE9rieur au relev\xE9 pr\xE9c\xE9dent ({previous} {unit}).","warning.odometer_above_next":"Kilom\xE9trage sup\xE9rieur au relev\xE9 suivant ({next} {unit}).","warning.consumption_out_of_range":"Consommation de {value} {consumption}, hors de la plage pr\xE9vue ({min} \u2013 {max}).","warning.volume_exceeds_tank":"Quantit\xE9 sup\xE9rieure \xE0 la capacit\xE9 du r\xE9servoir ({capacity} {volume}).","warning.fuel_not_supported":"Ce carburant n'est pas d\xE9clar\xE9 pour le v\xE9hicule.","warning.amount_mismatch":"Montant diff\xE9rent de quantit\xE9 \xD7 prix ({expected}).","editor.vehicle":"V\xE9hicule","editor.title":"Titre","editor.show_chart":"Afficher l'histogramme mensuel","editor.show_recent":"Afficher les derni\xE8res entr\xE9es","reminders.title":"Rappels","reminders.add":"Rappel","reminders.add_long":"Ajouter un rappel","reminders.none":"Aucun rappel.","reminders.done":"Fait","reminders.done_long":"Marquer \xAB {label} \xBB comme fait","reminders.done_confirm":"Marquer \xAB {label} \xBB comme fait aujourd'hui ? {next}","reminders.next_recurring":"La prochaine \xE9ch\xE9ance sera calcul\xE9e automatiquement.","reminders.next_once":"Ce rappel non r\xE9current sera ensuite d\xE9sactiv\xE9.","reminders.delete_confirm":"Supprimer le rappel \xAB {label} \xBB ?","reminders.state_ok":"\xC0 jour","reminders.state_alert":"Bient\xF4t","reminders.state_due":"D\xFB","reminders.state_inactive":"Fait","reminders.left_days":"dans {days} j","reminders.late_days":"en retard de {days} j","reminders.left_distance":"dans {distance} {unit}","reminders.late_distance":"d\xE9pass\xE9 de {distance} {unit}","reminders.every":"tous les {value}","reminder.title_new":"Nouveau rappel","reminder.title_edit":"Modifier le rappel","reminder.label":"Libell\xE9","reminder.kind":"D\xE9clenchement","reminder.kind_date":"\xC0 une date","reminder.kind_distance":"\xC0 un kilom\xE9trage","reminder.kind_both":"Date ou kilom\xE9trage (le premier atteint)","reminder.due_date":"Date d'\xE9ch\xE9ance","reminder.due_odometer":"Kilom\xE9trage d'\xE9ch\xE9ance ({unit})","reminder.alert_days":"Alerter \u2026 jours avant","reminder.alert_distance":"Alerter \u2026 {unit} avant","reminder.interval_days":"R\xE9p\xE9ter tous les \u2026 jours","reminder.interval_distance":"R\xE9p\xE9ter tous les \u2026 {unit}","reminder.recurrence_hint":"Laissez vide pour un rappel unique.","stats.name":"Carbu \xB7 statistiques","stats.description":"Statistiques par p\xE9riode et courbe de consommation par plein.","stats.period":"P\xE9riode","stats.period_30d":"30 jours","stats.period_3m":"3 mois","stats.period_12m":"12 mois","stats.period_all":"Depuis l'acquisition","stats.distance":"Distance","stats.consumption":"Consommation moyenne","stats.fuel_cost":"Carburant","stats.expense_cost":"Autres d\xE9penses","stats.total_cost":"Co\xFBt total","stats.cost_per_distance":"Co\xFBt par {unit}","stats.fills":"Pleins","stats.volume":"Quantit\xE9","stats.curve":"Consommation par plein","stats.curve_point":"Plein","stats.moving_average":"Moyenne mobile ({count} pleins)","stats.curve_empty":"Pas encore de consommation mesur\xE9e sur la p\xE9riode (il faut deux pleins complets).","stats.curve_summary":"Consommation de {count} pleins entre le {start} et le {end}.","stats.by_category":"D\xE9penses par cat\xE9gorie","editor.show_reminders":"Afficher les rappels","editor.show_recurring":"Afficher les d\xE9penses r\xE9currentes","editor.period":"P\xE9riode par d\xE9faut","import.button":"Importer","import.button_long":"Importer un fichier CSV","import.title":"Importer un fichier CSV","import.help":"Fichiers produits par l'export (pleins, d\xE9penses, relev\xE9s, rappels), y compris apr\xE8s modification dans un tableur. Rien n'est enregistr\xE9 avant votre confirmation.","import.file":"Fichier CSV","import.analyzing":"Analyse du fichier\u2026","import.kind_fuel":"Pleins","import.kind_expenses":"D\xE9penses","import.kind_odometer":"Relev\xE9s du compteur","import.kind_reminders":"Rappels","import.summary":"{kind} : {new} nouvelle(s) ligne(s), {duplicate} d\xE9j\xE0 pr\xE9sente(s), {error} en erreur.","import.new_categories":"Cat\xE9gories qui seront cr\xE9\xE9es : {names}.","import.status_new":"Nouveau","import.status_duplicate":"Doublon","import.status_error":"Erreur","import.line":"Ligne {line}","import.truncated":"Seules les 200 premi\xE8res lignes sont affich\xE9es.","import.confirm":"Importer {count} ligne(s)","import.done":"{count} ligne(s) import\xE9e(s).","import.error_unknown_format":"Format non reconnu : utilisez un fichier produit par l'export.","import.error_empty":"Le fichier est vide.","import.error_too_large":"Le fichier est trop volumineux (5 Mo au plus).","import.error_too_many_rows":"Le fichier contient trop de lignes (20 000 au plus).","recurring.title":"D\xE9penses r\xE9currentes","recurring.add":"R\xE9currence","recurring.add_long":"Ajouter une d\xE9pense r\xE9currente","recurring.none":"Aucune d\xE9pense r\xE9currente (abonnement, assurance au mois\u2026).","recurring.title_new":"Nouvelle d\xE9pense r\xE9currente","recurring.title_edit":"Modifier la d\xE9pense r\xE9currente","recurring.label":"Libell\xE9","recurring.interval":"P\xE9riodicit\xE9","recurring.interval_1":"Tous les mois","recurring.interval_2":"Tous les 2 mois","recurring.interval_3":"Tous les trimestres","recurring.interval_6":"Tous les 6 mois","recurring.interval_12":"Tous les ans","recurring.start":"Premi\xE8re \xE9ch\xE9ance","recurring.end":"Derni\xE8re \xE9ch\xE9ance","recurring.active":"Active","recurring.help":"\xC0 chaque \xE9ch\xE9ance, la d\xE9pense est ajout\xE9e automatiquement au journal. Les \xE9ch\xE9ances d\xE9j\xE0 pass\xE9es sont ajout\xE9es d\xE8s l'enregistrement.","recurring.next":"Prochaine : {date}","recurring.ended":"Termin\xE9e","recurring.paused":"En pause","recurring.per_month":"{amount}/mois","recurring.total_month":"Total : {amount} par mois","recurring.delete_confirm":"Supprimer la d\xE9pense r\xE9currente \xAB {label} \xBB ? Les d\xE9penses d\xE9j\xE0 ajout\xE9es au journal sont conserv\xE9es.","recurring.badge":"R\xE9currente","export.button":"Exporter","export.button_long":"Exporter les donn\xE9es en CSV","export.title":"Exporter en CSV","export.help":"Fichiers au format de l'import (s\xE9parateur \xAB ; \xBB, UTF-8), lisibles dans un tableur.","export.file_pleins":"Pleins","export.file_depenses":"D\xE9penses","export.file_depenses_recurrentes":"D\xE9penses r\xE9currentes","export.file_releves":"Relev\xE9s du compteur","export.file_rappels":"Rappels","export.lines":"{count} ligne(s)","export.download":"T\xE9l\xE9charger","export.download_all":"Tout t\xE9l\xE9charger","stats.cost_curve":"Co\xFBt au {unit}","stats.cost_curve_total":"Tout compris","stats.cost_curve_fuel":"Carburant seul","stats.cost_curve_note":"Cumul\xE9 depuis le d\xE9but du carnet : total des pleins et d\xE9penses \xF7 distance parcourue.","stats.odometer_curve":"Compteur","stats.odometer_label":"Kilom\xE9trage","stats.line_empty":"Pas assez de donn\xE9es sur la p\xE9riode.","stats.line_summary":"{name} : {count} points, du {start} au {end}."},Y5={"card.name":"Carbu \xB7 vehicle log","card.description":"Overview, quick fill-up entry, monthly expenses.","journal.name":"Carbu \xB7 vehicle journal","journal.description":"Fill-ups and expenses: filterable list, edit, delete.","common.loading":"Loading\u2026","last_fill.title":"Last fill-up","next_fill.title":"Estimated next fill-up","next_fill.unknown":"A few more fill-ups and Carbu will estimate the next one (3 fill-ups and a week of readings are needed).","next_fill.in_days":"In {days} day(s)","next_fill.today":"Today","next_fill.overdue":"Fill-up expected: you are driving more than usual","next_fill.around":"around {odometer}","next_fill.progress":"{percent}% of the usual distance between fill-ups driven","next_fill.basis":"Based on your habits: a fill-up every {interval}, {rate} per day.","editor.show_next_fill":"Show the estimated next fill-up","last_fill.distance":"Driven since the previous fill-up","last_fill.consumption":"Consumption","last_fill.worse":"+{value} vs average","last_fill.better":"\u2212{value} vs average","last_fill.partial":"Partial fill-up: consumption will be computed at the next full tank.","fuel.grade":"Pump fuel","fuel.grade_unknown":"Not specified","stats.group_carbon":"Carbon footprint","stats.co2_total":"Emissions over the period","stats.co2_per_distance":"Per {unit}","stats.co2_per_month":"Per month","stats.co2_source":"Emissions computed from the quantities actually bought and ADEME factors (Base Empreinte, combustion and fuel production).","stats.price_change":"Price change","stats.price_curve":"Fuel price","stats.price_point":"Price paid","stats.price_empty":"No fill-up in this period yet.","stats.price_summary":"Price paid at {count} fill-ups, from {start} to {end}.","stats.grade_unknown":"Grade not specified","stats.group_consumption":"Consumption","stats.group_distance":"Distance","stats.group_costs":"Costs","stats.best":"Best fill-up","stats.worst":"Worst fill-up","stats.distance_per_fill":"Average between fill-ups","stats.per_month":"Per month","stats.avg_price":"Average price ({unit})","panel.vehicle":"Vehicle","panel.sections":"Page sections","panel.section_overview":"Overview","panel.section_journal":"Journal","panel.section_stats":"Statistics","panel.version":"Carbu {version}","panel.outdated":"This page shows Carbu {page}, but Home Assistant is running Carbu {server}. If you just updated Carbu, restart Home Assistant, then reload this page.","panel.reload":"Reload page","panel.stats":"Statistics","panel.journal":"Journal","panel.no_vehicle":"No vehicle yet.","panel.open_integration":"Add a vehicle from the Carbu integration page.","common.no_vehicle":"No vehicle. Add one from the Carbu integration page.","common.not_loaded":"The Carbu integration is not loaded.","common.cancel":"Cancel","common.save":"Save","common.delete":"Delete","common.edit":"Edit","common.close":"Close","common.more":"More options","common.load_more":"Show more","common.none":"No entries.","common.error":"Error: {message}","common.optional":"optional","action.add_fuel":"Fill-up","action.add_expense":"Expense","action.add_fuel_long":"Add a fill-up","action.add_expense_long":"Add an expense","tile.consumption":"Average consumption","tile.month_cost":"Cost this month","tile.cost_per_distance":"Cost per {unit}","tile.odometer":"Odometer","tile.distance_month":"Distance this month","section.recent_fuel":"Latest fill-ups","section.recent_expenses":"Latest expenses","section.monthly":"Monthly expenses","chart.total":"Total","chart.empty":"No expenses in this period.","chart.summary":"Expenses over the last {count} months, stacked by category.","chart.month":"Month","fuel.title_new":"New fill-up","fuel.title_edit":"Edit fill-up","fuel.odometer":"Odometer ({unit})","fuel.volume":"Quantity ({unit})","fuel.total":"Amount ({currency})","fuel.unit_price":"Unit price ({currency}/{unit})","fuel.computed":"Computed automatically","fuel.full_tank":"Full tank","fuel.partial":"partial","fuel.date":"Date","fuel.time":"Time","fuel.fuel_type":"Fuel","fuel.station":"Station","fuel.notes":"Notes","fuel.need_two":"Enter at least two of quantity, amount and unit price.","fuel.warnings":"Please check:","fuel.save_anyway":"Save anyway","fuel.delete_confirm":"Delete the fill-up of {date}? Figures will be recalculated.","expense.title_new":"New expense","expense.title_edit":"Edit expense","expense.amount":"Amount ({currency})","expense.category":"Category","expense.odometer":"Odometer ({unit})","expense.description":"Description","expense.attachment":"Attachment (photo or PDF, 10 MB max)","expense.attachment_view":"View attachment","expense.attachment_remove":"Remove attachment","expense.attachment_error":"The attachment was not saved ({code}).","expense.delete_confirm":"Delete the expense of {date} ({amount})?","journal.tab_fuel":"Fill-ups","journal.tab_expenses":"Expenses","journal.filters":"Filters","journal.from":"From","journal.to":"To","journal.min":"Min. amount","journal.max":"Max. amount","journal.categories":"Categories","journal.all":"All","journal.reset":"Reset","journal.count":"{count} entries, total {sum}","journal.period_month":"This month","journal.period_3m":"3 months","journal.period_year":"This year","journal.period_all":"All","fuel_type.gasoline":"Petrol","fuel_type.diesel":"Diesel","fuel_type.lpg":"LPG","fuel_type.cng":"CNG","category.fuel":"Fuel","warning.odometer_below_previous":"Odometer below the previous reading ({previous} {unit}).","warning.odometer_above_next":"Odometer above the next reading ({next} {unit}).","warning.consumption_out_of_range":"Consumption of {value} {consumption}, outside the expected range ({min} \u2013 {max}).","warning.volume_exceeds_tank":"Quantity larger than the tank capacity ({capacity} {volume}).","warning.fuel_not_supported":"This fuel is not declared for the vehicle.","warning.amount_mismatch":"Amount differs from quantity \xD7 price ({expected}).","editor.vehicle":"Vehicle","editor.title":"Title","editor.show_chart":"Show monthly chart","editor.show_recent":"Show latest entries","reminders.title":"Reminders","reminders.add":"Reminder","reminders.add_long":"Add a reminder","reminders.none":"No reminders.","reminders.done":"Done","reminders.done_long":"Mark \u201C{label}\u201D as done","reminders.done_confirm":"Mark \u201C{label}\u201D as done today? {next}","reminders.next_recurring":"The next due date will be calculated automatically.","reminders.next_once":"This one-off reminder will then be deactivated.","reminders.delete_confirm":"Delete the reminder \u201C{label}\u201D?","reminders.state_ok":"Up to date","reminders.state_alert":"Soon","reminders.state_due":"Due","reminders.state_inactive":"Done","reminders.left_days":"in {days} d","reminders.late_days":"{days} d overdue","reminders.left_distance":"in {distance} {unit}","reminders.late_distance":"{distance} {unit} overdue","reminders.every":"every {value}","reminder.title_new":"New reminder","reminder.title_edit":"Edit reminder","reminder.label":"Label","reminder.kind":"Trigger","reminder.kind_date":"On a date","reminder.kind_distance":"At an odometer reading","reminder.kind_both":"Date or odometer (whichever comes first)","reminder.due_date":"Due date","reminder.due_odometer":"Due odometer ({unit})","reminder.alert_days":"Alert \u2026 days before","reminder.alert_distance":"Alert \u2026 {unit} before","reminder.interval_days":"Repeat every \u2026 days","reminder.interval_distance":"Repeat every \u2026 {unit}","reminder.recurrence_hint":"Leave empty for a one-off reminder.","stats.name":"Carbu \xB7 statistics","stats.description":"Statistics by period and consumption per fill-up.","stats.period":"Period","stats.period_30d":"30 days","stats.period_3m":"3 months","stats.period_12m":"12 months","stats.period_all":"Since acquisition","stats.distance":"Distance","stats.consumption":"Average consumption","stats.fuel_cost":"Fuel","stats.expense_cost":"Other expenses","stats.total_cost":"Total cost","stats.cost_per_distance":"Cost per {unit}","stats.fills":"Fill-ups","stats.volume":"Quantity","stats.curve":"Consumption per fill-up","stats.curve_point":"Fill-up","stats.moving_average":"Moving average ({count} fill-ups)","stats.curve_empty":"No consumption measured in this period yet (two full fill-ups are needed).","stats.curve_summary":"Consumption of {count} fill-ups between {start} and {end}.","stats.by_category":"Expenses by category","editor.show_reminders":"Show reminders","editor.show_recurring":"Show recurring expenses","editor.period":"Default period","import.button":"Import","import.button_long":"Import a CSV file","import.title":"Import a CSV file","import.help":"Files produced by the export (fill-ups, expenses, odometer readings, reminders), even after editing in a spreadsheet. Nothing is saved before you confirm.","import.file":"CSV file","import.analyzing":"Analysing the file\u2026","import.kind_fuel":"Fill-ups","import.kind_expenses":"Expenses","import.kind_odometer":"Odometer readings","import.kind_reminders":"Reminders","import.summary":"{kind}: {new} new line(s), {duplicate} already present, {error} with errors.","import.new_categories":"Categories that will be created: {names}.","import.status_new":"New","import.status_duplicate":"Duplicate","import.status_error":"Error","import.line":"Line {line}","import.truncated":"Only the first 200 lines are shown.","import.confirm":"Import {count} line(s)","import.done":"{count} line(s) imported.","import.error_unknown_format":"Unrecognised format: use a file produced by the export.","import.error_empty":"The file is empty.","import.error_too_large":"The file is too large (5 MB max).","import.error_too_many_rows":"The file has too many lines (20,000 max).","recurring.title":"Recurring expenses","recurring.add":"Recurring","recurring.add_long":"Add a recurring expense","recurring.none":"No recurring expenses (subscription, monthly insurance\u2026).","recurring.title_new":"New recurring expense","recurring.title_edit":"Edit recurring expense","recurring.label":"Label","recurring.interval":"Frequency","recurring.interval_1":"Every month","recurring.interval_2":"Every 2 months","recurring.interval_3":"Every quarter","recurring.interval_6":"Every 6 months","recurring.interval_12":"Every year","recurring.start":"First due date","recurring.end":"Last due date","recurring.active":"Active","recurring.help":"On each due date the expense is added to the log automatically. Past due dates are added as soon as you save.","recurring.next":"Next: {date}","recurring.ended":"Ended","recurring.paused":"Paused","recurring.per_month":"{amount}/month","recurring.total_month":"Total: {amount} per month","recurring.delete_confirm":"Delete the recurring expense \u201C{label}\u201D? Expenses already added to the log are kept.","recurring.badge":"Recurring","export.button":"Export","export.button_long":"Export data as CSV","export.title":"Export as CSV","export.help":"Files in the import format (\u201C;\u201D separator, UTF-8), readable in a spreadsheet.","export.file_pleins":"Fill-ups","export.file_depenses":"Expenses","export.file_depenses_recurrentes":"Recurring expenses","export.file_releves":"Odometer readings","export.file_rappels":"Reminders","export.lines":"{count} row(s)","export.download":"Download","export.download_all":"Download all","stats.cost_curve":"Cost per {unit}","stats.cost_curve_total":"All costs","stats.cost_curve_fuel":"Fuel only","stats.cost_curve_note":"Cumulative since the start of the log: total fill-ups and expenses \xF7 distance driven.","stats.odometer_curve":"Odometer","stats.odometer_label":"Odometer","stats.line_empty":"Not enough data for this period.","stats.line_summary":"{name}: {count} points, from {start} to {end}."};function r1(r){return r?.locale?.language??r?.language??"en"}function L(r,C,H={}){return(r1(r).startsWith("fr")?X5:Y5)[C].replace(/\{(\w+)\}/g,(e,M)=>M in H?String(H[M]):`{${M}}`)}function p(r,C,H=0){return C==null||Number.isNaN(C)?"\u2014":new Intl.NumberFormat(r1(r),{minimumFractionDigits:H,maximumFractionDigits:H}).format(C)}function S(r,C,H,V=2){if(C==null)return"\u2014";try{return new Intl.NumberFormat(r1(r),{style:"currency",currency:H,minimumFractionDigits:V,maximumFractionDigits:V}).format(C)}catch{return`${p(r,C,V)} ${H}`}}function Z(r,C){let[H,V,e]=C.split("-").map(Number);return new Intl.DateTimeFormat(r1(r),{dateStyle:"medium"}).format(new Date(H,V-1,e))}function Z5(r,C){let[H,V]=C.split("-").map(Number);return new Intl.DateTimeFormat(r1(r),{month:"short"}).format(new Date(H,V-1,1))}function y1(r,C){let[H,V]=C.split("-").map(Number);return new Intl.DateTimeFormat(r1(r),{month:"long",year:"numeric"}).format(new Date(H,V-1,1))}function X(r=0){let C=new Date;return C.setDate(C.getDate()+r),_1(C)}function _1(r){let C=H=>String(H).padStart(2,"0");return`${r.getFullYear()}-${C(r.getMonth()+1)}-${C(r.getDate())}`}function g2(r,C){let H=10**C;return Math.round((r+Number.EPSILON)*H)/H}function R(r){let C=r.trim().replace(/\s/g,"").replace(",",".");if(C==="")return null;let H=Number(C);return Number.isFinite(H)?H:null}function D(r,C,H){let V=String(g2(C,H));return new Intl.NumberFormat(r1(r)).format(1.5).charAt(1)===","?V.replace(".",","):V}var S5=["e10","sp95","sp98"];function U(r){return r?{e10:"SP95-E10",sp95:"SP95",sp98:"SP98"}[r]:""}function f2(r,C){return C==null?{value:"\u2014",unit:"kg CO\u2082e"}:Math.abs(C)>=1e3?{value:p(r,C/1e3,2),unit:"t CO\u2082e"}:{value:p(r,C,0),unit:"kg CO\u2082e"}}function U1(r,C,H,V){let e=C.units.volume[H.fuel_type]??"L",M=[`${p(r,H.odometer,0)} ${C.units.distance}`];return H.distance!=null&&M.push(`+${p(r,H.distance,0)} ${C.units.distance}`),H.consumption!=null&&M.push(`${p(r,H.consumption,2)} ${C.units.consumption[H.fuel_type]??""}`),M.push(`${S(r,H.unit_price,V,3)}/${e}`),H.station&&M.push(H.station),M.join(" \xB7 ")}var O2="M10 21H14C14 22.1 13.1 23 12 23S10 22.1 10 21M21 19V20H3V19L5 17V11C5 7.9 7 5.2 10 4.3V4C10 2.9 10.9 2 12 2S14 2.9 14 4V4.3C17 5.2 19 7.9 19 11V17L21 19M17 11C17 8.2 14.8 6 12 6S7 8.2 7 11V18H17V11Z";var b2="M15,13H16.5V15.82L18.94,17.23L18.19,18.53L15,16.69V13M19,8H5V19H9.67C9.24,18.09 9,17.07 9,16A7,7 0 0,1 16,9C17.07,9 18.09,9.24 19,9.67V8M5,21C3.89,21 3,20.1 3,19V5C3,3.89 3.89,3 5,3H6V1H8V3H16V1H18V3H19A2,2 0 0,1 21,5V11.1C22.24,12.36 23,14.09 23,16A7,7 0 0,1 16,23C14.09,23 12.36,22.24 11.1,21H5M16,11.15A4.85,4.85 0 0,0 11.15,16C11.15,18.68 13.32,20.85 16,20.85A4.85,4.85 0 0,0 20.85,16C20.85,13.32 18.68,11.15 16,11.15Z";var m1="M5,6H23V18H5V6M14,9A3,3 0 0,1 17,12A3,3 0 0,1 14,15A3,3 0 0,1 11,12A3,3 0 0,1 14,9M9,8A2,2 0 0,1 7,10V14A2,2 0 0,1 9,16H19A2,2 0 0,1 21,14V10A2,2 0 0,1 19,8H9M1,10H3V20H19V22H1V10Z";var y2="M15 15V17H18V20H20V17H23V15H20V12H18V15M14.97 11.61C14.85 10.28 13.59 8.97 12 9C10.3 9.03 9 10.3 9 12C9 13.7 10.3 14.94 12 15C12.38 15 12.77 14.92 13.14 14.77C13.41 13.67 13.86 12.63 14.97 11.61M13 16H7C7 14.9 6.11 14 5 14V10C6.11 10 7 9.11 7 8H17C17 9.11 17.9 10 19 10V10.06C19.67 10.06 20.34 10.18 21 10.4V6H3V18H13.32C13.1 17.33 13 16.66 13 16Z";var _2="M4 19V20H22V22H2V2H4V17C7 17 10 15 12.1 11.4C15.1 6.4 18.4 4 22 4V6C19.2 6 16.5 8.1 13.9 12.5C11.3 16.6 7.7 19 4 19Z";var A1="M16,11.78L20.24,4.45L21.97,5.45L16.74,14.5L10.23,10.75L5.46,19H22V21H2V3H4V17.54L9.5,8L16,11.78Z";var k2="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z";var I="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z";var w2="M15 18.5C12.5 18.5 10.32 17.08 9.24 15H15L16 13H8.58C8.53 12.67 8.5 12.34 8.5 12S8.53 11.33 8.58 11H15L16 9H9.24C10.32 6.92 12.5 5.5 15 5.5C16.61 5.5 18.09 6.09 19.23 7.07L21 5.3C19.41 3.87 17.3 3 15 3C11.08 3 7.76 5.5 6.5 9H3L2 11H6.06C6 11.33 6 11.66 6 12S6 12.67 6.06 13H3L2 15H6.5C7.76 18.5 11.08 21 15 21C17.31 21 19.41 20.13 21 18.7L19.22 16.93C18.09 17.91 16.62 18.5 15 18.5Z";var G="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z";var s1="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z";var C1="M18,10A1,1 0 0,1 17,9A1,1 0 0,1 18,8A1,1 0 0,1 19,9A1,1 0 0,1 18,10M12,10H6V5H12M19.77,7.23L19.78,7.22L16.06,3.5L15,4.56L17.11,6.67C16.17,7 15.5,7.93 15.5,9A2.5,2.5 0 0,0 18,11.5C18.36,11.5 18.69,11.42 19,11.29V18.5A1,1 0 0,1 18,19.5A1,1 0 0,1 17,18.5V14C17,12.89 16.1,12 15,12H14V5C14,3.89 13.1,3 12,3H6C4.89,3 4,3.89 4,5V21H14V13.5H15.5V18.5A2.5,2.5 0 0,0 18,21A2.5,2.5 0 0,0 20.5,18.5V9C20.5,8.31 20.22,7.68 19.77,7.23Z";var P2="M19.77,7.23L19.78,7.22L16.06,3.5L15,4.56L17.11,6.67C16.17,7.03 15.5,7.93 15.5,9A2.5,2.5 0 0,0 18,11.5C18.36,11.5 18.69,11.42 19,11.29V18.5A1,1 0 0,1 18,19.5A1,1 0 0,1 17,18.5V14A2,2 0 0,0 15,12H14V5A2,2 0 0,0 12,3H6A2,2 0 0,0 4,5V21H14V13.5H15.5V18.5A2.5,2.5 0 0,0 18,21A2.5,2.5 0 0,0 20.5,18.5V9C20.5,8.31 20.22,7.68 19.77,7.23M12,13.5V19H6V12H12V13.5M12,10H6V5H12V10M18,10A1,1 0 0,1 17,9A1,1 0 0,1 18,8A1,1 0 0,1 19,9A1,1 0 0,1 18,10Z";var B2="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z";var k1="M6.5,8.11C5.61,8.11 4.89,7.39 4.89,6.5A1.61,1.61 0 0,1 6.5,4.89C7.39,4.89 8.11,5.61 8.11,6.5V6.5A1.61,1.61 0 0,1 6.5,8.11M6.5,2C4,2 2,4 2,6.5C2,9.87 6.5,14.86 6.5,14.86C6.5,14.86 11,9.87 11,6.5C11,4 9,2 6.5,2M17.5,8.11A1.61,1.61 0 0,1 15.89,6.5C15.89,5.61 16.61,4.89 17.5,4.89C18.39,4.89 19.11,5.61 19.11,6.5A1.61,1.61 0 0,1 17.5,8.11M17.5,2C15,2 13,4 13,6.5C13,9.87 17.5,14.86 17.5,14.86C17.5,14.86 22,9.87 22,6.5C22,4 20,2 17.5,2M17.5,16C16.23,16 15.1,16.8 14.68,18H9.32C8.77,16.44 7.05,15.62 5.5,16.17C3.93,16.72 3.11,18.44 3.66,20C4.22,21.56 5.93,22.38 7.5,21.83C8.35,21.53 9,20.85 9.32,20H14.69C15.24,21.56 16.96,22.38 18.5,21.83C20.08,21.28 20.9,19.56 20.35,18C19.92,16.8 18.78,16 17.5,16V16M17.5,20.5A1.5,1.5 0 0,1 16,19A1.5,1.5 0 0,1 17.5,17.5A1.5,1.5 0 0,1 19,19A1.5,1.5 0 0,1 17.5,20.5Z";var w1="M16.5,6V17.5A4,4 0 0,1 12.5,21.5A4,4 0 0,1 8.5,17.5V5A2.5,2.5 0 0,1 11,2.5A2.5,2.5 0 0,1 13.5,5V15.5A1,1 0 0,1 12.5,16.5A1,1 0 0,1 11.5,15.5V6H10V15.5A2.5,2.5 0 0,0 12.5,18A2.5,2.5 0 0,0 15,15.5V5A4,4 0 0,0 11,1A4,4 0 0,0 7,5V17.5A5.5,5.5 0 0,0 12.5,23A5.5,5.5 0 0,0 18,17.5V6H16.5Z";var Q="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z";var d1="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z";var $2="M17,17H7V14L3,18L7,22V19H19V13H17M7,7H17V10L21,6L17,2V5H5V11H7V7Z";var T2="M12,16A3,3 0 0,1 9,13C9,11.88 9.61,10.9 10.5,10.39L20.21,4.77L14.68,14.35C14.18,15.33 13.17,16 12,16M12,3C13.81,3 15.5,3.5 16.97,4.32L14.87,5.53C14,5.19 13,5 12,5A8,8 0 0,0 4,13C4,15.21 4.89,17.21 6.34,18.65H6.35C6.74,19.04 6.74,19.67 6.35,20.06C5.96,20.45 5.32,20.45 4.93,20.07V20.07C3.12,18.26 2,15.76 2,13A10,10 0 0,1 12,3M22,13C22,15.76 20.88,18.26 19.07,20.07V20.07C18.68,20.45 18.05,20.45 17.66,20.06C17.27,19.67 17.27,19.04 17.66,18.65V18.65C19.11,17.2 20,15.21 20,13C20,12 19.81,11 19.46,10.1L20.67,8C21.5,9.5 22,11.18 22,13Z";var F2="M9,16V10H5L12,3L19,10H15V16H9M5,20V18H19V20H5Z";var b=g`
  :host {
    --vl-gap: 12px;
    --vl-radius: var(--ha-card-border-radius, 12px);
    --vl-radius-lg: 18px;
    --vl-accent: var(--primary-color, #03a9f4);
    --vl-accent-2: #1de9b6;
    --vl-gradient: linear-gradient(135deg, var(--vl-accent), var(--vl-accent-2));
    /* Surfaces : un voile de la couleur du texte, lisible en clair et en sombre. */
    --vl-surface: color-mix(in srgb, var(--primary-text-color) 4%, transparent);
    --vl-surface-strong: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
    --vl-muted: var(--secondary-text-color);
    --vl-border: var(--divider-color, rgba(127, 127, 127, 0.3));
    /* Bordure des champs : contraste ≥ 3:1 (WCAG 1.4.11). */
    --vl-input-border: var(--secondary-text-color);
    --vl-focus: var(--primary-color);
    /* Couleurs d'état utilisées pour du texte : mélangées à la couleur du texte
       du thème pour garder un contraste AA en clair comme en sombre. */
    --vl-error-text: color-mix(
      in srgb,
      var(--error-color, #db4437) 75%,
      var(--primary-text-color)
    );
    --vl-warning-text: color-mix(
      in srgb,
      var(--warning-color, #ffa600) 55%,
      var(--primary-text-color)
    );
    color: var(--primary-text-color);
  }
  ha-card {
    border-radius: var(--vl-radius-lg);
    border: 1px solid color-mix(in srgb, var(--primary-text-color) 9%, transparent);
    background:
      radial-gradient(
        120% 60% at 0% 0%,
        color-mix(in srgb, var(--vl-accent) 9%, transparent),
        transparent 60%
      ),
      var(--ha-card-background, var(--card-background-color, #1c1c1c));
    box-shadow: 0 18px 40px -28px rgba(0, 0, 0, 0.75);
  }
  /* Titres de section : petites capitales discrètes. */
  h3.section {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0;
    font-size: 0.8125rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--vl-muted);
  }
  h3.section svg.mdi {
    width: 18px;
    height: 18px;
    color: var(--vl-accent);
  }
  /* Entrée en douceur, décalée par --i. */
  .rise {
    animation: vl-rise 0.45s cubic-bezier(0.2, 0.7, 0.2, 1) both;
    animation-delay: calc(var(--i, 0) * 45ms);
  }
  @keyframes vl-rise {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .rise {
      animation: none;
    }
    * {
      transition: none !important;
    }
  }
  .visually-hidden {
    position: absolute !important;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
  button {
    font: inherit;
    cursor: pointer;
    border-radius: 999px;
    min-height: 40px;
    padding: 0 16px;
    border: 1px solid var(--vl-input-border);
    background: transparent;
    color: var(--primary-text-color);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    transition:
      transform 0.15s ease,
      background-color 0.15s ease,
      box-shadow 0.15s ease;
  }
  button:not(:disabled):not(.icon):hover {
    background: var(--vl-surface-strong);
    transform: translateY(-1px);
  }
  button:not(:disabled):active {
    transform: translateY(0) scale(0.98);
  }
  /* Bouton principal teinté : le texte garde la couleur du thème, ce qui
     assure un contraste AA quelle que soit la couleur primaire. Le liseré en
     dégradé donne l'accent. */
  button.primary,
  button[aria-pressed="true"] {
    background:
      linear-gradient(
          color-mix(in srgb, var(--vl-accent) 20%, var(--card-background-color, #1c1c1c)),
          color-mix(in srgb, var(--vl-accent) 20%, var(--card-background-color, #1c1c1c))
        )
        padding-box,
      var(--vl-gradient) border-box;
    border: 1px solid transparent;
    color: var(--primary-text-color);
    font-weight: 500;
  }
  button.primary:not(:disabled):hover,
  button[aria-pressed="true"]:not(:disabled):hover {
    box-shadow: 0 6px 18px -8px color-mix(in srgb, var(--vl-accent) 70%, transparent);
  }
  button.danger {
    color: var(--vl-error-text);
    border-color: var(--vl-error-text);
  }
  button.icon {
    min-width: 40px;
    min-height: 40px;
    padding: 0;
    border: none;
    display: inline-grid;
    place-items: center;
    color: var(--vl-muted);
  }
  button.icon:not(:disabled):hover {
    background: var(--vl-surface-strong);
    color: var(--primary-text-color);
  }
  @media (max-width: 420px) {
    button.icon {
      min-width: 36px;
    }
  }
  button:disabled {
    opacity: 0.5;
    cursor: default;
  }
  :is(button, input, select, textarea, [tabindex]):focus-visible {
    outline: 2px solid var(--vl-focus);
    outline-offset: 2px;
  }
  svg.mdi {
    width: 20px;
    height: 20px;
    fill: currentColor;
  }
  .field {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
  }
  .field label {
    font-size: 0.875rem;
    color: var(--vl-muted);
  }
  .field .hint {
    font-size: 0.75rem;
    color: var(--vl-muted);
  }
  input,
  select,
  textarea {
    font: inherit;
    color: var(--primary-text-color);
    background: var(--card-background-color, var(--ha-card-background, #fff));
    border: 1px solid var(--vl-input-border);
    border-radius: 8px;
    min-height: 40px;
    padding: 0 10px;
    box-sizing: border-box;
    width: 100%;
  }
  textarea {
    padding: 8px 10px;
    min-height: 64px;
    resize: vertical;
  }
  input[type="checkbox"] {
    width: 20px;
    min-height: 20px;
    height: 20px;
    accent-color: var(--primary-color);
  }
  input[readonly].computed {
    border-style: dashed;
  }
  .error {
    color: var(--vl-error-text);
  }
  .muted {
    color: var(--vl-muted);
  }
  .empty {
    color: var(--vl-muted);
    padding: 8px 0;
  }
  .badge {
    display: inline-block;
    font-size: 0.75rem;
    padding: 1px 6px;
    border-radius: 999px;
    border: 1px solid var(--vl-input-border);
    color: var(--vl-muted);
    vertical-align: middle;
  }
`,Y=g`
  ul.entries {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  ul.entries li {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 6px;
    border-radius: 12px;
    transition: background-color 0.15s ease;
  }
  ul.entries li + li {
    border-top: 1px solid var(--vl-border);
  }
  ul.entries li:hover {
    background: var(--vl-surface);
  }
  .entry-main {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
  }
  .entry-title {
    display: flex;
    gap: 8px;
    justify-content: space-between;
    align-items: baseline;
  }
  .entry-title > :first-child {
    min-width: 0;
  }
  .entry-title > .amount {
    flex: none;
  }
  .entry-sub {
    font-size: 0.875rem;
    color: var(--vl-muted);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .amount {
    font-variant-numeric: tabular-nums;
    font-weight: 500;
  }
  .row-actions {
    display: flex;
    flex: none;
  }
`;var z=class extends f{constructor(){super();this._vehicles=[];this._currency="EUR";this._started=!1;this._error="",this._loading=!0}static{this.properties={hass:{attribute:!1},_config:{state:!0},_error:{state:!0},_loading:{state:!0}}}setConfig(H){if(!H)throw new Error("Invalid configuration");let V=this._config?.vehicle_id!==H.vehicle_id;this._config={show_chart:!0,show_recent:!0,...H},this._started&&V?this.reload():this._start()}get vehicle(){return this._vehicles.find(H=>H.id===this._config?.vehicle_id)??this._vehicles[0]}_start(){this._started||!this.hass||!this.isConnected||!this._config||(this._started=!0,this.reload())}updated(H){H.has("hass")&&(this._start(),this._subscribe())}connectedCallback(){super.connectedCallback(),this.hass&&(this._subscribe(),this._start())}disconnectedCallback(){super.disconnectedCallback(),this._started=!1;let H=this._unsubscribe;this._unsubscribe=void 0,H?.then(V=>V()).catch(()=>{})}_subscribe(){this._unsubscribe||!this.isConnected||(this._unsubscribe=W1(this.hass,()=>{window.clearTimeout(this._reloadTimer),this._reloadTimer=window.setTimeout(()=>{this.reload()},300)}),this._unsubscribe.catch(()=>{this._unsubscribe=void 0}))}async reload(){try{let H=await p1(this.hass);this._vehicles=H.vehicles,this._currency=H.currency,this._error="",await this.loadVehicleData()}catch(H){this._error=H.code??H.message}finally{this._loading=!1,this.requestUpdate()}}};var G1=class extends z{static{this.properties={...z.properties,_data:{state:!0}}}static{this.styles=[b,Y,I1,g`
      ha-card {
        padding: 18px;
        display: flex;
        flex-direction: column;
        gap: 20px;
      }
      .head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        flex-wrap: wrap;
      }
      h2 {
        margin: 0;
        font-size: 1.35rem;
        font-weight: 600;
        letter-spacing: -0.01em;
      }
      .sub {
        color: var(--vl-muted);
        font-size: 0.875rem;
      }
      .actions {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      .hero {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr));
        gap: 12px;
      }
      .panel {
        position: relative;
        overflow: hidden;
        border-radius: 16px;
        padding: 14px 16px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        background: var(--vl-surface);
        border: 1px solid color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      }
      /* Liseré dégradé en haut des encarts. */
      .panel::before {
        content: "";
        position: absolute;
        inset: 0 0 auto;
        height: 3px;
        background: var(--vl-gradient);
        opacity: 0.85;
      }
      .panel.next::before {
        background: linear-gradient(90deg, #ffb300, #ff7043);
      }
      .panel-head {
        display: flex;
        flex-wrap: wrap;
        align-items: baseline;
        justify-content: space-between;
        gap: 4px 12px;
      }
      .hint {
        margin: 0;
        color: var(--vl-muted);
        font-size: 0.8125rem;
      }
      .figures {
        display: flex;
        flex-wrap: wrap;
        gap: 8px 28px;
        margin: 0;
      }
      .figure {
        display: flex;
        flex-direction: column-reverse;
        margin: 0;
      }
      .figure dt {
        font-size: 0.8125rem;
        color: var(--vl-muted);
      }
      .figure dd {
        margin: 0;
        font-size: 1.9rem;
        font-weight: 650;
        line-height: 1.15;
        letter-spacing: -0.02em;
        font-variant-numeric: tabular-nums;
      }
      .figure dd small {
        font-size: 0.875rem;
        font-weight: 400;
        letter-spacing: 0;
        color: var(--vl-muted);
      }
      .delta {
        display: inline-block;
        margin-left: 4px;
        font-size: 0.75rem;
        padding: 0 6px;
        border-radius: 999px;
        background: var(--vl-surface-strong);
      }
      .delta.up {
        color: var(--vl-warning-text);
      }
      .delta.down {
        color: color-mix(in srgb, var(--success-color, #43a047) 70%, var(--primary-text-color));
      }
      .countdown {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .ring {
        --p: 0;
        flex: none;
        width: 58px;
        height: 58px;
        border-radius: 50%;
        display: grid;
        place-items: center;
        background:
          radial-gradient(closest-side, var(--card-background-color, #1c1c1c) 76%, transparent 78%),
          conic-gradient(#ffb300 calc(var(--p) * 1%), var(--vl-surface-strong) 0);
        font-weight: 650;
        font-variant-numeric: tabular-nums;
      }
      .ring small {
        display: block;
        font-size: 0.6875rem;
        font-weight: 400;
        color: var(--vl-muted);
        text-align: center;
        line-height: 1;
      }
      .countdown .when {
        display: flex;
        flex-direction: column;
      }
      .countdown .when strong {
        font-size: 1.1rem;
      }
      .overdue {
        color: var(--vl-warning-text);
      }
      section {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .section-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
      }
      .recent {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 16px;
      }
    `]}constructor(){super(),this._data=null}static getStubConfig(){return{type:"custom:carbu-card"}}static async getConfigElement(){let C=document.createElement("carbu-card-editor");return C.setAttribute("kind","dashboard"),C}getCardSize(){return 8}getGridOptions(){return{columns:12,min_columns:6,rows:"auto"}}async loadVehicleData(){let C=this.vehicle;this._data=C?await e5(this.hass,C.id):null,await Promise.all([this.renderRoot.querySelector("vl-reminder-list")?.reload(),this.renderRoot.querySelector("vl-recurring-list")?.reload()])}openFuel(){this._dialog("vl-fuel-dialog")?.open()}openExpense(){this._dialog("vl-expense-dialog")?.open()}_dialog(C){return this.renderRoot.querySelector(C)}async _deleteFuel(C){await this._dialog("vl-confirm-dialog").ask(L(this.hass,"fuel.delete_confirm",{date:Z(this.hass,C.date)}))&&this._data&&(await D1(this.hass,this._data.id,C.id),await this.reload())}async _deleteExpense(C){await this._dialog("vl-confirm-dialog").ask(L(this.hass,"expense.delete_confirm",{date:Z(this.hass,C.date),amount:S(this.hass,C.amount,this._currency)}))&&this._data&&(await N1(this.hass,this._data.id,C.id),await this.reload())}_tiles(C){let H=this.hass,V=C.summary,e=C.fuel_types[0],M=C.units.distance;return t`<dl class="kpis">
      ${M1(L(H,"tile.consumption"),p(H,V?.consumption[e],2),C.units.consumption[e],{icon:C1,color:"#26c6da",index:0})}
      ${M1(L(H,"tile.month_cost"),S(H,V?.month_cost,C.currency),"",{icon:m1,color:"#ffb300",index:1})}
      ${M1(L(H,"tile.cost_per_distance",{unit:M}),S(H,V?.cost_per_distance,C.currency,3),"",{icon:w2,color:"#ab47bc",index:2})}
      ${M1(L(H,"tile.odometer"),p(H,V?.current_odometer,0),M,{icon:T2,color:"#5c6bc0",index:3})}
      ${M1(L(H,"tile.distance_month"),p(H,V?.distance_month,0),M,{icon:k1,color:"#66bb6a",index:4})}
    </dl>`}_hero(C){let H=this._config.show_last_fill!==!1?this._lastFill(C):o,V=this._config.show_next_fill!==!1?this._nextFill(C):o;return H===o&&V===o?o:t`<div class="hero">${H}${V}</div>`}_lastFill(C){let H=this.hass,V=C.last_fuel;if(!V)return o;let e=C.units.volume[V.fuel_type]??"L",M=C.units.consumption[V.fuel_type]??"",i=C.summary?.consumption[V.fuel_type]??null,A=/\/100/.test(M),a=o;if(V.consumption!=null&&i!=null&&i>0){let d=V.consumption-i,u=A?d>0:d<0;Math.abs(d)>=.005&&(a=t`<span class="delta ${u?"up":"down"}">
          ${L(H,u?"last_fill.worse":"last_fill.better",{value:p(H,Math.abs(d),2)})}
        </span>`)}return t`<section class="panel rise" style="--i:0" aria-labelledby="last-fill">
      <div class="panel-head">
        <h3 class="section" id="last-fill">${l(C1)} ${L(H,"last_fill.title")}</h3>
        <span class="sub">
          ${Z(H,V.date)} · ${p(H,V.volume,2)} ${e}${V.grade?` ${U(V.grade)}`:""} · ${S(H,V.total_cost,C.currency)}
        </span>
      </div>
      <dl class="figures">
        <div class="figure">
          <dt>${L(H,"last_fill.distance")}</dt>
          <dd>${p(H,V.distance,0)} <small>${C.units.distance}</small></dd>
        </div>
        <div class="figure">
          <dt>${L(H,"last_fill.consumption")} ${a}</dt>
          <dd>${p(H,V.consumption,2)} <small>${M}</small></dd>
        </div>
      </dl>
      ${V.full_tank?o:t`<p class="hint">${L(H,"last_fill.partial")}</p>`}
    </section>`}_nextFill(C){let H=this.hass,V=C.summary?.next_fill,e=t`<h3 class="section" id="next-fill">
      ${l(b2)} ${L(H,"next_fill.title")}
    </h3>`;if(!V)return t`<section class="panel next rise" style="--i:1" aria-labelledby="next-fill">
        ${e}
        <p class="hint">${L(H,"next_fill.unknown")}</p>
      </section>`;let M=C.units.distance,i=C.units.volume[V.fuel_type]??"L",A=V.interval>0?100*(1-V.distance_left/V.interval):0,a=Math.max(0,V.days_left),d=V.overdue?L(H,"next_fill.overdue"):a===0?L(H,"next_fill.today"):L(H,"next_fill.in_days",{days:a}),u=[L(H,"next_fill.around",{odometer:`${p(H,V.odometer,0)} ${M}`}),V.volume!==null?`\u2248 ${p(H,V.volume,0)} ${i}`:"",V.cost!==null?`\u2248 ${S(H,V.cost,C.currency,0)}`:""].filter(Boolean);return t`<section class="panel next rise" style="--i:1" aria-labelledby="next-fill">
      <div class="panel-head">
        ${e}
        <span class="sub">${Z(H,V.date)}</span>
      </div>
      <div class="countdown">
        <div
          class="ring"
          style="--p:${Math.min(100,Math.max(0,A)).toFixed(0)}"
          role="img"
          aria-label=${L(H,"next_fill.progress",{percent:Math.round(A)})}
        >
          <span>${p(H,V.distance_left,0)}<small>${M}</small></span>
        </div>
        <div class="when">
          <strong class=${V.overdue?"overdue":""}>${d}</strong>
          <span class="sub">${u.join(" \xB7 ")}</span>
        </div>
      </div>
      <p class="hint">
        ${L(H,"next_fill.basis",{interval:`${p(H,V.interval,0)} ${M}`,rate:`${p(H,V.distance_per_day,0)} ${M}`})}
      </p>
    </section>`}_fuelRow(C,H){let V=this.hass,e=C.units.volume[H.fuel_type]??"L",M=H.grade?` ${U(H.grade)}`:"",i=`${Z(V,H.date)} \xB7 ${p(V,H.volume,2)} ${e}${M}`;return t`<li>
      <div class="entry-main">
        <span class="entry-title">
          <span>${i}${H.full_tank?o:t` <span class="badge">${L(V,"fuel.partial")}</span>`}</span>
          <span class="amount">${S(V,H.total_cost,C.currency)}</span>
        </span>
        <span class="entry-sub">${U1(V,C,H,C.currency)}</span>
      </div>
      <span class="row-actions">
        <button
          class="icon"
          aria-label="${L(V,"common.edit")} : ${i}"
          @click=${()=>this._dialog("vl-fuel-dialog").open(H)}
        >
          ${l(Q)}
        </button>
        <button
          class="icon"
          aria-label="${L(V,"common.delete")} : ${i}"
          @click=${()=>this._deleteFuel(H)}
        >
          ${l(G)}
        </button>
      </span>
    </li>`}_expenseRow(C,H){let V=this.hass,e=C.categories.find(i=>i.id===H.category_id),M=`${Z(V,H.date)} \xB7 ${e?.label??H.category_id}`;return t`<li>
      <div class="entry-main">
        <span class="entry-title">
          <span>${M}</span>
          <span class="amount">${S(V,H.amount,C.currency)}</span>
        </span>
        ${H.description?t`<span class="entry-sub">${H.description}</span>`:o}
      </div>
      <span class="row-actions">
        <button
          class="icon"
          aria-label="${L(V,"common.edit")} : ${M}"
          @click=${()=>this._dialog("vl-expense-dialog").open(H)}
        >
          ${l(Q)}
        </button>
        <button
          class="icon"
          aria-label="${L(V,"common.delete")} : ${M}"
          @click=${()=>this._deleteExpense(H)}
        >
          ${l(G)}
        </button>
      </span>
    </li>`}render(){let C=this.hass;if(this._loading)return t`<ha-card><p>${L(C,"common.loading")}</p></ha-card>`;if(this._error){let i=this._error==="not_loaded"?L(C,"common.not_loaded"):this._error;return t`<ha-card><p class="error" role="alert">${i}</p></ha-card>`}let H=this._data;if(!H)return t`<ha-card><p>${L(C,"common.no_vehicle")}</p></ha-card>`;let V=this._config,e=[H.make,H.model].filter(Boolean).join(" "),M=(i,A,a,d,u="",s="")=>t`<div class="section-head">
        <h3 class="section" id=${i}>${l(A)} ${a}</h3>
        ${d?t`<button aria-label=${s} @click=${d}>${l(d1)} ${u}</button>`:o}
      </div>`;return t`<ha-card>
      <div class="head">
        <div>
          <h2>${V.title||H.name}</h2>
          ${e&&!V.title?t`<span class="sub">${e}</span>`:o}
        </div>
        ${V.show_actions===!1?o:t`<div class="actions">
          <button class="primary" aria-label=${L(C,"action.add_fuel_long")} @click=${()=>this.openFuel()}>
            ${l(d1)} ${L(C,"action.add_fuel")}
          </button>
          <button aria-label=${L(C,"action.add_expense_long")} @click=${()=>this.openExpense()}>
            ${l(d1)} ${L(C,"action.add_expense")}
          </button>
        </div>`}
      </div>
      ${this._hero(H)}
      ${this._tiles(H)}
      ${V.show_reminders!==!1?t`<section aria-labelledby="reminders">
            ${M("reminders",O2,L(C,"reminders.title"),()=>this.renderRoot.querySelector("vl-reminder-list").openEditor(),L(C,"reminders.add"),L(C,"reminders.add_long"))}
            <vl-reminder-list .hass=${C} .vehicle=${H}></vl-reminder-list>
          </section>`:o}
      ${V.show_recurring!==!1?t`<section aria-labelledby="recurring">
            ${M("recurring",$2,L(C,"recurring.title"),()=>this.renderRoot.querySelector("vl-recurring-list").openEditor(),L(C,"recurring.add"),L(C,"recurring.add_long"))}
            <vl-recurring-list
              .hass=${C}
              .vehicle=${H}
              .categories=${H.categories}
              .currency=${H.currency}
              @saved=${()=>this.reload()}
            ></vl-recurring-list>
          </section>`:o}
      ${V.show_recent?t`<div class="recent">
            <section aria-labelledby="recent-fuel">
              ${M("recent-fuel",P2,L(C,"section.recent_fuel"))}
              ${H.recent_fuel.length?t`<ul class="entries">${H.recent_fuel.map(i=>this._fuelRow(H,i))}</ul>`:t`<p class="empty">${L(C,"common.none")}</p>`}
            </section>
            <section aria-labelledby="recent-expenses">
              ${M("recent-expenses",m1,L(C,"section.recent_expenses"))}
              ${H.recent_expenses.length?t`<ul class="entries">
                    ${H.recent_expenses.map(i=>this._expenseRow(H,i))}
                  </ul>`:t`<p class="empty">${L(C,"common.none")}</p>`}
            </section>
          </div>`:o}
      ${V.show_chart?t`<section aria-labelledby="monthly">
            ${M("monthly",_2,L(C,"section.monthly"))}
            <vl-monthly-chart
              .hass=${C}
              .data=${H.monthly}
              .categories=${H.categories}
              .currency=${H.currency}
            ></vl-monthly-chart>
          </section>`:o}
      <vl-fuel-dialog
        .hass=${C}
        .vehicle=${H}
        .currency=${H.currency}
        @saved=${()=>this.reload()}
      ></vl-fuel-dialog>
      <vl-expense-dialog
        .hass=${C}
        .vehicle=${H}
        .categories=${H.categories}
        .currency=${H.currency}
        @saved=${()=>this.reload()}
      ></vl-expense-dialog>
      <vl-confirm-dialog .hass=${C}></vl-confirm-dialog>
    </ha-card>`}};var Q1=class extends f{static{this.properties={hass:{attribute:!1},kind:{type:String},_config:{state:!0},_vehicles:{state:!0}}}static{this.styles=[b,g`
      :host {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .check {
        display: flex;
        align-items: center;
        gap: 8px;
      }
    `]}constructor(){super(),this.kind="dashboard",this._vehicles=[]}setConfig(C){this._config=C}firstUpdated(){p1(this.hass).then(C=>this._vehicles=C.vehicles).catch(()=>{})}_change(C,H){let V={...this._config};H===""||H===void 0?delete V[C]:V[C]=H,this._config=V,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:V},bubbles:!0,composed:!0}))}render(){if(!this._config)return o;let C=this.hass;return t`
      <div class="field">
        <label for="vehicle">${L(C,"editor.vehicle")}</label>
        <select
          id="vehicle"
          @change=${H=>this._change("vehicle_id",H.target.value)}
        >
          ${this._vehicles.map(H=>t`<option value=${H.id} ?selected=${H.id===this._config.vehicle_id}>
                ${H.name}
              </option>`)}
        </select>
      </div>
      <div class="field">
        <label for="title">${L(C,"editor.title")}</label>
        <input
          id="title"
          .value=${this._config.title??""}
          @change=${H=>this._change("title",H.target.value)}
        />
      </div>
      ${this.kind==="dashboard"?t`<label class="check">
              <input
                type="checkbox"
                .checked=${this._config.show_recent!==!1}
                @change=${H=>this._change("show_recent",H.target.checked)}
              />
              ${L(C,"editor.show_recent")}
            </label>
            <label class="check">
              <input
                type="checkbox"
                .checked=${this._config.show_reminders!==!1}
                @change=${H=>this._change("show_reminders",H.target.checked)}
              />
              ${L(C,"editor.show_reminders")}
            </label>
            <label class="check">
              <input
                type="checkbox"
                .checked=${this._config.show_next_fill!==!1}
                @change=${H=>this._change("show_next_fill",H.target.checked)}
              />
              ${L(C,"editor.show_next_fill")}
            </label>
            <label class="check">
              <input
                type="checkbox"
                .checked=${this._config.show_recurring!==!1}
                @change=${H=>this._change("show_recurring",H.target.checked)}
              />
              ${L(C,"editor.show_recurring")}
            </label>
            <label class="check">
              <input
                type="checkbox"
                .checked=${this._config.show_chart!==!1}
                @change=${H=>this._change("show_chart",H.target.checked)}
              />
              ${L(C,"editor.show_chart")}
            </label>`:o}
      ${this.kind==="stats"?t`<div class="field">
            <label for="period">${L(C,"editor.period")}</label>
            <select
              id="period"
              @change=${H=>this._change("period",H.target.value)}
            >
              ${["30d","3m","12m","all"].map(H=>t`<option value=${H} ?selected=${(this._config.period??"12m")===H}>
                    ${L(C,`stats.period_${H}`)}
                  </option>`)}
            </select>
          </div>`:o}
    `}};function v1(r){try{return window.localStorage.getItem(`carbu-${r}`)??void 0}catch{return}}function x1(r,C){try{window.localStorage.setItem(`carbu-${r}`,C)}catch{}}var h5=25;function J5(r){let C=new Date;return r==="month"?{start:_1(new Date(C.getFullYear(),C.getMonth(),1))}:r==="3m"?{start:_1(new Date(C.getFullYear(),C.getMonth()-2,1))}:r==="year"?{start:_1(new Date(C.getFullYear(),0,1))}:{}}var z1=class extends z{static{this.properties={...z.properties,_tab:{state:!0},_fuel:{state:!0},_expenses:{state:!0},_fuelTotal:{state:!0},_expenseTotal:{state:!0},_expenseSum:{state:!0},_categories:{state:!0},_filters:{state:!0}}}static{this.styles=[b,Y,g`
      ha-card {
        padding: 18px;
        display: flex;
        flex-direction: column;
        gap: 14px;
      }
      .head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        flex-wrap: wrap;
      }
      h2 {
        margin: 0;
        font-size: 1.35rem;
        font-weight: 600;
        letter-spacing: -0.01em;
      }
      .head-actions {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }
      /* Onglets en contrôle segmenté. */
      [role="tablist"] {
        display: inline-flex;
        align-self: flex-start;
        gap: 4px;
        padding: 4px;
        border-radius: 999px;
        background: var(--vl-surface-strong);
      }
      [role="tab"] {
        border: none;
        min-height: 34px;
        color: var(--vl-muted);
      }
      [role="tab"][aria-selected="true"] {
        color: var(--primary-text-color);
        font-weight: 600;
        background: var(--card-background-color, #1c1c1c);
        box-shadow: 0 2px 10px -4px rgba(0, 0, 0, 0.6);
      }
      fieldset {
        border: 1px solid var(--vl-border);
        border-radius: 10px;
        padding: 8px 12px 12px;
        margin: 0;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
        gap: 8px 12px;
      }
      legend {
        padding: 0 4px;
        color: var(--vl-muted);
      }
      .presets,
      .chips {
        grid-column: 1 / -1;
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }
      .chips label {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        border: 1px solid var(--vl-input-border);
        border-radius: 999px;
        padding: 2px 10px 2px 6px;
        min-height: 32px;
      }
      .summary {
        color: var(--vl-muted);
        font-size: 0.875rem;
      }
      .more {
        align-self: center;
      }
    `]}constructor(){super(),this._tab=v1("journal-tab")==="expenses"?"expenses":"fuel",this._fuel=[],this._expenses=[],this._fuelTotal=0,this._expenseTotal=0,this._expenseSum=0,this._categories=[],this._filters={preset:"all"}}static getStubConfig(){return{type:"custom:carbu-journal-card"}}static async getConfigElement(){let C=document.createElement("carbu-card-editor");return C.setAttribute("kind","journal"),C}getCardSize(){return 10}getGridOptions(){return{columns:12,min_columns:6,rows:"auto"}}async loadVehicleData(){if(!this.vehicle)return;let[H]=await Promise.all([E1(this.hass),this._loadFuel(!1),this._loadExpenses(!1)]);this._categories=H}async _loadFuel(C){let H=this.vehicle;if(!H)return;let V=await r5(this.hass,H.id,{limit:this._config.page_size??h5,offset:C?this._fuel.length:0});this._fuel=C?[...this._fuel,...V.items]:V.items,this._fuelTotal=V.total}_apiFilters(){let{preset:C,...H}=this._filters;return H}async _loadExpenses(C){let H=this.vehicle;if(!H)return;let V=await i5(this.hass,H.id,{...this._apiFilters(),limit:this._config.page_size??h5,offset:C?this._expenses.length:0});this._expenses=C?[...this._expenses,...V.items]:V.items,this._expenseTotal=V.total,this._expenseSum=V.sum??0}_setFilters(C){let H={...this._filters,...C};for(let[V,e]of Object.entries(H))(e==null||e==="")&&delete H[V];this._filters=H,this._loadExpenses(!1)}_preset(C){let H=J5(C);this._setFilters({preset:C,start:H.start,end:void 0})}_toggleCategory(C,H){let V=new Set(this._filters.category_ids??[]);H?V.add(C):V.delete(C),this._setFilters({category_ids:V.size?[...V]:void 0})}_confirm(){return this.renderRoot.querySelector("vl-confirm-dialog")}async _deleteFuel(C){let H=this.vehicle;H&&await this._confirm().ask(L(this.hass,"fuel.delete_confirm",{date:Z(this.hass,C.date)}))&&(await D1(this.hass,H.id,C.id),await this.reload())}async _deleteExpense(C){let H=this.vehicle;if(!H)return;let V=L(this.hass,"expense.delete_confirm",{date:Z(this.hass,C.date),amount:S(this.hass,C.amount,this._currency)});await this._confirm().ask(V)&&(await N1(this.hass,H.id,C.id),await this.reload())}_setTab(C){this._tab=C,x1("journal-tab",C)}_tabButton(C,H){let V=this._tab===C;return t`<button
      role="tab"
      id="tab-${C}"
      aria-selected=${V?"true":"false"}
      aria-controls="panel-${C}"
      tabindex=${V?0:-1}
      @click=${()=>this._setTab(C)}
      @keydown=${e=>{(e.key==="ArrowRight"||e.key==="ArrowLeft")&&(this._setTab(this._tab==="fuel"?"expenses":"fuel"),this.updateComplete.then(()=>this.renderRoot.querySelector(`#tab-${this._tab}`)?.focus()))}}
    >
      ${H}
    </button>`}_fuelPanel(){let C=this.hass,H=this.vehicle;return t`<div role="tabpanel" id="panel-fuel" aria-labelledby="tab-fuel">
      ${this._fuel.length?t`<ul class="entries">
            ${this._fuel.map(V=>{let e=H.units.volume[V.fuel_type]??"L",M=V.grade?` ${U(V.grade)}`:"",i=`${Z(C,V.date)} \xB7 ${p(C,V.volume,2)} ${e}${M}`;return t`<li>
                <div class="entry-main">
                  <span class="entry-title">
                    <span>${i}${V.full_tank?o:t` <span class="badge">${L(C,"fuel.partial")}</span>`}</span>
                    <span class="amount">${S(C,V.total_cost,this._currency)}</span>
                  </span>
                  <span class="entry-sub">
                    ${U1(C,H,V,this._currency)}${V.notes?` \xB7 ${V.notes}`:""}
                  </span>
                </div>
                <span class="row-actions">
                  <button class="icon" aria-label="${L(C,"common.edit")} : ${i}"
                    @click=${()=>this.renderRoot.querySelector("vl-fuel-dialog").open(V)}>
                    ${l(Q)}
                  </button>
                  <button class="icon" aria-label="${L(C,"common.delete")} : ${i}"
                    @click=${()=>this._deleteFuel(V)}>
                    ${l(G)}
                  </button>
                </span>
              </li>`})}
          </ul>`:t`<p class="empty">${L(C,"common.none")}</p>`}
      ${this._fuel.length<this._fuelTotal?t`<button class="more" @click=${()=>this._loadFuel(!0)}>${L(C,"common.load_more")}</button>`:o}
    </div>`}_filtersForm(){let C=this.hass,H=this._filters,V=[["month",L(C,"journal.period_month")],["3m",L(C,"journal.period_3m")],["year",L(C,"journal.period_year")],["all",L(C,"journal.period_all")]],e=(M,i)=>this._setFilters({[M]:R(i)??void 0});return t`<fieldset>
      <legend>${L(C,"journal.filters")}</legend>
      <div class="presets" role="group" aria-label=${L(C,"journal.filters")}>
        ${V.map(([M,i])=>t`<button aria-pressed=${H.preset===M?"true":"false"} @click=${()=>this._preset(M)}>
              ${i}
            </button>`)}
      </div>
      <div class="field">
        <label for="from">${L(C,"journal.from")}</label>
        <input id="from" type="date" .value=${H.start??""}
          @change=${M=>this._setFilters({start:M.target.value,preset:void 0})} />
      </div>
      <div class="field">
        <label for="to">${L(C,"journal.to")}</label>
        <input id="to" type="date" .value=${H.end??""}
          @change=${M=>this._setFilters({end:M.target.value,preset:void 0})} />
      </div>
      <div class="field">
        <label for="min">${L(C,"journal.min")} (${this._currency})</label>
        <input id="min" inputmode="decimal" .value=${H.min_amount!==void 0?String(H.min_amount):""}
          @change=${M=>e("min_amount",M.target.value)} />
      </div>
      <div class="field">
        <label for="max">${L(C,"journal.max")} (${this._currency})</label>
        <input id="max" inputmode="decimal" .value=${H.max_amount!==void 0?String(H.max_amount):""}
          @change=${M=>e("max_amount",M.target.value)} />
      </div>
      <div class="chips" role="group" aria-label=${L(C,"journal.categories")}>
        ${this._categories.map(M=>t`<label>
            <input type="checkbox" .checked=${H.category_ids?.includes(M.id)??!1}
              @change=${i=>this._toggleCategory(M.id,i.target.checked)} />
            ${M.label}
          </label>`)}
      </div>
      <div class="presets">
        <button @click=${()=>{this._filters={preset:"all"},this._loadExpenses(!1)}}>${L(C,"journal.reset")}</button>
      </div>
    </fieldset>`}_expensePanel(){let C=this.hass;return t`<div role="tabpanel" id="panel-expenses" aria-labelledby="tab-expenses">
      ${this._filtersForm()}
      <p class="summary" aria-live="polite">
        ${L(C,"journal.count",{count:this._expenseTotal,sum:S(C,this._expenseSum,this._currency)})}
      </p>
      ${this._expenses.length?t`<ul class="entries">
            ${this._expenses.map(H=>{let V=this._categories.find(M=>M.id===H.category_id),e=`${Z(C,H.date)} \xB7 ${V?.label??H.category_id}`;return t`<li>
                <div class="entry-main">
                  <span class="entry-title">
                    <span>${e}${H.attachment?t` ${l(w1)}`:o}</span>
                    <span class="amount">${S(C,H.amount,this._currency)}</span>
                  </span>
                  ${H.description?t`<span class="entry-sub">${H.description}</span>`:o}
                </div>
                <span class="row-actions">
                  <button class="icon" aria-label="${L(C,"common.edit")} : ${e}"
                    @click=${()=>this.renderRoot.querySelector("vl-expense-dialog").open(H)}>
                    ${l(Q)}
                  </button>
                  <button class="icon" aria-label="${L(C,"common.delete")} : ${e}"
                    @click=${()=>this._deleteExpense(H)}>
                    ${l(G)}
                  </button>
                </span>
              </li>`})}
          </ul>`:t`<p class="empty">${L(C,"common.none")}</p>`}
      ${this._expenses.length<this._expenseTotal?t`<button class="more" @click=${()=>this._loadExpenses(!0)}>${L(C,"common.load_more")}</button>`:o}
    </div>`}render(){let C=this.hass;if(this._loading)return t`<ha-card><p>${L(C,"common.loading")}</p></ha-card>`;if(this._error){let e=this._error==="not_loaded"?L(C,"common.not_loaded"):this._error;return t`<ha-card><p class="error" role="alert">${e}</p></ha-card>`}let H=this.vehicle;if(!H)return t`<ha-card><p>${L(C,"common.no_vehicle")}</p></ha-card>`;let V=this._tab==="fuel";return t`<ha-card>
      <div class="head">
        <h2>${this._config.title||`${L(C,"journal.name")} \xB7 ${H.name}`}</h2>
        <div class="head-actions">
        <button
          aria-label=${L(C,"import.button_long")}
          @click=${()=>this.renderRoot.querySelector("vl-import-dialog").open()}
        >
          ${l(F2)} ${L(C,"import.button")}
        </button>
        <button
          aria-label=${L(C,"export.button_long")}
          @click=${()=>this.renderRoot.querySelector("vl-export-dialog").open()}
        >
          ${l(s1)} ${L(C,"export.button")}
        </button>
        <button
          class="primary"
          aria-label=${L(C,V?"action.add_fuel_long":"action.add_expense_long")}
          @click=${()=>V?this.renderRoot.querySelector("vl-fuel-dialog").open():this.renderRoot.querySelector("vl-expense-dialog").open()}
        >
          ${l(d1)} ${L(C,V?"action.add_fuel":"action.add_expense")}
        </button>
        </div>
      </div>
      <div role="tablist" aria-label=${H.name}>
        ${this._tabButton("fuel",L(C,"journal.tab_fuel"))}
        ${this._tabButton("expenses",L(C,"journal.tab_expenses"))}
      </div>
      ${V?this._fuelPanel():this._expensePanel()}
      <vl-fuel-dialog .hass=${C} .vehicle=${H} .currency=${this._currency}
        @saved=${()=>this.reload()}></vl-fuel-dialog>
      <vl-expense-dialog .hass=${C} .vehicle=${H} .categories=${this._categories}
        .currency=${this._currency} @saved=${()=>this.reload()}></vl-expense-dialog>
      <vl-import-dialog .hass=${C} .vehicle=${H} .categories=${this._categories}
        .currency=${this._currency} @saved=${()=>this.reload()}></vl-import-dialog>
      <vl-export-dialog .hass=${C} .vehicle=${H}></vl-export-dialog>
      <vl-confirm-dialog .hass=${C}></vl-confirm-dialog>
    </ha-card>`}};var g5=["30d","3m","12m","all"],j1=class extends z{static{this.properties={...z.properties,_period:{state:!0},_stats:{state:!0},_categories:{state:!0}}}static{this.styles=[b,I1,g`
      ha-card {
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        flex-wrap: wrap;
      }
      h2 {
        margin: 0;
        font-size: 1.25rem;
        font-weight: 500;
      }
      h2 {
        letter-spacing: -0.01em;
      }
      .chart-box {
        padding: 14px 14px 10px;
        border-radius: 16px;
        background: var(--vl-surface);
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .periods {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }
      .range {
        color: var(--vl-muted);
        font-size: 0.875rem;
        margin: -8px 0 0;
      }
      .groups {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(min(100%, 230px), 1fr));
        gap: 16px;
      }
      .group {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .group h3.section svg.mdi {
        color: var(--group-color);
      }
      .group dl.kpis {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
      .note {
        margin: 0;
        font-size: 0.75rem;
        color: var(--vl-muted);
      }
      .bottom {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(min(100%, 360px), 1fr));
        gap: 16px;
        align-items: start;
      }
      .stack {
        display: flex;
        height: 14px;
        border-radius: 7px;
        overflow: hidden;
        gap: 2px;
        margin: 4px 0 8px;
      }
      .stack span {
        min-width: 3px;
      }
      ul.legend {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr));
        gap: 4px 24px;
        font-size: 0.875rem;
      }
      ul.legend li {
        display: grid;
        grid-template-columns: auto 1fr auto auto;
        align-items: center;
        gap: 8px;
      }
      .dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
      }
      .name {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .pct {
        color: var(--vl-muted);
        font-variant-numeric: tabular-nums;
      }
      .amount {
        font-variant-numeric: tabular-nums;
      }
    `]}constructor(){super(),this._period="12m",this._stats=null,this._categories=[]}setConfig(C){super.setConfig(C);let H=v1("stats-period");C.period?this._period=C.period:H&&g5.includes(H)&&(this._period=H)}static getStubConfig(){return{type:"custom:carbu-stats-card"}}static async getConfigElement(){let C=document.createElement("carbu-card-editor");return C.setAttribute("kind","stats"),C}getCardSize(){return 7}getGridOptions(){return{columns:12,min_columns:6,rows:"auto"}}async loadVehicleData(){let C=this.vehicle;if(!C)return;let[H,V]=await Promise.all([s5(this.hass,C.id,this._period),E1(this.hass)]);this._stats=H,this._categories=V}async _select(C){this._period=C,x1("stats-period",C),await this.loadVehicleData()}render(){let C=this.hass;if(this._loading)return t`<ha-card><p>${L(C,"common.loading")}</p></ha-card>`;if(this._error){let n=this._error==="not_loaded"?L(C,"common.not_loaded"):this._error;return t`<ha-card><p class="error" role="alert">${n}</p></ha-card>`}let H=this.vehicle,V=this._stats;if(!H||!V)return t`<ha-card><p>${L(C,"common.no_vehicle")}</p></ha-card>`;let e=H.units.distance,M=this._currency,i=H.fuel_types.length>1,A=n=>i?` (${L(C,`fuel_type.${n}`)})`:"",a=0,d=(n,w,F="",E=!1,c1="")=>M1(n,w,F,{main:E,color:c1||void 0,index:a++}),u=Object.values(V.fuel_volume).reduce((n,w)=>n+w,0),s=Object.entries(V.expenses_by_category).sort((n,w)=>w[1]-n[1]),h=[{label:L(C,"category.fuel"),color:"#2e7d32",value:V.fuel_cost},...s.map(([n,w])=>{let F=this._categories.find(E=>E.id===n);return{label:F?.label??n,color:F?.color??"#757575",value:w}})].filter(n=>n.value>0),O=h.reduce((n,w)=>n+w.value,0),k=Math.max(1,V.days/30.44),$=f2(C,V.co2_kg),c=f2(C,V.co2_kg/k),v=H.fuel_types[0],y=V.prices[v]??[],x=y.length>1&&y[0].value>0?y[y.length-1].value/y[0].value-1:null,K=n=>n===null?"\u2014":new Intl.NumberFormat(C.locale?.language??C.language,{style:"percent",maximumFractionDigits:1,signDisplay:"exceptZero"}).format(n),m=n=>new Intl.NumberFormat(C.locale?.language??C.language,{style:"percent",maximumFractionDigits:0}).format(O>0?n/O:0),T=[{label:L(C,"stats.cost_curve_total"),color:"#1e88e5",points:V.cost_curve.map(n=>({date:n.date,value:n.total}))},{label:L(C,"stats.cost_curve_fuel"),color:"#2e7d32",points:V.cost_curve.map(n=>({date:n.date,value:n.fuel}))}],q=[{label:L(C,"stats.odometer_label"),color:"#6d4c41",points:V.odometer_curve}];return t`<ha-card>
      <div class="head">
        <h2>${this._config.title||`${L(C,"stats.name")} \xB7 ${H.name}`}</h2>
        <div class="periods" role="group" aria-label=${L(C,"stats.period")}>
          ${g5.map(n=>t`<button
              aria-pressed=${this._period===n?"true":"false"}
              @click=${()=>this._select(n)}
            >
              ${L(C,`stats.period_${n}`)}
            </button>`)}
        </div>
      </div>
      <p class="range">${Z(C,V.start)} – ${Z(C,V.end)}</p>
      <div class="groups">
        <section class="group" style="--group-color:#26c6da" aria-labelledby="g-consumption">
          <h3 class="section" id="g-consumption">${l(C1)} ${L(C,"stats.group_consumption")}</h3>
          <dl class="kpis">
            ${H.fuel_types.map(n=>{let w=(V.series[n]??[]).map(F5=>F5.value),F=H.units.consumption[n],E=/\/100/.test(F??""),c1=w.length?(E?Math.min:Math.max)(...w):null,T5=w.length?(E?Math.max:Math.min)(...w):null;return t`${d(`${L(C,"stats.consumption")}${A(n)}`,p(C,V.consumption[n],2),F,!0)}
              ${d(L(C,"stats.best"),p(C,c1,2),F)}
              ${d(L(C,"stats.worst"),p(C,T5,2),F)}`})}
          </dl>
        </section>
        <section class="group" style="--group-color:#66bb6a" aria-labelledby="g-distance">
          <h3 class="section" id="g-distance">${l(k1)} ${L(C,"stats.group_distance")}</h3>
          <dl class="kpis">
            ${d(L(C,"stats.distance"),p(C,V.distance,0),e,!0)}
            ${d(L(C,"stats.fills"),p(C,V.fill_count,0))}
            ${d(L(C,"stats.distance_per_fill"),p(C,V.fill_count>1?V.distance/(V.fill_count-1):null,0),e)}
            ${H.fuel_types.map(n=>d(`${L(C,"stats.volume")}${A(n)}`,p(C,V.fuel_volume[n],0),H.units.volume[n]))}
          </dl>
        </section>
        <section class="group" style="--group-color:#ffb300" aria-labelledby="g-costs">
          <h3 class="section" id="g-costs">${l(m1)} ${L(C,"stats.group_costs")}</h3>
          <dl class="kpis">
            ${d(L(C,"stats.total_cost"),S(C,V.total_cost,M),"",!0)}
            ${d(L(C,"stats.per_month"),S(C,V.total_cost/k,M))}
            ${d(L(C,"stats.cost_per_distance",{unit:e}),S(C,V.cost_per_distance,M,3))}
            ${i?o:d(L(C,"stats.avg_price",{unit:H.units.volume[H.fuel_types[0]]??"L"}),S(C,u>0?V.fuel_cost/u:null,M,3))}
            ${d(y.length>1?`${L(C,"stats.price_change")} (${p(C,y[0].value,3)} \u2192 ${p(C,y[y.length-1].value,3)})`:L(C,"stats.price_change"),K(x))}
          </dl>
        </section>
        <section class="group" style="--group-color:#9ccc65" aria-labelledby="g-carbon">
          <h3 class="section" id="g-carbon">${l(B2)} ${L(C,"stats.group_carbon")}</h3>
          <dl class="kpis">
            ${d(L(C,"stats.co2_total"),$.value,$.unit,!0)}
            ${d(L(C,"stats.co2_per_distance",{unit:e}),p(C,V.co2_per_distance,0),"g CO\u2082e")}
            ${d(L(C,"stats.co2_per_month"),c.value,c.unit)}
          </dl>
          <p class="note">${L(C,"stats.co2_source")}</p>
        </section>
      </div>
      <div class="bottom">
      ${H.fuel_types.map(n=>t`<section class="chart-box" aria-labelledby="curve-${n}">
          <h3 class="section" id="curve-${n}">${l(A1)} 
            ${L(C,"stats.curve")}${H.fuel_types.length>1?` \xB7 ${L(C,`fuel_type.${n}`)}`:""}
          </h3>
          <vl-consumption-chart
            .hass=${C}
            .points=${V.series[n]??[]}
            .unit=${H.units.consumption[n]}
            .window=${V.moving_average_window}
          ></vl-consumption-chart>
        </section>`)}
      ${H.fuel_types.filter(n=>(V.prices[n]??[]).length).map(n=>t`<section class="chart-box" aria-labelledby="price-${n}">
            <h3 class="section" id="price-${n}">${l(A1)} ${L(C,"stats.price_curve")}${A(n)}</h3>
            <vl-price-chart
              .hass=${C}
              .points=${V.prices[n]}
              .currency=${M}
              .unit=${H.units.volume[n]??"L"}
            ></vl-price-chart>
          </section>`)}
      <section class="chart-box" aria-labelledby="cost-curve">
        <h3 class="section" id="cost-curve">${l(A1)} ${L(C,"stats.cost_curve",{unit:e})}</h3>
        <vl-line-chart
          .hass=${C}
          .name=${L(C,"stats.cost_curve",{unit:e})}
          .series=${T}
          .format=${n=>S(C,n,M,3)}
        ></vl-line-chart>
        <p class="note">${L(C,"stats.cost_curve_note")}</p>
      </section>
      <section class="chart-box" aria-labelledby="odometer-curve">
        <h3 class="section" id="odometer-curve">${l(A1)} ${L(C,"stats.odometer_curve")}</h3>
        <vl-line-chart
          .hass=${C}
          .name=${L(C,"stats.odometer_curve")}
          .series=${q}
          .format=${n=>`${p(C,n,0)} ${e}`}
        ></vl-line-chart>
      </section>
      ${h.length?t`<section class="chart-box" aria-labelledby="by-category">
            <h3 class="section" id="by-category">${l(A1)} ${L(C,"stats.by_category")}</h3>
            <div class="stack" aria-hidden="true">
              ${h.map(({color:n,value:w})=>t`<span style="flex:${w};background:${n}"></span>`)}
            </div>
            <ul class="legend">
              ${h.map(({label:n,color:w,value:F})=>t`<li>
                  <span class="dot" style="background:${w}"></span>
                  <span class="name">${n}</span>
                  <span class="pct">${m(F)}</span>
                  <span class="amount">${S(C,F,M)}</span>
                </li>`)}
            </ul>
          </section>`:o}
      </div>
    </ha-card>`}};var N=g`
  dialog {
    border: 1px solid color-mix(in srgb, var(--primary-text-color) 10%, transparent);
    border-radius: 20px;
    padding: 0;
    width: min(560px, calc(100vw - 32px));
    max-height: calc(100dvh - 32px);
    background:
      radial-gradient(
        100% 40% at 0% 0%,
        color-mix(in srgb, var(--vl-accent) 10%, transparent),
        transparent 70%
      ),
      var(--card-background-color, var(--ha-card-background, #fff));
    color: var(--primary-text-color);
    box-shadow: 0 24px 60px -20px rgba(0, 0, 0, 0.7);
  }
  dialog[open] {
    animation: vl-pop 0.22s cubic-bezier(0.2, 0.8, 0.2, 1);
  }
  @keyframes vl-pop {
    from {
      opacity: 0;
      transform: translateY(12px) scale(0.98);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    dialog[open] {
      animation: none;
    }
  }
  dialog::backdrop {
    background: rgba(0, 0, 0, 0.55);
    backdrop-filter: blur(4px);
  }
  dialog.compact {
    height: fit-content;
    width: min(420px, calc(100vw - 32px));
  }
  @media (max-width: 600px) {
    dialog:not(.compact) {
      width: 100vw;
      max-width: 100vw;
      height: 100dvh;
      max-height: 100dvh;
      border-radius: 0;
    }
  }
  form {
    display: flex;
    flex-direction: column;
    max-height: inherit;
    height: 100%;
  }
  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 8px 0 16px;
  }
  header h2 {
    font-size: 1.25rem;
    font-weight: 500;
    margin: 0;
  }
  .body {
    padding: 8px 16px 16px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: var(--vl-gap);
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: var(--vl-gap);
  }
  .help {
    margin: 0;
    font-size: 0.875rem;
    color: var(--vl-muted);
  }
  .check {
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: 40px;
  }
  details summary {
    cursor: pointer;
    min-height: 40px;
    display: flex;
    align-items: center;
    color: var(--primary-text-color);
    text-decoration: underline;
    text-underline-offset: 3px;
  }
  details[open] summary {
    margin-bottom: var(--vl-gap);
  }
  .warnings {
    border: 1px solid var(--warning-color, #ffa600);
    border-radius: 8px;
    padding: 8px 12px;
  }
  .warnings ul {
    margin: 4px 0 0;
    padding-left: 20px;
  }
  footer {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 8px;
    padding: 12px 16px 16px;
    border-top: 1px solid var(--vl-border);
    margin-top: auto;
  }
`;var K1=class extends f{static{this.properties={hass:{attribute:!1},_message:{state:!0},_confirmLabel:{state:!0},_danger:{state:!0}}}static{this.styles=[b,N]}constructor(){super(),this._message="",this._confirmLabel="",this._danger=!0}async ask(C,H,V=!0){return this._message=C,this._confirmLabel=H??"",this._danger=V,await this.updateComplete,this.renderRoot.querySelector("dialog").showModal(),new Promise(M=>{this._resolve=M})}_answer(C){this.renderRoot.querySelector("dialog").close(),this._resolve?.(C),this._resolve=void 0}render(){return t`<dialog
      role="alertdialog"
      aria-describedby="confirm-message"
      class="compact"
      @cancel=${()=>this._resolve?.(!1)}
    >
      <div class="body">
        <p id="confirm-message">${this._message}</p>
      </div>
      <footer>
        <button type="button" @click=${()=>this._answer(!1)}>
          ${L(this.hass,"common.cancel")}
        </button>
        <button
          type="button"
          class=${this._danger?"danger":"primary"}
          @click=${()=>this._answer(!0)}
        >
          ${this._confirmLabel||L(this.hass,"common.delete")}
        </button>
      </footer>
    </dialog>`}};var B=220,P1=[b,g`
    :host {
      display: block;
      position: relative;
    }
    svg.chart {
      width: 100%;
      height: ${B}px;
      display: block;
      overflow: visible;
    }
    .axis {
      fill: var(--vl-muted);
      font-size: 12px;
    }
    .grid {
      stroke: var(--vl-border);
      stroke-dasharray: 2 4;
    }
    .plot {
      animation: vl-draw 0.6s ease-out both;
    }
    @keyframes vl-draw {
      from {
        opacity: 0;
        transform: translateY(6px);
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .plot {
        animation: none;
      }
    }
    ul.legend {
      list-style: none;
      display: flex;
      flex-wrap: wrap;
      gap: 4px 16px;
      padding: 0;
      margin: 8px 0 0;
      font-size: 0.875rem;
    }
    ul.legend li {
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    ul.legend svg {
      flex: none;
    }
  `],W=class extends f{static{this.properties={hass:{attribute:!1},_width:{state:!0}}}static{this.styles=P1}constructor(){super(),this._width=600}connectedCallback(){super.connectedCallback(),this._observer=new ResizeObserver(([C])=>{let H=Math.round(C.contentRect.width);H>0&&Math.abs(H-this._width)>2&&(this._width=H)}),this._observer.observe(this)}disconnectedCallback(){super.disconnectedCallback(),this._observer?.disconnect()}},C3=0,f5=()=>`vl-grad-${++C3}`;var H1={top:12,right:12,bottom:28,left:44},O5="#1e88e5",b5="#ef6c00";function B1(r,C,H,V){let i=C.length,A=h=>{let O=y1(r,C[h].slice(0,7)),k=i===1?"middle":h===0?"start":h===i-1?"end":"middle",$=O.length*6.5,c=k==="start"?H(h):k==="end"?H(h)-$:H(h)-$/2;return{x:H(h),text:O,anchor:k,left:c,right:c+$}};if(i===0)return[];if(i===1)return[A(0)];let a=A(i-1),d=[A(0)],u=Math.max(2,Math.floor(V/90)),s=Math.max(1,Math.ceil(i/u));for(let h=s;h<i-1;h+=s){let O=A(h);O.left>=d[d.length-1].right+12&&O.right+12<=a.left&&d.push(O)}return a.left>=d[d.length-1].right+12||d.length===1?d.push(a):d[d.length-1]=a,d}var q1=class extends W{static{this.properties={...W.properties,points:{attribute:!1},unit:{type:String},window:{type:Number}}}static{this.styles=P1}constructor(){super(),this.points=[],this.unit="",this.window=5}render(){let C=this.hass,H=this.points;if(!H.length)return t`<p class="empty">${L(C,"stats.curve_empty")}</p>`;let V=this._width,e=H.flatMap(v=>[v.value,v.moving_average]),M=Math.min(...e),i=Math.max(...e),A=Math.max((i-M)*.15,.5);M=Math.max(0,M-A),i+=A;let a=V-H1.left-H1.right,d=B-H1.top-H1.bottom,u=v=>H1.left+(H.length===1?a/2:v/(H.length-1)*a),s=v=>H1.top+d-(v-M)/(i-M)*d,h=[0,.5,1].map(v=>M+v*(i-M)),O=H.map((v,y)=>`${y?"L":"M"}${u(y)},${s(v.moving_average)}`).join(" "),k=B1(C,H.map(v=>v.date),u,a),$=L(C,"stats.moving_average",{count:this.window}),c=L(C,"stats.curve_summary",{count:H.length,start:Z(C,H[0].date),end:Z(C,H[H.length-1].date)});return t`
      <svg class="chart" viewBox="0 0 ${V} ${B}" role="img" aria-label=${c}>
        ${h.map(v=>P`<line class="grid" x1=${H1.left} x2=${V-H1.right} y1=${s(v)} y2=${s(v)}></line>
            <text class="axis" x=${H1.left-6} y=${s(v)+4} text-anchor="end">${p(C,v,1)}</text>`)}
        <g class="plot">
        <path d=${O} fill="none" stroke=${b5} stroke-width="2.5"
          stroke-linejoin="round" stroke-linecap="round"></path>
        ${H.map((v,y)=>P`<circle cx=${u(y)} cy=${s(v.value)} r="4" fill=${O5}
              stroke="var(--card-background-color, #fff)" stroke-width="1.5">
              <title>${Z(C,v.date)} : ${p(C,v.value,2)} ${this.unit} (${$} : ${p(C,v.moving_average,2)})</title>
            </circle>`)}
        </g>
        ${k.map(v=>P`<text class="axis" x=${v.x} y=${B-8} text-anchor=${v.anchor}>${v.text}</text>`)}
      </svg>
      <ul class="legend">
        <li>
          <svg width="14" height="14" aria-hidden="true" style="height:14px">
            <circle cx="7" cy="7" r="5" fill=${O5}></circle>
          </svg>
          ${L(C,"stats.curve_point")} (${this.unit})
        </li>
        <li>
          <svg width="20" height="14" aria-hidden="true" style="height:14px">
            <line x1="1" x2="19" y1="7" y2="7" stroke=${b5} stroke-width="3"></line>
          </svg>
          ${$}
        </li>
      </ul>
      <div class="visually-hidden">
        <table>
          <caption>${c}</caption>
          <thead>
            <tr>
              <th scope="col">${L(C,"fuel.date")}</th>
              <th scope="col">${L(C,"stats.curve_point")} (${this.unit})</th>
              <th scope="col">${$}</th>
            </tr>
          </thead>
          <tbody>
            ${H.map(v=>t`<tr>
                <th scope="row">${Z(C,v.date)}</th>
                <td>${p(C,v.value,2)}</td>
                <td>${p(C,v.moving_average,2)}</td>
              </tr>`)}
          </tbody>
        </table>
      </div>
    `}};var X1=class extends f{constructor(){super();this._file=null;this.categories=[],this.currency="EUR",this._values={},this._error="",this._busy=!1,this._entry=null}static{this.properties={hass:{attribute:!1},vehicle:{attribute:!1},categories:{attribute:!1},currency:{type:String},_values:{state:!0},_error:{state:!0},_busy:{state:!0},_entry:{state:!0}}}static{this.styles=[b,N]}get _dialog(){return this.renderRoot.querySelector("dialog")}async open(H=null){this._entry=H,this._error="",this._file=null,this._values=H?{date:H.date,amount:D(this.hass,H.amount,2),category_id:H.category_id,odometer:H.odometer!==null?D(this.hass,H.odometer,0):"",description:H.description}:{date:X(),category_id:"maintenance"},this.categories.some(e=>e.id===this._values.category_id)||(this._values={...this._values,category_id:this.categories[0]?.id??"other"}),await this.updateComplete;let V=this.renderRoot.querySelector("#attachment");V&&(V.value=""),this._dialog.showModal(),this.renderRoot.querySelector("#amount")?.focus()}close(){this._dialog?.close()}_set(H,V){this._values={...this._values,[H]:V}}_saved(){this.dispatchEvent(new CustomEvent("saved",{bubbles:!0,composed:!0}))}async _submit(){this._error="";let H=R(this._values.amount??"");if(H===null){this._error=L(this.hass,"expense.amount",{currency:this.currency});return}let V=R(this._values.odometer??""),e={amount:H,category_id:this._values.category_id,description:this._values.description??"",date:this._values.date||X(),odometer:V};this._entry&&(e.expense_id=this._entry.id),this._busy=!0;try{let M=await o5(this.hass,this.vehicle.id,e);if(this._file)try{await a5(this.hass,this.vehicle.id,M.id,this._file)}catch(i){this._entry=M,this._error=L(this.hass,"expense.attachment_error",{code:i.message}),this._saved();return}this.close(),this._saved()}catch(M){this._error=L(this.hass,"common.error",{message:M.message})}finally{this._busy=!1}}async _viewAttachment(){if(!this._entry)return;let H=await d5(this.hass,this.vehicle.id,this._entry.id);window.open(H,"_blank","noopener")}async _removeAttachment(){this._entry&&(await A5(this.hass,this.vehicle.id,this._entry.id),this._entry={...this._entry,attachment:null},this._saved())}render(){if(!this.vehicle)return o;let H=this.hass,V=L(H,this._entry?"expense.title_edit":"expense.title_new");return t`<dialog aria-labelledby="expense-title">
      <form
        method="dialog"
        @submit=${e=>{e.preventDefault(),this._submit()}}
      >
        <header>
          <h2 id="expense-title">${V} · ${this.vehicle.name}</h2>
          <button
            type="button"
            class="icon"
            aria-label=${L(H,"common.close")}
            @click=${()=>this.close()}
          >
            ${l(I)}
          </button>
        </header>
        <div class="body">
          <div class="grid">
            <div class="field">
              <label for="amount">${L(H,"expense.amount",{currency:this.currency})}</label>
              <input
                id="amount"
                inputmode="decimal"
                autocomplete="off"
                required
                .value=${this._values.amount??""}
                @input=${e=>this._set("amount",e.target.value)}
              />
            </div>
            <div class="field">
              <label for="category">${L(H,"expense.category")}</label>
              <select
                id="category"
                @change=${e=>this._set("category_id",e.target.value)}
              >
                ${this.categories.map(e=>t`<option value=${e.id} ?selected=${e.id===this._values.category_id}>
                      ${e.label}
                    </option>`)}
              </select>
            </div>
            <div class="field">
              <label for="date">${L(H,"fuel.date")}</label>
              <input
                id="date"
                type="date"
                .value=${this._values.date??""}
                @change=${e=>this._set("date",e.target.value)}
              />
            </div>
            <div class="field">
              <label for="odometer">
                ${L(H,"expense.odometer",{unit:this.vehicle.units.distance})}
              </label>
              <input
                id="odometer"
                inputmode="decimal"
                autocomplete="off"
                aria-describedby="odometer-hint"
                .value=${this._values.odometer??""}
                @input=${e=>this._set("odometer",e.target.value)}
              />
              <span class="hint" id="odometer-hint">${L(H,"common.optional")}</span>
            </div>
          </div>
          <div class="field">
            <label for="description">${L(H,"expense.description")}</label>
            <textarea
              id="description"
              .value=${this._values.description??""}
              @input=${e=>this._set("description",e.target.value)}
            ></textarea>
          </div>
          <div class="field">
            <label for="attachment">${L(H,"expense.attachment")}</label>
            <input
              id="attachment"
              type="file"
              accept="image/jpeg,image/png,image/webp,application/pdf"
              @change=${e=>{this._file=e.target.files?.[0]??null}}
            />
            ${this._entry?.attachment?t`<div class="check">
                  <button type="button" @click=${()=>this._viewAttachment()}>
                    ${l(w1)} ${L(H,"expense.attachment_view")}
                  </button>
                  <button type="button" class="danger" @click=${()=>this._removeAttachment()}>
                    ${L(H,"expense.attachment_remove")}
                  </button>
                </div>`:o}
          </div>
          ${this._error?t`<p class="error" role="alert">${this._error}</p>`:o}
        </div>
        <footer>
          <button type="button" @click=${()=>this.close()}>${L(H,"common.cancel")}</button>
          <button type="submit" class="primary" ?disabled=${this._busy}>
            ${L(H,"common.save")}
          </button>
        </footer>
      </form>
    </dialog>`}};var y5=["pleins","depenses","depenses_recurrentes","releves","rappels"];function H3(r){return r.normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[^A-Za-z0-9]+/g,"-").replace(/^-|-$/g,"").toLowerCase()||"vehicule"}function _5(r,C){let H=new Blob(["\uFEFF",C],{type:"text/csv;charset=utf-8"}),V=URL.createObjectURL(H),e=document.createElement("a");e.href=V,e.download=r,document.body.append(e),e.click(),e.remove(),setTimeout(()=>URL.revokeObjectURL(V),1e3)}var Y1=class extends f{static{this.properties={hass:{attribute:!1},vehicle:{attribute:!1},_files:{state:!0},_rows:{state:!0},_error:{state:!0}}}static{this.styles=[b,N,Y,g`
      .main {
        flex: 1;
        display: flex;
        flex-direction: column;
      }
      .sub {
        font-size: 0.875rem;
        color: var(--vl-muted);
      }
    `]}constructor(){super(),this._files=null,this._rows={},this._error=""}get _dialog(){return this.renderRoot.querySelector("dialog")}async open(){this._files=null,this._error="",await this.updateComplete,this._dialog.showModal();try{let C=await c5(this.hass,this.vehicle.id);this._rows=C.rows,this._files=C.files}catch(C){this._error=L(this.hass,"common.error",{message:C.message})}}close(){this._dialog?.close()}_fileName(C){return`carbu-${H3(this.vehicle.name)}-${C.replace(/\.csv$/,"")}-${X()}.csv`}_names(){let C=this._files??{};return Object.keys(C).sort((H,V)=>y5.indexOf(H.replace(/\.csv$/,""))-y5.indexOf(V.replace(/\.csv$/,"")))}_all(){let C=this._files??{};this._names().filter(V=>(this._rows[V]??0)>0).forEach((V,e)=>setTimeout(()=>_5(this._fileName(V),C[V]),e*300))}render(){if(!this.vehicle)return o;let C=this.hass,H=this._files;return t`<dialog aria-labelledby="export-title">
      <header>
        <h2 id="export-title">${L(C,"export.title")} · ${this.vehicle.name}</h2>
        <button
          type="button"
          class="icon"
          aria-label=${L(C,"common.close")}
          @click=${()=>this.close()}
        >
          ${l(I)}
        </button>
      </header>
      <div class="body">
        <p class="help">${L(C,"export.help")}</p>
        ${this._error?t`<p class="error" role="alert">${this._error}</p>`:o}
        ${H?t`<ul class="entries">
              ${this._names().map(V=>{let e=V.replace(/\.csv$/,""),M=this._rows[V]??0,i=L(C,`export.file_${e}`);return t`<li>
                  <div class="main">
                    <span>${i}</span>
                    <span class="sub">${L(C,"export.lines",{count:p(C,M,0)})}</span>
                  </div>
                  <button
                    ?disabled=${M===0}
                    aria-label="${L(C,"export.download")} : ${i}"
                    @click=${()=>_5(this._fileName(V),H[V])}
                  >
                    ${l(s1)} ${L(C,"export.download")}
                  </button>
                </li>`})}
            </ul>`:this._error?o:t`<p>${L(C,"common.loading")}</p>`}
      </div>
      <footer>
        <button type="button" @click=${()=>this.close()}>${L(C,"common.close")}</button>
        <button type="button" class="primary" ?disabled=${!H} @click=${()=>this._all()}>
          ${l(s1)} ${L(C,"export.download_all")}
        </button>
      </footer>
    </dialog>`}};function k5(r,C,H,V,e){let M=C.details,i=(a,d)=>typeof M[a]=="number"?p(r,M[a],d):String(M[a]??""),A=`warning.${C.code}`;return L(r,A,{previous:i("previous",0),next:i("next",0),value:i("value",2),min:i("min",1),max:i("max",1),capacity:i("capacity",1),expected:typeof M.expected=="number"?S(r,M.expected,e):"",unit:H.units.distance,volume:H.units.volume[V]??"L",consumption:H.units.consumption[V]??""})}var w5=["volume","unit_price","total_cost"],V3={volume:2,unit_price:3,total_cost:2},J1=class extends f{static{this.properties={hass:{attribute:!1},vehicle:{attribute:!1},currency:{type:String},_values:{state:!0},_edits:{state:!0},_warnings:{state:!0},_error:{state:!0},_busy:{state:!0},_entry:{state:!0}}}static{this.styles=[b,N]}constructor(){super(),this.currency="EUR",this._values={},this._edits=[],this._warnings=[],this._error="",this._busy=!1,this._entry=null}get _dialog(){return this.renderRoot.querySelector("dialog")}async open(C=null){if(this._entry=C,this._warnings=[],this._error="",C)this._values={odometer:D(this.hass,C.odometer,1),volume:D(this.hass,C.volume,2),unit_price:D(this.hass,C.unit_price,3),total_cost:D(this.hass,C.total_cost,2),date:C.date,time:C.time??"",fuel_type:C.fuel_type,grade:C.grade??"",full_tank:C.full_tank?"1":"",station:C.station??"",notes:C.notes},this._edits=["volume","total_cost"];else{this._values={full_tank:"1",fuel_type:this.vehicle.fuel_types[0]},this._edits=[];try{let V=await M5(this.hass,this.vehicle.id),e=V.unit_price[V.fuel_type];this._values={...this._values,odometer:V.odometer!==null?String(g2(V.odometer,0)):"",fuel_type:V.fuel_type,grade:V.grade??"",date:V.date,time:V.time,unit_price:e!==null?D(this.hass,e,3):""},e!==null&&(this._edits=["unit_price"])}catch(V){this._error=V.message}}await this.updateComplete,this._dialog.showModal();let H=this.renderRoot.querySelector("#odometer");H?.focus(),H?.select()}close(){this._dialog?.close()}willUpdate(C){C.has("vehicle")&&this.vehicle&&!this._values.fuel_type&&(this._values={...this._values,fuel_type:this.vehicle.fuel_types[0]})}_derivedField(){let C=this._edits.slice(-2);return C.length<2?null:w5.find(H=>!C.includes(H))??null}_onAmountInput(C,H){let V=this._edits.filter(i=>i!==C);V.push(C),this._edits=V;let e={...this._values,[C]:H},M=this._derivedField();if(M){let i=R(e.volume??""),A=R(e.unit_price??""),a=R(e.total_cost??""),d=null;M==="total_cost"&&i!==null&&A!==null&&(d=i*A),M==="unit_price"&&i&&a!==null&&(d=a/i),M==="volume"&&A&&a!==null&&(d=a/A),e[M]=d!==null?D(this.hass,d,V3[M]):""}this._values=e,this._warnings=[]}_set(C,H){this._values={...this._values,[C]:H},this._warnings=[]}async _submit(C=!1){this._error="";let H=this._edits.slice(-2),V=R(this._values.odometer??"");if(V===null){this._error=L(this.hass,"fuel.odometer",{unit:this.vehicle.units.distance});return}let e={odometer:V,full_tank:!!this._values.full_tank,fuel_type:this._values.fuel_type,grade:this._values.fuel_type==="gasoline"&&this._values.grade||null,station:this._values.station||null,notes:this._values.notes??"",confirm:C};for(let M of H){let i=R(this._values[M]??"");i!==null&&(e[M]=i)}if(w5.filter(M=>M in e).length<2){this._error=L(this.hass,"fuel.need_two");return}this._values.date&&(e.date=this._values.date),this._values.time?e.time=this._values.time:this._values.date&&(e.time=null),this._entry&&(e.entry_id=this._entry.id),this._busy=!0;try{let M=await t5(this.hass,this.vehicle.id,e);if(!M.saved){this._warnings=M.warnings;return}this.close(),this.dispatchEvent(new CustomEvent("saved",{bubbles:!0,composed:!0}))}catch(M){this._error=L(this.hass,"common.error",{message:M.message})}finally{this._busy=!1}}_amountInput(C,H){let V=this._derivedField()===C;return t`<div class="field">
      <label for=${C}>${H}</label>
      <input
        id=${C}
        name=${C}
        inputmode="decimal"
        autocomplete="off"
        aria-describedby=${V?`${C}-hint`:o}
        class=${V?"computed":""}
        .value=${this._values[C]??""}
        @input=${e=>this._onAmountInput(C,e.target.value)}
      />
      ${V?t`<span class="hint" id="${C}-hint">${L(this.hass,"fuel.computed")}</span>`:o}
    </div>`}render(){if(!this.vehicle)return o;let C=this.hass,H=this._values.fuel_type??this.vehicle.fuel_types[0],V=this.vehicle.units.volume[H]??"L",e=L(C,this._entry?"fuel.title_edit":"fuel.title_new");return t`<dialog aria-labelledby="fuel-title" @close=${()=>this._warnings=[]}>
      <form
        method="dialog"
        @submit=${M=>{M.preventDefault(),this._submit()}}
      >
        <header>
          <h2 id="fuel-title">${e} · ${this.vehicle.name}</h2>
          <button
            type="button"
            class="icon"
            aria-label=${L(C,"common.close")}
            @click=${()=>this.close()}
          >
            ${l(I)}
          </button>
        </header>
        <div class="body">
          <div class="grid">
            <div class="field">
              <label for="odometer">
                ${L(C,"fuel.odometer",{unit:this.vehicle.units.distance})}
              </label>
              <input
                id="odometer"
                name="odometer"
                inputmode="decimal"
                autocomplete="off"
                required
                .value=${this._values.odometer??""}
                @input=${M=>this._set("odometer",M.target.value)}
              />
            </div>
            ${this._amountInput("volume",L(C,"fuel.volume",{unit:V}))}
            ${this._amountInput("total_cost",L(C,"fuel.total",{currency:this.currency}))}
            ${this._amountInput("unit_price",L(C,"fuel.unit_price",{currency:this.currency,unit:V}))}
            ${H==="gasoline"?t`<div class="field">
                  <label for="grade">${L(C,"fuel.grade")}</label>
                  <select
                    id="grade"
                    .value=${this._values.grade??""}
                    @change=${M=>this._set("grade",M.target.value)}
                  >
                    <option value="" ?selected=${!this._values.grade}>
                      ${L(C,"fuel.grade_unknown")}
                    </option>
                    ${S5.map(M=>t`<option value=${M} ?selected=${this._values.grade===M}>
                          ${U(M)}
                        </option>`)}
                  </select>
                </div>`:o}
          </div>
          <label class="check">
            <input
              type="checkbox"
              .checked=${!!this._values.full_tank}
              @change=${M=>this._set("full_tank",M.target.checked?"1":"")}
            />
            ${L(C,"fuel.full_tank")}
          </label>
          <details ?open=${!!this._entry}>
            <summary>${L(C,"common.more")}</summary>
            <div class="grid">
              <div class="field">
                <label for="date">${L(C,"fuel.date")}</label>
                <input
                  id="date"
                  type="date"
                  .value=${this._values.date??""}
                  @change=${M=>this._set("date",M.target.value)}
                />
              </div>
              <div class="field">
                <label for="time">${L(C,"fuel.time")}</label>
                <input
                  id="time"
                  type="time"
                  .value=${this._values.time??""}
                  @change=${M=>this._set("time",M.target.value)}
                />
              </div>
              ${this.vehicle.fuel_types.length>1?t`<div class="field">
                    <label for="fuel_type">${L(C,"fuel.fuel_type")}</label>
                    <select
                      id="fuel_type"
                      .value=${H}
                      @change=${M=>this._set("fuel_type",M.target.value)}
                    >
                      ${this.vehicle.fuel_types.map(M=>t`<option value=${M} ?selected=${M===H}>
                            ${L(C,`fuel_type.${M}`)}
                          </option>`)}
                    </select>
                  </div>`:o}
              <div class="field">
                <label for="station">${L(C,"fuel.station")}</label>
                <input
                  id="station"
                  autocomplete="off"
                  .value=${this._values.station??""}
                  @input=${M=>this._set("station",M.target.value)}
                />
              </div>
            </div>
            <div class="field" style="margin-top: var(--vl-gap)">
              <label for="notes">${L(C,"fuel.notes")}</label>
              <textarea
                id="notes"
                .value=${this._values.notes??""}
                @input=${M=>this._set("notes",M.target.value)}
              ></textarea>
            </div>
          </details>
          ${this._warnings.length?t`<div class="warnings" role="alert">
                ${L(C,"fuel.warnings")}
                <ul>
                  ${this._warnings.map(M=>t`<li>${k5(C,M,this.vehicle,H,this.currency)}</li>`)}
                </ul>
              </div>`:o}
          ${this._error?t`<p class="error" role="alert">${this._error}</p>`:o}
        </div>
        <footer>
          <button type="button" @click=${()=>this.close()}>${L(C,"common.cancel")}</button>
          ${this._warnings.length?t`<button
                type="button"
                class="primary"
                ?disabled=${this._busy}
                @click=${()=>this._submit(!0)}
              >
                ${L(C,"fuel.save_anyway")}
              </button>`:t`<button type="submit" class="primary" ?disabled=${this._busy}>
                ${L(C,"common.save")}
              </button>`}
        </footer>
      </form>
    </dialog>`}};var C2=class extends f{constructor(){super();this._file=null;this.categories=[],this.currency="EUR",this._preview=null,this._message="",this._error="",this._busy=!1}static{this.properties={hass:{attribute:!1},vehicle:{attribute:!1},categories:{attribute:!1},currency:{type:String},_preview:{state:!0},_message:{state:!0},_error:{state:!0},_busy:{state:!0}}}static{this.styles=[b,N,g`
      ul.lines {
        list-style: none;
        margin: 0;
        padding: 0;
        max-height: 40vh;
        overflow-y: auto;
        border: 1px solid var(--vl-border);
        border-radius: 8px;
      }
      ul.lines li {
        display: flex;
        gap: 8px;
        align-items: baseline;
        padding: 6px 10px;
        border-bottom: 1px solid var(--vl-border);
        font-size: 0.875rem;
      }
      ul.lines li:last-child {
        border-bottom: none;
      }
      .status {
        flex: none;
        font-size: 0.75rem;
        font-weight: 500;
        padding: 1px 8px;
        border-radius: 999px;
        border: 1px solid currentColor;
      }
      .status.error {
        color: var(--vl-error-text);
      }
      .status.duplicate {
        color: var(--vl-muted);
      }
      .detail {
        min-width: 0;
      }
      .line-number {
        color: var(--vl-muted);
      }
    `]}get _dialog(){return this.renderRoot.querySelector("dialog")}async open(){this._preview=null,this._message="",this._error="",this._file=null,await this.updateComplete;let H=this.renderRoot.querySelector("#file");H&&(H.value=""),this._dialog.showModal(),H?.focus()}close(){this._dialog?.close()}_errorText(H){return["unknown_format","empty","too_large","too_many_rows"].includes(H)?L(this.hass,`import.error_${H}`):L(this.hass,"common.error",{message:H})}async _analyse(H){if(this._file=H,this._preview=null,this._message="",this._error="",!!H){this._busy=!0;try{this._preview=await h2(this.hass,this.vehicle.id,H,!1)}catch(V){this._error=this._errorText(V.message)}finally{this._busy=!1}}}async _apply(){if(this._file){this._busy=!0;try{let H=await h2(this.hass,this.vehicle.id,this._file,!0);this._message=L(this.hass,"import.done",{count:H.added}),this._preview=null,this.dispatchEvent(new CustomEvent("saved",{bubbles:!0,composed:!0}))}catch(H){this._error=this._errorText(H.message)}finally{this._busy=!1}}}_describe(H,V){let e=this.hass,M=this.vehicle.units.distance,i=typeof V.date=="string"?Z(e,V.date):"";if(H==="fuel"){let a=String(V.fuel_type??this.vehicle.fuel_types[0]),d=this.vehicle.units.volume[a]??"L";return`${i} \xB7 ${p(e,V.odometer,0)} ${M} \xB7 ${p(e,V.volume,2)} ${d} \xB7 ${S(e,V.total_cost,this.currency)}`}if(H==="expenses"){let d=this.categories.find(u=>u.id===V.category_id)?.label??"";return`${i} \xB7 ${S(e,V.amount,this.currency)}${d?` \xB7 ${d}`:""}${V.description?` \xB7 ${String(V.description)}`:""}`}if(H==="odometer")return`${i} \xB7 ${p(e,V.odometer,0)} ${M}`;let A=[typeof V.due_date=="string"?Z(e,V.due_date):"",typeof V.due_odometer=="number"?`${p(e,V.due_odometer,0)} ${M}`:""].filter(Boolean);return[String(V.label??""),...A].join(" \xB7 ")}_renderPreview(H){let V=this.hass,e=L(V,`import.kind_${H.kind}`);return t`
      <p aria-live="polite">${L(V,"import.summary",{kind:e,...H.counts})}</p>
      ${H.new_categories.length?t`<p>${L(V,"import.new_categories",{names:H.new_categories.join(", ")})}</p>`:o}
      ${H.lines.length?t`<ul class="lines">
            ${H.lines.map(M=>t`<li>
                <span class="status ${M.status}">
                  ${L(V,`import.status_${M.status}`)}
                </span>
                <span class="detail">
                  <span class="line-number">${L(V,"import.line",{line:M.line})}</span>
                  —
                  ${M.status==="error"?M.message:M.values?this._describe(H.kind,M.values):""}
                </span>
              </li>`)}
          </ul>`:o}
      ${H.truncated?t`<p class="muted">${L(V,"import.truncated")}</p>`:o}
    `}render(){if(!this.vehicle)return o;let H=this.hass,V=this._preview?.counts.new??0;return t`<dialog aria-labelledby="import-title">
      <form
        method="dialog"
        @submit=${e=>{e.preventDefault(),V&&this._apply()}}
      >
        <header>
          <h2 id="import-title">${L(H,"import.title")} · ${this.vehicle.name}</h2>
          <button
            type="button"
            class="icon"
            aria-label=${L(H,"common.close")}
            @click=${()=>this.close()}
          >
            ${l(I)}
          </button>
        </header>
        <div class="body">
          <p class="muted" id="import-help">${L(H,"import.help")}</p>
          <div class="field">
            <label for="file">${L(H,"import.file")}</label>
            <input
              id="file"
              type="file"
              accept=".csv,text/csv"
              aria-describedby="import-help"
              @change=${e=>this._analyse(e.target.files?.[0]??null)}
            />
          </div>
          ${this._busy&&!this._preview?t`<p aria-live="polite">${L(H,"import.analyzing")}</p>`:o}
          ${this._preview?this._renderPreview(this._preview):o}
          ${this._message?t`<p role="status">${this._message}</p>`:o}
          ${this._error?t`<p class="error" role="alert">${this._error}</p>`:o}
        </div>
        <footer>
          <button type="button" @click=${()=>this.close()}>
            ${L(H,this._message?"common.close":"common.cancel")}
          </button>
          ${this._preview?t`<button type="submit" class="primary" ?disabled=${this._busy||!V}>
                ${L(H,"import.confirm",{count:V})}
              </button>`:o}
        </footer>
      </form>
    </dialog>`}};var V1={top:12,right:12,bottom:28,left:80};function L3(r){let C=10**Math.floor(Math.log10(r)),H=r/C;return(H<=1?1:H<=2?2:H<=2.5?2.5:H<=5?5:10)*C}function R2(r){let[C,H,V]=r.split("-").map(Number);return Date.UTC(C,H-1,V)/864e5}var H2=class extends W{constructor(){super();this._gradient=f5();this.series=[],this.format=H=>String(H),this.name="",this.zeroBased=!1}static{this.properties={...W.properties,series:{attribute:!1},format:{attribute:!1},name:{type:String},zeroBased:{type:Boolean,attribute:"zero-based"}}}render(){let H=this.hass,V=this.series.filter(m=>m.points.length),e=[...new Set(V.flatMap(m=>m.points.map(T=>T.date)))].sort();if(e.length<2)return t`<p class="empty">${L(H,"stats.line_empty")}</p>`;let M=this._width,i=V.flatMap(m=>m.points.map(T=>T.value)),A=this.zeroBased?0:Math.min(...i),a=Math.max(...i),d=Math.max((a-A)*.1,Math.abs(a)*.01,1e-6);this.zeroBased||(A=Math.max(0,A-d)),a+=d;let u=L3((a-A)/3);A=Math.floor(A/u)*u,a=Math.ceil(a/u)*u;let s=[];for(let m=A;m<=a+u/2;m+=u)s.push(m);let h=M-V1.left-V1.right,O=B-V1.top-V1.bottom,k=R2(e[0]),$=Math.max(1,R2(e[e.length-1])-k),c=m=>V1.left+(R2(m)-k)/$*h,v=m=>V1.top+O-(m-A)/(a-A)*O,y=B1(H,e,m=>c(e[m]),h),x=L(H,"stats.line_summary",{name:this.name,count:e.length,start:Z(H,e[0]),end:Z(H,e[e.length-1])}),K=e.length<=40;return t`
      <svg class="chart" viewBox="0 0 ${M} ${B}" role="img" aria-label=${x}>
        ${s.map(m=>P`<line class="grid" x1=${V1.left} x2=${M-V1.right} y1=${v(m)} y2=${v(m)}></line>
            <text class="axis" x=${V1.left-6} y=${v(m)+4} text-anchor="end">${this.format(m)}</text>`)}
        <defs>
          ${V.map((m,T)=>P`<linearGradient id="${this._gradient}-${T}" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stop-color=${m.color} stop-opacity="0.28"></stop>
              <stop offset="100%" stop-color=${m.color} stop-opacity="0"></stop>
            </linearGradient>`)}
        </defs>
        ${V.map((m,T)=>{let q=m.points.map((E,c1)=>`${c1?"L":"M"}${c(E.date)},${v(E.value)}`).join(" "),n=m.points[0],w=m.points[m.points.length-1],F=T===0?`${q} L${c(w.date)},${v(A)} L${c(n.date)},${v(A)} Z`:"";return P`<g class="plot">
            ${F?P`<path d=${F} fill="url(#${this._gradient}-${T})" stroke="none"></path>`:o}
            <path d=${q} fill="none" stroke=${m.color} stroke-width="2.25"
              stroke-linejoin="round" stroke-linecap="round"></path>
            ${m.points.map(E=>P`<circle cx=${c(E.date)} cy=${v(E.value)} r=${K?3:0}
                fill=${m.color} stroke="var(--card-background-color, #fff)" stroke-width="1">
                <title>${Z(H,E.date)} · ${m.label} : ${this.format(E.value)}</title>
              </circle>`)}
          </g>`})}
        ${y.map(m=>P`<text class="axis" x=${m.x} y=${B-8} text-anchor=${m.anchor}>${m.text}</text>`)}
      </svg>
      ${V.length>1?t`<ul class="legend">
            ${V.map(m=>t`<li>
                <svg width="18" height="14" aria-hidden="true" style="height:14px">
                  <line x1="1" x2="17" y1="7" y2="7" stroke=${m.color} stroke-width="3"></line>
                </svg>
                ${m.label}
              </li>`)}
          </ul>`:o}
      <div class="visually-hidden">
        <table>
          <caption>${x}</caption>
          <thead>
            <tr>
              <th scope="col">${L(H,"fuel.date")}</th>
              ${V.map(m=>t`<th scope="col">${m.label}</th>`)}
            </tr>
          </thead>
          <tbody>
            ${e.map(m=>t`<tr>
                <th scope="row">${Z(H,m)}</th>
                ${V.map(T=>{let q=T.points.find(n=>n.date===m);return t`<td>${q?this.format(q.value):"\u2014"}</td>`})}
              </tr>`)}
          </tbody>
        </table>
      </div>
    `}};var e3="#2e7d32",V2=["#1e88e5","#8e24aa","#00897b","#f4511e","#3949ab","#e53935"],j={top:12,right:8,bottom:28,left:56};function M3(r){if(r<=0)return 1;let C=10**Math.floor(Math.log10(r));return([1,2,2.5,5,10].find(V=>V*C>=r)??10)*C}var L2=class extends W{static{this.properties={...W.properties,data:{attribute:!1},categories:{attribute:!1},currency:{type:String}}}static{this.styles=[...P1,g`
      g.bar:hover rect.hit {
        fill: var(--primary-color);
        fill-opacity: 0.08;
      }
      .swatch {
        width: 12px;
        height: 12px;
        border-radius: 3px;
        display: inline-block;
        flex: none;
      }
    `]}constructor(){super(),this.data=[],this.categories=[],this.currency="EUR"}_series(){let C=new Set(this.data.flatMap(e=>Object.keys(e.values))),H=[];C.has("fuel")&&H.push({id:"fuel",label:L(this.hass,"category.fuel"),color:e3});let V=0;for(let e of this.categories)C.has(e.id)&&H.push({id:e.id,label:e.label,color:e.color??V2[V++%V2.length]});for(let e of C)H.some(M=>M.id===e)||H.push({id:e,label:e,color:V2[V++%V2.length]});return H}render(){let C=this.hass,H=this._series(),V=this.data.map(c=>Object.values(c.values).reduce((v,y)=>v+y,0)),e=M3(Math.max(0,...V));if(!V.some(c=>c>0))return t`<p class="empty">${L(C,"chart.empty")}</p>`;let M=this._width,i=M-j.left-j.right,A=B-j.top-j.bottom,a=i/this.data.length,d=Math.min(36,a*.7),u=a<34?2:1,s=c=>j.top+A-c/e*A,h=[0,.25,.5,.75,1].map(c=>c*e),O=c=>S(C,c,this.currency),k=c=>S(C,c,this.currency,0),$=L(C,"chart.summary",{count:this.data.length});return t`
      <svg
        class="chart"
        viewBox="0 0 ${M} ${B}"
        height=${B}
        role="img"
        aria-label=${$}
      >
        ${h.map(c=>P`
            <line class="grid" x1=${j.left} x2=${M-j.right} y1=${s(c)} y2=${s(c)}></line>
            <text class="axis" x=${j.left-6} y=${s(c)+4} text-anchor="end">${k(c)}</text>`)}
        ${this.data.map((c,v)=>{let y=j.left+v*a+(a-d)/2,x=0,K=[`${y1(C,c.month)} \u2014 ${L(C,"chart.total")} ${O(V[v])}`,...H.filter(m=>c.values[m.id]).map(m=>`${m.label} : ${O(c.values[m.id])}`)].join(`
`);return P`<g class="bar">
            <title>${K}</title>
            <rect class="hit" x=${j.left+v*a} y=${j.top} width=${a} height=${A} fill="transparent"></rect>
            ${H.map(m=>{let T=c.values[m.id]??0;if(T<=0)return o;let q=s(x+T),n=s(x)-q;return x+=T,P`<rect x=${y} y=${q} width=${d} height=${Math.max(n,.5)}
                fill=${m.color} stroke="var(--card-background-color, #fff)" stroke-width="1"></rect>`})}
            ${(this.data.length-1-v)%u===0?P`<text class="axis" x=${y+d/2} y=${B-8} text-anchor="middle">${Z5(C,c.month)}</text>`:o}
          </g>`})}
      </svg>
      <ul class="legend" aria-label=${L(C,"section.monthly")}>
        ${H.map(c=>t`<li>
            <span class="swatch" style="background:${c.color}" aria-hidden="true"></span>${c.label}
          </li>`)}
      </ul>
      <div class="visually-hidden"><table>
        <caption>${$}</caption>
        <thead>
          <tr>
            <th scope="col">${L(C,"chart.month")}</th>
            ${H.map(c=>t`<th scope="col">${c.label}</th>`)}
            <th scope="col">${L(C,"chart.total")}</th>
          </tr>
        </thead>
        <tbody>
          ${this.data.map((c,v)=>t`<tr>
              <th scope="row">${y1(C,c.month)}</th>
              ${H.map(y=>t`<td>${O(c.values[y.id]??0)}</td>`)}
              <td>${O(V[v])}</td>
            </tr>`)}
        </tbody>
      </table></div>
    `}};var L1={top:12,right:12,bottom:28,left:52},r3="#78909c",P5={e10:"#43a047",sp95:"#1e88e5",sp98:"#8e24aa",none:"#757575"},e2=class extends W{static{this.properties={...W.properties,points:{attribute:!1},currency:{type:String},unit:{type:String}}}constructor(){super(),this.points=[],this.currency="EUR",this.unit="L"}render(){let C=this.hass,H=this.points;if(!H.length)return t`<p class="empty">${L(C,"stats.price_empty")}</p>`;let V=this._width,e=H.map(x=>x.value),M=Math.min(...e),i=Math.max(...e),A=Math.max((i-M)*.15,.02);M=Math.max(0,M-A),i+=A;let a=V-L1.left-L1.right,d=B-L1.top-L1.bottom,u=x=>L1.left+(H.length===1?a/2:x/(H.length-1)*a),s=x=>L1.top+d-(x-M)/(i-M)*d,h=[0,.5,1].map(x=>M+x*(i-M)),O=H.map((x,K)=>`${K?"L":"M"}${u(K)},${s(x.value)}`).join(" "),k=B1(C,H.map(x=>x.date),u,a),$=[...new Set(H.map(x=>x.grade??"none"))],c=x=>x==="none"?L(C,"stats.grade_unknown"):U(x),v=x=>`${S(C,x,this.currency,3)}/${this.unit}`,y=L(C,"stats.price_summary",{count:H.length,start:Z(C,H[0].date),end:Z(C,H[H.length-1].date)});return t`
      <svg class="chart" viewBox="0 0 ${V} ${B}" role="img" aria-label=${y}>
        ${h.map(x=>P`<line class="grid" x1=${L1.left} x2=${V-L1.right} y1=${s(x)} y2=${s(x)}></line>
            <text class="axis" x=${L1.left-6} y=${s(x)+4} text-anchor="end">${S(C,x,this.currency,2)}</text>`)}
        <g class="plot">
        <path d=${O} fill="none" stroke=${r3} stroke-width="1.5" stroke-linejoin="round"></path>
        ${H.map((x,K)=>P`<circle cx=${u(K)} cy=${s(x.value)} r="4"
              fill=${P5[x.grade??"none"]}
              stroke="var(--card-background-color, #fff)" stroke-width="1.5">
              <title>${Z(C,x.date)} : ${v(x.value)}${x.grade?` (${U(x.grade)})`:""}</title>
            </circle>`)}
        </g>
        ${k.map(x=>P`<text class="axis" x=${x.x} y=${B-8} text-anchor=${x.anchor}>${x.text}</text>`)}
      </svg>
      <ul class="legend">
        ${$.map(x=>t`<li>
            <svg width="14" height="14" aria-hidden="true" style="height:14px">
              <circle cx="7" cy="7" r="5" fill=${P5[x]}></circle>
            </svg>
            ${c(x)}
          </li>`)}
      </ul>
      <div class="visually-hidden">
        <table>
          <caption>${y}</caption>
          <thead>
            <tr>
              <th scope="col">${L(C,"fuel.date")}</th>
              <th scope="col">${L(C,"stats.price_point")}</th>
              <th scope="col">${L(C,"fuel.grade")}</th>
            </tr>
          </thead>
          <tbody>
            ${H.map(x=>t`<tr>
                <th scope="row">${Z(C,x.date)}</th>
                <td>${v(x.value)}</td>
                <td>${x.grade?U(x.grade):"\u2014"}</td>
              </tr>`)}
          </tbody>
        </table>
      </div>
    `}};var t3=[1,2,3,6,12],M2=class extends f{static{this.properties={hass:{attribute:!1},vehicle:{attribute:!1},categories:{attribute:!1},currency:{type:String},_values:{state:!0},_error:{state:!0},_busy:{state:!0},_entry:{state:!0}}}static{this.styles=[b,N]}constructor(){super(),this.categories=[],this.currency="EUR",this._values={},this._error="",this._busy=!1,this._entry=null}get _dialog(){return this.renderRoot.querySelector("dialog")}async open(C=null){this._entry=C,this._error="",this._values=C?{label:C.label,amount:D(this.hass,C.amount,2),category_id:C.category_id,interval_months:String(C.interval_months),start_date:C.start_date,end_date:C.end_date??"",active:C.active?"1":""}:{category_id:"insurance",interval_months:"1",start_date:X(),active:"1"},this.categories.some(H=>H.id===this._values.category_id)||(this._values={...this._values,category_id:this.categories[0]?.id??"other"}),await this.updateComplete,this._dialog.showModal(),this.renderRoot.querySelector("#label")?.focus()}close(){this._dialog?.close()}_set(C,H){this._values={...this._values,[C]:H}}async _submit(){this._error="";let C=R(this._values.amount??"");if(C===null||C<=0){this._error=L(this.hass,"expense.amount",{currency:this.currency});return}let H={label:(this._values.label??"").trim(),amount:C,category_id:this._values.category_id,interval_months:Number(this._values.interval_months||1),start_date:this._values.start_date||X(),end_date:this._values.end_date||null,active:!!this._values.active};this._entry&&(H.recurring_id=this._entry.id),this._busy=!0;try{await x5(this.hass,this.vehicle.id,H),this.close(),this.dispatchEvent(new CustomEvent("saved",{bubbles:!0,composed:!0}))}catch(V){this._error=L(this.hass,"common.error",{message:V.message})}finally{this._busy=!1}}render(){if(!this.vehicle)return o;let C=this.hass,H=this._values,V=L(C,this._entry?"recurring.title_edit":"recurring.title_new"),e=M=>i=>this._set(M,i.target.value);return t`<dialog aria-labelledby="recurring-title">
      <form
        method="dialog"
        @submit=${M=>{M.preventDefault(),this._submit()}}
      >
        <header>
          <h2 id="recurring-title">${V} · ${this.vehicle.name}</h2>
          <button
            type="button"
            class="icon"
            aria-label=${L(C,"common.close")}
            @click=${()=>this.close()}
          >
            ${l(I)}
          </button>
        </header>
        <div class="body">
          <p class="help" id="recurring-help">${L(C,"recurring.help")}</p>
          <div class="field">
            <label for="label">${L(C,"recurring.label")}</label>
            <input
              id="label"
              required
              maxlength="100"
              autocomplete="off"
              aria-describedby="recurring-help"
              .value=${H.label??""}
              @input=${e("label")}
            />
          </div>
          <div class="grid">
            <div class="field">
              <label for="amount">${L(C,"expense.amount",{currency:this.currency})}</label>
              <input
                id="amount"
                inputmode="decimal"
                autocomplete="off"
                required
                .value=${H.amount??""}
                @input=${e("amount")}
              />
            </div>
            <div class="field">
              <label for="interval">${L(C,"recurring.interval")}</label>
              <select id="interval" @change=${e("interval_months")}>
                ${t3.map(M=>t`<option value=${M} ?selected=${String(M)===H.interval_months}>
                      ${L(C,`recurring.interval_${M}`)}
                    </option>`)}
              </select>
            </div>
            <div class="field">
              <label for="category">${L(C,"expense.category")}</label>
              <select id="category" @change=${e("category_id")}>
                ${this.categories.map(M=>t`<option value=${M.id} ?selected=${M.id===H.category_id}>
                      ${M.label}
                    </option>`)}
              </select>
            </div>
            <div class="field">
              <label for="start">${L(C,"recurring.start")}</label>
              <input
                id="start"
                type="date"
                required
                .value=${H.start_date??""}
                @change=${e("start_date")}
              />
            </div>
            <div class="field">
              <label for="end">${L(C,"recurring.end")}</label>
              <input
                id="end"
                type="date"
                aria-describedby="end-hint"
                min=${H.start_date??o}
                .value=${H.end_date??""}
                @change=${e("end_date")}
              />
              <span class="hint" id="end-hint">${L(C,"common.optional")}</span>
            </div>
          </div>
          <label class="check">
            <input
              type="checkbox"
              .checked=${!!H.active}
              @change=${M=>this._set("active",M.target.checked?"1":"")}
            />
            ${L(C,"recurring.active")}
          </label>
          ${this._error?t`<p class="error" role="alert">${this._error}</p>`:o}
        </div>
        <footer>
          <button type="button" @click=${()=>this.close()}>${L(C,"common.cancel")}</button>
          <button type="submit" class="primary" ?disabled=${this._busy}>
            ${L(C,"common.save")}
          </button>
        </footer>
      </form>
    </dialog>`}};var r2=class extends f{static{this.properties={hass:{attribute:!1},vehicle:{attribute:!1},categories:{attribute:!1},currency:{type:String},_items:{state:!0}}}static{this.styles=[b,Y,g`
      .dot {
        flex: none;
        width: 10px;
        height: 10px;
        border-radius: 50%;
      }
      .main {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
      }
      .sub {
        font-size: 0.875rem;
        color: var(--vl-muted);
      }
      .amount {
        flex: none;
        text-align: right;
        font-variant-numeric: tabular-nums;
        display: flex;
        flex-direction: column;
      }
      .actions {
        display: flex;
        flex: none;
      }
      li.off .main,
      li.off .amount {
        opacity: 0.7;
      }
      .total {
        margin: 6px 0 0;
        font-size: 0.875rem;
        color: var(--vl-muted);
        text-align: right;
      }
    `]}constructor(){super(),this.categories=[],this.currency="EUR",this._items=[]}async reload(){this.vehicle&&(this._items=await v5(this.hass,this.vehicle.id))}updated(C){C.has("vehicle")&&this.vehicle&&this.reload()}openEditor(C=null){this.renderRoot.querySelector("vl-recurring-dialog").open(C)}_changed(){this.reload(),this.dispatchEvent(new CustomEvent("saved",{bubbles:!0,composed:!0}))}async _delete(C){await this.renderRoot.querySelector("vl-confirm-dialog").ask(L(this.hass,"recurring.delete_confirm",{label:C.label}))&&(await u5(this.hass,this.vehicle.id,C.id),await this.reload())}_status(C){let H=this.hass,V=L(H,`recurring.interval_${C.interval_months}`);return C.active?C.next_date?`${V} \xB7 ${L(H,"recurring.next",{date:Z(H,C.next_date)})}`:`${V} \xB7 ${L(H,"recurring.ended")}`:`${V} \xB7 ${L(H,"recurring.paused")}`}render(){if(!this.vehicle)return o;let C=this.hass,H=this._items.filter(e=>e.active&&e.next_date),V=H.reduce((e,M)=>e+M.monthly_amount,0);return t`
      ${this._items.length?t`<ul class="entries">
              ${this._items.map(e=>{let M=this.categories.find(A=>A.id===e.category_id),i=e.active&&e.next_date!==null;return t`<li class=${i?"":"off"}>
                  <span
                    class="dot"
                    style="background:${M?.color??"#757575"}"
                    aria-hidden="true"
                  ></span>
                  <div class="main">
                    <span>${e.label}</span>
                    <span class="sub">${M?.label??e.category_id} · ${this._status(e)}</span>
                  </div>
                  <span class="amount">
                    <span>${S(C,e.amount,this.currency)}</span>
                    ${e.interval_months>1?t`<span class="sub">
                          ${L(C,"recurring.per_month",{amount:S(C,e.monthly_amount,this.currency)})}
                        </span>`:o}
                  </span>
                  <span class="actions">
                    <button
                      class="icon"
                      aria-label="${L(C,"common.edit")} : ${e.label}"
                      @click=${()=>this.openEditor(e)}
                    >
                      ${l(Q)}
                    </button>
                    <button
                      class="icon"
                      aria-label="${L(C,"common.delete")} : ${e.label}"
                      @click=${()=>this._delete(e)}
                    >
                      ${l(G)}
                    </button>
                  </span>
                </li>`})}
            </ul>
            ${H.length>1?t`<p class="total">
                  ${L(C,"recurring.total_month",{amount:S(C,V,this.currency)})}
                </p>`:o}`:t`<p class="empty">${L(C,"recurring.none")}</p>`}
      <vl-recurring-dialog
        .hass=${C}
        .vehicle=${this.vehicle}
        .categories=${this.categories}
        .currency=${this.currency}
        @saved=${e=>{e.stopPropagation(),this._changed()}}
      ></vl-recurring-dialog>
      <vl-confirm-dialog .hass=${C}></vl-confirm-dialog>
    `}};var i3=["due_odometer","alert_days","alert_distance","interval_days","interval_distance"],t2=class extends f{static{this.properties={hass:{attribute:!1},vehicle:{attribute:!1},_values:{state:!0},_error:{state:!0},_busy:{state:!0},_entry:{state:!0}}}static{this.styles=[b,N,g`
      fieldset {
        border: 1px solid var(--vl-border);
        border-radius: 10px;
        padding: 8px 12px 12px;
        margin: 0;
      }
      legend {
        padding: 0 4px;
        color: var(--vl-muted);
      }
    `]}constructor(){super(),this._values={},this._error="",this._busy=!1,this._entry=null}get _dialog(){return this.renderRoot.querySelector("dialog")}async open(C=null){this._entry=C,this._error="";let H=(V,e=0)=>V===null?"":D(this.hass,V,e);this._values=C?{label:C.label,kind:C.kind,due_date:C.due_date??"",due_odometer:H(C.due_odometer),alert_days:H(C.alert_days),alert_distance:H(C.alert_distance),interval_days:H(C.interval_days),interval_distance:H(C.interval_distance)}:{kind:"both",due_date:X(365),alert_days:"30",alert_distance:"1000"},await this.updateComplete,this._dialog.showModal(),this.renderRoot.querySelector("#label")?.focus()}close(){this._dialog?.close()}_set(C,H){this._values={...this._values,[C]:H}}async _submit(){this._error="";let C={label:this._values.label??"",kind:this._values.kind,due_date:this._values.due_date||null};for(let H of i3)C[H]=R(this._values[H]??"");this._entry&&(C.reminder_id=this._entry.id),this._busy=!0;try{await l5(this.hass,this.vehicle.id,C),this.close(),this.dispatchEvent(new CustomEvent("saved",{bubbles:!0,composed:!0}))}catch(H){this._error=L(this.hass,"common.error",{message:H.message})}finally{this._busy=!1}}_number(C,H,V){return t`<div class="field">
      <label for=${C}>${H}</label>
      <input
        id=${C}
        inputmode="decimal"
        autocomplete="off"
        aria-describedby=${V?`${C}-hint`:o}
        .value=${this._values[C]??""}
        @input=${e=>this._set(C,e.target.value)}
      />
      ${V?t`<span class="hint" id="${C}-hint">${V}</span>`:o}
    </div>`}render(){if(!this.vehicle)return o;let C=this.hass,H=this.vehicle.units.distance,V=this._values.kind??"both",e=V!=="distance",M=V!=="date",i=L(C,this._entry?"reminder.title_edit":"reminder.title_new"),A=[["date",L(C,"reminder.kind_date")],["distance",L(C,"reminder.kind_distance")],["both",L(C,"reminder.kind_both")]];return t`<dialog aria-labelledby="reminder-title">
      <form
        method="dialog"
        @submit=${a=>{a.preventDefault(),this._submit()}}
      >
        <header>
          <h2 id="reminder-title">${i} · ${this.vehicle.name}</h2>
          <button
            type="button"
            class="icon"
            aria-label=${L(C,"common.close")}
            @click=${()=>this.close()}
          >
            ${l(I)}
          </button>
        </header>
        <div class="body">
          <div class="field">
            <label for="label">${L(C,"reminder.label")}</label>
            <input
              id="label"
              required
              autocomplete="off"
              .value=${this._values.label??""}
              @input=${a=>this._set("label",a.target.value)}
            />
          </div>
          <div class="field">
            <label for="kind">${L(C,"reminder.kind")}</label>
            <select
              id="kind"
              @change=${a=>this._set("kind",a.target.value)}
            >
              ${A.map(([a,d])=>t`<option value=${a} ?selected=${a===V}>${d}</option>`)}
            </select>
          </div>
          ${e?t`<fieldset>
                <legend>${L(C,"reminder.kind_date")}</legend>
                <div class="grid">
                  <div class="field">
                    <label for="due_date">${L(C,"reminder.due_date")}</label>
                    <input
                      id="due_date"
                      type="date"
                      required
                      .value=${this._values.due_date??""}
                      @change=${a=>this._set("due_date",a.target.value)}
                    />
                  </div>
                  ${this._number("alert_days",L(C,"reminder.alert_days"))}
                  ${this._number("interval_days",L(C,"reminder.interval_days"),L(C,"reminder.recurrence_hint"))}
                </div>
              </fieldset>`:o}
          ${M?t`<fieldset>
                <legend>${L(C,"reminder.kind_distance")}</legend>
                <div class="grid">
                  ${this._number("due_odometer",L(C,"reminder.due_odometer",{unit:H}))}
                  ${this._number("alert_distance",L(C,"reminder.alert_distance",{unit:H}))}
                  ${this._number("interval_distance",L(C,"reminder.interval_distance",{unit:H}),L(C,"reminder.recurrence_hint"))}
                </div>
              </fieldset>`:o}
          ${this._error?t`<p class="error" role="alert">${this._error}</p>`:o}
        </div>
        <footer>
          <button type="button" @click=${()=>this.close()}>${L(C,"common.cancel")}</button>
          <button type="submit" class="primary" ?disabled=${this._busy}>
            ${L(C,"common.save")}
          </button>
        </footer>
      </form>
    </dialog>`}};var B5={due:0,alert:1,ok:2,inactive:3},i2=class extends f{static{this.properties={hass:{attribute:!1},vehicle:{attribute:!1},_items:{state:!0}}}static{this.styles=[b,Y,g`
      .main {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
      }
      .sub {
        font-size: 0.875rem;
        color: var(--vl-muted);
      }
      .state {
        flex: none;
        font-size: 0.75rem;
        font-weight: 500;
        padding: 2px 8px;
        border-radius: 999px;
        border: 1px solid currentColor;
      }
      /* Le texte reste lisible : l'état est aussi écrit, pas seulement coloré. */
      .state.due {
        color: var(--vl-error-text);
      }
      .state.alert {
        color: var(--vl-warning-text);
      }
      .state.ok,
      .state.inactive {
        color: var(--vl-muted);
      }
      .actions {
        display: flex;
        flex: none;
      }
      li.inactive .main {
        opacity: 0.7;
      }
    `]}constructor(){super(),this._items=[]}async reload(){this.vehicle&&(this._items=await n5(this.hass,this.vehicle.id))}updated(C){C.has("vehicle")&&this.vehicle&&this.reload()}_confirm(){return this.renderRoot.querySelector("vl-confirm-dialog")}async _done(C){let H=L(this.hass,C.recurring?"reminders.next_recurring":"reminders.next_once");await this._confirm().ask(L(this.hass,"reminders.done_confirm",{label:C.label,next:H}),L(this.hass,"reminders.done"),!1)&&(await m5(this.hass,this.vehicle.id,C.id),await this.reload())}async _delete(C){await this._confirm().ask(L(this.hass,"reminders.delete_confirm",{label:C.label}))&&(await p5(this.hass,this.vehicle.id,C.id),await this.reload())}openEditor(C=null){this.renderRoot.querySelector("vl-reminder-dialog").open(C)}_detail(C){let H=this.hass,V=this.vehicle.units.distance,e=[];if(C.due_date){let i=C.days_left??0,A=i>=0?L(H,"reminders.left_days",{days:i}):L(H,"reminders.late_days",{days:-i});e.push(`${Z(H,C.due_date)}${C.active?` (${A})`:""}`)}if(C.due_odometer!==null){let i=`${p(H,C.due_odometer,0)} ${V}`;if(C.active&&C.distance_left!==null){let A=C.distance_left>=0?L(H,"reminders.left_distance",{distance:p(H,C.distance_left,0),unit:V}):L(H,"reminders.late_distance",{distance:p(H,-C.distance_left,0),unit:V});i+=` (${A})`}e.push(i)}let M=[];return C.interval_days&&M.push(`${p(H,C.interval_days,0)} j`),C.interval_distance&&M.push(`${p(H,C.interval_distance,0)} ${V}`),M.length&&e.push(L(H,"reminders.every",{value:M.join(" / ")})),e.join(" \xB7 ")}render(){if(!this.vehicle)return o;let C=this.hass,H=[...this._items].sort((V,e)=>B5[V.state]-B5[e.state]);return t`
      ${H.length?t`<ul class="entries">
            ${H.map(V=>t`<li class=${V.state}>
                <span class="state ${V.state}">${L(C,`reminders.state_${V.state}`)}</span>
                <div class="main">
                  <span>${V.label}</span>
                  <span class="sub">${this._detail(V)}</span>
                </div>
                <span class="actions">
                  ${V.active?t`<button
                        class="icon"
                        aria-label=${L(C,"reminders.done_long",{label:V.label})}
                        @click=${()=>this._done(V)}
                      >
                        ${l(k2)}
                      </button>`:o}
                  <button
                    class="icon"
                    aria-label="${L(C,"common.edit")} : ${V.label}"
                    @click=${()=>this.openEditor(V)}
                  >
                    ${l(Q)}
                  </button>
                  <button
                    class="icon"
                    aria-label="${L(C,"common.delete")} : ${V.label}"
                    @click=${()=>this._delete(V)}
                  >
                    ${l(G)}
                  </button>
                </span>
              </li>`)}
          </ul>`:t`<p class="empty">${L(C,"reminders.none")}</p>`}
      <vl-reminder-dialog
        .hass=${C}
        .vehicle=${this.vehicle}
        @saved=${()=>this.reload()}
      ></vl-reminder-dialog>
      <vl-confirm-dialog .hass=${C}></vl-confirm-dialog>
    `}};var E2="1.0.0-alpha.4",$5=[{type:"carbu-card",section:"overview",extra:{show_recent:!1,show_actions:!1}},{type:"carbu-journal-card",section:"journal",extra:{title:"panel.journal",page_size:5}},{type:"carbu-stats-card",section:"stats",extra:{title:"panel.stats"}}],o2=class extends f{constructor(){super();this._cards=[];this._started=!1;this.narrow=!1,this._vehicles=[],this._loading=!0,this._error="",this._vehicleId=v1("panel-vehicle")}static{this.properties={hass:{attribute:!1},narrow:{type:Boolean},_vehicles:{state:!0},_vehicleId:{state:!0},_loading:{state:!0},_error:{state:!0},_serverVersion:{state:!0}}}static{this.styles=[b,g`
      :host {
        display: block;
        min-height: 100vh;
        color: var(--primary-text-color);
        /* Fond sobre avec deux halos de la couleur d'accent. */
        background:
          radial-gradient(
            60rem 30rem at 0% -10%,
            color-mix(in srgb, var(--vl-accent) 14%, transparent),
            transparent 70%
          ),
          radial-gradient(
            50rem 30rem at 110% 10%,
            color-mix(in srgb, var(--vl-accent-2) 9%, transparent),
            transparent 70%
          ),
          var(--primary-background-color);
        background-attachment: fixed;
      }
      .toolbar {
        position: sticky;
        top: 0;
        z-index: 2;
        display: flex;
        align-items: center;
        gap: 8px;
        min-height: var(--header-height, 56px);
        padding: 0 12px;
        box-sizing: border-box;
        background: color-mix(in srgb, var(--primary-background-color) 72%, transparent);
        backdrop-filter: blur(14px) saturate(140%);
        -webkit-backdrop-filter: blur(14px) saturate(140%);
        border-bottom: 1px solid color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      }
      .brand {
        display: flex;
        align-items: center;
        gap: 10px;
        flex: 1;
        min-width: 0;
      }
      .logo {
        flex: none;
        width: 30px;
        height: 30px;
        border-radius: 10px;
        background: var(--vl-gradient);
        box-shadow: 0 6px 18px -6px color-mix(in srgb, var(--vl-accent) 80%, transparent);
        display: grid;
        place-items: center;
        color: #0b1218;
      }
      .logo svg {
        width: 18px;
        height: 18px;
        fill: currentColor;
      }
      .quick {
        display: flex;
        gap: 6px;
      }
      .nav {
        display: flex;
        gap: 6px;
        overflow-x: auto;
        max-width: 1400px;
        margin: 0 auto;
        padding: 12px 16px 0;
        scrollbar-width: none;
      }
      .nav button {
        flex: none;
        min-height: 34px;
        padding: 0 14px;
        font-size: 0.875rem;
        border-color: color-mix(in srgb, var(--primary-text-color) 14%, transparent);
        background: var(--vl-surface);
      }
      @media (max-width: 600px) {
        .quick .label {
          display: none;
        }
        .quick button {
          padding: 0 10px;
        }
      }
      .title {
        font-size: 20px;
        font-weight: 650;
        letter-spacing: -0.01em;
        margin: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      select {
        width: auto;
        max-width: 40vw;
        min-height: 36px;
        font: inherit;
        padding: 0 12px;
        border-radius: 999px;
        border: 1px solid color-mix(in srgb, var(--primary-text-color) 18%, transparent);
        background: var(--vl-surface);
        color: inherit;
      }
      select option {
        color: var(--primary-text-color);
        background: var(--card-background-color);
      }
      .content {
        display: grid;
        gap: 16px;
        padding: 12px 16px 16px;
        max-width: 1400px;
        margin: 0 auto;
        grid-template-columns: minmax(0, 1fr);
        align-items: start;
      }
      /* Écran large : la carte principale prend plus de place que le journal. */
      @media (min-width: 1100px) {
        .content {
          grid-template-columns: minmax(0, 3fr) minmax(0, 2fr);
        }
      }
      .wide {
        grid-column: 1 / -1;
      }
      /* Sous la barre d'outils collante quand on saute à une section. */
      .content > * {
        scroll-margin-top: calc(var(--header-height, 56px) + 16px);
      }
      .message {
        padding: 24px 16px;
        max-width: 640px;
        margin: 0 auto;
      }
      .message a {
        color: var(--primary-color);
      }
      .outdated {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px 16px;
        max-width: 1400px;
        margin: 16px auto 0;
        padding: 12px 16px;
        box-sizing: border-box;
        border: 1px solid var(--warning-color, #ffa600);
        border-radius: 10px;
      }
      .outdated p {
        flex: 1 1 280px;
        margin: 0;
      }
      .version {
        text-align: center;
        font-size: 0.75rem;
        color: var(--secondary-text-color);
        padding: 0 16px 16px;
      }
    `]}connectedCallback(){super.connectedCallback(),this.hass&&this._start()}disconnectedCallback(){super.disconnectedCallback(),this._started=!1;let H=this._unsubscribe;this._unsubscribe=void 0,H?.then(V=>V()).catch(()=>{})}updated(){this._start();for(let H of this._cards)H.hass=this.hass}_start(){this._started||!this.hass||!this.isConnected||(this._started=!0,this._load(),this._unsubscribe=W1(this.hass,()=>{this._load()}),this._unsubscribe.catch(()=>this._unsubscribe=void 0))}async _load(){try{let H=await p1(this.hass);this._vehicles=H.vehicles,this._serverVersion=H.version,this._error=""}catch(H){this._error=H.code??H.message}finally{this._loading=!1}}get _current(){return this._vehicles.find(H=>H.id===this._vehicleId)??this._vehicles[0]}_cardsFor(H){return this._cardsVehicle!==H&&(this._cards=$5.map(({type:V,section:e,extra:M})=>{let i=document.createElement(V);i.id=`section-${e}`;let A={type:`custom:${V}`,vehicle_id:H};return"show_recent"in M&&(A.show_recent=M.show_recent),"show_actions"in M&&(A.show_actions=M.show_actions),"title"in M&&(A.title=L(this.hass,M.title)),"page_size"in M&&(A.page_size=M.page_size),i.setConfig(A),i.hass=this.hass,V==="carbu-stats-card"&&i.classList.add("wide"),i}),this._cardsVehicle=H),this._cards}_mainCard(){return this._cards.find(H=>H.id==="section-overview")}_goTo(H){let V=window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;this.renderRoot.querySelector(`#section-${H}`)?.scrollIntoView({behavior:V?"auto":"smooth",block:"start"})}_select(H){let V=H.target.value;this._vehicleId=V,x1("panel-vehicle",V)}_body(){let H=this.hass;if(this._loading)return t`<p class="message">${L(H,"common.loading")}</p>`;if(this._error){let e=this._error==="not_loaded"?L(H,"common.not_loaded"):this._error;return t`<p class="message error" role="alert">${e}</p>`}let V=this._current;return V?t`<div class="content">${this._cardsFor(V.id)}</div>`:t`<p class="message">
        ${L(H,"panel.no_vehicle")}
        <a href="/config/integrations/integration/carbu">${L(H,"panel.open_integration")}</a>
      </p>`}render(){let H=this._current;return t`
      <div class="toolbar">
        <ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>
        <div class="brand">
          <span class="logo" aria-hidden="true">${l(C1)}</span>
          <h1 class="title">Carbu</h1>
        </div>
        ${this._vehicles.length>1?t`<select
              aria-label=${L(this.hass,"panel.vehicle")}
              .value=${H?.id??""}
              @change=${this._select}
            >
              ${this._vehicles.map(V=>t`<option value=${V.id} ?selected=${V.id===H?.id}>${V.name}</option>`)}
            </select>`:o}
        ${H?t`<div class="quick">
              <button
                class="primary"
                aria-label=${L(this.hass,"action.add_fuel_long")}
                @click=${()=>this._mainCard()?.openFuel?.()}
              >
                ${l(C1)}<span class="label">${L(this.hass,"action.add_fuel")}</span>
              </button>
              <button
                aria-label=${L(this.hass,"action.add_expense_long")}
                @click=${()=>this._mainCard()?.openExpense?.()}
              >
                ${l(y2)}<span class="label">${L(this.hass,"action.add_expense")}</span>
              </button>
            </div>`:o}
      </div>
      ${H&&!this._loading&&!this._error?t`<nav class="nav" aria-label=${L(this.hass,"panel.sections")}>
            ${$5.map(({section:V})=>t`<button @click=${()=>this._goTo(V)}>
                  ${L(this.hass,`panel.section_${V}`)}
                </button>`)}
          </nav>`:o}
      ${this._serverVersion&&this._serverVersion!==E2?t`<div class="outdated" role="alert">
            <p>
              ${L(this.hass,"panel.outdated",{page:E2,server:this._serverVersion})}
            </p>
            <button @click=${()=>window.location.reload()}>${L(this.hass,"panel.reload")}</button>
          </div>`:o}
      ${this._body()}
      <p class="version">${L(this.hass,"panel.version",{version:E2})}</p>
    `}};var o3={"carbu-panel":o2,"carbu-card":G1,"carbu-journal-card":z1,"carbu-stats-card":j1,"carbu-card-editor":Q1,"vl-fuel-dialog":J1,"vl-expense-dialog":X1,"vl-confirm-dialog":K1,"vl-monthly-chart":L2,"vl-consumption-chart":q1,"vl-price-chart":e2,"vl-reminder-dialog":t2,"vl-reminder-list":i2,"vl-import-dialog":C2,"vl-export-dialog":Y1,"vl-line-chart":H2,"vl-recurring-dialog":M2,"vl-recurring-list":r2};for(let[r,C]of Object.entries(o3))customElements.get(r)||customElements.define(r,C);var u1={language:navigator.language};window.customCards=window.customCards??[];for(let r of[{type:"carbu-card",name:L(u1,"card.name"),description:L(u1,"card.description")},{type:"carbu-journal-card",name:L(u1,"journal.name"),description:L(u1,"journal.description")},{type:"carbu-stats-card",name:L(u1,"stats.name"),description:L(u1,"stats.description")}])window.customCards.some(C=>C.type===r.type)||window.customCards.push({...r,preview:!0});
/*! Bundled license information:

@lit/reactive-element/css-tag.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/reactive-element.js:
lit-html/lit-html.js:
lit-element/lit-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/is-server.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
