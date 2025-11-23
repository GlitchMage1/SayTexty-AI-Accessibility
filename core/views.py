from django.shortcuts import render, redirect
from django.http import HttpResponse  
from .models import * 
from django.conf import settings
from django.utils import translation
from django.utils.translation import get_language








def index(request):

    print("SESSION:", request.session.get("django_language"))
    print("ACTIVE :", get_language())    


    return render(request, "index_standard.html")



def set_language(request):

    language = request.POST.get('language')
    url = request.POST.get('next', '/')

    valid_languages = [lang_code for lang_code, _ in settings.LANGUAGES]
    if language not in valid_languages:
        language = settings.LANGUAGE_CODE 

    request.session['django_language'] = language


    print("🔥 set_language called!")
    print("POST =", request.POST)

    return redirect(url)






def start_session(request):
    pass



