# Use the official Node.js image as the base image
FROM node:20.0-alpine

# Обновление пакетов и установка необходимых зависимостей
RUN apk add --update ffmpeg

RUN echo 'net.core.rmem_max=10485760' >> /etc/sysctl.conf \
    && echo 'net.core.wmem_max=10485760' >> /etc/sysctl.conf \
    && sysctl -p

ENV PATH="/usr/bin/ffmpeg:${PATH}"

WORKDIR /app

COPY . /app

# Install the application dependencies
RUN npm install

# Экспорт порта
EXPOSE 8080

# Define the entry point for the container

CMD ["npm", "start"]