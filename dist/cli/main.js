#!/usr/bin/env node
/*!
 * mallery
 * Copyright(c) 2019 Katja Lutz
 * MIT Licensed
 * https://opensource.org/licenses/MIT
*/
require("source-map-support").install(),function(t){var e={};function r(n){if(e[n])return e[n].exports;var o=e[n]={i:n,l:!1,exports:{}};return t[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}r.m=t,r.c=e,r.d=function(t,e,n){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)r.d(n,o,function(e){return t[e]}.bind(null,o));return n},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="",r(r.s=5)}([function(t,e){t.exports=require("path")},function(t,e,r){"use strict";r.r(e),r.d(e,"readdirP",(function(){return c})),r.d(e,"rmdirP",(function(){return l})),r.d(e,"unlinkP",(function(){return s})),r.d(e,"mkdirP",(function(){return f})),r.d(e,"writeFileP",(function(){return p})),r.d(e,"readFileP",(function(){return h})),r.d(e,"lstatP",(function(){return d})),r.d(e,"copyP",(function(){return v})),r.d(e,"merge",(function(){return m})),r.d(e,"pathExists",(function(){return b})),r.d(e,"isObject",(function(){return g})),r.d(e,"clearDirP",(function(){return y})),r.d(e,"findBy",(function(){return _})),r.d(e,"escapeHtml",(function(){return j})),r.d(e,"escapeRegex",(function(){return P})),r.d(e,"replace",(function(){return x}));var n=r(3),o=r.n(n),i=r(0),a=r(2).promisify,u=r(6),c=a(u.readdir),l=a(u.rmdir),s=a(u.unlink),f=a(u.ensureDir),p=a(u.writeFile),h=a(u.readFile),d=a(u.lstat),v=a(u.copy),m=r(7),b=a(u.pathExists),g=function(t){var e=o()(t);return null!=t&&("object"==e||"function"==e)},y=function t(e){return c(e).catch((function(t){throw t})).then((function(r){var n=r.map((function(r){var n=i.join(e,r);return d(n).then((function(e){return e.isDirectory()?t(n).then((function(){return l(n)})):s(n)}))}));return Promise.all(n)}))},_=function(t){return function(e,r){for(var n=e.length,o=0,i=-1;o<=n;)e[o]&&e[o][t]&&e[o][t]===r&&(i=o,o=n),o++;return i}},j=function(t){return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")},P=function(t){return t.replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&")},x=function(t,e,r){t=P(t);var n=new RegExp(t,"g");return r.replace(n,e)}},function(t,e){t.exports=require("util")},function(t,e){t.exports=require("@babel/runtime/helpers/typeof")},function(t,e){t.exports=require("@babel/runtime/helpers/toConsumableArray")},function(t,e,r){var n=r(1),o=r(0),i=r(9).compileFileP,a=r(19),u=r(20),c=r(21),l=r(23),s=r(24),f=s.dist("front/*"),p=r(25);c.get().then((function(t){var e=o.join(t.paths.output),r=(o.join(__dirname,"dist","mallery.css"),o.join(t.paths.output,"app.min.css"),s.project("lib/front/assets")),c=o.join(r,"templates","layout.ejs.html"),h=o.join(r,"images","favicon.ico"),d=o.join(t.paths.output,"favicon.ico"),v=(o.join(t.paths.output,"index.html"),{});t.serve||function(t){return n.clearDirP(t.paths.output).catch((function(t){})).then((function(){var e=Promise.resolve();return null!=t.paths.public&&(e=e.then((function(){return n.pathExists(t.paths.public)})).then((function(e){if(e)return n.copyP(t.paths.public,t.paths.output)}))),e.then((function(){return n.mkdirP(t.paths.output)}))})).then((function(){if(!0===t.brandIcon)return n.pathExists(d).then((function(t){if(!t)return n.copyP(h,d)}))})).then((function(){return p.cp("-R",f,e)})).then((function(){}))}(t).then((function(){return u.createTocFromFolderP(t.paths.src)})).then((function(e){return null!=t.toc?u.mergeTocConfigWithToc(e,t.toc):e})).then((function(e){var r;return(e=u.calculateItemLevels(e)).items.forEach((function(e,i){if(e.id=i,null!=e.path){var a=e.path;if(null==r&&(r=i),r===i)e.path=e.path.replace(e.name,"index.html");else if(e.name.indexOf("index")>=0){var u=(u=e.path.replace(e.name,""))+e.name.replace("index","index"+i);e.path=u}null!=e.ext&&""!=e.ext&&(e.path=e.path.replace(e.ext,".html")),e.path=n.replace(" ","-",e.path),e.htmlPath=o.join("raw",e.path);var c=v[e.htmlPath]={};c.absoluteHtmlOutputPath=o.join(t.paths.output,"raw",e.path),c.absolutePath=e.absolutePath,delete e.absolutePath,c.absoluteOutputPath=o.join(t.paths.output,e.path);for(var l="",s=0;s<e.level;)l+="../",s++;""===l&&(l="./"),e.baseUrl=l}null==e.title&&null!=a&&(e.title=o.basename(a).replace(e.ext,""),e.title=n.replace("-"," ",e.title),e.title=n.replace("_"," ",e.title),e.title=n.replace("   "," - ",e.title),e.title=e.title.split(" ").map((function(t){return t.charAt(0).toUpperCase()+t.slice(1)})).join(" ")),!e.isDir&&e.path})),n.readFileP(c,"utf-8").then((function(t){return{layoutStr:t,toc:e}}))})).then((function(e){var r=e.toc;t.layoutStr=e.layoutStr;var a=Promise.resolve();return r.items.forEach((function(t){null!=t.path&&(a=a.then((function(){if(!t.isDir)return n.mkdirP(o.dirname(v[t.htmlPath].absoluteOutputPath)).then((function(){return n.mkdirP(o.dirname(v[t.htmlPath].absoluteHtmlOutputPath))}))})))})),a=(a=a.then((function(){var e=[];return r.items.forEach((function(r){var o=Promise.resolve();r.isDir||(Object.keys(t.includes).forEach((function(e){t.includes[e].forEach((function(t){t===r.ext&&(o=o.then((function(){switch(e){case"markdown":return i(v[r.htmlPath].absolutePath);case"html":return n.readFileP(v[r.htmlPath].absolutePath,"utf-8");case"plaintext":return n.readFileP(v[r.htmlPath].absolutePath,"utf-8").then((function(t){return n.escapeHtml(t)}));default:return!1}})))}))})),o=(o=o.then((function(t){return!1!==t&&null!=t&&(r.chapters=u.getHtmlChapters(t)),t}))).then((function(t){if(!1!==t&&null!=t)return r.hasContent=!0,n.writeFileP(v[r.htmlPath].absoluteHtmlOutputPath,t).then((function(){return n.writeFileP(v[r.htmlPath].absoluteOutputPath,t)}));r.hasContent=!1})),e.push(o))})),Promise.all(e)}))).then((function(){return t.toc=r,t}))})).then((function(t){var e=Promise.resolve(),r=a.compile(t.layoutStr);return t.toc.items.forEach((function(o,i){o.hasContent&&(e=e.then((function(){return n.readFileP(v[o.htmlPath].absoluteOutputPath,"utf-8")})).then((function(e){t.toc.activeItemId=i;var a=null!=o.title?o.title:"",u=a.toLowerCase(),c=null!=t.title?t.title:"";u!==c.toLowerCase()&&(a.length>0&&c.length>0&&(a+=" - "),a+=c);var s=r({version:l.version,baseUrl:o.baseUrl,content:e,title:a,options:JSON.stringify({config:{colors:t.colors,title:t.title,footer:t.footer},toc:t.toc},null," ")});return n.writeFileP(v[o.htmlPath].absoluteOutputPath,s)})))})),e}))}))},function(t,e){t.exports=require("fs-extra")},function(t,e,r){(function(t){var r=200,n="__lodash_hash_undefined__",o=800,i=16,a=9007199254740991,u="[object Arguments]",c="[object AsyncFunction]",l="[object Function]",s="[object GeneratorFunction]",f="[object Null]",p="[object Object]",h="[object Proxy]",d="[object Undefined]",v=/^\[object .+?Constructor\]$/,m=/^(?:0|[1-9]\d*)$/,b={};b["[object Float32Array]"]=b["[object Float64Array]"]=b["[object Int8Array]"]=b["[object Int16Array]"]=b["[object Int32Array]"]=b["[object Uint8Array]"]=b["[object Uint8ClampedArray]"]=b["[object Uint16Array]"]=b["[object Uint32Array]"]=!0,b[u]=b["[object Array]"]=b["[object ArrayBuffer]"]=b["[object Boolean]"]=b["[object DataView]"]=b["[object Date]"]=b["[object Error]"]=b[l]=b["[object Map]"]=b["[object Number]"]=b[p]=b["[object RegExp]"]=b["[object Set]"]=b["[object String]"]=b["[object WeakMap]"]=!1;var g="object"==typeof global&&global&&global.Object===Object&&global,y="object"==typeof self&&self&&self.Object===Object&&self,_=g||y||Function("return this")(),j=e&&!e.nodeType&&e,P=j&&"object"==typeof t&&t&&!t.nodeType&&t,x=P&&P.exports===j,w=x&&g.process,k=function(){try{return w&&w.binding&&w.binding("util")}catch(t){}}(),O=k&&k.isTypedArray;function E(t,e,r){switch(r.length){case 0:return t.call(e);case 1:return t.call(e,r[0]);case 2:return t.call(e,r[0],r[1]);case 3:return t.call(e,r[0],r[1],r[2])}return t.apply(e,r)}function z(t,e){return"__proto__"==e?void 0:t[e]}var A,F,S,q=Array.prototype,D=Function.prototype,C=Object.prototype,T=_["__core-js_shared__"],U=D.toString,I=C.hasOwnProperty,M=(A=/[^.]+$/.exec(T&&T.keys&&T.keys.IE_PROTO||""))?"Symbol(src)_1."+A:"",$=C.toString,L=U.call(Object),N=RegExp("^"+U.call(I).replace(/[\\^$.*+?()[\]{}|]/g,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$"),R=x?_.Buffer:void 0,B=_.Symbol,H=_.Uint8Array,W=R?R.allocUnsafe:void 0,J=(F=Object.getPrototypeOf,S=Object,function(t){return F(S(t))}),K=Object.create,G=C.propertyIsEnumerable,V=q.splice,Q=B?B.toStringTag:void 0,X=function(){try{var t=Pt(Object,"defineProperty");return t({},"",{}),t}catch(t){}}(),Y=R?R.isBuffer:void 0,Z=Math.max,tt=Date.now,et=Pt(_,"Map"),rt=Pt(Object,"create"),nt=function(){function t(){}return function(e){if(!Dt(e))return{};if(K)return K(e);t.prototype=e;var r=new t;return t.prototype=void 0,r}}();function ot(t){var e=-1,r=null==t?0:t.length;for(this.clear();++e<r;){var n=t[e];this.set(n[0],n[1])}}function it(t){var e=-1,r=null==t?0:t.length;for(this.clear();++e<r;){var n=t[e];this.set(n[0],n[1])}}function at(t){var e=-1,r=null==t?0:t.length;for(this.clear();++e<r;){var n=t[e];this.set(n[0],n[1])}}function ut(t){var e=this.__data__=new it(t);this.size=e.size}function ct(t,e){var r=zt(t),n=!r&&Et(t),o=!r&&!n&&Ft(t),i=!r&&!n&&!o&&Tt(t),a=r||n||o||i,u=a?function(t,e){for(var r=-1,n=Array(t);++r<t;)n[r]=e(r);return n}(t.length,String):[],c=u.length;for(var l in t)!e&&!I.call(t,l)||a&&("length"==l||o&&("offset"==l||"parent"==l)||i&&("buffer"==l||"byteLength"==l||"byteOffset"==l)||xt(l,c))||u.push(l);return u}function lt(t,e,r){(void 0===r||Ot(t[e],r))&&(void 0!==r||e in t)||pt(t,e,r)}function st(t,e,r){var n=t[e];I.call(t,e)&&Ot(n,r)&&(void 0!==r||e in t)||pt(t,e,r)}function ft(t,e){for(var r=t.length;r--;)if(Ot(t[r][0],e))return r;return-1}function pt(t,e,r){"__proto__"==e&&X?X(t,e,{configurable:!0,enumerable:!0,value:r,writable:!0}):t[e]=r}ot.prototype.clear=function(){this.__data__=rt?rt(null):{},this.size=0},ot.prototype.delete=function(t){var e=this.has(t)&&delete this.__data__[t];return this.size-=e?1:0,e},ot.prototype.get=function(t){var e=this.__data__;if(rt){var r=e[t];return r===n?void 0:r}return I.call(e,t)?e[t]:void 0},ot.prototype.has=function(t){var e=this.__data__;return rt?void 0!==e[t]:I.call(e,t)},ot.prototype.set=function(t,e){var r=this.__data__;return this.size+=this.has(t)?0:1,r[t]=rt&&void 0===e?n:e,this},it.prototype.clear=function(){this.__data__=[],this.size=0},it.prototype.delete=function(t){var e=this.__data__,r=ft(e,t);return!(r<0)&&(r==e.length-1?e.pop():V.call(e,r,1),--this.size,!0)},it.prototype.get=function(t){var e=this.__data__,r=ft(e,t);return r<0?void 0:e[r][1]},it.prototype.has=function(t){return ft(this.__data__,t)>-1},it.prototype.set=function(t,e){var r=this.__data__,n=ft(r,t);return n<0?(++this.size,r.push([t,e])):r[n][1]=e,this},at.prototype.clear=function(){this.size=0,this.__data__={hash:new ot,map:new(et||it),string:new ot}},at.prototype.delete=function(t){var e=jt(this,t).delete(t);return this.size-=e?1:0,e},at.prototype.get=function(t){return jt(this,t).get(t)},at.prototype.has=function(t){return jt(this,t).has(t)},at.prototype.set=function(t,e){var r=jt(this,t),n=r.size;return r.set(t,e),this.size+=r.size==n?0:1,this},ut.prototype.clear=function(){this.__data__=new it,this.size=0},ut.prototype.delete=function(t){var e=this.__data__,r=e.delete(t);return this.size=e.size,r},ut.prototype.get=function(t){return this.__data__.get(t)},ut.prototype.has=function(t){return this.__data__.has(t)},ut.prototype.set=function(t,e){var n=this.__data__;if(n instanceof it){var o=n.__data__;if(!et||o.length<r-1)return o.push([t,e]),this.size=++n.size,this;n=this.__data__=new at(o)}return n.set(t,e),this.size=n.size,this};var ht,dt=function(t,e,r){for(var n=-1,o=Object(t),i=r(t),a=i.length;a--;){var u=i[ht?a:++n];if(!1===e(o[u],u,o))break}return t};function vt(t){return null==t?void 0===t?d:f:Q&&Q in Object(t)?function(t){var e=I.call(t,Q),r=t[Q];try{t[Q]=void 0;var n=!0}catch(t){}var o=$.call(t);n&&(e?t[Q]=r:delete t[Q]);return o}(t):function(t){return $.call(t)}(t)}function mt(t){return Ct(t)&&vt(t)==u}function bt(t){return!(!Dt(t)||function(t){return!!M&&M in t}(t))&&(St(t)?N:v).test(function(t){if(null!=t){try{return U.call(t)}catch(t){}try{return t+""}catch(t){}}return""}(t))}function gt(t){if(!Dt(t))return function(t){var e=[];if(null!=t)for(var r in Object(t))e.push(r);return e}(t);var e=wt(t),r=[];for(var n in t)("constructor"!=n||!e&&I.call(t,n))&&r.push(n);return r}function yt(t,e,r,n,o){t!==e&&dt(e,(function(i,a){if(Dt(i))o||(o=new ut),function(t,e,r,n,o,i,a){var u=z(t,r),c=z(e,r),l=a.get(c);if(l)return void lt(t,r,l);var s=i?i(u,c,r+"",t,e,a):void 0,f=void 0===s;if(f){var h=zt(c),d=!h&&Ft(c),v=!h&&!d&&Tt(c);s=c,h||d||v?zt(u)?s=u:Ct(_=u)&&At(_)?s=function(t,e){var r=-1,n=t.length;e||(e=Array(n));for(;++r<n;)e[r]=t[r];return e}(u):d?(f=!1,s=function(t,e){if(e)return t.slice();var r=t.length,n=W?W(r):new t.constructor(r);return t.copy(n),n}(c,!0)):v?(f=!1,m=c,b=!0?(g=m.buffer,y=new g.constructor(g.byteLength),new H(y).set(new H(g)),y):m.buffer,s=new m.constructor(b,m.byteOffset,m.length)):s=[]:function(t){if(!Ct(t)||vt(t)!=p)return!1;var e=J(t);if(null===e)return!0;var r=I.call(e,"constructor")&&e.constructor;return"function"==typeof r&&r instanceof r&&U.call(r)==L}(c)||Et(c)?(s=u,Et(u)?s=function(t){return function(t,e,r,n){var o=!r;r||(r={});var i=-1,a=e.length;for(;++i<a;){var u=e[i],c=n?n(r[u],t[u],u,r,t):void 0;void 0===c&&(c=t[u]),o?pt(r,u,c):st(r,u,c)}return r}(t,Ut(t))}(u):(!Dt(u)||n&&St(u))&&(s=function(t){return"function"!=typeof t.constructor||wt(t)?{}:nt(J(t))}(c))):f=!1}var m,b,g,y;var _;f&&(a.set(c,s),o(s,c,n,i,a),a.delete(c));lt(t,r,s)}(t,e,a,r,yt,n,o);else{var u=n?n(z(t,a),i,a+"",t,e,o):void 0;void 0===u&&(u=i),lt(t,a,u)}}),Ut)}function _t(t,e){return kt(function(t,e,r){return e=Z(void 0===e?t.length-1:e,0),function(){for(var n=arguments,o=-1,i=Z(n.length-e,0),a=Array(i);++o<i;)a[o]=n[e+o];o=-1;for(var u=Array(e+1);++o<e;)u[o]=n[o];return u[e]=r(a),E(t,this,u)}}(t,e,$t),t+"")}function jt(t,e){var r,n,o=t.__data__;return("string"==(n=typeof(r=e))||"number"==n||"symbol"==n||"boolean"==n?"__proto__"!==r:null===r)?o["string"==typeof e?"string":"hash"]:o.map}function Pt(t,e){var r=function(t,e){return null==t?void 0:t[e]}(t,e);return bt(r)?r:void 0}function xt(t,e){var r=typeof t;return!!(e=null==e?a:e)&&("number"==r||"symbol"!=r&&m.test(t))&&t>-1&&t%1==0&&t<e}function wt(t){var e=t&&t.constructor;return t===("function"==typeof e&&e.prototype||C)}var kt=function(t){var e=0,r=0;return function(){var n=tt(),a=i-(n-r);if(r=n,a>0){if(++e>=o)return arguments[0]}else e=0;return t.apply(void 0,arguments)}}(X?function(t,e){return X(t,"toString",{configurable:!0,enumerable:!1,value:(r=e,function(){return r}),writable:!0});var r}:$t);function Ot(t,e){return t===e||t!=t&&e!=e}var Et=mt(function(){return arguments}())?mt:function(t){return Ct(t)&&I.call(t,"callee")&&!G.call(t,"callee")},zt=Array.isArray;function At(t){return null!=t&&qt(t.length)&&!St(t)}var Ft=Y||function(){return!1};function St(t){if(!Dt(t))return!1;var e=vt(t);return e==l||e==s||e==c||e==h}function qt(t){return"number"==typeof t&&t>-1&&t%1==0&&t<=a}function Dt(t){var e=typeof t;return null!=t&&("object"==e||"function"==e)}function Ct(t){return null!=t&&"object"==typeof t}var Tt=O?function(t){return function(e){return t(e)}}(O):function(t){return Ct(t)&&qt(t.length)&&!!b[vt(t)]};function Ut(t){return At(t)?ct(t,!0):gt(t)}var It,Mt=(It=function(t,e,r){yt(t,e,r)},_t((function(t,e){var r=-1,n=e.length,o=n>1?e[n-1]:void 0,i=n>2?e[2]:void 0;for(o=It.length>3&&"function"==typeof o?(n--,o):void 0,i&&function(t,e,r){if(!Dt(r))return!1;var n=typeof e;return!!("number"==n?At(r)&&xt(e,r.length):"string"==n&&e in r)&&Ot(r[e],t)}(e[0],e[1],i)&&(o=n<3?void 0:o,n=1),t=Object(t);++r<n;){var a=e[r];a&&It(t,a,r,o)}return t})));function $t(t){return t}t.exports=Mt}).call(this,r(8)(t))},function(t,e){t.exports=function(t){return t.webpackPolyfill||(t.deprecate=function(){},t.paths=[],t.children||(t.children=[]),Object.defineProperty(t,"loaded",{enumerable:!0,get:function(){return t.l}}),Object.defineProperty(t,"id",{enumerable:!0,get:function(){return t.i}}),t.webpackPolyfill=1),t}},function(t,e,r){"use strict";r.r(e),r.d(e,"compileFileP",(function(){return b}));var n=r(2).promisify,o=r(10),i=n(o.readFile),a=n(o.writeFile),u=r(11),c=r(12),l=r(13),s=r(14),f=r(15),p=(r(16),r(17)),h=r(18);function d(t,e,r){return t[e]||(t[e]=r),t[e]}var v=u().use(l).use(c).use(s).use((function(t){return function(t,e){var r=function(t){if(null!=t){if("blockquote"==t.type){var e=d(t,"data",{});d(e,"hProperties",{}).class="blockquote",null!=t.children&&t.children.forEach((function(t){if("paragraph"==t.type){var e=d(t,"data",{});d(e,"hProperties",{}).class="mb-0"}}))}if("image"==t.type){e=d(t,"data",{});d(e,"hProperties",{}).class="img-fluid"}if("link"==t.type&&null!=t.url&&"#"!=t.url[0]){e=d(t,"data",{});d(e,"hProperties",{}).target="_blank"}if("table"==t.type){e=d(t,"data",{});d(e,"hProperties",{}).class="table table-hover table-bordered"}null!=t.children&&n(t.children)}},n=function(t){t.forEach((function(t){return r(t)}))};n(t.children)}})).use(h).use(f,{content:{type:"element",tagName:"span",properties:{className:["toc-link"]},children:[{type:"element",tagName:"span",properties:{className:["icono-chain"]}}]}}).use(p),m=n(v.process.bind(v)),b=function(t,e){return i(t).then(m).then((function(t){return null!=e?a(e,t.contents).then((function(){return t.contents})):t.contents}))}},function(t,e){t.exports=require("fs")},function(t,e){t.exports=require("remark")},function(t,e){t.exports=require("remark-html")},function(t,e){t.exports=require("remark-toc")},function(t,e){t.exports=require("remark-highlight.js")},function(t,e){t.exports=require("remark-autolink-headings")},function(t,e){t.exports=require("remark-github")},function(t,e){t.exports=require("remark-gemoji-to-emoji")},function(t,e){t.exports=require("remark-slug")},function(t,e){t.exports=require("ejs")},function(t,e,r){"use strict";r.r(e),r.d(e,"createTocFromFolderP",(function(){return l})),r.d(e,"mergeTocConfigWithToc",(function(){return s})),r.d(e,"calculateItemLevels",(function(){return f})),r.d(e,"getHtmlChapters",(function(){return p}));var n=r(4),o=r.n(n),i=r(1),a=r(0),u=function(t,e){return null==t&&(t=[]),null==e&&(e=[]),{items:t,root:e}},c=i.findBy("path"),l=function t(e,r,n){return null==r&&(r=u()),null==n&&(n=e),i.readdirP(e).then((function(o){var u=[],c=Promise.resolve();return o.forEach((function(o){var l=a.join(e,o);c=c.then((function(){return i.lstatP(l)})).then((function(e){var i=r.items.push({ext:a.extname(o),isDir:e.isDirectory(),absolutePath:l,path:l.replace(n+a.sep,""),name:o})-1;if(u.push(i),r.items[i].isDir)return t(l,r,n).then((function(t){(r=t).items[i].children=r.root,r.root=[]}))}))})),c=c.then((function(){return r.root=u,r}))}))},s=function(t,e){var r=u();return r.root=function e(n,o){null==o&&(o="");var i=[];return n.forEach((function(n){var u={};if(null!=n.path){n.path=a.join(o,n.path);var l=c(t.items,n.path);!1!==l&&(u=t.items[l])}u.href=n.href,null!=n.title&&(u.title=n.title);var s=r.items.push(u)-1;null!=n.children?(r.items[s].children=e(n.children,n.path),r.items[s].isDir=!0):null!=u.children&&(r.items[s].children=function e(n){var o=[];return n.forEach((function(n){var i=t.items[n],a=r.items.push(i)-1;o.push(a),null!=i.children&&(i.children=e(i.children))})),o}(u.children)),i.push(s)})),i}(e),r},f=function t(e,r,n){return null==n&&(n=0),null==r&&(r=e.root),r.forEach((function(r){var o=e.items[r];o.level=n,null!=o.children&&t(e,o.children,n+1)})),e},p=function(t){var e={root:[],items:[]},r='<h(\\d*)(?: id="(.*?)")?.*?>([\\s\\S]*?)<\\/h\\1(?: .*?)?>',n=new RegExp(r,"g"),i=new RegExp(r),a=/<(?:.|\n)*?>/gm,u=t.match(n);if(null!=u&&u.length>0){var c=function t(e){var r=e[0],n=e.slice(1),i=[],a=!1,u=[];return n.forEach((function(t){t.level===r.level?(i.push(t),a=!0):!1===a&&r.level<t.level?u.push(t):i.push(t)})),u.length>0&&(u=t(u)),r.children=u,i.length>0&&(i=t(i)),[r].concat(o()(i))}(u=u.map((function(t){var e=t.match(i),r=e[2],n=e[3].replace(a,"");return{level:e[1],heading:n,hash:r}})));e.root=function t(r){return r.map((function(r){var n=e.items.push(r)-1;return r.id=n,r.children=t(r.children),n}))}(c)}return e}},function(t,e,r){"use strict";r.r(e),r.d(e,"get",(function(){return c}));var n=r(22),o=r(0),i=process.cwd(),a=r(1),u=function t(e,r,o){null==o&&(o=""),null==r&&(r=!1),Object.keys(e).forEach((function(i){if(!(["includes","toc"].indexOf(i)>=0)){var u=o+i,c=e[i],l=!0===c||!1===c;if(a.isObject(c))t(e[i],!0,i+"-");else{var s=i[0];void 0!==n.argv[u]?c=n.argv[u]:r&&void 0!==n.argv[s]&&(c=n.argv[s]),e[i]=l?!0===c||"true"===c:c}}}))},c=function(){var t,e={brandIcon:!0,colors:{accent:"#00BF63"},title:"",footer:{html:""},paths:{config:"mallery.config.js",src:"docs",output:"site",public:"docs/public"},includes:{plaintext:[".txt"],html:[".html"],markdown:[".md"]},serve:!1};return null!=n.argv._[0]&&(e.paths.config=n.argv._[0]),u(e.paths),u(e),(t=e.paths.config,o.isAbsolute(t)||(t=o.join(i,t)),a.lstatP(t).catch((function(t){return!1})).then((function(e){return!1!==e&&require("./"+o.relative(__dirname,t))})).catch((function(e){console.error(e),console.error('Something went wrong while reading the config file: "'.concat(t,'"')),process.exit()}))).then((function(t){if(!1!==t){if(null!=t.paths){var r=o.basename(o.dirname(e.paths.config));Object.keys(t.paths).forEach((function(e){var n=t.paths[e];null!=n&&(o.isAbsolute(n)||(t.paths[e]=o.join(r,n)))}))}e=a.merge(e,t)}return u(e.paths),u(e),Object.keys(e.paths).forEach((function(t){var r=e.paths[t];null!=r&&(o.isAbsolute(r)||(e.paths[t]=o.join(i,r)))})),e}))}},function(t,e){t.exports=require("yargs")},function(t){t.exports=JSON.parse('{"name":"mallery","version":"1.0.0-alpha.2","description":"Static documentation site generator","main":"index.js","homepage":"https://github.com/malleryjs/mallery","types":"typings/package/main/main.d.ts","author":"Katja Lutz","license":"MIT","bin":{"mallery":"./dist/cli/main.js"},"devDependencies":{"@babel/core":"^7.7.7","@babel/plugin-external-helpers":"^7.7.4","@babel/plugin-proposal-class-properties":"^7.7.4","@babel/plugin-proposal-object-rest-spread":"^7.7.7","@babel/plugin-syntax-dynamic-import":"^7.7.4","@babel/plugin-transform-react-jsx":"^7.7.7","@babel/plugin-transform-runtime":"^7.7.6","@babel/polyfill":"^7.7.0","@babel/preset-env":"^7.7.7","@babel/preset-typescript":"^7.7.7","@babel/runtime":"^7.7.7","@lufrai/concat-with-sourcemaps":"^1.1.0","@lufrai/redom":"^3.23.2","@types/chai":"^4.2.7","@types/express":"^4.17.2","@types/express-http-proxy":"^1.5.12","@types/lodash":"^4.14.149","@types/mocha":"^5.2.7","@types/node":"^12.12.22","@types/selenium-webdriver":"^4.0.6","@types/webpack-env":"^1.14.1","alo":"^4.0.0-alpha.13","babel-loader":"^8.0.6","babel-plugin-emotion":"^10.0.27","babel-plugin-lodash":"^3.3.4","babel-plugin-macros":"^2.8.0","bootstrap":"^4.4.1","chai":"^4.2.0","chalk":"^2.4.2","chromedriver":"^76.0.1","clsx":"^1.0.4","codegen.macro":"^3.0.0","cross-env":"^5.2.1","css-loader":"^3.4.0","emotion":"^10.0.27","emotion-server":"^10.0.27","express-http-proxy":"^1.6.0","feathericon":"^1.0.2","file-loader":"^4.3.0","hoppla":"^0.10.1","html-webpack-plugin":"^4.0.0-beta.11","icono":"^1.3.2","idx.macro":"^4.0.0","istanbul-instrumenter-loader":"^3.0.1","jsdom":"15.1.1","jsdom-global":"3.0.2","lost":"^8.3.1","micromatch":"^4.0.2","mini-css-extract-plugin":"^0.8.2","mocha":"^6.2.2","modernizr":"^3.8.0","nodemon":"^1.19.4","null-loader":"^3.0.0","nyc":"^14.1.1","optimize-css-assets-webpack-plugin":"^5.0.3","param.macro":"^3.2.1","pino":"^5.15.0","pino-pretty":"^3.5.0","postcss-flexbugs-fixes":"^4.1.0","postcss-loader":"^3.0.0","postcss-preset-env":"^6.7.0","preact":"^10.1.1","prettier":"^1.19.1","preval.macro":"^3.0.0","raw-loader":"^3.1.0","resolve-url-loader":"^3.1.1","router5":"^7.0.2","router5-plugin-browser":"^7.0.2","rucksack-css":"^1.0.2","sanitize.css":"^11.0.0","sass":"^1.24.0","sass-loader":"^7.3.1","selenium-webdriver":"^4.0.0-alpha.5","style-loader":"^1.1.2","svgo":"^1.3.2","svgstore":"^3.0.0-2","terser-webpack-plugin":"^1.4.3","typescript":"^3.7.4","wait-on":"^3.3.0","webpack":"4.39.2","webpack-bundle-analyzer":"^3.6.0","webpack-cli":"^3.3.10","webpack-dev-server":"^3.10.1","webpack-filter-warnings-plugin":"^1.2.1","webpack-node-externals":"^1.7.2","workbox-webpack-plugin":"^4.3.1","worker-loader":"^2.0.0"},"optionalDependencies":{"fibers":"^4.0.1"},"common":{"licenseUrl":"https://opensource.org/licenses/MIT","repoStaticUrl":"https://raw.github.com/malleryjs/mallery/${branch}/","readmeSvgUrlSuffix":"?sanitize=true","bannerCopyright":"Copyright(c) 2019 Katja Lutz"},"repository":{"type":"git","url":"https://github.com/malleryjs/mallery.git"},"dependencies":{"ejs":"^3.0.1","yargs":"^14.2.2","remark":"^11.0.2","remark-autolink-headings":"^5.2.1","remark-gemoji-to-emoji":"^1.1.0","remark-github":"^8.0.0","remark-highlight.js":"^5.2.0","remark-html":"^10.0.0","remark-slug":"^5.1.2","remark-toc":"^6.0.0","lodash":"^4.17.15","source-map-support":"^0.5.16","shelljs":"^0.8.3"}}')},function(t,e,r){var n=r(0),o=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";return n.resolve(__dirname,"../..",t)},i=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";return n.resolve(o(),"tmp",t)};t.exports={project:o,scripts:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";return n.resolve(o(),"scripts",t)},lib:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";return n.resolve(o(),"lib",t)},config:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";return n.resolve(o(),"config",t)},dist:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";return n.resolve(o(),"dist",t)},testDist:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";return n.resolve(i(),"test",t)},tmp:i,static:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";return n.resolve(o(),"static",t)}}},function(t,e){t.exports=require("shelljs")}]);
//# sourceMappingURL=main.js.map