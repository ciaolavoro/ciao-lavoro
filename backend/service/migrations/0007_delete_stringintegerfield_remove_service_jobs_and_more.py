# Generated by Django 5.0.2 on 2024-02-29 10:05

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('service', '0006_rename_work_job_alter_job_options_and_more'),
    ]

    operations = [
        migrations.DeleteModel(
            name='StringIntegerField',
        ),
        migrations.RemoveField(
            model_name='service',
            name='jobs',
        ),
        migrations.AddField(
            model_name='job',
            name='service',
            field=models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, to='service.service'),
            preserve_default=False,
        ),
    ]