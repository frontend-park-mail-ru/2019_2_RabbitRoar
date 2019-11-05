onmessage = function (event) {
    if (event.data === "update") {
        console.log("Worker: Message received UPDATE");
        if (event.data === "update") {
            const packs = getPacks();
            for (const pack of packs) {
                const key = pack.id;

                const packInfo = {
                    id: pack.id,
                    name: pack.name,
                    img: pack.img,
                    rating: pack.rating,
                    author: pack.author,
                    themes: (() => {
                        const themes = new Array;
                        for (const theme in pack.questions) {
                            themes.push(theme);
                        }
                        return themes;
                    })()
                }

                const packMsg = {};
                packMsg.type = "pack";
                packMsg.value = JSON.stringify(packInfo);
                packMsg.key = key;
                self.postMessage(packMsg);

                for (const theme in pack.questions) {
                    pack.questions[theme].forEach((question, ind) => {
                        const key = "" + pack.id + theme + ind;

                        const questMsg = {};
                        questMsg.type = "question";
                        questMsg.value = JSON.stringify(question);
                        questMsg.key = key;
                        self.postMessage(questMsg);
                    });
                }
            }
        }
    }
}


function getPacks() {
    const globalThemes = [
        ["Марки", "Дувейн Скола Жонсан", "Об Обэме", "Случай в казино", "Кто я"],
        ["Шкварки", "Анита пуська", "Жъъужуъ", "Экзистенциальный кризис", "Зачем оно мне все надо?"]
    ]
    const globalQuestions = [
        [
            [], 
            [], 
            [], 
            [], 
            []
        ],
        [
            [], 
            [], 
            [], 
            [], 
            []
        ],
    ]
    const packs = new Array;
    const aut = ["MegaGiga patau pack", "EgosKekos"];
    const q = ["Кто ты такой блять чтоб это сделать?", "Где колоды заряжаете?"];
    const a = ["диллер", "в киоске заряжаем"];
    for (let j = 0; j < 2; ++j) {
        const pack = {};
        pack.id = j;
        pack.name = aut[j];
        pack.img = "";
        pack.rating = 228;
        pack.author = aut[j];
        pack.questions = function () {
            questions = {};
            themes = globalThemes[j];
            let themeNum = 0;
            themes.forEach((key) => {
                questions[key] = function () {
                    concreteQuestions = new Array;
                    for (let i = 0; i < 5; ++i) {
                        const question = {
                            id: i,
                            text: q[j],
                            media: "string",
                            answer: a[j],
                            rating: i + 10,
                            author: i,
                            tags: [
                                "string"
                            ]
                        }
                        concreteQuestions.push(question);
                    }
                    return concreteQuestions;
                }();
                themeNum++;
            });
            return questions;
        }();
        packs.push(pack);
    }
    return packs;
}


