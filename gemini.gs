/**
 * Класс для работы с Google AI (Gemini) API
 */
class GeminiAI {
    /**
     * @param {string} apiKey - API ключ для Google AI
     * @param {string} model - Модель (по умолчанию gemini-1.5-flash)
     */
    constructor(apiKey, model = 'gemini-1.5-flash') {
        this.apiKey = apiKey;
        this.model = model;
        this.baseApiUrl = 'https://generativelanguage.googleapis.com/v1beta';
        this.baseUrl = `${this.baseApiUrl}/models`;
        this.operationsUrl = this.baseApiUrl;
    }

    /**
     * Генерация текста
     * @param {string|Array} prompt - Текстовый промпт или массив сообщений
     * @param {Object} options - Дополнительные параметры
     * @param {string} model - Модель (опционально, по умолчанию используется this.model)
     * @returns {string} Сгенерированный текст
     */
    generateText(prompt, options = {}, model = null) {
        const selectedModel = model || this.model;
        const url = `${this.baseUrl}/${selectedModel}:generateContent?key=${this.apiKey}`;

        const payload = {
            contents: this._formatPrompt(prompt),
            generationConfig: {
                temperature: options.temperature || 0.7,
                topK: options.topK || 40,
                topP: options.topP || 0.95,
                maxOutputTokens: options.maxTokens || 2048,
                ...options.generationConfig
            }
        };

        if (options.safetySettings) {
            payload.safetySettings = options.safetySettings;
        }

        const response = this._makeRequest(url, payload);
        return this._extractText(response);
    }

    /**
     * Чат с историей сообщений
     * @param {Array} messages - Массив сообщений [{role: 'user'|'model', text: 'текст'}]
     * @param {Object} options - Дополнительные параметры
     * @param {string} model - Модель (опционально, по умолчанию используется this.model)
     * @returns {string} Ответ модели
     */
    chat(messages, options = {}, model = null) {
        const contents = messages.map(msg => ({
            role: msg.role,
            parts: [{ text: msg.text }]
        }));

        return this.generateText(contents, options, model);
    }

    /**
     * Анализ изображения с текстом
     * @param {string} imageBlob - Base64 изображение или Blob
     * @param {string} prompt - Текстовый промпт
     * @param {Object} options - Дополнительные параметры
     * @param {string} model - Модель (опционально, по умолчанию используется this.model)
     * @returns {string} Результат анализа
     */
    analyzeImage(imageBlob, prompt = "Опиши что на изображении", options = {}, model = null) {
        let imageData;

        if (typeof imageBlob === 'string') {
            // Base64 строка
            imageData = {
                inlineData: {
                    data: imageBlob,
                    mimeType: options.mimeType || 'image/jpeg'
                }
            };
        } else {
            // Google Apps Script Blob
            imageData = {
                inlineData: {
                    data: Utilities.base64Encode(imageBlob.getBytes()),
                    mimeType: imageBlob.getContentType()
                }
            };
        }

        const contents = [{
            parts: [
                { text: prompt },
                imageData
            ]
        }];

        return this.generateText(contents, options, model);
    }

    /**
     * Получение информации о модели
     * @param {string} model - Модель (опционально, по умолчанию используется this.model)
     * @returns {Object} Информация о модели
     */
    getModelInfo(model = null) {
        const selectedModel = model || this.model;
        const url = `${this.baseUrl}/${selectedModel}?key=${this.apiKey}`;

        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const response = UrlFetchApp.fetch(url, options);
        return JSON.parse(response.getContentText());
    }

    /**
     * Список доступных моделей
     * @returns {Array} Массив доступных моделей
     */
    listModels() {
        const url = `${this.baseUrl}?key=${this.apiKey}`;

        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const response = UrlFetchApp.fetch(url, options);
        const data = JSON.parse(response.getContentText());
        return data.models || [];
    }

    /**
     * Подсчет токенов
     * @param {string|Array} content - Контент для подсчета
     * @param {string} model - Модель (опционально, по умолчанию используется this.model)
     * @returns {number} Количество токенов
     */
    countTokens(content, model = null) {
        const selectedModel = model || this.model;
        const url = `${this.baseUrl}/${selectedModel}:countTokens?key=${this.apiKey}`;

        const payload = {
            contents: this._formatPrompt(content)
        };

        const response = this._makeRequest(url, payload);
        return response.totalTokens || 0;
    }

    /**
     * Генерация изображения
     * @param {string} prompt - Описание изображения
     * @param {Object} options - Дополнительные параметры
     * @param {string} model - Модель ('gemini-2.0-flash-preview-image-generation' или 'imagen-3.0-generate-002')
     * @returns {Object} Объект с текстом и изображениями {text: string, images: Array<{data: string, mimeType: string}>}
     */
    generateImage(prompt, options = {}, model = 'gemini-2.0-flash-preview-image-generation') {
        const url = `${this.baseUrl}/${model}:generateContent?key=${this.apiKey}`;

        const payload = {
            contents: this._formatPrompt(prompt),
            generationConfig: {
                temperature: options.temperature || 0.7,
                topK: options.topK || 40,
                topP: options.topP || 0.95,
                maxOutputTokens: options.maxTokens || 2048,
                responseModalities: ['TEXT', 'IMAGE'],
                ...options.generationConfig
            }
        };

        if (options.safetySettings) {
            payload.safetySettings = options.safetySettings;
        }

        const response = this._makeRequest(url, payload);
        return this._extractImageResponse(response);
    }

