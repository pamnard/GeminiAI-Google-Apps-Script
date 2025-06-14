# GeminiAI для Google Apps Script

Полнофункциональный класс для работы с Google AI (Gemini) в Google Apps Script. Поддерживает все основные возможности: генерацию текста, изображений, видео, речи, структурированный вывод, вызов функций и выполнение кода.

## 🚀 Возможности

- **Генерация текста** - Создание текста с помощью различных моделей Gemini
- **Чат** - Ведение диалогов с историей сообщений
- **Анализ изображений** - Обработка и анализ изображений
- **Генерация изображений** - Создание изображений с помощью Gemini 2.0 и Imagen
- **Генерация видео** - Создание видео с помощью Veo 2.0
- **Синтез речи** - Преобразование текста в речь с 30 различными голосами
- **Структурированный вывод** - Получение данных в формате JSON по схемам
- **Function Calling** - Вызов внешних функций моделью
- **Code Execution** - Выполнение Python кода для анализа данных
- **Интеграция с Google Drive** - Сохранение результатов в облако

## 📦 Установка

1. Откройте Google Apps Script (script.google.com)
2. Создайте новый проект
3. Скопируйте код из `gemini.js` в редактор
4. Получите API ключ в Google AI Studio
5. Добавьте ключ в Properties Service:
   ```javascript
   PropertiesService.getScriptProperties().setProperty(
       "GEMINI_API_KEY",
       "ваш_api_ключ"
   );
   ```

## 🔧 Базовое использование

```javascript
const apiKey = PropertiesService.getScriptProperties().getProperty("GEMINI_API_KEY");
const gemini = new GeminiAI(apiKey);

// Простая генерация текста
const result = gemini.generateText("Привет! Как дела?");
console.log(result);
```

## 📚 Документация методов

### Генерация текста

#### `generateText(prompt, options, model)`

Генерирует текст на основе промпта.

**Параметры:**

- `prompt` (string) - Текст запроса
- `options` (object, optional) - Настройки генерации
  - `temperature` (number) - Креативность (0-2)
  - `maxTokens` (number) - Максимум токенов
  - `topP` (number) - Nucleus sampling
  - `topK` (number) - Top-K sampling
- `model` (string, optional) - Модель для использования

**Пример:**

```javascript
// Базовая генерация
const result = gemini.generateText("Напиши короткий рассказ");

// С настройками
const creative = gemini.generateText(
    "Напиши стихотворение",
    {
        temperature: 0.9,
        maxTokens: 500,
    },
    "gemini-1.5-pro"
);
```

### Чат и диалоги

#### `chat(messages, options, model)`

Ведет диалог с историей сообщений.

**Параметры:**

- `messages` (array) - Массив сообщений с ролями
- `options` (object, optional) - Настройки генерации
- `model` (string, optional) - Модель для использования

**Пример:**

```javascript
const messages = [
    { role: "user", text: "Как тебя зовут?" },
    { role: "model", text: "Меня зовут Gemini!" },
    { role: "user", text: "Расскажи анекдот" },
];

const response = gemini.chat(messages);
```

### Работа с изображениями

#### `analyzeImage(imageBlob, prompt, options, model)`

Анализирует изображение и отвечает на вопросы о нем.

**Параметры:**

- `imageBlob` (Blob) - Изображение для анализа
- `prompt` (string) - Вопрос об изображении
- `options` (object, optional) - Настройки
- `model` (string, optional) - Модель (по умолчанию vision)

**Пример:**

```javascript
const fileId = "YOUR_FILE_ID";
const imageBlob = DriveApp.getFileById(fileId).getBlob();

const analysis = gemini.analyzeImage(imageBlob, "Опиши что на изображении");
```

#### `generateImage(prompt, options, model)`

Генерирует изображения из текстового описания.

**Параметры:**

- `prompt` (string) - Описание изображения
- `options` (object, optional) - Настройки генерации
- `model` (string, optional) - Модель (gemini-2.0-flash-preview-image-generation или imagen-3.0-generate-002)

**Пример:**

```javascript
const result = gemini.generateImage("Кот в космосе среди звезд", {
    temperature: 0.8,
});

// Сохранение в Drive
if (result.images.length > 0) {
    const fileId = gemini.saveImageToDrive(
        result.images[0].data,
        "space_cat.png"
    );
}
```

#### `editImage(imageBlob, prompt, options, model)`

Редактирует существующее изображение.

**Пример:**

```javascript
const editResult = gemini.editImage(imageBlob, "Добавь солнечный закат на фон");
```

### Генерация видео

#### `generateVideo(prompt, options)`

Создает видео из текстового описания (требует платный аккаунт).

**Параметры:**

- `prompt` (string) - Описание видео
- `options` (object, optional) - Настройки
  - `aspectRatio` (string) - Соотношение сторон ('16:9', '9:16')
  - `personGeneration` (string) - Генерация людей ('allow', 'dont_allow')

**Пример:**

```javascript
const operationId = gemini.generateVideo("Кот играет с мячиком на траве", {
    aspectRatio: "16:9",
});

// Ожидание завершения
const result = gemini.waitForVideoGeneration(operationId);
```

