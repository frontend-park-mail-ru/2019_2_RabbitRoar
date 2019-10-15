import '../css/style.scss';
import {Router} from './router.js';
import {ROOT, SIGN_IN, SIGN_UP} from './paths';


import ValidatorF from './fasade/validatorF.js';
import MainMenuV from './view/mainMenuV.js';
import AutorisationV from './view/autorisationV.js';
import RegistrationV from './view/registrationV.js';


const router = new Router;

router.register(ROOT, MainMenuV);
router.register(SIGN_IN, AutorisationV);
router.register(SIGN_UP, RegistrationV);

router.start();

