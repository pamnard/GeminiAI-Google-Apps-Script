/**
 * Примеры использования класса GeminiAI
 */

/**
 * Пример базовой генерации текста
 * Демонстрирует простую генерацию текста с дефолтными и кастомными настройками
 */
function basicTextGeneration() {
    const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
    const gemini = new GeminiAI(apiKey);

    // Простая генерация текста с дефолтной моделью
    const result = gemini.generateText('Привет! Как дела?');
    console.log('Ответ:', result);

    // Генерация с настройками
    const result2 = gemini.generateText('Напиши короткий рассказ', {
        temperature: 0.9,
        maxTokens: 500
    });
    console.log('Рассказ:', result2);
}

/**
 * Пример использования разных моделей
 * Показывает как использовать быстрые и мощные модели для разных задач
 */
function multiModelGeneration() {
    const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
    const gemini = new GeminiAI(apiKey, 'gemini-1.5-flash'); // дефолтная модель

    // Используем дефолтную модель (flash)
    const fastResult = gemini.generateText('Быстрый ответ на простой вопрос');

    // Используем более мощную модель для сложной задачи
    const smartResult = gemini.generateText(
        'Объясни квантовую механику простыми словами',
        { temperature: 0.3 },
        'gemini-1.5-pro'
    );

    console.log('Быстрый ответ:', fastResult);
    console.log('Умный ответ:', smartResult);
}

/**
 * Пример ведения диалога
 * Демонстрирует как создавать чат-бота с историей сообщений
 */
function chatExample() {
    const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
    const gemini = new GeminiAI(apiKey);

    const messages = [
        { role: 'user', text: 'Как тебя зовут?' },
        { role: 'model', text: 'Меня зовут Gemini!' },
        { role: 'user', text: 'Расскажи анекдот про программистов' }
    ];

    // Чат с дефолтной моделью
    const chatResult = gemini.chat(messages);
    console.log('Анекдот:', chatResult);

    // Чат с более креативной моделью
    const creativeResult = gemini.chat(messages, {
        temperature: 1.0
    }, 'gemini-1.5-pro');
    console.log('Креативный анекдот:', creativeResult);
}

/**
 * Пример анализа изображений
 * Показывает как анализировать изображения из Google Drive с помощью vision моделей
 */
function imageAnalysisExample() {
    const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
    const gemini = new GeminiAI(apiKey);

    // Анализ изображения из Google Drive
    const fileId = 'YOUR_FILE_ID';
    const imageBlob = DriveApp.getFileById(fileId).getBlob();

    const analysis = gemini.analyzeImage(
        imageBlob,
        'Опиши что на изображении подробно'
    );
    console.log('Анализ изображения:', analysis);

    // Анализ с помощью vision модели
    const detailedAnalysis = gemini.analyzeImage(
        imageBlob,
        'Найди всех людей на фото и опиши их одежду',
        {},
        'gemini-1.5-pro-vision'
    );
    console.log('Детальный анализ:', detailedAnalysis);
}

/**
 * Пример подсчета токенов
 * Демонстрирует как считать токены для разных моделей и типов контента
 */
function tokenCountingExample() {
    const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
    const gemini = new GeminiAI(apiKey);

    const longText = 'Это очень длинный текст для анализа токенов...';

    // Подсчет токенов для разных моделей
    const tokensFlash = gemini.countTokens(longText, 'gemini-1.5-flash');
    const tokensPro = gemini.countTokens(longText, 'gemini-1.5-pro');

    console.log('Токенов в flash:', tokensFlash);
    console.log('Токенов в pro:', tokensPro);

    // Подсчет токенов для чата
    const chatMessages = [
        { role: 'user', text: 'Привет!' },
        { role: 'model', text: 'Привет! Как дела?' }
    ];
    const chatTokens = gemini.countTokens(chatMessages);
    console.log('Токенов в чате:', chatTokens);
}

/**
 * Пример получения информации о моделях
 * Показывает как получить информацию о конкретной модели и список всех доступных моделей
 */
function modelInfoExample() {
    const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
    const gemini = new GeminiAI(apiKey);

    // Информация о конкретной модели
    const modelInfo = gemini.getModelInfo('gemini-1.5-flash');
    console.log('Информация о модели:', modelInfo);

    // Список всех доступных моделей
    const allModels = gemini.listModels();
    console.log('Доступные модели:');
    allModels.forEach(model => {
        console.log(`- ${model.name}: ${model.displayName}`);
    });
}

/**
 * Практический пример создания контента
 * Демонстрирует пайплайн создания контента: блог-пост → пост для соцсетей → хештеги
 */
function practicalExample() {
    const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
    const gemini = new GeminiAI(apiKey);

    // Создание контента для разных целей
    const blogPost = gemini.generateText(
        'Напиши пост в блог о важности кибербезопасности',
        { temperature: 0.7, maxTokens: 800 },
        'gemini-1.5-pro'
    );

    const socialMedia = gemini.generateText(
        'Сделай короткий пост для соцсетей на основе этого: ' + blogPost,
        { temperature: 0.8, maxTokens: 100 },
        'gemini-1.5-flash'
    );

    const hashtags = gemini.generateText(
        'Предложи 5 хештегов для этого поста: ' + socialMedia,
        { temperature: 0.5 },
        'gemini-1.5-flash'
    );

    console.log('Блог пост:', blogPost);
    console.log('Соцсети:', socialMedia);
    console.log('Хештеги:', hashtags);
}

/**
 * Пример пакетной обработки
 * Показывает как обрабатывать массив вопросов разными моделями для сравнения результатов
 */
function batchProcessingExample() {
    const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
    const gemini = new GeminiAI(apiKey);

    const questions = [
        'Что такое JavaScript?',
        'Что такое Python?',
        'Что такое машинное обучение?'
    ];

    // Обработка разными моделями для сравнения
    const results = [];

    questions.forEach(question => {
        const flashAnswer = gemini.generateText(question, {}, 'gemini-1.5-flash');
        const proAnswer = gemini.generateText(question, {}, 'gemini-1.5-pro');

        results.push({
            question: question,
            flash: flashAnswer,
            pro: proAnswer
        });
    });

    console.log('Результаты сравнения:', results);
}

/**
 * Пример генерации изображений
 * Демонстрирует создание изображений с помощью Gemini и Imagen
 */
function imageGenerationExample() {
    const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
    const gemini = new GeminiAI(apiKey);

    // Генерация с помощью Gemini 2.0
    const geminiResult = gemini.generateImage(
        'Создай изображение летающей свиньи с крыльями и цилиндром над футуристическим городом с зеленью',
        { temperature: 0.8 },
        'gemini-2.0-flash-preview-image-generation'
    );

    console.log('Gemini ответ:', geminiResult.text);
    console.log('Gemini изображений:', geminiResult.images.length);

    // Сохраняем первое изображение в Drive
    if (geminiResult.images.length > 0) {
        const fileId = gemini.saveImageToDrive(
            geminiResult.images[0].data,
            'gemini_generated_image.png'
        );
        console.log('Изображение сохранено в Drive:', fileId);
    }

    // Генерация с помощью Imagen (только для платных аккаунтов)
    try {
        const imagenResult = gemini.generateImage(
            'Портрет женщины в стиле film noir, 35mm',
            { temperature: 0.7 },
            'imagen-3.0-generate-002'
        );

        console.log('Imagen ответ:', imagenResult.text);
        console.log('Imagen изображений:', imagenResult.images.length);

        if (imagenResult.images.length > 0) {
            const fileId = gemini.saveImageToDrive(
                imagenResult.images[0].data,
                'imagen_generated_portrait.png'
            );
            console.log('Imagen изображение сохранено в Drive:', fileId);
        }
    } catch (error) {
        console.log('Imagen недоступен (нужен платный аккаунт):', error.message);
    }
}

