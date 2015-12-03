var config = require('./config'),
    amqp = require('amqp'),
    connection = amqp.createConnection(config, { recover: false }),
    SolutionPackage = require('./SolutionPackage');

console.log('Opening connection to RabbitMQ host...');

connection.on('ready', function __connectionReady() {
  console.log('Connected to amqp://' + config.login + ':' + config.password + '@' + config.host + '/' + config.vhost);

  // Connect to exchange
  var exchange = connection.exchange(config.exchangeName, config.exchange, function __exchangeReady(exchange) {
    console.log('Exchange \'' + exchange.name + '\' is open');

    // Setup queue
    var queue = connection.queue('needs', config.queue, function __queueReady(queue) {
        // Bind queue to exchange
        queue.bind(exchange, 'needs', function __bind() {
          //console.log(' [*] Waiting for solutions on the \'' + config.vhost + '\' bus... To exit press CTRL+C');
        });

        // Subscribe to messages on queue
        queue.subscribe(function __listener(need) {
          connection.queue('solutions', config.queue, function __queueReady(solutionQueue) {
            exchange.publish('solutions', SolutionPackage.create(need.uuid, 'Brand', {'price': 105, 'location': 'Paris', 'brand': 'Mercedes'}));
          });
        });
    });
  });
});
