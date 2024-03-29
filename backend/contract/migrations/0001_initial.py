# Generated by Django 5.0.2 on 2024-03-02 10:19

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Contract',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('accept_worker', models.BooleanField(default=False)),
                ('accept_client', models.BooleanField(default=False)),
                ('description', models.TextField(max_length=500)),
                ('initial_date', models.DateField()),
                ('end_date', models.DateField()),
                ('cost', models.IntegerField()),
                ('status', models.CharField(choices=[('Ne', 'Negociacion'), ('Ac', 'Aceptado'), ('En', 'En proceso'), ('Fi', 'Finalizado'), ('Ca', 'Cancelado'), ('Pa', 'Pagado')], default='Ne', max_length=2)),
            ],
        ),
    ]