/**
 * Пример редактирования изображений
 * Показывает как изменять существующие изображения
 */
function imageEditingExample() {
    const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
    const gemini = new GeminiAI(apiKey);

    // Загружаем изображение из Drive
    const fileId = 'YOUR_IMAGE_FILE_ID'; // Замените на реальный ID
    try {
        const imageBlob = DriveApp.getFileById(fileId).getBlob();

        const editResult = gemini.editImage(
            imageBlob,
            'Добавь солнечный закат на фон этого изображения',
            { temperature: 0.7 }
        );

        console.log('Редактирование:', editResult.text);
        console.log('Отредактированных изображений:', editResult.images.length);

        if (editResult.images.length > 0) {
            const newFileId = gemini.saveImageToDrive(
                editResult.images[0].data,
                'edited_image.png'
            );
            console.log('Отредактированное изображение сохранено:', newFileId);
        }
    } catch (error) {
        console.log('Ошибка редактирования изображения:', error.message);
    }
}

/**
 * Пример пакетной генерации изображений
 * Создает несколько изображений по разным запросам
 */
function batchImageGenerationExample() {
    const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
    const gemini = new GeminiAI(apiKey);

    const prompts = [
        'Кот в космосе среди звезд',
        'Дракон летит над замком',
        'Роботы играют в футбол',
        'Подводный город с рыбами'
    ];

    const results = [];

    prompts.forEach((prompt, index) => {
        try {
            const result = gemini.generateImage(prompt, { temperature: 0.8 });

            console.log(`Изображение ${index + 1}: ${result.text}`);

            if (result.images.length > 0) {
                const fileId = gemini.saveImageToDrive(
                    result.images[0].data,
                    `batch_image_${index + 1}.png`
                );

                results.push({
                    prompt: prompt,
                    text: result.text,
                    fileId: fileId
                });
            }
        } catch (error) {
            console.log(`Ошибка для промпта "${prompt}":`, error.message);
        }
    });

    console.log('Результаты пакетной генерации:', results);
}

/**
 * Пример генерации видео с помощью Veo (платная функция)
 * Демонстрирует создание видео из текстового описания
 */
function videoGenerationExample() {
    const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
    const gemini = new GeminiAI(apiKey);

    try {
        // Простая генерация видео
        const fileId = gemini.generateAndSaveVideo(
            'Панорамный широкий кадр котенка калико, спящего на солнце',
            'kitten_sleeping.mp4',
            {
                aspectRatio: '16:9',
                personGeneration: 'dont_allow'
            }
        );

        console.log('Видео сохранено в Drive:', fileId);

        // Генерация портретного видео
        const portraitFileId = gemini.generateAndSaveVideo(
            'Создай видео с плавным движением величественного гавайского водопада в пышном тропическом лесу',
            'waterfall_portrait.mp4',
            {
                aspectRatio: '9:16',
                personGeneration: 'dont_allow'
            }
        );

        console.log('Портретное видео сохранено:', portraitFileId);

    } catch (error) {
        console.log('Ошибка генерации видео (нужен платный аккаунт):', error.message);
    }
}

/**
 * Пример генерации видео из изображения
 * Показывает как оживить статичное изображение
 */
function videoFromImageExample() {
    const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
    const gemini = new GeminiAI(apiKey);

    try {
        // Сначала генерируем изображение
        const imageResult = gemini.generateImage(
            'Кролик с шоколадным батончиком на поляне',
            { temperature: 0.7 }
        );

        if (imageResult.images.length > 0) {
            console.log('Изображение создано, генерируем видео...');

            // Создаем видео из изображения
            const operationId = gemini.generateVideoFromImage(
                imageResult.images[0].data,
                'Кролик убегает в лес',
                {
                    aspectRatio: '16:9',
                    personGeneration: 'dont_allow',
                    inputMimeType: 'image/png'
                }
            );

            console.log('Запущена генерация видео, ID операции:', operationId);

            // Ждем завершения
            const result = gemini.waitForVideoGeneration(operationId, 300, 20);

            if (result.generatedVideos && result.generatedVideos.length > 0) {
                const videoBlob = gemini.downloadVideo(result.generatedVideos[0].video.uri);
                const fileId = gemini.saveVideoToDrive(videoBlob, 'bunny_running.mp4');

                console.log('Видео из изображения сохранено:', fileId);
            }
        }

    } catch (error) {
        console.log('Ошибка создания видео из изображения:', error.message);
    }
}

/**
 * Пример ручного управления операциями видео
 * Показывает как контролировать процесс генерации поэтапно
 */
function manualVideoOperationExample() {
    const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
    const gemini = new GeminiAI(apiKey);

    try {
        // Запускаем генерацию
        console.log('Запуск генерации видео...');
        const operationId = gemini.generateVideo(
            'Дрон снимает мужчину за рулем красного кабриолета в Палм-Спрингс, 1970е, теплый солнечный свет'
        );

        console.log('ID операции:', operationId);

        // Проверяем статус несколько раз
        let attempts = 0;
        while (attempts < 10) {
            const status = gemini.checkVideoOperation(operationId);

            console.log(`Попытка ${attempts + 1}: готово = ${status.done}`);

            if (status.done) {
                if (status.error) {
                    console.log('Ошибка генерации:', status.error);
                    break;
                } else {
                    console.log('Генерация завершена!');

                    // Скачиваем и сохраняем
                    const videoUri = status.response.generatedVideos[0].video.uri;
                    const videoBlob = gemini.downloadVideo(videoUri);
                    const fileId = gemini.saveVideoToDrive(videoBlob, 'palm_springs_drive.mp4');

                    console.log('Видео сохранено:', fileId);
                    break;
                }
            }

            attempts++;
            Utilities.sleep(20000); // Ждем 20 секунд
        }

    } catch (error) {
        console.log('Ошибка ручного управления операцией:', error.message);
    }
}

/**
 * Пример пакетной генерации видео
 * Создает несколько видео с разными настройками
 */
function batchVideoGenerationExample() {
    const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
    const gemini = new GeminiAI(apiKey);

    const videoPrompts = [
        {
            prompt: 'Кот в космическом шлеме летит среди звезд',
            filename: 'space_cat.mp4',
            options: { aspectRatio: '16:9' }
        },
        {
            prompt: 'Дракон летит над средневековым замком на закате',
            filename: 'dragon_castle.mp4',
            options: { aspectRatio: '16:9' }
        },
        {
            prompt: 'Роботы играют в футбол на футуристическом стадионе',
            filename: 'robot_football.mp4',
            options: { aspectRatio: '9:16' }
        }
    ];

    const results = [];

    videoPrompts.forEach((item, index) => {
        try {
            console.log(`Генерация видео ${index + 1}/${videoPrompts.length}: ${item.prompt}`);

            const fileId = gemini.generateAndSaveVideo(
                item.prompt,
                item.filename,
                item.options
            );

            results.push({
                prompt: item.prompt,
                filename: item.filename,
                fileId: fileId,
                success: true
            });

            console.log(`Видео ${index + 1} готово: ${fileId}`);

        } catch (error) {
            console.log(`Ошибка для видео ${index + 1}:`, error.message);
            results.push({
                prompt: item.prompt,
                filename: item.filename,
                error: error.message,
                success: false
            });
        }
    });

    console.log('Результаты пакетной генерации видео:', results);
}

