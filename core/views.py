from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse 
from .models import * 
from django.conf import settings
from django.utils import translation
from django.utils.translation import get_language








def index(request):

    print("SESSION:", request.session.get("django_language"))
    print("ACTIVE :", get_language())    


    ui_mode = request.session.get('ui_mode', 'standard')
    if ui_mode not in ('standard', 'pro'):
        ui_mode = 'standard'




    context = {
        'mode': ui_mode,
    }

    print("SESSION ui_mode =", request.session.get("ui_mode"))

    return render(request, "index_standard.html", context)







def set_mode(request):

    if request.method != 'POST':
        return JsonResponse({'ok':False, 'error':'Only POST allowed'}, status=405)
    
    mode = request.POST.get('mode')
    print("AJAX set_mode, raw mode:", mode)
    

    if mode not in ('standard', 'pro'):
        return JsonResponse({'ok':False, 'error':'Invalid mode'}, status=400)
    
    request.session['ui_mode'] = mode
    print("SESSION ui_mode set to:", request.session.get("ui_mode"))
    return JsonResponse({'ok':True, 'mode':mode})



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