#### `generateVideoFromImage(imageData, prompt, options)`

Создает видео из изображения.

#### `generateAndSaveVideo(prompt, filename, options)`

Полный цикл: генерация → ожидание → сохранение в Drive.

**Пример:**

```javascript
const fileId = gemini.generateAndSaveVideo(
    "Дракон летит над замком",
    "dragon_video.mp4",
    { aspectRatio: "16:9" }
);
```

### Синтез речи

#### `generateSpeech(text, voiceName, options)`

Преобразует текст в речь.

**Параметры:**

- `text` (string) - Текст для озвучивания
- `voiceName` (string, optional) - Имя голоса (по умолчанию 'Kore')
- `options` (object, optional) - Настройки аудио

**Пример:**

```javascript
const audioData = gemini.generateSpeech("Привет! Как дела?", "Kore");

const fileId = gemini.saveAudioToDrive(audioData, "greeting.wav");
```

#### `generateMultiSpeakerSpeech(transcript, speakers, options)`

Создает многоголосое аудио из транскрипта.

**Параметры:**

- `transcript` (string) - Текст с указанием говорящих
- `speakers` (array) - Массив объектов {speaker, voiceName}

**Пример:**

```javascript
const transcript = `
    Анна: Привет, как дела?
    Петр: Отлично! А у тебя?
`;

const speakers = [
    { speaker: "Анна", voiceName: "Leda" },
    { speaker: "Петр", voiceName: "Puck" },
];

const audioData = gemini.generateMultiSpeakerSpeech(transcript, speakers);
```

#### `getAvailableVoices()`

Возвращает список всех доступных голосов.

**Доступные голоса:**

- **Bright**: Zephyr, Callisto, Dione, Ganymede, Europa
- **Excitable**: Fenrir, Aoede, Charon
- **Informative**: Charon, Aoede, Fenrir
- **Mature**: Gacrux, Mimosa, Antares
- **Soft**: Achernar, Spica, Altair
- **Твердый**: Kore, Izar, Vega
- **Молодежный**: Leda, Lyra, Porrima
- **Бодрый**: Puck, Proxima, Sirius
- **Дружелюбный**: Achird, Capella, Rigel
- **Знающий**: Sadaltager, Bellatrix, Polaris

### Структурированный вывод

#### `generateStructured(prompt, schema, options, model)`

Генерирует ответ в структурированном JSON формате.

**Пример:**

```javascript
// Создание схемы
const productSchema = gemini.createSchema("ARRAY", {
    items: gemini.createSchema("OBJECT", {
        properties: {
            name: gemini.createSchema("STRING"),
            price: gemini.createSchema("NUMBER"),
            category: gemini.createSchema("STRING", {
                enum: ["ELECTRONICS", "CLOTHING", "BOOKS"],
            }),
        },
        required: ["name", "price"],
    }),
});

// Генерация структурированных данных
const products = gemini.generateStructured(
    "Создай список из 3 товаров",
    productSchema
);
```

#### `createSchema(type, properties)`

Создает JSON схему для структурированного вывода.

#### `schemaFromExample(example)`

Автоматически создает схему из примера объекта.

### Function Calling

#### `generateWithFunctions(prompt, functionDeclarations, options, model)`

Генерирует ответ с возможностью вызова функций.

**Пример:**

```javascript
// Объявление функции
const weatherFunction = gemini.createFunctionDeclaration(
    "get_weather",
    "Получает погоду для города",
    {
        properties: {
            city: { type: "string", description: "Название города" },
        },
        required: ["city"],
    }
);

// Использование
const response = gemini.generateWithFunctions("Какая погода в Москве?", [
    weatherFunction,
]);

if (response.functionCall) {
    console.log("Вызов функции:", response.functionCall.name);
    console.log("Аргументы:", response.functionCall.args);
}
```

#### `executeWithFunctions(prompt, functionDeclarations, implementations, options, model)`

Полный цикл: генерация → вызов функций → финальный ответ.

### Code Execution

#### `generateWithCodeExecution(prompt, options, model)`

Генерирует ответ с выполнением Python кода.

**Пример:**

```javascript
const response = gemini.generateWithCodeExecution(
    "Найди сумму первых 10 простых чисел"
);

console.log("Объяснение:", response.text);
console.log("Код:", response.executableCode[0].code);
console.log("Результат:", response.codeExecutionResults[0].output);
```

#### `solveMathProblem(problem, options, model)`

Специализированный метод для решения математических задач.

#### `analyzeData(data, task, options, model)`

Анализирует данные и создает визуализации.

#### `createVisualization(data, chartType, options, model)`

Создает графики и диаграммы.

#### `processFile(fileDescription, task, options, model)`

Генерирует код для обработки различных типов файлов.

### Утилиты

#### `countTokens(content, model)`

Подсчитывает количество токенов в тексте.

#### `getModelInfo(modelName)`

Получает информацию о конкретной модели.

#### `listModels()`

Возвращает список всех доступных моделей.