/**
 * Пример генерации речи (text-to-speech)
 * Демонстрирует озвучивание текста разными голосами
 */
function speechGenerationExample() {
    const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
    const gemini = new GeminiAI(apiKey);

    try {
        // Простая генерация речи
        const fileId1 = gemini.generateAndSaveSpeech(
            'Скажи радостно: Желаю тебе прекрасного дня!',
            'cheerful_greeting.wav',
            'Kore'
        );

        console.log('Радостное приветствие сохранено:', fileId1);

        // Генерация с другим голосом и стилем
        const fileId2 = gemini.generateAndSaveSpeech(
            'Добро пожаловать в мир искусственного интеллекта. Давайте исследовать удивительные возможности современных технологий.',
            'ai_introduction.wav',
            'Charon' // Информативный стиль
        );

        console.log('Введение в ИИ сохранено:', fileId2);

        // Генерация с мягким голосом
        const fileId3 = gemini.generateAndSaveSpeech(
            'Расслабься и наслаждайся моментом. Все будет хорошо.',
            'relaxing_message.wav',
            'Achernar' // Мягкий стиль
        );

        console.log('Расслабляющее сообщение сохранено:', fileId3);

    } catch (error) {
        console.log('Ошибка генерации речи:', error.message);
    }
}

/**
 * Пример многоголосой генерации речи
 * Создает диалог между несколькими персонажами
 */
function multiSpeakerSpeechExample() {
    const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
    const gemini = new GeminiAI(apiKey);

    try {
        // Сначала генерируем транскрипт диалога
        const transcript = gemini.generateText(`
            Создай короткий диалог примерно на 100 слов между двумя энтузиастами программирования.
            Доктор Анна: эксперт по машинному обучению
            Максим: разработчик веб-приложений
            Пусть они обсуждают будущее ИИ в веб-разработке.
            Формат: 
            Доктор Анна: текст
            Максим: текст
        `);

        console.log('Сгенерированный транскрипт:', transcript);

        // Создаем многоголосое аудио
        const speakers = [
            { speaker: 'Доктор Анна', voiceName: 'Leda' }, // Молодежный стиль
            { speaker: 'Максим', voiceName: 'Puck' }      // Бодрый стиль
        ];

        const audioData = gemini.generateMultiSpeakerSpeech(transcript, speakers);
        const fileId = gemini.saveAudioToDrive(audioData, 'ai_development_dialog.wav');

        console.log('Диалог о разработке ИИ сохранен:', fileId);

        // Пример подкаста про технологии
        const podcastTranscript = `
            Ведущий: Добро пожаловать в подкаст "Технологии будущего"! С вами Алексей.
            Гость: Привет, меня зовут Мария, я исследователь в области ИИ.
            Ведущий: Мария, расскажите нам о последних достижениях в области нейросетей.
            Гость: С удовольствием! Современные модели становятся все более мультимодальными...
        `;

        const podcastSpeakers = [
            { speaker: 'Ведущий', voiceName: 'Achird' },    // Дружелюбный
            { speaker: 'Гость', voiceName: 'Sadaltager' }   // Знающий
        ];

        const podcastAudio = gemini.generateMultiSpeakerSpeech(podcastTranscript, podcastSpeakers);
        const podcastFileId = gemini.saveAudioToDrive(podcastAudio, 'tech_podcast_excerpt.wav');

        console.log('Отрывок подкаста сохранен:', podcastFileId);

    } catch (error) {
        console.log('Ошибка многоголосой генерации:', error.message);
    }
}

/**
 * Пример демонстрации разных голосов
 * Показывает различные стили речи для одного текста
 */
function voiceStylesExample() {
    const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
    const gemini = new GeminiAI(apiKey);

    const text = 'Искусственный интеллект меняет наш мир каждый день.';

    const voices = [
        { name: 'Zephyr', style: 'Bright' },
        { name: 'Fenrir', style: 'Excitable' },
        { name: 'Charon', style: 'Informative' },
        { name: 'Achernar', style: 'Soft' },
        { name: 'Gacrux', style: 'Mature' }
    ];

    const results = [];

    voices.forEach((voice, index) => {
        try {
            console.log(`Генерация голосом ${voice.name} (${voice.style})...`);

            const audioData = gemini.generateSpeech(text, voice.name);
            const fileId = gemini.saveAudioToDrive(
                audioData,
                `ai_statement_${voice.name.toLowerCase()}.wav`
            );

            results.push({
                voice: voice.name,
                style: voice.style,
                fileId: fileId,
                success: true
            });

            console.log(`Голос ${voice.name} сохранен: ${fileId}`);

        } catch (error) {
            console.log(`Ошибка для голоса ${voice.name}:`, error.message);
            results.push({
                voice: voice.name,
                style: voice.style,
                error: error.message,
                success: false
            });
        }
    });

    console.log('Результаты сравнения голосов:', results);
}

/**
 * Пример пакетной генерации речи
 * Создает аудиокнигу из нескольких глав
 */
function batchSpeechGenerationExample() {
    const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
    const gemini = new GeminiAI(apiKey);

    const chapters = [
        {
            title: 'Введение в ИИ',
            text: 'Искусственный интеллект — это область компьютерных наук, которая занимается созданием интеллектуальных машин.',
            voice: 'Charon' // Информативный
        },
        {
            title: 'Машинное обучение',
            text: 'Машинное обучение является подразделом искусственного интеллекта, которое позволяет компьютерам учиться без явного программирования.',
            voice: 'Kore' // Твердый
        },
        {
            title: 'Нейронные сети',
            text: 'Нейронные сети — это вычислительные модели, вдохновленные биологическими нейронными сетями мозга.',
            voice: 'Leda' // Молодежный
        },
        {
            title: 'Будущее ИИ',
            text: 'Будущее искусственного интеллекта обещает революционные изменения в медицине, транспорте и образовании.',
            voice: 'Puck' // Бодрый
        }
    ];

    const results = [];

    chapters.forEach((chapter, index) => {
        try {
            console.log(`Генерация главы ${index + 1}: ${chapter.title}`);

            const fileId = gemini.generateAndSaveSpeech(
                chapter.text,
                `chapter_${index + 1}_${chapter.title.replace(/\s+/g, '_').toLowerCase()}.wav`,
                chapter.voice
            );

            results.push({
                chapter: chapter.title,
                voice: chapter.voice,
                fileId: fileId,
                success: true
            });

            console.log(`Глава "${chapter.title}" сохранена: ${fileId}`);

        } catch (error) {
            console.log(`Ошибка для главы "${chapter.title}":`, error.message);
            results.push({
                chapter: chapter.title,
                voice: chapter.voice,
                error: error.message,
                success: false
            });
        }
    });

    console.log('Результаты создания аудиокниги:', results);
}

/**
 * Пример получения списка доступных голосов
 * Показывает все доступные голоса и их стили
 */
