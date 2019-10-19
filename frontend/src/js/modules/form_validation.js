export function emailIsValid(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

export function usernameIsValid(username) {
    const re = /^[a-zA-Z0-9.\-_$@*!]{3,30}$/;
    return re.test(String(username));
}

export function  passwordsAreEqual(password1, password2) {
    return password1 === password2;
}

export function passwordIsValid(password){
    const re = /^[a-zA-Z0-9]{5,}$/;
    return re.test(String(password)); 
}