#### `saveImageToDrive(imageData, filename)`

Сохраняет изображение в Google Drive.

#### `saveVideoToDrive(videoBlob, filename)`

Сохраняет видео в Google Drive.

#### `saveAudioToDrive(audioData, filename)`

Сохраняет аудио в Google Drive.

## 🎯 Примеры использования

### Создание контент-пайплайна

```javascript
function createContentPipeline() {
    const gemini = new GeminiAI(apiKey);

    // 1. Генерируем статью
    const article = gemini.generateText(
        "Напиши статью о важности кибербезопасности",
        { temperature: 0.7 },
        "gemini-1.5-pro"
    );

    // 2. Создаем пост для соцсетей
    const socialPost = gemini.generateText(
        "Сделай короткий пост для соцсетей: " + article,
        { maxTokens: 100 }
    );

    // 3. Генерируем изображение
    const imageResult = gemini.generateImage(
        "Иллюстрация к статье о кибербезопасности"
    );

    // 4. Создаем аудиоверсию
    const audioData = gemini.generateSpeech(article, "Charon");

    return {
        article,
        socialPost,
        imageId: gemini.saveImageToDrive(imageResult.images[0].data, "article.png"),
        audioId: gemini.saveAudioToDrive(audioData, "article.wav"),
    };
}
```

### Анализ данных с визуализацией

```javascript
function analyzeBusinessData() {
    const gemini = new GeminiAI(apiKey);

    const salesData = "Продажи: Янв-1000, Фев-1200, Мар-900, Апр-1500";

    const analysis = gemini.analyzeData(
        salesData,
        "Найди тренды, создай график и дай рекомендации"
    );

    console.log("Анализ:", analysis.text);

    // Сохраняем графики
    analysis.images.forEach((image, index) => {
        const blob = Utilities.newBlob(
            Utilities.base64Decode(image.data),
            image.mimeType
        );
        DriveApp.createFile(blob.setName(`chart_${index}.png`));
    });
}
```

### Автоматизация с Function Calling

```javascript
function automateWorkflow() {
    const gemini = new GeminiAI(apiKey);

    // Объявляем функции
    const functions = [
        gemini.createFunctionDeclaration("send_email", "Отправляет email", {
            properties: {
                to: { type: "string" },
                subject: { type: "string" },
                body: { type: "string" },
            },
        }),
        gemini.createFunctionDeclaration(
            "create_calendar_event",
            "Создает событие",
            {
                properties: {
                    title: { type: "string" },
                    date: { type: "string" },
                    time: { type: "string" },
                },
            }
        ),
    ];

    // Реализации функций
    const implementations = {
        send_email: (args) => {
            GmailApp.sendEmail(args.to, args.subject, args.body);
            return { success: true };
        },
        create_calendar_event: (args) => {
            const event = CalendarApp.getDefaultCalendar().createEvent(
                args.title,
                new Date(args.date + " " + args.time),
                new Date(args.date + " " + args.time)
            );
            return { success: true, eventId: event.getId() };
        },
    };

    // Автоматическое выполнение
    const result = gemini.executeWithFunctions(
        "Отправь письмо команде о встрече завтра в 14:00 и создай событие в календаре",
        functions,
        implementations
    );

    return result;
}
```

## 🔍 Доступные модели

### Текстовые модели

- `gemini-1.5-flash` - Быстрая модель для простых задач
- `gemini-1.5-pro` - Мощная модель для сложных задач
- `gemini-1.5-pro-vision` - Модель с поддержкой изображений

### Генерация изображений

- `gemini-2.0-flash-preview-image-generation` - Gemini 2.0 для изображений
- `imagen-3.0-generate-002` - Imagen 3.0 (платная)

### Генерация видео

- `veo-2.0-flash-preview` - Veo 2.0 для видео (платная)

## ⚠️ Ограничения

- **Генерация изображений**: Imagen требует платный аккаунт
- **Генерация видео**: Veo требует платный аккаунт
- **Code Execution**: Доступно не во всех регионах
- **Rate Limits**: Соблюдайте лимиты API
- **Размер файлов**: Ограничения на размер загружаемых изображений

## 🛠️ Обработка ошибок

```javascript
try {
    const result = gemini.generateText("Тест");
    console.log(result);
} catch (error) {
    if (error.message.includes("quota")) {
        console.log("Превышен лимит запросов");
    } else if (error.message.includes("safety")) {
        console.log("Контент заблокирован фильтрами безопасности");
    } else {
        console.log("Ошибка:", error.message);
    }
}
```

## 📝 Лицензия

MIT License

## 🤝 Вклад в проект

Приветствуются pull requests и issues! Для крупных изменений сначала создайте issue для обсуждения.

## 📞 Поддержка

- Создайте issue в GitHub для багов и предложений
- Проверьте документацию Google AI для актуальной информации об API
- Убедитесь, что у вас есть действующий API ключ

---

**Примечание**: Этот класс предназначен для использования в Google Apps Script. Для других платформ потребуются модификации для работы с HTTP запросами и файловой системой.
