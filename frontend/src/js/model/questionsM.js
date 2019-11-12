import Bus from "../event_bus.js";
import { QUESTION_CHANGE, TIMER_STOPPED, TIMER_INTERRUPTION, QUESTION_WAS_CHOSEN } from "../modules/events.js";
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

    clickQuestion(packId, themeId, cellId) {
        this.current.clickQuestion(packId, themeId, cellId);
    }

    getInfo() {
        return this.current.getInfo();
    }

    sendAnswer(answer) {
        return this.current.sendAnswer(answer);
    }

}

// =============================================

class OfflineQuestionsM {
    constructor(packId = 0) {
        console.log("OfflineQuestionsM CREATED");
        this.packId = packId;
        this.result = undefined;
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
        this.score -= this.currentQuestionScore;
        document.getElementById("score").innerHTML = this.score;
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

        this.questionTable.mode = "result";
        document.getElementById("score").innerHTML = this.score;
        Bus.emit(QUESTION_CHANGE);

        setTimeout(this._showResult.bind(this), 1000)

    }


    _showResult() {
        this.questionTable.mode = "default";
        Bus.emit(QUESTION_CHANGE);
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
                answer: this.questionTable.selectedQuestion.answer,
                result: this.result,
                currentQuestionScore: this.currentQuestionScore,
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
        console.log(`NEED MATHES ${needMatches}`);
        const needEqual = 0.8;
        let matches = 0;

        for (const trueWord of trueWords) {
            let maxEqual = 0.0;
            for (const userWord of userWords) {
                if (userWord.length !== trueWord.length) {
                    continue;
                }

                let localMatches = 0;
                console.log(trueWord);
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
            console.log(maxEqual);
            if (maxEqual >= needEqual) {
                matches++;
            }
        }
        console.log(matches);
        return (matches >= needMatches);
    }
}

class OnlineQuestionsM {
    constructor(obj) {
        console.log("ONLINE GAME CREATED");
    }
}

export default new QuestionsM();