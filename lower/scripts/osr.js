console.time('t');
function previewPhoto() {
    document.getElementById("print-content").style = "display: none;";
    document.getElementById("zagolovok_user_list").style = "display: block; text-align: center";
    document.getElementById("user_list").style = "display: block;";
    document.getElementById("print_button").style = "display: none; text-align: center;";
    document.getElementById("zagolovok_court_order").style = "display: block; text-align: center";
    document.getElementById("court_order").style = "display: block;";
    //document.getElementById("separator1").style = "display: block; text-align: center";


    var preview = document.querySelector('#previewPhoto');
    var file = document.querySelector('input#Photo[type=file]').files[0];
    var reader = new FileReader();
    
    document.getElementById("progress").style = "display: block; margin: 0 auto;";

    reader.onloadend = function () {
        preview.src = reader.result;

        Tesseract.recognize(
            preview.src, //ссылка на картинку
            'rus', {
                logger: m => console.log(m)
            }
        ).then(({
            data: {
                text
            }
        }) => {

            document.getElementById("ocr_result").innerText = text;
            document.getElementById("progress").style = "display: none;";
            console.log(text);
           
            //работа с распознанным текстом
            if (text.includes("ПРИКАЗ")) {
            //todo BLOK Приказ
            //todo BLOK Приказ
            
                //todo установка стилей
                document.getElementById("print-content").style = "display: block; background-color: turquoise;";
                document.getElementById("zagolovok_user_list").style = "display: none;";
                document.getElementById("user_list").style = "display: none;";
                document.getElementById("print_button").style = "display: block; text-align: center;";
                //! end установка стилей

                //todo Работа с Преамбулой Приказа
                var start = text.indexOf("Мировой");
                var end = text.indexOf("РЕШИЛ");
                var preambulaText = text.substring(start, end);
                document.getElementById("preambula").innerHTML = preambulaText + "ВЫНЕС НЕЗАКОННЫЙ Судебный Приказ";
                //! end Работа с Преамбулой Приказа

                //todo Работа с номером ПРИКАЗА 
                var strNumberUserList = text.substring(text.indexOf("ПРИКАЗ"), text.indexOf("судья"));                
                var strNumberUserList1 = strNumberUserList.substring(strNumberUserList.indexOf("№"), strNumberUserList.indexOf("Мировой"));
                var numberUserList = strNumberUserList1.substring(strNumberUserList1.indexOf("№"), strNumberUserList1.indexOf(" ", 3));
                document.getElementById("delo").value = numberUserList; 
                document.getElementById("labell").innerHTML = "Производство ";
                //! end работа с номером ПРИКАЗА

                //todo Работа с Шапкой Приказа
                //? АДРЕС СУДА
                var strAddress = text.substring(text.indexOf("Судебный"), text.indexOf("Именем"));
                
                //? ФИО СУДЬИ
                var strReferee = text.substring(text.indexOf("Мировой"), text.indexOf("заявление"));
                var strNameReferee = strReferee.substring(strReferee.indexOf("участка"), strReferee.indexOf("рассмотрев"));
                var FamelyIO = /[А-ЯЁ][а-яА-ЯёЁ-]{2,}[.,\s][А-ЯЁ][\s,.][А-ЯЁ]/;
                var strFamelyIO = strNameReferee.match(FamelyIO);
                
                //? ФИО ОТВЕТИКА
                var FIO = /[А-ЯЁ][а-яА-ЯёЁ-]{2,}[\s][А-ЯЁ][а-яА-ЯёЁ-]{2,}[\s][А-ЯЁ][а-яА-ЯёЁ-]{2,}/;
                var str = text.substring(text.indexOf("РЕШИЛ"), text.indexOf("десятидневный")); 
                var userFIO = str.match(FIO);

                //? АДРЕС ОТВЕТЧИКА
                var str = text.substring(text.indexOf("судья"), text.indexOf("РЕШИЛ"));
                var str1 = str.substring(str.indexOf("судья"), str.indexOf("ст."));
                var reverseTxt = reverseStr(str1);
                var addresUser = reverseTxt.substring(reverseTxt.search(/[0-9]/), reverseTxt.search(/[0-9]{6}/) + 6);
                addresUser = reverseStr(addresUser);
                             
                document.getElementById("shapka").innerHTML = `Получатель: 
Мировой судья ${strAddress} ${strFamelyIO}. 
От Человека и Гражданина: 
${userFIO}
${addresUser}`;
                //! end Работа с Шапкой Приказа
                
                //todo Работа с Суммой в рублях
                var patternMoney = /[0-9\s.,]{1,}руб/gm;
                var strMoney = text.substring(text.indexOf("РЕШИЛ"), text.indexOf("десятидневный"));
                var allMoney = strMoney.match(patternMoney);
                
                var arr1 = allMoney.map(item => item.replace(/\s+/g, ""));
                var arr2 = arr1.map(item => item.replace(/,/g, "."));
                var arr3 = arr2.map(item => Number.parseFloat(item.match(/[0-9.]{1,}/g)));
                var summa = arr3.reduce((sum, current) => sum + current, 0);
                              
                document.getElementById("money").innerHTML = `Вам сэкономили <b>${summa}</b> рублей. Поблагодарите программиста`
                console.log("allMoney: ", allMoney);
                console.log("arr1: ", arr1);
                console.log("arr2: ", arr2);
                console.log("arr3: ", arr3);
                console.log("summa: ", summa);
                //! end работа с суммой в рублях

            //! END BLOK ПРИКАЗ
            //! END BLOK ПРИКАЗ
            
            } else if (text.includes("ПОСТАНОВЛЕНИЕ")) {
            //todo BLOK ПОСТАНОВЛЕНИЯ
            //todo BLOK ПОСТАНОВЛЕНИЯ
            
                //todo установка стилей
                document.getElementById("print-content").style = "display: block; background-color: chartreuse";
                document.getElementById("zagolovok_court_order").style = "display: none;";
                document.getElementById("court_order").style = "display: none;";
                document.getElementById("print_button").style = "display: block; text-align: center;";
                //! end устновка стилей
                
                //todo Работа с номером Постановления
                var strNumberUserList = text.substring(text.indexOf("ПОСТАНОВЛЕНИЕ"), text.indexOf("пристав"));                
                var NumberUserList = strNumberUserList.substring(strNumberUserList.indexOf("№"), strNumberUserList.indexOf("Судебный"));
                var NumberUserList1 = NumberUserList.substring(NumberUserList.indexOf("№"), NumberUserList.lastIndexOf(" "));
                document.getElementById("delo").value = NumberUserList1; 
                //! end работа с номером Постановления

                //todo Работа с Преамбулой Постановления
                var start = text.indexOf("пристав-исполнитель");
                var end = text.indexOf("УСТАНОВИЛ");
                var preambulaText = text.substring(start, end);
                document.getElementById("preambula").innerHTML = "Судебный " + preambulaText + "ВЫНЕС НЕЗАКОННОЕ Постановление";
                //! end работа с Преамбулой Постановления

                //todo Работа с Шапкой Постановления
                //? ФИО АДРЕС ОТВЕТЧИКА
                var FIO_addres_user = text.substring(text.indexOf("Получатель") + 11, text.indexOf("РОССИЯ") + 6);
                                                                                               
                //? РЕГИОН ПРИСТАВА
                var cut_text = text.substring(0, text.indexOf("ПОСТАНОВЛЕНИЕ"));
                
                insertShapka(json.UFSSP, 0, "ПОСТАНОВЛЕНИЕ", cut_text);
                document.getElementById("shapka").innerHTML = `
Получатель: 
Руководитель (ВРИО) ${upravlenieFssp}
${fioGlPristavaFssp}
${addresFssp}

Отправитель:
${FIO_addres_user}`;
                
                //! end работа с Шапкой Поставноления

                //todo Работа с Суммой в рублях
                var patternMoney = /[0-9\s.,]{1,}руб/gm;
                var strMoney = text.substring(text.indexOf("ПОСТАНОВЛЕНИЕ"), text.indexOf("УСТАНОВИЛ"));
                var allMoney = strMoney.match(patternMoney);
                                
                var arr1 = allMoney.map(item => item.replace(/\s+/g, ""));
                var arr2 = arr1.map(item => item.replace(/,/g, "."));
                var arr3 = arr2.map(item => Number.parseFloat(item.match(/[0-9.]{1,}/g)));
                var summa = arr3.reduce((sum, current) => sum + current, 0);
                
                document.getElementById("money").innerHTML = `Вам сэкономили <b>${summa}</b> рублей. Поблагодарите программиста`
                
                //! end работа с суммой в рублях

            //! END BLOK ПОСТАНОВЛЕНИЯ
            //! END BLOK ПОСТАНОВЛЕНИЯ
            
            } else {
                alert("Фотография не является Приказом или Постановлением. Либо качество фотографии плохое.Сделайте более качественное фото и повторите процесс. ");
            }
            
        });

    }

    if (file) {
        reader.readAsDataURL(file);


    } else {
        preview.src = "";
    }
}
//TODO реверст строки - функция
function reverseStr(str) {
    var newStr = '', i;
    for (i = str.length - 1; i >= 0; i--) {
        newStr += str.charAt(i);
    }
    return newStr;
}
//! END реверст строки


