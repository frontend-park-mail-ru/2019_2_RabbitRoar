import Bus from "../event_bus.js";
import { QUESTION_CHANGE, OFFLINE_GAME_END, PLAYERS_CHANGE } from "../modules/events.js";
import WebSocketIface from "../modules/webSocketIface.js"

class QuestionsM {
    constructor() {
    }

    CreateNew(mode = "offline", clickId) {
        if (mode === "offline") {
            this.current = new OfflineQuestionsM(clickId);
        } else {
            this.current = new OnlineQuestionsM(clickId);
        }
    }

    clickQuestion(packId, cellId, themeId) {
        this.current.clickQuestion(packId, cellId, themeId);
    }

    getInfo() {
        return this.current.getInfo();
    }

    sendAnswer(answer) {
        return this.current.sendAnswer(answer);
    }

    clear() {
        this.current = undefined;
    }

}


class OfflineQuestionsM {
    constructor(packId = 0) {
        this.packId = packId;
        this.result = undefined;
        this.mode = "offline";
        this.questionTable = {};
        this.questionTable.mode = "default";
        this.questionTable.selectedQuestion = undefined;
        this.chosedQuestionsId = {};
        this.score = 0;
        this.themes = this._getThemes(this.packId);

        this.numberOfSelectedQuestions = 0;
    }


    clickQuestion(packId, cellId, themeId) {
        if (!!this.chosedQuestionsId[cellId]) {
            return;
        }

        const key = "" + packId + "-" + cellId;
        const question = JSON.parse(localStorage.getItem(key));
        if (!question) {
            return;
        }

        this.currentQuestionScore = Number(document.getElementById(cellId).innerHTML);
        this.questionTable.mode = "selected";
        //this.questionTable.mode = "verdict";
        this.questionTable.selectedQuestion = question;
        this.chosedQuestionsId[cellId] = true;

        Bus.emit(QUESTION_CHANGE);
    }

    removePointsForQuestion() {
        this.score -= this.currentQuestionScore;
    }

    sendAnswer(answer) {
        if (this.questionTable.mode !== "selected") {
            return console.log("Select question");
        }

        if (this._checkAnswer(answer)) {
            this.score += this.currentQuestionScore;
            this.result = true;
        } else {
            this.result = false;
            this.removePointsForQuestion();
        }
        this.userAnswer = answer;


        this.questionTable.mode = "result";
        Bus.emit(QUESTION_CHANGE);

        setTimeout(this._showResult.bind(this), 4000)
    }


    _showResult() {
        this.questionTable.mode = "default";
        this.numberOfSelectedQuestions++;
        if (this.numberOfSelectedQuestions === 25) {
            Bus.emit(OFFLINE_GAME_END);
        } else {
            Bus.emit(QUESTION_CHANGE);
        }
    }


    getInfo() {
        if (this.questionTable.mode === "default") {
            return {
                packId: this.packId,
                mode: this.questionTable.mode,
                themes: this.themes,
                chosedCells: this.chosedQuestionsId,
            };
        } else if (this.questionTable.mode === "selected") {
            return {
                mode: this.questionTable.mode,
                questionText: this.questionTable.selectedQuestion.text,
            };
        } else if (this.questionTable.mode === "result") {
            return {
                mode: this.questionTable.mode,
                correctAnswer: this.questionTable.selectedQuestion.answer,
                answer: this.userAnswer,
                result: this.result,
                currentQuestionScore: this.currentQuestionScore,
            };
        } else if (this.questionTable.mode === "verdict") {
            return {
                mode: this.questionTable.mode,
                questionText: this.questionTable.selectedQuestion.text,
            };
        }
    }


    _getThemes(packId) {
        const jsonObj = localStorage.getItem(packId);
        if (jsonObj) {
            return JSON.parse(jsonObj).themes;
        }
        return undefined;
    }


    _checkAnswer(answer) {
        const trueAnswer = this.questionTable.selectedQuestion.answer.toLowerCase();
        const userAnswer = answer.toLowerCase();

        const trueWords = trueAnswer.split(" ");
        const userWords = userAnswer.split(" ");

        if (userWords.length === 0 || trueWords.length === 0) {
            return false;
        }

        if ((userWords.length / trueWords.length < 0.5)) {
            return false;
        }

        const needMatches = Math.floor((trueWords.length / 2) + 1);
        const needEqual = 0.8;
        let matches = 0;

        for (const trueWord of trueWords) {
            let maxEqual = 0.0;
            for (const userWord of userWords) {
                if (userWord.length !== trueWord.length) {
                    continue;
                }

                let localMatches = 0;
                const trueWordObj = trueWord.split("");
                trueWordObj.forEach((val, ind) => {
                    if (val === userWord[ind]) {
                        localMatches++;
                    }
                });
                const localEqual = localMatches / trueWord.length;
                if (localEqual > maxEqual) {
                    maxEqual = localEqual;
                }
            }
            if (maxEqual >= needEqual) {
                matches++;
            }
        }
        return (matches >= needMatches);
    }
}

