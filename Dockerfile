FROM php:8.0-apache
EXPOSE 80
COPY ./src/ /var/www/html/
RUN chown -R www-data:www-data /var/www/html && chmod -R 755 /var/www/html
