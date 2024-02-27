from django import forms

from backend.reviews.models import Review

class ReviewForm(forms.Form):
    class Meta:
        model = Review
        fields = ['stars', 'description']
        widgets = {
            'stars': forms.NumberInput(attrs={
                'placeholder': 'Precio por dia "00.00"',
                'class':'form-control'}),
            'description': forms.Textarea(attrs={
                'rows': 4,
                'class':'form-control'
                })
        }
    