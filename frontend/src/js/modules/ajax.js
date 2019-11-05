// Функции должны обязательно возвращать промис

const base = "https://frontend.photocouple.space/api";

export function postRequest(
    url = "/",
    body = {},
    headers = {
        "Content-type": "application/json; charset=utf-8",
    }) {
    url = base + url;
    return fetch(url, {
        method: "POST",
        headers: headers,
        credentials: "include",
        mode: "cors",
        body: body,
    });
}

export function deleteRequest(
    url = "/",
    headers = {},
) {
    url = base + url;
    return fetch(url, {
        method: "DELETE",
        headers: headers,
        credentials: "include",
        mode: "cors",
    });
}

export function putRequest(
    url = "/",
    body = {},
    headers = {
        "Content-type": "application/json",
    },
) {
    url = base + url;
    return fetch(url, {
        method: "PUT",
        headers: headers,
        credentials: "include",
        mode: "cors",
        body: body,
    });
}


export function getRequest(
    url = "/",
    body = {},
    headers = {
        "Content-type": "application/json; charset=utf-8",
    }) {
    url = base + url;
    return fetch(url, {
        method: "GET",
        headers: headers,
        credentials: "include",
    });
}