import NavbarE from "../element/navbarE.js";
import QuestionTableE from "../element/questionTableE.js";
import GamePanelE from "../element/gamePanelE.js";



class SingleGameV {
    constructor(root = document.getElementById("application")) {
        if (!!SingleGameV.instance) {
            this.root = root;
            return SingleGameV.instance;;
        }
        this.root = root;

        this.navbarDiv = document.createElement("div");
        this.navbarDiv.id = "navbar_container";

        this.questionsDiv = document.createElement("div");
        this.questionsDiv.id = "questions_container";

        this.gamePanelDiv = document.createElement("div");
        this.gamePanelDiv.id = "game_panel_container";

        SingleGameV.instance = this;
        return this;
    }

    create(data = "") {
        this.root.append(this.navbarDiv);
        this.root.append(this.questionsDiv);
        this.root.append(this.gamePanelDiv);

        NavbarE.create(this.navbarDiv);
        QuestionTableE.create(this.questionsDiv);
        GamePanelE.create(this.gamePanelDiv);
    }

    destroy(){
        NavbarE.destroy();
        QuestionTableE.destroy();
        GamePanelE.destroy();
    }

}
export default new SingleGameV();