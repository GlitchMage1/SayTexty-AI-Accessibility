from django.utils import translation

class SessionLanguageMiddleware:
    """
    """

    def __init__(self, get_response):

        self.get_response = get_response

    def __call__(self, request):

        lang = request.session.get("django_language")

        if lang:

            translation.activate(lang)

            request.LANGUAGE_CODE = lang


        response = self.get_response(request)


        translation.deactivate()

        return response