class OnlineQuestionsM {
    constructor() {
        this.userId;
        this.userIdWhoChoseAnswer;

        this.themeIndex;

        this.disabledQuestionId;

        this.mode = "offline";
        this.questionTable = {};
        this.questionTable.mode = "default";
        this.questionTable.selectedQuestion = {
            answer: null
        };
        this.chosedQuestionsId = {};
        this.score = 0;
        this.themes;

        this.numberOfSelectedQuestions = 0;

        WebSocketIface.addMessageHandler("request_respondent", this._userChoseQuestion);
        WebSocketIface.addMessageHandler("answer_given_back", this._recieveAnswer);
        WebSocketIface.addMessageHandler("request_answer_from_respondent", this._verdictOrSelected);
        WebSocketIface.addMessageHandler("verdict_given_back", this._verdictDone);
        WebSocketIface.addMessageHandler("request_question_from_player", this._defaultMode);       // id того, кто выбирает вопрос
    }

    _defaultMode = (data) => {
        this.questionTable.mode = "default";

        const field = data.payload.questions;

        for (let i = 0; i < field.length; i++) {
            for (let j = 0; j < field[i].length; j++) {
                if (!field[i][j]) {
                    const themeName = this.themes[i];
                    const key = themeName + "-" + j;
                    this.chosedQuestionsId[key] = true;
                }
            }
        }
    }

    addFields = (...fields) => {
        for (const field of fields) {
            this[field.name] = field.value;
        }
    }

    _verdictOrSelected = (data) => {
        if (this.userId === data.payload.player_id) {
            this.questionTable.mode = "selected";
        } else {
            this.questionTable.mode = "verdict";
        }
    }


    _verdictDone = (data) => {
        this.questionTable.mode = "result";

        setTimeout( () => {
            console.log("cleared");
            this.questionTable.selectedQuestion.answer = null;
        }, 50);
    }



    _userChoseQuestion = (data) => {
        this.themeIndex = data.payload.theme_id;
        const questionIndex = data.payload.question_id;


        const currentTheme = this.themes[this.themeIndex];
        const disabledQuestionId = currentTheme + "-" + questionIndex;


        const question = data.payload.question;

        this.questionTable.mode = "answer_race";
        this.questionTable.selectedQuestion.text = question;
    }

    clickQuestion = (packId, cellId, themeId) => {
        const questionIndex = parseInt(cellId.slice(-1));

        const themeIndex = this.themes.indexOf(themeId);
        const body = JSON.stringify({
            "type": "question_chosen",
            "payload": {
                "theme_idx": themeIndex,
                "question_idx": questionIndex,
            }
        });
        WebSocketIface.sentMessage(body);
    }


    sendAnswer = (answer) => {
        if (this.questionTable.mode !== "selected") {
        }

        const body = JSON.stringify({
            "type": "respondent_answer_given",
            "payload": {
                "answer": answer
            }
        });
        WebSocketIface.sentMessage(body);
    }

    
    _recieveAnswer = (data) => {
        this.questionTable.selectedQuestion.answer = data.payload.player_answer;
        this.questionTable.mode = "verdict";
    }



    getInfo = () => {
        if (this.questionTable.mode === "default") {
            return {
                packId: this.packId,
                mode: this.questionTable.mode,
                themes: this.themes,
                chosedCells: this.chosedQuestionsId,
            };
        } else if (this.questionTable.mode === "selected") {
            return {
                mode: this.questionTable.mode,
                questionText: this.questionTable.selectedQuestion.text,
            };
        } else if (this.questionTable.mode === "result") {
            return {
                mode: this.questionTable.mode,
                answer: this.questionTable.selectedQuestion.answer,
            };
        } else if (this.questionTable.mode === "verdict") {
            return {
                mode: this.questionTable.mode,
                answer: this.questionTable.selectedQuestion.answer,
            };
        } else if (this.questionTable.mode === "answer_race") {
            return {
                mode: this.questionTable.mode,
                questionText: this.questionTable.selectedQuestion.text,
            };
        }
    }

}

export default new QuestionsM();