    /**
     * Редактирование изображения (text-and-image-to-image)
     * @param {string|Blob} inputImage - Исходное изображение (Base64 или Blob)
     * @param {string} prompt - Описание изменений
     * @param {Object} options - Дополнительные параметры
     * @param {string} model - Модель (по умолчанию gemini-2.0-flash-preview-image-generation)
     * @returns {Object} Объект с текстом и изображениями
     */
    editImage(inputImage, prompt, options = {}, model = 'gemini-2.0-flash-preview-image-generation') {
        let imageData;

        if (typeof inputImage === 'string') {
            // Base64 строка
            imageData = {
                inlineData: {
                    data: inputImage,
                    mimeType: options.inputMimeType || 'image/jpeg'
                }
            };
        } else {
            // Google Apps Script Blob
            imageData = {
                inlineData: {
                    data: Utilities.base64Encode(inputImage.getBytes()),
                    mimeType: inputImage.getContentType()
                }
            };
        }

        const contents = [{
            parts: [
                { text: prompt },
                imageData
            ]
        }];

        const url = `${this.baseUrl}/${model}:generateContent?key=${this.apiKey}`;

        const payload = {
            contents: contents,
            generationConfig: {
                temperature: options.temperature || 0.7,
                topK: options.topK || 40,
                topP: options.topP || 0.95,
                maxOutputTokens: options.maxTokens || 2048,
                responseModalities: ['TEXT', 'IMAGE'],
                ...options.generationConfig
            }
        };

        if (options.safetySettings) {
            payload.safetySettings = options.safetySettings;
        }

        const response = this._makeRequest(url, payload);
        return this._extractImageResponse(response);
    }

    /**
     * Генерация видео с помощью Veo (платная функция)
     * @param {string} prompt - Описание видео
     * @param {Object} options - Дополнительные параметры
     * @param {string} model - Модель (по умолчанию veo-2.0-generate-001)
     * @returns {string} ID операции для отслеживания статуса
     */
    generateVideo(prompt, options = {}, model = 'veo-2.0-generate-001') {
        const url = `${this.baseUrl}/${model}:predictLongRunning?key=${this.apiKey}`;

        const payload = {
            instances: [{
                prompt: prompt
            }],
            parameters: {
                aspectRatio: options.aspectRatio || '16:9', // '16:9' или '9:16'
                personGeneration: options.personGeneration || 'dont_allow', // 'dont_allow' или 'allow_adult'
                ...options.parameters
            }
        };

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            payload: JSON.stringify(payload)
        };

