# Используем базовый образ с Node.js
FROM node:20

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# Копируем package.json и yarn.lock
COPY package*.json ./

# Устанавливаем зависимости
RUN yarn install

# Копируем весь проект
COPY . .

# Собираем приложение
RUN yarn build

# Указываем порт, который будет использовать приложение
EXPOSE 5000

# Команда для запуска приложения
CMD ["yarn", "start:dev"]
