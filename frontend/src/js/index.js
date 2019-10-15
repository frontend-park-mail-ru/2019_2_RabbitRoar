import '../css/style.scss';
import {Router} from './router.js';
import {ROOT, LOGIN, SIGN_UP} from './paths';


import ValidatorF from './fasade/userValidatorF.js';
import MainMenuV from './view/mainMenuV.js';
import AutorisationV from './view/autorisationV.js';
import RegistrationV from './view/registrationV.js';


const router = new Router;

router.register(ROOT, MainMenuV);
router.register(LOGIN, AutorisationV);
router.register(SIGN_UP, RegistrationV);

router.start();

// async function promise1() {
//     console.log('promise1');
//     return true;
// }
// async function promise2() {
//     console.log('promise2');
//     throw new Error("Ошибка!");
// }
// async function promise3() {
//     console.log('promise3');
//     return true;
// }

// async function promiseFail() {
//     const resolve1 = await promise1();
//     const resolve2 = await promise2();
//     console.log('simple code after');
//     const resolve3 = await promise3();
// }

// promiseFail().then(
//     result => console.log(`HANDLE: ${result}`)
// ).catch(
//     error => console.log(`HANDLE: ${error}`)
// );