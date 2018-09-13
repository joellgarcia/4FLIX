FROM ubuntu
RUN apt-get update
RUN apt-get install -y apache2 && apt-get clean
ADD frontend.tar.gz /var/www/html/
ADD mod_status /tmp/
RUN cat /tmp/mod_status >> /usr/local/apache2/conf/httpd.conf
EXPOSE 80
CMD apachectl -D FOREGROUND