        try {
            const response = UrlFetchApp.fetch(url, requestOptions);
            const responseText = response.getContentText();

            if (response.getResponseCode() !== 200) {
                throw new Error(`API Error: ${response.getResponseCode()} - ${responseText}`);
            }

            const data = JSON.parse(responseText);
            return data.name; // Возвращаем ID операции
        } catch (error) {
            console.error('Video generation failed:', error);
            throw new Error(`Ошибка генерации видео: ${error.message}`);
        }
    }

    /**
     * Генерация видео из изображения (image-to-video)
     * @param {string|Blob} inputImage - Исходное изображение
     * @param {string} prompt - Описание действий в видео
     * @param {Object} options - Дополнительные параметры
     * @param {string} model - Модель (по умолчанию veo-2.0-generate-001)
     * @returns {string} ID операции для отслеживания статуса
     */
    generateVideoFromImage(inputImage, prompt, options = {}, model = 'veo-2.0-generate-001') {
        let imageData;

        if (typeof inputImage === 'string') {
            // Base64 строка
            imageData = {
                inlineData: {
                    data: inputImage,
                    mimeType: options.inputMimeType || 'image/jpeg'
                }
            };
        } else {
            // Google Apps Script Blob
            imageData = {
                inlineData: {
                    data: Utilities.base64Encode(inputImage.getBytes()),
                    mimeType: inputImage.getContentType()
                }
            };
        }

        const url = `${this.baseUrl}/${model}:predictLongRunning?key=${this.apiKey}`;

        const payload = {
            instances: [{
                prompt: prompt,
                image: imageData
            }],
            parameters: {
                aspectRatio: options.aspectRatio || '16:9',
                personGeneration: options.personGeneration || 'dont_allow',
                ...options.parameters
            }
        };

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            payload: JSON.stringify(payload)
        };

        try {
            const response = UrlFetchApp.fetch(url, requestOptions);
            const responseText = response.getContentText();

            if (response.getResponseCode() !== 200) {
                throw new Error(`API Error: ${response.getResponseCode()} - ${responseText}`);
            }

            const data = JSON.parse(responseText);
            return data.name;
        } catch (error) {
            console.error('Video from image generation failed:', error);
            throw new Error(`Ошибка генерации видео из изображения: ${error.message}`);
        }
    }

    /**
     * Проверка статуса операции генерации видео
     * @param {string} operationId - ID операции
     * @returns {Object} Статус операции {done: boolean, response?: Object, error?: Object}
     */
    checkVideoOperation(operationId) {
        const url = `${this.operationsUrl}/${operationId}?key=${this.apiKey}`;

        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        };

        try {
            const response = UrlFetchApp.fetch(url, options);
            const responseText = response.getContentText();

            if (response.getResponseCode() !== 200) {
                throw new Error(`API Error: ${response.getResponseCode()} - ${responseText}`);
            }

            return JSON.parse(responseText);
        } catch (error) {
            console.error('Operation check failed:', error);
            throw new Error(`Ошибка проверки операции: ${error.message}`);
        }
    }

    /**
     * Ожидание завершения генерации видео с polling
     * @param {string} operationId - ID операции
     * @param {number} maxWaitTime - Максимальное время ожидания в секундах (по умолчанию 300)
     * @param {number} pollInterval - Интервал проверки в секундах (по умолчанию 20)
     * @returns {Object} Результат операции
     */
    waitForVideoGeneration(operationId, maxWaitTime = 300, pollInterval = 20) {
        const startTime = new Date().getTime();
        const maxWaitMs = maxWaitTime * 1000;
        const pollIntervalMs = pollInterval * 1000;

        while (true) {
            const status = this.checkVideoOperation(operationId);

            if (status.done) {
                if (status.error) {
                    throw new Error(`Ошибка генерации видео: ${JSON.stringify(status.error)}`);
                }
                return status.response;
            }

            const elapsedTime = new Date().getTime() - startTime;
            if (elapsedTime > maxWaitMs) {
                throw new Error(`Превышено время ожидания (${maxWaitTime}с) для операции ${operationId}`);
            }

            console.log(`Генерация видео выполняется... (${Math.round(elapsedTime / 1000)}с)`);
            Utilities.sleep(pollIntervalMs);
        }
    }

    /**
     * Скачивание готового видео
     * @param {string} videoUri - URI видео из ответа операции
     * @returns {Blob} Blob с видео данными
     */
    downloadVideo(videoUri) {
        // Добавляем API ключ к URI
        const urlWithKey = `${videoUri}&key=${this.apiKey}`;

        try {
            const response = UrlFetchApp.fetch(urlWithKey);

            if (response.getResponseCode() !== 200) {
                throw new Error(`Ошибка скачивания: ${response.getResponseCode()}`);
            }

            return response.getBlob();
        } catch (error) {
            console.error('Video download failed:', error);
            throw new Error(`Ошибка скачивания видео: ${error.message}`);
        }
    }

    /**
     * Сохранение видео в Google Drive
     * @param {Blob} videoBlob - Blob с видео данными
     * @param {string} filename - Имя файла
     * @returns {string} ID файла в Google Drive
     */
    saveVideoToDrive(videoBlob, filename) {
        videoBlob.setName(filename);
        const file = DriveApp.createFile(videoBlob);
        return file.getId();
    }

    /**
     * Полный цикл генерации видео: создание → ожидание → скачивание → сохранение
     * @param {string} prompt - Описание видео
     * @param {string} filename - Имя файла для сохранения
     * @param {Object} options - Дополнительные параметры
     * @returns {string} ID файла в Google Drive
     */
    generateAndSaveVideo(prompt, filename, options = {}) {
        console.log('Запуск генерации видео...');
        const operationId = this.generateVideo(prompt, options);

        console.log('Ожидание завершения генерации...');
        const result = this.waitForVideoGeneration(operationId);

        if (result.generatedVideos && result.generatedVideos.length > 0) {
            const videoUri = result.generatedVideos[0].video.uri;

            console.log('Скачивание видео...');
            const videoBlob = this.downloadVideo(videoUri);

            console.log('Сохранение в Drive...');
            const fileId = this.saveVideoToDrive(videoBlob, filename);

            console.log(`Видео сохранено в Drive: ${fileId}`);
            return fileId;
        } else {
            throw new Error('Не удалось получить сгенерированное видео');
        }
    }

    /**
     * Сохранение изображения в Google Drive
     * @param {string} base64Data - Base64 данные изображения
     * @param {string} filename - Имя файла
     * @param {string} mimeType - MIME тип (по умолчанию image/png)
     * @returns {string} ID файла в Google Drive
     */
    saveImageToDrive(base64Data, filename, mimeType = 'image/png') {
        const blob = Utilities.newBlob(
            Utilities.base64Decode(base64Data),
            mimeType,
            filename
        );

        const file = DriveApp.createFile(blob);
        return file.getId();
    }

    /**
     * Генерация речи (text-to-speech) одним голосом
     * @param {string} text - Текст для озвучивания
     * @param {string} voiceName - Имя голоса (например, 'Kore', 'Puck', 'Zephyr')
     * @param {Object} options - Дополнительные параметры
     * @param {string} model - Модель TTS (по умолчанию gemini-2.5-flash-preview-tts)
     * @returns {string} Base64 PCM audio data
     */
    generateSpeech(text, voiceName = 'Kore', options = {}, model = 'gemini-2.5-flash-preview-tts') {
        const url = `${this.baseUrl}/${model}:generateContent?key=${this.apiKey}`;

        const payload = {
            contents: this._formatPrompt(text),
            generationConfig: {
                responseModalities: ['AUDIO'],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: {
                            voiceName: voiceName
                        }
                    }
                },
                ...options.generationConfig
            }
        };

        if (options.safetySettings) {
            payload.safetySettings = options.safetySettings;
        }

        const response = this._makeRequest(url, payload);
        return this._extractAudioData(response);
    }

    /**
     * Генерация речи несколькими голосами (multi-speaker)
     * @param {string} text - Текст с указанием спикеров
     * @param {Array} speakers - Массив {speaker: 'Имя', voiceName: 'Голос'}
     * @param {Object} options - Дополнительные параметры
     * @param {string} model - Модель TTS (по умолчанию gemini-2.5-flash-preview-tts)
     * @returns {string} Base64 PCM audio data
     */
    generateMultiSpeakerSpeech(text, speakers, options = {}, model = 'gemini-2.5-flash-preview-tts') {
        const url = `${this.baseUrl}/${model}:generateContent?key=${this.apiKey}`;

        const speakerVoiceConfigs = speakers.map(speaker => ({
            speaker: speaker.speaker,
            voiceConfig: {
                prebuiltVoiceConfig: {
                    voiceName: speaker.voiceName
                }
            }
        }));

        const payload = {
            contents: this._formatPrompt(text),
            generationConfig: {
                responseModalities: ['AUDIO'],
                speechConfig: {
                    multiSpeakerVoiceConfig: {
                        speakerVoiceConfigs: speakerVoiceConfigs
                    }
                },
                ...options.generationConfig
            }
        };

        if (options.safetySettings) {
            payload.safetySettings = options.safetySettings;
        }

        const response = this._makeRequest(url, payload);
        return this._extractAudioData(response);
    }

    /**
     * Создание WAV файла из PCM данных
     * @param {string} base64PCMData - Base64 PCM данные
     * @param {Object} options - Параметры аудио
     * @returns {Blob} WAV файл
     */
    createWavFile(base64PCMData, options = {}) {
        const pcmData = Utilities.base64Decode(base64PCMData);
        const channels = options.channels || 1;
        const sampleRate = options.sampleRate || 24000;
        const bitsPerSample = options.bitsPerSample || 16;

        const byteRate = sampleRate * channels * bitsPerSample / 8;
        const blockAlign = channels * bitsPerSample / 8;
        const dataLength = pcmData.length;

        // WAV header (44 bytes)
        const header = new ArrayBuffer(44);
        const view = new DataView(header);

        // RIFF chunk descriptor
        view.setUint32(0, 0x52494646, false); // "RIFF"
        view.setUint32(4, 36 + dataLength, true); // ChunkSize
        view.setUint32(8, 0x57415645, false); // "WAVE"

        // fmt sub-chunk
        view.setUint32(12, 0x666d7420, false); // "fmt "
        view.setUint32(16, 16, true); // Subchunk1Size
        view.setUint16(20, 1, true); // AudioFormat (PCM)
        view.setUint16(22, channels, true); // NumChannels
        view.setUint32(24, sampleRate, true); // SampleRate
        view.setUint32(28, byteRate, true); // ByteRate
        view.setUint16(32, blockAlign, true); // BlockAlign
        view.setUint16(34, bitsPerSample, true); // BitsPerSample

        // data sub-chunk
        view.setUint32(36, 0x64617461, false); // "data"
        view.setUint32(40, dataLength, true); // Subchunk2Size

        // Combine header and data
        const wavData = new Uint8Array(44 + dataLength);
        wavData.set(new Uint8Array(header), 0);
        wavData.set(pcmData, 44);

        return Utilities.newBlob(wavData, 'audio/wav');
    }

    /**
     * Сохранение аудио в Google Drive
     * @param {string} base64PCMData - Base64 PCM данные
     * @param {string} filename - Имя файла
     * @param {Object} audioOptions - Параметры аудио
     * @returns {string} ID файла в Google Drive
     */
    saveAudioToDrive(base64PCMData, filename, audioOptions = {}) {
        const wavBlob = this.createWavFile(base64PCMData, audioOptions);
        wavBlob.setName(filename);

        const file = DriveApp.createFile(wavBlob);
        return file.getId();
    }

    /**
     * Генерация речи и сохранение в Drive (полный цикл)
     * @param {string} text - Текст для озвучивания
     * @param {string} filename - Имя файла
     * @param {string} voiceName - Имя голоса
     * @param {Object} options - Дополнительные параметры
     * @returns {string} ID файла в Google Drive
     */
    generateAndSaveSpeech(text, filename, voiceName = 'Kore', options = {}) {
        console.log('Генерация речи...');
        const audioData = this.generateSpeech(text, voiceName, options);

        console.log('Сохранение аудио в Drive...');
        const fileId = this.saveAudioToDrive(audioData, filename, options.audioOptions);

        console.log(`Аудио сохранено в Drive: ${fileId}`);
        return fileId;
    }

    /**
     * Получение списка доступных голосов
     * @returns {Array} Массив доступных голосов с описанием
     */
    getAvailableVoices() {
        return [
            { name: 'Zephyr', style: 'Bright' },
            { name: 'Puck', style: 'Upbeat' },
            { name: 'Charon', style: 'Informative' },
            { name: 'Kore', style: 'Firm' },
            { name: 'Fenrir', style: 'Excitable' },
            { name: 'Leda', style: 'Youthful' },
            { name: 'Orus', style: 'Firm' },
            { name: 'Aoede', style: 'Breezy' },
            { name: 'Callirrhoe', style: 'Easy-going' },
            { name: 'Autonoe', style: 'Bright' },
            { name: 'Enceladus', style: 'Breathy' },
            { name: 'Iapetus', style: 'Clear' },
            { name: 'Umbriel', style: 'Easy-going' },
            { name: 'Algieba', style: 'Smooth' },
            { name: 'Despina', style: 'Smooth' },
            { name: 'Erinome', style: 'Clear' },
            { name: 'Algenib', style: 'Gravelly' },
            { name: 'Rasalgethi', style: 'Informative' },
            { name: 'Laomedeia', style: 'Upbeat' },
            { name: 'Achernar', style: 'Soft' },
            { name: 'Alnilam', style: 'Firm' },
            { name: 'Schedar', style: 'Even' },
            { name: 'Gacrux', style: 'Mature' },
            { name: 'Pulcherrima', style: 'Forward' },
            { name: 'Achird', style: 'Friendly' },
            { name: 'Zubenelgenubi', style: 'Casual' },
            { name: 'Vindemiatrix', style: 'Gentle' },
            { name: 'Sadachbia', style: 'Lively' },
            { name: 'Sadaltager', style: 'Knowledgeable' },
            { name: 'Sulafat', style: 'Warm' }
        ];
    }

    /**
     * Генерация структурированного JSON ответа
     * @param {string|Array} prompt - Промпт
     * @param {Object} schema - JSON схема для ответа
     * @param {Object} options - Дополнительные параметры
     * @param {string} model - Модель (опционально, по умолчанию используется this.model)
     * @returns {Object} Распарсенный JSON объект
     */
    generateStructured(prompt, schema, options = {}, model = null) {
        const selectedModel = model || this.model;
        const url = `${this.baseUrl}/${selectedModel}:generateContent?key=${this.apiKey}`;

        const payload = {
            contents: this._formatPrompt(prompt),
            generationConfig: {
                temperature: options.temperature || 0.7,
                topK: options.topK || 40,
                topP: options.topP || 0.95,
                maxOutputTokens: options.maxTokens || 2048,
                responseMimeType: 'application/json',
                responseSchema: schema,
                ...options.generationConfig
            }
        };

        if (options.safetySettings) {
            payload.safetySettings = options.safetySettings;
        }

        const response = this._makeRequest(url, payload);
        const jsonText = this._extractText(response);

        try {
            return JSON.parse(jsonText);
        } catch (error) {
            console.error('Failed to parse JSON response:', jsonText);
            throw new Error(`Ошибка парсинга JSON: ${error.message}`);
        }
    }

    /**
     * Создание схемы для структурированного вывода
     * @param {string} type - Тип ('OBJECT', 'ARRAY', 'STRING', 'INTEGER', 'NUMBER', 'BOOLEAN')
     * @param {Object} config - Конфигурация схемы
     * @returns {Object} JSON схема
     */
    createSchema(type, config = {}) {
        const schema = { type: type.toUpperCase() };

        switch (type.toUpperCase()) {
            case 'OBJECT':
                if (config.properties) {
                    schema.properties = config.properties;
                }
                if (config.required) {
                    schema.required = config.required;
                }
                if (config.propertyOrdering) {
                    schema.propertyOrdering = config.propertyOrdering;
                }
                break;

            case 'ARRAY':
                if (config.items) {
                    schema.items = config.items;
                }
                if (config.minItems) {
                    schema.minItems = config.minItems;
                }
                if (config.maxItems) {
                    schema.maxItems = config.maxItems;
                }
                break;

            case 'STRING':
                if (config.enum) {
                    schema.enum = config.enum;
                }
                if (config.format) {
                    schema.format = config.format;
                }
                break;

            case 'INTEGER':
                if (config.minimum !== undefined) {
                    schema.minimum = config.minimum;
                }
                if (config.maximum !== undefined) {
                    schema.maximum = config.maximum;
                }
                break;

            case 'NUMBER':
                if (config.minimum !== undefined) {
                    schema.minimum = config.minimum;
                }
                if (config.maximum !== undefined) {
                    schema.maximum = config.maximum;
                }
                break;
        }

        if (config.description) {
            schema.description = config.description;
        }

        return schema;
    }



    /**
     * Создание схемы для произвольной структуры данных
     * @param {Object} example - Пример объекта для создания схемы
     * @returns {Object} JSON схема на основе примера
     */
    schemaFromExample(example) {
        if (Array.isArray(example)) {
            if (example.length > 0) {
                return this.createSchema('ARRAY', {
                    items: this.schemaFromExample(example[0])
                });
            }
            return this.createSchema('ARRAY', {
                items: this.createSchema('STRING')
            });
        }

        if (typeof example === 'object' && example !== null) {
            const properties = {};
            const propertyOrdering = [];

            for (const [key, value] of Object.entries(example)) {
                properties[key] = this.schemaFromExample(value);
                propertyOrdering.push(key);
            }

            return this.createSchema('OBJECT', {
                properties: properties,
                propertyOrdering: propertyOrdering
            });
        }

        if (typeof example === 'string') {
            return this.createSchema('STRING');
        }

        if (typeof example === 'number') {
            return Number.isInteger(example) ?
                this.createSchema('INTEGER') :
                this.createSchema('NUMBER');
        }

        if (typeof example === 'boolean') {
            return this.createSchema('BOOLEAN');
        }

        return this.createSchema('STRING');
    }

    /**
     * Генерация контента с поддержкой вызова функций
     * @param {string|Array} prompt - Промпт
     * @param {Array} functionDeclarations - Массив объявлений функций
     * @param {Object} options - Дополнительные параметры
     * @param {string} model - Модель (опционально, по умолчанию используется this.model)
     * @returns {Object} Ответ с возможными вызовами функций
     */
    generateWithFunctions(prompt, functionDeclarations, options = {}, model = null) {
        const selectedModel = model || this.model;
        const url = `${this.baseUrl}/${selectedModel}:generateContent?key=${this.apiKey}`;

        const payload = {
            contents: this._formatPrompt(prompt),
            tools: [{
                functionDeclarations: functionDeclarations
            }],
            generationConfig: {
                temperature: options.temperature || 0.1, // Низкая температура для надежных вызовов функций
                topK: options.topK || 40,
                topP: options.topP || 0.95,
                maxOutputTokens: options.maxTokens || 2048,
                ...options.generationConfig
            }
        };

        if (options.safetySettings) {
            payload.safetySettings = options.safetySettings;
        }

        const response = this._makeRequest(url, payload);
        return this._extractFunctionCallResponse(response);
    }

    /**
     * Создание объявления функции для Function Calling
     * @param {string} name - Имя функции
     * @param {string} description - Описание функции
     * @param {Object} parameters - Параметры функции в формате JSON Schema
     * @returns {Object} Объявление функции
     */
    createFunctionDeclaration(name, description, parameters) {
        return {
            name: name,
            description: description,
            parameters: {
                type: 'object',
                properties: parameters.properties || {},
                required: parameters.required || []
            }
        };
    }

    /**
     * Отправка результата выполнения функции обратно в модель
     * @param {string|Array} originalPrompt - Исходный промпт
     * @param {Object} functionCallResponse - Ответ с вызовом функции
     * @param {Object} functionResult - Результат выполнения функции
     * @param {Array} functionDeclarations - Объявления функций
     * @param {Object} options - Дополнительные параметры
     * @param {string} model - Модель
     * @returns {string} Финальный ответ модели
     */
    sendFunctionResult(originalPrompt, functionCallResponse, functionResult, functionDeclarations, options = {}, model = null) {
        const selectedModel = model || this.model;
        const url = `${this.baseUrl}/${selectedModel}:generateContent?key=${this.apiKey}`;

        // Создаем историю разговора с вызовом функции и результатом
        const contents = [
            // Исходный запрос пользователя
            {
                role: 'user',
                parts: this._formatPrompt(originalPrompt)[0].parts
            },
            // Ответ модели с вызовом функции
            {
                role: 'model',
                parts: [{
                    functionCall: {
                        name: functionCallResponse.functionCall.name,
                        args: functionCallResponse.functionCall.args
                    }
                }]
            },
            // Результат выполнения функции
            {
                role: 'function',
                parts: [{
                    functionResponse: {
                        name: functionCallResponse.functionCall.name,
                        response: functionResult
                    }
                }]
            }
        ];

        const payload = {
            contents: contents,
            tools: [{
                functionDeclarations: functionDeclarations
            }],
            generationConfig: {
                temperature: options.temperature || 0.7,
                topK: options.topK || 40,
                topP: options.topP || 0.95,
                maxOutputTokens: options.maxTokens || 2048,
                ...options.generationConfig
            }
        };

        if (options.safetySettings) {
            payload.safetySettings = options.safetySettings;
        }

        const response = this._makeRequest(url, payload);
        return this._extractText(response);
    }

    /**
     * Полный цикл работы с функциями: генерация → выполнение → финальный ответ
     * @param {string|Array} prompt - Промпт
     * @param {Array} functionDeclarations - Объявления функций
     * @param {Object} functionImplementations - Реализации функций {functionName: function}
     * @param {Object} options - Дополнительные параметры
     * @param {string} model - Модель
     * @returns {string} Финальный ответ
     */
    async executeWithFunctions(prompt, functionDeclarations, functionImplementations, options = {}, model = null) {
        // Генерируем ответ с возможными вызовами функций
        const response = this.generateWithFunctions(prompt, functionDeclarations, options, model);

        if (response.functionCall) {
            const functionName = response.functionCall.name;
            const functionArgs = response.functionCall.args;

            console.log(`Вызов функции: ${functionName}`, functionArgs);

            // Проверяем, есть ли реализация функции
            if (functionImplementations[functionName]) {
                try {
                    // Выполняем функцию
                    let result;
                    if (functionImplementations[functionName].constructor.name === 'AsyncFunction') {
                        result = await functionImplementations[functionName](functionArgs);
                    } else {
                        result = functionImplementations[functionName](functionArgs);
                    }

                    console.log(`Результат функции ${functionName}:`, result);

                    // Отправляем результат обратно в модель
                    return this.sendFunctionResult(
                        prompt,
                        response,
                        { result: result },
                        functionDeclarations,
                        options,
                        model
                    );
                } catch (error) {
                    console.error(`Ошибка выполнения функции ${functionName}:`, error);

                    // Отправляем ошибку обратно в модель
                    return this.sendFunctionResult(
                        prompt,
                        response,
                        { error: error.message },
                        functionDeclarations,
                        options,
                        model
                    );
                }
            } else {
                throw new Error(`Функция ${functionName} не найдена в реализациях`);
            }
        } else {
            // Если функция не была вызвана, возвращаем обычный текстовый ответ
            return response.text;
        }
    }

    /**
     * Генерация контента с поддержкой выполнения кода
     * @param {string|Array} prompt - Промпт
     * @param {Object} options - Дополнительные параметры
     * @param {string} model - Модель (опционально, по умолчанию используется this.model)
     * @returns {Object} Ответ с возможным выполненным кодом
     */
    generateWithCodeExecution(prompt, options = {}, model = null) {
        const selectedModel = model || this.model;
        const url = `${this.baseUrl}/${selectedModel}:generateContent?key=${this.apiKey}`;

        const payload = {
            contents: this._formatPrompt(prompt),
            tools: [{
                codeExecution: {}
            }],
            generationConfig: {
                temperature: options.temperature || 0.7,
                topK: options.topK || 40,
                topP: options.topP || 0.95,
                maxOutputTokens: options.maxTokens || 2048,
                ...options.generationConfig
            }
        };

        if (options.safetySettings) {
            payload.safetySettings = options.safetySettings;
        }

        const response = this._makeRequest(url, payload);
        return this._extractCodeExecutionResponse(response);
    }

    /**
     * Генерация с поддержкой и Code execution и Function calling
     * @param {string|Array} prompt - Промпт
     * @param {Array} functionDeclarations - Объявления функций (опционально)
     * @param {Object} options - Дополнительные параметры
     * @param {string} model - Модель
     * @returns {Object} Ответ с кодом и/или вызовами функций
     */
    generateWithTools(prompt, functionDeclarations = [], options = {}, model = null) {
        const selectedModel = model || this.model;
        const url = `${this.baseUrl}/${selectedModel}:generateContent?key=${this.apiKey}`;

        const tools = [
            { codeExecution: {} }
        ];

        if (functionDeclarations.length > 0) {
            tools.push({
                functionDeclarations: functionDeclarations
            });
        }

        const payload = {
            contents: this._formatPrompt(prompt),
            tools: tools,
            generationConfig: {
                temperature: options.temperature || 0.7,
                topK: options.topK || 40,
                topP: options.topP || 0.95,
                maxOutputTokens: options.maxTokens || 2048,
                ...options.generationConfig
            }
        };

        if (options.safetySettings) {
            payload.safetySettings = options.safetySettings;
        }

        const response = this._makeRequest(url, payload);
        return this._extractCodeExecutionResponse(response);
    }

    /**
     * Решение математических задач с помощью кода
     * @param {string} problem - Математическая задача
     * @param {Object} options - Дополнительные параметры
     * @param {string} model - Модель
     * @returns {Object} Решение с кодом и результатом
     */
    solveMathProblem(problem, options = {}, model = null) {
        const prompt = `
            Реши следующую математическую задачу, используя Python код:
            
            ${problem}
            
            Напиши код для решения и выполни его, чтобы получить точный ответ.
        `;

        return this.generateWithCodeExecution(prompt, options, model);
    }

    /**
     * Анализ данных с помощью кода
     * @param {string} dataDescription - Описание данных для анализа
     * @param {string} analysisRequest - Что нужно проанализировать
     * @param {Object} options - Дополнительные параметры
     * @param {string} model - Модель
     * @returns {Object} Анализ с кодом и результатами
     */
    analyzeData(dataDescription, analysisRequest, options = {}, model = null) {
        const prompt = `
            У меня есть следующие данные: ${dataDescription}
            
            Мне нужно: ${analysisRequest}
            
            Напиши Python код для анализа данных и выполни его. 
            Используй подходящие библиотеки (pandas, numpy, matplotlib, seaborn и т.д.).
        `;

        return this.generateWithCodeExecution(prompt, options, model);
    }

    /**
     * Создание визуализации данных
     * @param {string} dataDescription - Описание данных
     * @param {string} chartType - Тип графика
     * @param {Object} options - Дополнительные параметры
     * @param {string} model - Модель
     * @returns {Object} Код и график
     */
    createVisualization(dataDescription, chartType, options = {}, model = null) {
        const prompt = `
            Создай ${chartType} для следующих данных: ${dataDescription}
            
            Используй matplotlib или seaborn для создания красивой и информативной визуализации.
            Добавь подписи осей, заголовок и легенду где необходимо.
        `;

        return this.generateWithCodeExecution(prompt, options, model);
    }

    /**
     * Обработка файлов с помощью кода
     * @param {string} fileDescription - Описание файла
     * @param {string} task - Задача обработки
     * @param {Object} options - Дополнительные параметры
     * @param {string} model - Модель
     * @returns {Object} Код обработки файла
     */
    processFile(fileDescription, task, options = {}, model = null) {
        const prompt = `
            У меня есть файл: ${fileDescription}
            
            Мне нужно: ${task}
            
            Напиши Python код для обработки файла. 
            Используй подходящие библиотеки (pandas для CSV, openpyxl для Excel, PyPDF2 для PDF и т.д.).
        `;

        return this.generateWithCodeExecution(prompt, options, model);
    }

    /**
     * Установка новой модели
     * @param {string} model - Название модели
     */
    setModel(model) {
        this.model = model;
    }

    /**
     * Форматирование промпта
     * @private
     */
    _formatPrompt(prompt) {
        if (typeof prompt === 'string') {
            return [{ parts: [{ text: prompt }] }];
        }

        if (Array.isArray(prompt)) {
            // Если уже в правильном формате
            if (prompt[0] && prompt[0].parts) {
                return prompt;
            }

            // Если это массив сообщений чата
            if (prompt[0] && prompt[0].role) {
                return prompt.map(msg => ({
                    role: msg.role,
                    parts: [{ text: msg.text }]
                }));
            }
        }

        return [{ parts: [{ text: String(prompt) }] }];
    }

    /**
     * Выполнение HTTP запроса
     * @private
     */
    _makeRequest(url, payload) {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            payload: JSON.stringify(payload)
        };

        try {
            const response = UrlFetchApp.fetch(url, options);
            const responseText = response.getContentText();

            if (response.getResponseCode() !== 200) {
                throw new Error(`API Error: ${response.getResponseCode()} - ${responseText}`);
            }

            return JSON.parse(responseText);
        } catch (error) {
            console.error('Request failed:', error);
            throw new Error(`Request failed: ${error.message}`);
        }
    }

    /**
     * Извлечение текста из ответа
     * @private
     */
    _extractText(response) {
        try {
            if (response.candidates && response.candidates.length > 0) {
                const candidate = response.candidates[0];
                if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
                    return candidate.content.parts[0].text;
                }
            }

            throw new Error('Неожиданный формат ответа от API');
        } catch (error) {
            console.error('Error extracting text:', error);
            throw new Error(`Ошибка обработки ответа: ${error.message}`);
        }
    }

    /**
     * Извлечение текста и изображений из ответа
     * @private
     */
    _extractImageResponse(response) {
        try {
            const result = {
                text: '',
                images: []
            };

            if (response.candidates && response.candidates.length > 0) {
                const candidate = response.candidates[0];
                if (candidate.content && candidate.content.parts) {
                    for (const part of candidate.content.parts) {
                        if (part.text) {
                            result.text += part.text;
                        } else if (part.inlineData) {
                            result.images.push({
                                data: part.inlineData.data,
                                mimeType: part.inlineData.mimeType
                            });
                        }
                    }
                }
            }

            return result;
        } catch (error) {
            console.error('Error extracting image response:', error);
            throw new Error(`Ошибка обработки ответа с изображениями: ${error.message}`);
        }
    }

    /**
     * Извлечение аудио данных из ответа
     * @private
     */
    _extractAudioData(response) {
        try {
            if (response.candidates && response.candidates.length > 0) {
                const candidate = response.candidates[0];
                if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
                    const part = candidate.content.parts[0];
                    if (part.inlineData && part.inlineData.data) {
                        return part.inlineData.data;
                    }
                }
            }

            throw new Error('Неожиданный формат ответа от TTS API');
        } catch (error) {
            console.error('Error extracting audio data:', error);
            throw new Error(`Ошибка извлечения аудио данных: ${error.message}`);
        }
    }

    /**
     * Извлечение ответа с вызовами функций
     * @private
     */
    _extractFunctionCallResponse(response) {
        try {
            const result = {
                text: '',
                functionCall: null
            };

            if (response.candidates && response.candidates.length > 0) {
                const candidate = response.candidates[0];
                if (candidate.content && candidate.content.parts) {
                    for (const part of candidate.content.parts) {
                        if (part.text) {
                            result.text += part.text;
                        } else if (part.functionCall) {
                            result.functionCall = {
                                name: part.functionCall.name,
                                args: part.functionCall.args
                            };
                        }
                    }
                }
            }

            return result;
        } catch (error) {
            console.error('Error extracting function call response:', error);
            throw new Error(`Ошибка обработки ответа с вызовами функций: ${error.message}`);
        }
    }

    /**
     * Извлечение ответа с выполненным кодом
     * @private
     */
    _extractCodeExecutionResponse(response) {
        try {
            const result = {
                text: '',
                executableCode: [],
                codeExecutionResults: [],
                functionCall: null,
                images: []
            };

            if (response.candidates && response.candidates.length > 0) {
                const candidate = response.candidates[0];
                if (candidate.content && candidate.content.parts) {
                    for (const part of candidate.content.parts) {
                        if (part.text) {
                            result.text += part.text;
                        } else if (part.executableCode) {
                            result.executableCode.push({
                                language: part.executableCode.language,
                                code: part.executableCode.code
                            });
                        } else if (part.codeExecutionResult) {
                            result.codeExecutionResults.push({
                                outcome: part.codeExecutionResult.outcome,
                                output: part.codeExecutionResult.output
                            });
                        } else if (part.functionCall) {
                            result.functionCall = {
                                name: part.functionCall.name,
                                args: part.functionCall.args
                            };
                        } else if (part.inlineData) {
                            // Для изображений, созданных matplotlib
                            result.images.push({
                                data: part.inlineData.data,
                                mimeType: part.inlineData.mimeType
                            });
                        }
                    }
                }
            }

            return result;
        } catch (error) {
            console.error('Error extracting code execution response:', error);
            throw new Error(`Ошибка обработки ответа с выполненным кодом: ${error.message}`);
        }
    }
}


