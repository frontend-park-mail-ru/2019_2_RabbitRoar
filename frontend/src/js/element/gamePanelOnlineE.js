import Template from "./templates/gamePanelOnline.pug";
import GamePanelOnlineC from "../controller/gamePanelOnlineC.js";
import GameF from "../fasade/gameF.js";

import Bus from "../event_bus.js";
import { GAME_PANEL_UPDATE, GAME_PANEL_STATE_CHANGE } from "../modules/events.js";


class GamePanelOnlineE {
    constructor() {
        this.root = document.getElementById("application");
        this.controller = GamePanelOnlineC;

        Bus.on(GAME_PANEL_UPDATE, this._update);
        Bus.on(GAME_PANEL_STATE_CHANGE, this._changeState);
    }

    _changeState = (state) => {
        const changingButton = document.getElementById("changing-button");
        const inputAnswer = document.getElementById("input-answer");

        if (state === "answer_race") {
            changingButton.className = "game-panel-button";
            changingButton.innerHTML = "Захватить!";
            changingButton.setAttribute("state", "answer_race");
        } else if (state === "selected") {
            inputAnswer.style.visibility = "visible";
            inputAnswer.focus();

            changingButton.className = "game-panel-button";
            changingButton.innerHTML = "Отправить";
            changingButton.setAttribute("state", "selected");
        } else {
            changingButton.className = "game-panel-button-without-hover";
            if (state === "default") {
                changingButton.innerHTML = "Выберите вопрос";
            }
            changingButton.setAttribute("state", state);

            inputAnswer.style.visibility = "hidden";
            inputAnswer.value = "";
        }
    }


    _update = () => {
        // Для совместимости с оффлайн игрой
    }

    create(root = document.getElementById("application")) {
        this.root = root;
        this.gameIface = GameF.getInterface(this)();

        this.root.insertAdjacentHTML("beforeend", Template());
        this.controller.startAllListeners();
    }


    destroy() {
        this.controller.disableAllListeners();
        this.root.innerHTML = "";
    }
}

export default new GamePanelOnlineE();