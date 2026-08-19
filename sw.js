const CACHE='shadow-tracker-v3';
const SHELL=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x))))
    .then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET') return;
  // Tile/API di Google e query Overpass (OpenStreetMap): sempre in rete, mai in cache —
  // se manca la connessione l'app passa da sola alla mappa schematica / disabilita il rilevamento edifici.
  if(u.hostname.includes('googleapis.com')||u.hostname.includes('gstatic.com')||u.hostname.includes('google.com')
     ||u.hostname.includes('overpass-api.de')) return;
  e.respondWith(
    caches.match(e.request).then(hit=> hit || fetch(e.request).then(res=>{
      const copy=res.clone();
      caches.open(CACHE).then(c=>{ if(res.ok && u.origin===location.origin) c.put(e.request,copy); });
      return res;
    }).catch(()=>caches.match('./index.html')))
  );
});
