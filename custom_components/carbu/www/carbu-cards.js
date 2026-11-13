var d1=globalThis,p1=d1.ShadowRoot&&(d1.ShadyCSS===void 0||d1.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,F1=Symbol(),V2=new WeakMap,C1=class{constructor(C,H,V){if(this._$cssResult$=!0,V!==F1)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=C,this.t=H}get styleSheet(){let C=this.o,H=this.t;if(p1&&C===void 0){let V=H!==void 0&&H.length===1;V&&(C=V2.get(H)),C===void 0&&((this.o=C=new CSSStyleSheet).replaceSync(this.cssText),V&&V2.set(H,C))}return C}toString(){return this.cssText}},L2=r=>new C1(typeof r=="string"?r:r+"",void 0,F1),u=(r,...C)=>{let H=r.length===1?r[0]:C.reduce((V,L,e)=>V+(i=>{if(i._$cssResult$===!0)return i.cssText;if(typeof i=="number")return i;throw Error("Value passed to 'css' function must be a 'css' function result: "+i+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(L)+r[e+1],r[0]);return new C1(H,r,F1)},M2=(r,C)=>{if(p1)r.adoptedStyleSheets=C.map(H=>H instanceof CSSStyleSheet?H:H.styleSheet);else for(let H of C){let V=document.createElement("style"),L=d1.litNonce;L!==void 0&&V.setAttribute("nonce",L),V.textContent=H.cssText,r.appendChild(V)}},R1=p1?r=>r:r=>r instanceof CSSStyleSheet?(C=>{let H="";for(let V of C.cssRules)H+=V.cssText;return L2(H)})(r):r;var{is:U2,defineProperty:Q2,getOwnPropertyDescriptor:G2,getOwnPropertyNames:z2,getOwnPropertySymbols:K2,getPrototypeOf:j2}=Object,m1=globalThis,e2=m1.trustedTypes,q2=e2?e2.emptyScript:"",X2=m1.reactiveElementPolyfillSupport,H1=(r,C)=>r,$1={toAttribute(r,C){switch(C){case Boolean:r=r?q2:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,C){let H=r;switch(C){case Boolean:H=r!==null;break;case Number:H=r===null?null:Number(r);break;case Object:case Array:try{H=JSON.parse(r)}catch{H=null}}return H}},t2=(r,C)=>!U2(r,C),r2={attribute:!0,type:String,converter:$1,reflect:!1,useDefault:!1,hasChanged:t2};Symbol.metadata??=Symbol("metadata"),m1.litPropertyMetadata??=new WeakMap;var T=class extends HTMLElement{static addInitializer(C){this._$Ei(),(this.l??=[]).push(C)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(C,H=r2){if(H.state&&(H.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(C)&&((H=Object.create(H)).wrapped=!0),this.elementProperties.set(C,H),!H.noAccessor){let V=Symbol(),L=this.getPropertyDescriptor(C,V,H);L!==void 0&&Q2(this.prototype,C,L)}}static getPropertyDescriptor(C,H,V){let{get:L,set:e}=G2(this.prototype,C)??{get(){return this[H]},set(i){this[H]=i}};return{get:L,set(i){let d=L?.call(this);e?.call(this,i),this.requestUpdate(C,d,V)},configurable:!0,enumerable:!0}}static getPropertyOptions(C){return this.elementProperties.get(C)??r2}static _$Ei(){if(this.hasOwnProperty(H1("elementProperties")))return;let C=j2(this);C.finalize(),C.l!==void 0&&(this.l=[...C.l]),this.elementProperties=new Map(C.elementProperties)}static finalize(){if(this.hasOwnProperty(H1("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(H1("properties"))){let H=this.properties,V=[...z2(H),...K2(H)];for(let L of V)this.createProperty(L,H[L])}let C=this[Symbol.metadata];if(C!==null){let H=litPropertyMetadata.get(C);if(H!==void 0)for(let[V,L]of H)this.elementProperties.set(V,L)}this._$Eh=new Map;for(let[H,V]of this.elementProperties){let L=this._$Eu(H,V);L!==void 0&&this._$Eh.set(L,H)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(C){let H=[];if(Array.isArray(C)){let V=new Set(C.flat(1/0).reverse());for(let L of V)H.unshift(R1(L))}else C!==void 0&&H.push(R1(C));return H}static _$Eu(C,H){let V=H.attribute;return V===!1?void 0:typeof V=="string"?V:typeof C=="string"?C.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(C=>this.enableUpdating=C),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(C=>C(this))}addController(C){(this._$EO??=new Set).add(C),this.renderRoot!==void 0&&this.isConnected&&C.hostConnected?.()}removeController(C){this._$EO?.delete(C)}_$E_(){let C=new Map,H=this.constructor.elementProperties;for(let V of H.keys())this.hasOwnProperty(V)&&(C.set(V,this[V]),delete this[V]);C.size>0&&(this._$Ep=C)}createRenderRoot(){let C=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return M2(C,this.constructor.elementStyles),C}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(C=>C.hostConnected?.())}enableUpdating(C){}disconnectedCallback(){this._$EO?.forEach(C=>C.hostDisconnected?.())}attributeChangedCallback(C,H,V){this._$AK(C,V)}_$ET(C,H){let V=this.constructor.elementProperties.get(C),L=this.constructor._$Eu(C,V);if(L!==void 0&&V.reflect===!0){let e=(V.converter?.toAttribute!==void 0?V.converter:$1).toAttribute(H,V.type);this._$Em=C,e==null?this.removeAttribute(L):this.setAttribute(L,e),this._$Em=null}}_$AK(C,H){let V=this.constructor,L=V._$Eh.get(C);if(L!==void 0&&this._$Em!==L){let e=V.getPropertyOptions(L),i=typeof e.converter=="function"?{fromAttribute:e.converter}:e.converter?.fromAttribute!==void 0?e.converter:$1;this._$Em=L;let d=i.fromAttribute(H,e.type);this[L]=d??this._$Ej?.get(L)??d,this._$Em=null}}requestUpdate(C,H,V,L=!1,e){if(C!==void 0){let i=this.constructor;if(L===!1&&(e=this[C]),V??=i.getPropertyOptions(C),!((V.hasChanged??t2)(e,H)||V.useDefault&&V.reflect&&e===this._$Ej?.get(C)&&!this.hasAttribute(i._$Eu(C,V))))return;this.C(C,H,V)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(C,H,{useDefault:V,reflect:L,wrapped:e},i){V&&!(this._$Ej??=new Map).has(C)&&(this._$Ej.set(C,i??H??this[C]),e!==!0||i!==void 0)||(this._$AL.has(C)||(this.hasUpdated||V||(H=void 0),this._$AL.set(C,H)),L===!0&&this._$Em!==C&&(this._$Eq??=new Set).add(C))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(H){Promise.reject(H)}let C=this.scheduleUpdate();return C!=null&&await C,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[L,e]of this._$Ep)this[L]=e;this._$Ep=void 0}let V=this.constructor.elementProperties;if(V.size>0)for(let[L,e]of V){let{wrapped:i}=e,d=this[L];i!==!0||this._$AL.has(L)||d===void 0||this.C(L,void 0,e,d)}}let C=!1,H=this._$AL;try{C=this.shouldUpdate(H),C?(this.willUpdate(H),this._$EO?.forEach(V=>V.hostUpdate?.()),this.update(H)):this._$EM()}catch(V){throw C=!1,this._$EM(),V}C&&this._$AE(H)}willUpdate(C){}_$AE(C){this._$EO?.forEach(H=>H.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(C)),this.updated(C)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(C){return!0}update(C){this._$Eq&&=this._$Eq.forEach(H=>this._$ET(H,this[H])),this._$EM()}updated(C){}firstUpdated(C){}};T.elementStyles=[],T.shadowRootOptions={mode:"open"},T[H1("elementProperties")]=new Map,T[H1("finalized")]=new Map,X2?.({ReactiveElement:T}),(m1.reactiveElementVersions??=[]).push("2.1.2");var Q1=globalThis,i2=r=>r,n1=Q1.trustedTypes,o2=n1?n1.createPolicy("lit-html",{createHTML:r=>r}):void 0,n2="$lit$",W=`lit$${Math.random().toFixed(9).slice(2)}$`,l2="?"+W,Y2=`<${l2}>`,G=document,L1=()=>G.createComment(""),M1=r=>r===null||typeof r!="object"&&typeof r!="function",G1=Array.isArray,J2=r=>G1(r)||typeof r?.[Symbol.iterator]=="function",E1=`[ 	
\f\r]`,V1=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,a2=/-->/g,A2=/>/g,U=RegExp(`>|${E1}(?:([^\\s"'>=/]+)(${E1}*=${E1}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),d2=/'/g,p2=/"/g,v2=/^(?:script|style|textarea|title)$/i,z1=r=>(C,...H)=>({_$litType$:r,strings:C,values:H}),t=z1(1),F=z1(2),s5=z1(3),z=Symbol.for("lit-noChange"),o=Symbol.for("lit-nothing"),m2=new WeakMap,Q=G.createTreeWalker(G,129);function x2(r,C){if(!G1(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return o2!==void 0?o2.createHTML(C):C}var C5=(r,C)=>{let H=r.length-1,V=[],L,e=C===2?"<svg>":C===3?"<math>":"",i=V1;for(let d=0;d<H;d++){let a=r[d],p,s,A=-1,g=0;for(;g<a.length&&(i.lastIndex=g,s=i.exec(a),s!==null);)g=i.lastIndex,i===V1?s[1]==="!--"?i=a2:s[1]!==void 0?i=A2:s[2]!==void 0?(v2.test(s[2])&&(L=RegExp("</"+s[2],"g")),i=U):s[3]!==void 0&&(i=U):i===U?s[0]===">"?(i=L??V1,A=-1):s[1]===void 0?A=-2:(A=i.lastIndex-s[2].length,p=s[1],i=s[3]===void 0?U:s[3]==='"'?p2:d2):i===p2||i===d2?i=U:i===a2||i===A2?i=V1:(i=U,L=void 0);let S=i===U&&r[d+1].startsWith("/>")?" ":"";e+=i===V1?a+Y2:A>=0?(V.push(p),a.slice(0,A)+n2+a.slice(A)+W+S):a+W+(A===-2?d:S)}return[x2(r,e+(r[H]||"<?>")+(C===2?"</svg>":C===3?"</math>":"")),V]},e1=class r{constructor({strings:C,_$litType$:H},V){let L;this.parts=[];let e=0,i=0,d=C.length-1,a=this.parts,[p,s]=C5(C,H);if(this.el=r.createElement(p,V),Q.currentNode=this.el.content,H===2||H===3){let A=this.el.content.firstChild;A.replaceWith(...A.childNodes)}for(;(L=Q.nextNode())!==null&&a.length<d;){if(L.nodeType===1){if(L.hasAttributes())for(let A of L.getAttributeNames())if(A.endsWith(n2)){let g=s[i++],S=L.getAttribute(A).split(W),B=/([.?@])?(.*)/.exec(g);a.push({type:1,index:e,name:B[2],strings:S,ctor:B[1]==="."?W1:B[1]==="?"?N1:B[1]==="@"?I1:q}),L.removeAttribute(A)}else A.startsWith(W)&&(a.push({type:6,index:e}),L.removeAttribute(A));if(v2.test(L.tagName)){let A=L.textContent.split(W),g=A.length-1;if(g>0){L.textContent=n1?n1.emptyScript:"";for(let S=0;S<g;S++)L.append(A[S],L1()),Q.nextNode(),a.push({type:2,index:++e});L.append(A[g],L1())}}}else if(L.nodeType===8)if(L.data===l2)a.push({type:2,index:e});else{let A=-1;for(;(A=L.data.indexOf(W,A+1))!==-1;)a.push({type:7,index:e}),A+=W.length-1}e++}}static createElement(C,H){let V=G.createElement("template");return V.innerHTML=C,V}};function j(r,C,H=r,V){if(C===z)return C;let L=V!==void 0?H._$Co?.[V]:H._$Cl,e=M1(C)?void 0:C._$litDirective$;return L?.constructor!==e&&(L?._$AO?.(!1),e===void 0?L=void 0:(L=new e(r),L._$AT(r,H,V)),V!==void 0?(H._$Co??=[])[V]=L:H._$Cl=L),L!==void 0&&(C=j(r,L._$AS(r,C.values),L,V)),C}var D1=class{constructor(C,H){this._$AV=[],this._$AN=void 0,this._$AD=C,this._$AM=H}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(C){let{el:{content:H},parts:V}=this._$AD,L=(C?.creationScope??G).importNode(H,!0);Q.currentNode=L;let e=Q.nextNode(),i=0,d=0,a=V[0];for(;a!==void 0;){if(i===a.index){let p;a.type===2?p=new r1(e,e.nextSibling,this,C):a.type===1?p=new a.ctor(e,a.name,a.strings,this,C):a.type===6&&(p=new U1(e,this,C)),this._$AV.push(p),a=V[++d]}i!==a?.index&&(e=Q.nextNode(),i++)}return Q.currentNode=G,L}p(C){let H=0;for(let V of this._$AV)V!==void 0&&(V.strings!==void 0?(V._$AI(C,V,H),H+=V.strings.length-2):V._$AI(C[H])),H++}},r1=class r{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(C,H,V,L){this.type=2,this._$AH=o,this._$AN=void 0,this._$AA=C,this._$AB=H,this._$AM=V,this.options=L,this._$Cv=L?.isConnected??!0}get parentNode(){let C=this._$AA.parentNode,H=this._$AM;return H!==void 0&&C?.nodeType===11&&(C=H.parentNode),C}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(C,H=this){C=j(this,C,H),M1(C)?C===o||C==null||C===""?(this._$AH!==o&&this._$AR(),this._$AH=o):C!==this._$AH&&C!==z&&this._(C):C._$litType$!==void 0?this.$(C):C.nodeType!==void 0?this.T(C):J2(C)?this.k(C):this._(C)}O(C){return this._$AA.parentNode.insertBefore(C,this._$AB)}T(C){this._$AH!==C&&(this._$AR(),this._$AH=this.O(C))}_(C){this._$AH!==o&&M1(this._$AH)?this._$AA.nextSibling.data=C:this.T(G.createTextNode(C)),this._$AH=C}$(C){let{values:H,_$litType$:V}=C,L=typeof V=="number"?this._$AC(C):(V.el===void 0&&(V.el=e1.createElement(x2(V.h,V.h[0]),this.options)),V);if(this._$AH?._$AD===L)this._$AH.p(H);else{let e=new D1(L,this),i=e.u(this.options);e.p(H),this.T(i),this._$AH=e}}_$AC(C){let H=m2.get(C.strings);return H===void 0&&m2.set(C.strings,H=new e1(C)),H}k(C){G1(this._$AH)||(this._$AH=[],this._$AR());let H=this._$AH,V,L=0;for(let e of C)L===H.length?H.push(V=new r(this.O(L1()),this.O(L1()),this,this.options)):V=H[L],V._$AI(e),L++;L<H.length&&(this._$AR(V&&V._$AB.nextSibling,L),H.length=L)}_$AR(C=this._$AA.nextSibling,H){for(this._$AP?.(!1,!0,H);C!==this._$AB;){let V=i2(C).nextSibling;i2(C).remove(),C=V}}setConnected(C){this._$AM===void 0&&(this._$Cv=C,this._$AP?.(C))}},q=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(C,H,V,L,e){this.type=1,this._$AH=o,this._$AN=void 0,this.element=C,this.name=H,this._$AM=L,this.options=e,V.length>2||V[0]!==""||V[1]!==""?(this._$AH=Array(V.length-1).fill(new String),this.strings=V):this._$AH=o}_$AI(C,H=this,V,L){let e=this.strings,i=!1;if(e===void 0)C=j(this,C,H,0),i=!M1(C)||C!==this._$AH&&C!==z,i&&(this._$AH=C);else{let d=C,a,p;for(C=e[0],a=0;a<e.length-1;a++)p=j(this,d[V+a],H,a),p===z&&(p=this._$AH[a]),i||=!M1(p)||p!==this._$AH[a],p===o?C=o:C!==o&&(C+=(p??"")+e[a+1]),this._$AH[a]=p}i&&!L&&this.j(C)}j(C){C===o?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,C??"")}},W1=class extends q{constructor(){super(...arguments),this.type=3}j(C){this.element[this.name]=C===o?void 0:C}},N1=class extends q{constructor(){super(...arguments),this.type=4}j(C){this.element.toggleAttribute(this.name,!!C&&C!==o)}},I1=class extends q{constructor(C,H,V,L,e){super(C,H,V,L,e),this.type=5}_$AI(C,H=this){if((C=j(this,C,H,0)??o)===z)return;let V=this._$AH,L=C===o&&V!==o||C.capture!==V.capture||C.once!==V.once||C.passive!==V.passive,e=C!==o&&(V===o||L);L&&this.element.removeEventListener(this.name,this,V),e&&this.element.addEventListener(this.name,this,C),this._$AH=C}handleEvent(C){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,C):this._$AH.handleEvent(C)}},U1=class{constructor(C,H,V){this.element=C,this.type=6,this._$AN=void 0,this._$AM=H,this.options=V}get _$AU(){return this._$AM._$AU}_$AI(C){j(this,C)}};var H5=Q1.litHtmlPolyfillSupport;H5?.(e1,r1),(Q1.litHtmlVersions??=[]).push("3.3.3");var s2=(r,C,H)=>{let V=H?.renderBefore??C,L=V._$litPart$;if(L===void 0){let e=H?.renderBefore??null;V._$litPart$=L=new r1(C.insertBefore(L1(),e),e,void 0,H??{})}return L._$AI(r),L};var K1=globalThis,x=class extends T{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let C=super.createRenderRoot();return this.renderOptions.renderBefore??=C.firstChild,C}update(C){let H=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(C),this._$Do=s2(H,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return z}};x._$litElement$=!0,x.finalized=!0,K1.litElementHydrateSupport?.({LitElement:x});var V5=K1.litElementPolyfillSupport;V5?.({LitElement:x});(K1.litElementVersions??=[]).push("4.2.2");var f="carbu",X=r=>r.callWS({type:`${f}/vehicles`}),Z2=(r,C)=>r.callWS({type:`${f}/dashboard`,vehicle_id:C}),l1=r=>r.callWS({type:`${f}/categories`}),u2=(r,C)=>r.callWS({type:`${f}/fuel/defaults`,vehicle_id:C}),c2=(r,C,H={})=>r.callWS({type:`${f}/fuel/list`,vehicle_id:C,...H}),S2=(r,C,H)=>r.callWS({type:`${f}/fuel/save`,vehicle_id:C,...H}),v1=(r,C,H)=>r.callWS({type:`${f}/fuel/delete`,vehicle_id:C,entry_id:H}),h2=(r,C,H={})=>r.callWS({type:`${f}/expense/list`,vehicle_id:C,...H}),g2=(r,C,H)=>r.callWS({type:`${f}/expense/save`,vehicle_id:C,...H}),x1=(r,C,H)=>r.callWS({type:`${f}/expense/delete`,vehicle_id:C,expense_id:H}),j1=(r,C)=>`/api/${f}/attachment/${encodeURIComponent(r)}/${encodeURIComponent(C)}`;async function f2(r,C,H,V){let L=new FormData;L.append("file",V);let e=await r.fetchWithAuth(j1(C,H),{method:"POST",body:L});if(!e.ok){let i=String(e.status);try{i=(await e.json()).code??i}catch{}throw new Error(i)}}async function O2(r,C,H){await r.fetchWithAuth(j1(C,H),{method:"DELETE"})}async function b2(r,C,H){let{path:V}=await r.callWS({type:"auth/sign_path",path:j1(C,H),expires:30});return V}var s1=(r,C)=>r.connection.subscribeMessage(()=>C(),{type:`${f}/subscribe`}),y2=(r,C)=>r.callWS({type:`${f}/reminders`,vehicle_id:C}),k2=(r,C,H)=>r.callWS({type:`${f}/reminder/save`,vehicle_id:C,...H}),w2=(r,C,H)=>r.callWS({type:`${f}/reminder/delete`,vehicle_id:C,reminder_id:H}),_2=(r,C,H)=>r.callWS({type:`${f}/reminder/done`,vehicle_id:C,reminder_id:H}),B2=(r,C,H)=>r.callWS({type:`${f}/stats`,vehicle_id:C,period:H});async function q1(r,C,H,V){let L=new FormData;L.append("file",H);let e=`/api/${f}/import/${encodeURIComponent(C)}${V?"?apply=1":""}`,i=await r.fetchWithAuth(e,{method:"POST",body:L}),d=await i.json().catch(()=>({}));if(!i.ok)throw new Error(String(d.code??i.status));return d}var v=r=>t`<svg class="mdi" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d=${r}></path>
  </svg>`;var L5={"card.name":"Carbu \xB7 carnet de bord","card.description":"Vue d'ensemble, saisie rapide d'un plein, d\xE9penses mensuelles.","journal.name":"Carbu \xB7 journal du v\xE9hicule","journal.description":"Pleins et d\xE9penses : liste filtrable, modification, suppression.","common.loading":"Chargement\u2026","common.no_vehicle":"Aucun v\xE9hicule. Ajoutez-en un depuis la page de l'int\xE9gration Carbu.","common.not_loaded":"L'int\xE9gration Carbu n'est pas charg\xE9e.","common.cancel":"Annuler","panel.vehicle":"V\xE9hicule","panel.stats":"Statistiques","panel.journal":"Journal","panel.no_vehicle":"Aucun v\xE9hicule pour l'instant.","panel.open_integration":"Ajouter un v\xE9hicule depuis la page de l'int\xE9gration Carbu.","common.save":"Enregistrer","common.delete":"Supprimer","common.edit":"Modifier","common.close":"Fermer","common.more":"Plus d'options","common.load_more":"Afficher plus","common.none":"Aucune entr\xE9e.","common.error":"Erreur : {message}","common.optional":"facultatif","action.add_fuel":"Plein","action.add_expense":"D\xE9pense","action.add_fuel_long":"Ajouter un plein","action.add_expense_long":"Ajouter une d\xE9pense","tile.consumption":"Consommation moyenne","tile.month_cost":"Co\xFBt du mois","tile.cost_per_distance":"Co\xFBt par {unit}","tile.odometer":"Kilom\xE9trage","tile.distance_month":"Distance ce mois-ci","section.recent_fuel":"Derniers pleins","section.recent_expenses":"Derni\xE8res d\xE9penses","section.monthly":"D\xE9penses mensuelles","chart.total":"Total","chart.empty":"Aucune d\xE9pense sur la p\xE9riode.","chart.summary":"D\xE9penses des {count} derniers mois, empil\xE9es par cat\xE9gorie.","chart.month":"Mois","fuel.title_new":"Nouveau plein","fuel.title_edit":"Modifier le plein","fuel.odometer":"Kilom\xE9trage ({unit})","fuel.volume":"Quantit\xE9 ({unit})","fuel.total":"Montant ({currency})","fuel.unit_price":"Prix unitaire ({currency}/{unit})","fuel.computed":"Calcul\xE9 automatiquement","fuel.full_tank":"Plein complet","fuel.partial":"partiel","fuel.date":"Date","fuel.time":"Heure","fuel.fuel_type":"Carburant","fuel.station":"Station","fuel.notes":"Notes","fuel.need_two":"Saisissez au moins deux valeurs parmi quantit\xE9, montant et prix unitaire.","fuel.warnings":"V\xE9rifiez la saisie :","fuel.save_anyway":"Enregistrer quand m\xEAme","fuel.delete_confirm":"Supprimer le plein du {date} ? Les calculs seront mis \xE0 jour.","expense.title_new":"Nouvelle d\xE9pense","expense.title_edit":"Modifier la d\xE9pense","expense.amount":"Montant ({currency})","expense.category":"Cat\xE9gorie","expense.odometer":"Kilom\xE9trage ({unit})","expense.description":"Description","expense.attachment":"Pi\xE8ce jointe (photo ou PDF, 10 Mo max)","expense.attachment_view":"Voir la pi\xE8ce jointe","expense.attachment_remove":"Retirer la pi\xE8ce jointe","expense.attachment_error":"La pi\xE8ce jointe n'a pas \xE9t\xE9 enregistr\xE9e ({code}).","expense.delete_confirm":"Supprimer la d\xE9pense du {date} ({amount}) ?","journal.tab_fuel":"Pleins","journal.tab_expenses":"D\xE9penses","journal.filters":"Filtres","journal.from":"Du","journal.to":"Au","journal.min":"Montant min.","journal.max":"Montant max.","journal.categories":"Cat\xE9gories","journal.all":"Toutes","journal.reset":"R\xE9initialiser","journal.count":"{count} entr\xE9e(s), total {sum}","journal.period_month":"Ce mois-ci","journal.period_3m":"3 mois","journal.period_year":"Cette ann\xE9e","journal.period_all":"Tout","fuel_type.gasoline":"Essence","fuel_type.diesel":"Diesel","fuel_type.lpg":"GPL","fuel_type.cng":"GNV","category.fuel":"Carburant","warning.odometer_below_previous":"Kilom\xE9trage inf\xE9rieur au relev\xE9 pr\xE9c\xE9dent ({previous} {unit}).","warning.odometer_above_next":"Kilom\xE9trage sup\xE9rieur au relev\xE9 suivant ({next} {unit}).","warning.consumption_out_of_range":"Consommation de {value} {consumption}, hors de la plage pr\xE9vue ({min} \u2013 {max}).","warning.volume_exceeds_tank":"Quantit\xE9 sup\xE9rieure \xE0 la capacit\xE9 du r\xE9servoir ({capacity} {volume}).","warning.fuel_not_supported":"Ce carburant n'est pas d\xE9clar\xE9 pour le v\xE9hicule.","warning.amount_mismatch":"Montant diff\xE9rent de quantit\xE9 \xD7 prix ({expected}).","editor.vehicle":"V\xE9hicule","editor.title":"Titre","editor.show_chart":"Afficher l'histogramme mensuel","editor.show_recent":"Afficher les derni\xE8res entr\xE9es","reminders.title":"Rappels","reminders.add":"Rappel","reminders.add_long":"Ajouter un rappel","reminders.none":"Aucun rappel.","reminders.done":"Fait","reminders.done_long":"Marquer \xAB {label} \xBB comme fait","reminders.done_confirm":"Marquer \xAB {label} \xBB comme fait aujourd'hui ? {next}","reminders.next_recurring":"La prochaine \xE9ch\xE9ance sera calcul\xE9e automatiquement.","reminders.next_once":"Ce rappel non r\xE9current sera ensuite d\xE9sactiv\xE9.","reminders.delete_confirm":"Supprimer le rappel \xAB {label} \xBB ?","reminders.state_ok":"\xC0 jour","reminders.state_alert":"Bient\xF4t","reminders.state_due":"D\xFB","reminders.state_inactive":"Fait","reminders.left_days":"dans {days} j","reminders.late_days":"en retard de {days} j","reminders.left_distance":"dans {distance} {unit}","reminders.late_distance":"d\xE9pass\xE9 de {distance} {unit}","reminders.every":"tous les {value}","reminder.title_new":"Nouveau rappel","reminder.title_edit":"Modifier le rappel","reminder.label":"Libell\xE9","reminder.kind":"D\xE9clenchement","reminder.kind_date":"\xC0 une date","reminder.kind_distance":"\xC0 un kilom\xE9trage","reminder.kind_both":"Date ou kilom\xE9trage (le premier atteint)","reminder.due_date":"Date d'\xE9ch\xE9ance","reminder.due_odometer":"Kilom\xE9trage d'\xE9ch\xE9ance ({unit})","reminder.alert_days":"Alerter \u2026 jours avant","reminder.alert_distance":"Alerter \u2026 {unit} avant","reminder.interval_days":"R\xE9p\xE9ter tous les \u2026 jours","reminder.interval_distance":"R\xE9p\xE9ter tous les \u2026 {unit}","reminder.recurrence_hint":"Laissez vide pour un rappel unique.","stats.name":"Carbu \xB7 statistiques","stats.description":"Statistiques par p\xE9riode et courbe de consommation par plein.","stats.period":"P\xE9riode","stats.period_30d":"30 jours","stats.period_3m":"3 mois","stats.period_12m":"12 mois","stats.period_all":"Depuis l'acquisition","stats.distance":"Distance","stats.consumption":"Consommation moyenne","stats.fuel_cost":"Carburant","stats.expense_cost":"Autres d\xE9penses","stats.total_cost":"Co\xFBt total","stats.cost_per_distance":"Co\xFBt par {unit}","stats.fills":"Pleins","stats.volume":"Quantit\xE9","stats.curve":"Consommation par plein","stats.curve_point":"Plein","stats.moving_average":"Moyenne mobile ({count} pleins)","stats.curve_empty":"Pas encore de consommation mesur\xE9e sur la p\xE9riode (il faut deux pleins complets).","stats.curve_summary":"Consommation de {count} pleins entre le {start} et le {end}.","stats.by_category":"D\xE9penses par cat\xE9gorie","editor.show_reminders":"Afficher les rappels","editor.period":"P\xE9riode par d\xE9faut","import.button":"Importer","import.button_long":"Importer un fichier CSV","import.title":"Importer un fichier CSV","import.help":"Fichiers produits par l'export (pleins, d\xE9penses, relev\xE9s, rappels), y compris apr\xE8s modification dans un tableur. Rien n'est enregistr\xE9 avant votre confirmation.","import.file":"Fichier CSV","import.analyzing":"Analyse du fichier\u2026","import.kind_fuel":"Pleins","import.kind_expenses":"D\xE9penses","import.kind_odometer":"Relev\xE9s du compteur","import.kind_reminders":"Rappels","import.summary":"{kind} : {new} nouvelle(s) ligne(s), {duplicate} d\xE9j\xE0 pr\xE9sente(s), {error} en erreur.","import.new_categories":"Cat\xE9gories qui seront cr\xE9\xE9es : {names}.","import.status_new":"Nouveau","import.status_duplicate":"Doublon","import.status_error":"Erreur","import.line":"Ligne {line}","import.truncated":"Seules les 200 premi\xE8res lignes sont affich\xE9es.","import.confirm":"Importer {count} ligne(s)","import.done":"{count} ligne(s) import\xE9e(s).","import.error_unknown_format":"Format non reconnu : utilisez un fichier produit par l'export.","import.error_empty":"Le fichier est vide.","import.error_too_large":"Le fichier est trop volumineux (5 Mo au plus).","import.error_too_many_rows":"Le fichier contient trop de lignes (20 000 au plus)."},M5={"card.name":"Carbu \xB7 vehicle log","card.description":"Overview, quick fill-up entry, monthly expenses.","journal.name":"Carbu \xB7 vehicle journal","journal.description":"Fill-ups and expenses: filterable list, edit, delete.","common.loading":"Loading\u2026","panel.vehicle":"Vehicle","panel.stats":"Statistics","panel.journal":"Journal","panel.no_vehicle":"No vehicle yet.","panel.open_integration":"Add a vehicle from the Carbu integration page.","common.no_vehicle":"No vehicle. Add one from the Carbu integration page.","common.not_loaded":"The Carbu integration is not loaded.","common.cancel":"Cancel","common.save":"Save","common.delete":"Delete","common.edit":"Edit","common.close":"Close","common.more":"More options","common.load_more":"Show more","common.none":"No entries.","common.error":"Error: {message}","common.optional":"optional","action.add_fuel":"Fill-up","action.add_expense":"Expense","action.add_fuel_long":"Add a fill-up","action.add_expense_long":"Add an expense","tile.consumption":"Average consumption","tile.month_cost":"Cost this month","tile.cost_per_distance":"Cost per {unit}","tile.odometer":"Odometer","tile.distance_month":"Distance this month","section.recent_fuel":"Latest fill-ups","section.recent_expenses":"Latest expenses","section.monthly":"Monthly expenses","chart.total":"Total","chart.empty":"No expenses in this period.","chart.summary":"Expenses over the last {count} months, stacked by category.","chart.month":"Month","fuel.title_new":"New fill-up","fuel.title_edit":"Edit fill-up","fuel.odometer":"Odometer ({unit})","fuel.volume":"Quantity ({unit})","fuel.total":"Amount ({currency})","fuel.unit_price":"Unit price ({currency}/{unit})","fuel.computed":"Computed automatically","fuel.full_tank":"Full tank","fuel.partial":"partial","fuel.date":"Date","fuel.time":"Time","fuel.fuel_type":"Fuel","fuel.station":"Station","fuel.notes":"Notes","fuel.need_two":"Enter at least two of quantity, amount and unit price.","fuel.warnings":"Please check:","fuel.save_anyway":"Save anyway","fuel.delete_confirm":"Delete the fill-up of {date}? Figures will be recalculated.","expense.title_new":"New expense","expense.title_edit":"Edit expense","expense.amount":"Amount ({currency})","expense.category":"Category","expense.odometer":"Odometer ({unit})","expense.description":"Description","expense.attachment":"Attachment (photo or PDF, 10 MB max)","expense.attachment_view":"View attachment","expense.attachment_remove":"Remove attachment","expense.attachment_error":"The attachment was not saved ({code}).","expense.delete_confirm":"Delete the expense of {date} ({amount})?","journal.tab_fuel":"Fill-ups","journal.tab_expenses":"Expenses","journal.filters":"Filters","journal.from":"From","journal.to":"To","journal.min":"Min. amount","journal.max":"Max. amount","journal.categories":"Categories","journal.all":"All","journal.reset":"Reset","journal.count":"{count} entries, total {sum}","journal.period_month":"This month","journal.period_3m":"3 months","journal.period_year":"This year","journal.period_all":"All","fuel_type.gasoline":"Petrol","fuel_type.diesel":"Diesel","fuel_type.lpg":"LPG","fuel_type.cng":"CNG","category.fuel":"Fuel","warning.odometer_below_previous":"Odometer below the previous reading ({previous} {unit}).","warning.odometer_above_next":"Odometer above the next reading ({next} {unit}).","warning.consumption_out_of_range":"Consumption of {value} {consumption}, outside the expected range ({min} \u2013 {max}).","warning.volume_exceeds_tank":"Quantity larger than the tank capacity ({capacity} {volume}).","warning.fuel_not_supported":"This fuel is not declared for the vehicle.","warning.amount_mismatch":"Amount differs from quantity \xD7 price ({expected}).","editor.vehicle":"Vehicle","editor.title":"Title","editor.show_chart":"Show monthly chart","editor.show_recent":"Show latest entries","reminders.title":"Reminders","reminders.add":"Reminder","reminders.add_long":"Add a reminder","reminders.none":"No reminders.","reminders.done":"Done","reminders.done_long":"Mark \u201C{label}\u201D as done","reminders.done_confirm":"Mark \u201C{label}\u201D as done today? {next}","reminders.next_recurring":"The next due date will be calculated automatically.","reminders.next_once":"This one-off reminder will then be deactivated.","reminders.delete_confirm":"Delete the reminder \u201C{label}\u201D?","reminders.state_ok":"Up to date","reminders.state_alert":"Soon","reminders.state_due":"Due","reminders.state_inactive":"Done","reminders.left_days":"in {days} d","reminders.late_days":"{days} d overdue","reminders.left_distance":"in {distance} {unit}","reminders.late_distance":"{distance} {unit} overdue","reminders.every":"every {value}","reminder.title_new":"New reminder","reminder.title_edit":"Edit reminder","reminder.label":"Label","reminder.kind":"Trigger","reminder.kind_date":"On a date","reminder.kind_distance":"At an odometer reading","reminder.kind_both":"Date or odometer (whichever comes first)","reminder.due_date":"Due date","reminder.due_odometer":"Due odometer ({unit})","reminder.alert_days":"Alert \u2026 days before","reminder.alert_distance":"Alert \u2026 {unit} before","reminder.interval_days":"Repeat every \u2026 days","reminder.interval_distance":"Repeat every \u2026 {unit}","reminder.recurrence_hint":"Leave empty for a one-off reminder.","stats.name":"Carbu \xB7 statistics","stats.description":"Statistics by period and consumption per fill-up.","stats.period":"Period","stats.period_30d":"30 days","stats.period_3m":"3 months","stats.period_12m":"12 months","stats.period_all":"Since acquisition","stats.distance":"Distance","stats.consumption":"Average consumption","stats.fuel_cost":"Fuel","stats.expense_cost":"Other expenses","stats.total_cost":"Total cost","stats.cost_per_distance":"Cost per {unit}","stats.fills":"Fill-ups","stats.volume":"Quantity","stats.curve":"Consumption per fill-up","stats.curve_point":"Fill-up","stats.moving_average":"Moving average ({count} fill-ups)","stats.curve_empty":"No consumption measured in this period yet (two full fill-ups are needed).","stats.curve_summary":"Consumption of {count} fill-ups between {start} and {end}.","stats.by_category":"Expenses by category","editor.show_reminders":"Show reminders","editor.period":"Default period","import.button":"Import","import.button_long":"Import a CSV file","import.title":"Import a CSV file","import.help":"Files produced by the export (fill-ups, expenses, odometer readings, reminders), even after editing in a spreadsheet. Nothing is saved before you confirm.","import.file":"CSV file","import.analyzing":"Analysing the file\u2026","import.kind_fuel":"Fill-ups","import.kind_expenses":"Expenses","import.kind_odometer":"Odometer readings","import.kind_reminders":"Reminders","import.summary":"{kind}: {new} new line(s), {duplicate} already present, {error} with errors.","import.new_categories":"Categories that will be created: {names}.","import.status_new":"New","import.status_duplicate":"Duplicate","import.status_error":"Error","import.line":"Line {line}","import.truncated":"Only the first 200 lines are shown.","import.confirm":"Import {count} line(s)","import.done":"{count} line(s) imported.","import.error_unknown_format":"Unrecognised format: use a file produced by the export.","import.error_empty":"The file is empty.","import.error_too_large":"The file is too large (5 MB max).","import.error_too_many_rows":"The file has too many lines (20,000 max)."};function N(r){return r?.locale?.language??r?.language??"en"}function M(r,C,H={}){return(N(r).startsWith("fr")?L5:M5)[C].replace(/\{(\w+)\}/g,(L,e)=>e in H?String(H[e]):`{${e}}`)}function n(r,C,H=0){return C==null||Number.isNaN(C)?"\u2014":new Intl.NumberFormat(N(r),{minimumFractionDigits:H,maximumFractionDigits:H}).format(C)}function Z(r,C,H,V=2){if(C==null)return"\u2014";try{return new Intl.NumberFormat(N(r),{style:"currency",currency:H,minimumFractionDigits:V,maximumFractionDigits:V}).format(C)}catch{return`${n(r,C,V)} ${H}`}}function h(r,C){let[H,V,L]=C.split("-").map(Number);return new Intl.DateTimeFormat(N(r),{dateStyle:"medium"}).format(new Date(H,V-1,L))}function P2(r,C){let[H,V]=C.split("-").map(Number);return new Intl.DateTimeFormat(N(r),{month:"short"}).format(new Date(H,V-1,1))}function t1(r,C){let[H,V]=C.split("-").map(Number);return new Intl.DateTimeFormat(N(r),{month:"long",year:"numeric"}).format(new Date(H,V-1,1))}function i1(r=0){let C=new Date;return C.setDate(C.getDate()+r),o1(C)}function o1(r){let C=H=>String(H).padStart(2,"0");return`${r.getFullYear()}-${C(r.getMonth()+1)}-${C(r.getDate())}`}function X1(r,C){let H=10**C;return Math.round((r+Number.EPSILON)*H)/H}function b(r){let C=r.trim().replace(/\s/g,"").replace(",",".");if(C==="")return null;let H=Number(C);return Number.isFinite(H)?H:null}function y(r,C,H){let V=String(X1(C,H));return new Intl.NumberFormat(N(r)).format(1.5).charAt(1)===","?V.replace(".",","):V}var Y1="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z";var R="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z";var $="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z";var a1="M16.5,6V17.5A4,4 0 0,1 12.5,21.5A4,4 0 0,1 8.5,17.5V5A2.5,2.5 0 0,1 11,2.5A2.5,2.5 0 0,1 13.5,5V15.5A1,1 0 0,1 12.5,16.5A1,1 0 0,1 11.5,15.5V6H10V15.5A2.5,2.5 0 0,0 12.5,18A2.5,2.5 0 0,0 15,15.5V5A4,4 0 0,0 11,1A4,4 0 0,0 7,5V17.5A5.5,5.5 0 0,0 12.5,23A5.5,5.5 0 0,0 18,17.5V6H16.5Z";var E="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z";var K="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z";var J1="M9,16V10H5L12,3L19,10H15V16H9M5,20V18H19V20H5Z";var c=u`
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
`;var w=class extends x{constructor(){super();this._vehicles=[];this._currency="EUR";this._started=!1;this._error="",this._loading=!0}static{this.properties={hass:{attribute:!1},_config:{state:!0},_error:{state:!0},_loading:{state:!0}}}setConfig(H){if(!H)throw new Error("Invalid configuration");let V=this._config?.vehicle_id!==H.vehicle_id;this._config={show_chart:!0,show_recent:!0,...H},this._started&&V?this.reload():this._start()}get vehicle(){return this._vehicles.find(H=>H.id===this._config?.vehicle_id)??this._vehicles[0]}_start(){this._started||!this.hass||!this.isConnected||!this._config||(this._started=!0,this.reload())}updated(H){H.has("hass")&&(this._start(),this._subscribe())}connectedCallback(){super.connectedCallback(),this.hass&&(this._subscribe(),this._start())}disconnectedCallback(){super.disconnectedCallback(),this._started=!1;let H=this._unsubscribe;this._unsubscribe=void 0,H?.then(V=>V()).catch(()=>{})}_subscribe(){this._unsubscribe||!this.isConnected||(this._unsubscribe=s1(this.hass,()=>{window.clearTimeout(this._reloadTimer),this._reloadTimer=window.setTimeout(()=>{this.reload()},300)}),this._unsubscribe.catch(()=>{this._unsubscribe=void 0}))}async reload(){try{let H=await X(this.hass);this._vehicles=H.vehicles,this._currency=H.currency,this._error="",await this.loadVehicleData()}catch(H){this._error=H.code??H.message}finally{this._loading=!1,this.requestUpdate()}}};var C2=u`
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
`,Z1=class extends w{static{this.properties={...w.properties,_data:{state:!0}}}static{this.styles=[c,C2,u`
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
      .recent {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 16px;
      }
    `]}constructor(){super(),this._data=null}static getStubConfig(){return{type:"custom:carbu-card"}}static async getConfigElement(){let C=document.createElement("carbu-card-editor");return C.setAttribute("kind","dashboard"),C}getCardSize(){return 8}getGridOptions(){return{columns:12,min_columns:6,rows:"auto"}}async loadVehicleData(){let C=this.vehicle;this._data=C?await Z2(this.hass,C.id):null,await this.renderRoot.querySelector("vl-reminder-list")?.reload()}_dialog(C){return this.renderRoot.querySelector(C)}async _deleteFuel(C){await this._dialog("vl-confirm-dialog").ask(M(this.hass,"fuel.delete_confirm",{date:h(this.hass,C.date)}))&&this._data&&(await v1(this.hass,this._data.id,C.id),await this.reload())}async _deleteExpense(C){await this._dialog("vl-confirm-dialog").ask(M(this.hass,"expense.delete_confirm",{date:h(this.hass,C.date),amount:Z(this.hass,C.amount,this._currency)}))&&this._data&&(await x1(this.hass,this._data.id,C.id),await this.reload())}_tiles(C){let H=this.hass,V=C.summary,L=C.fuel_types[0],e=C.units.distance,i=(d,a,p="")=>t`<div class="tile">
        <dt>${d}</dt>
        <dd>${a}${p?t` <small>${p}</small>`:o}</dd>
      </div>`;return t`<dl class="tiles">
      ${i(M(H,"tile.consumption"),n(H,V?.consumption[L],2),C.units.consumption[L])}
      ${i(M(H,"tile.month_cost"),Z(H,V?.month_cost,C.currency))}
      ${i(M(H,"tile.cost_per_distance",{unit:e}),Z(H,V?.cost_per_distance,C.currency,3))}
      ${i(M(H,"tile.odometer"),n(H,V?.current_odometer,0),e)}
      ${i(M(H,"tile.distance_month"),n(H,V?.distance_month,0),e)}
    </dl>`}_fuelRow(C,H){let V=this.hass,L=C.units.volume[H.fuel_type]??"L",e=`${h(V,H.date)} \xB7 ${n(V,H.volume,2)} ${L}`;return t`<li>
      <div class="entry-main">
        <span class="entry-title">
          <span>${e}${H.full_tank?o:t` <span class="badge">${M(V,"fuel.partial")}</span>`}</span>
          <span class="amount">${Z(V,H.total_cost,C.currency)}</span>
        </span>
        <span class="entry-sub">
          ${n(V,H.odometer,0)} ${C.units.distance} ·
          ${Z(V,H.unit_price,C.currency,3)}/${L}${H.station?` \xB7 ${H.station}`:""}
        </span>
      </div>
      <span class="row-actions">
        <button
          class="icon"
          aria-label="${M(V,"common.edit")} : ${e}"
          @click=${()=>this._dialog("vl-fuel-dialog").open(H)}
        >
          ${v(E)}
        </button>
        <button
          class="icon"
          aria-label="${M(V,"common.delete")} : ${e}"
          @click=${()=>this._deleteFuel(H)}
        >
          ${v($)}
        </button>
      </span>
    </li>`}_expenseRow(C,H){let V=this.hass,L=C.categories.find(i=>i.id===H.category_id),e=`${h(V,H.date)} \xB7 ${L?.label??H.category_id}`;return t`<li>
      <div class="entry-main">
        <span class="entry-title">
          <span>${e}</span>
          <span class="amount">${Z(V,H.amount,C.currency)}</span>
        </span>
        ${H.description?t`<span class="entry-sub">${H.description}</span>`:o}
      </div>
      <span class="row-actions">
        <button
          class="icon"
          aria-label="${M(V,"common.edit")} : ${e}"
          @click=${()=>this._dialog("vl-expense-dialog").open(H)}
        >
          ${v(E)}
        </button>
        <button
          class="icon"
          aria-label="${M(V,"common.delete")} : ${e}"
          @click=${()=>this._deleteExpense(H)}
        >
          ${v($)}
        </button>
      </span>
    </li>`}render(){let C=this.hass;if(this._loading)return t`<ha-card><p>${M(C,"common.loading")}</p></ha-card>`;if(this._error){let L=this._error==="not_loaded"?M(C,"common.not_loaded"):this._error;return t`<ha-card><p class="error" role="alert">${L}</p></ha-card>`}let H=this._data;if(!H)return t`<ha-card><p>${M(C,"common.no_vehicle")}</p></ha-card>`;let V=this._config;return t`<ha-card>
      <div class="head">
        <h2>${V.title||H.name}</h2>
        <div class="actions">
          <button
            class="primary"
            aria-label=${M(C,"action.add_fuel_long")}
            @click=${()=>this._dialog("vl-fuel-dialog").open()}
          >
            ${v(K)} ${M(C,"action.add_fuel")}
          </button>
          <button
            aria-label=${M(C,"action.add_expense_long")}
            @click=${()=>this._dialog("vl-expense-dialog").open()}
          >
            ${v(K)} ${M(C,"action.add_expense")}
          </button>
        </div>
      </div>
      ${this._tiles(H)}
      ${V.show_reminders!==!1?t`<section aria-labelledby="reminders">
            <div class="head">
              <h3 id="reminders">${M(C,"reminders.title")}</h3>
              <button
                aria-label=${M(C,"reminders.add_long")}
                @click=${()=>this.renderRoot.querySelector("vl-reminder-list").openEditor()}
              >
                ${v(K)} ${M(C,"reminders.add")}
              </button>
            </div>
            <vl-reminder-list .hass=${C} .vehicle=${H}></vl-reminder-list>
          </section>`:o}
      ${V.show_recent?t`<div class="recent">
            <section aria-labelledby="recent-fuel">
              <h3 id="recent-fuel">${M(C,"section.recent_fuel")}</h3>
              ${H.recent_fuel.length?t`<ul class="entries">${H.recent_fuel.map(L=>this._fuelRow(H,L))}</ul>`:t`<p class="empty">${M(C,"common.none")}</p>`}
            </section>
            <section aria-labelledby="recent-expenses">
              <h3 id="recent-expenses">${M(C,"section.recent_expenses")}</h3>
              ${H.recent_expenses.length?t`<ul class="entries">
                    ${H.recent_expenses.map(L=>this._expenseRow(H,L))}
                  </ul>`:t`<p class="empty">${M(C,"common.none")}</p>`}
            </section>
          </div>`:o}
      ${V.show_chart?t`<section aria-labelledby="monthly">
            <h3 id="monthly">${M(C,"section.monthly")}</h3>
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
    </ha-card>`}};var u1=class extends x{static{this.properties={hass:{attribute:!1},kind:{type:String},_config:{state:!0},_vehicles:{state:!0}}}static{this.styles=[c,u`
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
    `]}constructor(){super(),this.kind="dashboard",this._vehicles=[]}setConfig(C){this._config=C}firstUpdated(){X(this.hass).then(C=>this._vehicles=C.vehicles).catch(()=>{})}_change(C,H){let V={...this._config};H===""||H===void 0?delete V[C]:V[C]=H,this._config=V,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:V},bubbles:!0,composed:!0}))}render(){if(!this._config)return o;let C=this.hass;return t`
      <div class="field">
        <label for="vehicle">${M(C,"editor.vehicle")}</label>
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
        <label for="title">${M(C,"editor.title")}</label>
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
              ${M(C,"editor.show_recent")}
            </label>
            <label class="check">
              <input
                type="checkbox"
                .checked=${this._config.show_reminders!==!1}
                @change=${H=>this._change("show_reminders",H.target.checked)}
              />
              ${M(C,"editor.show_reminders")}
            </label>
            <label class="check">
              <input
                type="checkbox"
                .checked=${this._config.show_chart!==!1}
                @change=${H=>this._change("show_chart",H.target.checked)}
              />
              ${M(C,"editor.show_chart")}
            </label>`:o}
      ${this.kind==="stats"?t`<div class="field">
            <label for="period">${M(C,"editor.period")}</label>
            <select
              id="period"
              @change=${H=>this._change("period",H.target.value)}
            >
              ${["30d","3m","12m","all"].map(H=>t`<option value=${H} ?selected=${(this._config.period??"12m")===H}>
                    ${M(C,`stats.period_${H}`)}
                  </option>`)}
            </select>
          </div>`:o}
    `}};var T2=25;function e5(r){let C=new Date;return r==="month"?{start:o1(new Date(C.getFullYear(),C.getMonth(),1))}:r==="3m"?{start:o1(new Date(C.getFullYear(),C.getMonth()-2,1))}:r==="year"?{start:o1(new Date(C.getFullYear(),0,1))}:{}}var c1=class extends w{static{this.properties={...w.properties,_tab:{state:!0},_fuel:{state:!0},_expenses:{state:!0},_fuelTotal:{state:!0},_expenseTotal:{state:!0},_expenseSum:{state:!0},_categories:{state:!0},_filters:{state:!0}}}static{this.styles=[c,C2,u`
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
    `]}constructor(){super(),this._tab="fuel",this._fuel=[],this._expenses=[],this._fuelTotal=0,this._expenseTotal=0,this._expenseSum=0,this._categories=[],this._filters={preset:"all"}}static getStubConfig(){return{type:"custom:carbu-journal-card"}}static async getConfigElement(){let C=document.createElement("carbu-card-editor");return C.setAttribute("kind","journal"),C}getCardSize(){return 10}getGridOptions(){return{columns:12,min_columns:6,rows:"auto"}}async loadVehicleData(){if(!this.vehicle)return;let[H]=await Promise.all([l1(this.hass),this._loadFuel(!1),this._loadExpenses(!1)]);this._categories=H}async _loadFuel(C){let H=this.vehicle;if(!H)return;let V=await c2(this.hass,H.id,{limit:T2,offset:C?this._fuel.length:0});this._fuel=C?[...this._fuel,...V.items]:V.items,this._fuelTotal=V.total}_apiFilters(){let{preset:C,...H}=this._filters;return H}async _loadExpenses(C){let H=this.vehicle;if(!H)return;let V=await h2(this.hass,H.id,{...this._apiFilters(),limit:T2,offset:C?this._expenses.length:0});this._expenses=C?[...this._expenses,...V.items]:V.items,this._expenseTotal=V.total,this._expenseSum=V.sum??0}_setFilters(C){let H={...this._filters,...C};for(let[V,L]of Object.entries(H))(L==null||L==="")&&delete H[V];this._filters=H,this._loadExpenses(!1)}_preset(C){let H=e5(C);this._setFilters({preset:C,start:H.start,end:void 0})}_toggleCategory(C,H){let V=new Set(this._filters.category_ids??[]);H?V.add(C):V.delete(C),this._setFilters({category_ids:V.size?[...V]:void 0})}_confirm(){return this.renderRoot.querySelector("vl-confirm-dialog")}async _deleteFuel(C){let H=this.vehicle;H&&await this._confirm().ask(M(this.hass,"fuel.delete_confirm",{date:h(this.hass,C.date)}))&&(await v1(this.hass,H.id,C.id),await this.reload())}async _deleteExpense(C){let H=this.vehicle;if(!H)return;let V=M(this.hass,"expense.delete_confirm",{date:h(this.hass,C.date),amount:Z(this.hass,C.amount,this._currency)});await this._confirm().ask(V)&&(await x1(this.hass,H.id,C.id),await this.reload())}_tabButton(C,H){let V=this._tab===C;return t`<button
      role="tab"
      id="tab-${C}"
      aria-selected=${V?"true":"false"}
      aria-controls="panel-${C}"
      tabindex=${V?0:-1}
      @click=${()=>this._tab=C}
      @keydown=${L=>{(L.key==="ArrowRight"||L.key==="ArrowLeft")&&(this._tab=this._tab==="fuel"?"expenses":"fuel",this.updateComplete.then(()=>this.renderRoot.querySelector(`#tab-${this._tab}`)?.focus()))}}
    >
      ${H}
    </button>`}_fuelPanel(){let C=this.hass,H=this.vehicle;return t`<div role="tabpanel" id="panel-fuel" aria-labelledby="tab-fuel">
      ${this._fuel.length?t`<ul class="entries">
            ${this._fuel.map(V=>{let L=H.units.volume[V.fuel_type]??"L",e=`${h(C,V.date)} \xB7 ${n(C,V.volume,2)} ${L}`;return t`<li>
                <div class="entry-main">
                  <span class="entry-title">
                    <span>${e}${V.full_tank?o:t` <span class="badge">${M(C,"fuel.partial")}</span>`}</span>
                    <span class="amount">${Z(C,V.total_cost,this._currency)}</span>
                  </span>
                  <span class="entry-sub">
                    ${n(C,V.odometer,0)} ${H.units.distance} ·
                    ${Z(C,V.unit_price,this._currency,3)}/${L}${V.station?` \xB7 ${V.station}`:""}${V.notes?` \xB7 ${V.notes}`:""}
                  </span>
                </div>
                <span class="row-actions">
                  <button class="icon" aria-label="${M(C,"common.edit")} : ${e}"
                    @click=${()=>this.renderRoot.querySelector("vl-fuel-dialog").open(V)}>
                    ${v(E)}
                  </button>
                  <button class="icon" aria-label="${M(C,"common.delete")} : ${e}"
                    @click=${()=>this._deleteFuel(V)}>
                    ${v($)}
                  </button>
                </span>
              </li>`})}
          </ul>`:t`<p class="empty">${M(C,"common.none")}</p>`}
      ${this._fuel.length<this._fuelTotal?t`<button class="more" @click=${()=>this._loadFuel(!0)}>${M(C,"common.load_more")}</button>`:o}
    </div>`}_filtersForm(){let C=this.hass,H=this._filters,V=[["month",M(C,"journal.period_month")],["3m",M(C,"journal.period_3m")],["year",M(C,"journal.period_year")],["all",M(C,"journal.period_all")]],L=(e,i)=>this._setFilters({[e]:b(i)??void 0});return t`<fieldset>
      <legend>${M(C,"journal.filters")}</legend>
      <div class="presets" role="group" aria-label=${M(C,"journal.filters")}>
        ${V.map(([e,i])=>t`<button aria-pressed=${H.preset===e?"true":"false"} @click=${()=>this._preset(e)}>
              ${i}
            </button>`)}
      </div>
      <div class="field">
        <label for="from">${M(C,"journal.from")}</label>
        <input id="from" type="date" .value=${H.start??""}
          @change=${e=>this._setFilters({start:e.target.value,preset:void 0})} />
      </div>
      <div class="field">
        <label for="to">${M(C,"journal.to")}</label>
        <input id="to" type="date" .value=${H.end??""}
          @change=${e=>this._setFilters({end:e.target.value,preset:void 0})} />
      </div>
      <div class="field">
        <label for="min">${M(C,"journal.min")} (${this._currency})</label>
        <input id="min" inputmode="decimal" .value=${H.min_amount!==void 0?String(H.min_amount):""}
          @change=${e=>L("min_amount",e.target.value)} />
      </div>
      <div class="field">
        <label for="max">${M(C,"journal.max")} (${this._currency})</label>
        <input id="max" inputmode="decimal" .value=${H.max_amount!==void 0?String(H.max_amount):""}
          @change=${e=>L("max_amount",e.target.value)} />
      </div>
      <div class="chips" role="group" aria-label=${M(C,"journal.categories")}>
        ${this._categories.map(e=>t`<label>
            <input type="checkbox" .checked=${H.category_ids?.includes(e.id)??!1}
              @change=${i=>this._toggleCategory(e.id,i.target.checked)} />
            ${e.label}
          </label>`)}
      </div>
      <div class="presets">
        <button @click=${()=>{this._filters={preset:"all"},this._loadExpenses(!1)}}>${M(C,"journal.reset")}</button>
      </div>
    </fieldset>`}_expensePanel(){let C=this.hass;return t`<div role="tabpanel" id="panel-expenses" aria-labelledby="tab-expenses">
      ${this._filtersForm()}
      <p class="summary" aria-live="polite">
        ${M(C,"journal.count",{count:this._expenseTotal,sum:Z(C,this._expenseSum,this._currency)})}
      </p>
      ${this._expenses.length?t`<ul class="entries">
            ${this._expenses.map(H=>{let V=this._categories.find(e=>e.id===H.category_id),L=`${h(C,H.date)} \xB7 ${V?.label??H.category_id}`;return t`<li>
                <div class="entry-main">
                  <span class="entry-title">
                    <span>${L}${H.attachment?t` ${v(a1)}`:o}</span>
                    <span class="amount">${Z(C,H.amount,this._currency)}</span>
                  </span>
                  ${H.description?t`<span class="entry-sub">${H.description}</span>`:o}
                </div>
                <span class="row-actions">
                  <button class="icon" aria-label="${M(C,"common.edit")} : ${L}"
                    @click=${()=>this.renderRoot.querySelector("vl-expense-dialog").open(H)}>
                    ${v(E)}
                  </button>
                  <button class="icon" aria-label="${M(C,"common.delete")} : ${L}"
                    @click=${()=>this._deleteExpense(H)}>
                    ${v($)}
                  </button>
                </span>
              </li>`})}
          </ul>`:t`<p class="empty">${M(C,"common.none")}</p>`}
      ${this._expenses.length<this._expenseTotal?t`<button class="more" @click=${()=>this._loadExpenses(!0)}>${M(C,"common.load_more")}</button>`:o}
    </div>`}render(){let C=this.hass;if(this._loading)return t`<ha-card><p>${M(C,"common.loading")}</p></ha-card>`;if(this._error){let L=this._error==="not_loaded"?M(C,"common.not_loaded"):this._error;return t`<ha-card><p class="error" role="alert">${L}</p></ha-card>`}let H=this.vehicle;if(!H)return t`<ha-card><p>${M(C,"common.no_vehicle")}</p></ha-card>`;let V=this._tab==="fuel";return t`<ha-card>
      <div class="head">
        <h2>${this._config.title||`${M(C,"journal.name")} \xB7 ${H.name}`}</h2>
        <div class="head-actions">
        <button
          aria-label=${M(C,"import.button_long")}
          @click=${()=>this.renderRoot.querySelector("vl-import-dialog").open()}
        >
          ${v(J1)} ${M(C,"import.button")}
        </button>
        <button
          class="primary"
          aria-label=${M(C,V?"action.add_fuel_long":"action.add_expense_long")}
          @click=${()=>V?this.renderRoot.querySelector("vl-fuel-dialog").open():this.renderRoot.querySelector("vl-expense-dialog").open()}
        >
          ${v(K)} ${M(C,V?"action.add_fuel":"action.add_expense")}
        </button>
        </div>
      </div>
      <div role="tablist" aria-label=${H.name}>
        ${this._tabButton("fuel",M(C,"journal.tab_fuel"))}
        ${this._tabButton("expenses",M(C,"journal.tab_expenses"))}
      </div>
      ${V?this._fuelPanel():this._expensePanel()}
      <vl-fuel-dialog .hass=${C} .vehicle=${H} .currency=${this._currency}
        @saved=${()=>this.reload()}></vl-fuel-dialog>
      <vl-expense-dialog .hass=${C} .vehicle=${H} .categories=${this._categories}
        .currency=${this._currency} @saved=${()=>this.reload()}></vl-expense-dialog>
      <vl-import-dialog .hass=${C} .vehicle=${H} .categories=${this._categories}
        .currency=${this._currency} @saved=${()=>this.reload()}></vl-import-dialog>
      <vl-confirm-dialog .hass=${C}></vl-confirm-dialog>
    </ha-card>`}};var r5=["30d","3m","12m","all"],S1=class extends w{static{this.properties={...w.properties,_period:{state:!0},_stats:{state:!0},_categories:{state:!0}}}static{this.styles=[c,u`
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
      ul.bars {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      ul.bars li {
        display: grid;
        grid-template-columns: minmax(90px, 30%) 1fr auto;
        align-items: center;
        gap: 8px;
        font-size: 0.875rem;
      }
      .bar {
        height: 10px;
        border-radius: 5px;
        min-width: 2px;
      }
      .amount {
        font-variant-numeric: tabular-nums;
      }
    `]}constructor(){super(),this._period="12m",this._stats=null,this._categories=[]}setConfig(C){super.setConfig(C),C.period&&(this._period=C.period)}static getStubConfig(){return{type:"custom:carbu-stats-card"}}static async getConfigElement(){let C=document.createElement("carbu-card-editor");return C.setAttribute("kind","stats"),C}getCardSize(){return 7}getGridOptions(){return{columns:12,min_columns:6,rows:"auto"}}async loadVehicleData(){let C=this.vehicle;if(!C)return;let[H,V]=await Promise.all([B2(this.hass,C.id,this._period),l1(this.hass)]);this._stats=H,this._categories=V}async _select(C){this._period=C,await this.loadVehicleData()}render(){let C=this.hass;if(this._loading)return t`<ha-card><p>${M(C,"common.loading")}</p></ha-card>`;if(this._error){let A=this._error==="not_loaded"?M(C,"common.not_loaded"):this._error;return t`<ha-card><p class="error" role="alert">${A}</p></ha-card>`}let H=this.vehicle,V=this._stats;if(!H||!V)return t`<ha-card><p>${M(C,"common.no_vehicle")}</p></ha-card>`;let L=H.fuel_types[0],e=H.units.distance,i=this._currency,d=(A,g,S="")=>t`<div class="tile">
        <dt>${A}</dt>
        <dd>${g}${S?t` <small>${S}</small>`:o}</dd>
      </div>`,a=Object.entries(V.expenses_by_category).sort((A,g)=>g[1]-A[1]),p=Math.max(1,...a.map(([,A])=>A),V.fuel_cost),s=[{label:M(C,"category.fuel"),color:"#2e7d32",value:V.fuel_cost},...a.map(([A,g])=>{let S=this._categories.find(B=>B.id===A);return{label:S?.label??A,color:S?.color??"#757575",value:g}})].filter(A=>A.value>0);return t`<ha-card>
      <div class="head">
        <h2>${this._config.title||`${M(C,"stats.name")} \xB7 ${H.name}`}</h2>
        <div class="periods" role="group" aria-label=${M(C,"stats.period")}>
          ${r5.map(A=>t`<button
              aria-pressed=${this._period===A?"true":"false"}
              @click=${()=>this._select(A)}
            >
              ${M(C,`stats.period_${A}`)}
            </button>`)}
        </div>
      </div>
      <p class="range">${h(C,V.start)} – ${h(C,V.end)}</p>
      <dl class="tiles">
        ${d(M(C,"stats.distance"),n(C,V.distance,0),e)}
        ${H.fuel_types.map(A=>d(`${M(C,"stats.consumption")}${H.fuel_types.length>1?` (${M(C,`fuel_type.${A}`)})`:""}`,n(C,V.consumption[A],2),H.units.consumption[A]))}
        ${d(M(C,"stats.fuel_cost"),Z(C,V.fuel_cost,i))}
        ${d(M(C,"stats.expense_cost"),Z(C,V.expense_cost,i))}
        ${d(M(C,"stats.total_cost"),Z(C,V.total_cost,i))}
        ${d(M(C,"stats.cost_per_distance",{unit:e}),Z(C,V.cost_per_distance,i,3))}
        ${d(M(C,"stats.fills"),n(C,V.fill_count,0))}
        ${d(M(C,"stats.volume"),n(C,V.fuel_volume[L],1),H.units.volume[L])}
      </dl>
      ${H.fuel_types.map(A=>t`<section aria-labelledby="curve-${A}">
          <h3 id="curve-${A}">
            ${M(C,"stats.curve")}${H.fuel_types.length>1?` \xB7 ${M(C,`fuel_type.${A}`)}`:""}
          </h3>
          <vl-consumption-chart
            .hass=${C}
            .points=${V.series[A]??[]}
            .unit=${H.units.consumption[A]}
            .window=${V.moving_average_window}
          ></vl-consumption-chart>
        </section>`)}
      ${s.length?t`<section aria-labelledby="by-category">
            <h3 id="by-category">${M(C,"stats.by_category")}</h3>
            <ul class="bars">
              ${s.map(({label:A,color:g,value:S})=>t`<li>
                  <span>${A}</span>
                  <span
                    class="bar"
                    style="width:${S/p*100}%;background:${g}"
                    aria-hidden="true"
                  ></span>
                  <span class="amount">${Z(C,S,i)}</span>
                </li>`)}
            </ul>
          </section>`:o}
    </ha-card>`}};var P=u`
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
`;var h1=class extends x{static{this.properties={hass:{attribute:!1},_message:{state:!0},_confirmLabel:{state:!0},_danger:{state:!0}}}static{this.styles=[c,P]}constructor(){super(),this._message="",this._confirmLabel="",this._danger=!0}async ask(C,H,V=!0){return this._message=C,this._confirmLabel=H??"",this._danger=V,await this.updateComplete,this.renderRoot.querySelector("dialog").showModal(),new Promise(e=>{this._resolve=e})}_answer(C){this.renderRoot.querySelector("dialog").close(),this._resolve?.(C),this._resolve=void 0}render(){return t`<dialog
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
          ${M(this.hass,"common.cancel")}
        </button>
        <button
          type="button"
          class=${this._danger?"danger":"primary"}
          @click=${()=>this._answer(!0)}
        >
          ${this._confirmLabel||M(this.hass,"common.delete")}
        </button>
      </footer>
    </dialog>`}};var g1=220,D={top:12,right:12,bottom:28,left:44},F2="#1e88e5",R2="#ef6c00",f1=class extends x{static{this.properties={hass:{attribute:!1},points:{attribute:!1},unit:{type:String},window:{type:Number},_width:{state:!0}}}static{this.styles=[c,u`
      :host {
        display: block;
        position: relative;
      }
      svg.chart {
        width: 100%;
        height: ${g1}px;
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
    `]}constructor(){super(),this.points=[],this.unit="",this.window=5,this._width=600}connectedCallback(){super.connectedCallback(),this._observer=new ResizeObserver(([C])=>{let H=Math.round(C.contentRect.width);H>0&&Math.abs(H-this._width)>2&&(this._width=H)}),this._observer.observe(this)}disconnectedCallback(){super.disconnectedCallback(),this._observer?.disconnect()}render(){let C=this.hass,H=this.points;if(!H.length)return t`<p class="empty">${M(C,"stats.curve_empty")}</p>`;let V=this._width,L=H.flatMap(l=>[l.value,l.moving_average]),e=Math.min(...L),i=Math.max(...L),d=Math.max((i-e)*.15,.5);e=Math.max(0,e-d),i+=d;let a=V-D.left-D.right,p=g1-D.top-D.bottom,s=l=>D.left+(H.length===1?a/2:l/(H.length-1)*a),A=l=>D.top+p-(l-e)/(i-e)*p,g=[0,.5,1].map(l=>e+l*(i-e)),S=H.map((l,O)=>`${O?"L":"M"}${s(O)},${A(l.moving_average)}`).join(" "),B=Math.max(2,Math.floor(a/90)),J=Math.max(1,Math.ceil(H.length/B)),m=M(C,"stats.moving_average",{count:this.window}),k=M(C,"stats.curve_summary",{count:H.length,start:h(C,H[0].date),end:h(C,H[H.length-1].date)});return t`
      <svg class="chart" viewBox="0 0 ${V} ${g1}" role="img" aria-label=${k}>
        ${g.map(l=>F`<line class="grid" x1=${D.left} x2=${V-D.right} y1=${A(l)} y2=${A(l)}></line>
            <text class="axis" x=${D.left-6} y=${A(l)+4} text-anchor="end">${n(C,l,1)}</text>`)}
        <path d=${S} fill="none" stroke=${R2} stroke-width="2.5" stroke-linejoin="round"></path>
        ${H.map((l,O)=>F`<circle cx=${s(O)} cy=${A(l.value)} r="4" fill=${F2}
              stroke="var(--card-background-color, #fff)" stroke-width="1.5">
              <title>${h(C,l.date)} : ${n(C,l.value,2)} ${this.unit} (${m} : ${n(C,l.moving_average,2)})</title>
            </circle>`)}
        ${H.map((l,O)=>O%J===0&&H.length-1-O>=J/2||O===H.length-1?F`<text class="axis" x=${s(O)} y=${g1-8}
                text-anchor=${H.length>1&&O===0?"start":H.length>1&&O===H.length-1?"end":"middle"}
              >${t1(C,l.date.slice(0,7))}</text>`:o)}
      </svg>
      <ul class="legend">
        <li>
          <svg width="14" height="14" aria-hidden="true" style="height:14px">
            <circle cx="7" cy="7" r="5" fill=${F2}></circle>
          </svg>
          ${M(C,"stats.curve_point")} (${this.unit})
        </li>
        <li>
          <svg width="20" height="14" aria-hidden="true" style="height:14px">
            <line x1="1" x2="19" y1="7" y2="7" stroke=${R2} stroke-width="3"></line>
          </svg>
          ${m}
        </li>
      </ul>
      <div class="visually-hidden">
        <table>
          <caption>${k}</caption>
          <thead>
            <tr>
              <th scope="col">${M(C,"fuel.date")}</th>
              <th scope="col">${M(C,"stats.curve_point")} (${this.unit})</th>
              <th scope="col">${m}</th>
            </tr>
          </thead>
          <tbody>
            ${H.map(l=>t`<tr>
                <th scope="row">${h(C,l.date)}</th>
                <td>${n(C,l.value,2)}</td>
                <td>${n(C,l.moving_average,2)}</td>
              </tr>`)}
          </tbody>
        </table>
      </div>
    `}};var O1=class extends x{constructor(){super();this._file=null;this.categories=[],this.currency="EUR",this._values={},this._error="",this._busy=!1,this._entry=null}static{this.properties={hass:{attribute:!1},vehicle:{attribute:!1},categories:{attribute:!1},currency:{type:String},_values:{state:!0},_error:{state:!0},_busy:{state:!0},_entry:{state:!0}}}static{this.styles=[c,P]}get _dialog(){return this.renderRoot.querySelector("dialog")}async open(H=null){this._entry=H,this._error="",this._file=null,this._values=H?{date:H.date,amount:y(this.hass,H.amount,2),category_id:H.category_id,odometer:H.odometer!==null?y(this.hass,H.odometer,0):"",description:H.description}:{date:i1(),category_id:"maintenance"},this.categories.some(L=>L.id===this._values.category_id)||(this._values={...this._values,category_id:this.categories[0]?.id??"other"}),await this.updateComplete;let V=this.renderRoot.querySelector("#attachment");V&&(V.value=""),this._dialog.showModal(),this.renderRoot.querySelector("#amount")?.focus()}close(){this._dialog?.close()}_set(H,V){this._values={...this._values,[H]:V}}_saved(){this.dispatchEvent(new CustomEvent("saved",{bubbles:!0,composed:!0}))}async _submit(){this._error="";let H=b(this._values.amount??"");if(H===null){this._error=M(this.hass,"expense.amount",{currency:this.currency});return}let V=b(this._values.odometer??""),L={amount:H,category_id:this._values.category_id,description:this._values.description??"",date:this._values.date||i1(),odometer:V};this._entry&&(L.expense_id=this._entry.id),this._busy=!0;try{let e=await g2(this.hass,this.vehicle.id,L);if(this._file)try{await f2(this.hass,this.vehicle.id,e.id,this._file)}catch(i){this._entry=e,this._error=M(this.hass,"expense.attachment_error",{code:i.message}),this._saved();return}this.close(),this._saved()}catch(e){this._error=M(this.hass,"common.error",{message:e.message})}finally{this._busy=!1}}async _viewAttachment(){if(!this._entry)return;let H=await b2(this.hass,this.vehicle.id,this._entry.id);window.open(H,"_blank","noopener")}async _removeAttachment(){this._entry&&(await O2(this.hass,this.vehicle.id,this._entry.id),this._entry={...this._entry,attachment:null},this._saved())}render(){if(!this.vehicle)return o;let H=this.hass,V=M(H,this._entry?"expense.title_edit":"expense.title_new");return t`<dialog aria-labelledby="expense-title">
      <form
        method="dialog"
        @submit=${L=>{L.preventDefault(),this._submit()}}
      >
        <header>
          <h2 id="expense-title">${V} · ${this.vehicle.name}</h2>
          <button
            type="button"
            class="icon"
            aria-label=${M(H,"common.close")}
            @click=${()=>this.close()}
          >
            ${v(R)}
          </button>
        </header>
        <div class="body">
          <div class="grid">
            <div class="field">
              <label for="amount">${M(H,"expense.amount",{currency:this.currency})}</label>
              <input
                id="amount"
                inputmode="decimal"
                autocomplete="off"
                required
                .value=${this._values.amount??""}
                @input=${L=>this._set("amount",L.target.value)}
              />
            </div>
            <div class="field">
              <label for="category">${M(H,"expense.category")}</label>
              <select
                id="category"
                @change=${L=>this._set("category_id",L.target.value)}
              >
                ${this.categories.map(L=>t`<option value=${L.id} ?selected=${L.id===this._values.category_id}>
                      ${L.label}
                    </option>`)}
              </select>
            </div>
            <div class="field">
              <label for="date">${M(H,"fuel.date")}</label>
              <input
                id="date"
                type="date"
                .value=${this._values.date??""}
                @change=${L=>this._set("date",L.target.value)}
              />
            </div>
            <div class="field">
              <label for="odometer">
                ${M(H,"expense.odometer",{unit:this.vehicle.units.distance})}
              </label>
              <input
                id="odometer"
                inputmode="decimal"
                autocomplete="off"
                aria-describedby="odometer-hint"
                .value=${this._values.odometer??""}
                @input=${L=>this._set("odometer",L.target.value)}
              />
              <span class="hint" id="odometer-hint">${M(H,"common.optional")}</span>
            </div>
          </div>
          <div class="field">
            <label for="description">${M(H,"expense.description")}</label>
            <textarea
              id="description"
              .value=${this._values.description??""}
              @input=${L=>this._set("description",L.target.value)}
            ></textarea>
          </div>
          <div class="field">
            <label for="attachment">${M(H,"expense.attachment")}</label>
            <input
              id="attachment"
              type="file"
              accept="image/jpeg,image/png,image/webp,application/pdf"
              @change=${L=>{this._file=L.target.files?.[0]??null}}
            />
            ${this._entry?.attachment?t`<div class="check">
                  <button type="button" @click=${()=>this._viewAttachment()}>
                    ${v(a1)} ${M(H,"expense.attachment_view")}
                  </button>
                  <button type="button" class="danger" @click=${()=>this._removeAttachment()}>
                    ${M(H,"expense.attachment_remove")}
                  </button>
                </div>`:o}
          </div>
          ${this._error?t`<p class="error" role="alert">${this._error}</p>`:o}
        </div>
        <footer>
          <button type="button" @click=${()=>this.close()}>${M(H,"common.cancel")}</button>
          <button type="submit" class="primary" ?disabled=${this._busy}>
            ${M(H,"common.save")}
          </button>
        </footer>
      </form>
    </dialog>`}};function $2(r,C,H,V,L){let e=C.details,i=(a,p)=>typeof e[a]=="number"?n(r,e[a],p):String(e[a]??""),d=`warning.${C.code}`;return M(r,d,{previous:i("previous",0),next:i("next",0),value:i("value",2),min:i("min",1),max:i("max",1),capacity:i("capacity",1),expected:typeof e.expected=="number"?Z(r,e.expected,L):"",unit:H.units.distance,volume:H.units.volume[V]??"L",consumption:H.units.consumption[V]??""})}var E2=["volume","unit_price","total_cost"],t5={volume:2,unit_price:3,total_cost:2},b1=class extends x{static{this.properties={hass:{attribute:!1},vehicle:{attribute:!1},currency:{type:String},_values:{state:!0},_edits:{state:!0},_warnings:{state:!0},_error:{state:!0},_busy:{state:!0},_entry:{state:!0}}}static{this.styles=[c,P]}constructor(){super(),this.currency="EUR",this._values={},this._edits=[],this._warnings=[],this._error="",this._busy=!1,this._entry=null}get _dialog(){return this.renderRoot.querySelector("dialog")}async open(C=null){if(this._entry=C,this._warnings=[],this._error="",C)this._values={odometer:y(this.hass,C.odometer,1),volume:y(this.hass,C.volume,2),unit_price:y(this.hass,C.unit_price,3),total_cost:y(this.hass,C.total_cost,2),date:C.date,time:C.time??"",fuel_type:C.fuel_type,full_tank:C.full_tank?"1":"",station:C.station??"",notes:C.notes},this._edits=["volume","total_cost"];else{this._values={full_tank:"1",fuel_type:this.vehicle.fuel_types[0]},this._edits=[];try{let V=await u2(this.hass,this.vehicle.id),L=V.unit_price[V.fuel_type];this._values={...this._values,odometer:V.odometer!==null?String(X1(V.odometer,0)):"",fuel_type:V.fuel_type,date:V.date,time:V.time,unit_price:L!==null?y(this.hass,L,3):""},L!==null&&(this._edits=["unit_price"])}catch(V){this._error=V.message}}await this.updateComplete,this._dialog.showModal();let H=this.renderRoot.querySelector("#odometer");H?.focus(),H?.select()}close(){this._dialog?.close()}willUpdate(C){C.has("vehicle")&&this.vehicle&&!this._values.fuel_type&&(this._values={...this._values,fuel_type:this.vehicle.fuel_types[0]})}_derivedField(){let C=this._edits.slice(-2);return C.length<2?null:E2.find(H=>!C.includes(H))??null}_onAmountInput(C,H){let V=this._edits.filter(i=>i!==C);V.push(C),this._edits=V;let L={...this._values,[C]:H},e=this._derivedField();if(e){let i=b(L.volume??""),d=b(L.unit_price??""),a=b(L.total_cost??""),p=null;e==="total_cost"&&i!==null&&d!==null&&(p=i*d),e==="unit_price"&&i&&a!==null&&(p=a/i),e==="volume"&&d&&a!==null&&(p=a/d),L[e]=p!==null?y(this.hass,p,t5[e]):""}this._values=L,this._warnings=[]}_set(C,H){this._values={...this._values,[C]:H},this._warnings=[]}async _submit(C=!1){this._error="";let H=this._edits.slice(-2),V=b(this._values.odometer??"");if(V===null){this._error=M(this.hass,"fuel.odometer",{unit:this.vehicle.units.distance});return}let L={odometer:V,full_tank:!!this._values.full_tank,fuel_type:this._values.fuel_type,station:this._values.station||null,notes:this._values.notes??"",confirm:C};for(let e of H){let i=b(this._values[e]??"");i!==null&&(L[e]=i)}if(E2.filter(e=>e in L).length<2){this._error=M(this.hass,"fuel.need_two");return}this._values.date&&(L.date=this._values.date),this._values.time?L.time=this._values.time:this._values.date&&(L.time=null),this._entry&&(L.entry_id=this._entry.id),this._busy=!0;try{let e=await S2(this.hass,this.vehicle.id,L);if(!e.saved){this._warnings=e.warnings;return}this.close(),this.dispatchEvent(new CustomEvent("saved",{bubbles:!0,composed:!0}))}catch(e){this._error=M(this.hass,"common.error",{message:e.message})}finally{this._busy=!1}}_amountInput(C,H){let V=this._derivedField()===C;return t`<div class="field">
      <label for=${C}>${H}</label>
      <input
        id=${C}
        name=${C}
        inputmode="decimal"
        autocomplete="off"
        aria-describedby=${V?`${C}-hint`:o}
        class=${V?"computed":""}
        .value=${this._values[C]??""}
        @input=${L=>this._onAmountInput(C,L.target.value)}
      />
      ${V?t`<span class="hint" id="${C}-hint">${M(this.hass,"fuel.computed")}</span>`:o}
    </div>`}render(){if(!this.vehicle)return o;let C=this.hass,H=this._values.fuel_type??this.vehicle.fuel_types[0],V=this.vehicle.units.volume[H]??"L",L=M(C,this._entry?"fuel.title_edit":"fuel.title_new");return t`<dialog aria-labelledby="fuel-title" @close=${()=>this._warnings=[]}>
      <form
        method="dialog"
        @submit=${e=>{e.preventDefault(),this._submit()}}
      >
        <header>
          <h2 id="fuel-title">${L} · ${this.vehicle.name}</h2>
          <button
            type="button"
            class="icon"
            aria-label=${M(C,"common.close")}
            @click=${()=>this.close()}
          >
            ${v(R)}
          </button>
        </header>
        <div class="body">
          <div class="grid">
            <div class="field">
              <label for="odometer">
                ${M(C,"fuel.odometer",{unit:this.vehicle.units.distance})}
              </label>
              <input
                id="odometer"
                name="odometer"
                inputmode="decimal"
                autocomplete="off"
                required
                .value=${this._values.odometer??""}
                @input=${e=>this._set("odometer",e.target.value)}
              />
            </div>
            ${this._amountInput("volume",M(C,"fuel.volume",{unit:V}))}
            ${this._amountInput("total_cost",M(C,"fuel.total",{currency:this.currency}))}
            ${this._amountInput("unit_price",M(C,"fuel.unit_price",{currency:this.currency,unit:V}))}
          </div>
          <label class="check">
            <input
              type="checkbox"
              .checked=${!!this._values.full_tank}
              @change=${e=>this._set("full_tank",e.target.checked?"1":"")}
            />
            ${M(C,"fuel.full_tank")}
          </label>
          <details ?open=${!!this._entry}>
            <summary>${M(C,"common.more")}</summary>
            <div class="grid">
              <div class="field">
                <label for="date">${M(C,"fuel.date")}</label>
                <input
                  id="date"
                  type="date"
                  .value=${this._values.date??""}
                  @change=${e=>this._set("date",e.target.value)}
                />
              </div>
              <div class="field">
                <label for="time">${M(C,"fuel.time")}</label>
                <input
                  id="time"
                  type="time"
                  .value=${this._values.time??""}
                  @change=${e=>this._set("time",e.target.value)}
                />
              </div>
              ${this.vehicle.fuel_types.length>1?t`<div class="field">
                    <label for="fuel_type">${M(C,"fuel.fuel_type")}</label>
                    <select
                      id="fuel_type"
                      .value=${H}
                      @change=${e=>this._set("fuel_type",e.target.value)}
                    >
                      ${this.vehicle.fuel_types.map(e=>t`<option value=${e} ?selected=${e===H}>
                            ${M(C,`fuel_type.${e}`)}
                          </option>`)}
                    </select>
                  </div>`:o}
              <div class="field">
                <label for="station">${M(C,"fuel.station")}</label>
                <input
                  id="station"
                  autocomplete="off"
                  .value=${this._values.station??""}
                  @input=${e=>this._set("station",e.target.value)}
                />
              </div>
            </div>
            <div class="field" style="margin-top: var(--vl-gap)">
              <label for="notes">${M(C,"fuel.notes")}</label>
              <textarea
                id="notes"
                .value=${this._values.notes??""}
                @input=${e=>this._set("notes",e.target.value)}
              ></textarea>
            </div>
          </details>
          ${this._warnings.length?t`<div class="warnings" role="alert">
                ${M(C,"fuel.warnings")}
                <ul>
                  ${this._warnings.map(e=>t`<li>${$2(C,e,this.vehicle,H,this.currency)}</li>`)}
                </ul>
              </div>`:o}
          ${this._error?t`<p class="error" role="alert">${this._error}</p>`:o}
        </div>
        <footer>
          <button type="button" @click=${()=>this.close()}>${M(C,"common.cancel")}</button>
          ${this._warnings.length?t`<button
                type="button"
                class="primary"
                ?disabled=${this._busy}
                @click=${()=>this._submit(!0)}
              >
                ${M(C,"fuel.save_anyway")}
              </button>`:t`<button type="submit" class="primary" ?disabled=${this._busy}>
                ${M(C,"common.save")}
              </button>`}
        </footer>
      </form>
    </dialog>`}};var y1=class extends x{constructor(){super();this._file=null;this.categories=[],this.currency="EUR",this._preview=null,this._message="",this._error="",this._busy=!1}static{this.properties={hass:{attribute:!1},vehicle:{attribute:!1},categories:{attribute:!1},currency:{type:String},_preview:{state:!0},_message:{state:!0},_error:{state:!0},_busy:{state:!0}}}static{this.styles=[c,P,u`
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
    `]}get _dialog(){return this.renderRoot.querySelector("dialog")}async open(){this._preview=null,this._message="",this._error="",this._file=null,await this.updateComplete;let H=this.renderRoot.querySelector("#file");H&&(H.value=""),this._dialog.showModal(),H?.focus()}close(){this._dialog?.close()}_errorText(H){return["unknown_format","empty","too_large","too_many_rows"].includes(H)?M(this.hass,`import.error_${H}`):M(this.hass,"common.error",{message:H})}async _analyse(H){if(this._file=H,this._preview=null,this._message="",this._error="",!!H){this._busy=!0;try{this._preview=await q1(this.hass,this.vehicle.id,H,!1)}catch(V){this._error=this._errorText(V.message)}finally{this._busy=!1}}}async _apply(){if(this._file){this._busy=!0;try{let H=await q1(this.hass,this.vehicle.id,this._file,!0);this._message=M(this.hass,"import.done",{count:H.added}),this._preview=null,this.dispatchEvent(new CustomEvent("saved",{bubbles:!0,composed:!0}))}catch(H){this._error=this._errorText(H.message)}finally{this._busy=!1}}}_describe(H,V){let L=this.hass,e=this.vehicle.units.distance,i=typeof V.date=="string"?h(L,V.date):"";if(H==="fuel"){let a=String(V.fuel_type??this.vehicle.fuel_types[0]),p=this.vehicle.units.volume[a]??"L";return`${i} \xB7 ${n(L,V.odometer,0)} ${e} \xB7 ${n(L,V.volume,2)} ${p} \xB7 ${Z(L,V.total_cost,this.currency)}`}if(H==="expenses"){let p=this.categories.find(s=>s.id===V.category_id)?.label??"";return`${i} \xB7 ${Z(L,V.amount,this.currency)}${p?` \xB7 ${p}`:""}${V.description?` \xB7 ${String(V.description)}`:""}`}if(H==="odometer")return`${i} \xB7 ${n(L,V.odometer,0)} ${e}`;let d=[typeof V.due_date=="string"?h(L,V.due_date):"",typeof V.due_odometer=="number"?`${n(L,V.due_odometer,0)} ${e}`:""].filter(Boolean);return[String(V.label??""),...d].join(" \xB7 ")}_renderPreview(H){let V=this.hass,L=M(V,`import.kind_${H.kind}`);return t`
      <p aria-live="polite">${M(V,"import.summary",{kind:L,...H.counts})}</p>
      ${H.new_categories.length?t`<p>${M(V,"import.new_categories",{names:H.new_categories.join(", ")})}</p>`:o}
      ${H.lines.length?t`<ul class="lines">
            ${H.lines.map(e=>t`<li>
                <span class="status ${e.status}">
                  ${M(V,`import.status_${e.status}`)}
                </span>
                <span class="detail">
                  <span class="line-number">${M(V,"import.line",{line:e.line})}</span>
                  —
                  ${e.status==="error"?e.message:e.values?this._describe(H.kind,e.values):""}
                </span>
              </li>`)}
          </ul>`:o}
      ${H.truncated?t`<p class="muted">${M(V,"import.truncated")}</p>`:o}
    `}render(){if(!this.vehicle)return o;let H=this.hass,V=this._preview?.counts.new??0;return t`<dialog aria-labelledby="import-title">
      <form
        method="dialog"
        @submit=${L=>{L.preventDefault(),V&&this._apply()}}
      >
        <header>
          <h2 id="import-title">${M(H,"import.title")} · ${this.vehicle.name}</h2>
          <button
            type="button"
            class="icon"
            aria-label=${M(H,"common.close")}
            @click=${()=>this.close()}
          >
            ${v(R)}
          </button>
        </header>
        <div class="body">
          <p class="muted" id="import-help">${M(H,"import.help")}</p>
          <div class="field">
            <label for="file">${M(H,"import.file")}</label>
            <input
              id="file"
              type="file"
              accept=".csv,text/csv"
              aria-describedby="import-help"
              @change=${L=>this._analyse(L.target.files?.[0]??null)}
            />
          </div>
          ${this._busy&&!this._preview?t`<p aria-live="polite">${M(H,"import.analyzing")}</p>`:o}
          ${this._preview?this._renderPreview(this._preview):o}
          ${this._message?t`<p role="status">${this._message}</p>`:o}
          ${this._error?t`<p class="error" role="alert">${this._error}</p>`:o}
        </div>
        <footer>
          <button type="button" @click=${()=>this.close()}>
            ${M(H,this._message?"common.close":"common.cancel")}
          </button>
          ${this._preview?t`<button type="submit" class="primary" ?disabled=${this._busy||!V}>
                ${M(H,"import.confirm",{count:V})}
              </button>`:o}
        </footer>
      </form>
    </dialog>`}};var i5="#2e7d32",k1=["#1e88e5","#8e24aa","#00897b","#f4511e","#3949ab","#e53935"],A1=220,_={top:12,right:8,bottom:28,left:56};function o5(r){if(r<=0)return 1;let C=10**Math.floor(Math.log10(r));return([1,2,2.5,5,10].find(V=>V*C>=r)??10)*C}var w1=class extends x{static{this.properties={hass:{attribute:!1},data:{attribute:!1},categories:{attribute:!1},currency:{type:String},_width:{state:!0}}}static{this.styles=[c,u`
      :host {
        display: block;
        position: relative;
      }
      svg.chart {
        width: 100%;
        height: ${A1}px;
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
    `]}constructor(){super(),this.data=[],this.categories=[],this.currency="EUR",this._width=600}connectedCallback(){super.connectedCallback(),this._observer=new ResizeObserver(([C])=>{let H=Math.round(C.contentRect.width);H>0&&Math.abs(H-this._width)>2&&(this._width=H)}),this._observer.observe(this)}disconnectedCallback(){super.disconnectedCallback(),this._observer?.disconnect()}_series(){let C=new Set(this.data.flatMap(L=>Object.keys(L.values))),H=[];C.has("fuel")&&H.push({id:"fuel",label:M(this.hass,"category.fuel"),color:i5});let V=0;for(let L of this.categories)C.has(L.id)&&H.push({id:L.id,label:L.label,color:L.color??k1[V++%k1.length]});for(let L of C)H.some(e=>e.id===L)||H.push({id:L,label:L,color:k1[V++%k1.length]});return H}render(){let C=this.hass,H=this._series(),V=this.data.map(m=>Object.values(m.values).reduce((k,l)=>k+l,0)),L=o5(Math.max(0,...V));if(!V.some(m=>m>0))return t`<p class="empty">${M(C,"chart.empty")}</p>`;let e=this._width,i=e-_.left-_.right,d=A1-_.top-_.bottom,a=i/this.data.length,p=Math.min(36,a*.7),s=a<34?2:1,A=m=>_.top+d-m/L*d,g=[0,.25,.5,.75,1].map(m=>m*L),S=m=>Z(C,m,this.currency),B=m=>Z(C,m,this.currency,0),J=M(C,"chart.summary",{count:this.data.length});return t`
      <svg
        class="chart"
        viewBox="0 0 ${e} ${A1}"
        height=${A1}
        role="img"
        aria-label=${J}
      >
        ${g.map(m=>F`
            <line class="grid" x1=${_.left} x2=${e-_.right} y1=${A(m)} y2=${A(m)}></line>
            <text class="axis" x=${_.left-6} y=${A(m)+4} text-anchor="end">${B(m)}</text>`)}
        ${this.data.map((m,k)=>{let l=_.left+k*a+(a-p)/2,O=0,N2=[`${t1(C,m.month)} \u2014 ${M(C,"chart.total")} ${S(V[k])}`,...H.filter(I=>m.values[I.id]).map(I=>`${I.label} : ${S(m.values[I.id])}`)].join(`
`);return F`<g class="bar">
            <title>${N2}</title>
            <rect class="hit" x=${_.left+k*a} y=${_.top} width=${a} height=${d} fill="transparent"></rect>
            ${H.map(I=>{let T1=m.values[I.id]??0;if(T1<=0)return o;let H2=A(O+T1),I2=A(O)-H2;return O+=T1,F`<rect x=${l} y=${H2} width=${p} height=${Math.max(I2,.5)}
                fill=${I.color} stroke="var(--card-background-color, #fff)" stroke-width="1"></rect>`})}
            ${(this.data.length-1-k)%s===0?F`<text class="axis" x=${l+p/2} y=${A1-8} text-anchor="middle">${P2(C,m.month)}</text>`:o}
          </g>`})}
      </svg>
      <ul class="legend" aria-label=${M(C,"section.monthly")}>
        ${H.map(m=>t`<li>
            <span class="swatch" style="background:${m.color}" aria-hidden="true"></span>${m.label}
          </li>`)}
      </ul>
      <div class="visually-hidden"><table>
        <caption>${J}</caption>
        <thead>
          <tr>
            <th scope="col">${M(C,"chart.month")}</th>
            ${H.map(m=>t`<th scope="col">${m.label}</th>`)}
            <th scope="col">${M(C,"chart.total")}</th>
          </tr>
        </thead>
        <tbody>
          ${this.data.map((m,k)=>t`<tr>
              <th scope="row">${t1(C,m.month)}</th>
              ${H.map(l=>t`<td>${S(m.values[l.id]??0)}</td>`)}
              <td>${S(V[k])}</td>
            </tr>`)}
        </tbody>
      </table></div>
    `}};var a5=["due_odometer","alert_days","alert_distance","interval_days","interval_distance"],_1=class extends x{static{this.properties={hass:{attribute:!1},vehicle:{attribute:!1},_values:{state:!0},_error:{state:!0},_busy:{state:!0},_entry:{state:!0}}}static{this.styles=[c,P,u`
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
    `]}constructor(){super(),this._values={},this._error="",this._busy=!1,this._entry=null}get _dialog(){return this.renderRoot.querySelector("dialog")}async open(C=null){this._entry=C,this._error="";let H=(V,L=0)=>V===null?"":y(this.hass,V,L);this._values=C?{label:C.label,kind:C.kind,due_date:C.due_date??"",due_odometer:H(C.due_odometer),alert_days:H(C.alert_days),alert_distance:H(C.alert_distance),interval_days:H(C.interval_days),interval_distance:H(C.interval_distance)}:{kind:"both",due_date:i1(365),alert_days:"30",alert_distance:"1000"},await this.updateComplete,this._dialog.showModal(),this.renderRoot.querySelector("#label")?.focus()}close(){this._dialog?.close()}_set(C,H){this._values={...this._values,[C]:H}}async _submit(){this._error="";let C={label:this._values.label??"",kind:this._values.kind,due_date:this._values.due_date||null};for(let H of a5)C[H]=b(this._values[H]??"");this._entry&&(C.reminder_id=this._entry.id),this._busy=!0;try{await k2(this.hass,this.vehicle.id,C),this.close(),this.dispatchEvent(new CustomEvent("saved",{bubbles:!0,composed:!0}))}catch(H){this._error=M(this.hass,"common.error",{message:H.message})}finally{this._busy=!1}}_number(C,H,V){return t`<div class="field">
      <label for=${C}>${H}</label>
      <input
        id=${C}
        inputmode="decimal"
        autocomplete="off"
        aria-describedby=${V?`${C}-hint`:o}
        .value=${this._values[C]??""}
        @input=${L=>this._set(C,L.target.value)}
      />
      ${V?t`<span class="hint" id="${C}-hint">${V}</span>`:o}
    </div>`}render(){if(!this.vehicle)return o;let C=this.hass,H=this.vehicle.units.distance,V=this._values.kind??"both",L=V!=="distance",e=V!=="date",i=M(C,this._entry?"reminder.title_edit":"reminder.title_new"),d=[["date",M(C,"reminder.kind_date")],["distance",M(C,"reminder.kind_distance")],["both",M(C,"reminder.kind_both")]];return t`<dialog aria-labelledby="reminder-title">
      <form
        method="dialog"
        @submit=${a=>{a.preventDefault(),this._submit()}}
      >
        <header>
          <h2 id="reminder-title">${i} · ${this.vehicle.name}</h2>
          <button
            type="button"
            class="icon"
            aria-label=${M(C,"common.close")}
            @click=${()=>this.close()}
          >
            ${v(R)}
          </button>
        </header>
        <div class="body">
          <div class="field">
            <label for="label">${M(C,"reminder.label")}</label>
            <input
              id="label"
              required
              autocomplete="off"
              .value=${this._values.label??""}
              @input=${a=>this._set("label",a.target.value)}
            />
          </div>
          <div class="field">
            <label for="kind">${M(C,"reminder.kind")}</label>
            <select
              id="kind"
              @change=${a=>this._set("kind",a.target.value)}
            >
              ${d.map(([a,p])=>t`<option value=${a} ?selected=${a===V}>${p}</option>`)}
            </select>
          </div>
          ${L?t`<fieldset>
                <legend>${M(C,"reminder.kind_date")}</legend>
                <div class="grid">
                  <div class="field">
                    <label for="due_date">${M(C,"reminder.due_date")}</label>
                    <input
                      id="due_date"
                      type="date"
                      required
                      .value=${this._values.due_date??""}
                      @change=${a=>this._set("due_date",a.target.value)}
                    />
                  </div>
                  ${this._number("alert_days",M(C,"reminder.alert_days"))}
                  ${this._number("interval_days",M(C,"reminder.interval_days"),M(C,"reminder.recurrence_hint"))}
                </div>
              </fieldset>`:o}
          ${e?t`<fieldset>
                <legend>${M(C,"reminder.kind_distance")}</legend>
                <div class="grid">
                  ${this._number("due_odometer",M(C,"reminder.due_odometer",{unit:H}))}
                  ${this._number("alert_distance",M(C,"reminder.alert_distance",{unit:H}))}
                  ${this._number("interval_distance",M(C,"reminder.interval_distance",{unit:H}),M(C,"reminder.recurrence_hint"))}
                </div>
              </fieldset>`:o}
          ${this._error?t`<p class="error" role="alert">${this._error}</p>`:o}
        </div>
        <footer>
          <button type="button" @click=${()=>this.close()}>${M(C,"common.cancel")}</button>
          <button type="submit" class="primary" ?disabled=${this._busy}>
            ${M(C,"common.save")}
          </button>
        </footer>
      </form>
    </dialog>`}};var D2={due:0,alert:1,ok:2,inactive:3},B1=class extends x{static{this.properties={hass:{attribute:!1},vehicle:{attribute:!1},_items:{state:!0}}}static{this.styles=[c,u`
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
    `]}constructor(){super(),this._items=[]}async reload(){this.vehicle&&(this._items=await y2(this.hass,this.vehicle.id))}updated(C){C.has("vehicle")&&this.vehicle&&this.reload()}_confirm(){return this.renderRoot.querySelector("vl-confirm-dialog")}async _done(C){let H=M(this.hass,C.recurring?"reminders.next_recurring":"reminders.next_once");await this._confirm().ask(M(this.hass,"reminders.done_confirm",{label:C.label,next:H}),M(this.hass,"reminders.done"),!1)&&(await _2(this.hass,this.vehicle.id,C.id),await this.reload())}async _delete(C){await this._confirm().ask(M(this.hass,"reminders.delete_confirm",{label:C.label}))&&(await w2(this.hass,this.vehicle.id,C.id),await this.reload())}openEditor(C=null){this.renderRoot.querySelector("vl-reminder-dialog").open(C)}_detail(C){let H=this.hass,V=this.vehicle.units.distance,L=[];if(C.due_date){let i=C.days_left??0,d=i>=0?M(H,"reminders.left_days",{days:i}):M(H,"reminders.late_days",{days:-i});L.push(`${h(H,C.due_date)}${C.active?` (${d})`:""}`)}if(C.due_odometer!==null){let i=`${n(H,C.due_odometer,0)} ${V}`;if(C.active&&C.distance_left!==null){let d=C.distance_left>=0?M(H,"reminders.left_distance",{distance:n(H,C.distance_left,0),unit:V}):M(H,"reminders.late_distance",{distance:n(H,-C.distance_left,0),unit:V});i+=` (${d})`}L.push(i)}let e=[];return C.interval_days&&e.push(`${n(H,C.interval_days,0)} j`),C.interval_distance&&e.push(`${n(H,C.interval_distance,0)} ${V}`),e.length&&L.push(M(H,"reminders.every",{value:e.join(" / ")})),L.join(" \xB7 ")}render(){if(!this.vehicle)return o;let C=this.hass,H=[...this._items].sort((V,L)=>D2[V.state]-D2[L.state]);return t`
      ${H.length?t`<ul>
            ${H.map(V=>t`<li class=${V.state}>
                <span class="state ${V.state}">${M(C,`reminders.state_${V.state}`)}</span>
                <div class="main">
                  <span>${V.label}</span>
                  <span class="sub">${this._detail(V)}</span>
                </div>
                <span class="actions">
                  ${V.active?t`<button
                        class="icon"
                        aria-label=${M(C,"reminders.done_long",{label:V.label})}
                        @click=${()=>this._done(V)}
                      >
                        ${v(Y1)}
                      </button>`:o}
                  <button
                    class="icon"
                    aria-label="${M(C,"common.edit")} : ${V.label}"
                    @click=${()=>this.openEditor(V)}
                  >
                    ${v(E)}
                  </button>
                  <button
                    class="icon"
                    aria-label="${M(C,"common.delete")} : ${V.label}"
                    @click=${()=>this._delete(V)}
                  >
                    ${v($)}
                  </button>
                </span>
              </li>`)}
          </ul>`:t`<p class="empty">${M(C,"reminders.none")}</p>`}
      <vl-reminder-dialog
        .hass=${C}
        .vehicle=${this.vehicle}
        @saved=${()=>this.reload()}
      ></vl-reminder-dialog>
      <vl-confirm-dialog .hass=${C}></vl-confirm-dialog>
    `}};var W2="carbu-panel-vehicle",A5=[{type:"carbu-card",title:void 0},{type:"carbu-stats-card",title:"panel.stats"},{type:"carbu-journal-card",title:"panel.journal"}];function d5(){try{return window.localStorage.getItem(W2)??void 0}catch{return}}function p5(r){try{window.localStorage.setItem(W2,r)}catch{}}var P1=class extends x{constructor(){super();this._cards=[];this._started=!1;this.narrow=!1,this._vehicles=[],this._loading=!0,this._error="",this._vehicleId=d5()}static{this.properties={hass:{attribute:!1},narrow:{type:Boolean},_vehicles:{state:!0},_vehicleId:{state:!0},_loading:{state:!0},_error:{state:!0}}}static{this.styles=[c,u`
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
    `]}connectedCallback(){super.connectedCallback(),this.hass&&this._start()}disconnectedCallback(){super.disconnectedCallback(),this._started=!1;let H=this._unsubscribe;this._unsubscribe=void 0,H?.then(V=>V()).catch(()=>{})}updated(){this._start();for(let H of this._cards)H.hass=this.hass}_start(){this._started||!this.hass||!this.isConnected||(this._started=!0,this._load(),this._unsubscribe=s1(this.hass,()=>{this._load()}),this._unsubscribe.catch(()=>this._unsubscribe=void 0))}async _load(){try{let H=await X(this.hass);this._vehicles=H.vehicles,this._error=""}catch(H){this._error=H.code??H.message}finally{this._loading=!1}}get _current(){return this._vehicles.find(H=>H.id===this._vehicleId)??this._vehicles[0]}_cardsFor(H){return this._cardsVehicle!==H&&(this._cards=A5.map(({type:V,title:L})=>{let e=document.createElement(V);return e.setConfig({type:`custom:${V}`,vehicle_id:H,...L?{title:M(this.hass,L)}:{}}),e.hass=this.hass,V==="carbu-journal-card"&&e.classList.add("wide"),e}),this._cardsVehicle=H),this._cards}_select(H){let V=H.target.value;this._vehicleId=V,p5(V)}_body(){let H=this.hass;if(this._loading)return t`<p class="message">${M(H,"common.loading")}</p>`;if(this._error){let L=this._error==="not_loaded"?M(H,"common.not_loaded"):this._error;return t`<p class="message error" role="alert">${L}</p>`}let V=this._current;return V?t`<div class="content">${this._cardsFor(V.id)}</div>`:t`<p class="message">
        ${M(H,"panel.no_vehicle")}
        <a href="/config/integrations/integration/carbu">${M(H,"panel.open_integration")}</a>
      </p>`}render(){let H=this._current;return t`
      <div class="toolbar">
        <ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>
        <h1 class="title">Carbu</h1>
        ${this._vehicles.length>1?t`<select
              aria-label=${M(this.hass,"panel.vehicle")}
              .value=${H?.id??""}
              @change=${this._select}
            >
              ${this._vehicles.map(V=>t`<option value=${V.id} ?selected=${V.id===H?.id}>${V.name}</option>`)}
            </select>`:o}
      </div>
      ${this._body()}
    `}};var m5={"carbu-panel":P1,"carbu-card":Z1,"carbu-journal-card":c1,"carbu-stats-card":S1,"carbu-card-editor":u1,"vl-fuel-dialog":b1,"vl-expense-dialog":O1,"vl-confirm-dialog":h1,"vl-monthly-chart":w1,"vl-consumption-chart":f1,"vl-reminder-dialog":_1,"vl-reminder-list":B1,"vl-import-dialog":y1};for(let[r,C]of Object.entries(m5))customElements.get(r)||customElements.define(r,C);var Y={language:navigator.language};window.customCards=window.customCards??[];for(let r of[{type:"carbu-card",name:M(Y,"card.name"),description:M(Y,"card.description")},{type:"carbu-journal-card",name:M(Y,"journal.name"),description:M(Y,"journal.description")},{type:"carbu-stats-card",name:M(Y,"stats.name"),description:M(Y,"stats.description")}])window.customCards.some(C=>C.type===r.type)||window.customCards.push({...r,preview:!0});
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
