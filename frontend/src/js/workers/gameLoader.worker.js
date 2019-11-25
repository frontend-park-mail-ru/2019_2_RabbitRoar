import { getPackById } from "../modules/requests.js"

onmessage = async function (event) {
    if (event.data.command === "update") {
        console.log("Worker: Message received UPDATE");

        for (const packId of event.data.packList) {
            console.log(`Try load pack ${packId}`);

            let pack;
            try {
                pack = await getPackById(packId);
            } catch (err) {
                console.log(err);
                continue;
            }
            parsePack(pack);
        }

        // const myPacks = getDefaultPacks();
        // for (const pack of myPacks) {
        //     parsePack(pack);
        // }
    }
}

function parsePack(pack) {
    const fullPackMsg = {};
    fullPackMsg.type = "full";
    fullPackMsg.value = JSON.stringify(pack);
    self.postMessage(fullPackMsg);


    let key = pack.id;

    const packInfo = {
        id: pack.id,
        name: pack.name,
        rating: pack.rating,
        author: pack.author,
        themes: (() => {
            const themes = new Array;
            for (const line of pack.pack) {
                themes.push(line.name);
            }
            return themes;
        })()
    }

    const packMsg = {};
    packMsg.type = "pack";
    packMsg.value = JSON.stringify(packInfo);
    packMsg.key = key;
    self.postMessage(packMsg);

    for (const line of pack.pack) {
        let keyBase = pack.id + "-" + line.name + "-";
        let i = 0;
        for (const question of line.questions) {
            const key = keyBase + (i++);

            const questMsg = {
                type: "question",
                value: JSON.stringify(question),
                key: key
            };
            self.postMessage(questMsg);
        }
    }
}


