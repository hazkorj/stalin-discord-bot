# Use the official Node.js image as the base image
FROM node:20.0-alpine

# Устанавливаем ethtool для настройки параметров сетевого буфера
RUN apk add --update ethtool

# Получаем имя сетевого интерфейса и устанавливаем размер буфера
ARG INTERFACE=eth0
ENV SOCKET_BUFFER=16777216

# Устанавливаем параметры сетевого интерфейса
RUN ethtool -G $INTERFACE rx $SOCKET_BUFFER tx $SOCKET_BUFFER

# Обновление пакетов и установка необходимых зависимостей
RUN apk add --update ffmpeg

ENV PATH="/usr/bin/ffmpeg:${PATH}"

WORKDIR /app

COPY . /app

# Install the application dependencies
RUN npm install

# Экспорт порта
EXPOSE 8080

# Define the entry point for the container

CMD ["npm", "start"]