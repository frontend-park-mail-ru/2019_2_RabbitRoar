import Bus from "../event_bus.js";
import { QUESTION_CHANGE, TIMER_STOPPED, TIMER_INTERRUPTION } from "../modules/events.js";

class QuestionsM {
    constructor() {
    }

    CreateNew(mode = "offline", packId = 0) {
        if (mode === "offline") {
            this.current = new OfflineQuestionsM(packId);
        } else {
            this.current = new OnlineQuestionsM(packId);
        }
    }

    clickQuestion(packId, themeId, cellId) {
        this.current.clickQuestion(packId, themeId, cellId);
    }

    getInfo() {
        return this.current.getInfo();
    }

    sendAnswer(answer) {
        return this.current.sendAnswer(answer);
    }

    get chosedQuestionsId() {
        return this.current.chosedQuestionsId;
    }

    annihilate() {
        console.log("game restart");
        if (this.current.mode === "offline") {
            this.current = new OfflineQuestionsM();
        } else {
            this.current = new OnlineQuestionsM();
        }
    }
    setDefaultMode() {
        this.current.setDefaultMode();
    }

    removePointsForQuestion() {
        this.current.removePointsForQuestion();
    }
}

// =============================================

class OfflineQuestionsM {
    constructor(packId = 0) {
        console.log("GAME CREATED");
        this.packId = packId;
        this.mode = "offline";
        this.questionTable = {};
        this.questionTable.mode = "default";
        this.questionTable.selectedQuestion = undefined;
        this.chosedQuestionsId = {};
        this.score = 0;
        this.themes = this._getThemes(this.packId);
    }


    clickQuestion(packId, cellId) {
        if (!!this.chosedQuestionsId[cellId]) {
            console.log("Вы уже выбирали вопрос");
            return;
        }

        const key = "" + packId + cellId;
        const question = JSON.parse(localStorage.getItem(key));
        if (!question) {
            console.log("No question in cache");
            return;
        }

        this.currentQuestionScore = Number(document.getElementById(cellId).innerHTML);
        this.questionTable.mode = "selected";
        this.questionTable.selectedQuestion = question;
        this.chosedQuestionsId[cellId] = true;

        Bus.emit(QUESTION_CHANGE);
    }

    removePointsForQuestion() {
        alert("вычли баллесы");
        this.score -= this.currentQuestionScore;
        document.getElementById("score").innerHTML = this.score;
    }

    sendAnswer(answer) {
        if (this.questionTable.mode !== "selected") {
            return console.log("Select question");
        }
        const trueAnswer = this.questionTable.selectedQuestion.answer;
        if (trueAnswer === answer) {
            alert("правильный ответ");
            this.score += this.currentQuestionScore;
        } else {
            alert("неправильный ответ");
            this.removePointsForQuestion();
        }
        this.questionTable.selectedQuestion = undefined;
        Bus.emit(TIMER_INTERRUPTION);
        this.questionTable.mode = "default";
        Bus.emit(QUESTION_CHANGE);
        document.getElementById("score").innerHTML = this.score;
    }

    getInfo() {
        return {
            packId: this.packId,
            mode: this.questionTable.mode,
            question: this.questionTable.selectedQuestion,
            themes: this.themes,
        };
    }

    setDefaultMode() {
        this.questionTable.mode = "default";
    }


    _getThemes(packId) {
        const jsonObj = localStorage.getItem(packId);
        if (jsonObj) {
            return JSON.parse(jsonObj).themes;
        }
        return undefined;
    }

}

export default new QuestionsM();