function getDefaultPacks() {
    const globalThemes = [
        ["..ты..", "день Х", "история успеха", "статья Lurkmore", "международные меры"],
        ["Шутерки", "РПГ", "Гоночки", "Сурвайвал", "Отечественный игрострой"]
    ]

    const globalQuestions = [
        [
            [
                "символом M в римской записи записывают это число",
                "цвет, соответствующий оптическому диапазону длин волн 570—590 нм",
                "сериал про прапара Шматко",
                "старинное название башенных или больших комнатных часов с набором настроенных колоколов, издающих бой в определённой мелодической последовательности",
                "денежная валюта Польши",
            ],
            [
                "Перевод на английский фразы «Да пребудет с тобой Сила» подскажет, когда празднуют день «Звёздных войн»",
                "День программиста — праздник, отмечаемый в 256-й день года. Чаще всего праздник выпадает на 13 сентября, но иногда - именно на этот день.",
                "День холостяков — китайский современный праздник, посвящённый людям, не состоящим в браке. Получил своё название из-за того, что дата проведения символизирует не состоящих в паре людей. А ещё в этот день вышел Skyrim.",
                "День квадратного корня — неофициальный праздник, отмечаемый в день, когда и число, и порядковый номер месяца являются квадратными корнями из двух последних цифр года. Например, 2 февраля 2004 года. Когда мы отпразднуем в следующий раз?",
                "День числа пи (3,1415926...) — неофициальный праздник, который отмечается любителями математики 14 марта в 1:59:26. Некоторые также празднуют 22 июля. Почему?",
            ],
            [
                "Томас Вудро Вильсон, 28-й президент США сказал: 'На подготовку 10-минутной речи мне нужна неделя; на 15-минутную - три дня; на получасовую - два дня; а часовую речь я могу [...]'",
                "Каким мифическим существом называют частную стартап-компанию стоимостью более 1 миллиарда долларов? Термин был придуман в 2013 году для представления статистической редкости таких успешных предприятий.",
                "Самая продаваемая игровая консоль",
                "в прошлом крупнейшая частная российская авиакомпания, прекратившая свою операционную деятельность в октябре 2015 года",
                "Кодовые имена модельного ряда этой крупной американской компании можно сложить в 'S3XY'. Назовите компанию.",
            ],
            [
                "эффективная система техник и умений персонифицированного нагибания путём доставки пиздюлей кулаками в тушку и верхнюю голову оппонента",
                "злыдень, нацист, ефрейтор-полководец, носитель усов «Бродяга», поц и шлимазл, икона для фошыстов, потомок евреев и негров, талантливый оратор, выдающийся художник первой половины XX в., мамзер, пейсатель, звезда ютуба и просто тонкая натура",
                "межрасовая тоталитарная секта экологических экстремистов, состоящая из нескольких десятков обособленных контор, координирующих деятельность на ежегодных сходках директоров",
                "Про это есть порно. Никаких исключений",
                "Серия суровых 2d-комбо-файтингов с былинным сюжетом за авторством южноафриканского расово японского художника карандашами по бумаге и митолизда пальцами на гитаре Дайсуке Исиватари сотоварищи. Отличается от прочих представителей жанра повышенными концентрациями анимешности и, что самое ГЛАВНОЕ, рок-н-ролла и метала с прилагающимися отсылками к ним.",
            ],
            [
                "так называют коллективные или односторонние принудительные меры, применяемые государствами или международными организациями к государству, которое нарушило нормы международного права",
                "английская версия названия 'камень-ножницы-бумага' имеет именно такой порядок компонентов",
                "лишь 19 из 28 стран Евросоюза пользуются им официально и полноценно",
                "в грамме помещается столько карат",
                "если вы закажете пинту пива в Англии, то вам принесут стакан примерно такого объёма в литрах",
            ],
        ],
        [
            [
                "Модом к какой игре изначально была CS?",
                "Кто является компанией издателем небезызвестной Call of Duty",
                "Первая игра из серии Battlefield",
                "Эта игра соединившая в себе черты рпг и шутера, известна своим генератором оружия",
                "Стелс шутер от 3го лица, симулятор отстрела яиц фрицев",
            ],
            [
                "RPG разработанная канадской студией BioWare в 2009 г, как они сами ее называли «темное героическое фэнтези»",
                "Назови все ведьмачьи знаки из серии игр Ведьмак (их пять)",
                "Слабо назвать все номерные части The Elder Scrolls?",
                "BioWare анонсировала эту RPG на выставке Electronic Entertainment Expo 2015(E3)",
                "Первая игра позволявшая вступить в однополый брак. Считается олдфагами лучшей в серии.",
            ], [
                "Вторая часть безумной гоночной аркады где можно 'выстреливать' водителем из лобового стекла, стараясь забросить его как можно дальше. ",
                "Гоночная игра с открытым миром, где картой выступает вся Америка от Юбейсофт",
                "Последняя часть игрой серии Colin McRae Rally, с надписью Colin McRae в названии",
                "Оттуда все узнали бело-синюю бэху",
                "Гоночный краш тест симулятор",
            ], [
                "Один убийца, 4 выжившых и куча генераторов",
                "В этой игре вы работник психиатрической лечебницы, один из пациентов которой очень хочет видеть вас в качестве своей невесты ",
                "В этой игре можно угрожать пустым пистолетом",
                "Основной геймплей этой игры - гребля и сбор кокосов",
                "ИГРА очень похожая на королевскую битву или голодные игры, вышедшая 8 марта 2016 ",
            ], [
                "Компьютерная игра, изобретённая в СССР Алексеем Пажитновым в 1984г",
                "Лучший авиасимулятор, из всех, когда-либо выпускавшихся на PC",
                "Йо-хо-хо, и бутылка рому! Главный симулятор пиратских нескучных будней",
                "Чики-брики и в дамки",
                "Часть одной из самых известных серий пошаговых стратегий, разработаная российской компанией Nival Interactive",
            ],
        ],
    ]

    const globalAnswers = [
        [
            [
                "тысяча",
                "жёлтый",
                "солдаты",
                "куранты",
                "злотый",
            ],
            [
                "4 мая",
                "12 сентября",
                "11 ноября",
                "5 мая 2025",
                "22/7 = 3.14",
            ],
            [
                "произнести хоть сейчас",
                "единорог",
                "PlayStation 2",
                "трансаэро",
                "Tesla",
            ],
            [
                "бокс",
                "Гитлер",
                "Гринпис",
                "Правило 34",
                "Guilty Gear",
            ],
            [
                "санкции",
                "камень-бумага-ножницы",
                "евро",
                "5",
                "0.5",
            ],
        ],
        [
            [
                "Half-Life",
                "Activision",
                "Battlefield 1942",
                "Borderlands",
                "Sniper Elite",
            ],
            [
                "Dragon Age: Origins",
                "Аард Ирден Игни Квен Аксий",
                "Arena Daggerfall Morrowind Oblivion Skyrim",
                "Mass Effect Andromeda",
                "Fallout 2",
            ], [
                "FlatOut 2",
                "The Crew",
                "Colin McRae: DiRT",
                "Need for speed most wanted",
                "BeamNG",
            ], [
                "Dead by Daylight",
                "Outlast Whistleblower",
                "I Am Alive",
                "STRANDED DEEP",
                "The Culling",
            ], [
                "Тетрис",
                "Ил-2 Штурмовик",
                "Корсары",
                "stalker",
                "Heroes of Might and Magic 5",
            ],
        ],
    ]

    const aut = ["AnitaKanita", "EgosKekos"];
    const name = ["Общие вопросы", "Об играх"];

    const packs = new Array;
    for (let j = 0; j < 2; ++j) {
        const pack = {};
        //pack.id = j + 2;
        pack.name = name[j];
        //pack.rating = 100 + j * 100;
        //pack.author = 14;
        pack.pack = function () {
            const lines = new Array;
            for (let i = 0; i < 5; i++) {
                const line = {
                    name: globalThemes[j][i],
                    questions: (() => {
                        const questions = new Array;
                        for (let q = 0; q < 5; q++) {
                            questions.push({
                                text: globalQuestions[j][i][q],
                                answer: globalAnswers[j][i][q]
                            });
                        }
                        return questions;
                    })(),
                }
                lines.push(line);
            }
            return lines;
        }();
        pack.tags = "tags string";
        packs.push(pack);
    }
    return packs;
}



