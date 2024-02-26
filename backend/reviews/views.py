import datetime
from django.shortcuts import redirect, render
from django.contrib.auth.decorators import login_required

from backend.api.forms import ReviewForm
from .models import Review

# Create your views here.

def review_list(request):
    review = Review.objects.all()
    return render(request, 'review_list.html', {'review': review})

@login_required
def create_review(request, worker_id):
    if request.method == 'POST':
        form = ReviewForm(request.POST)
        if form.is_valid():
            review = form.save(commit=False)
            review.author = request.account
            review.worker = worker_id
            review.date = datetime.now()
            review.save()

            return redirect('nosedondejiji')

    else:
        form = ReviewForm()
    return render(request, 'create_review.html', {'form': form})