function listAvailableVoicesExample() {
    const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
    const gemini = new GeminiAI(apiKey);

    const voices = gemini.getAvailableVoices();

    console.log('Доступные голоса:');
    voices.forEach(voice => {
        console.log(`- ${voice.name}: ${voice.style}`);
    });

    // Группируем по стилям
    const styleGroups = {};
    voices.forEach(voice => {
        if (!styleGroups[voice.style]) {
            styleGroups[voice.style] = [];
        }
        styleGroups[voice.style].push(voice.name);
    });

    console.log('\nГолоса по стилям:');
    Object.keys(styleGroups).forEach(style => {
        console.log(`${style}: ${styleGroups[style].join(', ')}`);
    });
}

/**
 * Пример базового структурированного вывода
 * Демонстрирует создание JSON схем и получение структурированных ответов
 */
function structuredOutputExample() {
    const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
    const gemini = new GeminiAI(apiKey);

    try {
        // Пример 1: Простая схема для списка продуктов
        const productSchema = gemini.createSchema('ARRAY', {
            items: gemini.createSchema('OBJECT', {
                properties: {
                    name: gemini.createSchema('STRING'),
                    price: gemini.createSchema('NUMBER', { minimum: 0 }),
                    category: gemini.createSchema('STRING', {
                        enum: ['ELECTRONICS', 'CLOTHING', 'BOOKS', 'FOOD', 'OTHER']
                    }),
                    inStock: gemini.createSchema('BOOLEAN')
                },
                required: ['name', 'price'],
                propertyOrdering: ['name', 'price', 'category', 'inStock']
            })
        });

        const products = gemini.generateStructured(
            'Создай список из 3 популярных товаров интернет-магазина с ценами',
            productSchema
        );

        console.log('Структурированный список товаров:', JSON.stringify(products, null, 2));

        // Пример 2: Анализ данных компании
        const companySchema = gemini.createSchema('OBJECT', {
            properties: {
                companyName: gemini.createSchema('STRING'),
                industry: gemini.createSchema('STRING'),
                employees: gemini.createSchema('INTEGER', { minimum: 1 }),
                revenue: gemini.createSchema('NUMBER'),
                headquarters: gemini.createSchema('OBJECT', {
                    properties: {
                        city: gemini.createSchema('STRING'),
                        country: gemini.createSchema('STRING')
                    },
                    propertyOrdering: ['city', 'country']
                }),
                keyProducts: gemini.createSchema('ARRAY', {
                    items: gemini.createSchema('STRING'),
                    maxItems: 5
                })
            },
            required: ['companyName', 'industry'],
            propertyOrdering: ['companyName', 'industry', 'employees', 'revenue', 'headquarters', 'keyProducts']
        });

        const company = gemini.generateStructured(
            'Создай профиль вымышленной технологической компании',
            companySchema
        );

        console.log('Профиль компании:', JSON.stringify(company, null, 2));

        // Пример 3: Автоматическое создание схемы из примера
        const exampleEvent = {
            title: 'Конференция по ИИ',
            date: '2024-03-15',
            attendees: 150,
            online: true,
            speakers: ['Анна Иванова', 'Петр Сидоров']
        };

        const eventSchema = gemini.schemaFromExample(exampleEvent);
        console.log('Автоматически созданная схема:', JSON.stringify(eventSchema, null, 2));

        const newEvent = gemini.generateStructured(
            'Создай информацию о технологической конференции',
            eventSchema
        );

        console.log('Сгенерированное событие:', JSON.stringify(newEvent, null, 2));

    } catch (error) {
        console.log('Ошибка структурированного вывода:', error.message);
    }
}

/**
 * Пример анализа резюме с извлечением структурированных данных
 * Показывает как извлечь информацию из неструктурированного текста
 */
function resumeAnalysisExample() {
    const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
    const gemini = new GeminiAI(apiKey);

    const sampleResume = `
        Иван Петров
        Email: ivan.petrov@example.com
        Телефон: +7-123-456-7890
        
        Опыт работы:
        - ООО "ТехСофт" (2020-2023): Senior разработчик, разработка веб-приложений на React и Node.js
        - ЗАО "ИнноваЛаб" (2018-2020): Frontend разработчик, создание пользовательских интерфейсов
        
        Образование:
        - МГУ, Факультет ВМК, Бакалавр информатики (2014-2018)
        
        Навыки: JavaScript, React, Node.js, Python, SQL, Git, Docker
    `;

    try {
        // Создаем схему для резюме
        const resumeSchema = gemini.createSchema('OBJECT', {
            properties: {
                fullName: gemini.createSchema('STRING', { description: 'Полное имя кандидата' }),
                email: gemini.createSchema('STRING', { format: 'email' }),
                phone: gemini.createSchema('STRING'),
                skills: gemini.createSchema('ARRAY', {
                    items: gemini.createSchema('STRING'),
                    description: 'Список навыков'
                }),
                experience: gemini.createSchema('ARRAY', {
                    items: gemini.createSchema('OBJECT', {
                        properties: {
                            company: gemini.createSchema('STRING'),
                            position: gemini.createSchema('STRING'),
                            duration: gemini.createSchema('STRING'),
                            description: gemini.createSchema('STRING')
                        },
                        propertyOrdering: ['company', 'position', 'duration', 'description']
                    })
                }),
                education: gemini.createSchema('ARRAY', {
                    items: gemini.createSchema('OBJECT', {
                        properties: {
                            institution: gemini.createSchema('STRING'),
                            degree: gemini.createSchema('STRING'),
                            year: gemini.createSchema('STRING')
                        },
                        propertyOrdering: ['institution', 'degree', 'year']
                    })
                })
            },
            required: ['fullName'],
            propertyOrdering: ['fullName', 'email', 'phone', 'skills', 'experience', 'education']
        });

        const prompt = `
            Извлеки структурированную информацию из следующего резюме:
            
            ${sampleResume}
            
            Верни данные в формате JSON согласно схеме.
        `;

        const resumeData = gemini.generateStructured(prompt, resumeSchema);

        console.log('Структурированные данные резюме:');
        console.log('Имя:', resumeData.fullName);
        console.log('Email:', resumeData.email);
        console.log('Телефон:', resumeData.phone);
        console.log('Навыки:', resumeData.skills);
        console.log('Опыт работы:');
        resumeData.experience?.forEach((exp, index) => {
            console.log(`  ${index + 1}. ${exp.company} - ${exp.position} (${exp.duration})`);
        });
        console.log('Образование:');
        resumeData.education?.forEach((edu, index) => {
            console.log(`  ${index + 1}. ${edu.institution} - ${edu.degree} (${edu.year})`);
        });

    } catch (error) {
        console.log('Ошибка анализа резюме:', error.message);
    }
}

/**
 * Пример анализа отзывов клиентов
 * Демонстрирует sentiment analysis и категоризацию
 */
