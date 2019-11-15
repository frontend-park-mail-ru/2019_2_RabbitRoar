import { postRequest, deleteRequest, getRequest, putRequest } from "./ajax.js";
import { SERVICE_WORKER_CMD } from "../modules/events.js";
import Bus from "../event_bus.js";


const userCacheDelete = () => {
    const base = "https://svoyak.fun/api";

    if (window.navigator.onLine) {
        Bus.emit(SERVICE_WORKER_CMD, {
            command: "delete",
            url: base + "/user/"
        });

        Bus.emit(SERVICE_WORKER_CMD, {
            command: "regExp_delete",
            regExp: new RegExp("^(/api/uploads/avatar/)[0-9]+(.jpeg|.png)$"),
        });
    }
}


export async function signIn(login, password) {
    userCacheDelete();

    const body = JSON.stringify({
        "username": login,
        "password": password
    });

    let response = await postRequest("/login", body);

    if (!response.ok) {
        console.log("zaloopa");
        throw new Error(`Signin error: ${response.statusText}`);
    }
}

export async function logout() {
    userCacheDelete();

    let response = await deleteRequest("/logout");

    if (response.status === 401) {
        localStorage.removeItem("authorized");
        //throw new Error(`Logout error: ${response.statusText}`);
    }
}

export async function signUp(userStructure) {
    userCacheDelete();

    let response = await postRequest("/signup", JSON.stringify(userStructure));

    if (!response.ok) {
        throw new Error(`Signup error: ${response.statusText}`);
    }
}

export async function changeAvatar(formData, csrf) {
    userCacheDelete();

    const headers = {
        "X-Csrf-Token": csrf,
    }
    let response = await putRequest("/user/avatar", formData, headers);
    if (!response.ok) {
        const obj = JSON.parse(response.json());
    }
}

export async function changeTextFields(changesMap, csrf) {
    userCacheDelete();

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
        localStorage.removeItem("authorized");
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


export async function postCreateRoom(roomOptions) {
    let response = await postRequest("/game", JSON.stringify(roomOptions));
    if (!response.ok) {
        throw new Error(`Cannot create game: ${response.statusText}`);
    }
    const obj = await response.json();
    return obj;
}

export async function getJoinRoom(uuid) {
    let response = await getRequest("/game/" + uuid + "/join");

    if (response.status === 401) {
        localStorage.removeItem("authorized");
    }
    if (!response.ok) {
        throw new Error(`Cannot join room: ${response.statusText}`);
    }
    const obj = await response.json();
    return obj;
}

export async function getPackById(packId) {
    let response = await getRequest("/pack/" + packId);
    if (!response.ok) {
        throw new Error(`Cannot get pack with id ${packId}: ${response.statusText}`);
    }

    const pack = await response.json();
    return pack;
}

export async function getPlayedPackList() {
    let response = await getRequest("/pack/offline");
    if (!response.ok) {
        throw new Error(`Cannot get offline pack list: ${response.statusText}`);
    }

    const packList = await response.json();
    return packList;
}

export async function getPublicPackList() {
    let response = await getRequest("/pack/offline/public");
    if (!response.ok) {
        throw new Error(`Cannot get public pack list: ${response.statusText}`);
    }

    const packList = await response.json();
    return packList;
}