from django.db import models




сlass Session(models.Model): # type: ignore
    MODE_CHOICES = [
        ('lecture','Lecture Mode'),
        ('conversation', 'Conversation Mode'),
    ]

    LANG_CHOICES = [
        ("en", "English"),
        ("ru", "Russian"),
        ("uz", "Uzbek"),
    ]

    title = models.CharField(max_length=200, blank=True, default="")
    mode = models.CharField(max_length=20, choices=MODE_CHOICES, default="conversation")
    language = models.CharField(max_length=10, choices=LANG_CHOICES, default="en")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    def str(self):
        return f"{self.title or 'Session'} ({self.get_mode_display()} - {self.language})"



class TranscriptChunk(models.Model):
    SPEAKER_CHOICES = [
        ('A', "Speaker A"),
        ('B', 'Speaker B'),
        ('sys', 'System'),
    ]


    session = models.ForeignKey(Session, on_delete=models.CASCADE, related_name='chunks')
    speaker = models.CharField(max_length=20, choices=SPEAKER_CHOICES, default='A')
    text = models.TextField()
    start_ms = models.IntegerField(null=True, blank=True)
    end_ms = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)


    class Meta:
        ordering = ['id']

    def str(self):
        return f"{self.speaker}: {self.text[:50]}"
    


class Summary(models.Model):
    KIND_CHOICES = [
        ('general', 'General Summary'),
        ('simplified', 'Simplified Summary'),
        ('study_notes', 'Study Notes'),
    ]

    session = models.ForeignKey(Session, on_delete=models.CASCADE, related_name='summaries')
    kind = models.CharField(max_length=20, choices=KIND_CHOICES, default='general')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)


    def str(self):
        return f"{self.get_kind_display()} for Session #{self.session.id}"
    

class UserSettings(models.Model):
    FONT_SIZE_CHOICES = [
        ('small', 'Small'),
        ('medium', 'Medium'),
        ('large', 'Large'),
    ]
    THEME_CHOICES = [
        ('light', 'Light'),
        ('dark', 'Dark'),
        ('contrast', 'High Contrast'),
    ]

    font_size = models.CharField(max_length=10, choices=FONT_SIZE_CHOICES, default='medium')
    theme = models.CharField(max_length=10, choices=THEME_CHOICES, default='light')
    simplified_mode = models.BooleanField(default=False)

    def str(self):
        return f"Setting {self.theme}, {self.font_size}"