function reviewAnalysisExample() {
    const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
    const gemini = new GeminiAI(apiKey);

    const reviews = [
        'Отличный товар! Быстрая доставка, качество на высоте. Рекомендую всем!',
        'Заказывал неделю назад, до сих пор не получил. Служба поддержки не отвечает.',
        'Товар соответствует описанию, цена адекватная. Доставка в срок.',
        'Качество ужасное, деньги на ветер. Верну обязательно.'
    ];

    // Создаем схему для анализа отзывов
    const reviewSchema = gemini.createSchema('OBJECT', {
        properties: {
            sentiment: gemini.createSchema('STRING', {
                enum: ['POSITIVE', 'NEGATIVE', 'NEUTRAL'],
                description: 'Тональность отзыва'
            }),
            rating: gemini.createSchema('INTEGER', {
                minimum: 1,
                maximum: 5,
                description: 'Оценка от 1 до 5'
            }),
            summary: gemini.createSchema('STRING', {
                description: 'Краткое резюме отзыва'
            }),
            keyPoints: gemini.createSchema('ARRAY', {
                items: gemini.createSchema('STRING'),
                description: 'Ключевые моменты отзыва'
            }),
            categories: gemini.createSchema('ARRAY', {
                items: gemini.createSchema('STRING', {
                    enum: ['SERVICE', 'QUALITY', 'PRICE', 'DELIVERY', 'SUPPORT', 'OTHER']
                }),
                description: 'Категории, затронутые в отзыве'
            })
        },
        required: ['sentiment', 'summary'],
        propertyOrdering: ['sentiment', 'rating', 'summary', 'keyPoints', 'categories']
    });

    const results = [];

    reviews.forEach((review, index) => {
        try {
            const prompt = `
                Проанализируй следующий отзыв клиента:
                
                "${review}"
                
                Определи тональность, оценку, создай краткое резюме и выдели ключевые моменты.
            `;

            const analysis = gemini.generateStructured(prompt, reviewSchema);

            console.log(`\nОтзыв ${index + 1}: "${review}"`);
            console.log('Анализ:');
            console.log('- Тональность:', analysis.sentiment);
            console.log('- Оценка:', analysis.rating || 'Не указана');
            console.log('- Резюме:', analysis.summary);
            console.log('- Ключевые моменты:', analysis.keyPoints);
            console.log('- Категории:', analysis.categories);

            results.push({
                review: review,
                analysis: analysis
            });

        } catch (error) {
            console.log(`Ошибка анализа отзыва ${index + 1}:`, error.message);
        }
    });

    // Статистика по всем отзывам
    const sentimentStats = results.reduce((stats, item) => {
        const sentiment = item.analysis.sentiment;
        stats[sentiment] = (stats[sentiment] || 0) + 1;
        return stats;
    }, {});

    console.log('\nСтатистика тональности:');
    Object.entries(sentimentStats).forEach(([sentiment, count]) => {
        console.log(`${sentiment}: ${count} отзывов`);
    });
}

/**
 * Пример генерации плана проекта
 * Создает структурированный список задач с приоритетами
 */
function projectPlanningExample() {
    const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
    const gemini = new GeminiAI(apiKey);

    const projectDescription = `
        Нужно создать мобильное приложение для заказа еды. 
        Приложение должно позволять пользователям:
        - Просматривать меню ресторанов
        - Добавлять блюда в корзину
        - Оформлять заказы
        - Отслеживать статус доставки
        - Оценивать рестораны и блюда
        
        Планируемый срок: 3 месяца
        Команда: 2 frontend разработчика, 1 backend разработчик, 1 дизайнер
    `;

    try {
        // Создаем схему для плана проекта
        const taskListSchema = gemini.createSchema('OBJECT', {
            properties: {
                projectName: gemini.createSchema('STRING'),
                description: gemini.createSchema('STRING'),
                tasks: gemini.createSchema('ARRAY', {
                    items: gemini.createSchema('OBJECT', {
                        properties: {
                            id: gemini.createSchema('INTEGER'),
                            title: gemini.createSchema('STRING'),
                            description: gemini.createSchema('STRING'),
                            priority: gemini.createSchema('STRING', {
                                enum: ['HIGH', 'MEDIUM', 'LOW']
                            }),
                            estimatedHours: gemini.createSchema('INTEGER', {
                                minimum: 1,
                                maximum: 100
                            }),
                            category: gemini.createSchema('STRING', {
                                enum: ['PLANNING', 'DEVELOPMENT', 'TESTING', 'DEPLOYMENT', 'DOCUMENTATION']
                            })
                        },
                        required: ['id', 'title', 'priority'],
                        propertyOrdering: ['id', 'title', 'description', 'priority', 'estimatedHours', 'category']
                    })
                })
            },
            required: ['projectName', 'tasks'],
            propertyOrdering: ['projectName', 'description', 'tasks']
        });

        const prompt = `
            Создай детальный план задач для следующего проекта:
            
            ${projectDescription}
            
            Разбей на конкретные задачи с приоритетами и оценкой времени.
        `;

        const taskList = gemini.generateStructured(prompt, taskListSchema);

        console.log('План проекта:', taskList.projectName);
        console.log('Описание:', taskList.description);
        console.log('\nЗадачи:');

        // Группируем задачи по приоритетам
        const tasksByPriority = taskList.tasks.reduce((groups, task) => {
            const priority = task.priority;
            if (!groups[priority]) {
                groups[priority] = [];
            }
            groups[priority].push(task);
            return groups;
        }, {});

        ['HIGH', 'MEDIUM', 'LOW'].forEach(priority => {
            if (tasksByPriority[priority]) {
                console.log(`\n${priority} приоритет:`);
                tasksByPriority[priority].forEach(task => {
                    console.log(`  ${task.id}. ${task.title}`);
                    if (task.description) {
                        console.log(`     ${task.description}`);
                    }
                    console.log(`     Категория: ${task.category}, Время: ${task.estimatedHours}ч`);
                });
            }
        });

        // Подсчет общего времени
        const totalHours = taskList.tasks.reduce((sum, task) => sum + (task.estimatedHours || 0), 0);
        console.log(`\nОбщее время: ${totalHours} часов`);

    } catch (error) {
        console.log('Ошибка планирования проекта:', error.message);
    }
}

/**
 * Пример парсинга рецептов
 * Извлекает структурированную информацию из текста рецептов
 */
function recipeParsingExample() {
    const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
    const gemini = new GeminiAI(apiKey);

    const recipeText = `
        Борщ украинский
        Время: 90 минут, Порций: 6
        
        Ингредиенты:
        - Говядина - 500г
        - Свекла - 2 шт
        - Капуста - 300г
        - Морковь - 1 шт
        - Лук - 1 шт
        - Томатная паста - 2 ст.л.
        
        Приготовление:
        1. Отварить мясо в подсоленной воде 1 час
        2. Натереть свеклу и тушить с томатной пастой
        3. Добавить нарезанные овощи в бульон
        4. Варить еще 30 минут
        
        Блины на молоке
        Время: 30 минут, Порций: 4
        
        Ингредиенты:
        - Мука - 200г
        - Молоко - 500мл
        - Яйца - 2 шт
        - Сахар - 2 ст.л.
        - Соль - щепотка
        
        Приготовление:
        1. Смешать все ингредиенты в однородное тесто
        2. Жарить на сковороде с двух сторон
        3. Подавать с медом или вареньем
    `;

    try {
        // Создаем схему для рецептов
        const recipesSchema = gemini.createSchema('ARRAY', {
            items: gemini.createSchema('OBJECT', {
                properties: {
                    recipeName: gemini.createSchema('STRING'),
                    cuisine: gemini.createSchema('STRING'),
                    difficulty: gemini.createSchema('STRING', {
                        enum: ['EASY', 'MEDIUM', 'HARD']
                    }),
                    cookingTime: gemini.createSchema('INTEGER', {
                        description: 'Время приготовления в минутах'
                    }),
                    servings: gemini.createSchema('INTEGER'),
                    ingredients: gemini.createSchema('ARRAY', {
                        items: gemini.createSchema('OBJECT', {
                            properties: {
                                name: gemini.createSchema('STRING'),
                                amount: gemini.createSchema('STRING'),
                                unit: gemini.createSchema('STRING')
                            },
                            propertyOrdering: ['name', 'amount', 'unit']
                        })
                    }),
                    instructions: gemini.createSchema('ARRAY', {
                        items: gemini.createSchema('STRING')
                    })
                },
                required: ['recipeName', 'ingredients', 'instructions'],
                propertyOrdering: ['recipeName', 'cuisine', 'difficulty', 'cookingTime', 'servings', 'ingredients', 'instructions']
            })
        });

        const prompt = `
            Извлеки все рецепты из следующего текста и структурируй их:
            
            ${recipeText}
            
            Для каждого рецепта укажи название, ингредиенты с количеством и пошаговые инструкции.
        `;

        const recipes = gemini.generateStructured(prompt, recipesSchema);

        console.log('Извлеченные рецепты:');
        recipes.forEach((recipe, index) => {
            console.log(`\n${index + 1}. ${recipe.recipeName}`);
            console.log(`   Сложность: ${recipe.difficulty}`);
            console.log(`   Время: ${recipe.cookingTime} мин`);
            console.log(`   Порций: ${recipe.servings}`);
            console.log('   Ингредиенты:');
            recipe.ingredients.forEach(ing => {
                console.log(`     - ${ing.name}: ${ing.amount} ${ing.unit || ''}`);
            });
            console.log('   Инструкции:');
            recipe.instructions.forEach((step, stepIndex) => {
                console.log(`     ${stepIndex + 1}. ${step}`);
            });
        });

    } catch (error) {
        console.log('Ошибка парсинга рецептов:', error.message);
    }
}

