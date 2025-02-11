FROM python:3.11-slim

# Aktualisiere die Paketlisten und installiere notwendige Abhängigkeiten
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libsqlite3-dev 

# Setze das Arbeitsverzeichnis im Container
WORKDIR /app

# Kopiere die requirements.txt Datei (falls vorhanden) und installiere Abhängigkeiten
COPY requirements.txt .
RUN pip install -r requirements.txt

# Kopiere den restlichen Code
COPY . .

# Kopiere die data.json Datei
#COPY data.json .

# Migrationen durchführen
RUN python manage.py makemigrations
RUN python manage.py migrate

# Daten laden
#RUN python manage.py loaddata data.json

# Setze Umgebungsvariablen (optional, aber oft benötigt)
ENV DJANGO_SETTINGS_MODULE=join_backend.settings
ENV DEBUG=True

# Port freigeben (optional, aber oft benötigt)
EXPOSE 8000

# Befehl zum Starten des Django-Servers
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]