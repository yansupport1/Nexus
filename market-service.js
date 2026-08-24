/* Nexus-X Market Service v3.2 — data-only, no fake prices or trading writes. */
(function(g){
  'use strict';
  var C={base:'https://api.coinpaprika.com/v1',vs:'USD',limit:100};
  function url(path,params){var u=C.base+path;var q=[];Object.keys(params||{}).forEach(function(k){if(params[k]!==undefined&&params[k]!==null&&params[k]!=='')q.push(encodeURIComponent(k)+'='+encodeURIComponent(params[k]));});return q.length?u+'?'+q.join('&'):u;}
  function json(path,params){return fetch(url(path,params),{headers:{Accept:'application/json'},cache:'no-store'}).then(function(r){if(!r.ok)throw new Error('API '+r.status);return r.json();});}
  function markets(){return json('/tickers',{quotes:C.vs,limit:C.limit});}
  function ticker(id){return json('/tickers/'+encodeURIComponent(id),{quotes:C.vs});}
  function chart(id,days){var end=new Date(),start=new Date(Date.now()-Math.max(1,days)*86400000);var fmt=function(d){return d.toISOString().slice(0,10)};return json('/coins/'+encodeURIComponent(id)+'/ohlcv/historical',{start:fmt(start),end:fmt(end),quote:C.vs});}
  function setConfig(x){C=Object.assign(C,x||{});}
  g.NexusMarketService={config:C,setConfig:setConfig,markets:markets,ticker:ticker,chart:chart};
})(window);