/**
 * Базовый пример Function Calling
 * Демонстрирует создание функций и их вызов моделью
 */
function functionCallingExample() {
    const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
    const gemini = new GeminiAI(apiKey);

    try {
        // Создаем объявление функции для получения погоды
        const getWeatherDeclaration = gemini.createFunctionDeclaration(
            'get_weather',
            'Получает текущую погоду для указанного города',
            {
                properties: {
                    city: {
                        type: 'string',
                        description: 'Название города'
                    },
                    units: {
                        type: 'string',
                        enum: ['celsius', 'fahrenheit'],
                        description: 'Единицы измерения температуры'
                    }
                },
                required: ['city']
            }
        );

        // Создаем объявление функции для конвертации валют
        const convertCurrencyDeclaration = gemini.createFunctionDeclaration(
            'convert_currency',
            'Конвертирует сумму из одной валюты в другую',
            {
                properties: {
                    amount: {
                        type: 'number',
                        description: 'Сумма для конвертации'
                    },
                    from_currency: {
                        type: 'string',
                        description: 'Исходная валюта (например, USD)'
                    },
                    to_currency: {
                        type: 'string',
                        description: 'Целевая валюта (например, EUR)'
                    }
                },
                required: ['amount', 'from_currency', 'to_currency']
            }
        );

        const functionDeclarations = [getWeatherDeclaration, convertCurrencyDeclaration];

        // Тестируем различные запросы
        const testPrompts = [
            'Какая погода в Москве?',
            'Сколько будет 100 долларов в евро?',
            'Привет, как дела?'
        ];

        testPrompts.forEach((prompt, index) => {
            console.log(`\nЗапрос ${index + 1}: "${prompt}"`);

            const response = gemini.generateWithFunctions(prompt, functionDeclarations);

            if (response.functionCall) {
                console.log('Модель хочет вызвать функцию:');
                console.log('- Функция:', response.functionCall.name);
                console.log('- Аргументы:', JSON.stringify(response.functionCall.args, null, 2));
            } else {
                console.log('Обычный ответ:', response.text);
            }
        });

    } catch (error) {
        console.log('Ошибка Function Calling:', error.message);
    }
}

/**
 * Пример планировщика встреч с Function Calling
 * Показывает полный цикл: вызов функции → выполнение → финальный ответ
 */
function meetingSchedulerExample() {
    const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
    const gemini = new GeminiAI(apiKey);

    try {
        // Объявление функции планирования встречи
        const scheduleMeetingDeclaration = gemini.createFunctionDeclaration(
            'schedule_meeting',
            'Планирует встречу с указанными участниками в определенное время',
            {
                properties: {
                    attendees: {
                        type: 'array',
                        items: { type: 'string' },
                        description: 'Список участников встречи'
                    },
                    date: {
                        type: 'string',
                        description: 'Дата встречи в формате YYYY-MM-DD'
                    },
                    time: {
                        type: 'string',
                        description: 'Время встречи в формате HH:MM'
                    },
                    topic: {
                        type: 'string',
                        description: 'Тема встречи'
                    },
                    duration: {
                        type: 'integer',
                        description: 'Продолжительность в минутах'
                    }
                },
                required: ['attendees', 'date', 'time', 'topic']
            }
        );

        // Реализация функции планирования
        const functionImplementations = {
            schedule_meeting: (args) => {
                // Имитация создания встречи в календаре
                const meetingId = `meeting_${Date.now()}`;

                console.log('Создание встречи в календаре...');
                console.log('- Участники:', args.attendees.join(', '));
                console.log('- Дата:', args.date);
                console.log('- Время:', args.time);
                console.log('- Тема:', args.topic);
                console.log('- Длительность:', args.duration || 60, 'минут');

                // Имитация сохранения в календарь (здесь можно использовать Calendar API)
                return {
                    success: true,
                    meetingId: meetingId,
                    message: `Встреча "${args.topic}" запланирована на ${args.date} в ${args.time}`,
                    calendarLink: `https://calendar.google.com/calendar/event?id=${meetingId}`
                };
            }
        };

        const prompt = 'Запланируй встречу с Анной и Петром на завтра в 14:00 по теме "Обсуждение проекта"';

        console.log('Запрос:', prompt);

        // Используем полный цикл с автоматическим выполнением функций
        const result = gemini.executeWithFunctions(
            prompt,
            [scheduleMeetingDeclaration],
            functionImplementations
        );

        console.log('\nФинальный ответ:', result);

    } catch (error) {
        console.log('Ошибка планирования встречи:', error.message);
    }
}

/**
 * Пример калькулятора с Function Calling
 * Демонстрирует математические вычисления через функции
 */
