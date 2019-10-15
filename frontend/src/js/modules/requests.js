import { postRequest } from './ajax.js'

export async function signIn(login, password) {
    const body = JSON.stringify({
        username: login,
        password: password
    });

    let response = await postRequest('/login', body);

    if (response.status != 200) {
        throw new Error(`Signin error: ${response.statusText}`);
    }
    return Promise.resolve(true);
}


export async function logout() {
    let response = await deleteRequest('/logout');

    if (response.status != 200) {
        throw new Error(`Exit error: ${response.statusText}`);
    }
    return Promise.resolve(true);
}

export async function signUp(userStructure) {
    let response = await postRequest('/signup', JSON.stringify(userStructure));

    if (response.status == 201) {

    } else {
        throw new Error(`Signup error: ${response.statusText}`);
    }
}