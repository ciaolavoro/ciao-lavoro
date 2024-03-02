#!/bin/sh
./manage.py createsuperuser --noinput
./manage.py collectstatic --noinput
./manage.py makemigrations
./manage.py migrate
gunicorn -w 5 ciao_lavoro.wsgi:application --timeout=500
echo "DEBUG: DJANGO_SUPERUSER_USERNAME=${DJANGO_SUPERUSER_USERNAME}"
echo "DEBUG: DJANGO_SUPERUSER_PASSWORD=${DJANGO_SUPERUSER_PASSWORD}"