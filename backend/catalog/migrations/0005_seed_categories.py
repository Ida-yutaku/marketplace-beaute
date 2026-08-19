from django.db import migrations

CATEGORIES = [
    ("Soins", "soins"),
    ("Maquillage", "maquillage"),
    ("Cheveux", "cheveux"),
    ("Parfum", "parfum"),
]


def seed_categories(apps, schema_editor):
    Category = apps.get_model("catalog", "Category")
    for name, slug in CATEGORIES:
        Category.objects.get_or_create(slug=slug, defaults={"name": name})


def remove_old_categories(apps, schema_editor):
    Category = apps.get_model("catalog", "Category")
    valid_slugs = {slug for _, slug in CATEGORIES}
    Category.objects.exclude(slug__in=valid_slugs).delete()


class Migration(migrations.Migration):

    dependencies = [
        ("catalog", "0004_product_video"),
    ]

    operations = [
        migrations.RunPython(seed_categories, migrations.RunPython.noop),
        migrations.RunPython(remove_old_categories, migrations.RunPython.noop),
    ]
