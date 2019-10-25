const CACHE_NAME = "svoyak-v1.0.2";
const urlsToCache = [
    "/",
    "/bundle.js"
];

const applicationPages = [
    "/login",
    "/signup",
];


async function cacheInitPromise() {
    try {
        const cache = await caches.open(CACHE_NAME);
        await cache.addAll(urlsToCache);
    } catch (err) {
        console.log(`Cache init error ${err}`);
    }
    console.log("Установлен успешно");
}

self.addEventListener("install", function (event) {
    event.waitUntil(cacheInitPromise());
});

//  ===========================================================

// TODO: Добавить кэширование переменных данных, которые по сообщению
// message из вне будут изменяться в кэше

async function processPromise(event) {
    const url = new URL(event.request.url);
    if (applicationPages.includes(url.pathname) === true) {
        const cache = await caches.open(CACHE_NAME);
        const response = await cache.match("/");
        console.log(`Страница приложения найдена в кэше: ${response.url}`);
        return response;
    }



    const response = await caches.match(event.request);
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

    // let responseToCache = response.clone();
    // let cache = await caches.open(CACHE_NAME);
    // cache.put(event.request, responseToCache);
    // console.log(`Обычный запрос: ${response.url}`);
    return response;
}

self.addEventListener("fetch", function (event) {
    event.respondWith(processPromise(event));
});

// ============================================================

async function reloadPromise() {
    const cacheNames = await caches.keys();

    const promises = cacheNames.map(async (cacheName) => {
        if (cacheName !== CACHE_NAME) {
            const result = await caches.delete(cacheName);
            return result
        }
    });

    return await Promise.all(promises);
}

self.addEventListener("activate", function (event) {
    event.waitUntil(reloadPromise());
});

// ============================================================

