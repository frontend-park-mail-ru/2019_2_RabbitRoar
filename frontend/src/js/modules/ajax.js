// Функции должны обязательно возвращать промис

const base = "http://frontend.photocouple.space:3000";

export function postRequest(
    url = "/",
    body = {},
    headers = {
        "Content-type" : "application/json; charset=utf-8",
    }) {
        url = base + url;
        return fetch(url, {
			method: "POST",
            headers: headers,
			credentials: "include",
			body: body,
		});
}

export function deleteRequest(
    url = "/",
    headers = {},
    ){
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
        "Content-type" : "application/json",
    },
    ){
        url = base + url;
        return fetch(url, {
            method: "PUT",
            headers: headers,
            credentials: "include",
            mode: "cors",
		});
}


export function getRequest(
    url = "/",
    body = {},
    headers = {
        "Content-type" : "application/json; charset=utf-8",
    }) {
        url = base + url;
        return fetch(url, {
			method: "GET",
            headers: headers,
			credentials: "include",
			body: body,
		});
}