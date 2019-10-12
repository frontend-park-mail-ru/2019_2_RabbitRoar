import '../css/style.scss';
import {Router} from './router.js';

import ValidatorF from './fasade/validatorF.js';
import MainMenuV from './view/mainMenuV.js';
import AutorisationV from './view/autorisationV.js';


const router = new Router;

router.register('/', MainMenuV);
router.register('/signin', AutorisationV);

router.start();

