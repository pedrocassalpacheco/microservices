FROM golang:1.7

RUN mkdir /app

COPY src/github.com /go/src/github.com
COPY src/services /go/src/services
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o /app/main services 
CMD ["/app/main", "-port=8080"]
EXPOSE 8080
