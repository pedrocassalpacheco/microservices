# Apache Tomcat image with build artifact

FROM tomcat:8.5.4-jre8

ENV SRC build/libs/spring-music.war 
ENV TERM xterm
ENV JAVA_OPTS -Djava.security.egd=file:/dev/./urandom

RUN apt-get update -qq \
  && touch /var/log/spring-music.log \
  && chmod 666 /var/log/spring-music.log 

COPY build/libs/spring-music.war /usr/local/tomcat/webapps/spring-music.war
#COPY tomcat-users.xml /usr/local/tomcat/conf/tomcat-users.xml
EXPOSE 8080
#ENTRYPOINT ["/usr/local/tomcat/bin/startup.sh"]

