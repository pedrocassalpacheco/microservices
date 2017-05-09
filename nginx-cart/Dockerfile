# NGINX image with build artifact

FROM nginx:latest
COPY default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["/usr/sbin/nginx", "-g", "daemon off;"]

