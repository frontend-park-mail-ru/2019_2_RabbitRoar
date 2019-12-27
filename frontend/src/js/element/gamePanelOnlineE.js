import Template from "./templates/gamePanelOnline.pug";
import GamePanelOnlineC from "../controller/gamePanelOnlineC.js";
import GameF from "../fasade/gameF.js";

import Bus from "../event_bus.js";
import { GAME_PANEL_UPDATE, GAME_PANEL_STATE_CHANGE } from "../modules/events.js";


class GamePanelOnlineE {
    constructor() {
        this.root = document.getElementById("application");
        this.ticker;
        this.controller = GamePanelOnlineC;
    }

    _changeState = (state) => {
        const changingButton = document.getElementById("changing-button");
        const changingContainer = document.getElementById("changing-element");
        const inputAnswer = document.getElementById("input-answer");
        
        if (state === "answer_race") {
            this.ticker = setInterval(
                () => {
                    console.log("a");
                    changingContainer.classList.toggle("game-panel-online__control-super");
                },
                1000
            );
            changingButton.className = "game-panel-button";
            changingContainer.className = "game-panel-online__control game-panel-online__control-success";
            inputAnswer.style.visibility = "hidden";
            changingButton.value = "Захватить!";
            changingButton.setAttribute("state", "answer_race");
        } else if (state === "selected") {
            inputAnswer.style.visibility = "visible";
            inputAnswer.focus();

            changingButton.className = "game-panel-button";
            changingContainer.className = "game-panel-online__control game-panel-online__control-success";
            changingButton.value = "Отправить";
            changingButton.setAttribute("state", "selected");
        } else {
            changingButton.className = "game-panel-button-without-hover";
            changingContainer.className = "game-panel-online__control game-panel-online__control-danger";
            if (state === "default") {
                changingButton.value = "Выберите вопрос";
            }

            changingButton.setAttribute("state", state);
            inputAnswer.style.visibility = "hidden";
            inputAnswer.value = "Юзер должен выбрать вопрос";
        }

        if (state !== "answer_race") {
            clearInterval(this.ticker);
        }
    }


    _update = () => {
        // Для совместимости с оффлайн игрой
    }

    create(root = document.getElementById("application")) {
        Bus.on(GAME_PANEL_UPDATE, this._update);
        Bus.on(GAME_PANEL_STATE_CHANGE, this._changeState);

        this.root = root;
        this.gameIface = GameF.getInterface(this)();

        this.root.insertAdjacentHTML("beforeend", Template());
        this.controller.startAllListeners();
    }


    destroy() {
        Bus.on(GAME_PANEL_UPDATE, this._update);
        Bus.on(GAME_PANEL_STATE_CHANGE, this._changeState);
        this.controller.disableAllListeners();
        this.root.innerHTML = "";
    }
}

export default new GamePanelOnlineE();