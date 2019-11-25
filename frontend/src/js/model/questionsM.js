import Bus from "../event_bus.js";
import { QUESTION_CHANGE, OFFLINE_GAME_END, PLAYERS_CHANGE } from "../modules/events.js";
import WebSocketIface from "../modules/webSocketIface.js"
import { ONLINE_GAME } from "../paths";

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

        this.numberOfSelectedQuestions = 0;
    }


    clickQuestion(packId, cellId, themeId) {
        if (!!this.chosedQuestionsId[cellId]) {
            console.log("Вы уже выбирали вопрос");
            return;
        }

        const key = "" + packId + "-" + cellId;
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

        setTimeout(this._showResult.bind(this), 4000)
    }


    _showResult() {
        this.questionTable.mode = "default";
        this.numberOfSelectedQuestions++;
        console.log(this.numberOfSelectedQuestions);
        if (this.numberOfSelectedQuestions === 25) {
            console.log(this.numberOfSelectedQuestions);
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
    constructor() {
        this.players;

        this.userId;
        this.userIdWhoChoseAnswer;

        this.themeIndex;
        this.questionIndex;

        this.disabledQuestionId;

        //this.packId = packId;
        this.result = undefined;
        this.mode = "offline";
        this.questionTable = {};
        this.questionTable.mode = "default";
        this.questionTable.selectedQuestion = {};
        this.chosedQuestionsId = {};
        this.score = 0;
        this.themes;

        this.numberOfSelectedQuestions = 0;


        WebSocketIface.addMessageHandler("request_question_from_player", this._activateUser);
        WebSocketIface.addMessageHandler("request_respondent", this._userChoseQuestion);
        WebSocketIface.addMessageHandler("answer_given_back", this._recieveAnswer);
    }

    _userChoseQuestion = (data) => {
        this.themeIndex = data.payload.theme_id;
        this.questionIndex = data.payload.question_id;

        console.log("this.themeIndex: ", this.themeIndex);
        console.log("this.questionIndex", this.questionIndex);

        const currentTheme = this.themes[this.themeIndex];
        const disabledQuestionId = currentTheme + "-" + this.questionIndex;

        console.log("htmlQuestionId: ", disabledQuestionId);

        // Bus.emit(QUESTION_CHANGE, "disable_question");
        //WebSocketIface.addMessageHandler("request_question_from_player", this._activateUser);


        const question = data.payload.question;

        this.currentQuestionScore = (this.questionIndex + 1) * 100;
        this.questionTable.mode = "selected";
        this.questionTable.selectedQuestion.text = question;
        //this.questionTable.selectedQuestion.answer = question;

        this.chosedQuestionsId[disabledQuestionId] = true;

        Bus.emit(QUESTION_CHANGE);
    }

    clickQuestion = (packId, cellId, themeId) => {
        console.log("Айди юзера: ", this.userId);
        console.log("Юзер, который выбирает вопрос: ", this.userIdWhoChoseAnswer);

        const questionIndex = parseInt(cellId.slice(-1));
        console.log("question index: ", questionIndex);

        const themeIndex = this.themes.indexOf(themeId);

        console.log("theme index: ", themeIndex);
        console.log(this.themes);
        if (this.userId === this.userIdWhoChoseAnswer) {
            console.log("Юзер может выбирать вопрос");
            const body = JSON.stringify({
                "type": "question_chosen",
                "payload": {
                    "theme_idx": themeIndex,
                    "question_idx": questionIndex,
                }
            });
            WebSocketIface.sentMessage(body);
        } else {
            console.log("НОУ юзер не может выбирать вопрос");
        }

        ////////////////////////
    }


    sendAnswer = (answer) => {
        if (this.questionTable.mode !== "selected") {
            return console.log("Select question");
        }

        console.log(`My answer: ${answer}`);
        const race = JSON.stringify({
            "type": "respondent_ready"
        });
        WebSocketIface.sentMessage(race);

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
        this.answerOwner = data.payload.player_id;
        this.result = true;
        this.questionTable.mode = "result";
        Bus.emit(QUESTION_CHANGE);

        setTimeout(this._showResult.bind(this), 2000)
    }


    _showResult() {
        this.questionTable.mode = "default";
        Bus.emit(QUESTION_CHANGE);
    }



    _activateUser = (data) => {
        console.log("My id in OnlineQuestionsM: ", this.userId);
        this.userIdWhoChoseAnswer = data.payload.player_id;
        console.log("User chose question :", this.userIdWhoChoseAnswer);

        Bus.emit(PLAYERS_CHANGE);
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
                result: this.result,
                currentQuestionScore: this.currentQuestionScore,
                answerOwner: this.answerOwner
            };
        }
    }

}

export default new QuestionsM();