function calculatorExample() {
    const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
    const gemini = new GeminiAI(apiKey);

    try {
        // Объявления математических функций
        const calculateDeclaration = gemini.createFunctionDeclaration(
            'calculate',
            'Выполняет математические вычисления',
            {
                properties: {
                    expression: {
                        type: 'string',
                        description: 'Математическое выражение для вычисления (например, "2 + 3 * 4")'
                    }
                },
                required: ['expression']
            }
        );

        const getRandomNumberDeclaration = gemini.createFunctionDeclaration(
            'get_random_number',
            'Генерирует случайное число в указанном диапазоне',
            {
                properties: {
                    min: {
                        type: 'integer',
                        description: 'Минимальное значение'
                    },
                    max: {
                        type: 'integer',
                        description: 'Максимальное значение'
                    }
                },
                required: ['min', 'max']
            }
        );

        // Реализации функций
        const functionImplementations = {
            calculate: (args) => {
                try {
                    // Простая и безопасная оценка математических выражений
                    const expression = args.expression.replace(/[^0-9+\-*/().\s]/g, '');
                    const result = eval(expression);

                    return {
                        expression: args.expression,
                        result: result,
                        success: true
                    };
                } catch (error) {
                    return {
                        expression: args.expression,
                        error: 'Некорректное математическое выражение',
                        success: false
                    };
                }
            },

            get_random_number: (args) => {
                const min = Math.ceil(args.min);
                const max = Math.floor(args.max);
                const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

                return {
                    min: args.min,
                    max: args.max,
                    randomNumber: randomNumber
                };
            }
        };

        const testQueries = [
            'Вычисли 15 * 8 + 32',
            'Сгенерируй случайное число от 1 до 100',
            'Сколько будет (25 + 15) / 4?',
            'Дай мне случайное число от 50 до 200'
        ];

        testQueries.forEach((query, index) => {
            console.log(`\nЗапрос ${index + 1}: "${query}"`);

            try {
                const result = gemini.executeWithFunctions(
                    query,
                    [calculateDeclaration, getRandomNumberDeclaration],
                    functionImplementations
                );

                console.log('Ответ:', result);
            } catch (error) {
                console.log('Ошибка:', error.message);
            }
        });

    } catch (error) {
        console.log('Ошибка калькулятора:', error.message);
    }
}

/**
 * Пример работы с Google Sheets через Function Calling
 * Демонстрирует интеграцию с внешними сервисами
 */
function sheetsIntegrationExample() {
    const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
    const gemini = new GeminiAI(apiKey);

    try {
        // Объявления функций для работы с таблицами
        const addRowDeclaration = gemini.createFunctionDeclaration(
            'add_row_to_sheet',
            'Добавляет новую строку в Google Sheets',
            {
                properties: {
                    sheetId: {
                        type: 'string',
                        description: 'ID Google Sheets документа'
                    },
                    sheetName: {
                        type: 'string',
                        description: 'Название листа в документе'
                    },
                    values: {
                        type: 'array',
                        items: { type: 'string' },
                        description: 'Значения для добавления в строку'
                    }
                },
                required: ['sheetId', 'values']
            }
        );

        const getDataDeclaration = gemini.createFunctionDeclaration(
            'get_sheet_data',
            'Получает данные из Google Sheets',
            {
                properties: {
                    sheetId: {
                        type: 'string',
                        description: 'ID Google Sheets документа'
                    },
                    range: {
                        type: 'string',
                        description: 'Диапазон ячеек (например, A1:C10)'
                    }
                },
                required: ['sheetId', 'range']
            }
        );

        // Реализации функций (требуют настройки Google Sheets API)
        const functionImplementations = {
            add_row_to_sheet: (args) => {
                try {
                    // Здесь должна быть реальная интеграция с Google Sheets API
                    // const sheet = SpreadsheetApp.openById(args.sheetId);
                    // const worksheet = args.sheetName ? sheet.getSheetByName(args.sheetName) : sheet.getActiveSheet();
                    // worksheet.appendRow(args.values);

                    console.log('Добавление строки в таблицу:');
                    console.log('- Sheet ID:', args.sheetId);
                    console.log('- Лист:', args.sheetName || 'Активный');
                    console.log('- Данные:', args.values);

                    return {
                        success: true,
                        message: `Добавлена строка с ${args.values.length} значениями`,
                        rowData: args.values
                    };
                } catch (error) {
                    return {
                        success: false,
                        error: error.message
                    };
                }
            },

            get_sheet_data: (args) => {
                try {
                    // Имитация получения данных
                    console.log('Получение данных из таблицы:');
                    console.log('- Sheet ID:', args.sheetId);
                    console.log('- Диапазон:', args.range);

                    // Здесь должна быть реальная интеграция
                    // const sheet = SpreadsheetApp.openById(args.sheetId);
                    // const data = sheet.getRange(args.range).getValues();

                    const mockData = [
                        ['Имя', 'Возраст', 'Город'],
                        ['Анна', '25', 'Москва'],
                        ['Петр', '30', 'СПб']
                    ];

                    return {
                        success: true,
                        data: mockData,
                        range: args.range
                    };
                } catch (error) {
                    return {
                        success: false,
                        error: error.message
                    };
                }
            }
        };

        const prompt = 'Добавь в таблицу новую строку с данными: Мария, 28, Екатеринбург';

        console.log('Запрос:', prompt);

        const result = gemini.executeWithFunctions(
            prompt,
            [addRowDeclaration, getDataDeclaration],
            functionImplementations
        );

        console.log('Результат:', result);

    } catch (error) {
        console.log('Ошибка интеграции с Sheets:', error.message);
    }
}

/**
 * Базовый пример Code Execution
 * Демонстрирует выполнение Python кода моделью
 */
function codeExecutionExample() {
    const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
    const gemini = new GeminiAI(apiKey);

    try {
        const testPrompts = [
            'Найди сумму первых 10 простых чисел',
            'Создай список квадратов чисел от 1 до 10',
            'Вычисли факториал числа 8',
            'Найди все числа Фибоначчи меньше 100'
        ];

        testPrompts.forEach((prompt, index) => {
            console.log(`\nЗадача ${index + 1}: "${prompt}"`);

            try {
                const response = gemini.generateWithCodeExecution(prompt);

                console.log('Объяснение:', response.text);

                if (response.executableCode.length > 0) {
                    response.executableCode.forEach((code, codeIndex) => {
                        console.log(`\nКод ${codeIndex + 1} (${code.language}):`);
                        console.log(code.code);
                    });
                }

                if (response.codeExecutionResults.length > 0) {
                    response.codeExecutionResults.forEach((result, resultIndex) => {
                        console.log(`\nРезультат выполнения ${resultIndex + 1}:`);
                        console.log('Статус:', result.outcome);
                        console.log('Вывод:', result.output);
                    });
                }

            } catch (error) {
                console.log('Ошибка:', error.message);
            }
        });

    } catch (error) {
        console.log('Ошибка Code Execution:', error.message);
    }
}

/**
 * Пример решения математических задач
 * Демонстрирует использование специализированного метода
 */
function mathProblemsExample() {
    const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
    const gemini = new GeminiAI(apiKey);

    const mathProblems = [
        'Найди корни уравнения x² - 5x + 6 = 0',
        'Вычисли определенный интеграл от x² на интервале [0, 3]',
        'Найди производную функции f(x) = x³ + 2x² - 5x + 1',
        'Реши систему уравнений: 2x + 3y = 7, x - y = 1',
        'Найди площадь треугольника со сторонами 3, 4, 5'
    ];

    mathProblems.forEach((problem, index) => {
        console.log(`\nМатематическая задача ${index + 1}:`);
        console.log(problem);

        try {
            const solution = gemini.solveMathProblem(problem);

            console.log('\nРешение:', solution.text);

            if (solution.executableCode.length > 0) {
                console.log('\nИспользованный код:');
                solution.executableCode.forEach(code => {
                    console.log(code.code);
                });
            }

            if (solution.codeExecutionResults.length > 0) {
                console.log('\nРезультат вычислений:');
                solution.codeExecutionResults.forEach(result => {
                    console.log(result.output);
                });
            }

        } catch (error) {
            console.log('Ошибка решения:', error.message);
        }
    });
}

/**
 * Пример анализа данных с визуализацией
 * Показывает создание графиков и анализ данных
 */
