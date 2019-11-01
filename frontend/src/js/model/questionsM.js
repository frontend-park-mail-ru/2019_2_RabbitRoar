import Bus from "../event_bus.js";
import { QUESTION_CHANGE, TIMER_STOPPED, TIMER_INTERRUPTION } from "../modules/events.js";

class QuestionsM {
    constructor() {
        this.current = new OfflineQuestionsM();
    }

    setMode(mode = "offline") {
        if (mode === "offline") {
            this.current = new OfflineQuestionsM();
        } else {
            this.current = new OnlineQuestionsM();
        }
    }

    setPack(packId = 0) {
        this.current.packId = packId;
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
}

// =============================================

class OfflineQuestionsM {
    constructor() {
        this.mode = "offline";
        this.packId = 0;
        this.questionTable = {};
        this.questionTable.mode = "default";
        this.questionTable.selectedQuestion = undefined;
        this.chosedQuestionsId = {};
        this.score = 0;
        Bus.on(TIMER_STOPPED, this._removePointsForQuestion.bind(this));
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

    _removePointsForQuestion() {
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
            this._removePointsForQuestion();
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
        };
    }

    setDefaultMode() {
        this.questionTable.mode = "default";
    }
}

export default new QuestionsM();