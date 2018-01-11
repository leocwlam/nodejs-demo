var express = require('express');
var app = express();

app.listen(3000, () => console.log('Demo app listening on port 3000!'));

app.use(express.static('public'));




var q = 'celery';

function bail(err) {
  console.error(err);
  process.exit(1);
}

function processMessage(message) {
    console.log(message.content.toString());
}


function consumer(conn) {
  var ok = conn.createChannel(on_open);
  function on_open(err, ch) {
    if (err != null) bail(err);
    ch.assertQueue(q);
    ch.consume(q, function(msg) {
      if (msg !== null) {
        processMessage(msg);
        ch.ack(msg);
      }
    });
  }
}

require('amqplib/callback_api')
  .connect('amqp://guest:guest@localhost:5672//', function(err, conn) {
    if (err != null) bail(err);
    consumer(conn);
  });
