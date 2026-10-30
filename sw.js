var CACHE='mnw-cache-v1';

self.addEventListener('install',function(){
  self.skipWaiting();
});

self.addEventListener('activate',function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);}));
    }).then(function(){return clients.claim();})
  );
});

self.addEventListener('fetch',function(e){
  if(e.request.method!=='GET')return;
  e.respondWith(
    fetch(e.request,{cache:'no-cache'}).then(function(resp){
      if(resp&&resp.ok){
        var copy=resp.clone();
        caches.open(CACHE).then(function(c){c.put(e.request,copy);});
      }
      return resp;
    }).catch(function(){
      return caches.match(e.request);
    })
  );
});
