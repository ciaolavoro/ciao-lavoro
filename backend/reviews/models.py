from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator
from account.models import Account

class Review(models.Model):
    author = models.OneToOneField(Account, on_delete=models.CASCADE, related_name = 'author_review')
    stars = models.IntegerField(validators=[MaxValueValidator(5), MinValueValidator(0)])
    worker = models.OneToOneField(Account, on_delete= models.CASCADE, related_name = 'receiver_review')
    description = models.TextField(max_length= 1000)
    date = models.DateField()