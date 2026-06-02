FROM python:3.10

WORKDIR /code

COPY ./requirements.txt /code/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

COPY . /code

# Menjalankan FastAPI di port 7860 (wajib untuk Hugging Face Docker Space)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]