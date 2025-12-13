
from django.conf import settings
from django.contrib import admin
from django.urls import path
from django.conf.urls.static import static

from .views import *

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", index, name='index'),
    path('set-language/', set_language, name='set_language'),
    path('set-mode/', set_mode, name='set_mode'),

    path('api/session/start/', api_start_session, name='api_start_session'),
    path('api/session/<int:session_id>/chunk/', api_upload_chunk, name='api_upload_chunk'),
]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