function dataAnalysisExample() {
    const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
    const gemini = new GeminiAI(apiKey);

    try {
        // Пример 1: Анализ продаж
        console.log('\n=== Анализ продаж ===');
        const salesData = 'Данные о продажах за год: Январь-100, Февраль-120, Март-90, Апрель-150, Май-180, Июнь-200';
        const salesAnalysis = gemini.analyzeData(
            salesData,
            'Найди среднее значение, тренд роста и создай график продаж по месяцам'
        );

        console.log('Анализ:', salesAnalysis.text);

        if (salesAnalysis.executableCode.length > 0) {
            console.log('\nКод анализа:');
            salesAnalysis.executableCode.forEach(code => {
                console.log(code.code);
            });
        }

        if (salesAnalysis.images.length > 0) {
            console.log(`\nСоздано ${salesAnalysis.images.length} изображений (графиков)`);
            salesAnalysis.images.forEach((image, index) => {
                console.log(`График ${index + 1}: ${image.mimeType}`);
                // В реальном приложении здесь можно сохранить изображение
                // const blob = Utilities.newBlob(Utilities.base64Decode(image.data), image.mimeType);
                // DriveApp.createFile(blob.setName(`chart_${index + 1}.png`));
            });
        }

        // Пример 2: Статистический анализ
        console.log('\n=== Статистический анализ ===');
        const statsData = 'Оценки студентов: [85, 92, 78, 96, 88, 91, 83, 87, 94, 89, 86, 90]';
        const statsAnalysis = gemini.analyzeData(
            statsData,
            'Вычисли среднее, медиану, стандартное отклонение и создай гистограмму распределения'
        );

        console.log('Статистический анализ:', statsAnalysis.text);

        // Пример 3: Создание специфической визуализации
        console.log('\n=== Создание графика ===');
        const chartData = 'Температура по дням недели: Пн-22°C, Вт-25°C, Ср-20°C, Чт-28°C, Пт-26°C, Сб-24°C, Вс-23°C';
        const chart = gemini.createVisualization(chartData, 'линейный график с точками');

        console.log('Описание графика:', chart.text);

    } catch (error) {
        console.log('Ошибка анализа данных:', error.message);
    }
}

/**
 * Пример обработки файлов
 * Демонстрирует работу с различными типами файлов
 */
function fileProcessingExample() {
    const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
    const gemini = new GeminiAI(apiKey);

    try {
        // Пример 1: Обработка CSV файла
        console.log('\n=== Обработка CSV ===');
        const csvTask = gemini.processFile(
            'CSV файл с данными о сотрудниках (имя, возраст, зарплата, отдел)',
            'Найди среднюю зарплату по отделам и создай сводную таблицу'
        );

        console.log('Код обработки CSV:', csvTask.text);

        // Пример 2: Анализ текстового файла
        console.log('\n=== Анализ текста ===');
        const textTask = gemini.processFile(
            'Текстовый файл с отзывами клиентов',
            'Подсчитай количество слов, найди самые частые слова и определи общую тональность'
        );

        console.log('Код анализа текста:', textTask.text);

        // Пример 3: Обработка Excel файла
        console.log('\n=== Обработка Excel ===');
        const excelTask = gemini.processFile(
            'Excel файл с финансовыми данными за квартал',
            'Создай сводную таблицу доходов и расходов, вычисли прибыль по месяцам'
        );

        console.log('Код обработки Excel:', excelTask.text);

    } catch (error) {
        console.log('Ошибка обработки файлов:', error.message);
    }
}

/**
 * Пример комбинированного использования Code Execution и Function Calling
 * Показывает как совместить выполнение кода с вызовом функций
 */
function combinedToolsExample() {
    const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
    const gemini = new GeminiAI(apiKey);

    try {
        // Создаем функцию для сохранения результатов
        const saveResultDeclaration = gemini.createFunctionDeclaration(
            'save_analysis_result',
            'Сохраняет результат анализа в файл',
            {
                properties: {
                    filename: {
                        type: 'string',
                        description: 'Имя файла для сохранения'
                    },
                    data: {
                        type: 'string',
                        description: 'Данные для сохранения'
                    },
                    format: {
                        type: 'string',
                        enum: ['json', 'csv', 'txt'],
                        description: 'Формат файла'
                    }
                },
                required: ['filename', 'data']
            }
        );

        const prompt = `
            Проанализируй следующие данные о продажах и сохрани результат:
            Продажи по месяцам: Янв-1000, Фев-1200, Мар-900, Апр-1500, Май-1800
            
            1. Вычисли общую сумму продаж
            2. Найди месяц с максимальными продажами
            3. Вычисли среднемесячные продажи
            4. Сохрани результат в JSON файл
        `;

        const response = gemini.generateWithTools(prompt, [saveResultDeclaration]);

        console.log('Комбинированный анализ:', response.text);

        if (response.executableCode.length > 0) {
            console.log('\nВыполненный код:');
            response.executableCode.forEach(code => {
                console.log(code.code);
            });
        }

        if (response.functionCall) {
            console.log('\nВызов функции сохранения:');
            console.log('Функция:', response.functionCall.name);
            console.log('Параметры:', JSON.stringify(response.functionCall.args, null, 2));
        }

    } catch (error) {
        console.log('Ошибка комбинированного примера:', error.message);
    }
}

/**
 * Функция для тестирования всех примеров
 * Запускает все демонстрационные функции по порядку
 */
function runAllExamples() {
    console.log('=== Базовая генерация текста ===');
    basicTextGeneration();

    console.log('\n=== Мульти-модельная генерация ===');
    multiModelGeneration();

    console.log('\n=== Чат ===');
    chatExample();

    console.log('\n=== Анализ изображений ===');
    imageAnalysisExample();

    console.log('\n=== Подсчет токенов ===');
    tokenCountingExample();

    console.log('\n=== Информация о моделях ===');
    modelInfoExample();

    console.log('\n=== Практический пример ===');
    practicalExample();

    console.log('\n=== Batch обработка ===');
    batchProcessingExample();

    console.log('\n=== Генерация изображений ===');
    imageGenerationExample();

    console.log('\n=== Редактирование изображений ===');
    imageEditingExample();

    console.log('\n=== Пакетная генерация изображений ===');
    batchImageGenerationExample();

    console.log('\n=== Генерация видео ===');
    videoGenerationExample();

    console.log('\n=== Видео из изображения ===');
    videoFromImageExample();

    console.log('\n=== Пакетная генерация видео ===');
    batchVideoGenerationExample();

    console.log('\n=== Генерация речи ===');
    speechGenerationExample();

    console.log('\n=== Многоголосая речь ===');
    multiSpeakerSpeechExample();

    console.log('\n=== Пакетная генерация речи ===');
    batchSpeechGenerationExample();

    console.log('\n=== Структурированный вывод ===');
    structuredOutputExample();

    console.log('\n=== Анализ резюме ===');
    resumeAnalysisExample();

    console.log('\n=== Анализ отзывов ===');
    reviewAnalysisExample();

    console.log('\n=== Function Calling ===');
    functionCallingExample();

    console.log('\n=== Планирование встреч ===');
    meetingSchedulerExample();

    console.log('\n=== Калькулятор ===');
    calculatorExample();

    console.log('\n=== Code Execution ===');
    codeExecutionExample();

    console.log('\n=== Математические задачи ===');
    mathProblemsExample();

    console.log('\n=== Анализ данных ===');
    dataAnalysisExample();
} 
