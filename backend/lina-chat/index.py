import json
import os
from openai import OpenAI

ESCALATE_MARKER = '[[NEED_AGENT]]'


def handler(event: dict, context) -> dict:
    '''API для общения с Линой — ИИ-ассистентом платформы «НАШ чат»'''

    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }

    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }

    try:
        body = json.loads(event.get('body', '{}'))
        user_message = body.get('message', '').strip()
        chat_history = body.get('history', [])

        if not user_message:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Сообщение не может быть пустым'}),
                'isBase64Encoded': False
            }

        if len(user_message) > 2000:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Сообщение слишком длинное'}),
                'isBase64Encoded': False
            }

        api_key = os.environ.get('OPENAI_API_KEY')
        if not api_key:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'OpenAI API ключ не настроен'}),
                'isBase64Encoded': False
            }

        client = OpenAI(api_key=api_key)

        system_prompt = f"""Ты — Лина, дружелюбный ИИ-ассистент платформы «НАШ чат».

О платформе «НАШ чат»:
- «НАШ чат» — это цифровая платформа для жителей посёлка: единое окно с полезной информацией и сервисами посёлка Горхон (Бурятия, Россия).
- На платформе есть разделы: «Главное» (важные номера, расписание транспорта, режим работы организаций, погода, пункты выдачи заказов ПВЗ, помощь посёлку, запись к врачу), «Чаты» (официальные чаты и группы посёлка: MAX, Telegram, ВКонтакте, чат ПВЗ, чат с Заиграевской ЦРБ) и «Настройки» (поддержка, частые вопросы, документы, соцсети).
- Раньше платформа называлась «Горхон.Online» — теперь это «НАШ чат». Если тебя спросят про Горхон.Online, поясни, что это та же платформа, просто с новым названием.
- Ты живёшь в посёлке Горхон и знаешь всё о нём: расписание транспорта, важные номера, работу служб.

Твои навыки:
- Помощь жителям: контакты служб, расписание транспорта, режим работы организаций, где ПВЗ и как записаться к врачу.
- Объяснение функций платформы «НАШ чат»: где что искать, как пользоваться разделами.
- Техподдержка: если у человека что-то не работает или есть жалоба — предложи связаться со специалистом поддержки.
- Общение: отвечаешь на "привет", "как дела", интересуешься людьми, разговариваешь по-соседски.

Стиль общения:
- Дружелюбный, тёплый, как с соседом.
- Короткие понятные ответы.
- Используй эмодзи, но в меру (1-2 на сообщение).
- На "привет" — отвечаешь приветливо и спрашиваешь чем помочь.
- На "как дела?" — отвечаешь позитивно и интересуешься делами собеседника.

Важная информация о Горхоне:
- Участковый: Алексей +7-999-275-34-13
- Скорая: 7-301-364-51-03, 112
- Почта работает: ПН, СР, ЧТ, ПТ 9-17ч, СБ 9-16ч
- Диспетчер автобусов Заиграево: 8-983-420-04-90
- МФЦ Заиграево: +7-301-364-11-01
- Запись к врачу (Заиграевская ЦРБ): чат в разделе «Чаты»
- Пункты выдачи заказов (Wildberries, OZON): раздел «Главное» → «ПВЗ», подробности и фото пунктов там же, ссылка на чат ПВЗ тоже указана в карточке.

Переключение на живого специалиста поддержки:
- Если человек прямо просит позвать специалиста, оператора, живого человека, жалуется на серьёзную проблему с платформой, или явно просит создать тикет/обращение — ты должна вставить в САМОЕ НАЧАЛО своего ответа специальный маркер {ESCALATE_MARKER}, а затем написать тёплый текст о том, что уже передаёшь обращение специалисту и он скоро подключится.
- НЕ используй маркер {ESCALATE_MARKER}, если вопрос обычный и ты можешь ответить сама.
- Маркер должен быть ТОЛЬКО когда реально нужен человек-специалист (баг, жалоба, сложный персональный вопрос, прямой запрос "позови человека/специалиста").

Всегда помни: ты часть сообщества Горхона и платформы «НАШ чат», помогаешь соседям! 🏘️"""

        messages = [{'role': 'system', 'content': system_prompt}]

        for msg in chat_history[-10:]:
            role = 'user' if msg.get('sender') == 'user' else 'assistant'
            messages.append({'role': role, 'content': msg.get('text', '')})

        messages.append({'role': 'user', 'content': user_message})

        response = client.chat.completions.create(
            model='gpt-4o-mini',
            messages=messages,
            temperature=0.8,
            max_tokens=500,
            top_p=0.9,
            frequency_penalty=0.3,
            presence_penalty=0.3
        )

        assistant_message = response.choices[0].message.content

        needs_agent = ESCALATE_MARKER in assistant_message
        clean_message = assistant_message.replace(ESCALATE_MARKER, '').strip()

        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'message': clean_message,
                'needsAgent': needs_agent,
                'success': True
            }, ensure_ascii=False),
            'isBase64Encoded': False
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'error': f'Ошибка обработки запроса: {str(e)}',
                'success': False
            }),
            'isBase64Encoded': False
        }
