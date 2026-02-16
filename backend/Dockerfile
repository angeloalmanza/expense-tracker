FROM php:8.3-cli
RUN apt-get update && apt-get install -y git curl zip unzip libpng-dev libonig-dev libxml2-dev libpq-dev
RUN docker-php-ext-install pdo_pgsql pgsql mbstring exif pcntl bcmath gd
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
WORKDIR /var/www
COPY . .
RUN composer install --no-interaction --optimize-autoloader
EXPOSE 8000
CMD ["sh", "-c", "[ -f .env ] && php artisan key:generate --force --no-ansi; php artisan migrate --force --no-ansi; php artisan serve --host=0.0.0.0 --port=8000"]
