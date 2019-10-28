onmessage = function (event) {
    console.log("Worker: Message received from main script!");
    const result = {};
    if (event.data === "update") {
        result.type = "packs";
        result.packs = getPacks();
    }
    self.postMessage(result);
}



function getPacks() {
    for (const i = 0; i < 1; ++i) {
        const pack = {};
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
                    questions = new Array;
                    for (const i = 0; i < 5; ++i) {
                        const question = {
                            id: i,
                            text: `question id ${i}`,
                            media: "string",
                            answer: "string",
                            rating: i + 10,
                            author: i,
                            tags: [
                                "string"
                            ]
                        }
                        questions.push(question);
                    }
                    return questions
                }();
            }

        }
    }
}

