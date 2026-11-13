var r1=globalThis,e1=r1.ShadowRoot&&(r1.ShadyCSS===void 0||r1.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,c1=Symbol(),I1=new WeakMap,z=class{constructor(C,H,V){if(this._$cssResult$=!0,V!==c1)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=C,this.t=H}get styleSheet(){let C=this.o,H=this.t;if(e1&&C===void 0){let V=H!==void 0&&H.length===1;V&&(C=I1.get(H)),C===void 0&&((this.o=C=new CSSStyleSheet).replaceSync(this.cssText),V&&I1.set(H,C))}return C}toString(){return this.cssText}},U1=M=>new z(typeof M=="string"?M:M+"",void 0,c1),Z=(M,...C)=>{let H=M.length===1?M[0]:C.reduce((V,L,r)=>V+(t=>{if(t._$cssResult$===!0)return t.cssText;if(typeof t=="number")return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(L)+M[r+1],M[0]);return new z(H,M,c1)},Q1=(M,C)=>{if(e1)M.adoptedStyleSheets=C.map(H=>H instanceof CSSStyleSheet?H:H.styleSheet);else for(let H of C){let V=document.createElement("style"),L=r1.litNonce;L!==void 0&&V.setAttribute("nonce",L),V.textContent=H.cssText,M.appendChild(V)}},h1=e1?M=>M:M=>M instanceof CSSStyleSheet?(C=>{let H="";for(let V of C.cssRules)H+=V.cssText;return U1(H)})(M):M;var{is:h2,defineProperty:O2,getOwnPropertyDescriptor:f2,getOwnPropertyNames:g2,getOwnPropertySymbols:k2,getPrototypeOf:y2}=Object,t1=globalThis,G1=t1.trustedTypes,b2=G1?G1.emptyScript:"",w2=t1.reactiveElementPolyfillSupport,K=(M,C)=>M,O1={toAttribute(M,C){switch(C){case Boolean:M=M?b2:null;break;case Object:case Array:M=M==null?M:JSON.stringify(M)}return M},fromAttribute(M,C){let H=M;switch(C){case Boolean:H=M!==null;break;case Number:H=M===null?null:Number(M);break;case Object:case Array:try{H=JSON.parse(M)}catch{H=null}}return H}},K1=(M,C)=>!h2(M,C),z1={attribute:!0,type:String,converter:O1,reflect:!1,useDefault:!1,hasChanged:K1};Symbol.metadata??=Symbol("metadata"),t1.litPropertyMetadata??=new WeakMap;var y=class extends HTMLElement{static addInitializer(C){this._$Ei(),(this.l??=[]).push(C)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(C,H=z1){if(H.state&&(H.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(C)&&((H=Object.create(H)).wrapped=!0),this.elementProperties.set(C,H),!H.noAccessor){let V=Symbol(),L=this.getPropertyDescriptor(C,V,H);L!==void 0&&O2(this.prototype,C,L)}}static getPropertyDescriptor(C,H,V){let{get:L,set:r}=f2(this.prototype,C)??{get(){return this[H]},set(t){this[H]=t}};return{get:L,set(t){let d=L?.call(this);r?.call(this,t),this.requestUpdate(C,d,V)},configurable:!0,enumerable:!0}}static getPropertyOptions(C){return this.elementProperties.get(C)??z1}static _$Ei(){if(this.hasOwnProperty(K("elementProperties")))return;let C=y2(this);C.finalize(),C.l!==void 0&&(this.l=[...C.l]),this.elementProperties=new Map(C.elementProperties)}static finalize(){if(this.hasOwnProperty(K("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(K("properties"))){let H=this.properties,V=[...g2(H),...k2(H)];for(let L of V)this.createProperty(L,H[L])}let C=this[Symbol.metadata];if(C!==null){let H=litPropertyMetadata.get(C);if(H!==void 0)for(let[V,L]of H)this.elementProperties.set(V,L)}this._$Eh=new Map;for(let[H,V]of this.elementProperties){let L=this._$Eu(H,V);L!==void 0&&this._$Eh.set(L,H)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(C){let H=[];if(Array.isArray(C)){let V=new Set(C.flat(1/0).reverse());for(let L of V)H.unshift(h1(L))}else C!==void 0&&H.push(h1(C));return H}static _$Eu(C,H){let V=H.attribute;return V===!1?void 0:typeof V=="string"?V:typeof C=="string"?C.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(C=>this.enableUpdating=C),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(C=>C(this))}addController(C){(this._$EO??=new Set).add(C),this.renderRoot!==void 0&&this.isConnected&&C.hostConnected?.()}removeController(C){this._$EO?.delete(C)}_$E_(){let C=new Map,H=this.constructor.elementProperties;for(let V of H.keys())this.hasOwnProperty(V)&&(C.set(V,this[V]),delete this[V]);C.size>0&&(this._$Ep=C)}createRenderRoot(){let C=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Q1(C,this.constructor.elementStyles),C}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(C=>C.hostConnected?.())}enableUpdating(C){}disconnectedCallback(){this._$EO?.forEach(C=>C.hostDisconnected?.())}attributeChangedCallback(C,H,V){this._$AK(C,V)}_$ET(C,H){let V=this.constructor.elementProperties.get(C),L=this.constructor._$Eu(C,V);if(L!==void 0&&V.reflect===!0){let r=(V.converter?.toAttribute!==void 0?V.converter:O1).toAttribute(H,V.type);this._$Em=C,r==null?this.removeAttribute(L):this.setAttribute(L,r),this._$Em=null}}_$AK(C,H){let V=this.constructor,L=V._$Eh.get(C);if(L!==void 0&&this._$Em!==L){let r=V.getPropertyOptions(L),t=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:O1;this._$Em=L;let d=t.fromAttribute(H,r.type);this[L]=d??this._$Ej?.get(L)??d,this._$Em=null}}requestUpdate(C,H,V,L=!1,r){if(C!==void 0){let t=this.constructor;if(L===!1&&(r=this[C]),V??=t.getPropertyOptions(C),!((V.hasChanged??K1)(r,H)||V.useDefault&&V.reflect&&r===this._$Ej?.get(C)&&!this.hasAttribute(t._$Eu(C,V))))return;this.C(C,H,V)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(C,H,{useDefault:V,reflect:L,wrapped:r},t){V&&!(this._$Ej??=new Map).has(C)&&(this._$Ej.set(C,t??H??this[C]),r!==!0||t!==void 0)||(this._$AL.has(C)||(this.hasUpdated||V||(H=void 0),this._$AL.set(C,H)),L===!0&&this._$Em!==C&&(this._$Eq??=new Set).add(C))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(H){Promise.reject(H)}let C=this.scheduleUpdate();return C!=null&&await C,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[L,r]of this._$Ep)this[L]=r;this._$Ep=void 0}let V=this.constructor.elementProperties;if(V.size>0)for(let[L,r]of V){let{wrapped:t}=r,d=this[L];t!==!0||this._$AL.has(L)||d===void 0||this.C(L,void 0,r,d)}}let C=!1,H=this._$AL;try{C=this.shouldUpdate(H),C?(this.willUpdate(H),this._$EO?.forEach(V=>V.hostUpdate?.()),this.update(H)):this._$EM()}catch(V){throw C=!1,this._$EM(),V}C&&this._$AE(H)}willUpdate(C){}_$AE(C){this._$EO?.forEach(H=>H.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(C)),this.updated(C)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(C){return!0}update(C){this._$Eq&&=this._$Eq.forEach(H=>this._$ET(H,this[H])),this._$EM()}updated(C){}firstUpdated(C){}};y.elementStyles=[],y.shadowRootOptions={mode:"open"},y[K("elementProperties")]=new Map,y[K("finalized")]=new Map,w2?.({ReactiveElement:y}),(t1.reactiveElementVersions??=[]).push("2.1.2");var B1=globalThis,j1=M=>M,i1=B1.trustedTypes,q1=i1?i1.createPolicy("lit-html",{createHTML:M=>M}):void 0,V2="$lit$",w=`lit$${Math.random().toFixed(9).slice(2)}$`,L2="?"+w,B2=`<${L2}>`,_=document,q=()=>_.createComment(""),X=M=>M===null||typeof M!="object"&&typeof M!="function",P1=Array.isArray,P2=M=>P1(M)||typeof M?.[Symbol.iterator]=="function",f1=`[ 	
\f\r]`,j=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,X1=/-->/g,Y1=/>/g,F=RegExp(`>|${f1}(?:([^\\s"'>=/]+)(${f1}*=${f1}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),J1=/'/g,C2=/"/g,M2=/^(?:script|style|textarea|title)$/i,T1=M=>(C,...H)=>({_$litType$:M,strings:C,values:H}),i=T1(1),C1=T1(2),K2=T1(3),E=Symbol.for("lit-noChange"),A=Symbol.for("lit-nothing"),H2=new WeakMap,R=_.createTreeWalker(_,129);function r2(M,C){if(!P1(M)||!M.hasOwnProperty("raw"))throw Error("invalid template strings array");return q1!==void 0?q1.createHTML(C):C}var T2=(M,C)=>{let H=M.length-1,V=[],L,r=C===2?"<svg>":C===3?"<math>":"",t=j;for(let d=0;d<H;d++){let o=M[d],a,n,p=-1,h=0;for(;h<o.length&&(t.lastIndex=h,n=t.exec(o),n!==null);)h=t.lastIndex,t===j?n[1]==="!--"?t=X1:n[1]!==void 0?t=Y1:n[2]!==void 0?(M2.test(n[2])&&(L=RegExp("</"+n[2],"g")),t=F):n[3]!==void 0&&(t=F):t===F?n[0]===">"?(t=L??j,p=-1):n[1]===void 0?p=-2:(p=t.lastIndex-n[2].length,a=n[1],t=n[3]===void 0?F:n[3]==='"'?C2:J1):t===C2||t===J1?t=F:t===X1||t===Y1?t=j:(t=F,L=void 0);let u=t===F&&M[d+1].startsWith("/>")?" ":"";r+=t===j?o+B2:p>=0?(V.push(a),o.slice(0,p)+V2+o.slice(p)+w+u):o+w+(p===-2?d:u)}return[r2(M,r+(M[H]||"<?>")+(C===2?"</svg>":C===3?"</math>":"")),V]},Y=class M{constructor({strings:C,_$litType$:H},V){let L;this.parts=[];let r=0,t=0,d=C.length-1,o=this.parts,[a,n]=T2(C,H);if(this.el=M.createElement(a,V),R.currentNode=this.el.content,H===2||H===3){let p=this.el.content.firstChild;p.replaceWith(...p.childNodes)}for(;(L=R.nextNode())!==null&&o.length<d;){if(L.nodeType===1){if(L.hasAttributes())for(let p of L.getAttributeNames())if(p.endsWith(V2)){let h=n[t++],u=L.getAttribute(p).split(w),W=/([.?@])?(.*)/.exec(h);o.push({type:1,index:r,name:W[2],strings:u,ctor:W[1]==="."?k1:W[1]==="?"?y1:W[1]==="@"?b1:U}),L.removeAttribute(p)}else p.startsWith(w)&&(o.push({type:6,index:r}),L.removeAttribute(p));if(M2.test(L.tagName)){let p=L.textContent.split(w),h=p.length-1;if(h>0){L.textContent=i1?i1.emptyScript:"";for(let u=0;u<h;u++)L.append(p[u],q()),R.nextNode(),o.push({type:2,index:++r});L.append(p[h],q())}}}else if(L.nodeType===8)if(L.data===L2)o.push({type:2,index:r});else{let p=-1;for(;(p=L.data.indexOf(w,p+1))!==-1;)o.push({type:7,index:r}),p+=w.length-1}r++}}static createElement(C,H){let V=_.createElement("template");return V.innerHTML=C,V}};function I(M,C,H=M,V){if(C===E)return C;let L=V!==void 0?H._$Co?.[V]:H._$Cl,r=X(C)?void 0:C._$litDirective$;return L?.constructor!==r&&(L?._$AO?.(!1),r===void 0?L=void 0:(L=new r(M),L._$AT(M,H,V)),V!==void 0?(H._$Co??=[])[V]=L:H._$Cl=L),L!==void 0&&(C=I(M,L._$AS(M,C.values),L,V)),C}var g1=class{constructor(C,H){this._$AV=[],this._$AN=void 0,this._$AD=C,this._$AM=H}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(C){let{el:{content:H},parts:V}=this._$AD,L=(C?.creationScope??_).importNode(H,!0);R.currentNode=L;let r=R.nextNode(),t=0,d=0,o=V[0];for(;o!==void 0;){if(t===o.index){let a;o.type===2?a=new J(r,r.nextSibling,this,C):o.type===1?a=new o.ctor(r,o.name,o.strings,this,C):o.type===6&&(a=new w1(r,this,C)),this._$AV.push(a),o=V[++d]}t!==o?.index&&(r=R.nextNode(),t++)}return R.currentNode=_,L}p(C){let H=0;for(let V of this._$AV)V!==void 0&&(V.strings!==void 0?(V._$AI(C,V,H),H+=V.strings.length-2):V._$AI(C[H])),H++}},J=class M{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(C,H,V,L){this.type=2,this._$AH=A,this._$AN=void 0,this._$AA=C,this._$AB=H,this._$AM=V,this.options=L,this._$Cv=L?.isConnected??!0}get parentNode(){let C=this._$AA.parentNode,H=this._$AM;return H!==void 0&&C?.nodeType===11&&(C=H.parentNode),C}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(C,H=this){C=I(this,C,H),X(C)?C===A||C==null||C===""?(this._$AH!==A&&this._$AR(),this._$AH=A):C!==this._$AH&&C!==E&&this._(C):C._$litType$!==void 0?this.$(C):C.nodeType!==void 0?this.T(C):P2(C)?this.k(C):this._(C)}O(C){return this._$AA.parentNode.insertBefore(C,this._$AB)}T(C){this._$AH!==C&&(this._$AR(),this._$AH=this.O(C))}_(C){this._$AH!==A&&X(this._$AH)?this._$AA.nextSibling.data=C:this.T(_.createTextNode(C)),this._$AH=C}$(C){let{values:H,_$litType$:V}=C,L=typeof V=="number"?this._$AC(C):(V.el===void 0&&(V.el=Y.createElement(r2(V.h,V.h[0]),this.options)),V);if(this._$AH?._$AD===L)this._$AH.p(H);else{let r=new g1(L,this),t=r.u(this.options);r.p(H),this.T(t),this._$AH=r}}_$AC(C){let H=H2.get(C.strings);return H===void 0&&H2.set(C.strings,H=new Y(C)),H}k(C){P1(this._$AH)||(this._$AH=[],this._$AR());let H=this._$AH,V,L=0;for(let r of C)L===H.length?H.push(V=new M(this.O(q()),this.O(q()),this,this.options)):V=H[L],V._$AI(r),L++;L<H.length&&(this._$AR(V&&V._$AB.nextSibling,L),H.length=L)}_$AR(C=this._$AA.nextSibling,H){for(this._$AP?.(!1,!0,H);C!==this._$AB;){let V=j1(C).nextSibling;j1(C).remove(),C=V}}setConnected(C){this._$AM===void 0&&(this._$Cv=C,this._$AP?.(C))}},U=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(C,H,V,L,r){this.type=1,this._$AH=A,this._$AN=void 0,this.element=C,this.name=H,this._$AM=L,this.options=r,V.length>2||V[0]!==""||V[1]!==""?(this._$AH=Array(V.length-1).fill(new String),this.strings=V):this._$AH=A}_$AI(C,H=this,V,L){let r=this.strings,t=!1;if(r===void 0)C=I(this,C,H,0),t=!X(C)||C!==this._$AH&&C!==E,t&&(this._$AH=C);else{let d=C,o,a;for(C=r[0],o=0;o<r.length-1;o++)a=I(this,d[V+o],H,o),a===E&&(a=this._$AH[o]),t||=!X(a)||a!==this._$AH[o],a===A?C=A:C!==A&&(C+=(a??"")+r[o+1]),this._$AH[o]=a}t&&!L&&this.j(C)}j(C){C===A?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,C??"")}},k1=class extends U{constructor(){super(...arguments),this.type=3}j(C){this.element[this.name]=C===A?void 0:C}},y1=class extends U{constructor(){super(...arguments),this.type=4}j(C){this.element.toggleAttribute(this.name,!!C&&C!==A)}},b1=class extends U{constructor(C,H,V,L,r){super(C,H,V,L,r),this.type=5}_$AI(C,H=this){if((C=I(this,C,H,0)??A)===E)return;let V=this._$AH,L=C===A&&V!==A||C.capture!==V.capture||C.once!==V.once||C.passive!==V.passive,r=C!==A&&(V===A||L);L&&this.element.removeEventListener(this.name,this,V),r&&this.element.addEventListener(this.name,this,C),this._$AH=C}handleEvent(C){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,C):this._$AH.handleEvent(C)}},w1=class{constructor(C,H,V){this.element=C,this.type=6,this._$AN=void 0,this._$AM=H,this.options=V}get _$AU(){return this._$AM._$AU}_$AI(C){I(this,C)}};var F2=B1.litHtmlPolyfillSupport;F2?.(Y,J),(B1.litHtmlVersions??=[]).push("3.3.3");var e2=(M,C,H)=>{let V=H?.renderBefore??C,L=V._$litPart$;if(L===void 0){let r=H?.renderBefore??null;V._$litPart$=L=new J(C.insertBefore(q(),r),r,void 0,H??{})}return L._$AI(M),L};var F1=globalThis,v=class extends y{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let C=super.createRenderRoot();return this.renderOptions.renderBefore??=C.firstChild,C}update(C){let H=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(C),this._$Do=e2(H,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return E}};v._$litElement$=!0,v.finalized=!0,F1.litElementHydrateSupport?.({LitElement:v});var R2=F1.litElementPolyfillSupport;R2?.({LitElement:v});(F1.litElementVersions??=[]).push("4.2.2");var S="vehicle_log",o1=M=>M.callWS({type:`${S}/vehicles`}),t2=(M,C)=>M.callWS({type:`${S}/dashboard`,vehicle_id:C}),i2=M=>M.callWS({type:`${S}/categories`}),o2=(M,C)=>M.callWS({type:`${S}/fuel/defaults`,vehicle_id:C}),A2=(M,C,H={})=>M.callWS({type:`${S}/fuel/list`,vehicle_id:C,...H}),a2=(M,C,H)=>M.callWS({type:`${S}/fuel/save`,vehicle_id:C,...H}),A1=(M,C,H)=>M.callWS({type:`${S}/fuel/delete`,vehicle_id:C,entry_id:H}),d2=(M,C,H={})=>M.callWS({type:`${S}/expense/list`,vehicle_id:C,...H}),p2=(M,C,H)=>M.callWS({type:`${S}/expense/save`,vehicle_id:C,...H}),a1=(M,C,H)=>M.callWS({type:`${S}/expense/delete`,vehicle_id:C,expense_id:H}),R1=(M,C)=>`/api/${S}/attachment/${encodeURIComponent(M)}/${encodeURIComponent(C)}`;async function m2(M,C,H,V){let L=new FormData;L.append("file",V);let r=await M.fetchWithAuth(R1(C,H),{method:"POST",body:L});if(!r.ok){let t=String(r.status);try{t=(await r.json()).code??t}catch{}throw new Error(t)}}async function l2(M,C,H){await M.fetchWithAuth(R1(C,H),{method:"DELETE"})}async function n2(M,C,H){let{path:V}=await M.callWS({type:"auth/sign_path",path:R1(C,H),expires:30});return V}var v2=(M,C)=>M.connection.subscribeMessage(()=>C(),{type:`${S}/subscribe`});var l=M=>i`<svg class="mdi" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d=${M}></path>
  </svg>`;var _2={"card.name":"Carnet de bord v\xE9hicule","card.description":"Vue d'ensemble, saisie rapide d'un plein, d\xE9penses mensuelles.","journal.name":"Journal du v\xE9hicule","journal.description":"Pleins et d\xE9penses : liste filtrable, modification, suppression.","common.loading":"Chargement\u2026","common.no_vehicle":"Aucun v\xE9hicule. Ajoutez-en un depuis la page de l'int\xE9gration Vehicle Log.","common.not_loaded":"L'int\xE9gration Vehicle Log n'est pas charg\xE9e.","common.cancel":"Annuler","common.save":"Enregistrer","common.delete":"Supprimer","common.edit":"Modifier","common.close":"Fermer","common.more":"Plus d'options","common.load_more":"Afficher plus","common.none":"Aucune entr\xE9e.","common.error":"Erreur : {message}","common.optional":"facultatif","action.add_fuel":"Plein","action.add_expense":"D\xE9pense","action.add_fuel_long":"Ajouter un plein","action.add_expense_long":"Ajouter une d\xE9pense","tile.consumption":"Consommation moyenne","tile.month_cost":"Co\xFBt du mois","tile.cost_per_distance":"Co\xFBt par {unit}","tile.odometer":"Kilom\xE9trage","tile.distance_month":"Distance ce mois-ci","section.recent_fuel":"Derniers pleins","section.recent_expenses":"Derni\xE8res d\xE9penses","section.monthly":"D\xE9penses mensuelles","chart.total":"Total","chart.empty":"Aucune d\xE9pense sur la p\xE9riode.","chart.summary":"D\xE9penses des {count} derniers mois, empil\xE9es par cat\xE9gorie.","chart.month":"Mois","fuel.title_new":"Nouveau plein","fuel.title_edit":"Modifier le plein","fuel.odometer":"Kilom\xE9trage ({unit})","fuel.volume":"Quantit\xE9 ({unit})","fuel.total":"Montant ({currency})","fuel.unit_price":"Prix unitaire ({currency}/{unit})","fuel.computed":"Calcul\xE9 automatiquement","fuel.full_tank":"Plein complet","fuel.partial":"partiel","fuel.date":"Date","fuel.time":"Heure","fuel.fuel_type":"Carburant","fuel.station":"Station","fuel.notes":"Notes","fuel.need_two":"Saisissez au moins deux valeurs parmi quantit\xE9, montant et prix unitaire.","fuel.warnings":"V\xE9rifiez la saisie :","fuel.save_anyway":"Enregistrer quand m\xEAme","fuel.delete_confirm":"Supprimer le plein du {date} ? Les calculs seront mis \xE0 jour.","expense.title_new":"Nouvelle d\xE9pense","expense.title_edit":"Modifier la d\xE9pense","expense.amount":"Montant ({currency})","expense.category":"Cat\xE9gorie","expense.odometer":"Kilom\xE9trage ({unit})","expense.description":"Description","expense.attachment":"Pi\xE8ce jointe (photo ou PDF, 10 Mo max)","expense.attachment_view":"Voir la pi\xE8ce jointe","expense.attachment_remove":"Retirer la pi\xE8ce jointe","expense.attachment_error":"La pi\xE8ce jointe n'a pas \xE9t\xE9 enregistr\xE9e ({code}).","expense.delete_confirm":"Supprimer la d\xE9pense du {date} ({amount}) ?","journal.tab_fuel":"Pleins","journal.tab_expenses":"D\xE9penses","journal.filters":"Filtres","journal.from":"Du","journal.to":"Au","journal.min":"Montant min.","journal.max":"Montant max.","journal.categories":"Cat\xE9gories","journal.all":"Toutes","journal.reset":"R\xE9initialiser","journal.count":"{count} entr\xE9e(s), total {sum}","journal.period_month":"Ce mois-ci","journal.period_3m":"3 mois","journal.period_year":"Cette ann\xE9e","journal.period_all":"Tout","fuel_type.gasoline":"Essence","fuel_type.diesel":"Diesel","fuel_type.lpg":"GPL","fuel_type.cng":"GNV","category.fuel":"Carburant","warning.odometer_below_previous":"Kilom\xE9trage inf\xE9rieur au relev\xE9 pr\xE9c\xE9dent ({previous} {unit}).","warning.odometer_above_next":"Kilom\xE9trage sup\xE9rieur au relev\xE9 suivant ({next} {unit}).","warning.consumption_out_of_range":"Consommation de {value} {consumption}, hors de la plage pr\xE9vue ({min} \u2013 {max}).","warning.volume_exceeds_tank":"Quantit\xE9 sup\xE9rieure \xE0 la capacit\xE9 du r\xE9servoir ({capacity} {volume}).","warning.fuel_not_supported":"Ce carburant n'est pas d\xE9clar\xE9 pour le v\xE9hicule.","warning.amount_mismatch":"Montant diff\xE9rent de quantit\xE9 \xD7 prix ({expected}).","editor.vehicle":"V\xE9hicule","editor.title":"Titre","editor.show_chart":"Afficher l'histogramme mensuel","editor.show_recent":"Afficher les derni\xE8res entr\xE9es"},E2={"card.name":"Vehicle log","card.description":"Overview, quick fill-up entry, monthly expenses.","journal.name":"Vehicle journal","journal.description":"Fill-ups and expenses: filterable list, edit, delete.","common.loading":"Loading\u2026","common.no_vehicle":"No vehicle. Add one from the Vehicle Log integration page.","common.not_loaded":"The Vehicle Log integration is not loaded.","common.cancel":"Cancel","common.save":"Save","common.delete":"Delete","common.edit":"Edit","common.close":"Close","common.more":"More options","common.load_more":"Show more","common.none":"No entries.","common.error":"Error: {message}","common.optional":"optional","action.add_fuel":"Fill-up","action.add_expense":"Expense","action.add_fuel_long":"Add a fill-up","action.add_expense_long":"Add an expense","tile.consumption":"Average consumption","tile.month_cost":"Cost this month","tile.cost_per_distance":"Cost per {unit}","tile.odometer":"Odometer","tile.distance_month":"Distance this month","section.recent_fuel":"Latest fill-ups","section.recent_expenses":"Latest expenses","section.monthly":"Monthly expenses","chart.total":"Total","chart.empty":"No expenses in this period.","chart.summary":"Expenses over the last {count} months, stacked by category.","chart.month":"Month","fuel.title_new":"New fill-up","fuel.title_edit":"Edit fill-up","fuel.odometer":"Odometer ({unit})","fuel.volume":"Quantity ({unit})","fuel.total":"Amount ({currency})","fuel.unit_price":"Unit price ({currency}/{unit})","fuel.computed":"Computed automatically","fuel.full_tank":"Full tank","fuel.partial":"partial","fuel.date":"Date","fuel.time":"Time","fuel.fuel_type":"Fuel","fuel.station":"Station","fuel.notes":"Notes","fuel.need_two":"Enter at least two of quantity, amount and unit price.","fuel.warnings":"Please check:","fuel.save_anyway":"Save anyway","fuel.delete_confirm":"Delete the fill-up of {date}? Figures will be recalculated.","expense.title_new":"New expense","expense.title_edit":"Edit expense","expense.amount":"Amount ({currency})","expense.category":"Category","expense.odometer":"Odometer ({unit})","expense.description":"Description","expense.attachment":"Attachment (photo or PDF, 10 MB max)","expense.attachment_view":"View attachment","expense.attachment_remove":"Remove attachment","expense.attachment_error":"The attachment was not saved ({code}).","expense.delete_confirm":"Delete the expense of {date} ({amount})?","journal.tab_fuel":"Fill-ups","journal.tab_expenses":"Expenses","journal.filters":"Filters","journal.from":"From","journal.to":"To","journal.min":"Min. amount","journal.max":"Max. amount","journal.categories":"Categories","journal.all":"All","journal.reset":"Reset","journal.count":"{count} entries, total {sum}","journal.period_month":"This month","journal.period_3m":"3 months","journal.period_year":"This year","journal.period_all":"All","fuel_type.gasoline":"Petrol","fuel_type.diesel":"Diesel","fuel_type.lpg":"LPG","fuel_type.cng":"CNG","category.fuel":"Fuel","warning.odometer_below_previous":"Odometer below the previous reading ({previous} {unit}).","warning.odometer_above_next":"Odometer above the next reading ({next} {unit}).","warning.consumption_out_of_range":"Consumption of {value} {consumption}, outside the expected range ({min} \u2013 {max}).","warning.volume_exceeds_tank":"Quantity larger than the tank capacity ({capacity} {volume}).","warning.fuel_not_supported":"This fuel is not declared for the vehicle.","warning.amount_mismatch":"Amount differs from quantity \xD7 price ({expected}).","editor.vehicle":"Vehicle","editor.title":"Title","editor.show_chart":"Show monthly chart","editor.show_recent":"Show latest entries"};function B(M){return M?.locale?.language??M?.language??"en"}function e(M,C,H={}){return(B(M).startsWith("fr")?_2:E2)[C].replace(/\{(\w+)\}/g,(L,r)=>r in H?String(H[r]):`{${r}}`)}function c(M,C,H=0){return C==null||Number.isNaN(C)?"\u2014":new Intl.NumberFormat(B(M),{minimumFractionDigits:H,maximumFractionDigits:H}).format(C)}function x(M,C,H,V=2){if(C==null)return"\u2014";try{return new Intl.NumberFormat(B(M),{style:"currency",currency:H,minimumFractionDigits:V,maximumFractionDigits:V}).format(C)}catch{return`${c(M,C,V)} ${H}`}}function g(M,C){let[H,V,L]=C.split("-").map(Number);return new Intl.DateTimeFormat(B(M),{dateStyle:"medium"}).format(new Date(H,V-1,L))}function x2(M,C){let[H,V]=C.split("-").map(Number);return new Intl.DateTimeFormat(B(M),{month:"short"}).format(new Date(H,V-1,1))}function _1(M,C){let[H,V]=C.split("-").map(Number);return new Intl.DateTimeFormat(B(M),{month:"long",year:"numeric"}).format(new Date(H,V-1,1))}function E1(M=0){let C=new Date;return C.setDate(C.getDate()+M),H1(C)}function H1(M){let C=H=>String(H).padStart(2,"0");return`${M.getFullYear()}-${C(M.getMonth()+1)}-${C(M.getDate())}`}function D1(M,C){let H=10**C;return Math.round((M+Number.EPSILON)*H)/H}function O(M){let C=M.trim().replace(/\s/g,"").replace(",",".");if(C==="")return null;let H=Number(C);return Number.isFinite(H)?H:null}function k(M,C,H){let V=String(D1(C,H));return new Intl.NumberFormat(B(M)).format(1.5).charAt(1)===","?V.replace(".",","):V}var V1="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z";var D="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z";var L1="M16.5,6V17.5A4,4 0 0,1 12.5,21.5A4,4 0 0,1 8.5,17.5V5A2.5,2.5 0 0,1 11,2.5A2.5,2.5 0 0,1 13.5,5V15.5A1,1 0 0,1 12.5,16.5A1,1 0 0,1 11.5,15.5V6H10V15.5A2.5,2.5 0 0,0 12.5,18A2.5,2.5 0 0,0 15,15.5V5A4,4 0 0,0 11,1A4,4 0 0,0 7,5V17.5A5.5,5.5 0 0,0 12.5,23A5.5,5.5 0 0,0 18,17.5V6H16.5Z";var $="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z";var Q="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z";var s=Z`
  :host {
    --vl-gap: 12px;
    --vl-radius: var(--ha-card-border-radius, 12px);
    --vl-muted: var(--secondary-text-color);
    --vl-border: var(--divider-color, rgba(127, 127, 127, 0.3));
    /* Bordure des champs : contraste ≥ 3:1 (WCAG 1.4.11). */
    --vl-input-border: var(--secondary-text-color);
    --vl-focus: var(--primary-color);
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
    color: var(--error-color, #db4437);
    border-color: var(--error-color, #db4437);
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
    color: var(--error-color, #db4437);
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
`;var P=class extends v{constructor(){super();this._vehicles=[];this._currency="EUR";this._started=!1;this._error="",this._loading=!0}static{this.properties={hass:{attribute:!1},_config:{state:!0},_error:{state:!0},_loading:{state:!0}}}setConfig(H){if(!H)throw new Error("Invalid configuration");let V=this._config?.vehicle_id!==H.vehicle_id;this._config={show_chart:!0,show_recent:!0,...H},this._started&&V?this.reload():this._start()}get vehicle(){return this._vehicles.find(H=>H.id===this._config?.vehicle_id)??this._vehicles[0]}_start(){this._started||!this.hass||!this.isConnected||!this._config||(this._started=!0,this.reload())}updated(H){H.has("hass")&&(this._start(),this._subscribe())}connectedCallback(){super.connectedCallback(),this.hass&&(this._subscribe(),this._start())}disconnectedCallback(){super.disconnectedCallback(),this._started=!1;let H=this._unsubscribe;this._unsubscribe=void 0,H?.then(V=>V()).catch(()=>{})}_subscribe(){this._unsubscribe||!this.isConnected||(this._unsubscribe=v2(this.hass,()=>{window.clearTimeout(this._reloadTimer),this._reloadTimer=window.setTimeout(()=>{this.reload()},300)}),this._unsubscribe.catch(()=>{this._unsubscribe=void 0}))}async reload(){try{let H=await o1(this.hass);this._vehicles=H.vehicles,this._currency=H.currency,this._error="",await this.loadVehicleData()}catch(H){this._error=H.code??H.message}finally{this._loading=!1,this.requestUpdate()}}};var $1=Z`
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
`,d1=class extends P{static{this.properties={...P.properties,_data:{state:!0}}}static{this.styles=[s,$1,Z`
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
    `]}constructor(){super(),this._data=null}static getStubConfig(){return{type:"custom:vehicle-log-card"}}static async getConfigElement(){let C=document.createElement("vehicle-log-card-editor");return C.setAttribute("kind","dashboard"),C}getCardSize(){return 8}getGridOptions(){return{columns:12,min_columns:6,rows:"auto"}}async loadVehicleData(){let C=this.vehicle;this._data=C?await t2(this.hass,C.id):null}_dialog(C){return this.renderRoot.querySelector(C)}async _deleteFuel(C){await this._dialog("vl-confirm-dialog").ask(e(this.hass,"fuel.delete_confirm",{date:g(this.hass,C.date)}))&&this._data&&(await A1(this.hass,this._data.id,C.id),await this.reload())}async _deleteExpense(C){await this._dialog("vl-confirm-dialog").ask(e(this.hass,"expense.delete_confirm",{date:g(this.hass,C.date),amount:x(this.hass,C.amount,this._currency)}))&&this._data&&(await a1(this.hass,this._data.id,C.id),await this.reload())}_tiles(C){let H=this.hass,V=C.summary,L=C.fuel_types[0],r=C.units.distance,t=(d,o,a="")=>i`<div class="tile">
        <dt>${d}</dt>
        <dd>${o}${a?i` <small>${a}</small>`:A}</dd>
      </div>`;return i`<dl class="tiles">
      ${t(e(H,"tile.consumption"),c(H,V?.consumption[L],2),C.units.consumption[L])}
      ${t(e(H,"tile.month_cost"),x(H,V?.month_cost,C.currency))}
      ${t(e(H,"tile.cost_per_distance",{unit:r}),x(H,V?.cost_per_distance,C.currency,3))}
      ${t(e(H,"tile.odometer"),c(H,V?.current_odometer,0),r)}
      ${t(e(H,"tile.distance_month"),c(H,V?.distance_month,0),r)}
    </dl>`}_fuelRow(C,H){let V=this.hass,L=C.units.volume[H.fuel_type]??"L",r=`${g(V,H.date)} \xB7 ${c(V,H.volume,2)} ${L}`;return i`<li>
      <div class="entry-main">
        <span class="entry-title">
          <span>${r}${H.full_tank?A:i` <span class="badge">${e(V,"fuel.partial")}</span>`}</span>
          <span class="amount">${x(V,H.total_cost,C.currency)}</span>
        </span>
        <span class="entry-sub">
          ${c(V,H.odometer,0)} ${C.units.distance} ·
          ${x(V,H.unit_price,C.currency,3)}/${L}${H.station?` \xB7 ${H.station}`:""}
        </span>
      </div>
      <span class="row-actions">
        <button
          class="icon"
          aria-label="${e(V,"common.edit")} : ${r}"
          @click=${()=>this._dialog("vl-fuel-dialog").open(H)}
        >
          ${l($)}
        </button>
        <button
          class="icon"
          aria-label="${e(V,"common.delete")} : ${r}"
          @click=${()=>this._deleteFuel(H)}
        >
          ${l(D)}
        </button>
      </span>
    </li>`}_expenseRow(C,H){let V=this.hass,L=C.categories.find(t=>t.id===H.category_id),r=`${g(V,H.date)} \xB7 ${L?.label??H.category_id}`;return i`<li>
      <div class="entry-main">
        <span class="entry-title">
          <span>${r}</span>
          <span class="amount">${x(V,H.amount,C.currency)}</span>
        </span>
        ${H.description?i`<span class="entry-sub">${H.description}</span>`:A}
      </div>
      <span class="row-actions">
        <button
          class="icon"
          aria-label="${e(V,"common.edit")} : ${r}"
          @click=${()=>this._dialog("vl-expense-dialog").open(H)}
        >
          ${l($)}
        </button>
        <button
          class="icon"
          aria-label="${e(V,"common.delete")} : ${r}"
          @click=${()=>this._deleteExpense(H)}
        >
          ${l(D)}
        </button>
      </span>
    </li>`}render(){let C=this.hass;if(this._loading)return i`<ha-card><p>${e(C,"common.loading")}</p></ha-card>`;if(this._error){let L=this._error==="not_loaded"?e(C,"common.not_loaded"):this._error;return i`<ha-card><p class="error" role="alert">${L}</p></ha-card>`}let H=this._data;if(!H)return i`<ha-card><p>${e(C,"common.no_vehicle")}</p></ha-card>`;let V=this._config;return i`<ha-card>
      <div class="head">
        <h2>${V.title||H.name}</h2>
        <div class="actions">
          <button
            class="primary"
            aria-label=${e(C,"action.add_fuel_long")}
            @click=${()=>this._dialog("vl-fuel-dialog").open()}
          >
            ${l(Q)} ${e(C,"action.add_fuel")}
          </button>
          <button
            aria-label=${e(C,"action.add_expense_long")}
            @click=${()=>this._dialog("vl-expense-dialog").open()}
          >
            ${l(Q)} ${e(C,"action.add_expense")}
          </button>
        </div>
      </div>
      ${this._tiles(H)}
      ${V.show_recent?i`<div class="recent">
            <section aria-labelledby="recent-fuel">
              <h3 id="recent-fuel">${e(C,"section.recent_fuel")}</h3>
              ${H.recent_fuel.length?i`<ul class="entries">${H.recent_fuel.map(L=>this._fuelRow(H,L))}</ul>`:i`<p class="empty">${e(C,"common.none")}</p>`}
            </section>
            <section aria-labelledby="recent-expenses">
              <h3 id="recent-expenses">${e(C,"section.recent_expenses")}</h3>
              ${H.recent_expenses.length?i`<ul class="entries">
                    ${H.recent_expenses.map(L=>this._expenseRow(H,L))}
                  </ul>`:i`<p class="empty">${e(C,"common.none")}</p>`}
            </section>
          </div>`:A}
      ${V.show_chart?i`<section aria-labelledby="monthly">
            <h3 id="monthly">${e(C,"section.monthly")}</h3>
            <vl-monthly-chart
              .hass=${C}
              .data=${H.monthly}
              .categories=${H.categories}
              .currency=${H.currency}
            ></vl-monthly-chart>
          </section>`:A}
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
    </ha-card>`}};var p1=class extends v{static{this.properties={hass:{attribute:!1},kind:{type:String},_config:{state:!0},_vehicles:{state:!0}}}static{this.styles=[s,Z`
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
    `]}constructor(){super(),this.kind="dashboard",this._vehicles=[]}setConfig(C){this._config=C}firstUpdated(){o1(this.hass).then(C=>this._vehicles=C.vehicles).catch(()=>{})}_change(C,H){let V={...this._config};H===""||H===void 0?delete V[C]:V[C]=H,this._config=V,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:V},bubbles:!0,composed:!0}))}render(){if(!this._config)return A;let C=this.hass;return i`
      <div class="field">
        <label for="vehicle">${e(C,"editor.vehicle")}</label>
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
        <label for="title">${e(C,"editor.title")}</label>
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
              ${e(C,"editor.show_recent")}
            </label>
            <label class="check">
              <input
                type="checkbox"
                .checked=${this._config.show_chart!==!1}
                @change=${H=>this._change("show_chart",H.target.checked)}
              />
              ${e(C,"editor.show_chart")}
            </label>`:A}
    `}};var Z2=25;function D2(M){let C=new Date;return M==="month"?{start:H1(new Date(C.getFullYear(),C.getMonth(),1))}:M==="3m"?{start:H1(new Date(C.getFullYear(),C.getMonth()-2,1))}:M==="year"?{start:H1(new Date(C.getFullYear(),0,1))}:{}}var m1=class extends P{static{this.properties={...P.properties,_tab:{state:!0},_fuel:{state:!0},_expenses:{state:!0},_fuelTotal:{state:!0},_expenseTotal:{state:!0},_expenseSum:{state:!0},_categories:{state:!0},_filters:{state:!0}}}static{this.styles=[s,$1,Z`
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
    `]}constructor(){super(),this._tab="fuel",this._fuel=[],this._expenses=[],this._fuelTotal=0,this._expenseTotal=0,this._expenseSum=0,this._categories=[],this._filters={preset:"all"}}static getStubConfig(){return{type:"custom:vehicle-log-journal-card"}}static async getConfigElement(){let C=document.createElement("vehicle-log-card-editor");return C.setAttribute("kind","journal"),C}getCardSize(){return 10}getGridOptions(){return{columns:12,min_columns:6,rows:"auto"}}async loadVehicleData(){if(!this.vehicle)return;let[H]=await Promise.all([i2(this.hass),this._loadFuel(!1),this._loadExpenses(!1)]);this._categories=H}async _loadFuel(C){let H=this.vehicle;if(!H)return;let V=await A2(this.hass,H.id,{limit:Z2,offset:C?this._fuel.length:0});this._fuel=C?[...this._fuel,...V.items]:V.items,this._fuelTotal=V.total}_apiFilters(){let{preset:C,...H}=this._filters;return H}async _loadExpenses(C){let H=this.vehicle;if(!H)return;let V=await d2(this.hass,H.id,{...this._apiFilters(),limit:Z2,offset:C?this._expenses.length:0});this._expenses=C?[...this._expenses,...V.items]:V.items,this._expenseTotal=V.total,this._expenseSum=V.sum??0}_setFilters(C){let H={...this._filters,...C};for(let[V,L]of Object.entries(H))(L==null||L==="")&&delete H[V];this._filters=H,this._loadExpenses(!1)}_preset(C){let H=D2(C);this._setFilters({preset:C,start:H.start,end:void 0})}_toggleCategory(C,H){let V=new Set(this._filters.category_ids??[]);H?V.add(C):V.delete(C),this._setFilters({category_ids:V.size?[...V]:void 0})}_confirm(){return this.renderRoot.querySelector("vl-confirm-dialog")}async _deleteFuel(C){let H=this.vehicle;H&&await this._confirm().ask(e(this.hass,"fuel.delete_confirm",{date:g(this.hass,C.date)}))&&(await A1(this.hass,H.id,C.id),await this.reload())}async _deleteExpense(C){let H=this.vehicle;if(!H)return;let V=e(this.hass,"expense.delete_confirm",{date:g(this.hass,C.date),amount:x(this.hass,C.amount,this._currency)});await this._confirm().ask(V)&&(await a1(this.hass,H.id,C.id),await this.reload())}_tabButton(C,H){let V=this._tab===C;return i`<button
      role="tab"
      id="tab-${C}"
      aria-selected=${V?"true":"false"}
      aria-controls="panel-${C}"
      tabindex=${V?0:-1}
      @click=${()=>this._tab=C}
      @keydown=${L=>{(L.key==="ArrowRight"||L.key==="ArrowLeft")&&(this._tab=this._tab==="fuel"?"expenses":"fuel",this.updateComplete.then(()=>this.renderRoot.querySelector(`#tab-${this._tab}`)?.focus()))}}
    >
      ${H}
    </button>`}_fuelPanel(){let C=this.hass,H=this.vehicle;return i`<div role="tabpanel" id="panel-fuel" aria-labelledby="tab-fuel">
      ${this._fuel.length?i`<ul class="entries">
            ${this._fuel.map(V=>{let L=H.units.volume[V.fuel_type]??"L",r=`${g(C,V.date)} \xB7 ${c(C,V.volume,2)} ${L}`;return i`<li>
                <div class="entry-main">
                  <span class="entry-title">
                    <span>${r}${V.full_tank?A:i` <span class="badge">${e(C,"fuel.partial")}</span>`}</span>
                    <span class="amount">${x(C,V.total_cost,this._currency)}</span>
                  </span>
                  <span class="entry-sub">
                    ${c(C,V.odometer,0)} ${H.units.distance} ·
                    ${x(C,V.unit_price,this._currency,3)}/${L}${V.station?` \xB7 ${V.station}`:""}${V.notes?` \xB7 ${V.notes}`:""}
                  </span>
                </div>
                <span class="row-actions">
                  <button class="icon" aria-label="${e(C,"common.edit")} : ${r}"
                    @click=${()=>this.renderRoot.querySelector("vl-fuel-dialog").open(V)}>
                    ${l($)}
                  </button>
                  <button class="icon" aria-label="${e(C,"common.delete")} : ${r}"
                    @click=${()=>this._deleteFuel(V)}>
                    ${l(D)}
                  </button>
                </span>
              </li>`})}
          </ul>`:i`<p class="empty">${e(C,"common.none")}</p>`}
      ${this._fuel.length<this._fuelTotal?i`<button class="more" @click=${()=>this._loadFuel(!0)}>${e(C,"common.load_more")}</button>`:A}
    </div>`}_filtersForm(){let C=this.hass,H=this._filters,V=[["month",e(C,"journal.period_month")],["3m",e(C,"journal.period_3m")],["year",e(C,"journal.period_year")],["all",e(C,"journal.period_all")]],L=(r,t)=>this._setFilters({[r]:O(t)??void 0});return i`<fieldset>
      <legend>${e(C,"journal.filters")}</legend>
      <div class="presets" role="group" aria-label=${e(C,"journal.filters")}>
        ${V.map(([r,t])=>i`<button aria-pressed=${H.preset===r?"true":"false"} @click=${()=>this._preset(r)}>
              ${t}
            </button>`)}
      </div>
      <div class="field">
        <label for="from">${e(C,"journal.from")}</label>
        <input id="from" type="date" .value=${H.start??""}
          @change=${r=>this._setFilters({start:r.target.value,preset:void 0})} />
      </div>
      <div class="field">
        <label for="to">${e(C,"journal.to")}</label>
        <input id="to" type="date" .value=${H.end??""}
          @change=${r=>this._setFilters({end:r.target.value,preset:void 0})} />
      </div>
      <div class="field">
        <label for="min">${e(C,"journal.min")} (${this._currency})</label>
        <input id="min" inputmode="decimal" .value=${H.min_amount!==void 0?String(H.min_amount):""}
          @change=${r=>L("min_amount",r.target.value)} />
      </div>
      <div class="field">
        <label for="max">${e(C,"journal.max")} (${this._currency})</label>
        <input id="max" inputmode="decimal" .value=${H.max_amount!==void 0?String(H.max_amount):""}
          @change=${r=>L("max_amount",r.target.value)} />
      </div>
      <div class="chips" role="group" aria-label=${e(C,"journal.categories")}>
        ${this._categories.map(r=>i`<label>
            <input type="checkbox" .checked=${H.category_ids?.includes(r.id)??!1}
              @change=${t=>this._toggleCategory(r.id,t.target.checked)} />
            ${r.label}
          </label>`)}
      </div>
      <div class="presets">
        <button @click=${()=>{this._filters={preset:"all"},this._loadExpenses(!1)}}>${e(C,"journal.reset")}</button>
      </div>
    </fieldset>`}_expensePanel(){let C=this.hass;return i`<div role="tabpanel" id="panel-expenses" aria-labelledby="tab-expenses">
      ${this._filtersForm()}
      <p class="summary" aria-live="polite">
        ${e(C,"journal.count",{count:this._expenseTotal,sum:x(C,this._expenseSum,this._currency)})}
      </p>
      ${this._expenses.length?i`<ul class="entries">
            ${this._expenses.map(H=>{let V=this._categories.find(r=>r.id===H.category_id),L=`${g(C,H.date)} \xB7 ${V?.label??H.category_id}`;return i`<li>
                <div class="entry-main">
                  <span class="entry-title">
                    <span>${L}${H.attachment?i` ${l(L1)}`:A}</span>
                    <span class="amount">${x(C,H.amount,this._currency)}</span>
                  </span>
                  ${H.description?i`<span class="entry-sub">${H.description}</span>`:A}
                </div>
                <span class="row-actions">
                  <button class="icon" aria-label="${e(C,"common.edit")} : ${L}"
                    @click=${()=>this.renderRoot.querySelector("vl-expense-dialog").open(H)}>
                    ${l($)}
                  </button>
                  <button class="icon" aria-label="${e(C,"common.delete")} : ${L}"
                    @click=${()=>this._deleteExpense(H)}>
                    ${l(D)}
                  </button>
                </span>
              </li>`})}
          </ul>`:i`<p class="empty">${e(C,"common.none")}</p>`}
      ${this._expenses.length<this._expenseTotal?i`<button class="more" @click=${()=>this._loadExpenses(!0)}>${e(C,"common.load_more")}</button>`:A}
    </div>`}render(){let C=this.hass;if(this._loading)return i`<ha-card><p>${e(C,"common.loading")}</p></ha-card>`;if(this._error){let L=this._error==="not_loaded"?e(C,"common.not_loaded"):this._error;return i`<ha-card><p class="error" role="alert">${L}</p></ha-card>`}let H=this.vehicle;if(!H)return i`<ha-card><p>${e(C,"common.no_vehicle")}</p></ha-card>`;let V=this._tab==="fuel";return i`<ha-card>
      <div class="head">
        <h2>${this._config.title||`${e(C,"journal.name")} \xB7 ${H.name}`}</h2>
        <button
          class="primary"
          aria-label=${e(C,V?"action.add_fuel_long":"action.add_expense_long")}
          @click=${()=>V?this.renderRoot.querySelector("vl-fuel-dialog").open():this.renderRoot.querySelector("vl-expense-dialog").open()}
        >
          ${l(Q)} ${e(C,V?"action.add_fuel":"action.add_expense")}
        </button>
      </div>
      <div role="tablist" aria-label=${H.name}>
        ${this._tabButton("fuel",e(C,"journal.tab_fuel"))}
        ${this._tabButton("expenses",e(C,"journal.tab_expenses"))}
      </div>
      ${V?this._fuelPanel():this._expensePanel()}
      <vl-fuel-dialog .hass=${C} .vehicle=${H} .currency=${this._currency}
        @saved=${()=>this.reload()}></vl-fuel-dialog>
      <vl-expense-dialog .hass=${C} .vehicle=${H} .categories=${this._categories}
        .currency=${this._currency} @saved=${()=>this.reload()}></vl-expense-dialog>
      <vl-confirm-dialog .hass=${C}></vl-confirm-dialog>
    </ha-card>`}};var G=Z`
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
  @media (max-width: 600px) {
    dialog {
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
`;var l1=class extends v{static{this.properties={hass:{attribute:!1},_message:{state:!0}}}static{this.styles=[s,G]}constructor(){super(),this._message=""}async ask(C){return this._message=C,await this.updateComplete,this.renderRoot.querySelector("dialog").showModal(),new Promise(V=>{this._resolve=V})}_answer(C){this.renderRoot.querySelector("dialog").close(),this._resolve?.(C),this._resolve=void 0}render(){return i`<dialog
      role="alertdialog"
      aria-describedby="confirm-message"
      style="height: auto"
      @cancel=${()=>this._resolve?.(!1)}
    >
      <div class="body">
        <p id="confirm-message">${this._message}</p>
      </div>
      <footer>
        <button type="button" @click=${()=>this._answer(!1)}>
          ${e(this.hass,"common.cancel")}
        </button>
        <button type="button" class="danger" @click=${()=>this._answer(!0)}>
          ${e(this.hass,"common.delete")}
        </button>
      </footer>
    </dialog>`}};var n1=class extends v{constructor(){super();this._file=null;this.categories=[],this.currency="EUR",this._values={},this._error="",this._busy=!1,this._entry=null}static{this.properties={hass:{attribute:!1},vehicle:{attribute:!1},categories:{attribute:!1},currency:{type:String},_values:{state:!0},_error:{state:!0},_busy:{state:!0},_entry:{state:!0}}}static{this.styles=[s,G]}get _dialog(){return this.renderRoot.querySelector("dialog")}async open(H=null){this._entry=H,this._error="",this._file=null,this._values=H?{date:H.date,amount:k(this.hass,H.amount,2),category_id:H.category_id,odometer:H.odometer!==null?k(this.hass,H.odometer,0):"",description:H.description}:{date:E1(),category_id:"maintenance"},this.categories.some(L=>L.id===this._values.category_id)||(this._values={...this._values,category_id:this.categories[0]?.id??"other"}),await this.updateComplete;let V=this.renderRoot.querySelector("#attachment");V&&(V.value=""),this._dialog.showModal(),this.renderRoot.querySelector("#amount")?.focus()}close(){this._dialog?.close()}_set(H,V){this._values={...this._values,[H]:V}}_saved(){this.dispatchEvent(new CustomEvent("saved",{bubbles:!0,composed:!0}))}async _submit(){this._error="";let H=O(this._values.amount??"");if(H===null){this._error=e(this.hass,"expense.amount",{currency:this.currency});return}let V=O(this._values.odometer??""),L={amount:H,category_id:this._values.category_id,description:this._values.description??"",date:this._values.date||E1(),odometer:V};this._entry&&(L.expense_id=this._entry.id),this._busy=!0;try{let r=await p2(this.hass,this.vehicle.id,L);if(this._file)try{await m2(this.hass,this.vehicle.id,r.id,this._file)}catch(t){this._entry=r,this._error=e(this.hass,"expense.attachment_error",{code:t.message}),this._saved();return}this.close(),this._saved()}catch(r){this._error=e(this.hass,"common.error",{message:r.message})}finally{this._busy=!1}}async _viewAttachment(){if(!this._entry)return;let H=await n2(this.hass,this.vehicle.id,this._entry.id);window.open(H,"_blank","noopener")}async _removeAttachment(){this._entry&&(await l2(this.hass,this.vehicle.id,this._entry.id),this._entry={...this._entry,attachment:null},this._saved())}render(){if(!this.vehicle)return A;let H=this.hass,V=e(H,this._entry?"expense.title_edit":"expense.title_new");return i`<dialog aria-labelledby="expense-title">
      <form
        method="dialog"
        @submit=${L=>{L.preventDefault(),this._submit()}}
      >
        <header>
          <h2 id="expense-title">${V} · ${this.vehicle.name}</h2>
          <button
            type="button"
            class="icon"
            aria-label=${e(H,"common.close")}
            @click=${()=>this.close()}
          >
            ${l(V1)}
          </button>
        </header>
        <div class="body">
          <div class="grid">
            <div class="field">
              <label for="amount">${e(H,"expense.amount",{currency:this.currency})}</label>
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
              <label for="category">${e(H,"expense.category")}</label>
              <select
                id="category"
                @change=${L=>this._set("category_id",L.target.value)}
              >
                ${this.categories.map(L=>i`<option value=${L.id} ?selected=${L.id===this._values.category_id}>
                      ${L.label}
                    </option>`)}
              </select>
            </div>
            <div class="field">
              <label for="date">${e(H,"fuel.date")}</label>
              <input
                id="date"
                type="date"
                .value=${this._values.date??""}
                @change=${L=>this._set("date",L.target.value)}
              />
            </div>
            <div class="field">
              <label for="odometer">
                ${e(H,"expense.odometer",{unit:this.vehicle.units.distance})}
              </label>
              <input
                id="odometer"
                inputmode="decimal"
                autocomplete="off"
                aria-describedby="odometer-hint"
                .value=${this._values.odometer??""}
                @input=${L=>this._set("odometer",L.target.value)}
              />
              <span class="hint" id="odometer-hint">${e(H,"common.optional")}</span>
            </div>
          </div>
          <div class="field">
            <label for="description">${e(H,"expense.description")}</label>
            <textarea
              id="description"
              .value=${this._values.description??""}
              @input=${L=>this._set("description",L.target.value)}
            ></textarea>
          </div>
          <div class="field">
            <label for="attachment">${e(H,"expense.attachment")}</label>
            <input
              id="attachment"
              type="file"
              accept="image/jpeg,image/png,image/webp,application/pdf"
              @change=${L=>{this._file=L.target.files?.[0]??null}}
            />
            ${this._entry?.attachment?i`<div class="check">
                  <button type="button" @click=${()=>this._viewAttachment()}>
                    ${l(L1)} ${e(H,"expense.attachment_view")}
                  </button>
                  <button type="button" class="danger" @click=${()=>this._removeAttachment()}>
                    ${e(H,"expense.attachment_remove")}
                  </button>
                </div>`:A}
          </div>
          ${this._error?i`<p class="error" role="alert">${this._error}</p>`:A}
        </div>
        <footer>
          <button type="button" @click=${()=>this.close()}>${e(H,"common.cancel")}</button>
          <button type="submit" class="primary" ?disabled=${this._busy}>
            ${e(H,"common.save")}
          </button>
        </footer>
      </form>
    </dialog>`}};function s2(M,C,H,V,L){let r=C.details,t=(o,a)=>typeof r[o]=="number"?c(M,r[o],a):String(r[o]??""),d=`warning.${C.code}`;return e(M,d,{previous:t("previous",0),next:t("next",0),value:t("value",2),min:t("min",1),max:t("max",1),capacity:t("capacity",1),expected:typeof r.expected=="number"?x(M,r.expected,L):"",unit:H.units.distance,volume:H.units.volume[V]??"L",consumption:H.units.consumption[V]??""})}var u2=["volume","unit_price","total_cost"],$2={volume:2,unit_price:3,total_cost:2},v1=class extends v{static{this.properties={hass:{attribute:!1},vehicle:{attribute:!1},currency:{type:String},_values:{state:!0},_edits:{state:!0},_warnings:{state:!0},_error:{state:!0},_busy:{state:!0},_entry:{state:!0}}}static{this.styles=[s,G]}constructor(){super(),this.currency="EUR",this._values={},this._edits=[],this._warnings=[],this._error="",this._busy=!1,this._entry=null}get _dialog(){return this.renderRoot.querySelector("dialog")}async open(C=null){if(this._entry=C,this._warnings=[],this._error="",C)this._values={odometer:k(this.hass,C.odometer,1),volume:k(this.hass,C.volume,2),unit_price:k(this.hass,C.unit_price,3),total_cost:k(this.hass,C.total_cost,2),date:C.date,time:C.time??"",fuel_type:C.fuel_type,full_tank:C.full_tank?"1":"",station:C.station??"",notes:C.notes},this._edits=["volume","total_cost"];else{this._values={full_tank:"1",fuel_type:this.vehicle.fuel_types[0]},this._edits=[];try{let V=await o2(this.hass,this.vehicle.id),L=V.unit_price[V.fuel_type];this._values={...this._values,odometer:V.odometer!==null?String(D1(V.odometer,0)):"",fuel_type:V.fuel_type,date:V.date,time:V.time,unit_price:L!==null?k(this.hass,L,3):""},L!==null&&(this._edits=["unit_price"])}catch(V){this._error=V.message}}await this.updateComplete,this._dialog.showModal();let H=this.renderRoot.querySelector("#odometer");H?.focus(),H?.select()}close(){this._dialog?.close()}willUpdate(C){C.has("vehicle")&&this.vehicle&&!this._values.fuel_type&&(this._values={...this._values,fuel_type:this.vehicle.fuel_types[0]})}_derivedField(){let C=this._edits.slice(-2);return C.length<2?null:u2.find(H=>!C.includes(H))??null}_onAmountInput(C,H){let V=this._edits.filter(t=>t!==C);V.push(C),this._edits=V;let L={...this._values,[C]:H},r=this._derivedField();if(r){let t=O(L.volume??""),d=O(L.unit_price??""),o=O(L.total_cost??""),a=null;r==="total_cost"&&t!==null&&d!==null&&(a=t*d),r==="unit_price"&&t&&o!==null&&(a=o/t),r==="volume"&&d&&o!==null&&(a=o/d),L[r]=a!==null?k(this.hass,a,$2[r]):""}this._values=L,this._warnings=[]}_set(C,H){this._values={...this._values,[C]:H},this._warnings=[]}async _submit(C=!1){this._error="";let H=this._edits.slice(-2),V=O(this._values.odometer??"");if(V===null){this._error=e(this.hass,"fuel.odometer",{unit:this.vehicle.units.distance});return}let L={odometer:V,full_tank:!!this._values.full_tank,fuel_type:this._values.fuel_type,station:this._values.station||null,notes:this._values.notes??"",confirm:C};for(let r of H){let t=O(this._values[r]??"");t!==null&&(L[r]=t)}if(u2.filter(r=>r in L).length<2){this._error=e(this.hass,"fuel.need_two");return}this._values.date&&(L.date=this._values.date),this._values.time?L.time=this._values.time:this._values.date&&(L.time=null),this._entry&&(L.entry_id=this._entry.id),this._busy=!0;try{let r=await a2(this.hass,this.vehicle.id,L);if(!r.saved){this._warnings=r.warnings;return}this.close(),this.dispatchEvent(new CustomEvent("saved",{bubbles:!0,composed:!0}))}catch(r){this._error=e(this.hass,"common.error",{message:r.message})}finally{this._busy=!1}}_amountInput(C,H){let V=this._derivedField()===C;return i`<div class="field">
      <label for=${C}>${H}</label>
      <input
        id=${C}
        name=${C}
        inputmode="decimal"
        autocomplete="off"
        aria-describedby=${V?`${C}-hint`:A}
        class=${V?"computed":""}
        .value=${this._values[C]??""}
        @input=${L=>this._onAmountInput(C,L.target.value)}
      />
      ${V?i`<span class="hint" id="${C}-hint">${e(this.hass,"fuel.computed")}</span>`:A}
    </div>`}render(){if(!this.vehicle)return A;let C=this.hass,H=this._values.fuel_type??this.vehicle.fuel_types[0],V=this.vehicle.units.volume[H]??"L",L=e(C,this._entry?"fuel.title_edit":"fuel.title_new");return i`<dialog aria-labelledby="fuel-title" @close=${()=>this._warnings=[]}>
      <form
        method="dialog"
        @submit=${r=>{r.preventDefault(),this._submit()}}
      >
        <header>
          <h2 id="fuel-title">${L} · ${this.vehicle.name}</h2>
          <button
            type="button"
            class="icon"
            aria-label=${e(C,"common.close")}
            @click=${()=>this.close()}
          >
            ${l(V1)}
          </button>
        </header>
        <div class="body">
          <div class="grid">
            <div class="field">
              <label for="odometer">
                ${e(C,"fuel.odometer",{unit:this.vehicle.units.distance})}
              </label>
              <input
                id="odometer"
                name="odometer"
                inputmode="decimal"
                autocomplete="off"
                required
                .value=${this._values.odometer??""}
                @input=${r=>this._set("odometer",r.target.value)}
              />
            </div>
            ${this._amountInput("volume",e(C,"fuel.volume",{unit:V}))}
            ${this._amountInput("total_cost",e(C,"fuel.total",{currency:this.currency}))}
            ${this._amountInput("unit_price",e(C,"fuel.unit_price",{currency:this.currency,unit:V}))}
          </div>
          <label class="check">
            <input
              type="checkbox"
              .checked=${!!this._values.full_tank}
              @change=${r=>this._set("full_tank",r.target.checked?"1":"")}
            />
            ${e(C,"fuel.full_tank")}
          </label>
          <details ?open=${!!this._entry}>
            <summary>${e(C,"common.more")}</summary>
            <div class="grid">
              <div class="field">
                <label for="date">${e(C,"fuel.date")}</label>
                <input
                  id="date"
                  type="date"
                  .value=${this._values.date??""}
                  @change=${r=>this._set("date",r.target.value)}
                />
              </div>
              <div class="field">
                <label for="time">${e(C,"fuel.time")}</label>
                <input
                  id="time"
                  type="time"
                  .value=${this._values.time??""}
                  @change=${r=>this._set("time",r.target.value)}
                />
              </div>
              ${this.vehicle.fuel_types.length>1?i`<div class="field">
                    <label for="fuel_type">${e(C,"fuel.fuel_type")}</label>
                    <select
                      id="fuel_type"
                      .value=${H}
                      @change=${r=>this._set("fuel_type",r.target.value)}
                    >
                      ${this.vehicle.fuel_types.map(r=>i`<option value=${r} ?selected=${r===H}>
                            ${e(C,`fuel_type.${r}`)}
                          </option>`)}
                    </select>
                  </div>`:A}
              <div class="field">
                <label for="station">${e(C,"fuel.station")}</label>
                <input
                  id="station"
                  autocomplete="off"
                  .value=${this._values.station??""}
                  @input=${r=>this._set("station",r.target.value)}
                />
              </div>
            </div>
            <div class="field" style="margin-top: var(--vl-gap)">
              <label for="notes">${e(C,"fuel.notes")}</label>
              <textarea
                id="notes"
                .value=${this._values.notes??""}
                @input=${r=>this._set("notes",r.target.value)}
              ></textarea>
            </div>
          </details>
          ${this._warnings.length?i`<div class="warnings" role="alert">
                ${e(C,"fuel.warnings")}
                <ul>
                  ${this._warnings.map(r=>i`<li>${s2(C,r,this.vehicle,H,this.currency)}</li>`)}
                </ul>
              </div>`:A}
          ${this._error?i`<p class="error" role="alert">${this._error}</p>`:A}
        </div>
        <footer>
          <button type="button" @click=${()=>this.close()}>${e(C,"common.cancel")}</button>
          ${this._warnings.length?i`<button
                type="button"
                class="primary"
                ?disabled=${this._busy}
                @click=${()=>this._submit(!0)}
              >
                ${e(C,"fuel.save_anyway")}
              </button>`:i`<button type="submit" class="primary" ?disabled=${this._busy}>
                ${e(C,"common.save")}
              </button>`}
        </footer>
      </form>
    </dialog>`}};var W2="#2e7d32",x1=["#1e88e5","#8e24aa","#00897b","#f4511e","#3949ab","#e53935"],M1=220,f={top:12,right:8,bottom:28,left:56};function N2(M){if(M<=0)return 1;let C=10**Math.floor(Math.log10(M));return([1,2,2.5,5,10].find(V=>V*C>=M)??10)*C}var Z1=class extends v{static{this.properties={hass:{attribute:!1},data:{attribute:!1},categories:{attribute:!1},currency:{type:String},_width:{state:!0}}}static{this.styles=[s,Z`
      :host {
        display: block;
        position: relative;
      }
      svg.chart {
        width: 100%;
        height: ${M1}px;
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
    `]}constructor(){super(),this.data=[],this.categories=[],this.currency="EUR",this._width=600}connectedCallback(){super.connectedCallback(),this._observer=new ResizeObserver(([C])=>{let H=Math.round(C.contentRect.width);H>0&&Math.abs(H-this._width)>2&&(this._width=H)}),this._observer.observe(this)}disconnectedCallback(){super.disconnectedCallback(),this._observer?.disconnect()}_series(){let C=new Set(this.data.flatMap(L=>Object.keys(L.values))),H=[];C.has("fuel")&&H.push({id:"fuel",label:e(this.hass,"category.fuel"),color:W2});let V=0;for(let L of this.categories)C.has(L.id)&&H.push({id:L.id,label:L.label,color:L.color??x1[V++%x1.length]});for(let L of C)H.some(r=>r.id===L)||H.push({id:L,label:L,color:x1[V++%x1.length]});return H}render(){let C=this.hass,H=this._series(),V=this.data.map(m=>Object.values(m.values).reduce((b,N)=>b+N,0)),L=N2(Math.max(0,...V));if(!V.some(m=>m>0))return i`<p class="empty">${e(C,"chart.empty")}</p>`;let r=this._width,t=r-f.left-f.right,d=M1-f.top-f.bottom,o=t/this.data.length,a=Math.min(36,o*.7),n=o<34?2:1,p=m=>f.top+d-m/L*d,h=[0,.25,.5,.75,1].map(m=>m*L),u=m=>x(C,m,this.currency),W=m=>x(C,m,this.currency,0),W1=e(C,"chart.summary",{count:this.data.length});return i`
      <svg
        class="chart"
        viewBox="0 0 ${r} ${M1}"
        height=${M1}
        role="img"
        aria-label=${W1}
      >
        ${h.map(m=>C1`
            <line class="grid" x1=${f.left} x2=${r-f.right} y1=${p(m)} y2=${p(m)}></line>
            <text class="axis" x=${f.left-6} y=${p(m)+4} text-anchor="end">${W(m)}</text>`)}
        ${this.data.map((m,b)=>{let N=f.left+b*o+(o-a)/2,u1=0,S2=[`${_1(C,m.month)} \u2014 ${e(C,"chart.total")} ${u(V[b])}`,...H.filter(T=>m.values[T.id]).map(T=>`${T.label} : ${u(m.values[T.id])}`)].join(`
`);return C1`<g class="bar">
            <title>${S2}</title>
            <rect class="hit" x=${f.left+b*o} y=${f.top} width=${o} height=${d} fill="transparent"></rect>
            ${H.map(T=>{let S1=m.values[T.id]??0;if(S1<=0)return A;let N1=p(u1+S1),c2=p(u1)-N1;return u1+=S1,C1`<rect x=${N} y=${N1} width=${a} height=${Math.max(c2,.5)}
                fill=${T.color} stroke="var(--card-background-color, #fff)" stroke-width="1"></rect>`})}
            ${(this.data.length-1-b)%n===0?C1`<text class="axis" x=${N+a/2} y=${M1-8} text-anchor="middle">${x2(C,m.month)}</text>`:A}
          </g>`})}
      </svg>
      <ul class="legend" aria-label=${e(C,"section.monthly")}>
        ${H.map(m=>i`<li>
            <span class="swatch" style="background:${m.color}" aria-hidden="true"></span>${m.label}
          </li>`)}
      </ul>
      <div class="visually-hidden"><table>
        <caption>${W1}</caption>
        <thead>
          <tr>
            <th scope="col">${e(C,"chart.month")}</th>
            ${H.map(m=>i`<th scope="col">${m.label}</th>`)}
            <th scope="col">${e(C,"chart.total")}</th>
          </tr>
        </thead>
        <tbody>
          ${this.data.map((m,b)=>i`<tr>
              <th scope="row">${_1(C,m.month)}</th>
              ${H.map(N=>i`<td>${u(m.values[N.id]??0)}</td>`)}
              <td>${u(V[b])}</td>
            </tr>`)}
        </tbody>
      </table></div>
    `}};var I2={"vehicle-log-card":d1,"vehicle-log-journal-card":m1,"vehicle-log-card-editor":p1,"vl-fuel-dialog":v1,"vl-expense-dialog":n1,"vl-confirm-dialog":l1,"vl-monthly-chart":Z1};for(let[M,C]of Object.entries(I2))customElements.get(M)||customElements.define(M,C);var s1={language:navigator.language};window.customCards=window.customCards??[];for(let M of[{type:"vehicle-log-card",name:e(s1,"card.name"),description:e(s1,"card.description")},{type:"vehicle-log-journal-card",name:e(s1,"journal.name"),description:e(s1,"journal.description")}])window.customCards.some(C=>C.type===M.type)||window.customCards.push({...M,preview:!0});
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
