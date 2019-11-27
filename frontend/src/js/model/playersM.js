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

    getAnsweredPlayerInfo() {
        return {
            currentQuestionScore: this.current.currentQuestionScore,
            answerOwner: this.current.answerOwner,
            result: this.current.result,
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

        WebSocketIface.addMessageHandler("request_question_from_player", this._activateUser);
        WebSocketIface.addMessageHandler("answer_given_back", this._recieveAnswer);
        WebSocketIface.addMessageHandler("request_respondent", this._userChoseQuestion);
    }

    addFields = (...fields) => {
        for (const field of fields) {
            this[field.name] = field.value;
        }
    }

    _userChoseQuestion = (data) => {
        this.currentQuestionScore = (data.payload.question_id + 1) * 100;
    }

    _recieveAnswer = (data) => {
        this.result = true;

        for (const player of this.players) {
            if (player.id === data.payload.player_id) {
                this.answerOwner = player.username;
                if (this.result === true) {
                    player.score += this.currentQuestionScore;
                } else {
                    player.score -= this.currentQuestionScore;
                }
                break;
            }
        }
    }

    _activateUser = (data) => {
        console.log("My id in OnlineQuestionsM: ", this.userId);
        this.userIdWhoChoseAnswer = data.payload.player_id;
        console.log("User chose question :", this.userIdWhoChoseAnswer);

        Bus.emit(PLAYERS_CHANGE);
    }
}


export default new PlayersM;