const pwa = "pwa"
const assets = [
  "/index.html",
  "/css",
  "/img",
  "/js"

]

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(pwa).then(cache => {
      cache.addAll(assets)
    })
  )
})
self.addEventListener("fetch", fetchEvent => {
    fetchEvent.respondWith(
      caches.match(fetchEvent.request).then(res => {
        return res || fetch(fetchEvent.request)
      })
    )
  })
