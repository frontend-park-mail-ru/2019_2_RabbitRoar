import Template from "./templates/usersPanelT.pug";
import ValidatorF from "../fasade/userValidatorF.js";
import UsersPanelC from "../controller/usersPanelC.js";
import GameF from "../fasade/gameF.js";
import Bus from "../event_bus.js";

import { USER_PANEL_NEW_USER, USER_PANEL_USER_READY } from "../modules/events.js";
import { replaceTwoCssClasses } from "../modules/css_operations";

import StaticManager from "../modules/staticManager.js"

const MOKiface = {
    getPlayers() {
        const capacity = 4;
        const players = new Array;

        for (let i = 0; i < capacity; i++) {
            players.push({
                id: i,
                username: "Empty" + i,
                avatar: StaticManager.getUserUrl(),
                score: 0,
                ready: false
            });
        }
        return players;
    },

    getRoomInfo() {
        return {};
    },
}

class UsersPanelE {
    constructor() {
        this.controller = UsersPanelC;
        Bus.on(USER_PANEL_NEW_USER, this._updatePlayers);
        Bus.on(USER_PANEL_USER_READY, this._readyChange);
    }

    _changeUserIndicator = (userId) => {
        const userElem = document.getElementById(userId);
        const indicatorElem = userElem.children[2];
        replaceTwoCssClasses(indicatorElem, "users-panel__ready-indicator__false", "users-panel__ready-indicator__true");
    }

    _readyChange = (data) => {
        console.log(data.payload);
        const readyPlayers = data.payload;
        readyPlayers.forEach(playerData => {
            if (playerData.ready) {
                this._changeUserIndicator(playerData.id);
            }
        });

    }

    _updatePlayers = (message) => {
        const currentPlayers = document.querySelectorAll(".waiting-player");
        const host = this.gameIface.getHost();

        const currentPlayersMap = {}
        for (let i = 0; i < currentPlayers.length; i++) {
            const order = currentPlayers[i].getAttribute("order");
            currentPlayersMap[order] = currentPlayers[i];
        }


        let order = 0;
        for (const player of message.payload.players) {
            if (player.id.toString() === currentPlayersMap[order].id) {
            } else {
                this._insertCell(player, currentPlayersMap[order]);
            }

            if ((player.id === host.id) && (currentPlayersMap[order].children[0].children.length === 0)) {
                const image = document.createElement("IMG");
                image.src =  StaticManager.hostIcon;
                image.alt = "User";
                image.id = "hostIcon";
                image.classList.add("navbar__user-logo");
                currentPlayersMap[order].children[0].insertAdjacentElement("beforeend", image);
            }
            order++;
        }
    }


    _insertCell(player, container) {
        container.id = player.id;

        container.children[1].children[0].children[0].src = player.avatar;
        container.children[1].children[1].innerHTML = player.username;
        if (player.ready) {
            console.log("user ", player.username, "ready");
            this._changeUserIndicator(player.id);
        }
    }


    _reRender = () => {
        this.destroy();
        this.create(this.root);
    }

    


    create = (root = document.getElementById("application")) => {
        this.root = root;
        this.gameIface = GameF.getInterface(this)();
        //this.gameIface = MOKiface;

        const players = this.gameIface.getPlayers();
        const leaveLogo = StaticManager.leaveLogo;
        const roomName = GameF.getRoomName();
        const userName = ValidatorF.getCurrentUsername();

        this.root.insertAdjacentHTML("beforeend", Template({
            players: players,
            leaveLogo: leaveLogo,
            roomName: roomName,
            userName: userName

        }));
        this.controller.startAllListeners();
    }


    destroy = () => {
        this.controller.disableAllListeners();
        this.root.innerHTML = "";
    }
}

export default new UsersPanelE();