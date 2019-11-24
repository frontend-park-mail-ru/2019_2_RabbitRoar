import { postRequest, deleteRequest, getRequest, putRequest, RetardsPostRequest } from "./ajax.js";
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
            regExp: new RegExp("^(/api/uploads/avatar/).+(\.jpeg|\.png)$"),
        });
    }
}

export async function getAllPacksForOnline() {
    let response = await getRequest("/pack");
    if (response.status !== 200) {
        throw new Error(`Cannot get packs for online ${packId}: ${response.statusText}`);
    }
    const packs = await response.json();
    return packs;
}

export async function deletePackById(csrf, id) {
    const headers = {
        "X-Csrf-Token": csrf,
    }

    let response = await deleteRequest("/pack/" + id, {}, headers);

    if (response.status !== 200) {
        throw new Error(`Error in pack delete: ${response.statusText}`);
    }
}

export async function getUserPacks() {
    let response = await getRequest("/pack/author");
    if (response.status === 401) {
        return {};
    }
    if (!response.ok) {
        throw new Error(`Cannot get pack list ${packId}: ${response.statusText}`);
    }
    const packs = await response.json();
    return packs;
}

export async function savePack(packObj, csrf) {
    const headers = {
        "Content-type": "application/json",
        "X-Csrf-Token": csrf,
    }

    let response = await postRequest("/pack", JSON.stringify(packObj), headers);
    if (response.status !== 201) {
        throw new Error(`Pack creation error: ${response.statusText}`);
    }
}

export async function updatePack(packObj, packId, csrf) {
    const headers = {
        "Content-type": "application/json",
        "X-Csrf-Token": csrf,
    }

    const url = "/pack/" + packId;

    const body = JSON.stringify(packObj);

    let response = await putRequest(url, body, headers);

    if (response.status !== 200) {
        throw new Error(`Error in pack update request: ${response.statusText}`);
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

    if (response.status === 400) {
        throw new Error(`Error while uploadind avatar: ${response.statusText}`);
    }
}

export async function changeTextFields(changesMap, csrf) {
    userCacheDelete();

    const headers = {
        "Content-type": "application/json",
        "X-Csrf-Token": csrf,
    }
    let response = await putRequest("/user/", JSON.stringify(changesMap), headers);
    if (response.status === 400) {
        throw new Error(`Error in uploadind text fields: ${response.statusText}`);
    } else if (response.status === 401) {
        localStorage.removeItem("authorized");
    }
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


export async function postCreateRoom(roomOptions, csrf) {
    const headers = {
        "Content-type": "application/json",
        "X-Csrf-Token": csrf,
    }

    let response = await postRequest("/game/", JSON.stringify(roomOptions), headers);
    if (!response.ok) {
        throw new Error(`Cannot create game: ${response.statusText}`);
    }
    const obj = await response.json();
    return obj;
}

export async function postJoinRoom(uuid, csrf) {
    const headers = {
        "Content-type": "application/json",
        "X-Csrf-Token": csrf,
    }

    let response = await postRequest("/game/" + uuid + "/join", {}, headers);

    if (response.status === 401) {
        localStorage.removeItem("authorized");
    }
    if (!response.ok) {
        throw new Error(`Cannot join room: ${response.statusText}`);
    }
    const obj = await response.json();
    return obj;
}

export async function deleteLeaveRoom(csrf) {
    const headers = {
        "Content-type": "application/json",
        "X-Csrf-Token": csrf,
    }

    let response = await deleteRequest("/game/leave", headers);

    if (response.status === 401) {
        localStorage.removeItem("authorized");
    }
    if (!response.ok) {
        const obj = await response.json();
        if (obj.message === "error leaving the game") {
            return;
        }

        throw new Error(`Cannot leave room ahahahah: ${response.statusText}`);
    }
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
    if (response.status === 401) {
        localStorage.removeItem("authorized");
        return undefined;
    }


    if (!response.ok) {
        throw new Error(`Cannot get offline pack list: ${response.statusText}`);
    }

    const packList = await response.json();
    return packList;
}

export async function getPublicPackList() {
    let response = await getRequest("/pack/offline/public");
    if (response.status === 401) {
        localStorage.removeItem("authorized");
        return undefined;
    }

    if (!response.ok) {
        throw new Error(`Cannot get public pack list: ${response.statusText}`);
    }

    const packList = await response.json();
    return packList;
}

export async function getMyPackList() {
    let response = await getRequest("/pack/offline/author");
    if (response.status === 401) {
        localStorage.removeItem("authorized");
        return undefined;
    }

    if (!response.ok) {
        throw new Error(`Cannot get my pack list: ${response.statusText}`);
    }

    const packList = await response.json();
    return packList;
}


export async function getRooms(pageNumber, limit=10) {
    let response = await getRequest("/game/");
    if (!response) {
        return undefined;
    }
    if (response.status === 401) {
        localStorage.removeItem("authorized");
        return undefined;
    }

    if (!response.ok) {
        throw new Error(`Cannot get room list: ${response.statusText}`);
    }

    const roomList = await response.json();
    return roomList;
}

export async function getTop(pageNumber, limit=10) {
    let response = await getRequest(`/user/leaderboard?page=${pageNumber}`);
    if (!response) {
        return undefined;
    }
    if(response.status === 401) {
        localStorage.removeItem("authorized");
        return undefined;
    }

    if (!response.ok) {
        throw new Error(`Cannot get top list: ${response.statusText}`);
    }

    const topList = await response.json();
    return topList;
}