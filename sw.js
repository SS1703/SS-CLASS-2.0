var C='ssclass-v3';
var SHELL=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png'];
self.addEventListener('install',function(e){e.waitUntil(caches.open(C).then(function(c){return c.addAll(SHELL)}).then(function(){return self.skipWaiting()}))});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(x){return x!==C}).map(function(x){return caches.delete(x)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener('fetch',function(e){
 var r=e.request,u=new URL(r.url);
 if(r.method!=='GET'||u.origin!==location.origin)return;
 e.respondWith(fetch(r).then(function(res){var cp=res.clone();caches.open(C).then(function(c){c.put(r,cp)});return res}).catch(function(){return caches.match(r).then(function(m){return m||caches.match('index.html')})}))});
self.addEventListener('push',function(e){
 var d={};try{d=e.data.json()}catch(x){}
 var p=d.data||d.notification||d;
 e.waitUntil(self.registration.showNotification(p.title||'SS Class 2.0',{body:p.body||'',icon:'icon-192.png',badge:'icon-192.png',data:{url:'./'}}))});
self.addEventListener('notificationclick',function(e){e.notification.close();
 e.waitUntil(clients.matchAll({type:'window',includeUninstalled:false}).then(function(l){for(var i=0;i<l.length;i++){if('focus' in l[i])return l[i].focus()}return clients.openWindow('./')}))});
