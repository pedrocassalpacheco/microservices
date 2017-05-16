// mongo
package main

import (
	"fmt"
	"log"

	mongo "gopkg.in/mgo.v2"
	//bson "gopkg.in/mgo.v2/bson"
)

type Person struct {
	zipcode string
	city    string
	state   string
}

var session *mongo.Session

func connectToMongo(host string, port int) {

	var err error
	var url = fmt.Sprintf("Connecting to mongodb://%s:%d?maxPoolSize=10", host, port)

	log.Printf(url)
	session, err := mongo.Dial(url)
	if err != nil {
		panic(err)
	}
	defer session.Close()

	session.SetMode(mongo.Monotonic, true)
}

func disconnectFromMongo() {
	if session != nil {
		session.Close()
	}
}
