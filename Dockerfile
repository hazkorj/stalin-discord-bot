# Use the official Node.js image as the base image
FROM node:20.0-alpine

RUN apk update && apk upgrade
RUN apk add --update --no-cache bash openssh-client ffmpeg tcpdump net-tools iproute2 curl

# Настройка SSH для подключения к удаленному хосту
RUN mkdir -p /root/.ssh
RUN ssh-keygen -f /root/.ssh/id_rsa -t rsa -N ''
RUN echo "Host <REMOTE_HOST>" >> /root/.ssh/config
RUN echo "    StrictHostKeyChecking no" >> /root/.ssh/config
RUN cat /root/.ssh/id_rsa.pub | ssh <REMOTE_USER>@<REMOTE_HOST> 'mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys'

# Копируем файл конфигурации сети и назначаем его путь
COPY network-config /etc/network/interfaces

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