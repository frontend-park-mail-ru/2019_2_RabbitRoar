onmessage = function (event) {
    if (event.data === "update") {
        console.log("Worker: Message received UPDATE");
        if (event.data === "update") {
            const pack = getPacks();
            const key = pack.id;

            const packMsg = {};
            packMsg.type = "pack";
            packMsg.value = JSON.stringify(pack);
            packMsg.key = key;
            self.postMessage(packMsg);

            for (const theme in pack.questions) {
                pack.questions[theme].forEach( (question, ind) => {
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


function getPacks() {
    const pack = {};
    for (let i = 0; i < 1; ++i) {
        pack.id = i;
        pack.name = "MegaGiga pack by _^MotHerfaKKKKir^_228";
        pack.img = "";
        pack.rating = 228;
        pack.author = "_^MotHerfaKKKKir^_228";
        pack.questions = function () {
            questions = {};
            themes = ["Марки", "Дувейн Скола Жонсан", "Об Обэме", "Случай в казино", "Кто я"];
            themes.forEach( (key) => {
                questions[key] = function () {
                    concreteQuestions = new Array;
                    for (let i = 0; i < 5; ++i) {
                        const question = {
                            id: i,
                            text: `kto naxui`,
                            media: "string",
                            answer: "string",
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
            });
            return questions;
        }();
    }
    return pack;
}


