
var kafka = require('kafka-node'),
            client = new kafka.Client('localhost:9092'),
            producer = new kafka.Producer(client);

function produceMessage() {
  payloads = [
          { topic: 'test', messages: 'This is the First Message I am sending', partition: 0 },
      ];
  console.log(client);
  console.log(producer);


  producer.on('ready', function(){
    producer.send(payloads, function(err, data){
        console.log(data)
      });
  });

  producer.on('error', function (err) {
    console.log(err);
  });

}

var main = function () {
  var http = require('http');

  var server = http.createServer(function(req, res) {

    produceMessage();


    res.writeHead(200);
    res.end('Hello Http');
  });
  server.listen(8080);
}
if (require.main === module) {
    main();
}
