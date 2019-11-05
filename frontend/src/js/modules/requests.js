import { postRequest, deleteRequest, getRequest, putRequest } from "./ajax.js";

export async function signIn(login, password) {
    const body = JSON.stringify({
        "username": login,
        "password": password
    });

    let response = await postRequest("/login", body);

    if (!response.ok) {
        throw new Error(`Signin error: ${response.statusText}`);
    }
}

export async function logout() {
    let response = await deleteRequest("/logout");

    if (!response.ok) {
        throw new Error(`Logout error: ${response.statusText}`);
    }
}

export async function signUp(userStructure) {
    let response = await postRequest("/signup", JSON.stringify(userStructure));

    if (!response.ok) {
        throw new Error(`Signup error: ${response.statusText}`);
    }
}

export async function changeAvatar(formData, csrf) {
    const headers = {
        "Content-type": "application/json",
        "X-Csrf-Token": csrf,
    }
    let response = await putRequest("/user/avatar", formData, headers);
    if (!response.ok) {
        const obj = JSON.parse(response.json());
    }
}

export async function changeTextFields(changesMap, csrf) {
    const headers = {
        "Content-type": "application/json",
        "X-Csrf-Token": csrf,
    }
    let response = await putRequest("/user/", JSON.stringify(changesMap), headers);
    if (!response.ok) {
        throw new Error(`Content error: ${response.statusText}`);
    }
    const obj = JSON.parse(response.json());
    return obj;
}

export async function queryTabContent(id) {
    if (id === undefined) {
        throw new Error("Content error: id is undefined");
    }
    const body = JSON.stringify({
        contentType: "tabContent",
        id: id,
    });

    const response = await getRequest("/content", body);

    if (!response.ok) {
        throw new Error(`Content error: ${response.statusText}`);
    }

    const content = await response.json();
    return content;
}

export async function getUserInfo() {
    let response = await getRequest("/user/");

    if (response.status === 401) {
        localStorage.removeItem("autorized");
    }
    if (!response.ok) {
        throw new Error(`Cannot get user info: ${response.statusText}`);
    }
    const obj = await response.json();
    return obj;
}

export async function getCSRF() {
    let response = await getRequest("/csrf");
    
    if (!response.ok) {
        throw new Error(`Cannot get user info: ${response.statusText}`);
    }
    const obj = await response.json();
    return obj;
}

export async function getWS() {
    let response = await getRequest("/game/ws");
    if (!response.ok) {
        throw new Error(`Cannot install websocket connection: ${response.statusText}`);
    }
    const obj = await response.json();
    return obj;
}

export async function postCreateRoom(roomOptions) {
    let response = await postRequest("/game/create", JSON.stringify(roomOptions));
    if (!response.ok) {
        throw new Error(`Cannot create game: ${response.statusText}`);
    }
}

export async function postJoinRoom(uuid) {
    let response = await postRequest("/game/join" + uuid);
    if (!response.ok) {
        throw new Error(`Cannot join game: ${response.statusText}`);
    }
}