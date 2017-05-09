package main

import (
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"strconv"
	"time"

	"github.com/instana/golang-sensor"
	ot "github.com/opentracing/opentracing-go"
	"github.com/opentracing/opentracing-go/ext"
	golog "github.com/opentracing/opentracing-go/log"

	"github.com/gorilla/mux"
)

func index(w http.ResponseWriter, r *http.Request) {

	wireContext, _ := ot.GlobalTracer().Extract(ot.HTTPHeaders, ot.HTTPHeadersCarrier(r.Header))
	parentSpan := ot.GlobalTracer().StartSpan("Index", ext.RPCServerOption(wireContext))

	parentSpan.LogFields(
		golog.String("type", instana.HTTPServer),
		golog.Object("data", &instana.Data{
			HTTP: &instana.HTTPData{
				Host:   r.Host,
				URL:    r.URL.Path,
				Status: 200,
				Method: r.Method}}))

	childSpan := ot.StartSpan("client", ot.ChildOf(parentSpan.Context()))

	fmt.Fprint(w, "Welcome!\n")

	childSpan.Finish()

	time.Sleep(550 * time.Millisecond)

	parentSpan.Finish()

}

func zips(w http.ResponseWriter, r *http.Request) {

	wireContext, _ := ot.GlobalTracer().Extract(ot.HTTPHeaders, ot.HTTPHeadersCarrier(r.Header))
	parentSpan := ot.GlobalTracer().StartSpan("Todos", ext.RPCServerOption(wireContext))

	parentSpan.LogFields(
		golog.String("type", instana.HTTPServer),
		golog.Object("data", &instana.Data{
			HTTP: &instana.HTTPData{
				Host:   r.Host,
				URL:    r.URL.Path,
				Status: 200,
				Method: r.Method}}))

	w.Header().Set("Content-Type", "application/json; charset=UTF-8")
	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(todos); err != nil {
		panic(err)
	}

	time.Sleep(550 * time.Millisecond)

	parentSpan.Finish()

}

func TodoShow(w http.ResponseWriter, r *http.Request) {

	wireContext, _ := ot.GlobalTracer().Extract(ot.HTTPHeaders, ot.HTTPHeadersCarrier(r.Header))
	parentSpan := ot.GlobalTracer().StartSpan("Todos/{id}", ext.RPCServerOption(wireContext))

	parentSpan.LogFields(
		golog.String("type", instana.HTTPServer),
		golog.Object("data", &instana.Data{
			HTTP: &instana.HTTPData{
				Host:   r.Host,
				URL:    r.URL.Path,
				Status: 200,
				Method: r.Method}}))

	vars := mux.Vars(r)
	var todoId int
	var err error
	if todoId, err = strconv.Atoi(vars["todoId"]); err != nil {
		panic(err)
	}
	todo := RepoFindTodo(todoId)
	if todo.Id > 0 {
		w.Header().Set("Content-Type", "application/json; charset=UTF-8")
		w.WriteHeader(http.StatusOK)
		if err := json.NewEncoder(w).Encode(todo); err != nil {
			panic(err)
		}
		return
	}

	// If we didn't find it, 404
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")
	w.WriteHeader(http.StatusNotFound)
	if err := json.NewEncoder(w).Encode(jsonErr{Code: http.StatusNotFound, Text: "Not Found"}); err != nil {
		panic(err)
	}

	time.Sleep(550 * time.Millisecond)

	parentSpan.Finish()

}

func TodoCreate(w http.ResponseWriter, r *http.Request) {
	var todo Todo
	body, err := ioutil.ReadAll(io.LimitReader(r.Body, 1048576))
	if err != nil {
		panic(err)
	}
	if err := r.Body.Close(); err != nil {
		panic(err)
	}
	if err := json.Unmarshal(body, &todo); err != nil {
		w.Header().Set("Content-Type", "application/json; charset=UTF-8")
		w.WriteHeader(422) // unprocessable entity
		if err := json.NewEncoder(w).Encode(err); err != nil {
			panic(err)
		}
	}

	t := RepoCreateTodo(todo)
	w.Header().Set("Content-Type", "application/json; charset=UTF-8")
	w.WriteHeader(http.StatusCreated)
	if err := json.NewEncoder(w).Encode(t); err != nil {
		panic(err)
	}
}
