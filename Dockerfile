# Use the official Node.js image as the base image
FROM ubuntu:latest
LABEL maintainer="hazkorj <hazkorj@yandex.ru>"

# Обновление пакетов и установка необходимых зависимостей
RUN apt-get update && \
    apt-get install -y ffmpeg && \
    apt-get install -y nodejs

WORKDIR /app

COPY . /app

# Install the application dependencies
RUN npm install

# Экспорт порта
EXPOSE 8080

# Define the entry point for the container

CMD ["npm", "start"]