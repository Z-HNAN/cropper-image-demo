if(!self.define){const e=e=>{"require"!==e&&(e+=".js");let r=Promise.resolve();return s[e]||(r=new Promise(async r=>{if("document"in self){const s=document.createElement("script");s.src=e,document.head.appendChild(s),s.onload=r}else importScripts(e),r()})),r.then(()=>{if(!s[e])throw new Error(`Module ${e} didn’t register its module`);return s[e]})},r=(r,s)=>{Promise.all(r.map(e)).then(e=>s(1===e.length?e[0]:e))},s={require:Promise.resolve(r)};self.define=(r,i,n)=>{s[r]||(s[r]=Promise.resolve().then(()=>{let s={};const a={uri:location.origin+r.slice(1)};return Promise.all(i.map(r=>{switch(r){case"exports":return s;case"module":return a;default:return e(r)}})).then(e=>{const r=n(...e);return s.default||(s.default=r),s})}))}}define("./service-worker.js",["./workbox-24aa846e"],(function(e){"use strict";e.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"css/1.main.css",revision:"4314da1315740a0a009aa71d772d4861"},{url:"css/main.css",revision:"d3f35918b46c282d8747c893a93abe20"},{url:"index.html",revision:"8d1760a82b52ec13e64daac223effb96"},{url:"js/1.bundle.js",revision:"4ac7aca52c2c116859af5a8caaf00383"},{url:"js/bundle.js",revision:"a3fadd484a989b69a315b729b0d972ca"}],{})}));
//# sourceMappingURL=service-worker.js.map