//todo json=====================================================================

//let json = require('/opt/lampp/htdocs/lower/scripts/ufssp.json');
var json = {
    "UFSSP": [
        {
            "region": "Республике Адыгея",
            "upravlenie": "УФССП России по Республике Адыгея",
            "fio": "Лабазов Дмитрий Владимирович",
            "addres": "385000, Республика Адыгея, г. Майкоп, ул. Курганная, д. 345"
        },
        {
            "region": "Республике Башкортостан",
            "upravlenie": "УФССП России по Республике Башкортостан",
            "fio": "Махмутов Ильнур Анварович",
            "addres": "450077, Республика Башкортостан, г. Уфа, ул.Цюрупы, д. 95"
        },
        {
            "region": "Республике Бурятия",
            "upravlenie": "УФССП России по Республике Бурятия",
            "fio": "Ертанов Петр Викторович",
            "addres": "670000, Республика Бурятия, г. Улан-Удэ, ул. Борсоева, д. 13Е"
        },
        {
            "region": "Республике Алтай",
            "upravlenie": "УФССП России по Республике Алтай",
            "fio": "Ильясов Радик Мударисович",
            "addres": "649007, Республика Алтай, г. Горно-Алтайск, ул. Ленина, д. 226, стр. 2"
        },
        {
            "region": "Республике Дагестан",
            "upravlenie": "УФССП России по Республике Дагестан",
            "fio": "Алилов Алик Мирзабекович",
            "addres": "367023, Республика Дагестан, г. Махачкала, ул. Мирзабекова А.М., д. 159, "
        },
        {
            "region": "Республике Ингушетия",
            "upravlenie": "УФССП России по Республике Ингушетия",
            "fio": "Шатин Максим Александрович",
            "addres": "386100, Республика Ингушетия, г. Магас, ул. К. Кулиева, д. 8"
        },
        {
            "region": "Кабардино-Балкарской Республике",
            "upravlenie": "УФССП России по Кабардино-Балкарской Республике",
            "fio": "Бауаев Ахмат Каллетович",
            "addres": "360051, Кабардино-Балкарская Республика, г. Нальчик, ул. И. Арманд, д. 43-а"
        },
        {
            "region": "Республике Калмыкия",
            "upravlenie": "УФССП России по Республике Калмыкия",
            "fio": "Мухортов Роман Сергеевич",
            "addres": "358000, Республика Калмыкия, г. Элиста, ул. Герасименко, д. 61"
        },
        {
            "region": "Карачаево-Черкесской Республике",
            "upravlenie": "УФССП России по Карачаево-Черкесской Республике",
            "fio": "Урусов Рамазан Борисович",
            "addres": "369000, Карачаево-Черкесская Республика, г. Черкесск, ул. Кавказская, д. 19"
        },
        {
            "region": "Республике Карелия",
            "upravlenie": "УФССП России по Республике Карелия",
            "fio": "Гончаров Олег Валерьевич",
            "addres": "185910, Республика Карелия, г. Петрозаводск, ул.Красная, д. 33"
        },
        {
            "region": "Республике Коми",
            "upravlenie": "УФССП России по Республике Коми",
            "fio": "Кручинкин Дмитрий Владимирович",
            "addres": "167981, Республика Коми, г. Сыктывкар, ул. Пушкина, д.110"
        },
        {
            "region": "Республике Марий Эл",
            "upravlenie": "УФССП России по Республике Марий Эл",
            "fio": "Иванов Анатолий Юрьевич",
            "addres": "424003, Республика Марий Эл, г. Йошкар - Ола, ул. Зеленая, д. 3"
        },
        {
            "region": "Республике Мордовия",
            "upravlenie": "УФССП России по Республике Мордовия",
            "fio": "Могин Юрий Алексеевич",
            "addres": "430016, Республика Мордовия, г. Саранск, ул. Терешковой, д. 1"
        },
        {
            "region": "Республике Саха (Якутия)",
            "upravlenie": "УФССП России по Республике Саха (Якутия)",
            "fio": "Никифоров Алексей Артамонович",
            "addres": "677000, Республика Саха (Якутия), г. Якутск, ул. Лермонтова, д. 25"
        },
        {
            "region": "Республике Северная Осетия-Алания",
            "upravlenie": "УФССП России по Республике Северная Осетия-Алания",
            "fio": "Кесаонов Игорь Константинович",
            "addres": "362002,Республика Северная Осетия-Алания, г. Владикавказ, ул. Зортова, д. 4"
        },
        {
            "region": "Республике Татарстан",
            "upravlenie": "УФССП России по Республике Татарстан",
            "fio": "Закиров Анвар Фаритович",
            "addres": "420111, Республика Татарстан, г. Казань, ул. Рустема Яхина, д. 3"
        },
        {
            "region": "Республике Тыва",
            "upravlenie": "УФССП России по Республике Тыва",
            "fio": "Достай Омак Степанович",
            "addres": "667000, Республика Тыва, г. Кызыл, ул.Складская, д. 1А"
        },
        {
            "region": "Удмуртской Республике",
            "upravlenie": "УФССП России по Удмуртской Республике",
            "fio": "Наговицын Игорь Владимирович",
            "addres": "426063, Удмуртская Республика, г. Ижевск, ул.Ключевой поселок, д.39б"
        },
        {
            "region": "Республике Хакасия",
            "upravlenie": "УФССП России по Республике Хакасия",
            "fio": "Романова Алёна Анатольевна",
            "addres": "655017, Республика Хакасия, г. Абакан, ул. Вяткина, д. 12"
        },
        {
            "region": "Чеченской Республике",
            "upravlenie": "УФССП России по Чеченской Республике",
            "fio": "Алаудинов Абдула Аронович",
            "addres": "364022, Чеченская Республика, г. Грозный, ул. А.Х.Башаева, д. 9"
        },
        {
            "region": "Чувашской Республике - Чувашии",
            "upravlenie": "УФССП России по Чувашской Республике - Чувашии",
            "fio": "Максимова Марина Геннадьевна",
            "addres": "428000, Чувашская Республика, г. Чебоксары, ул. Энтузиастов, д. 34А"
        },
        {
            "region": "Алтайскому краю",
            "upravlenie": "УФССП России по Алтайскому краю",
            "fio": "Лабутин Дмитрий Николаевич ",
            "addres": "656056, Алтайский край, г. Барнаул, ул.Пушкина, д. 17"
        },
        {
            "region": "Краснодарскому краю",
            "upravlenie": "ГУФССП России по Краснодарскому краю",
            "fio": "Ткаченко Дмитрий Григорьевич ",
            "addres": "350063, Краснодарский край, г. Краснодар, ул. Красная, д. 22"
        },
        {
            "region": "Красноярскому краю",
            "upravlenie": "ГУФССП России по Красноярскому краю",
            "fio": "Васильев Виталий Сергеевич",
            "addres": "660135, Красноярский край, г. Красноярск, ул. 6-я Полярная, 2"
        },
        {
            "region": "Приморскому краю",
            "upravlenie": "УФССП России по Приморскому краю",
            "fio": "Протопопова Элеонора Борисовна",
            "addres": "690091, Приморский край, г. Владивосток, ул. Посьетская, д. 48"
        },
        {
            "region": "Ставропольскому краю",
            "upravlenie": "УФССП России по Ставропольскому краю",
            "fio": "Захарова Марина Анатольевна",
            "addres": "355017, Ставропольский край, г. Ставрополь, ул. Маршала Жукова, д. 46, "
        },
        {
            "region": "Хабаровскому краю и Еврейской автономной области",
            "upravlenie": "УФССП России по Хабаровскому краю и Еврейской автономной области",
            "fio": "Касьяненко Анатолий Анатольевич",
            "addres": "680000, г. Хабаровск, ул. Карла Маркса, д. 60"
        },
        {
            "region": "Амурской области",
            "upravlenie": "УФССП России по Амурской области",
            "fio": "Засядько Светлана Владимировна",
            "addres": "675000, г. Благовещенск, пер. Пограничный, д. 10"
        },
        {
            "region": "Архангельской области и Ненецкому автономному округу",
            "upravlenie": "УФССП России по Архангельской области и Ненецкому автономному округу",
            "fio": "Юшманов Иван Александрович",
            "addres": "163002, г. Архангельск, пр. Ломоносова, д. 30"
        },
        {
            "region": "Астраханской области",
            "upravlenie": "УФССП России по Астраханской области",
            "fio": "Юдин Александр Викторович",
            "addres": "414000 г. Астрахань, ул. Никольская, 9 / ул. Ульяновых, 12"
        },
        {
            "region": "Белгородской области",
            "upravlenie": "УФССП России по Белгородской области",
            "fio": "Казанов Денис Николаевич",
            "addres": "308002,  Белгородская область, г. Белгород, Б. Хмельницкого пр-кт, д. 109 "
        },
        {
            "region": "Брянской области",
            "upravlenie": "УФССП России по Брянской области",
            "fio": "Бывшева Елена Федоровна",
            "addres": "241050, г. Брянск, ул. Дуки, д. 59"
        },
        {
            "region": "Владимирской области",
            "upravlenie": "УФССП России по Владимирской области",
            "fio": "Денисенко Наталья Геннадьевна",
            "addres": "600017, г. Владимир, ул. Горького, д. 2А"
        },
        {
            "region": "Волгоградской области",
            "upravlenie": "УФССП России по Волгоградской области",
            "fio": "Евстигнеев Владимир Николаевич",
            "addres": "400001, г. Волгоград, ул. им Калинина, д. 4"
        },
        {
            "region": "Вологодской области",
            "upravlenie": "УФССП России по Вологодской области",
            "fio": "Салмина Ирина Александровна",
            "addres": "160025, г. Вологда, ул. Петрозаводская, д. 3"
        },
        {
            "region": "Воронежской области",
            "upravlenie": "УФССП России по Воронежской области",
            "fio": "Паринов Руслан Николаевич",
            "addres": "394006, г. Воронеж, ул. Краснознаменная, д. 2"
        },
        {
            "region": "Ивановской области",
            "upravlenie": "УФССП России по Ивановской области",
            "fio": "Тяпкина Наталья Витальевна",
            "addres": "153000, г. Иваново, ул. Багаева, д. 27"
        },
        {
            "region": "Иркутской области",
            "upravlenie": "УФССП России по Иркутской области",
            "fio": "Токаев Аслан Казбекович",
            "addres": "664047, г. Иркутск, ул. Партизанская, 79"
        },
        {
            "region": "Калининградской области",
            "upravlenie": "УФССП России по Калининградской области",
            "fio": "Очкалов Алексей Валерьевич",
            "addres": "236022, г. Калининград, Мира пр-кт, 5-7"
        },
        {
            "region": "Калужской области",
            "upravlenie": "УФССП России по Калужской области",
            "fio": "Зубов Иван Александрович",
            "addres": "248023, г. Калуга, ул. Фридриха Энгельса, д. 25"
        },
        {
            "region": "Камчатскому краю и Чукотскому АО",
            "upravlenie": "УФССП России по Камчатскому краю и Чукотскому АО",
            "fio": "Старов Дмитрий Станиславович",
            "addres": "683023, Камчатский край, г. Петропавловск-Камчатский, Рыбаков пр-кт, д. 25"
        },
        {
            "region": "Кемеровской области – Кузбассу",
            "upravlenie": "УФССП России по Кемеровской области – Кузбассу",
            "fio": "Ткаченко Дмитрий Геннадьевич",
            "addres": "650000, г. Кемерово, Советский пр-кт, д. 30"
        },
        {
            "region": "Кировской области",
            "upravlenie": "УФССП России по Кировской области",
            "fio": "Бровченко Дмитрий Леонидович",
            "addres": "610000, г. Киров, ул. Московская, д. 57"
        },
        {
            "region": "Костромской области",
            "upravlenie": "УФССП России по Костромской области",
            "fio": "Шильников Денис Андреевич",
            "addres": "156961, г. Кострома, ул. Островского, д. 37"
        },
        {
            "region": "Курганской области",
            "upravlenie": "УФССП России по Курганской области",
            "fio": "Уварова Ирина Лазаревна",
            "addres": "640000, г. Курган, ул. Коли Мяготина, 119"
        },
        {
            "region": "Курской области",
            "upravlenie": "УФССП России по Курской области",
            "fio": "Шкурина Елена Васильевна",
            "addres": "305018, г. Курск, ул. Черняховского, д. 4, "
        },
        {
            "region": "Ленинградской области",
            "upravlenie": "УФССП России по Ленинградской области",
            "fio": "Абатуров Глеб Владимирович",
            "addres": "199106,  г. Санкт-Петербург, Большой пр. В.О., д. 80, лит. Б"
        },
        {
            "region": "Липецкой области",
            "upravlenie": "УФССП России по Липецкой области",
            "fio": "Макаров Глеб Валентинович",
            "addres": "398043, г. Липецк, ул. Валентины Терешковой, д. 14, корп. 3"
        },
        {
            "region": "Магаданской области",
            "upravlenie": "УФССП России по Магаданской области",
            "fio": "Фирманов Анатолий Александрович",
            "addres": "685000, г. Магадан, пр. Карла Маркса, д. 60"
        },
        {
            "region": "Московской области",
            "upravlenie": "ГУФССП России по Московской области",
            "fio": "Коновалов Николай Викторович",
            "addres": "143400, Московская область, г. Красногорск, ул. Речная, д. 8"
        },
        {
            "region": "Мурманской области",
            "upravlenie": "УФССП России по Мурманской области",
            "fio": "Малюшкин Александр Сергеевич",
            "addres": "183012, г. Мурманск, ул. Карла Либкнехта, д. 46, корп. 2"
        },
        {
            "region": "Нижегородской области",
            "upravlenie": "УФССП России по Нижегородской области",
            "fio": "Морковкин Леонид Игоревич",
            "addres": "603950, г. Нижний Новгород, ул. Вождей Революции, д. 5А"
        },
        {
            "region": "Новгородской области",
            "upravlenie": "УФССП России по Новгородской области",
            "fio": "Безызвестных Татьяна Георгиевна",
            "addres": "173001 г. Великий Новгород, ул. Ильина, д. 6"
        },
        {
            "region": "Новосибирской области",
            "upravlenie": "УФССП России по Новосибирской области",
            "fio": "Бабков Эдуард Витальевич",
            "addres": "630005, г. Новосибирск, ул. Красный проспект, 86/1"
        },
        {
            "region": "Омской области",
            "upravlenie": "УФССП России по Омской области",
            "fio": "Титова Галина Михайлолвна",
            "addres": "644099, г. Омск, ул. Ленина, 14"
        },
        {
            "region": "Оренбургской области",
            "upravlenie": "УФССП России по Оренбургской области",
            "fio": "Косогорская Галина Владимировна",
            "addres": "460023, г. Оренбург, ул. Ткачева, д. 8"
        },
        {
            "region": "Орловской области",
            "upravlenie": "УФССП России по Орловской области",
            "fio": "Смирнов Михаил Витальевич",
            "addres": "302010, г. Орел, ул. Авиационная, д. 5"
        },
        {
            "region": "Пензенской области",
            "upravlenie": "УФССП России по Пензенской области",
            "fio": "Илькин Николай Кузьмич",
            "addres": "440008, г. Пенза, ул. Пушкина, д. 17А"
        },
        {
            "region": "Пермскому краю",
            "upravlenie": "УФССП России по Пермскому краю",
            "fio": "Неведомский Сергей Анатольевич",
            "addres": "614066, г. Пермь, ул. Советской, д. 28"
        },
        {
            "region": "Псковской области",
            "upravlenie": "УФССП России по Псковской области",
            "fio": "Колесников Сергей Анатольевич",
            "addres": "180019, г. Псков, ул. Текстильная, д. 3"
        },
        {
            "region": "Ростовской области",
            "upravlenie": "УФССП России по Ростовской области",
            "fio": "Казанов Евгений Николаевич",
            "addres": "344002, г. Ростов-на-Дону, пер. Соборный, д. 2А"
        },
        {
            "region": "Рязанской области",
            "upravlenie": "УФССП России по Рязанской области",
            "fio": "Божимова Ольга Алексеевна",
            "addres": "390000, г. Рязань, ул. Кудрявцева, д. 56"
        },
        {
            "region": "Самарской области",
            "upravlenie": "УФССП России по Самарской области",
            "fio": "Муратов Закир Рамильевич",
            "addres": "443126, г. Самара, ул. Урицкого, д. 17"
        },
        {
            "region": "Саратовской области",
            "upravlenie": "УФССП России по Саратовской области",
            "fio": "Решетняк Илья Николаевич",
            "addres": "410000, г. Саратов, Театральная площадь, д.11"
        },
        {
            "region": "Сахалинской области",
            "upravlenie": "УФССП России по Сахалинской области",
            "fio": "Кононов Андрей Анатольевич",
            "addres": "693000, г. Южно-Сахалинск, ул. Ленина, д. 45"
        },
        {
            "region": "Свердловской области",
            "upravlenie": "ГУФССП России по Свердловской области",
            "fio": "Сухорукова Альбина Халилевна",
            "addres": "620075, г. Екатеринбург, ул. Пролетарская, д. 7"
        },
        {
            "region": "Смоленской области",
            "upravlenie": "УФССП России по Смоленской области",
            "fio": "Эммануилиди Анжела Валентиновна",
            "addres": "214029, г. Смоленск, Смоленский р-н, ш. Краснинское, д. 35"
        },
        {
            "region": "Тамбовской области",
            "upravlenie": "УФССП России по Тамбовской области",
            "fio": "Полухтин Михаил Иванович",
            "addres": "392000, г. Тамбов, ул. Рахманинова, д. 1А"
        },
        {
            "region": "Тверской области",
            "upravlenie": "УФССП России по Тверской области",
            "fio": "Семенова Надежда Геннадьевна",
            "addres": "170003, г. Тверь, ул. Веселова, д. 4, д. 6"
        },
        {
            "region": "Томской области",
            "upravlenie": "УФССП России по Томской области",
            "fio": "Надиров Бениамин Эдмундович",
            "addres": "634006, г. Томск, ул. Пушкина, д. 65"
        },
        {
            "region": "Тульской области",
            "upravlenie": "УФССП России по Тульской области",
            "fio": "Киреенков Евгений Геннадьевич",
            "addres": "300028, г. Тула, ул. 9 Мая, д. 1"
        },
        {
            "region": "Тюменской области",
            "upravlenie": "УФССП России по Тюменской области",
            "fio": "Хайдаров Кабдула Мурзахметович",
            "addres": "625013, г. Тюмень, ул. Пермякова, д. 5"
        },
        {
            "region": "Ульяновской области",
            "upravlenie": "УФССП России по Ульяновской области",
            "fio": "Тагаев Андрей Александрович",
            "addres": "432061, г. Ульяновск, ул. Азовская, д. 95"
        },
        {
            "region": "Челябинской области",
            "upravlenie": "УФССП России по Челябинской области",
            "fio": "Третьякова Юлия Игоревна",
            "addres": "454078, г. Челябинск, ул. Барбюса, д.136В"
        },
        {
            "region": "Забайкальскому краю",
            "upravlenie": "УФССП России по Забайкальскому краю",
            "fio": "Дамдинжапов Баясхалан Владимирович",
            "addres": "672000, Забайкальский край, г. Чита, ул. Бабушкина, д.127"
        },
        {
            "region": "Ярославской области",
            "upravlenie": "УФССП России по Ярославской области",
            "fio": "Абрамов Андрей Владимировичч",
            "addres": "150040. г. Ярославль, пр-кт Октября, д. 17г"
        },
        {
            "region": "г. Москве",
            "upravlenie": "ГУФССП России по г. Москве",
            "fio": "Замородских Сергей Григорьевич",
            "addres": "125047, г. Москва, ул. Бутырский вал, д. 5"
        },
        {
            "region": "г. Санкт-Петербургу",
            "upravlenie": "ГУФССП России по г. Санкт-Петербургу",
            "fio": "Лашкова Анна Евгеньевна",
            "addres": "190000, г. Санкт-Петербург, ул. Большая Морская, д. 59"
        },
        {
            "region": "Республике Крым",
            "upravlenie": "УФССП России по Республике Крым",
            "fio": "Рудаков Игорь Анатольевич",
            "addres": "295034, Республика Крым, г. Симферополь, ул. Киевская, д. 81"
        },
        {
            "region": "Ханты-Мансийскому АО - Югре",
            "upravlenie": "УФССП России по Ханты-Мансийскому АО - Югре",
            "fio": "Ловандо Елена Евгеньевна",
            "addres": "628012, г. Ханты-Мансийск, ул. Чехова, д. 8"
        },
        {
            "region": "Ямало-Ненецкому автономному округу",
            "upravlenie": "УФССП России по Ямало-Ненецкому автономному округу",
            "fio": "Смирнов Евгений Александрович",
            "addres": "629007, г. Салехард, ул. Свердлова, д. 43А"
        },
        {
            "region": "Севастополю",
            "upravlenie": "УФССП России по Севастополю",
            "fio": "Мосеенков Александр Владимирович",
            "addres": "299000, г. Севастополь, ул. Правды, д. 10"
        }
    ]
};
//! end json=============================================================================

function insertShapka(argArr, strStart, strEnd, superText) {
    
    var Mas = argArr.forEach(element => {
        
        var str = superText.substring(superText.indexOf(strStart), superText.indexOf(strEnd));

        if (str.includes(element.region)) {

            var regionFssp = element.region;
            var upravlenieFssp = element.upravlenie;
            var fioGlPristavaFssp = element.fio;
            var addresFssp = element.addres;
                        
            console.log(regionFssp);
            console.log(upravlenieFssp)
            console.log(fioGlPristavaFssp);
            console.log(addresFssp);
            

        } else { 
            //console.log ("ошибка");
        }
        
    });
    return Mas, console.log(Mas);
}
console.timeEnd('t');
