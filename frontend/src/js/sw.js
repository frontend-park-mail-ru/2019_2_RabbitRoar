const CACHE_NAME = "svoyak-v1";
const urlsToCache = [
    "/",
    "/bundle.js",
    "/user/profile",

];

async function cacheInitPromise() {
    const cache = await caches.open(CACHE_NAME);
    console.log("Opened cache");
    await cache.addAll(urlsToCache);
    console.log("Установлен успешно");
}

async function processPromise(event) {
    console.log("HERE!");
    let response = await caches.match(event.request);
    if (response) {
        console.log(`Найдено в кэше: ${response.url}`);
        return response;
    }

    let fetchRequest = event.request.clone();

    response = await fetch(fetchRequest);
    if (!response) {
        console.log(`Неудачный запрос: ${response.url}`);
        return response;
    }

    let responseToCache = response.clone();
    let cache = await caches.open(CACHE_NAME);
    cache.put(event.request, responseToCache);
    console.log(`Обычный запрос: ${response.url}`);
    return response;
}


self.addEventListener("install", function (event) {
    event.waitUntil(cacheInitPromise());
});

self.addEventListener("activate", (event) => {
    console.log("Активирован");
});

self.addEventListener("fetch", function (event) {
    event.respondWith(processPromise(event));
});