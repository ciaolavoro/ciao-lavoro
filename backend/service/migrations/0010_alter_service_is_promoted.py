# Generated by Django 5.0.2 on 2024-04-06 15:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('service', '0009_alter_service_is_promoted'),
    ]

    operations = [
        migrations.AlterField(
            model_name='service',
            name='is_promoted',
            field=models.DateField(null=True),
        ),
    ]