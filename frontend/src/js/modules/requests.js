import {postRequest, deleteRequest, getRequest} from "./ajax.js";

export async function signIn(login, password) {
    const body = JSON.stringify({
        username: login,
        password: password
    });

    let response = await postRequest("/login", body);

    if (response.status != 200) {
        throw new Error(`Signin error: ${response.statusText}`);
    }
}

export async function logout() {
    let response = await deleteRequest("/logout");

    if (response.status != 200) {
        throw new Error(`Logout error: ${response.statusText}`);
    }
}

export async function signUp(userStructure) {
    let response = await postRequest("/signup", JSON.stringify(userStructure));

    if (response.status == 201) {

    } else {
        throw new Error(`Signup error: ${response.statusText}`);
    }
}

export async function changeAvatar(formData) {
    let response = await putRequest("/user/avatar", formData);
    if (!response.ok) {
        const obj = JSON.parse(response.json());
        alert(obj.error);
    }
}

export async function changeTextFields(changesMap) {
    let response = await putRequest("/user", JSON.stringify(changesMap));
    if (!response.ok) {
        const obj = JSON.parse(response.json());
        alert(obj.error);
    }
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

    if (response.status != 200) {
        throw new Error(`Content error: ${response.statusText}`);
    }

    const content = await response.json();
    return content;
}