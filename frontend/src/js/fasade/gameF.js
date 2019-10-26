import OfflineGameM from "../model/offlineGameM.js";

class GameF {
    constructor() {
        
    }


    choseQuestion(packId, themeId, cellId) {
        const text = "Кто ты такой блять чтоб это сделать!?";
        OfflineGameM.setQuestionMode(text);
    }

}

export default new GameF();