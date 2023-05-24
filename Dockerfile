# Use the official Node.js image as the base image
FROM alpine:latest

# Обновление пакетов и установка необходимых зависимостей
RUN apk add --update ffmpeg nodejs npm

ENV PATH="/usr/bin/ffmpeg:${PATH}"

WORKDIR /app

COPY . /app

# Install the application dependencies
RUN npm install

# Экспорт порта
EXPOSE 8080

# Define the entry point for the container

CMD ["npm", "start"]