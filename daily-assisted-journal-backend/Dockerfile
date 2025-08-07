FROM python:3.13.5-slim

WORKDIR /app

COPY app/ ./app
COPY requirements.txt .
COPY firebaseServerKey.json .

RUN apt-get update && apt-get install -y gcc libpq-dev
RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 5000

CMD ["python", "app/app.py"]