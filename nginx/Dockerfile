# NGINX image with build artifact

FROM nginx:latest
COPY default.conf /etc/nginx/conf.d/default.conf
RUN mkdir -p /var/www/html/api/public_html
RUN chown -R nginx:nginx /var/www/html/api/public_html
RUN chmod 755 /var/www
COPY index.html /var/www/html/api/public_html

EXPOSE 80 88

CMD ["/usr/sbin/nginx", "-g", "daemon off;"]
