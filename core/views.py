from django.shortcuts import render, redirect
from django.http import HttpResponse  
from .models import * 



LANG_TEXTS = {
    "en": {
        "title": "HearMe — your AI accessibility assistant",
        "subtitle": "Real-time speech-to-text and smart summaries for everyone.",
        "start_button": "Start session",
        "description": "Choose your language and start a new session to see HearMe in action.",
    },
    "ru": {
        "title": "HearMe — ваш AI-помощник по доступности",
        "subtitle": "Речь в текст и умные конспекты в реальном времени.",
        "start_button": "Начать сессию",
        "description": "Выберите язык и начните новую сессию, чтобы увидеть HearMe в действии.",
    },
    "uz": {
        "title": "HearMe — sizning AI imkoniyat yordamchingiz",
        "subtitle": "Nutqni matnga aylantirish va aqlli konspektlar real vaqt rejimida.",
        "start_button": "Sessiyani boshlash",
        "description": "Tilni tanlang va HearMe ishini ko'rish uchun yangi sessiyani boshlang.",
    },
}









def index(request):

    lang = request.GET.get('lang', 'en')


    if lang not in LANG_TEXTS:
        lang='en'

    
    texts = LANG_TEXTS[lang]


    context = {
        'texts':texts,
        'lang':lang,
    }


    return render(request, "index_standard.html", context)



def set_language(request):

    lang = request.GET.get('lang')

    if lang not in LANG_TEXTS.keys():
        lang = 'en'

    request.session['lang'] = lang

    return redirect('index')






def start_session(request):
    pass



