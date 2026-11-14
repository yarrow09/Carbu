var h1=globalThis,g1=h1.ShadowRoot&&(h1.ShadyCSS===void 0||h1.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,X1=Symbol(),c2=new WeakMap,d1=class{constructor(C,H,V){if(this._$cssResult$=!0,V!==X1)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=C,this.t=H}get styleSheet(){let C=this.o,H=this.t;if(g1&&C===void 0){let V=H!==void 0&&H.length===1;V&&(C=c2.get(H)),C===void 0&&((this.o=C=new CSSStyleSheet).replaceSync(this.cssText),V&&c2.set(H,C))}return C}toString(){return this.cssText}},Z2=r=>new d1(typeof r=="string"?r:r+"",void 0,X1),b=(r,...C)=>{let H=r.length===1?r[0]:C.reduce((V,e,M)=>V+(t=>{if(t._$cssResult$===!0)return t.cssText;if(typeof t=="number")return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(e)+r[M+1],r[0]);return new d1(H,r,X1)},S2=(r,C)=>{if(g1)r.adoptedStyleSheets=C.map(H=>H instanceof CSSStyleSheet?H:H.styleSheet);else for(let H of C){let V=document.createElement("style"),e=h1.litNonce;e!==void 0&&V.setAttribute("nonce",e),V.textContent=H.cssText,r.appendChild(V)}},Y1=g1?r=>r:r=>r instanceof CSSStyleSheet?(C=>{let H="";for(let V of C.cssRules)H+=V.cssText;return Z2(H)})(r):r;var{is:v5,defineProperty:x5,getOwnPropertyDescriptor:u5,getOwnPropertyNames:c5,getOwnPropertySymbols:Z5,getPrototypeOf:S5}=Object,f1=globalThis,h2=f1.trustedTypes,h5=h2?h2.emptyScript:"",g5=f1.reactiveElementPolyfillSupport,n1=(r,C)=>r,J1={toAttribute(r,C){switch(C){case Boolean:r=r?h5:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,C){let H=r;switch(C){case Boolean:H=r!==null;break;case Number:H=r===null?null:Number(r);break;case Object:case Array:try{H=JSON.parse(r)}catch{H=null}}return H}},f2=(r,C)=>!v5(r,C),g2={attribute:!0,type:String,converter:J1,reflect:!1,useDefault:!1,hasChanged:f2};Symbol.metadata??=Symbol("metadata"),f1.litPropertyMetadata??=new WeakMap;var j=class extends HTMLElement{static addInitializer(C){this._$Ei(),(this.l??=[]).push(C)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(C,H=g2){if(H.state&&(H.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(C)&&((H=Object.create(H)).wrapped=!0),this.elementProperties.set(C,H),!H.noAccessor){let V=Symbol(),e=this.getPropertyDescriptor(C,V,H);e!==void 0&&x5(this.prototype,C,e)}}static getPropertyDescriptor(C,H,V){let{get:e,set:M}=u5(this.prototype,C)??{get(){return this[H]},set(t){this[H]=t}};return{get:e,set(t){let d=e?.call(this);M?.call(this,t),this.requestUpdate(C,d,V)},configurable:!0,enumerable:!0}}static getPropertyOptions(C){return this.elementProperties.get(C)??g2}static _$Ei(){if(this.hasOwnProperty(n1("elementProperties")))return;let C=S5(this);C.finalize(),C.l!==void 0&&(this.l=[...C.l]),this.elementProperties=new Map(C.elementProperties)}static finalize(){if(this.hasOwnProperty(n1("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(n1("properties"))){let H=this.properties,V=[...c5(H),...Z5(H)];for(let e of V)this.createProperty(e,H[e])}let C=this[Symbol.metadata];if(C!==null){let H=litPropertyMetadata.get(C);if(H!==void 0)for(let[V,e]of H)this.elementProperties.set(V,e)}this._$Eh=new Map;for(let[H,V]of this.elementProperties){let e=this._$Eu(H,V);e!==void 0&&this._$Eh.set(e,H)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(C){let H=[];if(Array.isArray(C)){let V=new Set(C.flat(1/0).reverse());for(let e of V)H.unshift(Y1(e))}else C!==void 0&&H.push(Y1(C));return H}static _$Eu(C,H){let V=H.attribute;return V===!1?void 0:typeof V=="string"?V:typeof C=="string"?C.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(C=>this.enableUpdating=C),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(C=>C(this))}addController(C){(this._$EO??=new Set).add(C),this.renderRoot!==void 0&&this.isConnected&&C.hostConnected?.()}removeController(C){this._$EO?.delete(C)}_$E_(){let C=new Map,H=this.constructor.elementProperties;for(let V of H.keys())this.hasOwnProperty(V)&&(C.set(V,this[V]),delete this[V]);C.size>0&&(this._$Ep=C)}createRenderRoot(){let C=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return S2(C,this.constructor.elementStyles),C}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(C=>C.hostConnected?.())}enableUpdating(C){}disconnectedCallback(){this._$EO?.forEach(C=>C.hostDisconnected?.())}attributeChangedCallback(C,H,V){this._$AK(C,V)}_$ET(C,H){let V=this.constructor.elementProperties.get(C),e=this.constructor._$Eu(C,V);if(e!==void 0&&V.reflect===!0){let M=(V.converter?.toAttribute!==void 0?V.converter:J1).toAttribute(H,V.type);this._$Em=C,M==null?this.removeAttribute(e):this.setAttribute(e,M),this._$Em=null}}_$AK(C,H){let V=this.constructor,e=V._$Eh.get(C);if(e!==void 0&&this._$Em!==e){let M=V.getPropertyOptions(e),t=typeof M.converter=="function"?{fromAttribute:M.converter}:M.converter?.fromAttribute!==void 0?M.converter:J1;this._$Em=e;let d=t.fromAttribute(H,M.type);this[e]=d??this._$Ej?.get(e)??d,this._$Em=null}}requestUpdate(C,H,V,e=!1,M){if(C!==void 0){let t=this.constructor;if(e===!1&&(M=this[C]),V??=t.getPropertyOptions(C),!((V.hasChanged??f2)(M,H)||V.useDefault&&V.reflect&&M===this._$Ej?.get(C)&&!this.hasAttribute(t._$Eu(C,V))))return;this.C(C,H,V)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(C,H,{useDefault:V,reflect:e,wrapped:M},t){V&&!(this._$Ej??=new Map).has(C)&&(this._$Ej.set(C,t??H??this[C]),M!==!0||t!==void 0)||(this._$AL.has(C)||(this.hasUpdated||V||(H=void 0),this._$AL.set(C,H)),e===!0&&this._$Em!==C&&(this._$Eq??=new Set).add(C))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(H){Promise.reject(H)}let C=this.scheduleUpdate();return C!=null&&await C,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[e,M]of this._$Ep)this[e]=M;this._$Ep=void 0}let V=this.constructor.elementProperties;if(V.size>0)for(let[e,M]of V){let{wrapped:t}=M,d=this[e];t!==!0||this._$AL.has(e)||d===void 0||this.C(e,void 0,M,d)}}let C=!1,H=this._$AL;try{C=this.shouldUpdate(H),C?(this.willUpdate(H),this._$EO?.forEach(V=>V.hostUpdate?.()),this.update(H)):this._$EM()}catch(V){throw C=!1,this._$EM(),V}C&&this._$AE(H)}willUpdate(C){}_$AE(C){this._$EO?.forEach(H=>H.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(C)),this.updated(C)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(C){return!0}update(C){this._$Eq&&=this._$Eq.forEach(H=>this._$ET(H,this[H])),this._$EM()}updated(C){}firstUpdated(C){}};j.elementStyles=[],j.shadowRootOptions={mode:"open"},j[n1("elementProperties")]=new Map,j[n1("finalized")]=new Map,g5?.({ReactiveElement:j}),(f1.reactiveElementVersions??=[]).push("2.1.2");var r2=globalThis,O2=r=>r,O1=r2.trustedTypes,b2=O1?O1.createPolicy("lit-html",{createHTML:r=>r}):void 0,B2="$lit$",Y=`lit$${Math.random().toFixed(9).slice(2)}$`,$2="?"+Y,f5=`<${$2}>`,e1=document,l1=()=>e1.createComment(""),m1=r=>r===null||typeof r!="object"&&typeof r!="function",t2=Array.isArray,O5=r=>t2(r)||typeof r?.[Symbol.iterator]=="function",C2=`[ 	
\f\r]`,p1=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,y2=/-->/g,_2=/>/g,V1=RegExp(`>|${C2}(?:([^\\s"'>=/]+)(${C2}*=${C2}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),k2=/'/g,w2=/"/g,T2=/^(?:script|style|textarea|title)$/i,i2=r=>(C,...H)=>({_$litType$:r,strings:C,values:H}),i=i2(1),$=i2(2),X5=i2(3),M1=Symbol.for("lit-noChange"),a=Symbol.for("lit-nothing"),P2=new WeakMap,L1=e1.createTreeWalker(e1,129);function F2(r,C){if(!t2(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return b2!==void 0?b2.createHTML(C):C}var b5=(r,C)=>{let H=r.length-1,V=[],e,M=C===2?"<svg>":C===3?"<math>":"",t=p1;for(let d=0;d<H;d++){let o=r[d],A,c,l=-1,g=0;for(;g<o.length&&(t.lastIndex=g,c=t.exec(o),c!==null);)g=t.lastIndex,t===p1?c[1]==="!--"?t=y2:c[1]!==void 0?t=_2:c[2]!==void 0?(T2.test(c[2])&&(e=RegExp("</"+c[2],"g")),t=V1):c[3]!==void 0&&(t=V1):t===V1?c[0]===">"?(t=e??p1,l=-1):c[1]===void 0?l=-2:(l=t.lastIndex-c[2].length,A=c[1],t=c[3]===void 0?V1:c[3]==='"'?w2:k2):t===w2||t===k2?t=V1:t===y2||t===_2?t=p1:(t=V1,e=void 0);let O=t===V1&&r[d+1].startsWith("/>")?" ":"";M+=t===p1?o+f5:l>=0?(V.push(A),o.slice(0,l)+B2+o.slice(l)+Y+O):o+Y+(l===-2?d:O)}return[F2(r,M+(r[H]||"<?>")+(C===2?"</svg>":C===3?"</math>":"")),V]},s1=class r{constructor({strings:C,_$litType$:H},V){let e;this.parts=[];let M=0,t=0,d=C.length-1,o=this.parts,[A,c]=b5(C,H);if(this.el=r.createElement(A,V),L1.currentNode=this.el.content,H===2||H===3){let l=this.el.content.firstChild;l.replaceWith(...l.childNodes)}for(;(e=L1.nextNode())!==null&&o.length<d;){if(e.nodeType===1){if(e.hasAttributes())for(let l of e.getAttributeNames())if(l.endsWith(B2)){let g=c[t++],O=e.getAttribute(l).split(Y),w=/([.?@])?(.*)/.exec(g);o.push({type:1,index:M,name:w[2],strings:O,ctor:w[1]==="."?V2:w[1]==="?"?L2:w[1]==="@"?e2:i1}),e.removeAttribute(l)}else l.startsWith(Y)&&(o.push({type:6,index:M}),e.removeAttribute(l));if(T2.test(e.tagName)){let l=e.textContent.split(Y),g=l.length-1;if(g>0){e.textContent=O1?O1.emptyScript:"";for(let O=0;O<g;O++)e.append(l[O],l1()),L1.nextNode(),o.push({type:2,index:++M});e.append(l[g],l1())}}}else if(e.nodeType===8)if(e.data===$2)o.push({type:2,index:M});else{let l=-1;for(;(l=e.data.indexOf(Y,l+1))!==-1;)o.push({type:7,index:M}),l+=Y.length-1}M++}}static createElement(C,H){let V=e1.createElement("template");return V.innerHTML=C,V}};function t1(r,C,H=r,V){if(C===M1)return C;let e=V!==void 0?H._$Co?.[V]:H._$Cl,M=m1(C)?void 0:C._$litDirective$;return e?.constructor!==M&&(e?._$AO?.(!1),M===void 0?e=void 0:(e=new M(r),e._$AT(r,H,V)),V!==void 0?(H._$Co??=[])[V]=e:H._$Cl=e),e!==void 0&&(C=t1(r,e._$AS(r,C.values),e,V)),C}var H2=class{constructor(C,H){this._$AV=[],this._$AN=void 0,this._$AD=C,this._$AM=H}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(C){let{el:{content:H},parts:V}=this._$AD,e=(C?.creationScope??e1).importNode(H,!0);L1.currentNode=e;let M=L1.nextNode(),t=0,d=0,o=V[0];for(;o!==void 0;){if(t===o.index){let A;o.type===2?A=new v1(M,M.nextSibling,this,C):o.type===1?A=new o.ctor(M,o.name,o.strings,this,C):o.type===6&&(A=new M2(M,this,C)),this._$AV.push(A),o=V[++d]}t!==o?.index&&(M=L1.nextNode(),t++)}return L1.currentNode=e1,e}p(C){let H=0;for(let V of this._$AV)V!==void 0&&(V.strings!==void 0?(V._$AI(C,V,H),H+=V.strings.length-2):V._$AI(C[H])),H++}},v1=class r{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(C,H,V,e){this.type=2,this._$AH=a,this._$AN=void 0,this._$AA=C,this._$AB=H,this._$AM=V,this.options=e,this._$Cv=e?.isConnected??!0}get parentNode(){let C=this._$AA.parentNode,H=this._$AM;return H!==void 0&&C?.nodeType===11&&(C=H.parentNode),C}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(C,H=this){C=t1(this,C,H),m1(C)?C===a||C==null||C===""?(this._$AH!==a&&this._$AR(),this._$AH=a):C!==this._$AH&&C!==M1&&this._(C):C._$litType$!==void 0?this.$(C):C.nodeType!==void 0?this.T(C):O5(C)?this.k(C):this._(C)}O(C){return this._$AA.parentNode.insertBefore(C,this._$AB)}T(C){this._$AH!==C&&(this._$AR(),this._$AH=this.O(C))}_(C){this._$AH!==a&&m1(this._$AH)?this._$AA.nextSibling.data=C:this.T(e1.createTextNode(C)),this._$AH=C}$(C){let{values:H,_$litType$:V}=C,e=typeof V=="number"?this._$AC(C):(V.el===void 0&&(V.el=s1.createElement(F2(V.h,V.h[0]),this.options)),V);if(this._$AH?._$AD===e)this._$AH.p(H);else{let M=new H2(e,this),t=M.u(this.options);M.p(H),this.T(t),this._$AH=M}}_$AC(C){let H=P2.get(C.strings);return H===void 0&&P2.set(C.strings,H=new s1(C)),H}k(C){t2(this._$AH)||(this._$AH=[],this._$AR());let H=this._$AH,V,e=0;for(let M of C)e===H.length?H.push(V=new r(this.O(l1()),this.O(l1()),this,this.options)):V=H[e],V._$AI(M),e++;e<H.length&&(this._$AR(V&&V._$AB.nextSibling,e),H.length=e)}_$AR(C=this._$AA.nextSibling,H){for(this._$AP?.(!1,!0,H);C!==this._$AB;){let V=O2(C).nextSibling;O2(C).remove(),C=V}}setConnected(C){this._$AM===void 0&&(this._$Cv=C,this._$AP?.(C))}},i1=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(C,H,V,e,M){this.type=1,this._$AH=a,this._$AN=void 0,this.element=C,this.name=H,this._$AM=e,this.options=M,V.length>2||V[0]!==""||V[1]!==""?(this._$AH=Array(V.length-1).fill(new String),this.strings=V):this._$AH=a}_$AI(C,H=this,V,e){let M=this.strings,t=!1;if(M===void 0)C=t1(this,C,H,0),t=!m1(C)||C!==this._$AH&&C!==M1,t&&(this._$AH=C);else{let d=C,o,A;for(C=M[0],o=0;o<M.length-1;o++)A=t1(this,d[V+o],H,o),A===M1&&(A=this._$AH[o]),t||=!m1(A)||A!==this._$AH[o],A===a?C=a:C!==a&&(C+=(A??"")+M[o+1]),this._$AH[o]=A}t&&!e&&this.j(C)}j(C){C===a?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,C??"")}},V2=class extends i1{constructor(){super(...arguments),this.type=3}j(C){this.element[this.name]=C===a?void 0:C}},L2=class extends i1{constructor(){super(...arguments),this.type=4}j(C){this.element.toggleAttribute(this.name,!!C&&C!==a)}},e2=class extends i1{constructor(C,H,V,e,M){super(C,H,V,e,M),this.type=5}_$AI(C,H=this){if((C=t1(this,C,H,0)??a)===M1)return;let V=this._$AH,e=C===a&&V!==a||C.capture!==V.capture||C.once!==V.once||C.passive!==V.passive,M=C!==a&&(V===a||e);e&&this.element.removeEventListener(this.name,this,V),M&&this.element.addEventListener(this.name,this,C),this._$AH=C}handleEvent(C){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,C):this._$AH.handleEvent(C)}},M2=class{constructor(C,H,V){this.element=C,this.type=6,this._$AN=void 0,this._$AM=H,this.options=V}get _$AU(){return this._$AM._$AU}_$AI(C){t1(this,C)}};var y5=r2.litHtmlPolyfillSupport;y5?.(s1,v1),(r2.litHtmlVersions??=[]).push("3.3.3");var R2=(r,C,H)=>{let V=H?.renderBefore??C,e=V._$litPart$;if(e===void 0){let M=H?.renderBefore??null;V._$litPart$=e=new v1(C.insertBefore(l1(),M),M,void 0,H??{})}return e._$AI(r),e};var o2=globalThis,Z=class extends j{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let C=super.createRenderRoot();return this.renderOptions.renderBefore??=C.firstChild,C}update(C){let H=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(C),this._$Do=R2(H,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return M1}};Z._$litElement$=!0,Z.finalized=!0,o2.litElementHydrateSupport?.({LitElement:Z});var _5=o2.litElementPolyfillSupport;_5?.({LitElement:Z});(o2.litElementVersions??=[]).push("4.2.2");var _="carbu",o1=r=>r.callWS({type:`${_}/vehicles`}),E2=(r,C)=>r.callWS({type:`${_}/dashboard`,vehicle_id:C}),b1=r=>r.callWS({type:`${_}/categories`}),D2=(r,C)=>r.callWS({type:`${_}/fuel/defaults`,vehicle_id:C}),N2=(r,C,H={})=>r.callWS({type:`${_}/fuel/list`,vehicle_id:C,...H}),W2=(r,C,H)=>r.callWS({type:`${_}/fuel/save`,vehicle_id:C,...H}),y1=(r,C,H)=>r.callWS({type:`${_}/fuel/delete`,vehicle_id:C,entry_id:H}),I2=(r,C,H={})=>r.callWS({type:`${_}/expense/list`,vehicle_id:C,...H}),U2=(r,C,H)=>r.callWS({type:`${_}/expense/save`,vehicle_id:C,...H}),_1=(r,C,H)=>r.callWS({type:`${_}/expense/delete`,vehicle_id:C,expense_id:H}),a2=(r,C)=>`/api/${_}/attachment/${encodeURIComponent(r)}/${encodeURIComponent(C)}`;async function G2(r,C,H,V){let e=new FormData;e.append("file",V);let M=await r.fetchWithAuth(a2(C,H),{method:"POST",body:e});if(!M.ok){let t=String(M.status);try{t=(await M.json()).code??t}catch{}throw new Error(t)}}async function Q2(r,C,H){await r.fetchWithAuth(a2(C,H),{method:"DELETE"})}async function z2(r,C,H){let{path:V}=await r.callWS({type:"auth/sign_path",path:a2(C,H),expires:30});return V}var k1=(r,C)=>r.connection.subscribeMessage(()=>C(),{type:`${_}/subscribe`}),j2=(r,C)=>r.callWS({type:`${_}/reminders`,vehicle_id:C}),K2=(r,C,H)=>r.callWS({type:`${_}/reminder/save`,vehicle_id:C,...H}),q2=(r,C,H)=>r.callWS({type:`${_}/reminder/delete`,vehicle_id:C,reminder_id:H}),X2=(r,C,H)=>r.callWS({type:`${_}/reminder/done`,vehicle_id:C,reminder_id:H}),Y2=(r,C,H)=>r.callWS({type:`${_}/stats`,vehicle_id:C,period:H});async function A2(r,C,H,V){let e=new FormData;e.append("file",H);let M=`/api/${_}/import/${encodeURIComponent(C)}${V?"?apply=1":""}`,t=await r.fetchWithAuth(M,{method:"POST",body:e}),d=await t.json().catch(()=>({}));if(!t.ok)throw new Error(String(d.code??t.status));return d}var J2=(r,C)=>r.callWS({type:`${_}/recurring`,vehicle_id:C}),C5=(r,C,H)=>r.callWS({type:`${_}/recurring/save`,vehicle_id:C,...H}),H5=(r,C,H)=>r.callWS({type:`${_}/recurring/delete`,vehicle_id:C,recurring_id:H}),V5=(r,C)=>r.callWS({type:`${_}/export`,vehicle_id:C});var u=r=>i`<svg class="mdi" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d=${r}></path>
  </svg>`;var k5={"card.name":"Carbu \xB7 carnet de bord","card.description":"Vue d'ensemble, saisie rapide d'un plein, d\xE9penses mensuelles.","journal.name":"Carbu \xB7 journal du v\xE9hicule","journal.description":"Pleins et d\xE9penses : liste filtrable, modification, suppression.","common.loading":"Chargement\u2026","common.no_vehicle":"Aucun v\xE9hicule. Ajoutez-en un depuis la page de l'int\xE9gration Carbu.","common.not_loaded":"L'int\xE9gration Carbu n'est pas charg\xE9e.","common.cancel":"Annuler","last_fill.title":"Dernier plein","last_fill.distance":"Parcourus depuis le plein pr\xE9c\xE9dent","last_fill.consumption":"Consommation","last_fill.worse":"+{value} par rapport \xE0 la moyenne","last_fill.better":"\u2212{value} par rapport \xE0 la moyenne","last_fill.partial":"Plein partiel : la consommation sera calcul\xE9e au prochain plein complet.","fuel.grade":"Carburant \xE0 la pompe","fuel.grade_unknown":"Non pr\xE9cis\xE9","stats.group_carbon":"Bilan carbone","stats.co2_total":"\xC9missions de la p\xE9riode","stats.co2_per_distance":"Par {unit}","stats.co2_per_month":"Par mois","stats.co2_source":"\xC9missions calcul\xE9es \xE0 partir des quantit\xE9s r\xE9ellement achet\xE9es et des facteurs de l'ADEME (Base Empreinte, combustion et production du carburant).","stats.price_change":"\xC9volution du prix","stats.price_curve":"Prix du carburant","stats.price_point":"Prix pay\xE9","stats.price_empty":"Pas encore de plein sur la p\xE9riode.","stats.price_summary":"Prix pay\xE9 \xE0 {count} pleins, du {start} au {end}.","stats.grade_unknown":"Qualit\xE9 non pr\xE9cis\xE9e","stats.group_consumption":"Consommation","stats.group_distance":"Distance","stats.group_costs":"Co\xFBts","stats.best":"Meilleur plein","stats.worst":"Moins bon plein","stats.distance_per_fill":"Moyenne entre deux pleins","stats.per_month":"Par mois","stats.avg_price":"Prix moyen ({unit})","panel.vehicle":"V\xE9hicule","panel.stats":"Statistiques","panel.journal":"Journal","panel.no_vehicle":"Aucun v\xE9hicule pour l'instant.","panel.open_integration":"Ajouter un v\xE9hicule depuis la page de l'int\xE9gration Carbu.","common.save":"Enregistrer","common.delete":"Supprimer","common.edit":"Modifier","common.close":"Fermer","common.more":"Plus d'options","common.load_more":"Afficher plus","common.none":"Aucune entr\xE9e.","common.error":"Erreur : {message}","common.optional":"facultatif","action.add_fuel":"Plein","action.add_expense":"D\xE9pense","action.add_fuel_long":"Ajouter un plein","action.add_expense_long":"Ajouter une d\xE9pense","tile.consumption":"Consommation moyenne","tile.month_cost":"Co\xFBt du mois","tile.cost_per_distance":"Co\xFBt par {unit}","tile.odometer":"Kilom\xE9trage","tile.distance_month":"Distance ce mois-ci","section.recent_fuel":"Derniers pleins","section.recent_expenses":"Derni\xE8res d\xE9penses","section.monthly":"D\xE9penses mensuelles","chart.total":"Total","chart.empty":"Aucune d\xE9pense sur la p\xE9riode.","chart.summary":"D\xE9penses des {count} derniers mois, empil\xE9es par cat\xE9gorie.","chart.month":"Mois","fuel.title_new":"Nouveau plein","fuel.title_edit":"Modifier le plein","fuel.odometer":"Kilom\xE9trage ({unit})","fuel.volume":"Quantit\xE9 ({unit})","fuel.total":"Montant ({currency})","fuel.unit_price":"Prix unitaire ({currency}/{unit})","fuel.computed":"Calcul\xE9 automatiquement","fuel.full_tank":"Plein complet","fuel.partial":"partiel","fuel.date":"Date","fuel.time":"Heure","fuel.fuel_type":"Carburant","fuel.station":"Station","fuel.notes":"Notes","fuel.need_two":"Saisissez au moins deux valeurs parmi quantit\xE9, montant et prix unitaire.","fuel.warnings":"V\xE9rifiez la saisie :","fuel.save_anyway":"Enregistrer quand m\xEAme","fuel.delete_confirm":"Supprimer le plein du {date} ? Les calculs seront mis \xE0 jour.","expense.title_new":"Nouvelle d\xE9pense","expense.title_edit":"Modifier la d\xE9pense","expense.amount":"Montant ({currency})","expense.category":"Cat\xE9gorie","expense.odometer":"Kilom\xE9trage ({unit})","expense.description":"Description","expense.attachment":"Pi\xE8ce jointe (photo ou PDF, 10 Mo max)","expense.attachment_view":"Voir la pi\xE8ce jointe","expense.attachment_remove":"Retirer la pi\xE8ce jointe","expense.attachment_error":"La pi\xE8ce jointe n'a pas \xE9t\xE9 enregistr\xE9e ({code}).","expense.delete_confirm":"Supprimer la d\xE9pense du {date} ({amount}) ?","journal.tab_fuel":"Pleins","journal.tab_expenses":"D\xE9penses","journal.filters":"Filtres","journal.from":"Du","journal.to":"Au","journal.min":"Montant min.","journal.max":"Montant max.","journal.categories":"Cat\xE9gories","journal.all":"Toutes","journal.reset":"R\xE9initialiser","journal.count":"{count} entr\xE9e(s), total {sum}","journal.period_month":"Ce mois-ci","journal.period_3m":"3 mois","journal.period_year":"Cette ann\xE9e","journal.period_all":"Tout","fuel_type.gasoline":"Essence","fuel_type.diesel":"Diesel","fuel_type.lpg":"GPL","fuel_type.cng":"GNV","category.fuel":"Carburant","warning.odometer_below_previous":"Kilom\xE9trage inf\xE9rieur au relev\xE9 pr\xE9c\xE9dent ({previous} {unit}).","warning.odometer_above_next":"Kilom\xE9trage sup\xE9rieur au relev\xE9 suivant ({next} {unit}).","warning.consumption_out_of_range":"Consommation de {value} {consumption}, hors de la plage pr\xE9vue ({min} \u2013 {max}).","warning.volume_exceeds_tank":"Quantit\xE9 sup\xE9rieure \xE0 la capacit\xE9 du r\xE9servoir ({capacity} {volume}).","warning.fuel_not_supported":"Ce carburant n'est pas d\xE9clar\xE9 pour le v\xE9hicule.","warning.amount_mismatch":"Montant diff\xE9rent de quantit\xE9 \xD7 prix ({expected}).","editor.vehicle":"V\xE9hicule","editor.title":"Titre","editor.show_chart":"Afficher l'histogramme mensuel","editor.show_recent":"Afficher les derni\xE8res entr\xE9es","reminders.title":"Rappels","reminders.add":"Rappel","reminders.add_long":"Ajouter un rappel","reminders.none":"Aucun rappel.","reminders.done":"Fait","reminders.done_long":"Marquer \xAB {label} \xBB comme fait","reminders.done_confirm":"Marquer \xAB {label} \xBB comme fait aujourd'hui ? {next}","reminders.next_recurring":"La prochaine \xE9ch\xE9ance sera calcul\xE9e automatiquement.","reminders.next_once":"Ce rappel non r\xE9current sera ensuite d\xE9sactiv\xE9.","reminders.delete_confirm":"Supprimer le rappel \xAB {label} \xBB ?","reminders.state_ok":"\xC0 jour","reminders.state_alert":"Bient\xF4t","reminders.state_due":"D\xFB","reminders.state_inactive":"Fait","reminders.left_days":"dans {days} j","reminders.late_days":"en retard de {days} j","reminders.left_distance":"dans {distance} {unit}","reminders.late_distance":"d\xE9pass\xE9 de {distance} {unit}","reminders.every":"tous les {value}","reminder.title_new":"Nouveau rappel","reminder.title_edit":"Modifier le rappel","reminder.label":"Libell\xE9","reminder.kind":"D\xE9clenchement","reminder.kind_date":"\xC0 une date","reminder.kind_distance":"\xC0 un kilom\xE9trage","reminder.kind_both":"Date ou kilom\xE9trage (le premier atteint)","reminder.due_date":"Date d'\xE9ch\xE9ance","reminder.due_odometer":"Kilom\xE9trage d'\xE9ch\xE9ance ({unit})","reminder.alert_days":"Alerter \u2026 jours avant","reminder.alert_distance":"Alerter \u2026 {unit} avant","reminder.interval_days":"R\xE9p\xE9ter tous les \u2026 jours","reminder.interval_distance":"R\xE9p\xE9ter tous les \u2026 {unit}","reminder.recurrence_hint":"Laissez vide pour un rappel unique.","stats.name":"Carbu \xB7 statistiques","stats.description":"Statistiques par p\xE9riode et courbe de consommation par plein.","stats.period":"P\xE9riode","stats.period_30d":"30 jours","stats.period_3m":"3 mois","stats.period_12m":"12 mois","stats.period_all":"Depuis l'acquisition","stats.distance":"Distance","stats.consumption":"Consommation moyenne","stats.fuel_cost":"Carburant","stats.expense_cost":"Autres d\xE9penses","stats.total_cost":"Co\xFBt total","stats.cost_per_distance":"Co\xFBt par {unit}","stats.fills":"Pleins","stats.volume":"Quantit\xE9","stats.curve":"Consommation par plein","stats.curve_point":"Plein","stats.moving_average":"Moyenne mobile ({count} pleins)","stats.curve_empty":"Pas encore de consommation mesur\xE9e sur la p\xE9riode (il faut deux pleins complets).","stats.curve_summary":"Consommation de {count} pleins entre le {start} et le {end}.","stats.by_category":"D\xE9penses par cat\xE9gorie","editor.show_reminders":"Afficher les rappels","editor.show_recurring":"Afficher les d\xE9penses r\xE9currentes","editor.period":"P\xE9riode par d\xE9faut","import.button":"Importer","import.button_long":"Importer un fichier CSV","import.title":"Importer un fichier CSV","import.help":"Fichiers produits par l'export (pleins, d\xE9penses, relev\xE9s, rappels), y compris apr\xE8s modification dans un tableur. Rien n'est enregistr\xE9 avant votre confirmation.","import.file":"Fichier CSV","import.analyzing":"Analyse du fichier\u2026","import.kind_fuel":"Pleins","import.kind_expenses":"D\xE9penses","import.kind_odometer":"Relev\xE9s du compteur","import.kind_reminders":"Rappels","import.summary":"{kind} : {new} nouvelle(s) ligne(s), {duplicate} d\xE9j\xE0 pr\xE9sente(s), {error} en erreur.","import.new_categories":"Cat\xE9gories qui seront cr\xE9\xE9es : {names}.","import.status_new":"Nouveau","import.status_duplicate":"Doublon","import.status_error":"Erreur","import.line":"Ligne {line}","import.truncated":"Seules les 200 premi\xE8res lignes sont affich\xE9es.","import.confirm":"Importer {count} ligne(s)","import.done":"{count} ligne(s) import\xE9e(s).","import.error_unknown_format":"Format non reconnu : utilisez un fichier produit par l'export.","import.error_empty":"Le fichier est vide.","import.error_too_large":"Le fichier est trop volumineux (5 Mo au plus).","import.error_too_many_rows":"Le fichier contient trop de lignes (20 000 au plus).","recurring.title":"D\xE9penses r\xE9currentes","recurring.add":"R\xE9currence","recurring.add_long":"Ajouter une d\xE9pense r\xE9currente","recurring.none":"Aucune d\xE9pense r\xE9currente (abonnement, assurance au mois\u2026).","recurring.title_new":"Nouvelle d\xE9pense r\xE9currente","recurring.title_edit":"Modifier la d\xE9pense r\xE9currente","recurring.label":"Libell\xE9","recurring.interval":"P\xE9riodicit\xE9","recurring.interval_1":"Tous les mois","recurring.interval_2":"Tous les 2 mois","recurring.interval_3":"Tous les trimestres","recurring.interval_6":"Tous les 6 mois","recurring.interval_12":"Tous les ans","recurring.start":"Premi\xE8re \xE9ch\xE9ance","recurring.end":"Derni\xE8re \xE9ch\xE9ance","recurring.active":"Active","recurring.help":"\xC0 chaque \xE9ch\xE9ance, la d\xE9pense est ajout\xE9e automatiquement au journal. Les \xE9ch\xE9ances d\xE9j\xE0 pass\xE9es sont ajout\xE9es d\xE8s l'enregistrement.","recurring.next":"Prochaine : {date}","recurring.ended":"Termin\xE9e","recurring.paused":"En pause","recurring.per_month":"{amount}/mois","recurring.total_month":"Total : {amount} par mois","recurring.delete_confirm":"Supprimer la d\xE9pense r\xE9currente \xAB {label} \xBB ? Les d\xE9penses d\xE9j\xE0 ajout\xE9es au journal sont conserv\xE9es.","recurring.badge":"R\xE9currente","export.button":"Exporter","export.button_long":"Exporter les donn\xE9es en CSV","export.title":"Exporter en CSV","export.help":"Fichiers au format de l'import (s\xE9parateur \xAB ; \xBB, UTF-8), lisibles dans un tableur.","export.file_pleins":"Pleins","export.file_depenses":"D\xE9penses","export.file_depenses_recurrentes":"D\xE9penses r\xE9currentes","export.file_releves":"Relev\xE9s du compteur","export.file_rappels":"Rappels","export.lines":"{count} ligne(s)","export.download":"T\xE9l\xE9charger","export.download_all":"Tout t\xE9l\xE9charger","stats.cost_curve":"Co\xFBt au {unit}","stats.cost_curve_total":"Tout compris","stats.cost_curve_fuel":"Carburant seul","stats.cost_curve_note":"Cumul\xE9 depuis le d\xE9but du carnet : total des pleins et d\xE9penses \xF7 distance parcourue.","stats.odometer_curve":"Compteur","stats.odometer_label":"Kilom\xE9trage","stats.line_empty":"Pas assez de donn\xE9es sur la p\xE9riode.","stats.line_summary":"{name} : {count} points, du {start} au {end}."},w5={"card.name":"Carbu \xB7 vehicle log","card.description":"Overview, quick fill-up entry, monthly expenses.","journal.name":"Carbu \xB7 vehicle journal","journal.description":"Fill-ups and expenses: filterable list, edit, delete.","common.loading":"Loading\u2026","last_fill.title":"Last fill-up","last_fill.distance":"Driven since the previous fill-up","last_fill.consumption":"Consumption","last_fill.worse":"+{value} vs average","last_fill.better":"\u2212{value} vs average","last_fill.partial":"Partial fill-up: consumption will be computed at the next full tank.","fuel.grade":"Pump fuel","fuel.grade_unknown":"Not specified","stats.group_carbon":"Carbon footprint","stats.co2_total":"Emissions over the period","stats.co2_per_distance":"Per {unit}","stats.co2_per_month":"Per month","stats.co2_source":"Emissions computed from the quantities actually bought and ADEME factors (Base Empreinte, combustion and fuel production).","stats.price_change":"Price change","stats.price_curve":"Fuel price","stats.price_point":"Price paid","stats.price_empty":"No fill-up in this period yet.","stats.price_summary":"Price paid at {count} fill-ups, from {start} to {end}.","stats.grade_unknown":"Grade not specified","stats.group_consumption":"Consumption","stats.group_distance":"Distance","stats.group_costs":"Costs","stats.best":"Best fill-up","stats.worst":"Worst fill-up","stats.distance_per_fill":"Average between fill-ups","stats.per_month":"Per month","stats.avg_price":"Average price ({unit})","panel.vehicle":"Vehicle","panel.stats":"Statistics","panel.journal":"Journal","panel.no_vehicle":"No vehicle yet.","panel.open_integration":"Add a vehicle from the Carbu integration page.","common.no_vehicle":"No vehicle. Add one from the Carbu integration page.","common.not_loaded":"The Carbu integration is not loaded.","common.cancel":"Cancel","common.save":"Save","common.delete":"Delete","common.edit":"Edit","common.close":"Close","common.more":"More options","common.load_more":"Show more","common.none":"No entries.","common.error":"Error: {message}","common.optional":"optional","action.add_fuel":"Fill-up","action.add_expense":"Expense","action.add_fuel_long":"Add a fill-up","action.add_expense_long":"Add an expense","tile.consumption":"Average consumption","tile.month_cost":"Cost this month","tile.cost_per_distance":"Cost per {unit}","tile.odometer":"Odometer","tile.distance_month":"Distance this month","section.recent_fuel":"Latest fill-ups","section.recent_expenses":"Latest expenses","section.monthly":"Monthly expenses","chart.total":"Total","chart.empty":"No expenses in this period.","chart.summary":"Expenses over the last {count} months, stacked by category.","chart.month":"Month","fuel.title_new":"New fill-up","fuel.title_edit":"Edit fill-up","fuel.odometer":"Odometer ({unit})","fuel.volume":"Quantity ({unit})","fuel.total":"Amount ({currency})","fuel.unit_price":"Unit price ({currency}/{unit})","fuel.computed":"Computed automatically","fuel.full_tank":"Full tank","fuel.partial":"partial","fuel.date":"Date","fuel.time":"Time","fuel.fuel_type":"Fuel","fuel.station":"Station","fuel.notes":"Notes","fuel.need_two":"Enter at least two of quantity, amount and unit price.","fuel.warnings":"Please check:","fuel.save_anyway":"Save anyway","fuel.delete_confirm":"Delete the fill-up of {date}? Figures will be recalculated.","expense.title_new":"New expense","expense.title_edit":"Edit expense","expense.amount":"Amount ({currency})","expense.category":"Category","expense.odometer":"Odometer ({unit})","expense.description":"Description","expense.attachment":"Attachment (photo or PDF, 10 MB max)","expense.attachment_view":"View attachment","expense.attachment_remove":"Remove attachment","expense.attachment_error":"The attachment was not saved ({code}).","expense.delete_confirm":"Delete the expense of {date} ({amount})?","journal.tab_fuel":"Fill-ups","journal.tab_expenses":"Expenses","journal.filters":"Filters","journal.from":"From","journal.to":"To","journal.min":"Min. amount","journal.max":"Max. amount","journal.categories":"Categories","journal.all":"All","journal.reset":"Reset","journal.count":"{count} entries, total {sum}","journal.period_month":"This month","journal.period_3m":"3 months","journal.period_year":"This year","journal.period_all":"All","fuel_type.gasoline":"Petrol","fuel_type.diesel":"Diesel","fuel_type.lpg":"LPG","fuel_type.cng":"CNG","category.fuel":"Fuel","warning.odometer_below_previous":"Odometer below the previous reading ({previous} {unit}).","warning.odometer_above_next":"Odometer above the next reading ({next} {unit}).","warning.consumption_out_of_range":"Consumption of {value} {consumption}, outside the expected range ({min} \u2013 {max}).","warning.volume_exceeds_tank":"Quantity larger than the tank capacity ({capacity} {volume}).","warning.fuel_not_supported":"This fuel is not declared for the vehicle.","warning.amount_mismatch":"Amount differs from quantity \xD7 price ({expected}).","editor.vehicle":"Vehicle","editor.title":"Title","editor.show_chart":"Show monthly chart","editor.show_recent":"Show latest entries","reminders.title":"Reminders","reminders.add":"Reminder","reminders.add_long":"Add a reminder","reminders.none":"No reminders.","reminders.done":"Done","reminders.done_long":"Mark \u201C{label}\u201D as done","reminders.done_confirm":"Mark \u201C{label}\u201D as done today? {next}","reminders.next_recurring":"The next due date will be calculated automatically.","reminders.next_once":"This one-off reminder will then be deactivated.","reminders.delete_confirm":"Delete the reminder \u201C{label}\u201D?","reminders.state_ok":"Up to date","reminders.state_alert":"Soon","reminders.state_due":"Due","reminders.state_inactive":"Done","reminders.left_days":"in {days} d","reminders.late_days":"{days} d overdue","reminders.left_distance":"in {distance} {unit}","reminders.late_distance":"{distance} {unit} overdue","reminders.every":"every {value}","reminder.title_new":"New reminder","reminder.title_edit":"Edit reminder","reminder.label":"Label","reminder.kind":"Trigger","reminder.kind_date":"On a date","reminder.kind_distance":"At an odometer reading","reminder.kind_both":"Date or odometer (whichever comes first)","reminder.due_date":"Due date","reminder.due_odometer":"Due odometer ({unit})","reminder.alert_days":"Alert \u2026 days before","reminder.alert_distance":"Alert \u2026 {unit} before","reminder.interval_days":"Repeat every \u2026 days","reminder.interval_distance":"Repeat every \u2026 {unit}","reminder.recurrence_hint":"Leave empty for a one-off reminder.","stats.name":"Carbu \xB7 statistics","stats.description":"Statistics by period and consumption per fill-up.","stats.period":"Period","stats.period_30d":"30 days","stats.period_3m":"3 months","stats.period_12m":"12 months","stats.period_all":"Since acquisition","stats.distance":"Distance","stats.consumption":"Average consumption","stats.fuel_cost":"Fuel","stats.expense_cost":"Other expenses","stats.total_cost":"Total cost","stats.cost_per_distance":"Cost per {unit}","stats.fills":"Fill-ups","stats.volume":"Quantity","stats.curve":"Consumption per fill-up","stats.curve_point":"Fill-up","stats.moving_average":"Moving average ({count} fill-ups)","stats.curve_empty":"No consumption measured in this period yet (two full fill-ups are needed).","stats.curve_summary":"Consumption of {count} fill-ups between {start} and {end}.","stats.by_category":"Expenses by category","editor.show_reminders":"Show reminders","editor.show_recurring":"Show recurring expenses","editor.period":"Default period","import.button":"Import","import.button_long":"Import a CSV file","import.title":"Import a CSV file","import.help":"Files produced by the export (fill-ups, expenses, odometer readings, reminders), even after editing in a spreadsheet. Nothing is saved before you confirm.","import.file":"CSV file","import.analyzing":"Analysing the file\u2026","import.kind_fuel":"Fill-ups","import.kind_expenses":"Expenses","import.kind_odometer":"Odometer readings","import.kind_reminders":"Reminders","import.summary":"{kind}: {new} new line(s), {duplicate} already present, {error} with errors.","import.new_categories":"Categories that will be created: {names}.","import.status_new":"New","import.status_duplicate":"Duplicate","import.status_error":"Error","import.line":"Line {line}","import.truncated":"Only the first 200 lines are shown.","import.confirm":"Import {count} line(s)","import.done":"{count} line(s) imported.","import.error_unknown_format":"Unrecognised format: use a file produced by the export.","import.error_empty":"The file is empty.","import.error_too_large":"The file is too large (5 MB max).","import.error_too_many_rows":"The file has too many lines (20,000 max).","recurring.title":"Recurring expenses","recurring.add":"Recurring","recurring.add_long":"Add a recurring expense","recurring.none":"No recurring expenses (subscription, monthly insurance\u2026).","recurring.title_new":"New recurring expense","recurring.title_edit":"Edit recurring expense","recurring.label":"Label","recurring.interval":"Frequency","recurring.interval_1":"Every month","recurring.interval_2":"Every 2 months","recurring.interval_3":"Every quarter","recurring.interval_6":"Every 6 months","recurring.interval_12":"Every year","recurring.start":"First due date","recurring.end":"Last due date","recurring.active":"Active","recurring.help":"On each due date the expense is added to the log automatically. Past due dates are added as soon as you save.","recurring.next":"Next: {date}","recurring.ended":"Ended","recurring.paused":"Paused","recurring.per_month":"{amount}/month","recurring.total_month":"Total: {amount} per month","recurring.delete_confirm":"Delete the recurring expense \u201C{label}\u201D? Expenses already added to the log are kept.","recurring.badge":"Recurring","export.button":"Export","export.button_long":"Export data as CSV","export.title":"Export as CSV","export.help":"Files in the import format (\u201C;\u201D separator, UTF-8), readable in a spreadsheet.","export.file_pleins":"Fill-ups","export.file_depenses":"Expenses","export.file_depenses_recurrentes":"Recurring expenses","export.file_releves":"Odometer readings","export.file_rappels":"Reminders","export.lines":"{count} row(s)","export.download":"Download","export.download_all":"Download all","stats.cost_curve":"Cost per {unit}","stats.cost_curve_total":"All costs","stats.cost_curve_fuel":"Fuel only","stats.cost_curve_note":"Cumulative since the start of the log: total fill-ups and expenses \xF7 distance driven.","stats.odometer_curve":"Odometer","stats.odometer_label":"Odometer","stats.line_empty":"Not enough data for this period.","stats.line_summary":"{name}: {count} points, from {start} to {end}."};function J(r){return r?.locale?.language??r?.language??"en"}function L(r,C,H={}){return(J(r).startsWith("fr")?k5:w5)[C].replace(/\{(\w+)\}/g,(e,M)=>M in H?String(H[M]):`{${M}}`)}function s(r,C,H=0){return C==null||Number.isNaN(C)?"\u2014":new Intl.NumberFormat(J(r),{minimumFractionDigits:H,maximumFractionDigits:H}).format(C)}function h(r,C,H,V=2){if(C==null)return"\u2014";try{return new Intl.NumberFormat(J(r),{style:"currency",currency:H,minimumFractionDigits:V,maximumFractionDigits:V}).format(C)}catch{return`${s(r,C,V)} ${H}`}}function S(r,C){let[H,V,e]=C.split("-").map(Number);return new Intl.DateTimeFormat(J(r),{dateStyle:"medium"}).format(new Date(H,V-1,e))}function L5(r,C){let[H,V]=C.split("-").map(Number);return new Intl.DateTimeFormat(J(r),{month:"short"}).format(new Date(H,V-1,1))}function x1(r,C){let[H,V]=C.split("-").map(Number);return new Intl.DateTimeFormat(J(r),{month:"long",year:"numeric"}).format(new Date(H,V-1,1))}function z(r=0){let C=new Date;return C.setDate(C.getDate()+r),u1(C)}function u1(r){let C=H=>String(H).padStart(2,"0");return`${r.getFullYear()}-${C(r.getMonth()+1)}-${C(r.getDate())}`}function d2(r,C){let H=10**C;return Math.round((r+Number.EPSILON)*H)/H}function T(r){let C=r.trim().replace(/\s/g,"").replace(",",".");if(C==="")return null;let H=Number(C);return Number.isFinite(H)?H:null}function F(r,C,H){let V=String(d2(C,H));return new Intl.NumberFormat(J(r)).format(1.5).charAt(1)===","?V.replace(".",","):V}var e5=["e10","sp95","sp98"];function N(r){return r?{e10:"SP95-E10",sp95:"SP95",sp98:"SP98"}[r]:""}function n2(r,C){return C==null?{value:"\u2014",unit:"kg CO\u2082e"}:Math.abs(C)>=1e3?{value:s(r,C/1e3,2),unit:"t CO\u2082e"}:{value:s(r,C,0),unit:"kg CO\u2082e"}}var p2="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z";var D="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z";var W="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z";var a1="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z";var c1="M16.5,6V17.5A4,4 0 0,1 12.5,21.5A4,4 0 0,1 8.5,17.5V5A2.5,2.5 0 0,1 11,2.5A2.5,2.5 0 0,1 13.5,5V15.5A1,1 0 0,1 12.5,16.5A1,1 0 0,1 11.5,15.5V6H10V15.5A2.5,2.5 0 0,0 12.5,18A2.5,2.5 0 0,0 15,15.5V5A4,4 0 0,0 11,1A4,4 0 0,0 7,5V17.5A5.5,5.5 0 0,0 12.5,23A5.5,5.5 0 0,0 18,17.5V6H16.5Z";var I="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z";var C1="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z";var l2="M9,16V10H5L12,3L19,10H15V16H9M5,20V18H19V20H5Z";var f=b`
  :host {
    --vl-gap: 12px;
    --vl-radius: var(--ha-card-border-radius, 12px);
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
    border-radius: 8px;
    min-height: 40px;
    padding: 0 14px;
    border: 1px solid var(--vl-input-border);
    background: transparent;
    color: var(--primary-text-color);
  }
  /* Bouton principal teinté : le texte garde la couleur du thème, ce qui
     assure un contraste AA quelle que soit la couleur primaire. */
  button.primary,
  button[aria-pressed="true"] {
    background: color-mix(in srgb, var(--primary-color) 18%, transparent);
    border-color: var(--primary-color);
    color: var(--primary-text-color);
    font-weight: 500;
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
`;var U=class extends Z{constructor(){super();this._vehicles=[];this._currency="EUR";this._started=!1;this._error="",this._loading=!0}static{this.properties={hass:{attribute:!1},_config:{state:!0},_error:{state:!0},_loading:{state:!0}}}setConfig(H){if(!H)throw new Error("Invalid configuration");let V=this._config?.vehicle_id!==H.vehicle_id;this._config={show_chart:!0,show_recent:!0,...H},this._started&&V?this.reload():this._start()}get vehicle(){return this._vehicles.find(H=>H.id===this._config?.vehicle_id)??this._vehicles[0]}_start(){this._started||!this.hass||!this.isConnected||!this._config||(this._started=!0,this.reload())}updated(H){H.has("hass")&&(this._start(),this._subscribe())}connectedCallback(){super.connectedCallback(),this.hass&&(this._subscribe(),this._start())}disconnectedCallback(){super.disconnectedCallback(),this._started=!1;let H=this._unsubscribe;this._unsubscribe=void 0,H?.then(V=>V()).catch(()=>{})}_subscribe(){this._unsubscribe||!this.isConnected||(this._unsubscribe=k1(this.hass,()=>{window.clearTimeout(this._reloadTimer),this._reloadTimer=window.setTimeout(()=>{this.reload()},300)}),this._unsubscribe.catch(()=>{this._unsubscribe=void 0}))}async reload(){try{let H=await o1(this.hass);this._vehicles=H.vehicles,this._currency=H.currency,this._error="",await this.loadVehicleData()}catch(H){this._error=H.code??H.message}finally{this._loading=!1,this.requestUpdate()}}};var m2=b`
  ul.entries {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  ul.entries li {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 0;
    border-bottom: 1px solid var(--vl-border);
  }
  ul.entries li:last-child {
    border-bottom: none;
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
`;function s2(r,C,H,V){let e=C.units.volume[H.fuel_type]??"L",M=[`${s(r,H.odometer,0)} ${C.units.distance}`];return H.distance!=null&&M.push(`+${s(r,H.distance,0)} ${C.units.distance}`),H.consumption!=null&&M.push(`${s(r,H.consumption,2)} ${C.units.consumption[H.fuel_type]??""}`),M.push(`${h(r,H.unit_price,V,3)}/${e}`),H.station&&M.push(H.station),M.join(" \xB7 ")}var w1=class extends U{static{this.properties={...U.properties,_data:{state:!0}}}static{this.styles=[f,m2,b`
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
      h3 {
        margin: 0 0 4px;
        font-size: 1rem;
        font-weight: 500;
      }
      .actions {
        display: flex;
        gap: 8px;
      }
      .actions button {
        display: inline-flex;
        align-items: center;
        gap: 4px;
      }
      .tiles {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
        gap: 8px;
        margin: 0;
      }
      .tile {
        border: 1px solid var(--vl-border);
        border-radius: 10px;
        padding: 8px 12px;
        display: flex;
        flex-direction: column-reverse;
        margin: 0;
      }
      .tile dt {
        font-size: 0.8125rem;
        color: var(--vl-muted);
      }
      .tile dd {
        margin: 0;
        font-size: 1.25rem;
        font-weight: 500;
        font-variant-numeric: tabular-nums;
      }
      .tile dd small {
        font-size: 0.8125rem;
        font-weight: 400;
        color: var(--vl-muted);
      }
      .last {
        border-radius: 12px;
        padding: 12px 16px;
        background: color-mix(in srgb, var(--primary-color) 10%, transparent);
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .last-head {
        display: flex;
        flex-wrap: wrap;
        align-items: baseline;
        justify-content: space-between;
        gap: 4px 12px;
      }
      .last-head h3 {
        margin: 0;
      }
      .last-head span,
      .hint {
        color: var(--vl-muted);
        font-size: 0.875rem;
      }
      .hint {
        margin: 0;
      }
      .figures {
        display: flex;
        flex-wrap: wrap;
        gap: 8px 32px;
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
        font-size: 1.75rem;
        font-weight: 500;
        line-height: 1.2;
        font-variant-numeric: tabular-nums;
      }
      .figure dd small {
        font-size: 0.875rem;
        font-weight: 400;
        color: var(--vl-muted);
      }
      .delta {
        font-size: 0.8125rem;
      }
      .delta.up {
        color: var(--warning-color, #ffa600);
      }
      .delta.down {
        color: var(--success-color, #43a047);
      }
      .recent {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 16px;
      }
    `]}constructor(){super(),this._data=null}static getStubConfig(){return{type:"custom:carbu-card"}}static async getConfigElement(){let C=document.createElement("carbu-card-editor");return C.setAttribute("kind","dashboard"),C}getCardSize(){return 8}getGridOptions(){return{columns:12,min_columns:6,rows:"auto"}}async loadVehicleData(){let C=this.vehicle;this._data=C?await E2(this.hass,C.id):null,await Promise.all([this.renderRoot.querySelector("vl-reminder-list")?.reload(),this.renderRoot.querySelector("vl-recurring-list")?.reload()])}_dialog(C){return this.renderRoot.querySelector(C)}async _deleteFuel(C){await this._dialog("vl-confirm-dialog").ask(L(this.hass,"fuel.delete_confirm",{date:S(this.hass,C.date)}))&&this._data&&(await y1(this.hass,this._data.id,C.id),await this.reload())}async _deleteExpense(C){await this._dialog("vl-confirm-dialog").ask(L(this.hass,"expense.delete_confirm",{date:S(this.hass,C.date),amount:h(this.hass,C.amount,this._currency)}))&&this._data&&(await _1(this.hass,this._data.id,C.id),await this.reload())}_tiles(C){let H=this.hass,V=C.summary,e=C.fuel_types[0],M=C.units.distance,t=(d,o,A="")=>i`<div class="tile">
        <dt>${d}</dt>
        <dd>${o}${A?i` <small>${A}</small>`:a}</dd>
      </div>`;return i`<dl class="tiles">
      ${t(L(H,"tile.consumption"),s(H,V?.consumption[e],2),C.units.consumption[e])}
      ${t(L(H,"tile.month_cost"),h(H,V?.month_cost,C.currency))}
      ${t(L(H,"tile.cost_per_distance",{unit:M}),h(H,V?.cost_per_distance,C.currency,3))}
      ${t(L(H,"tile.odometer"),s(H,V?.current_odometer,0),M)}
      ${t(L(H,"tile.distance_month"),s(H,V?.distance_month,0),M)}
    </dl>`}_lastFill(C){let H=this.hass,V=C.last_fuel;if(!V)return a;let e=C.units.volume[V.fuel_type]??"L",M=C.units.consumption[V.fuel_type]??"",t=C.summary?.consumption[V.fuel_type]??null,d=/\/100/.test(M),o=a;if(V.consumption!=null&&t!=null&&t>0){let A=V.consumption-t,c=d?A>0:A<0;Math.abs(A)>=.005&&(o=i`<span class="delta ${c?"up":"down"}">
          ${L(H,c?"last_fill.worse":"last_fill.better",{value:s(H,Math.abs(A),2)})}
        </span>`)}return i`<section class="last" aria-labelledby="last-fill">
      <div class="last-head">
        <h3 id="last-fill">${L(H,"last_fill.title")}</h3>
        <span>
          ${S(H,V.date)} · ${s(H,V.volume,2)} ${e}${V.grade?` ${N(V.grade)}`:""} · ${h(H,V.total_cost,C.currency)}
        </span>
      </div>
      <dl class="figures">
        <div class="figure">
          <dt>${L(H,"last_fill.distance")}</dt>
          <dd>${s(H,V.distance,0)} <small>${C.units.distance}</small></dd>
        </div>
        <div class="figure">
          <dt>${L(H,"last_fill.consumption")} ${o}</dt>
          <dd>${s(H,V.consumption,2)} <small>${M}</small></dd>
        </div>
      </dl>
      ${V.full_tank?a:i`<p class="hint">${L(H,"last_fill.partial")}</p>`}
    </section>`}_fuelRow(C,H){let V=this.hass,e=C.units.volume[H.fuel_type]??"L",M=H.grade?` ${N(H.grade)}`:"",t=`${S(V,H.date)} \xB7 ${s(V,H.volume,2)} ${e}${M}`;return i`<li>
      <div class="entry-main">
        <span class="entry-title">
          <span>${t}${H.full_tank?a:i` <span class="badge">${L(V,"fuel.partial")}</span>`}</span>
          <span class="amount">${h(V,H.total_cost,C.currency)}</span>
        </span>
        <span class="entry-sub">${s2(V,C,H,C.currency)}</span>
      </div>
      <span class="row-actions">
        <button
          class="icon"
          aria-label="${L(V,"common.edit")} : ${t}"
          @click=${()=>this._dialog("vl-fuel-dialog").open(H)}
        >
          ${u(I)}
        </button>
        <button
          class="icon"
          aria-label="${L(V,"common.delete")} : ${t}"
          @click=${()=>this._deleteFuel(H)}
        >
          ${u(W)}
        </button>
      </span>
    </li>`}_expenseRow(C,H){let V=this.hass,e=C.categories.find(t=>t.id===H.category_id),M=`${S(V,H.date)} \xB7 ${e?.label??H.category_id}`;return i`<li>
      <div class="entry-main">
        <span class="entry-title">
          <span>${M}</span>
          <span class="amount">${h(V,H.amount,C.currency)}</span>
        </span>
        ${H.description?i`<span class="entry-sub">${H.description}</span>`:a}
      </div>
      <span class="row-actions">
        <button
          class="icon"
          aria-label="${L(V,"common.edit")} : ${M}"
          @click=${()=>this._dialog("vl-expense-dialog").open(H)}
        >
          ${u(I)}
        </button>
        <button
          class="icon"
          aria-label="${L(V,"common.delete")} : ${M}"
          @click=${()=>this._deleteExpense(H)}
        >
          ${u(W)}
        </button>
      </span>
    </li>`}render(){let C=this.hass;if(this._loading)return i`<ha-card><p>${L(C,"common.loading")}</p></ha-card>`;if(this._error){let e=this._error==="not_loaded"?L(C,"common.not_loaded"):this._error;return i`<ha-card><p class="error" role="alert">${e}</p></ha-card>`}let H=this._data;if(!H)return i`<ha-card><p>${L(C,"common.no_vehicle")}</p></ha-card>`;let V=this._config;return i`<ha-card>
      <div class="head">
        <h2>${V.title||H.name}</h2>
        <div class="actions">
          <button
            class="primary"
            aria-label=${L(C,"action.add_fuel_long")}
            @click=${()=>this._dialog("vl-fuel-dialog").open()}
          >
            ${u(C1)} ${L(C,"action.add_fuel")}
          </button>
          <button
            aria-label=${L(C,"action.add_expense_long")}
            @click=${()=>this._dialog("vl-expense-dialog").open()}
          >
            ${u(C1)} ${L(C,"action.add_expense")}
          </button>
        </div>
      </div>
      ${V.show_last_fill!==!1?this._lastFill(H):a}
      ${this._tiles(H)}
      ${V.show_reminders!==!1?i`<section aria-labelledby="reminders">
            <div class="head">
              <h3 id="reminders">${L(C,"reminders.title")}</h3>
              <button
                aria-label=${L(C,"reminders.add_long")}
                @click=${()=>this.renderRoot.querySelector("vl-reminder-list").openEditor()}
              >
                ${u(C1)} ${L(C,"reminders.add")}
              </button>
            </div>
            <vl-reminder-list .hass=${C} .vehicle=${H}></vl-reminder-list>
          </section>`:a}
      ${V.show_recurring!==!1?i`<section aria-labelledby="recurring">
            <div class="head">
              <h3 id="recurring">${L(C,"recurring.title")}</h3>
              <button
                aria-label=${L(C,"recurring.add_long")}
                @click=${()=>this.renderRoot.querySelector("vl-recurring-list").openEditor()}
              >
                ${u(C1)} ${L(C,"recurring.add")}
              </button>
            </div>
            <vl-recurring-list
              .hass=${C}
              .vehicle=${H}
              .categories=${H.categories}
              .currency=${H.currency}
              @saved=${()=>this.reload()}
            ></vl-recurring-list>
          </section>`:a}
      ${V.show_recent?i`<div class="recent">
            <section aria-labelledby="recent-fuel">
              <h3 id="recent-fuel">${L(C,"section.recent_fuel")}</h3>
              ${H.recent_fuel.length?i`<ul class="entries">${H.recent_fuel.map(e=>this._fuelRow(H,e))}</ul>`:i`<p class="empty">${L(C,"common.none")}</p>`}
            </section>
            <section aria-labelledby="recent-expenses">
              <h3 id="recent-expenses">${L(C,"section.recent_expenses")}</h3>
              ${H.recent_expenses.length?i`<ul class="entries">
                    ${H.recent_expenses.map(e=>this._expenseRow(H,e))}
                  </ul>`:i`<p class="empty">${L(C,"common.none")}</p>`}
            </section>
          </div>`:a}
      ${V.show_chart?i`<section aria-labelledby="monthly">
            <h3 id="monthly">${L(C,"section.monthly")}</h3>
            <vl-monthly-chart
              .hass=${C}
              .data=${H.monthly}
              .categories=${H.categories}
              .currency=${H.currency}
            ></vl-monthly-chart>
          </section>`:a}
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
    </ha-card>`}};var P1=class extends Z{static{this.properties={hass:{attribute:!1},kind:{type:String},_config:{state:!0},_vehicles:{state:!0}}}static{this.styles=[f,b`
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
    `]}constructor(){super(),this.kind="dashboard",this._vehicles=[]}setConfig(C){this._config=C}firstUpdated(){o1(this.hass).then(C=>this._vehicles=C.vehicles).catch(()=>{})}_change(C,H){let V={...this._config};H===""||H===void 0?delete V[C]:V[C]=H,this._config=V,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:V},bubbles:!0,composed:!0}))}render(){if(!this._config)return a;let C=this.hass;return i`
      <div class="field">
        <label for="vehicle">${L(C,"editor.vehicle")}</label>
        <select
          id="vehicle"
          @change=${H=>this._change("vehicle_id",H.target.value)}
        >
          ${this._vehicles.map(H=>i`<option value=${H.id} ?selected=${H.id===this._config.vehicle_id}>
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
      ${this.kind==="dashboard"?i`<label class="check">
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
            </label>`:a}
      ${this.kind==="stats"?i`<div class="field">
            <label for="period">${L(C,"editor.period")}</label>
            <select
              id="period"
              @change=${H=>this._change("period",H.target.value)}
            >
              ${["30d","3m","12m","all"].map(H=>i`<option value=${H} ?selected=${(this._config.period??"12m")===H}>
                    ${L(C,`stats.period_${H}`)}
                  </option>`)}
            </select>
          </div>`:a}
    `}};var M5=25;function P5(r){let C=new Date;return r==="month"?{start:u1(new Date(C.getFullYear(),C.getMonth(),1))}:r==="3m"?{start:u1(new Date(C.getFullYear(),C.getMonth()-2,1))}:r==="year"?{start:u1(new Date(C.getFullYear(),0,1))}:{}}var B1=class extends U{static{this.properties={...U.properties,_tab:{state:!0},_fuel:{state:!0},_expenses:{state:!0},_fuelTotal:{state:!0},_expenseTotal:{state:!0},_expenseSum:{state:!0},_categories:{state:!0},_filters:{state:!0}}}static{this.styles=[f,m2,b`
      ha-card {
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 12px;
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
      .head-actions {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }
      .head-actions button {
        display: inline-flex;
        align-items: center;
        gap: 4px;
      }
      [role="tablist"] {
        display: flex;
        gap: 4px;
        border-bottom: 1px solid var(--vl-border);
      }
      [role="tab"] {
        border: none;
        border-bottom: 3px solid transparent;
        border-radius: 0;
      }
      [role="tab"][aria-selected="true"] {
        border-bottom-color: var(--primary-color);
        font-weight: 500;
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
    `]}constructor(){super(),this._tab="fuel",this._fuel=[],this._expenses=[],this._fuelTotal=0,this._expenseTotal=0,this._expenseSum=0,this._categories=[],this._filters={preset:"all"}}static getStubConfig(){return{type:"custom:carbu-journal-card"}}static async getConfigElement(){let C=document.createElement("carbu-card-editor");return C.setAttribute("kind","journal"),C}getCardSize(){return 10}getGridOptions(){return{columns:12,min_columns:6,rows:"auto"}}async loadVehicleData(){if(!this.vehicle)return;let[H]=await Promise.all([b1(this.hass),this._loadFuel(!1),this._loadExpenses(!1)]);this._categories=H}async _loadFuel(C){let H=this.vehicle;if(!H)return;let V=await N2(this.hass,H.id,{limit:this._config.page_size??M5,offset:C?this._fuel.length:0});this._fuel=C?[...this._fuel,...V.items]:V.items,this._fuelTotal=V.total}_apiFilters(){let{preset:C,...H}=this._filters;return H}async _loadExpenses(C){let H=this.vehicle;if(!H)return;let V=await I2(this.hass,H.id,{...this._apiFilters(),limit:this._config.page_size??M5,offset:C?this._expenses.length:0});this._expenses=C?[...this._expenses,...V.items]:V.items,this._expenseTotal=V.total,this._expenseSum=V.sum??0}_setFilters(C){let H={...this._filters,...C};for(let[V,e]of Object.entries(H))(e==null||e==="")&&delete H[V];this._filters=H,this._loadExpenses(!1)}_preset(C){let H=P5(C);this._setFilters({preset:C,start:H.start,end:void 0})}_toggleCategory(C,H){let V=new Set(this._filters.category_ids??[]);H?V.add(C):V.delete(C),this._setFilters({category_ids:V.size?[...V]:void 0})}_confirm(){return this.renderRoot.querySelector("vl-confirm-dialog")}async _deleteFuel(C){let H=this.vehicle;H&&await this._confirm().ask(L(this.hass,"fuel.delete_confirm",{date:S(this.hass,C.date)}))&&(await y1(this.hass,H.id,C.id),await this.reload())}async _deleteExpense(C){let H=this.vehicle;if(!H)return;let V=L(this.hass,"expense.delete_confirm",{date:S(this.hass,C.date),amount:h(this.hass,C.amount,this._currency)});await this._confirm().ask(V)&&(await _1(this.hass,H.id,C.id),await this.reload())}_tabButton(C,H){let V=this._tab===C;return i`<button
      role="tab"
      id="tab-${C}"
      aria-selected=${V?"true":"false"}
      aria-controls="panel-${C}"
      tabindex=${V?0:-1}
      @click=${()=>this._tab=C}
      @keydown=${e=>{(e.key==="ArrowRight"||e.key==="ArrowLeft")&&(this._tab=this._tab==="fuel"?"expenses":"fuel",this.updateComplete.then(()=>this.renderRoot.querySelector(`#tab-${this._tab}`)?.focus()))}}
    >
      ${H}
    </button>`}_fuelPanel(){let C=this.hass,H=this.vehicle;return i`<div role="tabpanel" id="panel-fuel" aria-labelledby="tab-fuel">
      ${this._fuel.length?i`<ul class="entries">
            ${this._fuel.map(V=>{let e=H.units.volume[V.fuel_type]??"L",M=V.grade?` ${N(V.grade)}`:"",t=`${S(C,V.date)} \xB7 ${s(C,V.volume,2)} ${e}${M}`;return i`<li>
                <div class="entry-main">
                  <span class="entry-title">
                    <span>${t}${V.full_tank?a:i` <span class="badge">${L(C,"fuel.partial")}</span>`}</span>
                    <span class="amount">${h(C,V.total_cost,this._currency)}</span>
                  </span>
                  <span class="entry-sub">
                    ${s2(C,H,V,this._currency)}${V.notes?` \xB7 ${V.notes}`:""}
                  </span>
                </div>
                <span class="row-actions">
                  <button class="icon" aria-label="${L(C,"common.edit")} : ${t}"
                    @click=${()=>this.renderRoot.querySelector("vl-fuel-dialog").open(V)}>
                    ${u(I)}
                  </button>
                  <button class="icon" aria-label="${L(C,"common.delete")} : ${t}"
                    @click=${()=>this._deleteFuel(V)}>
                    ${u(W)}
                  </button>
                </span>
              </li>`})}
          </ul>`:i`<p class="empty">${L(C,"common.none")}</p>`}
      ${this._fuel.length<this._fuelTotal?i`<button class="more" @click=${()=>this._loadFuel(!0)}>${L(C,"common.load_more")}</button>`:a}
    </div>`}_filtersForm(){let C=this.hass,H=this._filters,V=[["month",L(C,"journal.period_month")],["3m",L(C,"journal.period_3m")],["year",L(C,"journal.period_year")],["all",L(C,"journal.period_all")]],e=(M,t)=>this._setFilters({[M]:T(t)??void 0});return i`<fieldset>
      <legend>${L(C,"journal.filters")}</legend>
      <div class="presets" role="group" aria-label=${L(C,"journal.filters")}>
        ${V.map(([M,t])=>i`<button aria-pressed=${H.preset===M?"true":"false"} @click=${()=>this._preset(M)}>
              ${t}
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
        ${this._categories.map(M=>i`<label>
            <input type="checkbox" .checked=${H.category_ids?.includes(M.id)??!1}
              @change=${t=>this._toggleCategory(M.id,t.target.checked)} />
            ${M.label}
          </label>`)}
      </div>
      <div class="presets">
        <button @click=${()=>{this._filters={preset:"all"},this._loadExpenses(!1)}}>${L(C,"journal.reset")}</button>
      </div>
    </fieldset>`}_expensePanel(){let C=this.hass;return i`<div role="tabpanel" id="panel-expenses" aria-labelledby="tab-expenses">
      ${this._filtersForm()}
      <p class="summary" aria-live="polite">
        ${L(C,"journal.count",{count:this._expenseTotal,sum:h(C,this._expenseSum,this._currency)})}
      </p>
      ${this._expenses.length?i`<ul class="entries">
            ${this._expenses.map(H=>{let V=this._categories.find(M=>M.id===H.category_id),e=`${S(C,H.date)} \xB7 ${V?.label??H.category_id}`;return i`<li>
                <div class="entry-main">
                  <span class="entry-title">
                    <span>${e}${H.attachment?i` ${u(c1)}`:a}</span>
                    <span class="amount">${h(C,H.amount,this._currency)}</span>
                  </span>
                  ${H.description?i`<span class="entry-sub">${H.description}</span>`:a}
                </div>
                <span class="row-actions">
                  <button class="icon" aria-label="${L(C,"common.edit")} : ${e}"
                    @click=${()=>this.renderRoot.querySelector("vl-expense-dialog").open(H)}>
                    ${u(I)}
                  </button>
                  <button class="icon" aria-label="${L(C,"common.delete")} : ${e}"
                    @click=${()=>this._deleteExpense(H)}>
                    ${u(W)}
                  </button>
                </span>
              </li>`})}
          </ul>`:i`<p class="empty">${L(C,"common.none")}</p>`}
      ${this._expenses.length<this._expenseTotal?i`<button class="more" @click=${()=>this._loadExpenses(!0)}>${L(C,"common.load_more")}</button>`:a}
    </div>`}render(){let C=this.hass;if(this._loading)return i`<ha-card><p>${L(C,"common.loading")}</p></ha-card>`;if(this._error){let e=this._error==="not_loaded"?L(C,"common.not_loaded"):this._error;return i`<ha-card><p class="error" role="alert">${e}</p></ha-card>`}let H=this.vehicle;if(!H)return i`<ha-card><p>${L(C,"common.no_vehicle")}</p></ha-card>`;let V=this._tab==="fuel";return i`<ha-card>
      <div class="head">
        <h2>${this._config.title||`${L(C,"journal.name")} \xB7 ${H.name}`}</h2>
        <div class="head-actions">
        <button
          aria-label=${L(C,"import.button_long")}
          @click=${()=>this.renderRoot.querySelector("vl-import-dialog").open()}
        >
          ${u(l2)} ${L(C,"import.button")}
        </button>
        <button
          aria-label=${L(C,"export.button_long")}
          @click=${()=>this.renderRoot.querySelector("vl-export-dialog").open()}
        >
          ${u(a1)} ${L(C,"export.button")}
        </button>
        <button
          class="primary"
          aria-label=${L(C,V?"action.add_fuel_long":"action.add_expense_long")}
          @click=${()=>V?this.renderRoot.querySelector("vl-fuel-dialog").open():this.renderRoot.querySelector("vl-expense-dialog").open()}
        >
          ${u(C1)} ${L(C,V?"action.add_fuel":"action.add_expense")}
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
    </ha-card>`}};var B5=["30d","3m","12m","all"],$1=class extends U{static{this.properties={...U.properties,_period:{state:!0},_stats:{state:!0},_categories:{state:!0}}}static{this.styles=[f,b`
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
      h3 {
        margin: 0 0 4px;
        font-size: 1rem;
        font-weight: 500;
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
      dl.tiles {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
        gap: 8px;
        margin: 0;
      }
      .tile {
        border: 1px solid var(--vl-border);
        border-radius: 10px;
        padding: 8px 12px;
        display: flex;
        flex-direction: column-reverse;
      }
      .tile dt {
        font-size: 0.8125rem;
        color: var(--vl-muted);
      }
      .tile dd {
        margin: 0;
        font-size: 1.2rem;
        font-weight: 500;
        font-variant-numeric: tabular-nums;
      }
      .tile dd small {
        font-size: 0.8125rem;
        font-weight: 400;
        color: var(--vl-muted);
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
      .group dl.tiles {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
      .tile.main {
        grid-column: 1 / -1;
        background: color-mix(in srgb, var(--primary-color) 10%, transparent);
        border-color: transparent;
      }
      .tile.main dd {
        font-size: 1.6rem;
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
    `]}constructor(){super(),this._period="12m",this._stats=null,this._categories=[]}setConfig(C){super.setConfig(C),C.period&&(this._period=C.period)}static getStubConfig(){return{type:"custom:carbu-stats-card"}}static async getConfigElement(){let C=document.createElement("carbu-card-editor");return C.setAttribute("kind","stats"),C}getCardSize(){return 7}getGridOptions(){return{columns:12,min_columns:6,rows:"auto"}}async loadVehicleData(){let C=this.vehicle;if(!C)return;let[H,V]=await Promise.all([Y2(this.hass,C.id,this._period),b1(this.hass)]);this._stats=H,this._categories=V}async _select(C){this._period=C,await this.loadVehicleData()}render(){let C=this.hass;if(this._loading)return i`<ha-card><p>${L(C,"common.loading")}</p></ha-card>`;if(this._error){let n=this._error==="not_loaded"?L(C,"common.not_loaded"):this._error;return i`<ha-card><p class="error" role="alert">${n}</p></ha-card>`}let H=this.vehicle,V=this._stats;if(!H||!V)return i`<ha-card><p>${L(C,"common.no_vehicle")}</p></ha-card>`;let e=H.units.distance,M=this._currency,t=H.fuel_types.length>1,d=n=>t?` (${L(C,`fuel_type.${n}`)})`:"",o=(n,k,E="",r1=!1)=>i`<div class="tile ${r1?"main":""}">
        <dt>${n}</dt>
        <dd>${k}${E?i` <small>${E}</small>`:a}</dd>
      </div>`,A=Object.values(V.fuel_volume).reduce((n,k)=>n+k,0),c=Object.entries(V.expenses_by_category).sort((n,k)=>k[1]-n[1]),l=[{label:L(C,"category.fuel"),color:"#2e7d32",value:V.fuel_cost},...c.map(([n,k])=>{let E=this._categories.find(r1=>r1.id===n);return{label:E?.label??n,color:E?.color??"#757575",value:k}})].filter(n=>n.value>0),g=l.reduce((n,k)=>n+k.value,0),O=Math.max(1,V.days/30.44),w=n2(C,V.co2_kg),P=n2(C,V.co2_kg/O),x=H.fuel_types[0],p=V.prices[x]??[],B=p.length>1&&p[0].value>0?p[p.length-1].value/p[0].value-1:null,m=n=>n===null?"\u2014":new Intl.NumberFormat(C.locale?.language??C.language,{style:"percent",maximumFractionDigits:1,signDisplay:"exceptZero"}).format(n),v=n=>new Intl.NumberFormat(C.locale?.language??C.language,{style:"percent",maximumFractionDigits:0}).format(g>0?n/g:0),y=[{label:L(C,"stats.cost_curve_total"),color:"#1e88e5",points:V.cost_curve.map(n=>({date:n.date,value:n.total}))},{label:L(C,"stats.cost_curve_fuel"),color:"#2e7d32",points:V.cost_curve.map(n=>({date:n.date,value:n.fuel}))}],Q=[{label:L(C,"stats.odometer_label"),color:"#6d4c41",points:V.odometer_curve}];return i`<ha-card>
      <div class="head">
        <h2>${this._config.title||`${L(C,"stats.name")} \xB7 ${H.name}`}</h2>
        <div class="periods" role="group" aria-label=${L(C,"stats.period")}>
          ${B5.map(n=>i`<button
              aria-pressed=${this._period===n?"true":"false"}
              @click=${()=>this._select(n)}
            >
              ${L(C,`stats.period_${n}`)}
            </button>`)}
        </div>
      </div>
      <p class="range">${S(C,V.start)} – ${S(C,V.end)}</p>
      <div class="groups">
        <section class="group" aria-labelledby="g-consumption">
          <h3 id="g-consumption">${L(C,"stats.group_consumption")}</h3>
          <dl class="tiles">
            ${H.fuel_types.map(n=>{let k=(V.series[n]??[]).map(s5=>s5.value),E=H.units.consumption[n],r1=/\/100/.test(E??""),l5=k.length?(r1?Math.min:Math.max)(...k):null,m5=k.length?(r1?Math.max:Math.min)(...k):null;return i`${o(`${L(C,"stats.consumption")}${d(n)}`,s(C,V.consumption[n],2),E,!0)}
              ${o(L(C,"stats.best"),s(C,l5,2),E)}
              ${o(L(C,"stats.worst"),s(C,m5,2),E)}`})}
          </dl>
        </section>
        <section class="group" aria-labelledby="g-distance">
          <h3 id="g-distance">${L(C,"stats.group_distance")}</h3>
          <dl class="tiles">
            ${o(L(C,"stats.distance"),s(C,V.distance,0),e,!0)}
            ${o(L(C,"stats.fills"),s(C,V.fill_count,0))}
            ${o(L(C,"stats.distance_per_fill"),s(C,V.fill_count>1?V.distance/(V.fill_count-1):null,0),e)}
            ${H.fuel_types.map(n=>o(`${L(C,"stats.volume")}${d(n)}`,s(C,V.fuel_volume[n],0),H.units.volume[n]))}
          </dl>
        </section>
        <section class="group" aria-labelledby="g-costs">
          <h3 id="g-costs">${L(C,"stats.group_costs")}</h3>
          <dl class="tiles">
            ${o(L(C,"stats.total_cost"),h(C,V.total_cost,M),"",!0)}
            ${o(L(C,"stats.per_month"),h(C,V.total_cost/O,M))}
            ${o(L(C,"stats.cost_per_distance",{unit:e}),h(C,V.cost_per_distance,M,3))}
            ${t?a:o(L(C,"stats.avg_price",{unit:H.units.volume[H.fuel_types[0]]??"L"}),h(C,A>0?V.fuel_cost/A:null,M,3))}
            ${o(p.length>1?`${L(C,"stats.price_change")} (${s(C,p[0].value,3)} \u2192 ${s(C,p[p.length-1].value,3)})`:L(C,"stats.price_change"),m(B))}
          </dl>
        </section>
        <section class="group" aria-labelledby="g-carbon">
          <h3 id="g-carbon">${L(C,"stats.group_carbon")}</h3>
          <dl class="tiles">
            ${o(L(C,"stats.co2_total"),w.value,w.unit,!0)}
            ${o(L(C,"stats.co2_per_distance",{unit:e}),s(C,V.co2_per_distance,0),"g CO\u2082e")}
            ${o(L(C,"stats.co2_per_month"),P.value,P.unit)}
          </dl>
          <p class="note">${L(C,"stats.co2_source")}</p>
        </section>
      </div>
      <div class="bottom">
      ${H.fuel_types.map(n=>i`<section aria-labelledby="curve-${n}">
          <h3 id="curve-${n}">
            ${L(C,"stats.curve")}${H.fuel_types.length>1?` \xB7 ${L(C,`fuel_type.${n}`)}`:""}
          </h3>
          <vl-consumption-chart
            .hass=${C}
            .points=${V.series[n]??[]}
            .unit=${H.units.consumption[n]}
            .window=${V.moving_average_window}
          ></vl-consumption-chart>
        </section>`)}
      ${H.fuel_types.filter(n=>(V.prices[n]??[]).length).map(n=>i`<section aria-labelledby="price-${n}">
            <h3 id="price-${n}">${L(C,"stats.price_curve")}${d(n)}</h3>
            <vl-price-chart
              .hass=${C}
              .points=${V.prices[n]}
              .currency=${M}
              .unit=${H.units.volume[n]??"L"}
            ></vl-price-chart>
          </section>`)}
      <section aria-labelledby="cost-curve">
        <h3 id="cost-curve">${L(C,"stats.cost_curve",{unit:e})}</h3>
        <vl-line-chart
          .hass=${C}
          .name=${L(C,"stats.cost_curve",{unit:e})}
          .series=${y}
          .format=${n=>h(C,n,M,3)}
        ></vl-line-chart>
        <p class="note">${L(C,"stats.cost_curve_note")}</p>
      </section>
      <section aria-labelledby="odometer-curve">
        <h3 id="odometer-curve">${L(C,"stats.odometer_curve")}</h3>
        <vl-line-chart
          .hass=${C}
          .name=${L(C,"stats.odometer_curve")}
          .series=${Q}
          .format=${n=>`${s(C,n,0)} ${e}`}
        ></vl-line-chart>
      </section>
      ${l.length?i`<section aria-labelledby="by-category">
            <h3 id="by-category">${L(C,"stats.by_category")}</h3>
            <div class="stack" aria-hidden="true">
              ${l.map(({color:n,value:k})=>i`<span style="flex:${k};background:${n}"></span>`)}
            </div>
            <ul class="legend">
              ${l.map(({label:n,color:k,value:E})=>i`<li>
                  <span class="dot" style="background:${k}"></span>
                  <span class="name">${n}</span>
                  <span class="pct">${v(E)}</span>
                  <span class="amount">${h(C,E,M)}</span>
                </li>`)}
            </ul>
          </section>`:a}
      </div>
    </ha-card>`}};var R=b`
  dialog {
    border: none;
    border-radius: var(--vl-radius);
    padding: 0;
    width: min(560px, calc(100vw - 32px));
    max-height: calc(100dvh - 32px);
    background: var(--card-background-color, var(--ha-card-background, #fff));
    color: var(--primary-text-color);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35);
  }
  dialog::backdrop {
    background: rgba(0, 0, 0, 0.5);
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
`;var T1=class extends Z{static{this.properties={hass:{attribute:!1},_message:{state:!0},_confirmLabel:{state:!0},_danger:{state:!0}}}static{this.styles=[f,R]}constructor(){super(),this._message="",this._confirmLabel="",this._danger=!0}async ask(C,H,V=!0){return this._message=C,this._confirmLabel=H??"",this._danger=V,await this.updateComplete,this.renderRoot.querySelector("dialog").showModal(),new Promise(M=>{this._resolve=M})}_answer(C){this.renderRoot.querySelector("dialog").close(),this._resolve?.(C),this._resolve=void 0}render(){return i`<dialog
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
    </dialog>`}};var F1=220,K={top:12,right:12,bottom:28,left:44},r5="#1e88e5",t5="#ef6c00";function Z1(r,C,H,V){let t=C.length,d=g=>{let O=x1(r,C[g].slice(0,7)),w=t===1?"middle":g===0?"start":g===t-1?"end":"middle",P=O.length*6.5,x=w==="start"?H(g):w==="end"?H(g)-P:H(g)-P/2;return{x:H(g),text:O,anchor:w,left:x,right:x+P}};if(t===0)return[];if(t===1)return[d(0)];let o=d(t-1),A=[d(0)],c=Math.max(2,Math.floor(V/90)),l=Math.max(1,Math.ceil(t/c));for(let g=l;g<t-1;g+=l){let O=d(g);O.left>=A[A.length-1].right+12&&O.right+12<=o.left&&A.push(O)}return o.left>=A[A.length-1].right+12||A.length===1?A.push(o):A[A.length-1]=o,A}var H1=class extends Z{static{this.properties={hass:{attribute:!1},points:{attribute:!1},unit:{type:String},window:{type:Number},_width:{state:!0}}}static{this.styles=[f,b`
      :host {
        display: block;
        position: relative;
      }
      svg.chart {
        width: 100%;
        height: ${F1}px;
        display: block;
      }
      ul.legend svg {
        flex: none;
      }
      .axis {
        fill: var(--vl-muted);
        font-size: 12px;
      }
      .grid {
        stroke: var(--vl-border);
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
    `]}constructor(){super(),this.points=[],this.unit="",this.window=5,this._width=600}connectedCallback(){super.connectedCallback(),this._observer=new ResizeObserver(([C])=>{let H=Math.round(C.contentRect.width);H>0&&Math.abs(H-this._width)>2&&(this._width=H)}),this._observer.observe(this)}disconnectedCallback(){super.disconnectedCallback(),this._observer?.disconnect()}render(){let C=this.hass,H=this.points;if(!H.length)return i`<p class="empty">${L(C,"stats.curve_empty")}</p>`;let V=this._width,e=H.flatMap(p=>[p.value,p.moving_average]),M=Math.min(...e),t=Math.max(...e),d=Math.max((t-M)*.15,.5);M=Math.max(0,M-d),t+=d;let o=V-K.left-K.right,A=F1-K.top-K.bottom,c=p=>K.left+(H.length===1?o/2:p/(H.length-1)*o),l=p=>K.top+A-(p-M)/(t-M)*A,g=[0,.5,1].map(p=>M+p*(t-M)),O=H.map((p,B)=>`${B?"L":"M"}${c(B)},${l(p.moving_average)}`).join(" "),w=Z1(C,H.map(p=>p.date),c,o),P=L(C,"stats.moving_average",{count:this.window}),x=L(C,"stats.curve_summary",{count:H.length,start:S(C,H[0].date),end:S(C,H[H.length-1].date)});return i`
      <svg class="chart" viewBox="0 0 ${V} ${F1}" role="img" aria-label=${x}>
        ${g.map(p=>$`<line class="grid" x1=${K.left} x2=${V-K.right} y1=${l(p)} y2=${l(p)}></line>
            <text class="axis" x=${K.left-6} y=${l(p)+4} text-anchor="end">${s(C,p,1)}</text>`)}
        <path d=${O} fill="none" stroke=${t5} stroke-width="2.5" stroke-linejoin="round"></path>
        ${H.map((p,B)=>$`<circle cx=${c(B)} cy=${l(p.value)} r="4" fill=${r5}
              stroke="var(--card-background-color, #fff)" stroke-width="1.5">
              <title>${S(C,p.date)} : ${s(C,p.value,2)} ${this.unit} (${P} : ${s(C,p.moving_average,2)})</title>
            </circle>`)}
        ${w.map(p=>$`<text class="axis" x=${p.x} y=${F1-8} text-anchor=${p.anchor}>${p.text}</text>`)}
      </svg>
      <ul class="legend">
        <li>
          <svg width="14" height="14" aria-hidden="true" style="height:14px">
            <circle cx="7" cy="7" r="5" fill=${r5}></circle>
          </svg>
          ${L(C,"stats.curve_point")} (${this.unit})
        </li>
        <li>
          <svg width="20" height="14" aria-hidden="true" style="height:14px">
            <line x1="1" x2="19" y1="7" y2="7" stroke=${t5} stroke-width="3"></line>
          </svg>
          ${P}
        </li>
      </ul>
      <div class="visually-hidden">
        <table>
          <caption>${x}</caption>
          <thead>
            <tr>
              <th scope="col">${L(C,"fuel.date")}</th>
              <th scope="col">${L(C,"stats.curve_point")} (${this.unit})</th>
              <th scope="col">${P}</th>
            </tr>
          </thead>
          <tbody>
            ${H.map(p=>i`<tr>
                <th scope="row">${S(C,p.date)}</th>
                <td>${s(C,p.value,2)}</td>
                <td>${s(C,p.moving_average,2)}</td>
              </tr>`)}
          </tbody>
        </table>
      </div>
    `}};var R1=class extends Z{constructor(){super();this._file=null;this.categories=[],this.currency="EUR",this._values={},this._error="",this._busy=!1,this._entry=null}static{this.properties={hass:{attribute:!1},vehicle:{attribute:!1},categories:{attribute:!1},currency:{type:String},_values:{state:!0},_error:{state:!0},_busy:{state:!0},_entry:{state:!0}}}static{this.styles=[f,R]}get _dialog(){return this.renderRoot.querySelector("dialog")}async open(H=null){this._entry=H,this._error="",this._file=null,this._values=H?{date:H.date,amount:F(this.hass,H.amount,2),category_id:H.category_id,odometer:H.odometer!==null?F(this.hass,H.odometer,0):"",description:H.description}:{date:z(),category_id:"maintenance"},this.categories.some(e=>e.id===this._values.category_id)||(this._values={...this._values,category_id:this.categories[0]?.id??"other"}),await this.updateComplete;let V=this.renderRoot.querySelector("#attachment");V&&(V.value=""),this._dialog.showModal(),this.renderRoot.querySelector("#amount")?.focus()}close(){this._dialog?.close()}_set(H,V){this._values={...this._values,[H]:V}}_saved(){this.dispatchEvent(new CustomEvent("saved",{bubbles:!0,composed:!0}))}async _submit(){this._error="";let H=T(this._values.amount??"");if(H===null){this._error=L(this.hass,"expense.amount",{currency:this.currency});return}let V=T(this._values.odometer??""),e={amount:H,category_id:this._values.category_id,description:this._values.description??"",date:this._values.date||z(),odometer:V};this._entry&&(e.expense_id=this._entry.id),this._busy=!0;try{let M=await U2(this.hass,this.vehicle.id,e);if(this._file)try{await G2(this.hass,this.vehicle.id,M.id,this._file)}catch(t){this._entry=M,this._error=L(this.hass,"expense.attachment_error",{code:t.message}),this._saved();return}this.close(),this._saved()}catch(M){this._error=L(this.hass,"common.error",{message:M.message})}finally{this._busy=!1}}async _viewAttachment(){if(!this._entry)return;let H=await z2(this.hass,this.vehicle.id,this._entry.id);window.open(H,"_blank","noopener")}async _removeAttachment(){this._entry&&(await Q2(this.hass,this.vehicle.id,this._entry.id),this._entry={...this._entry,attachment:null},this._saved())}render(){if(!this.vehicle)return a;let H=this.hass,V=L(H,this._entry?"expense.title_edit":"expense.title_new");return i`<dialog aria-labelledby="expense-title">
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
            ${u(D)}
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
                ${this.categories.map(e=>i`<option value=${e.id} ?selected=${e.id===this._values.category_id}>
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
            ${this._entry?.attachment?i`<div class="check">
                  <button type="button" @click=${()=>this._viewAttachment()}>
                    ${u(c1)} ${L(H,"expense.attachment_view")}
                  </button>
                  <button type="button" class="danger" @click=${()=>this._removeAttachment()}>
                    ${L(H,"expense.attachment_remove")}
                  </button>
                </div>`:a}
          </div>
          ${this._error?i`<p class="error" role="alert">${this._error}</p>`:a}
        </div>
        <footer>
          <button type="button" @click=${()=>this.close()}>${L(H,"common.cancel")}</button>
          <button type="submit" class="primary" ?disabled=${this._busy}>
            ${L(H,"common.save")}
          </button>
        </footer>
      </form>
    </dialog>`}};var i5=["pleins","depenses","depenses_recurrentes","releves","rappels"];function $5(r){return r.normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[^A-Za-z0-9]+/g,"-").replace(/^-|-$/g,"").toLowerCase()||"vehicule"}function o5(r,C){let H=new Blob(["\uFEFF",C],{type:"text/csv;charset=utf-8"}),V=URL.createObjectURL(H),e=document.createElement("a");e.href=V,e.download=r,document.body.append(e),e.click(),e.remove(),setTimeout(()=>URL.revokeObjectURL(V),1e3)}var E1=class extends Z{static{this.properties={hass:{attribute:!1},vehicle:{attribute:!1},_files:{state:!0},_rows:{state:!0},_error:{state:!0}}}static{this.styles=[f,R,b`
      ul {
        list-style: none;
        margin: 0;
        padding: 0;
      }
      li {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 6px 0;
        border-bottom: 1px solid var(--vl-border);
      }
      li:last-child {
        border-bottom: none;
      }
      .main {
        flex: 1;
        display: flex;
        flex-direction: column;
      }
      .sub {
        font-size: 0.875rem;
        color: var(--vl-muted);
      }
    `]}constructor(){super(),this._files=null,this._rows={},this._error=""}get _dialog(){return this.renderRoot.querySelector("dialog")}async open(){this._files=null,this._error="",await this.updateComplete,this._dialog.showModal();try{let C=await V5(this.hass,this.vehicle.id);this._rows=C.rows,this._files=C.files}catch(C){this._error=L(this.hass,"common.error",{message:C.message})}}close(){this._dialog?.close()}_fileName(C){return`carbu-${$5(this.vehicle.name)}-${C.replace(/\.csv$/,"")}-${z()}.csv`}_names(){let C=this._files??{};return Object.keys(C).sort((H,V)=>i5.indexOf(H.replace(/\.csv$/,""))-i5.indexOf(V.replace(/\.csv$/,"")))}_all(){let C=this._files??{};this._names().filter(V=>(this._rows[V]??0)>0).forEach((V,e)=>setTimeout(()=>o5(this._fileName(V),C[V]),e*300))}render(){if(!this.vehicle)return a;let C=this.hass,H=this._files;return i`<dialog aria-labelledby="export-title">
      <header>
        <h2 id="export-title">${L(C,"export.title")} · ${this.vehicle.name}</h2>
        <button
          type="button"
          class="icon"
          aria-label=${L(C,"common.close")}
          @click=${()=>this.close()}
        >
          ${u(D)}
        </button>
      </header>
      <div class="body">
        <p class="help">${L(C,"export.help")}</p>
        ${this._error?i`<p class="error" role="alert">${this._error}</p>`:a}
        ${H?i`<ul>
              ${this._names().map(V=>{let e=V.replace(/\.csv$/,""),M=this._rows[V]??0,t=L(C,`export.file_${e}`);return i`<li>
                  <div class="main">
                    <span>${t}</span>
                    <span class="sub">${L(C,"export.lines",{count:s(C,M,0)})}</span>
                  </div>
                  <button
                    ?disabled=${M===0}
                    aria-label="${L(C,"export.download")} : ${t}"
                    @click=${()=>o5(this._fileName(V),H[V])}
                  >
                    ${u(a1)} ${L(C,"export.download")}
                  </button>
                </li>`})}
            </ul>`:this._error?a:i`<p>${L(C,"common.loading")}</p>`}
      </div>
      <footer>
        <button type="button" @click=${()=>this.close()}>${L(C,"common.close")}</button>
        <button type="button" class="primary" ?disabled=${!H} @click=${()=>this._all()}>
          ${u(a1)} ${L(C,"export.download_all")}
        </button>
      </footer>
    </dialog>`}};function a5(r,C,H,V,e){let M=C.details,t=(o,A)=>typeof M[o]=="number"?s(r,M[o],A):String(M[o]??""),d=`warning.${C.code}`;return L(r,d,{previous:t("previous",0),next:t("next",0),value:t("value",2),min:t("min",1),max:t("max",1),capacity:t("capacity",1),expected:typeof M.expected=="number"?h(r,M.expected,e):"",unit:H.units.distance,volume:H.units.volume[V]??"L",consumption:H.units.consumption[V]??""})}var A5=["volume","unit_price","total_cost"],T5={volume:2,unit_price:3,total_cost:2},D1=class extends Z{static{this.properties={hass:{attribute:!1},vehicle:{attribute:!1},currency:{type:String},_values:{state:!0},_edits:{state:!0},_warnings:{state:!0},_error:{state:!0},_busy:{state:!0},_entry:{state:!0}}}static{this.styles=[f,R]}constructor(){super(),this.currency="EUR",this._values={},this._edits=[],this._warnings=[],this._error="",this._busy=!1,this._entry=null}get _dialog(){return this.renderRoot.querySelector("dialog")}async open(C=null){if(this._entry=C,this._warnings=[],this._error="",C)this._values={odometer:F(this.hass,C.odometer,1),volume:F(this.hass,C.volume,2),unit_price:F(this.hass,C.unit_price,3),total_cost:F(this.hass,C.total_cost,2),date:C.date,time:C.time??"",fuel_type:C.fuel_type,grade:C.grade??"",full_tank:C.full_tank?"1":"",station:C.station??"",notes:C.notes},this._edits=["volume","total_cost"];else{this._values={full_tank:"1",fuel_type:this.vehicle.fuel_types[0]},this._edits=[];try{let V=await D2(this.hass,this.vehicle.id),e=V.unit_price[V.fuel_type];this._values={...this._values,odometer:V.odometer!==null?String(d2(V.odometer,0)):"",fuel_type:V.fuel_type,grade:V.grade??"",date:V.date,time:V.time,unit_price:e!==null?F(this.hass,e,3):""},e!==null&&(this._edits=["unit_price"])}catch(V){this._error=V.message}}await this.updateComplete,this._dialog.showModal();let H=this.renderRoot.querySelector("#odometer");H?.focus(),H?.select()}close(){this._dialog?.close()}willUpdate(C){C.has("vehicle")&&this.vehicle&&!this._values.fuel_type&&(this._values={...this._values,fuel_type:this.vehicle.fuel_types[0]})}_derivedField(){let C=this._edits.slice(-2);return C.length<2?null:A5.find(H=>!C.includes(H))??null}_onAmountInput(C,H){let V=this._edits.filter(t=>t!==C);V.push(C),this._edits=V;let e={...this._values,[C]:H},M=this._derivedField();if(M){let t=T(e.volume??""),d=T(e.unit_price??""),o=T(e.total_cost??""),A=null;M==="total_cost"&&t!==null&&d!==null&&(A=t*d),M==="unit_price"&&t&&o!==null&&(A=o/t),M==="volume"&&d&&o!==null&&(A=o/d),e[M]=A!==null?F(this.hass,A,T5[M]):""}this._values=e,this._warnings=[]}_set(C,H){this._values={...this._values,[C]:H},this._warnings=[]}async _submit(C=!1){this._error="";let H=this._edits.slice(-2),V=T(this._values.odometer??"");if(V===null){this._error=L(this.hass,"fuel.odometer",{unit:this.vehicle.units.distance});return}let e={odometer:V,full_tank:!!this._values.full_tank,fuel_type:this._values.fuel_type,grade:this._values.fuel_type==="gasoline"&&this._values.grade||null,station:this._values.station||null,notes:this._values.notes??"",confirm:C};for(let M of H){let t=T(this._values[M]??"");t!==null&&(e[M]=t)}if(A5.filter(M=>M in e).length<2){this._error=L(this.hass,"fuel.need_two");return}this._values.date&&(e.date=this._values.date),this._values.time?e.time=this._values.time:this._values.date&&(e.time=null),this._entry&&(e.entry_id=this._entry.id),this._busy=!0;try{let M=await W2(this.hass,this.vehicle.id,e);if(!M.saved){this._warnings=M.warnings;return}this.close(),this.dispatchEvent(new CustomEvent("saved",{bubbles:!0,composed:!0}))}catch(M){this._error=L(this.hass,"common.error",{message:M.message})}finally{this._busy=!1}}_amountInput(C,H){let V=this._derivedField()===C;return i`<div class="field">
      <label for=${C}>${H}</label>
      <input
        id=${C}
        name=${C}
        inputmode="decimal"
        autocomplete="off"
        aria-describedby=${V?`${C}-hint`:a}
        class=${V?"computed":""}
        .value=${this._values[C]??""}
        @input=${e=>this._onAmountInput(C,e.target.value)}
      />
      ${V?i`<span class="hint" id="${C}-hint">${L(this.hass,"fuel.computed")}</span>`:a}
    </div>`}render(){if(!this.vehicle)return a;let C=this.hass,H=this._values.fuel_type??this.vehicle.fuel_types[0],V=this.vehicle.units.volume[H]??"L",e=L(C,this._entry?"fuel.title_edit":"fuel.title_new");return i`<dialog aria-labelledby="fuel-title" @close=${()=>this._warnings=[]}>
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
            ${u(D)}
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
            ${H==="gasoline"?i`<div class="field">
                  <label for="grade">${L(C,"fuel.grade")}</label>
                  <select
                    id="grade"
                    .value=${this._values.grade??""}
                    @change=${M=>this._set("grade",M.target.value)}
                  >
                    <option value="" ?selected=${!this._values.grade}>
                      ${L(C,"fuel.grade_unknown")}
                    </option>
                    ${e5.map(M=>i`<option value=${M} ?selected=${this._values.grade===M}>
                          ${N(M)}
                        </option>`)}
                  </select>
                </div>`:a}
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
              ${this.vehicle.fuel_types.length>1?i`<div class="field">
                    <label for="fuel_type">${L(C,"fuel.fuel_type")}</label>
                    <select
                      id="fuel_type"
                      .value=${H}
                      @change=${M=>this._set("fuel_type",M.target.value)}
                    >
                      ${this.vehicle.fuel_types.map(M=>i`<option value=${M} ?selected=${M===H}>
                            ${L(C,`fuel_type.${M}`)}
                          </option>`)}
                    </select>
                  </div>`:a}
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
          ${this._warnings.length?i`<div class="warnings" role="alert">
                ${L(C,"fuel.warnings")}
                <ul>
                  ${this._warnings.map(M=>i`<li>${a5(C,M,this.vehicle,H,this.currency)}</li>`)}
                </ul>
              </div>`:a}
          ${this._error?i`<p class="error" role="alert">${this._error}</p>`:a}
        </div>
        <footer>
          <button type="button" @click=${()=>this.close()}>${L(C,"common.cancel")}</button>
          ${this._warnings.length?i`<button
                type="button"
                class="primary"
                ?disabled=${this._busy}
                @click=${()=>this._submit(!0)}
              >
                ${L(C,"fuel.save_anyway")}
              </button>`:i`<button type="submit" class="primary" ?disabled=${this._busy}>
                ${L(C,"common.save")}
              </button>`}
        </footer>
      </form>
    </dialog>`}};var N1=class extends Z{constructor(){super();this._file=null;this.categories=[],this.currency="EUR",this._preview=null,this._message="",this._error="",this._busy=!1}static{this.properties={hass:{attribute:!1},vehicle:{attribute:!1},categories:{attribute:!1},currency:{type:String},_preview:{state:!0},_message:{state:!0},_error:{state:!0},_busy:{state:!0}}}static{this.styles=[f,R,b`
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
    `]}get _dialog(){return this.renderRoot.querySelector("dialog")}async open(){this._preview=null,this._message="",this._error="",this._file=null,await this.updateComplete;let H=this.renderRoot.querySelector("#file");H&&(H.value=""),this._dialog.showModal(),H?.focus()}close(){this._dialog?.close()}_errorText(H){return["unknown_format","empty","too_large","too_many_rows"].includes(H)?L(this.hass,`import.error_${H}`):L(this.hass,"common.error",{message:H})}async _analyse(H){if(this._file=H,this._preview=null,this._message="",this._error="",!!H){this._busy=!0;try{this._preview=await A2(this.hass,this.vehicle.id,H,!1)}catch(V){this._error=this._errorText(V.message)}finally{this._busy=!1}}}async _apply(){if(this._file){this._busy=!0;try{let H=await A2(this.hass,this.vehicle.id,this._file,!0);this._message=L(this.hass,"import.done",{count:H.added}),this._preview=null,this.dispatchEvent(new CustomEvent("saved",{bubbles:!0,composed:!0}))}catch(H){this._error=this._errorText(H.message)}finally{this._busy=!1}}}_describe(H,V){let e=this.hass,M=this.vehicle.units.distance,t=typeof V.date=="string"?S(e,V.date):"";if(H==="fuel"){let o=String(V.fuel_type??this.vehicle.fuel_types[0]),A=this.vehicle.units.volume[o]??"L";return`${t} \xB7 ${s(e,V.odometer,0)} ${M} \xB7 ${s(e,V.volume,2)} ${A} \xB7 ${h(e,V.total_cost,this.currency)}`}if(H==="expenses"){let A=this.categories.find(c=>c.id===V.category_id)?.label??"";return`${t} \xB7 ${h(e,V.amount,this.currency)}${A?` \xB7 ${A}`:""}${V.description?` \xB7 ${String(V.description)}`:""}`}if(H==="odometer")return`${t} \xB7 ${s(e,V.odometer,0)} ${M}`;let d=[typeof V.due_date=="string"?S(e,V.due_date):"",typeof V.due_odometer=="number"?`${s(e,V.due_odometer,0)} ${M}`:""].filter(Boolean);return[String(V.label??""),...d].join(" \xB7 ")}_renderPreview(H){let V=this.hass,e=L(V,`import.kind_${H.kind}`);return i`
      <p aria-live="polite">${L(V,"import.summary",{kind:e,...H.counts})}</p>
      ${H.new_categories.length?i`<p>${L(V,"import.new_categories",{names:H.new_categories.join(", ")})}</p>`:a}
      ${H.lines.length?i`<ul class="lines">
            ${H.lines.map(M=>i`<li>
                <span class="status ${M.status}">
                  ${L(V,`import.status_${M.status}`)}
                </span>
                <span class="detail">
                  <span class="line-number">${L(V,"import.line",{line:M.line})}</span>
                  —
                  ${M.status==="error"?M.message:M.values?this._describe(H.kind,M.values):""}
                </span>
              </li>`)}
          </ul>`:a}
      ${H.truncated?i`<p class="muted">${L(V,"import.truncated")}</p>`:a}
    `}render(){if(!this.vehicle)return a;let H=this.hass,V=this._preview?.counts.new??0;return i`<dialog aria-labelledby="import-title">
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
            ${u(D)}
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
          ${this._busy&&!this._preview?i`<p aria-live="polite">${L(H,"import.analyzing")}</p>`:a}
          ${this._preview?this._renderPreview(this._preview):a}
          ${this._message?i`<p role="status">${this._message}</p>`:a}
          ${this._error?i`<p class="error" role="alert">${this._error}</p>`:a}
        </div>
        <footer>
          <button type="button" @click=${()=>this.close()}>
            ${L(H,this._message?"common.close":"common.cancel")}
          </button>
          ${this._preview?i`<button type="submit" class="primary" ?disabled=${this._busy||!V}>
                ${L(H,"import.confirm",{count:V})}
              </button>`:a}
        </footer>
      </form>
    </dialog>`}};var v2=220,q={top:12,right:12,bottom:28,left:80};function F5(r){let C=10**Math.floor(Math.log10(r)),H=r/C;return(H<=1?1:H<=2?2:H<=2.5?2.5:H<=5?5:10)*C}function x2(r){let[C,H,V]=r.split("-").map(Number);return Date.UTC(C,H-1,V)/864e5}var W1=class extends Z{static{this.properties={hass:{attribute:!1},series:{attribute:!1},format:{attribute:!1},name:{type:String},zeroBased:{type:Boolean,attribute:"zero-based"},_width:{state:!0}}}static{this.styles=H1.styles}constructor(){super(),this.series=[],this.format=C=>String(C),this.name="",this.zeroBased=!1,this._width=600}connectedCallback(){super.connectedCallback(),this._observer=new ResizeObserver(([C])=>{let H=Math.round(C.contentRect.width);H>0&&Math.abs(H-this._width)>2&&(this._width=H)}),this._observer.observe(this)}disconnectedCallback(){super.disconnectedCallback(),this._observer?.disconnect()}render(){let C=this.hass,H=this.series.filter(v=>v.points.length),V=[...new Set(H.flatMap(v=>v.points.map(y=>y.date)))].sort();if(V.length<2)return i`<p class="empty">${L(C,"stats.line_empty")}</p>`;let e=this._width,M=H.flatMap(v=>v.points.map(y=>y.value)),t=this.zeroBased?0:Math.min(...M),d=Math.max(...M),o=Math.max((d-t)*.1,Math.abs(d)*.01,1e-6);this.zeroBased||(t=Math.max(0,t-o)),d+=o;let A=F5((d-t)/3);t=Math.floor(t/A)*A,d=Math.ceil(d/A)*A;let c=[];for(let v=t;v<=d+A/2;v+=A)c.push(v);let l=e-q.left-q.right,g=v2-q.top-q.bottom,O=x2(V[0]),w=Math.max(1,x2(V[V.length-1])-O),P=v=>q.left+(x2(v)-O)/w*l,x=v=>q.top+g-(v-t)/(d-t)*g,p=Z1(C,V,v=>P(V[v]),l),B=L(C,"stats.line_summary",{name:this.name,count:V.length,start:S(C,V[0]),end:S(C,V[V.length-1])}),m=V.length<=40;return i`
      <svg class="chart" viewBox="0 0 ${e} ${v2}" role="img" aria-label=${B}>
        ${c.map(v=>$`<line class="grid" x1=${q.left} x2=${e-q.right} y1=${x(v)} y2=${x(v)}></line>
            <text class="axis" x=${q.left-6} y=${x(v)+4} text-anchor="end">${this.format(v)}</text>`)}
        ${H.map(v=>$`<path
              d=${v.points.map((y,Q)=>`${Q?"L":"M"}${P(y.date)},${x(y.value)}`).join(" ")}
              fill="none" stroke=${v.color} stroke-width="2" stroke-linejoin="round"></path>
            ${v.points.map(y=>$`<circle cx=${P(y.date)} cy=${x(y.value)} r=${m?3:0}
                fill=${v.color} stroke="var(--card-background-color, #fff)" stroke-width="1">
                <title>${S(C,y.date)} · ${v.label} : ${this.format(y.value)}</title>
              </circle>`)}`)}
        ${p.map(v=>$`<text class="axis" x=${v.x} y=${v2-8} text-anchor=${v.anchor}>${v.text}</text>`)}
      </svg>
      ${H.length>1?i`<ul class="legend">
            ${H.map(v=>i`<li>
                <svg width="18" height="14" aria-hidden="true" style="height:14px">
                  <line x1="1" x2="17" y1="7" y2="7" stroke=${v.color} stroke-width="3"></line>
                </svg>
                ${v.label}
              </li>`)}
          </ul>`:a}
      <div class="visually-hidden">
        <table>
          <caption>${B}</caption>
          <thead>
            <tr>
              <th scope="col">${L(C,"fuel.date")}</th>
              ${H.map(v=>i`<th scope="col">${v.label}</th>`)}
            </tr>
          </thead>
          <tbody>
            ${V.map(v=>i`<tr>
                <th scope="row">${S(C,v)}</th>
                ${H.map(y=>{let Q=y.points.find(n=>n.date===v);return i`<td>${Q?this.format(Q.value):"\u2014"}</td>`})}
              </tr>`)}
          </tbody>
        </table>
      </div>
    `}};var R5="#2e7d32",I1=["#1e88e5","#8e24aa","#00897b","#f4511e","#3949ab","#e53935"],S1=220,G={top:12,right:8,bottom:28,left:56};function E5(r){if(r<=0)return 1;let C=10**Math.floor(Math.log10(r));return([1,2,2.5,5,10].find(V=>V*C>=r)??10)*C}var U1=class extends Z{static{this.properties={hass:{attribute:!1},data:{attribute:!1},categories:{attribute:!1},currency:{type:String},_width:{state:!0}}}static{this.styles=[f,b`
      :host {
        display: block;
        position: relative;
      }
      svg.chart {
        width: 100%;
        height: ${S1}px;
        display: block;
        overflow: visible;
      }
      .axis {
        fill: var(--vl-muted);
        font-size: 12px;
      }
      .grid {
        stroke: var(--vl-border);
        stroke-width: 1;
      }
      g.bar:hover rect.hit {
        fill: var(--primary-color);
        fill-opacity: 0.08;
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
      .swatch {
        width: 12px;
        height: 12px;
        border-radius: 3px;
        display: inline-block;
        flex: none;
      }
    `]}constructor(){super(),this.data=[],this.categories=[],this.currency="EUR",this._width=600}connectedCallback(){super.connectedCallback(),this._observer=new ResizeObserver(([C])=>{let H=Math.round(C.contentRect.width);H>0&&Math.abs(H-this._width)>2&&(this._width=H)}),this._observer.observe(this)}disconnectedCallback(){super.disconnectedCallback(),this._observer?.disconnect()}_series(){let C=new Set(this.data.flatMap(e=>Object.keys(e.values))),H=[];C.has("fuel")&&H.push({id:"fuel",label:L(this.hass,"category.fuel"),color:R5});let V=0;for(let e of this.categories)C.has(e.id)&&H.push({id:e.id,label:e.label,color:e.color??I1[V++%I1.length]});for(let e of C)H.some(M=>M.id===e)||H.push({id:e,label:e,color:I1[V++%I1.length]});return H}render(){let C=this.hass,H=this._series(),V=this.data.map(x=>Object.values(x.values).reduce((p,B)=>p+B,0)),e=E5(Math.max(0,...V));if(!V.some(x=>x>0))return i`<p class="empty">${L(C,"chart.empty")}</p>`;let M=this._width,t=M-G.left-G.right,d=S1-G.top-G.bottom,o=t/this.data.length,A=Math.min(36,o*.7),c=o<34?2:1,l=x=>G.top+d-x/e*d,g=[0,.25,.5,.75,1].map(x=>x*e),O=x=>h(C,x,this.currency),w=x=>h(C,x,this.currency,0),P=L(C,"chart.summary",{count:this.data.length});return i`
      <svg
        class="chart"
        viewBox="0 0 ${M} ${S1}"
        height=${S1}
        role="img"
        aria-label=${P}
      >
        ${g.map(x=>$`
            <line class="grid" x1=${G.left} x2=${M-G.right} y1=${l(x)} y2=${l(x)}></line>
            <text class="axis" x=${G.left-6} y=${l(x)+4} text-anchor="end">${w(x)}</text>`)}
        ${this.data.map((x,p)=>{let B=G.left+p*o+(o-A)/2,m=0,v=[`${x1(C,x.month)} \u2014 ${L(C,"chart.total")} ${O(V[p])}`,...H.filter(y=>x.values[y.id]).map(y=>`${y.label} : ${O(x.values[y.id])}`)].join(`
`);return $`<g class="bar">
            <title>${v}</title>
            <rect class="hit" x=${G.left+p*o} y=${G.top} width=${o} height=${d} fill="transparent"></rect>
            ${H.map(y=>{let Q=x.values[y.id]??0;if(Q<=0)return a;let n=l(m+Q),k=l(m)-n;return m+=Q,$`<rect x=${B} y=${n} width=${A} height=${Math.max(k,.5)}
                fill=${y.color} stroke="var(--card-background-color, #fff)" stroke-width="1"></rect>`})}
            ${(this.data.length-1-p)%c===0?$`<text class="axis" x=${B+A/2} y=${S1-8} text-anchor="middle">${L5(C,x.month)}</text>`:a}
          </g>`})}
      </svg>
      <ul class="legend" aria-label=${L(C,"section.monthly")}>
        ${H.map(x=>i`<li>
            <span class="swatch" style="background:${x.color}" aria-hidden="true"></span>${x.label}
          </li>`)}
      </ul>
      <div class="visually-hidden"><table>
        <caption>${P}</caption>
        <thead>
          <tr>
            <th scope="col">${L(C,"chart.month")}</th>
            ${H.map(x=>i`<th scope="col">${x.label}</th>`)}
            <th scope="col">${L(C,"chart.total")}</th>
          </tr>
        </thead>
        <tbody>
          ${this.data.map((x,p)=>i`<tr>
              <th scope="row">${x1(C,x.month)}</th>
              ${H.map(B=>i`<td>${O(x.values[B.id]??0)}</td>`)}
              <td>${O(V[p])}</td>
            </tr>`)}
        </tbody>
      </table></div>
    `}};var u2=220,X={top:12,right:12,bottom:28,left:52},D5="#78909c",d5={e10:"#43a047",sp95:"#1e88e5",sp98:"#8e24aa",none:"#757575"},G1=class extends Z{static{this.properties={hass:{attribute:!1},points:{attribute:!1},currency:{type:String},unit:{type:String},_width:{state:!0}}}static{this.styles=H1.styles}constructor(){super(),this.points=[],this.currency="EUR",this.unit="L",this._width=600}connectedCallback(){super.connectedCallback(),this._observer=new ResizeObserver(([C])=>{let H=Math.round(C.contentRect.width);H>0&&Math.abs(H-this._width)>2&&(this._width=H)}),this._observer.observe(this)}disconnectedCallback(){super.disconnectedCallback(),this._observer?.disconnect()}render(){let C=this.hass,H=this.points;if(!H.length)return i`<p class="empty">${L(C,"stats.price_empty")}</p>`;let V=this._width,e=H.map(m=>m.value),M=Math.min(...e),t=Math.max(...e),d=Math.max((t-M)*.15,.02);M=Math.max(0,M-d),t+=d;let o=V-X.left-X.right,A=u2-X.top-X.bottom,c=m=>X.left+(H.length===1?o/2:m/(H.length-1)*o),l=m=>X.top+A-(m-M)/(t-M)*A,g=[0,.5,1].map(m=>M+m*(t-M)),O=H.map((m,v)=>`${v?"L":"M"}${c(v)},${l(m.value)}`).join(" "),w=Z1(C,H.map(m=>m.date),c,o),P=[...new Set(H.map(m=>m.grade??"none"))],x=m=>m==="none"?L(C,"stats.grade_unknown"):N(m),p=m=>`${h(C,m,this.currency,3)}/${this.unit}`,B=L(C,"stats.price_summary",{count:H.length,start:S(C,H[0].date),end:S(C,H[H.length-1].date)});return i`
      <svg class="chart" viewBox="0 0 ${V} ${u2}" role="img" aria-label=${B}>
        ${g.map(m=>$`<line class="grid" x1=${X.left} x2=${V-X.right} y1=${l(m)} y2=${l(m)}></line>
            <text class="axis" x=${X.left-6} y=${l(m)+4} text-anchor="end">${h(C,m,this.currency,2)}</text>`)}
        <path d=${O} fill="none" stroke=${D5} stroke-width="1.5" stroke-linejoin="round"></path>
        ${H.map((m,v)=>$`<circle cx=${c(v)} cy=${l(m.value)} r="4"
              fill=${d5[m.grade??"none"]}
              stroke="var(--card-background-color, #fff)" stroke-width="1.5">
              <title>${S(C,m.date)} : ${p(m.value)}${m.grade?` (${N(m.grade)})`:""}</title>
            </circle>`)}
        ${w.map(m=>$`<text class="axis" x=${m.x} y=${u2-8} text-anchor=${m.anchor}>${m.text}</text>`)}
      </svg>
      <ul class="legend">
        ${P.map(m=>i`<li>
            <svg width="14" height="14" aria-hidden="true" style="height:14px">
              <circle cx="7" cy="7" r="5" fill=${d5[m]}></circle>
            </svg>
            ${x(m)}
          </li>`)}
      </ul>
      <div class="visually-hidden">
        <table>
          <caption>${B}</caption>
          <thead>
            <tr>
              <th scope="col">${L(C,"fuel.date")}</th>
              <th scope="col">${L(C,"stats.price_point")}</th>
              <th scope="col">${L(C,"fuel.grade")}</th>
            </tr>
          </thead>
          <tbody>
            ${H.map(m=>i`<tr>
                <th scope="row">${S(C,m.date)}</th>
                <td>${p(m.value)}</td>
                <td>${m.grade?N(m.grade):"\u2014"}</td>
              </tr>`)}
          </tbody>
        </table>
      </div>
    `}};var N5=[1,2,3,6,12],Q1=class extends Z{static{this.properties={hass:{attribute:!1},vehicle:{attribute:!1},categories:{attribute:!1},currency:{type:String},_values:{state:!0},_error:{state:!0},_busy:{state:!0},_entry:{state:!0}}}static{this.styles=[f,R]}constructor(){super(),this.categories=[],this.currency="EUR",this._values={},this._error="",this._busy=!1,this._entry=null}get _dialog(){return this.renderRoot.querySelector("dialog")}async open(C=null){this._entry=C,this._error="",this._values=C?{label:C.label,amount:F(this.hass,C.amount,2),category_id:C.category_id,interval_months:String(C.interval_months),start_date:C.start_date,end_date:C.end_date??"",active:C.active?"1":""}:{category_id:"insurance",interval_months:"1",start_date:z(),active:"1"},this.categories.some(H=>H.id===this._values.category_id)||(this._values={...this._values,category_id:this.categories[0]?.id??"other"}),await this.updateComplete,this._dialog.showModal(),this.renderRoot.querySelector("#label")?.focus()}close(){this._dialog?.close()}_set(C,H){this._values={...this._values,[C]:H}}async _submit(){this._error="";let C=T(this._values.amount??"");if(C===null||C<=0){this._error=L(this.hass,"expense.amount",{currency:this.currency});return}let H={label:(this._values.label??"").trim(),amount:C,category_id:this._values.category_id,interval_months:Number(this._values.interval_months||1),start_date:this._values.start_date||z(),end_date:this._values.end_date||null,active:!!this._values.active};this._entry&&(H.recurring_id=this._entry.id),this._busy=!0;try{await C5(this.hass,this.vehicle.id,H),this.close(),this.dispatchEvent(new CustomEvent("saved",{bubbles:!0,composed:!0}))}catch(V){this._error=L(this.hass,"common.error",{message:V.message})}finally{this._busy=!1}}render(){if(!this.vehicle)return a;let C=this.hass,H=this._values,V=L(C,this._entry?"recurring.title_edit":"recurring.title_new"),e=M=>t=>this._set(M,t.target.value);return i`<dialog aria-labelledby="recurring-title">
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
            ${u(D)}
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
                ${N5.map(M=>i`<option value=${M} ?selected=${String(M)===H.interval_months}>
                      ${L(C,`recurring.interval_${M}`)}
                    </option>`)}
              </select>
            </div>
            <div class="field">
              <label for="category">${L(C,"expense.category")}</label>
              <select id="category" @change=${e("category_id")}>
                ${this.categories.map(M=>i`<option value=${M.id} ?selected=${M.id===H.category_id}>
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
                min=${H.start_date??a}
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
          ${this._error?i`<p class="error" role="alert">${this._error}</p>`:a}
        </div>
        <footer>
          <button type="button" @click=${()=>this.close()}>${L(C,"common.cancel")}</button>
          <button type="submit" class="primary" ?disabled=${this._busy}>
            ${L(C,"common.save")}
          </button>
        </footer>
      </form>
    </dialog>`}};var z1=class extends Z{static{this.properties={hass:{attribute:!1},vehicle:{attribute:!1},categories:{attribute:!1},currency:{type:String},_items:{state:!0}}}static{this.styles=[f,b`
      ul {
        list-style: none;
        margin: 0;
        padding: 0;
      }
      li {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 6px 0;
        border-bottom: 1px solid var(--vl-border);
      }
      li:last-child {
        border-bottom: none;
      }
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
    `]}constructor(){super(),this.categories=[],this.currency="EUR",this._items=[]}async reload(){this.vehicle&&(this._items=await J2(this.hass,this.vehicle.id))}updated(C){C.has("vehicle")&&this.vehicle&&this.reload()}openEditor(C=null){this.renderRoot.querySelector("vl-recurring-dialog").open(C)}_changed(){this.reload(),this.dispatchEvent(new CustomEvent("saved",{bubbles:!0,composed:!0}))}async _delete(C){await this.renderRoot.querySelector("vl-confirm-dialog").ask(L(this.hass,"recurring.delete_confirm",{label:C.label}))&&(await H5(this.hass,this.vehicle.id,C.id),await this.reload())}_status(C){let H=this.hass,V=L(H,`recurring.interval_${C.interval_months}`);return C.active?C.next_date?`${V} \xB7 ${L(H,"recurring.next",{date:S(H,C.next_date)})}`:`${V} \xB7 ${L(H,"recurring.ended")}`:`${V} \xB7 ${L(H,"recurring.paused")}`}render(){if(!this.vehicle)return a;let C=this.hass,H=this._items.filter(e=>e.active&&e.next_date),V=H.reduce((e,M)=>e+M.monthly_amount,0);return i`
      ${this._items.length?i`<ul>
              ${this._items.map(e=>{let M=this.categories.find(d=>d.id===e.category_id),t=e.active&&e.next_date!==null;return i`<li class=${t?"":"off"}>
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
                    <span>${h(C,e.amount,this.currency)}</span>
                    ${e.interval_months>1?i`<span class="sub">
                          ${L(C,"recurring.per_month",{amount:h(C,e.monthly_amount,this.currency)})}
                        </span>`:a}
                  </span>
                  <span class="actions">
                    <button
                      class="icon"
                      aria-label="${L(C,"common.edit")} : ${e.label}"
                      @click=${()=>this.openEditor(e)}
                    >
                      ${u(I)}
                    </button>
                    <button
                      class="icon"
                      aria-label="${L(C,"common.delete")} : ${e.label}"
                      @click=${()=>this._delete(e)}
                    >
                      ${u(W)}
                    </button>
                  </span>
                </li>`})}
            </ul>
            ${H.length>1?i`<p class="total">
                  ${L(C,"recurring.total_month",{amount:h(C,V,this.currency)})}
                </p>`:a}`:i`<p class="empty">${L(C,"recurring.none")}</p>`}
      <vl-recurring-dialog
        .hass=${C}
        .vehicle=${this.vehicle}
        .categories=${this.categories}
        .currency=${this.currency}
        @saved=${e=>{e.stopPropagation(),this._changed()}}
      ></vl-recurring-dialog>
      <vl-confirm-dialog .hass=${C}></vl-confirm-dialog>
    `}};var W5=["due_odometer","alert_days","alert_distance","interval_days","interval_distance"],j1=class extends Z{static{this.properties={hass:{attribute:!1},vehicle:{attribute:!1},_values:{state:!0},_error:{state:!0},_busy:{state:!0},_entry:{state:!0}}}static{this.styles=[f,R,b`
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
    `]}constructor(){super(),this._values={},this._error="",this._busy=!1,this._entry=null}get _dialog(){return this.renderRoot.querySelector("dialog")}async open(C=null){this._entry=C,this._error="";let H=(V,e=0)=>V===null?"":F(this.hass,V,e);this._values=C?{label:C.label,kind:C.kind,due_date:C.due_date??"",due_odometer:H(C.due_odometer),alert_days:H(C.alert_days),alert_distance:H(C.alert_distance),interval_days:H(C.interval_days),interval_distance:H(C.interval_distance)}:{kind:"both",due_date:z(365),alert_days:"30",alert_distance:"1000"},await this.updateComplete,this._dialog.showModal(),this.renderRoot.querySelector("#label")?.focus()}close(){this._dialog?.close()}_set(C,H){this._values={...this._values,[C]:H}}async _submit(){this._error="";let C={label:this._values.label??"",kind:this._values.kind,due_date:this._values.due_date||null};for(let H of W5)C[H]=T(this._values[H]??"");this._entry&&(C.reminder_id=this._entry.id),this._busy=!0;try{await K2(this.hass,this.vehicle.id,C),this.close(),this.dispatchEvent(new CustomEvent("saved",{bubbles:!0,composed:!0}))}catch(H){this._error=L(this.hass,"common.error",{message:H.message})}finally{this._busy=!1}}_number(C,H,V){return i`<div class="field">
      <label for=${C}>${H}</label>
      <input
        id=${C}
        inputmode="decimal"
        autocomplete="off"
        aria-describedby=${V?`${C}-hint`:a}
        .value=${this._values[C]??""}
        @input=${e=>this._set(C,e.target.value)}
      />
      ${V?i`<span class="hint" id="${C}-hint">${V}</span>`:a}
    </div>`}render(){if(!this.vehicle)return a;let C=this.hass,H=this.vehicle.units.distance,V=this._values.kind??"both",e=V!=="distance",M=V!=="date",t=L(C,this._entry?"reminder.title_edit":"reminder.title_new"),d=[["date",L(C,"reminder.kind_date")],["distance",L(C,"reminder.kind_distance")],["both",L(C,"reminder.kind_both")]];return i`<dialog aria-labelledby="reminder-title">
      <form
        method="dialog"
        @submit=${o=>{o.preventDefault(),this._submit()}}
      >
        <header>
          <h2 id="reminder-title">${t} · ${this.vehicle.name}</h2>
          <button
            type="button"
            class="icon"
            aria-label=${L(C,"common.close")}
            @click=${()=>this.close()}
          >
            ${u(D)}
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
              @input=${o=>this._set("label",o.target.value)}
            />
          </div>
          <div class="field">
            <label for="kind">${L(C,"reminder.kind")}</label>
            <select
              id="kind"
              @change=${o=>this._set("kind",o.target.value)}
            >
              ${d.map(([o,A])=>i`<option value=${o} ?selected=${o===V}>${A}</option>`)}
            </select>
          </div>
          ${e?i`<fieldset>
                <legend>${L(C,"reminder.kind_date")}</legend>
                <div class="grid">
                  <div class="field">
                    <label for="due_date">${L(C,"reminder.due_date")}</label>
                    <input
                      id="due_date"
                      type="date"
                      required
                      .value=${this._values.due_date??""}
                      @change=${o=>this._set("due_date",o.target.value)}
                    />
                  </div>
                  ${this._number("alert_days",L(C,"reminder.alert_days"))}
                  ${this._number("interval_days",L(C,"reminder.interval_days"),L(C,"reminder.recurrence_hint"))}
                </div>
              </fieldset>`:a}
          ${M?i`<fieldset>
                <legend>${L(C,"reminder.kind_distance")}</legend>
                <div class="grid">
                  ${this._number("due_odometer",L(C,"reminder.due_odometer",{unit:H}))}
                  ${this._number("alert_distance",L(C,"reminder.alert_distance",{unit:H}))}
                  ${this._number("interval_distance",L(C,"reminder.interval_distance",{unit:H}),L(C,"reminder.recurrence_hint"))}
                </div>
              </fieldset>`:a}
          ${this._error?i`<p class="error" role="alert">${this._error}</p>`:a}
        </div>
        <footer>
          <button type="button" @click=${()=>this.close()}>${L(C,"common.cancel")}</button>
          <button type="submit" class="primary" ?disabled=${this._busy}>
            ${L(C,"common.save")}
          </button>
        </footer>
      </form>
    </dialog>`}};var n5={due:0,alert:1,ok:2,inactive:3},K1=class extends Z{static{this.properties={hass:{attribute:!1},vehicle:{attribute:!1},_items:{state:!0}}}static{this.styles=[f,b`
      ul {
        list-style: none;
        margin: 0;
        padding: 0;
      }
      li {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 6px 0;
        border-bottom: 1px solid var(--vl-border);
      }
      li:last-child {
        border-bottom: none;
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
    `]}constructor(){super(),this._items=[]}async reload(){this.vehicle&&(this._items=await j2(this.hass,this.vehicle.id))}updated(C){C.has("vehicle")&&this.vehicle&&this.reload()}_confirm(){return this.renderRoot.querySelector("vl-confirm-dialog")}async _done(C){let H=L(this.hass,C.recurring?"reminders.next_recurring":"reminders.next_once");await this._confirm().ask(L(this.hass,"reminders.done_confirm",{label:C.label,next:H}),L(this.hass,"reminders.done"),!1)&&(await X2(this.hass,this.vehicle.id,C.id),await this.reload())}async _delete(C){await this._confirm().ask(L(this.hass,"reminders.delete_confirm",{label:C.label}))&&(await q2(this.hass,this.vehicle.id,C.id),await this.reload())}openEditor(C=null){this.renderRoot.querySelector("vl-reminder-dialog").open(C)}_detail(C){let H=this.hass,V=this.vehicle.units.distance,e=[];if(C.due_date){let t=C.days_left??0,d=t>=0?L(H,"reminders.left_days",{days:t}):L(H,"reminders.late_days",{days:-t});e.push(`${S(H,C.due_date)}${C.active?` (${d})`:""}`)}if(C.due_odometer!==null){let t=`${s(H,C.due_odometer,0)} ${V}`;if(C.active&&C.distance_left!==null){let d=C.distance_left>=0?L(H,"reminders.left_distance",{distance:s(H,C.distance_left,0),unit:V}):L(H,"reminders.late_distance",{distance:s(H,-C.distance_left,0),unit:V});t+=` (${d})`}e.push(t)}let M=[];return C.interval_days&&M.push(`${s(H,C.interval_days,0)} j`),C.interval_distance&&M.push(`${s(H,C.interval_distance,0)} ${V}`),M.length&&e.push(L(H,"reminders.every",{value:M.join(" / ")})),e.join(" \xB7 ")}render(){if(!this.vehicle)return a;let C=this.hass,H=[...this._items].sort((V,e)=>n5[V.state]-n5[e.state]);return i`
      ${H.length?i`<ul>
            ${H.map(V=>i`<li class=${V.state}>
                <span class="state ${V.state}">${L(C,`reminders.state_${V.state}`)}</span>
                <div class="main">
                  <span>${V.label}</span>
                  <span class="sub">${this._detail(V)}</span>
                </div>
                <span class="actions">
                  ${V.active?i`<button
                        class="icon"
                        aria-label=${L(C,"reminders.done_long",{label:V.label})}
                        @click=${()=>this._done(V)}
                      >
                        ${u(p2)}
                      </button>`:a}
                  <button
                    class="icon"
                    aria-label="${L(C,"common.edit")} : ${V.label}"
                    @click=${()=>this.openEditor(V)}
                  >
                    ${u(I)}
                  </button>
                  <button
                    class="icon"
                    aria-label="${L(C,"common.delete")} : ${V.label}"
                    @click=${()=>this._delete(V)}
                  >
                    ${u(W)}
                  </button>
                </span>
              </li>`)}
          </ul>`:i`<p class="empty">${L(C,"reminders.none")}</p>`}
      <vl-reminder-dialog
        .hass=${C}
        .vehicle=${this.vehicle}
        @saved=${()=>this.reload()}
      ></vl-reminder-dialog>
      <vl-confirm-dialog .hass=${C}></vl-confirm-dialog>
    `}};var p5="carbu-panel-vehicle",I5=[{type:"carbu-card",extra:{show_recent:!1}},{type:"carbu-journal-card",extra:{title:"panel.journal",page_size:5}},{type:"carbu-stats-card",extra:{title:"panel.stats"}}];function U5(){try{return window.localStorage.getItem(p5)??void 0}catch{return}}function G5(r){try{window.localStorage.setItem(p5,r)}catch{}}var q1=class extends Z{constructor(){super();this._cards=[];this._started=!1;this.narrow=!1,this._vehicles=[],this._loading=!0,this._error="",this._vehicleId=U5()}static{this.properties={hass:{attribute:!1},narrow:{type:Boolean},_vehicles:{state:!0},_vehicleId:{state:!0},_loading:{state:!0},_error:{state:!0}}}static{this.styles=[f,b`
      :host {
        display: block;
        min-height: 100vh;
        background: var(--primary-background-color);
        color: var(--primary-text-color);
      }
      .toolbar {
        display: flex;
        align-items: center;
        gap: 8px;
        height: var(--header-height, 56px);
        padding: 0 12px;
        box-sizing: border-box;
        background: var(--app-header-background-color, var(--primary-color));
        color: var(--app-header-text-color, var(--text-primary-color, #fff));
        border-bottom: var(--app-header-border-bottom, none);
      }
      .title {
        flex: 1;
        font-size: 20px;
        font-weight: 400;
        margin: 0 0 0 4px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      select {
        max-width: 50%;
        font: inherit;
        padding: 6px 8px;
        border-radius: 6px;
        border: 1px solid currentColor;
        background: transparent;
        color: inherit;
      }
      select option {
        color: var(--primary-text-color);
        background: var(--card-background-color);
      }
      .content {
        display: grid;
        gap: 16px;
        padding: 16px;
        max-width: 1400px;
        margin: 0 auto;
        grid-template-columns: repeat(auto-fit, minmax(min(100%, 420px), 1fr));
        align-items: start;
      }
      .wide {
        grid-column: 1 / -1;
      }
      .message {
        padding: 24px 16px;
        max-width: 640px;
        margin: 0 auto;
      }
      .message a {
        color: var(--primary-color);
      }
    `]}connectedCallback(){super.connectedCallback(),this.hass&&this._start()}disconnectedCallback(){super.disconnectedCallback(),this._started=!1;let H=this._unsubscribe;this._unsubscribe=void 0,H?.then(V=>V()).catch(()=>{})}updated(){this._start();for(let H of this._cards)H.hass=this.hass}_start(){this._started||!this.hass||!this.isConnected||(this._started=!0,this._load(),this._unsubscribe=k1(this.hass,()=>{this._load()}),this._unsubscribe.catch(()=>this._unsubscribe=void 0))}async _load(){try{let H=await o1(this.hass);this._vehicles=H.vehicles,this._error=""}catch(H){this._error=H.code??H.message}finally{this._loading=!1}}get _current(){return this._vehicles.find(H=>H.id===this._vehicleId)??this._vehicles[0]}_cardsFor(H){return this._cardsVehicle!==H&&(this._cards=I5.map(({type:V,extra:e})=>{let M=document.createElement(V),t={type:`custom:${V}`,vehicle_id:H};return"show_recent"in e&&(t.show_recent=e.show_recent),"title"in e&&(t.title=L(this.hass,e.title)),"page_size"in e&&(t.page_size=e.page_size),M.setConfig(t),M.hass=this.hass,V==="carbu-stats-card"&&M.classList.add("wide"),M}),this._cardsVehicle=H),this._cards}_select(H){let V=H.target.value;this._vehicleId=V,G5(V)}_body(){let H=this.hass;if(this._loading)return i`<p class="message">${L(H,"common.loading")}</p>`;if(this._error){let e=this._error==="not_loaded"?L(H,"common.not_loaded"):this._error;return i`<p class="message error" role="alert">${e}</p>`}let V=this._current;return V?i`<div class="content">${this._cardsFor(V.id)}</div>`:i`<p class="message">
        ${L(H,"panel.no_vehicle")}
        <a href="/config/integrations/integration/carbu">${L(H,"panel.open_integration")}</a>
      </p>`}render(){let H=this._current;return i`
      <div class="toolbar">
        <ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>
        <h1 class="title">Carbu</h1>
        ${this._vehicles.length>1?i`<select
              aria-label=${L(this.hass,"panel.vehicle")}
              .value=${H?.id??""}
              @change=${this._select}
            >
              ${this._vehicles.map(V=>i`<option value=${V.id} ?selected=${V.id===H?.id}>${V.name}</option>`)}
            </select>`:a}
      </div>
      ${this._body()}
    `}};var Q5={"carbu-panel":q1,"carbu-card":w1,"carbu-journal-card":B1,"carbu-stats-card":$1,"carbu-card-editor":P1,"vl-fuel-dialog":D1,"vl-expense-dialog":R1,"vl-confirm-dialog":T1,"vl-monthly-chart":U1,"vl-consumption-chart":H1,"vl-price-chart":G1,"vl-reminder-dialog":j1,"vl-reminder-list":K1,"vl-import-dialog":N1,"vl-export-dialog":E1,"vl-line-chart":W1,"vl-recurring-dialog":Q1,"vl-recurring-list":z1};for(let[r,C]of Object.entries(Q5))customElements.get(r)||customElements.define(r,C);var A1={language:navigator.language};window.customCards=window.customCards??[];for(let r of[{type:"carbu-card",name:L(A1,"card.name"),description:L(A1,"card.description")},{type:"carbu-journal-card",name:L(A1,"journal.name"),description:L(A1,"journal.description")},{type:"carbu-stats-card",name:L(A1,"stats.name"),description:L(A1,"stats.description")}])window.customCards.some(C=>C.type===r.type)||window.customCards.push({...r,preview:!0});
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
