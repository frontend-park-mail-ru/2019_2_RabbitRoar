onmessage = function (event) {
    if (event.data === "update") {
        console.log("Worker: Message received UPDATE");
        const result = {};
        if (event.data === "update") {
            result.type = "packs";
            result.packs = getPacks();
            self.postMessage(result);
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
            for (const key in themes) {
                questions[key] = function () {
                    concreteQuestions = {};
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
                        concreteQuestions[i] = question;
                    }
                    return concreteQuestions;
                }();
            }
            return questions;
        }();
    }
    return pack;
}

