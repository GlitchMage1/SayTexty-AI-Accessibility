from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse, HttpResponseBadRequest
from .models import * 
from django.conf import settings
from django.utils import translation
from django.utils.translation import get_language
import json
from django.views.decorators.http import require_POST
from django.utils import timezone





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





@require_POST
def api_start_session(request):

    try:
        data = json.loads(request.body.decode("utf-8"))
    except json.JSONDecodeError:
        data = request.POST
    

    mode = data.get('mode', 'converstation')
    language = data.get('language', 'en')


    if mode not in ('lecture', 'conversation'):
        return HttpResponseBadRequest('Invalide mode')

    if language not in ('en', 'ru', 'uz'):
        return HttpResponseBadRequest('Invalide language')


    session = Session.objects.create(
        title = '',
        mode=mode,
        language=language,

    )


    return JsonResponse({'session_id':session.id})



@require_POST
def api_upload_chunk(request, session_id):


    try:
        session = Session.objects.get(id=session_id)
    except Session.DoesNotExist:
        return HttpResponseBadRequest("Uknown session")
    
    audio_file = request.FILES.get('audio')
    start_ms = request.POST.get('start_ms')
    end_ms = request.POST.get('end_ms')


    try:
        start_ms = int(start_ms) if start_ms is not None else None
    except ValueError:
        start_ms = None
    
    try:
        end_ms = int(end_ms) if end_ms is not None else None
    except ValueError:
        end_ms = None


    now_str = timezone.now().strftime("%H:%M:%S")
    recognized_text = f"[chunk @ {now_srt}] Fake transcript text..."


    chunk = TranscriptChunk.objects.create(
        session=session,
        speaker='A',
        text=recognized_text,
        start_ms=start_ms,
        end_ms=end_ms,
    )
    

    return JsonResponse(
        {
            "id": chunk.id,
            "text": chunk.text,
            "start_ms": chunk.start_ms,
            "end_ms": chunk.end_ms,
        }
    )