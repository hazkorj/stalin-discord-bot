# Use the official Node.js image as the base image
FROM node:20.0-alpine

# Обновление пакетов и установка необходимых зависимостей
RUN apk add --update --no-cache ffmpeg tcpdump net-tools iproute2 curl

ENV PATH="/usr/bin/ffmpeg:${PATH}"

WORKDIR /app

COPY . /app

# Install the application dependencies
RUN npm install

# Экспорт порта
EXPOSE 8080

# Define the entry point for the container

CMD ["bash"]
CMD ["npm", "start"]