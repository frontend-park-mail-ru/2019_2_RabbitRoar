// Функции должны обязательно возвращать промис

const base = 'http://frontend.photocouple.space:3000';

export function postRequest(
    url = '/',
    body = {},
    headers = {
        'Content-type' : 'application/json; charset=utf-8',
    }) {
        url = base + url;
        return fetch(url, {
			method: 'POST',
            headers: headers,
			credentials: 'include',
			body: body,
		});
}

export function deleteRequest(url = '/') {
        url = base + url;
        return fetch(url, {
			method: 'DELETE',
			credentials: 'include',
			body: body,
		});
}