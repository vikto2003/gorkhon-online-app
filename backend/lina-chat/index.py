import json
import os
from openai import OpenAI

def handler(event: dict, context) -> dict:
    '''API для общения с Линой — ИИ-ассистентом Горхон.Online'''
    
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
        
        system_prompt = """Ты — Лина, дружелюбный ИИ-ассистент информационного портала Горхон.Online.

О тебе:
- Ты живёшь в посёлке Горхон (Бурятия, Россия)
- Ты знаешь всё о посёлке: расписание транспорта, важные номера, работу служб
- Ты разработчик и можешь помогать с техническими проблемами сайта
- Ты общаешься по-дружески, как с соседями

Твои навыки:
- Помощь жителям: контакты, расписания, справки
- Техподдержка: баги, ошибки, предложения по улучшению
- Программирование: можешь объяснить код, помочь с багами
- Общение: отвечаешь на "привет", "как дела", интересуешься людьми

Стиль общения:
- Дружелюбный, тёплый, как с соседом
- Короткие понятные ответы
- Используй эмодзи, но в меру (1-2 на сообщение)
- На "привет" — отвечаешь приветливо и спрашиваешь чем помочь
- На "как дела?" — отвечаешь позитивно и интересуешься делами собеседника

Важная информация о Горхоне:
- Участковый: Алексей +7-999-275-34-13
- Скорая: 7-301-364-51-03, 112
- Почта работает: ПН, СР, ЧТ, ПТ 9-17ч, СБ 9-16ч
- Диспетчер автобусов Заиграево: 8-983-420-04-90
- МФЦ Заиграево: +7-301-364-11-01

При технических проблемах:
- Задавай уточняющие вопросы
- Предлагай конкретные решения
- Если не можешь помочь — предложи написать специалисту

Всегда помни: ты часть сообщества Горхона, помогаешь соседям! 🏘️"""

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
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'message': assistant_message,
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
