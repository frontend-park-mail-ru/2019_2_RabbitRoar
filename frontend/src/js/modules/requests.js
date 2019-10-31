import { postRequest, deleteRequest, getRequest } from "./ajax.js";

export async function signIn(login, password) {
    const body = JSON.stringify({
        username: login,
        password: password
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

export async function changeAvatar(formData) {
    let response = await putRequest("/user/avatar", formData);
    if (!response.ok) {
        const obj = JSON.parse(response.json());
    }
}

export async function changeTextFields(changesMap) {
    let response = await putRequest("/user", JSON.stringify(changesMap));
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
    if (!response.ok) {
        throw new Error(`Cannot get user info: ${response.statusText}`);
    }
    const obj = await response.json();
    return obj;
}