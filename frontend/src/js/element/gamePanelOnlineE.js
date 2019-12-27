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
                changingButton.value = "Зеленый игрок выбирает вопрос";
            } else if (state === "verdict") {
                changingButton.value = "Ожидайте вердикт ведущего";
            } else if (state === "result") {
                changingButton.value = "Проверьте решение";
            }


            changingButton.setAttribute("state", state);
            inputAnswer.style.visibility = "hidden";
        }

        if (state !== "answer_race") {
            clearInterval(this.ticker);
        }
    }


    _update = () => {
        // Для совместимости с оффлайн игрой
    }

    create(root = document.getElementById("application")) {
        this.root = root;
        this.gameIface = GameF.getInterface(this)();
        Bus.on(GAME_PANEL_UPDATE, this._update);


        if (this.gameIface.getRole() === "master") {
            Bus.on(GAME_PANEL_STATE_CHANGE, () => { });
            return;
        }

        Bus.on(GAME_PANEL_STATE_CHANGE, this._changeState);

        this.root.insertAdjacentHTML("beforeend", Template());
        document.getElementById("input-answer").style.width = "100%";
        this.controller.startAllListeners();
    }


    destroy() {
        Bus.off(GAME_PANEL_UPDATE, this._update);
        Bus.off(GAME_PANEL_STATE_CHANGE, this._changeState);
        this.controller.disableAllListeners();
        this.root.innerHTML = "";
    }
}

export default new GamePanelOnlineE();