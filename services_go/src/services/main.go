package main

import (
	"flag"
	"log"
	"net/http"

	"github.com/instana/golang-sensor"
	ot "github.com/opentracing/opentracing-go"
)

const (
	Service = "Address Service"
	Entry   = "http://localhost:9060/golang/entry"
	Exit    = "http://localhost:9060/golang/exit"
)

func main() {

	mongodbHost := flag.String("dbhost", "localhost", "MongoDB host")
	mongodbPort := flag.Int("port", 27017, "MongoDB port")
	flag.Parse()
	log.Println("host:", *mongodbHost)
	log.Println("port:", *mongodbPort)
	log.Println("tail:", flag.Args())
	log.Println("")

	ot.InitGlobalTracer(instana.NewTracerWithOptions(&instana.Options{
		Service:  Service,
		LogLevel: instana.Debug}))
	connectToMongo(*mongodbHost, *mongodbPort)
	router := NewRouter()
	log.Fatal(http.ListenAndServe(":8080", router))
}
