const CACHE_NAME = "svoyak-v1.0.5";

// Когда мы передаем URL строку в функции cache API,
// неявно создается объект реквеста, где урл запроса сгенериться,
// автоматически из имени домена в строке

async function cacheInitPromise() {
    self.skipWaiting();

    self.preCacheList = new Array;
    const cache = await caches.open(CACHE_NAME);
    for (const cacheObj of self.__precacheManifest) {
        preCacheList.push(cacheObj.url);

        const key = new URL("https://localhost:8080" + cacheObj.url + "?" + cacheObj.revision);
        const findKey = key.pathname + key.search;
        try {
            const response = await cache.match(findKey);
            if (response === undefined) {
                const allKeys = await cache.keys();
                await allKeys.forEach(
                    async function (request) {
                        const requestURL = new URL(request.url);
                        if ((key.pathname === requestURL.pathname) && (key.search !== requestURL.search)) {
                            await cache.delete(request.url);
                            console.log(`UPDATE from ${requestURL.pathname + requestURL.search}`);
                            console.log(`To ${key.pathname + key.search}`);
                            await cache.add(key.pathname + key.search);
                        }
                    }
                );
                await cache.add(findKey);
                console.log(`CACHED: ${findKey}`);
            } else {
                console.log(`ALREADY EXIST: ${key}`);
            }
        } catch (err) {
            console.log(`Cache init error! ${err}`);
        }
    }
    console.log("Установлен успешно");
}

self.addEventListener("install", function (event) {
    event.waitUntil(cacheInitPromise());
});

//  ===========================================================

async function processPromise(event) {
    let requestUrl = new URL(event.request.url);
    requestUrl = _transformApiUrl(requestUrl);


    if (!navigator.onLine) {
        const cache = await caches.open(CACHE_NAME);
        try {
            const response = await cache.match(requestUrl, {ignoreSearch: true});
            console.log(`OFFLINE Страница найдена в кэше: ${response.url}`);
            return response;
        } catch {
            console.log(`Страница не найдена: ${requestUrl}`);
            return;
        }
    } else {
        const cache = await caches.open(CACHE_NAME);
        let response = await cache.match(requestUrl, {ignoreSearch: true});

        if (response) {
            console.log(`Найдено в статическом кэше: ${_getUrlRevision(requestUrl)}`);
            return response;
        } else if (_isPreCacheUrl(requestUrl)) {
            console.log(`Был удален: ${_getUrlRevision(requestUrl)}`);
            await cache.add(_getUrlRevision(requestUrl));
            response = await cache.match(_getUrlRevision(requestUrl));

            if (response) {
                console.log("Восстановлен успешно");
                console.log(response);
                return response;
            } else {
                console.log("Не удалось восстановить");
            }
        }


        if (!needCache(requestUrl)) {
            try{
                response = await fetch(event.request);
            } catch(err) {
                console.log(err);
                return response;
            }
            console.log(`Не нужно кэшировать: ${requestUrl.pathname}`);
            return response;
        }


        const fetchRequest = event.request.clone();
        try {
            response = await fetch(fetchRequest);
        } catch(err) {
            console.log(err);
            return response;
        }

        const responseToCache = response.clone();

        cache.put(requestUrl, responseToCache);
        console.log(`ONLINE Страница загружена и сохранена в кэше!!: ${requestUrl}`);
        return response;
    }
}

self.addEventListener("fetch", function (event) {
    if (event.request.method === "GET") {
        event.respondWith(processPromise(event));
    }
});

// ============================================================

async function reloadPromise() {
    console.log("SW RELOAD");
    self.clients.claim();

    const cacheNames = await caches.keys();

    const promises = cacheNames.map(async (cacheName) => {
        if (cacheName !== CACHE_NAME) {
            const result = await caches.delete(cacheName);
            return result
        }
    });


    const cache = await caches.open(CACHE_NAME);

    for (const cacheObj of self.__precacheManifest) {
        const keys = await cache.keys();
        for (request of keys) {
            const requestUrl = new URL(request.url);
            if ((requestUrl.pathname === cacheObj.url) && (requestUrl.search !== "?" + cacheObj.revision)) {
                const delPromise = await cache.delete(requestUrl.pathname + requestUrl.search);
                promises.push(delPromise);
                console.log(`Удалена старая версия кэша: ${requestUrl.pathname + requestUrl.search}`);
            }
        }
    }

    return await Promise.all(promises);
}

self.addEventListener("activate", function (event) {
    event.waitUntil(reloadPromise());
});

// ============================================================

self.addEventListener("message", async function (event) {
    console.log(event.data);

    if (event.data.command === "delete") {
        const cache = await caches.open(CACHE_NAME);
        console.log(`delete ${event.data.url}`);
        await cache.delete(event.data.url);
    } else if (event.data.command === "regExp_delete") {
        const cache = await caches.open(CACHE_NAME);
        const keys = await cache.keys();

        for (key of keys) {
            const parseUrl = new URL(key.url);
            if (parseUrl.pathname.match(event.data.regExp)) {
                const result = await cache.delete(key);
                console.log(`regExp_delete[${key}]: ${result}`);
            }
        }
    }

    // const clients = await self.clients.matchAll();
    // clients.forEach(client => {
    //     console.log("Send from SW");
    //     console.log(client.id);
    //     console.log(client.type);
    //     console.log(client.url);
    //     client.postMessage("!!!!!");
    // });
});


const CacheListApi = [
    "^(/api/user/)$",
    "^(/api/profile)$",
    "^(/api/uploads/avatar/)[0-9]+(.jpeg|.png)$",
];

function needCache(requestUrl) {
    for (path of CacheListApi) {
        const regExp = new RegExp(path);
        if (requestUrl.pathname.match(regExp)) {
            return true;
        }
    }
    return false;
}


function _isPreCacheUrl(requestUrl) {
    if (requestUrl.pathname === "/") {
        return true;
    }
    for (const cacheObj of self.__precacheManifest) {
        if (requestUrl.pathname === cacheObj.url) {
            return true;
        }
    }
    return false;
}


function _getUrlRevision(requestUrl) {
    if (requestUrl.pathname === "/") {
        for (const cacheObj of self.__precacheManifest) {
            if (cacheObj.url === "/index.html") {
                return "/index.html?" + cacheObj.revision;
            }
        }
    } else {
        for (const cacheObj of self.__precacheManifest) {
            if (cacheObj.url === requestUrl.pathname) {
                return requestUrl.pathname + "?" + cacheObj.revision;
            }
        }
    }
    return requestUrl;
}


function _transformApiUrl(requestUrl) {
    const appPages = ["/", "/login", "/profile", "/signup", "/single_game"];

    for (const page of appPages) {
        if (requestUrl.pathname === page) {
            requestUrl.pathname = "/index.html";
            return requestUrl;
        }
    }

    return requestUrl;
}




