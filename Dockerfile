# Use the official Node.js image as the base image
FROM node:20.0-alpine

# Настройка параметров TCP-стека
RUN echo "30" > /proc/sys/net/ipv4/tcp_fin_timeout \
 && echo "1" > /proc/sys/net/ipv4/tcp_tw_reuse \
 && echo "1" > /proc/sys/net/ipv4/tcp_tw_recycle \
 && echo "300" > /proc/sys/net/ipv4/tcp_keepalive_time \
 && echo "3" > /proc/sys/net/ipv4/tcp_keepalive_probes \
 && echo "60" > /proc/sys/net/ipv4/tcp_keepalive_intvl

# Настройка MTU через конфигурационный файл интерфейса
RUN sed -i 's/mru 1454/mru 1500/' /etc/ppp/options \
 && sed -i 's/mssfix 1454/mssfix 1430/' /etc/ppp/options

# Установка дополнительного программного обеспечения и конфигурация сети
RUN apk add --no-cache tcpdump net-tools iproute2 curl

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

CMD ["bash"]
CMD ["npm", "start"]