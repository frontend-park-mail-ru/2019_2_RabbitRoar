import WebSocketIface from "../modules/webSocketIface.js"
import Bus from "../event_bus.js";
import { PLAYERS_CHANGE } from "../modules/events.js";




class PlayersM {
    constructor() {
        this.current = undefined;
    }

    CreateNew() {
        this.current = new RealPlayersM();
    }

    clear() {
        this.current = undefined;
    }

    race() {
        console.log("Race send");
        const race = JSON.stringify({
            "type": "respondent_ready"
        });
        WebSocketIface.sentMessage(race);
    }

    getAnsweredPlayerInfo() {
        return {
            currentQuestionScore: this.current.currentQuestionScore,
            answerOwner: this.current.answeringPlayer.username,
            result: this.current.result,
        }
    }

    getVerdictInfo() {
        let role;
        if (this.current.userId === this.current.host.id) {
            role = "master"
        } else {
            role = "simple"
        }
        return {
            respondent: {
                name: this.current.answeringPlayer.username,
                avatar: this.current.answeringPlayer.avatar,
                score: this.current.answeringPlayer.score,
                trueAnswer: this.current.trueAnswer,
            },
            role: role
        }
    }

    haveAbilityChoose() {
        console.log("Айди юзера: ", this.userId);
        console.log("Юзер, который выбирает вопрос: ", this.userIdWhoChoseAnswer);
        return (this.current.userId === this.current.userIdWhoChoseAnswer);
    }
}


class RealPlayersM {
    constructor() {
        this.players = {};
        this.trueAnswer = "";

        WebSocketIface.addMessageHandler("request_question_from_player", this._activateUser);       // id того, кто выбирает вопрос
        WebSocketIface.addMessageHandler("request_respondent", this._userChoseQuestion);            // Пользователь выбрал вопрос -> установить стоимость
        WebSocketIface.addMessageHandler("request_answer_from_respondent", this._processAnswering); // Присылает игрока который в итоге отвечает на вопрос
        WebSocketIface.addMessageHandler("request_verdict_from_host", this._saveTrueAnswer);        // Реальный ответ для хоста
        WebSocketIface.addMessageHandler("verdict_given_back", this._verdictDone);                  // Ведущий прислал вердикт


    }

    addFields = (...fields) => {
        for (const field of fields) {
            this[field.name] = field.value;
        }
    }

    _verdictDone = (data) => {
        let result;
        if (data.payload === true) {
            result = 1;
        } else {
            this.result = -1;
        }

        for (const player of this.players) {
            if (player.id === answeringPlayer.id) {
                player.score += this.currentQuestionScore * result;
                break;
            }
        }
    }

    _saveTrueAnswer = (data) => {
        this.trueAnswer = data.payload.answer;
    }

    _processAnswering = (data) => {
        for (const player of this.players) {
            if (player.id === data.payload.player_id) {
                this.answeringPlayer = player;
            }
        }
        Bus.emit(PLAYERS_CHANGE, this.answeringPlayer.id);
    }


    _userChoseQuestion = (data) => {
        this.currentQuestionScore = (data.payload.question_id + 1) * 100;
    }


    _activateUser = (data) => {
        console.log("My id in OnlineQuestionsM: ", this.userId);
        this.userIdWhoChoseAnswer = data.payload.player_id;
        console.log("User chose question :", this.userIdWhoChoseAnswer);

        Bus.emit(PLAYERS_CHANGE, this.userIdWhoChoseAnswer);
    }
}


export default new PlayersM;