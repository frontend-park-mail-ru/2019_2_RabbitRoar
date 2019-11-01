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
        this.score -= this.currentQuestionScore;
        document.getElementById("score").innerHTML = this.score;
    }

    sendAnswer(answer) {
        if (this.questionTable.mode !== "selected") {
            return console.log("Select question");
        }
        const trueAnswer = this.questionTable.selectedQuestion.answer.toLowerCase();
        const userAnswer = answer.toLowerCase();
        if (this._checkAnswer(answer)) {
            this.score += this.currentQuestionScore;
        } else {
            this.removePointsForQuestion();
        }
        this.questionTable.selectedQuestion = undefined;
        this.questionTable.mode = "default";
        document.getElementById("score").innerHTML = this.score;
        Bus.emit(QUESTION_CHANGE);
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
                trueWordObj.forEach( (val, ind) => {
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

export default new QuestionsM();