
function createLesson(id, title, duration, intro, theory, example, question, hint, answer, explanation) {
    return {
        id,
        title,
        duration,
        theory: [
            { title: intro, text: theory }
        ],
        example,
        task: {
            question,
            hint,
            answer,
            explanation
        }
    };
}

function makeCourse(id, title, icon, category, level, description, topics) {
    return {
        id,
        title,
        icon,
        category,
        level,
        description,
        lessons: topics.map((topic, index) => createLesson(
            `${id}-${index + 1}`,
            topic.title,
            topic.duration,
            topic.intro,
            topic.theory,
            topic.example,
            topic.question,
            topic.hint,
            topic.answer,
            topic.explanation
        ))
    };
}

export const COURSES = [
    makeCourse("python", "Python", "🐍", "language", "Начальный",
        "Изучи основы Python, автоматизацию и создание приложений.", [
            {
                title: "Знакомство с Python",
                duration: "10 минут",
                intro: "Что такое Python?",
                theory: "Python — популярный язык программирования с понятным синтаксисом. Его используют для автоматизации, анализа данных, искусственного интеллекта и веб-разработки.",
                example: 'print("Привет, мир!")',
                question: "Напиши команду Python, которая выводит слово Hello.",
                hint: "Используй функцию print() и кавычки.",
                answer: 'print("Hello")',
                explanation: "print() выводит переданный текст."
            },
            {
                title: "Переменные и типы данных",
                duration: "15 минут",
                intro: "Хранение данных",
                theory: "Переменная связывает имя со значением. Основные типы: int — целые числа, float — дробные числа, str — строки, bool — логические значения.",
                example: 'name = "Alex"\nage = 18\nis_student = True',
                question: "Создай переменную age и присвой ей число 20.",
                hint: "Используй знак присваивания.",
                answer: "age = 20",
                explanation: "Переменная age получает значение 20."
            },
            {
                title: "Условия if и else",
                duration: "15 минут",
                intro: "Условное выполнение",
                theory: "Конструкция if выполняет блок кода, если условие истинно. else задаёт альтернативную ветку.",
                example: 'age = 18\nif age >= 18:\n    print("Можно")\nelse:\n    print("Нельзя")',
                question: "Напиши условие проверки, что number равна 10.",
                hint: "Для сравнения равенства используется ==.",
                answer: "if number == 10:",
                explanation: "Оператор == проверяет равенство."
            },
            {
                title: "Циклы for и while",
                duration: "20 минут",
                intro: "Повторение команд",
                theory: "Циклы повторяют действия. for перебирает последовательности, while выполняется, пока условие истинно.",
                example: "for i in range(3):\n    print(i)",
                question: "Напиши заголовок цикла for для перебора чисел от 0 до 2.",
                hint: "Используй range(3).",
                answer: "for i in range(3):",
                explanation: "range(3) формирует числа 0, 1 и 2."
            },
            {
                title: "Функции",
                duration: "20 минут",
                intro: "Повторно используемый код",
                theory: "Функция — именованный блок кода. Она объявляется через def, может принимать параметры и возвращать результат через return.",
                example: 'def greet(name):\n    return "Привет, " + name\n\nprint(greet("Alex"))',
                question: "Объяви функцию hello без параметров.",
                hint: "Начни с def и добавь пустые скобки.",
                answer: "def hello():",
                explanation: "Так объявляется функция без параметров."
            }
        ]),

    makeCourse("javascript", "JavaScript", "🌐", "language", "Начальный",
        "Освой язык интерактивных сайтов и веб-приложений.", [
            {
                title: "Введение в JavaScript",
                duration: "10 минут",
                intro: "JavaScript в браузере",
                theory: "JavaScript добавляет веб-страницам интерактивность. Он работает в браузерах и на сервере с Node.js.",
                example: 'console.log("Hello, world!");',
                question: "Напиши команду для вывода числа 10 в консоль.",
                hint: "Используй console.log().",
                answer: "console.log(10);",
                explanation: "console.log() выводит значение в консоль."
            },
            {
                title: "Переменные",
                duration: "15 минут",
                intro: "let, const и var",
                theory: "let создаёт переменную, которую можно переназначить. const создаёт переменную, которую нельзя переназначить.",
                example: 'const name = "Alex";\nlet age = 20;\nconsole.log(name, age);',
                question: "Создай константу score со значением 100.",
                hint: "Используй const.",
                answer: "const score = 100;",
                explanation: "const объявляет константу."
            },
            {
                title: "Типы данных",
                duration: "15 минут",
                intro: "Примитивные типы",
                theory: "JavaScript поддерживает string, number, boolean, null, undefined, bigint и symbol. Объекты и массивы относятся к ссылочным типам.",
                example: 'const text = "Code";\nconst count = 5;\nconst active = true;',
                question: "Создай переменную isReady со значением true через const.",
                hint: "Значение true пишется без кавычек.",
                answer: "const isReady = true;",
                explanation: "true — логическое значение."
            },
            {
                title: "Условия",
                duration: "15 минут",
                intro: "if и else",
                theory: "Условия позволяют выполнять разные ветки кода в зависимости от логического выражения.",
                example: 'const age = 18;\nif (age >= 18) {\n    console.log("OK");\n}',
                question: "Напиши условие проверки age больше 18.",
                hint: "Используй if и оператор >.",
                answer: "if (age > 18) {",
                explanation: "Оператор > проверяет строгое превышение."
            },
            {
                title: "Функции",
                duration: "20 минут",
                intro: "Объявление функций",
                theory: "Функции позволяют группировать инструкции. Их можно объявлять через function или создавать стрелочными выражениями.",
                example: "function sum(a, b) {\n    return a + b;\n}",
                question: "Объяви функцию sum с параметрами a и b.",
                hint: "Используй ключевое слово function.",
                answer: "function sum(a, b) {",
                explanation: "Это начало объявления функции sum."
            }
        ]),

    makeCourse("cpp", "C++", "⚙️", "language", "Начальный",
        "Изучи основы C++, типы данных, функции и ООП.", [
            {
                title: "Первая программа на C++",
                duration: "15 минут",
                intro: "Структура программы",
                theory: "C++ — компилируемый язык программирования. Точка входа программы — функция main. Для вывода часто используют cout.",
                example: '#include <iostream>\nint main() {\n    std::cout << "Hello";\n    return 0;\n}',
                question: "Напиши команду вывода числа 10 через std::cout.",
                hint: "Используй оператор <<.",
                answer: "std::cout << 10;",
                explanation: "Оператор << передаёт значение в поток вывода."
            },
            {
                title: "Переменные и типы",
                duration: "15 минут",
                intro: "Типизация C++",
                theory: "Тип переменной определяет множество допустимых значений. Часто применяются int, double, char, bool и std::string.",
                example: 'int age = 20;\ndouble price = 15.5;\nbool active = true;',
                question: "Объяви целочисленную переменную count со значением 5.",
                hint: "Используй тип int.",
                answer: "int count = 5;",
                explanation: "int предназначен для целых чисел."
            },
            {
                title: "Условия",
                duration: "15 минут",
                intro: "Ветвление программы",
                theory: "if и else позволяют выбирать ветку выполнения в зависимости от условия.",
                example: 'int age = 18;\nif (age >= 18) {\n    std::cout << "OK";\n}',
                question: "Напиши начало условия проверки x больше 0.",
                hint: "Используй if и круглые скобки.",
                answer: "if (x > 0) {",
                explanation: "Условие проверяет положительность x."
            },
            {
                title: "Циклы",
                duration: "20 минут",
                intro: "for и while",
                theory: "Циклы повторяют инструкции. for удобен при известном количестве повторений, while — при проверке условия.",
                example: "for (int i = 0; i < 5; i++) {\n    std::cout << i;\n}",
                question: "Напиши заголовок цикла for с переменной i от 0 до 4.",
                hint: "Условие должно быть i < 5.",
                answer: "for (int i = 0; i < 5; i++) {",
                explanation: "Цикл выполнится для значений от 0 до 4."
            },
            {
                title: "Функции",
                duration: "20 минут",
                intro: "Переиспользование кода",
                theory: "Функция имеет тип возвращаемого значения, имя, параметры и тело. void означает отсутствие возвращаемого значения.",
                example: "int sum(int a, int b) {\n    return a + b;\n}",
                question: "Напиши заголовок функции int add с параметрами int a и int b.",
                hint: "Укажи тип результата и оба параметра.",
                answer: "int add(int a, int b) {",
                explanation: "Функция add принимает два целых числа."
            }
        ]),

    makeCourse("java", "Java", "☕", "language", "Начальный",
        "Познакомься с Java и созданием приложений.", [
            {
                title: "Первая программа Java",
                duration: "15 минут",
                intro: "Класс и метод main",
                theory: "Java — объектно-ориентированный язык. Программа обычно содержит класс, а выполнение начинается с метода main.",
                example: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello");\n    }\n}',
                question: "Напиши команду вывода текста Hello в Java.",
                hint: "Используй System.out.println.",
                answer: 'System.out.println("Hello");',
                explanation: "println выводит текст и переводит строку."
            },
            {
                title: "Переменные",
                duration: "15 минут",
                intro: "Типы переменных",
                theory: "Java использует статическую типизацию. Тип переменной указывается при объявлении: int, double, boolean, char или String.",
                example: 'int age = 20;\nString name = "Alex";',
                question: "Объяви int-переменную count со значением 10.",
                hint: "Сначала укажи тип int.",
                answer: "int count = 10;",
                explanation: "Переменная count хранит целое число."
            },
            {
                title: "Условия",
                duration: "15 минут",
                intro: "Условные операторы",
                theory: "if, else if и else управляют ветвлением. Условие должно возвращать boolean.",
                example: 'if (age >= 18) {\n    System.out.println("Adult");\n} else {\n    System.out.println("Child");\n}',
                question: "Напиши начало условия проверки x равного 5.",
                hint: "Используй if и оператор ==.",
                answer: "if (x == 5) {",
                explanation: "== сравнивает значения."
            },
            {
                title: "Циклы",
                duration: "20 минут",
                intro: "Повторение операций",
                theory: "Java поддерживает циклы for, while и do-while. Они позволяют повторять блок кода.",
                example: "for (int i = 0; i < 3; i++) {\n    System.out.println(i);\n}",
                question: "Напиши заголовок цикла for от 0 до 2.",
                hint: "Используй i < 3.",
                answer: "for (int i = 0; i < 3; i++) {",
                explanation: "Цикл выполняется три раза."
            },
            {
                title: "Методы",
                duration: "20 минут",
                intro: "Создание методов",
                theory: "Метод — блок кода внутри класса. Он может принимать параметры и возвращать значение.",
                example: "static int sum(int a, int b) {\n    return a + b;\n}",
                question: "Напиши заголовок static-метода int greet без параметров.",
                hint: "После имени укажи пустые скобки.",
                answer: "static int greet() {",
                explanation: "Метод возвращает int и не принимает параметров."
            }
        ]),

    makeCourse("rust", "Rust", "🦀", "language", "Начальный",
        "Изучи современный системный язык программирования.", [
            {
                title: "Знакомство с Rust",
                duration: "15 минут",
                intro: "Безопасность и производительность",
                theory: "Rust — системный язык с акцентом на безопасность памяти. Он использует компилятор и строгую систему типов.",
                example: 'fn main() {\n    println!("Hello, world!");\n}',
                question: "Напиши команду вывода Hello в Rust.",
                hint: "Используй println! и восклицательный знак.",
                answer: 'println!("Hello");',
                explanation: "println! — макрос вывода строки."
            },
            {
                title: "Переменные и mut",
                duration: "15 минут",
                intro: "Неизменяемость по умолчанию",
                theory: "В Rust переменные неизменяемы по умолчанию. Для разрешения изменения используют mut.",
                example: "let name = \"Alex\";\nlet mut age = 20;\nage = 21;",
                question: "Объяви изменяемую переменную score со значением 10.",
                hint: "Используй let mut.",
                answer: "let mut score = 10;",
                explanation: "mut разрешает менять значение переменной."
            },
            {
                title: "Типы данных",
                duration: "15 минут",
                intro: "Числа и строки",
                theory: "Rust имеет целочисленные, вещественные, логические и символьные типы. Строковые литералы имеют тип &str.",
                example: 'let count: i32 = 10;\nlet active: bool = true;\nlet title: &str = "Rust";',
                question: "Объяви переменную age типа i32 со значением 18.",
                hint: "Тип указывается после двоеточия.",
                answer: "let age: i32 = 18;",
                explanation: "i32 — знаковый 32-битный целочисленный тип."
            },
            {
                title: "Условия",
                duration: "15 минут",
                intro: "Выражение if",
                theory: "В Rust if является выражением и может возвращать значение. Условие должно иметь тип bool.",
                example: 'let age = 18;\nif age >= 18 {\n    println!("Adult");\n}',
                question: "Напиши условие проверки age больше 18.",
                hint: "После условия ставятся фигурные скобки.",
                answer: "if age > 18 {",
                explanation: "Условие проверяет, превышает ли age число 18."
            },
            {
                title: "Функции",
                duration: "20 минут",
                intro: "Объявление fn",
                theory: "Функции объявляются ключевым словом fn. Типы параметров указываются явно.",
                example: "fn sum(a: i32, b: i32) -> i32 {\n    a + b\n}",
                question: "Напиши заголовок функции greet без параметров и возвращаемого значения.",
                hint: "Используй fn и пустые скобки.",
                answer: "fn greet() {",
                explanation: "Так начинается объявление функции greet."
            }
        ]),

    makeCourse("sql", "SQL", "🗄️", "database", "Начальный",
        "Научись создавать запросы и работать с данными.", [
            {
                title: "Знакомство с SQL",
                duration: "15 минут",
                intro: "Язык запросов",
                theory: "SQL применяется для работы с реляционными базами данных. SELECT извлекает данные из таблиц.",
                example: "SELECT * FROM users;",
                question: "Напиши запрос для получения всех столбцов таблицы products.",
                hint: "Используй SELECT * FROM.",
                answer: "SELECT * FROM products;",
                explanation: "Запрос возвращает все столбцы таблицы."
            },
            {
                title: "Фильтрация WHERE",
                duration: "15 минут",
                intro: "Выбор нужных строк",
                theory: "WHERE задаёт условие фильтрации строк. Можно использовать сравнения и логические операторы.",
                example: "SELECT * FROM users WHERE age >= 18;",
                question: "Выбери все строки users, где age равно 20.",
                hint: "После WHERE укажи age = 20.",
                answer: "SELECT * FROM users WHERE age = 20;",
                explanation: "WHERE оставляет строки, удовлетворяющие условию."
            },
            {
                title: "Сортировка ORDER BY",
                duration: "15 минут",
                intro: "Порядок результатов",
                theory: "ORDER BY сортирует результаты. ASC задаёт возрастание, DESC — убывание.",
                example: "SELECT * FROM products ORDER BY price DESC;",
                question: "Отсортируй users по name по возрастанию.",
                hint: "Используй ORDER BY name ASC.",
                answer: "SELECT * FROM users ORDER BY name ASC;",
                explanation: "ASC сортирует значения по возрастанию."
            },
            {
                title: "Добавление INSERT",
                duration: "20 минут",
                intro: "Добавление записей",
                theory: "INSERT INTO добавляет строки в таблицу. Значения указываются после VALUES.",
                example: "INSERT INTO users (name, age) VALUES ('Alex', 20);",
                question: "Добавь в таблицу users имя Alex и возраст 20.",
                hint: "Укажи столбцы name, age и VALUES.",
                answer: "INSERT INTO users (name, age) VALUES ('Alex', 20);",
                explanation: "INSERT INTO создаёт новую запись."
            },
            {
                title: "Обновление UPDATE",
                duration: "20 минут",
                intro: "Изменение записей",
                theory: "UPDATE меняет данные. WHERE ограничивает строки, которые будут изменены.",
                example: "UPDATE users SET age = 21 WHERE name = 'Alex';",
                question: "Установи age = 25 для пользователя с id = 1 в таблице users.",
                hint: "Используй UPDATE, SET и WHERE.",
                answer: "UPDATE users SET age = 25 WHERE id = 1;",
                explanation: "UPDATE меняет указанное поле выбранной записи."
            }
        ]),

    makeCourse("mysql", "MySQL", "🐬", "database", "Начальный",
        "Изучи реляционные базы данных на MySQL.", [
            {
                title: "Что такое MySQL",
                duration: "15 минут",
                intro: "Система управления базами данных",
                theory: "MySQL — реляционная СУБД. Данные хранятся в таблицах, связанных между собой.",
                example: "CREATE DATABASE academy;",
                question: "Напиши запрос создания базы данных shop.",
                hint: "Используй CREATE DATABASE.",
                answer: "CREATE DATABASE shop;",
                explanation: "Команда создаёт базу данных shop."
            },
            {
                title: "Создание таблиц",
                duration: "20 минут",
                intro: "CREATE TABLE",
                theory: "CREATE TABLE создаёт таблицу. Для каждого столбца задаются имя и тип данных.",
                example: "CREATE TABLE users (\n    id INT PRIMARY KEY,\n    name VARCHAR(100)\n);",
                question: "Напиши начало создания таблицы products.",
                hint: "Используй CREATE TABLE и круглые скобки.",
                answer: "CREATE TABLE products (",
                explanation: "Так начинается создание таблицы."
            },
            {
                title: "Первичный ключ",
                duration: "15 минут",
                intro: "PRIMARY KEY",
                theory: "Первичный ключ однозначно идентифицирует запись. Значения первичного ключа должны быть уникальными.",
                example: "CREATE TABLE users (\n    id INT PRIMARY KEY\n);",
                question: "Укажи ограничение первичного ключа для столбца id.",
                hint: "Используй PRIMARY KEY.",
                answer: "id INT PRIMARY KEY",
                explanation: "PRIMARY KEY задаёт первичный ключ."
            },
            {
                title: "Связи таблиц",
                duration: "20 минут",
                intro: "FOREIGN KEY",
                theory: "Внешний ключ связывает столбец одной таблицы с ключом другой таблицы.",
                example: "FOREIGN KEY (user_id) REFERENCES users(id)",
                question: "Напиши внешний ключ user_id, ссылающийся на users(id).",
                hint: "Используй REFERENCES.",
                answer: "FOREIGN KEY (user_id) REFERENCES users(id)",
                explanation: "Ограничение связывает таблицы."
            },
            {
                title: "Соединение таблиц",
                duration: "20 минут",
                intro: "JOIN",
                theory: "JOIN объединяет строки из нескольких таблиц по условию связи.",
                example: "SELECT users.name, orders.id\nFROM users\nJOIN orders ON users.id = orders.user_id;",
                question: "Напиши начало соединения users и orders через JOIN.",
                hint: "После JOIN укажи orders.",
                answer: "SELECT * FROM users JOIN orders",
                explanation: "JOIN объединяет данные двух таблиц."
            }
        ]),

    makeCourse("postgresql", "PostgreSQL", "🐘", "database", "Средний",
        "Освой проектирование и запросы PostgreSQL.", [
            {
                title: "Введение в PostgreSQL",
                duration: "15 минут",
                intro: "Возможности PostgreSQL",
                theory: "PostgreSQL — объектно-реляционная СУБД с поддержкой транзакций, индексов, расширенных типов и SQL.",
                example: "SELECT version();",
                question: "Напиши запрос получения текущей даты.",
                hint: "Используй CURRENT_DATE.",
                answer: "SELECT CURRENT_DATE;",
                explanation: "CURRENT_DATE возвращает текущую дату."
            },
            {
                title: "Типы данных",
                duration: "20 минут",
                intro: "Специализированные типы",
                theory: "PostgreSQL поддерживает INTEGER, TEXT, BOOLEAN, DATE, TIMESTAMP, NUMERIC, JSONB и другие типы.",
                example: "CREATE TABLE products (\n    id INTEGER,\n    price NUMERIC(10, 2),\n    active BOOLEAN\n);",
                question: "Укажи тип BOOLEAN для столбца active.",
                hint: "Используй имя столбца и тип.",
                answer: "active BOOLEAN",
                explanation: "BOOLEAN хранит логические значения."
            },
            {
                title: "JSONB",
                duration: "20 минут",
                intro: "Документные данные",
                theory: "JSONB хранит JSON в бинарном формате и поддерживает эффективную обработку и индексацию.",
                example: "SELECT '{\"name\":\"Alex\"}'::jsonb;",
                question: "Напиши приведение строки '{}' к типу jsonb.",
                hint: "Используй оператор ::.",
                answer: "'{}'::jsonb",
                explanation: "Оператор :: приводит значение к указанному типу."
            },
            {
                title: "Индексы",
                duration: "20 минут",
                intro: "Ускорение поиска",
                theory: "Индекс помогает СУБД быстрее находить строки, но требует места и дополнительных операций при изменении данных.",
                example: "CREATE INDEX idx_users_email ON users(email);",
                question: "Создай индекс idx_products_name для столбца name таблицы products.",
                hint: "Используй CREATE INDEX.",
                answer: "CREATE INDEX idx_products_name ON products(name);",
                explanation: "Команда создаёт индекс по столбцу name."
            },
            {
                title: "Транзакции",
                duration: "20 минут",
                intro: "BEGIN и COMMIT",
                theory: "Транзакция объединяет операции в логическую единицу. COMMIT фиксирует изменения, ROLLBACK отменяет.",
                example: "BEGIN;\nUPDATE accounts SET balance = 100;\nCOMMIT;",
                question: "Напиши команду начала транзакции.",
                hint: "Используй BEGIN.",
                answer: "BEGIN;",
                explanation: "BEGIN начинает транзакцию."
            }
        ]),

    makeCourse("mongodb", "MongoDB", "🍃", "database", "Начальный",
        "Познакомься с документными базами данных.", [
            {
                title: "Знакомство с MongoDB",
                duration: "15 минут",
                intro: "Документная база данных",
                theory: "MongoDB хранит документы в формате BSON. Документы объединяются в коллекции.",
                example: 'db.users.insertOne({ name: "Alex", age: 20 })',
                question: "Напиши команду выбора всех документов коллекции users.",
                hint: "Используй find().",
                answer: "db.users.find()",
                explanation: "find() возвращает документы коллекции."
            },
            {
                title: "Добавление документов",
                duration: "15 минут",
                intro: "insertOne",
                theory: "Метод insertOne добавляет один документ, insertMany — несколько документов.",
                example: 'db.users.insertOne({ name: "Alex" })',
                question: "Добавь документ { name: 'Sam' } в коллекцию users.",
                hint: "Используй insertOne.",
                answer: "db.users.insertOne({ name: 'Sam' })",
                explanation: "insertOne добавляет один документ."
            },
            {
                title: "Поиск документов",
                duration: "15 минут",
                intro: "Фильтры find",
                theory: "find принимает фильтр. Например, { age: 20 } выбирает документы с соответствующим возрастом.",
                example: "db.users.find({ age: 20 })",
                question: "Найди документы users, где city равен Moscow.",
                hint: "Передай объект с полем city.",
                answer: "db.users.find({ city: 'Moscow' })",
                explanation: "Фильтр выбирает документы по значению city."
            },
            {
                title: "Обновление",
                duration: "20 минут",
                intro: "updateOne",
                theory: "updateOne изменяет первый документ, подходящий под фильтр. Оператор $set задаёт новые значения полей.",
                example: "db.users.updateOne({ name: 'Alex' }, { $set: { age: 21 } })",
                question: "Обнови age до 25 у пользователя Sam.",
                hint: "Используй updateOne и $set.",
                answer: "db.users.updateOne({ name: 'Sam' }, { $set: { age: 25 } })",
                explanation: "$set меняет значение указанного поля."
            },
            {
                title: "Удаление",
                duration: "15 минут",
                intro: "deleteOne",
                theory: "deleteOne удаляет один документ по фильтру. deleteMany удаляет все документы, соответствующие фильтру.",
                example: "db.users.deleteOne({ name: 'Alex' })",
                question: "Напиши команду удаления одного документа с name равным Sam.",
                hint: "Используй deleteOne.",
                answer: "db.users.deleteOne({ name: 'Sam' })",
                explanation: "deleteOne удаляет один подходящий документ."
            }
        ]),

    makeCourse("react", "React", "⚛️", "framework", "Средний",
        "Создавай интерфейсы с помощью компонентов и хуков.", [
            {
                title: "Что такое React",
                duration: "15 минут",
                intro: "Компонентный подход",
                theory: "React — библиотека JavaScript для построения пользовательских интерфейсов. Интерфейс создаётся из компонентов.",
                example: "function App() {\n    return <h1>Hello, React!</h1>;\n}",
                question: "Напиши начало функционального компонента Header.",
                hint: "Используй function Header().",
                answer: "function Header() {",
                explanation: "Это объявление функционального компонента."
            },
            {
                title: "JSX",
                duration: "15 минут",
                intro: "Разметка внутри JavaScript",
                theory: "JSX позволяет описывать структуру интерфейса с помощью синтаксиса, похожего на HTML.",
                example: "const element = <h1>Hello</h1>;",
                question: "Создай JSX-элемент h1 с текстом Welcome.",
                hint: "Используй открывающий и закрывающий h1.",
                answer: "const element = <h1>Welcome</h1>;",
                explanation: "Переменная содержит JSX-элемент."
            },
            {
                title: "Props",
                duration: "20 минут",
                intro: "Передача данных",
                theory: "Props — входные данные компонента. Они передаются от родительского компонента дочернему.",
                example: "function Greeting({ name }) {\n    return <p>Hello, {name}</p>;\n}",
                question: "Напиши начало компонента Greeting, принимающего name через props.",
                hint: "Используй деструктуризацию параметра.",
                answer: "function Greeting({ name }) {",
                explanation: "Компонент получает свойство name."
            },
            {
                title: "Состояние useState",
                duration: "20 минут",
                intro: "Управление состоянием",
                theory: "Хук useState добавляет локальное состояние компоненту и возвращает значение и функцию обновления.",
                example: "const [count, setCount] = useState(0);",
                question: "Создай состояние count со стартовым значением 0.",
                hint: "Используй useState(0).",
                answer: "const [count, setCount] = useState(0);",
                explanation: "useState создаёт состояние и функцию его изменения."
            },
            {
                title: "Обработка событий",
                duration: "20 минут",
                intro: "События интерфейса",
                theory: "Обработчики событий позволяют реагировать на действия пользователя. В JSX используется camelCase, например onClick.",
                example: "<button onClick={() => alert('Hi')}>Click</button>",
                question: "Напиши JSX-кнопку с текстом Save и обработчиком onClick={handleSave}.",
                hint: "Передай функцию в фигурных скобках.",
                answer: "<button onClick={handleSave}>Save</button>",
                explanation: "Кнопка вызывает обработчик при нажатии."
            }
        ]),

    makeCourse("spring", "Spring Boot", "🌱", "framework", "Средний",
        "Создавай серверные приложения на Java.", [
            {
                title: "Знакомство со Spring Boot",
                duration: "20 минут",
                intro: "Быстрый запуск Java-приложений",
                theory: "Spring Boot упрощает создание Spring-приложений благодаря автоконфигурации и встроенным серверам.",
                example: "@SpringBootApplication\npublic class Application { }",
                question: "Напиши аннотацию запуска Spring Boot приложения.",
                hint: "Используй @SpringBootApplication.",
                answer: "@SpringBootApplication",
                explanation: "Аннотация включает основные возможности конфигурации приложения."
            },
            {
                title: "Контроллеры",
                duration: "20 минут",
                intro: "Обработка HTTP-запросов",
                theory: "@RestController используется для создания REST-контроллеров, возвращающих данные в теле ответа.",
                example: "@RestController\npublic class HelloController { }",
                question: "Напиши аннотацию REST-контроллера.",
                hint: "Начинается с @RestController.",
                answer: "@RestController",
                explanation: "Аннотация обозначает REST-контроллер."
            },
            {
                title: "Маршруты",
                duration: "20 минут",
                intro: "Mapping запросов",
                theory: "@GetMapping связывает метод с HTTP GET-запросом по указанному адресу.",
                example: '@GetMapping("/hello")\npublic String hello() {\n    return "Hello";\n}',
                question: "Напиши аннотацию GET-маршрута /users.",
                hint: "Используй @GetMapping.",
                answer: '@GetMapping("/users")',
                explanation: "Аннотация задаёт GET-маршрут."
            },
            {
                title: "Внедрение зависимостей",
                duration: "20 минут",
                intro: "Dependency Injection",
                theory: "Внедрение зависимостей позволяет объектам получать необходимые компоненты от контейнера Spring.",
                example: "@Service\npublic class UserService { }",
                question: "Напиши аннотацию для сервисного компонента.",
                hint: "Используй @Service.",
                answer: "@Service",
                explanation: "Аннотация регистрирует сервисный компонент."
            },
            {
                title: "Конфигурация",
                duration: "15 минут",
                intro: "application.properties",
                theory: "Настройки приложения можно хранить в application.properties или application.yml.",
                example: "server.port=8080",
                question: "Укажи порт сервера 8081 в properties.",
                hint: "Используй server.port.",
                answer: "server.port=8081",
                explanation: "Параметр задаёт порт встроенного сервера."
            }
        ]),

    makeCourse("django", "Django", "🎸", "framework", "Средний",
        "Разрабатывай веб-приложения на Python.", [
            {
                title: "Знакомство с Django",
                duration: "20 минут",
                intro: "Python web framework",
                theory: "Django — веб-фреймворк Python с ORM, маршрутизацией, шаблонами и административной панелью.",
                example: "python -m django --version",
                question: "Напиши команду создания проекта Django с именем config.",
                hint: "Используй django-admin startproject.",
                answer: "django-admin startproject config",
                explanation: "Команда создаёт структуру проекта."
            },
            {
                title: "URL-маршруты",
                duration: "20 минут",
                intro: "urls.py",
                theory: "Маршруты Django связывают адреса с представлениями через urlpatterns и path().",
                example: "path('home/', views.home, name='home')",
                question: "Напиши маршрут home/, связанный с views.home.",
                hint: "Используй path().",
                answer: "path('home/', views.home, name='home')",
                explanation: "path связывает адрес и функцию представления."
            },
            {
                title: "Представления",
                duration: "20 минут",
                intro: "Views",
                theory: "Представления обрабатывают запросы и возвращают HTTP-ответы. Они могут быть функциями или классами.",
                example: "from django.http import HttpResponse\n\ndef home(request):\n    return HttpResponse('Hello')",
                question: "Напиши заголовок функции home, принимающей request.",
                hint: "Используй def.",
                answer: "def home(request):",
                explanation: "Функция представления принимает объект запроса."
            },
            {
                title: "Модели",
                duration: "20 минут",
                intro: "ORM Django",
                theory: "Модели описывают структуру данных и обычно соответствуют таблицам базы данных.",
                example: "class Product(models.Model):\n    name = models.CharField(max_length=100)",
                question: "Напиши начало модели Product от models.Model.",
                hint: "Используй class.",
                answer: "class Product(models.Model):",
                explanation: "Класс модели наследуется от models.Model."
            },
            {
                title: "Миграции",
                duration: "15 минут",
                intro: "Управление схемой базы данных",
                theory: "Миграции фиксируют изменения моделей и применяют их к базе данных.",
                example: "python manage.py makemigrations\npython manage.py migrate",
                question: "Напиши команду применения миграций.",
                hint: "Используй manage.py migrate.",
                answer: "python manage.py migrate",
                explanation: "Команда применяет миграции."
            }
        ]),

    makeCourse("node", "Node.js", "🟢", "framework", "Средний",
        "Создавай серверные приложения на JavaScript.", [
            {
                title: "Знакомство с Node.js",
                duration: "15 минут",
                intro: "JavaScript вне браузера",
                theory: "Node.js — среда выполнения JavaScript на базе движка V8. Она позволяет создавать серверные приложения и инструменты.",
                example: 'console.log("Node.js");',
                question: "Напиши команду вывода Node.js в консоль.",
                hint: "Используй console.log.",
                answer: 'console.log("Node.js");',
                explanation: "Команда выводит строку в консоль."
            },
            {
                title: "Модули",
                duration: "20 минут",
                intro: "Разделение кода",
                theory: "Модули позволяют разделять приложение на файлы. В CommonJS используются require и module.exports.",
                example: "const fs = require('fs');",
                question: "Подключи модуль path через require.",
                hint: "Сохрани результат в переменную path.",
                answer: "const path = require('path');",
                explanation: "require подключает модуль."
            },
            {
                title: "Пакеты npm",
                duration: "15 минут",
                intro: "Менеджер пакетов",
                theory: "npm управляет зависимостями проекта и позволяет устанавливать библиотеки.",
                example: "npm install express",
                question: "Напиши команду установки пакета express.",
                hint: "Используй npm install.",
                answer: "npm install express",
                explanation: "Команда устанавливает пакет express."
            },
            {
                title: "HTTP-сервер",
                duration: "20 минут",
                intro: "Модуль http",
                theory: "Встроенный модуль http позволяет создавать HTTP-серверы без сторонних библиотек.",
                example: "const http = require('http');",
                question: "Напиши команду подключения встроенного модуля http.",
                hint: "Используй require('http').",
                answer: "const http = require('http');",
                explanation: "Модуль http предоставляет инструменты HTTP."
            },
            {
                title: "Express",
                duration: "20 минут",
                intro: "Веб-фреймворк",
                theory: "Express упрощает маршрутизацию и обработку HTTP-запросов в Node.js.",
                example: "const express = require('express');\nconst app = express();",
                question: "Создай переменную app, вызвав express().",
                hint: "Используй const app.",
                answer: "const app = express();",
                explanation: "Создаётся экземпляр приложения Express."
            }
        ]),

    makeCourse("docker", "Docker", "🐳", "tools", "Средний",
        "Изучи контейнеризацию приложений.", [
            {
                title: "Что такое Docker",
                duration: "15 минут",
                intro: "Контейнеризация",
                theory: "Docker упаковывает приложение и его зависимости в контейнер, обеспечивая более одинаковую среду запуска.",
                example: "docker --version",
                question: "Напиши команду проверки версии Docker.",
                hint: "Используй docker --version.",
                answer: "docker --version",
                explanation: "Команда выводит установленную версию."
            },
            {
                title: "Образы",
                duration: "20 минут",
                intro: "Docker images",
                theory: "Образ — шаблон, на основе которого создаются контейнеры. Образы можно загружать из реестров.",
                example: "docker pull nginx",
                question: "Напиши команду загрузки образа redis.",
                hint: "Используй docker pull.",
                answer: "docker pull redis",
                explanation: "Команда загружает образ redis."
            },
            {
                title: "Контейнеры",
                duration: "20 минут",
                intro: "Запуск контейнера",
                theory: "Контейнер — экземпляр образа с изолированной средой выполнения.",
                example: "docker run nginx",
                question: "Напиши команду запуска контейнера из образа ubuntu.",
                hint: "Используй docker run.",
                answer: "docker run ubuntu",
                explanation: "Команда запускает контейнер."
            },
            {
                title: "Dockerfile",
                duration: "20 минут",
                intro: "Сборка собственных образов",
                theory: "Dockerfile содержит инструкции сборки образа. FROM задаёт базовый образ.",
                example: "FROM python:3.12",
                question: "Укажи базовый образ node:20 через FROM.",
                hint: "Начни строку с FROM.",
                answer: "FROM node:20",
                explanation: "FROM задаёт базовый образ."
            },
            {
                title: "Docker Compose",
                duration: "20 минут",
                intro: "Несколько сервисов",
                theory: "Docker Compose описывает многоконтейнерное приложение в YAML-файле.",
                example: "services:\n  web:\n    image: nginx",
                question: "Напиши ключ верхнего уровня для описания сервисов Compose.",
                hint: "Это services.",
                answer: "services:",
                explanation: "Ключ services содержит описания сервисов."
            }
        ]),

    makeCourse("git", "Git", "🌿", "tools", "Начальный",
        "Научись управлять версиями своих проектов.", [
            {
                title: "Знакомство с Git",
                duration: "10 минут",
                intro: "Контроль версий",
                theory: "Git — распределённая система контроля версий. Она сохраняет историю изменений проекта.",
                example: "git --version",
                question: "Напиши команду проверки версии Git.",
                hint: "Используй git --version.",
                answer: "git --version",
                explanation: "Команда выводит версию Git."
            },
            {
                title: "Создание репозитория",
                duration: "10 минут",
                intro: "git init",
                theory: "Репозиторий хранит историю изменений. git init создаёт новый локальный репозиторий.",
                example: "git init",
                question: "Напиши команду инициализации репозитория.",
                hint: "Используй git init.",
                answer: "git init",
                explanation: "Команда создаёт репозиторий в текущей папке."
            },
            {
                title: "Добавление файлов",
                duration: "15 минут",
                intro: "git add",
                theory: "Команда git add добавляет изменения в индекс для следующего коммита.",
                example: "git add .",
                question: "Добавь файл main.py в индекс.",
                hint: "Используй git add и имя файла.",
                answer: "git add main.py",
                explanation: "Команда добавляет файл в индекс."
            },
            {
                title: "Коммиты",
                duration: "15 минут",
                intro: "Сохранение изменений",
                theory: "Коммит фиксирует подготовленные изменения в истории репозитория.",
                example: 'git commit -m "Initial commit"',
                question: "Создай коммит с сообщением Update.",
                hint: "Используй git commit -m.",
                answer: 'git commit -m "Update"',
                explanation: "Команда создаёт коммит с указанным сообщением."
            },
            {
                title: "Удалённый репозиторий",
                duration: "20 минут",
                intro: "Отправка изменений",
                theory: "Удалённый репозиторий позволяет обмениваться изменениями. git push отправляет коммиты на удалённый сервер.",
                example: "git push origin main",
                question: "Напиши команду отправки ветки main в origin.",
                hint: "Используй git push.",
                answer: "git push origin main",
                explanation: "Команда отправляет ветку main в origin."
            }
        ])
];
