const CACHE_NAME = "svoyak-v1.0.5";


async function cacheInitPromise() {
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
                console.log(`CACHED!: ${findKey}`);
            } else {
                console.log(`ALREADY EXIST: ${key}`);
            }
        } catch (err) {
            console.log(`Cache init error! ${err}`);
        }
    }
    console.log("Установлен успешно!");
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
            const response = await cache.match(_getUrlRevision(requestUrl));
            console.log(`OFFLINE Страница найдена в кэше!!!: ${response.url}`);
            return response;
        } catch {
            console.log(`Страница не найдена!`);
            return;
        }
    } else {
        if (_isPreCacheUrl(requestUrl)) {
            const cache = await caches.open(CACHE_NAME);
            let response = await cache.match(_getUrlRevision(requestUrl));

            if (response) {
                console.log(`Найдено в статическом кэше: ${_getUrlRevision(requestUrl)}`);
            } else {
                console.log(`Был удален: ${_getUrlRevision(requestUrl)}`);
                await cache.add(_getUrlRevision(requestUrl));
                response = await cache.match(_getUrlRevision(requestUrl));
                console.log("Восстановлен успешно");
                console.log(response);
            }
            return response;
        }

        let fetchRequest = event.request.clone();
        const response = await fetch(fetchRequest);

        if (response.headers.get("Content-Length") === null || response.headers.get("Content-Length") === 0) {
            console.log("Response not have Content-Lenght");
            console.log(response);
            return response;
        }


        const responseToCache = response.clone();

        const cache = await caches.open(CACHE_NAME);
        cache.put(event.request, responseToCache);
        console.log(`ONLINE Страница загружена и сохранена в кэше!: ${requestUrl}`);
        return response;
    }
}

self.addEventListener("fetch", function (event) {
    if (event.request.method === "GET") {
        //event.respondWith(processPromise(event));
    }
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

self.addEventListener("message", async function (event) {
    // console.log("Recieve in SW");
    // console.log(event.data[0]);
    // const clients = await self.clients.matchAll();
    // clients.forEach(client => {
    //     console.log("Send from SW");
    //     console.log(client.id);
    //     console.log(client.type);
    //     console.log(client.url);
    //     client.postMessage("SAM TY GOVNO");
    // });
});


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
        return url;
    }
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



