# Marketplace
Тестовое задание; 
REST API BackEnd для интернет-магазина;
Книжный интернет-магазин;
Реализованы все необходимые функции для работы интернет-магазина;

Используемый стек технологий: 
  nodejs, 
  koa, 
  joi, 
  jsonwebtoken, 
  bcrypt, 
  mysql, 
  typeorm, 
  uuid, 
  koa-body,
  koa-router,
  koa-static.

Описание структуры проекта:
  bd - модели сущностей БД, файл подключения к БД;
  controllers - классы (контроллеры) для работы с каждой из сущностей в БД;
  docs - спецификация (модели, api) openapi, stoplight;
  middleware - аутентификация, проверка роли;
  router - маршруты;
  static - папка для статики;
  validation - скрипты валидации данных (joi);
  app.js - главный запускаемый файл;
  ormconfig.json - конфигурация подключения к БД через typeorm;
  config.json - различные константы.

