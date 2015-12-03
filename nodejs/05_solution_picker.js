var config = require('./config'),
    amqp = require('amqp'),
    connection = amqp.createConnection(config, { recover: false }),
    SolutionPackage = require('./SolutionPackage');

console.log('Opening connection to RabbitMQ host...');

var solutionsStore = {};

connection.on('ready', function __connectionReady() {
  console.log('Connected to amqp://' + config.login + ':' + config.password + '@' + config.host + '/' + config.vhost);

  // Connect to exchange
  var exchange = connection.exchange(config.exchangeName, config.exchange, function __exchangeReady(exchange) {
    console.log('Exchange \'' + exchange.name + '\' is open');

    // Setup queue
    var queue = connection.queue('solutions', config.queue, function __queueReady(queue) {
        // Bind queue to exchange
        queue.bind(exchange, 'solutions', function __bind() {
          //console.log(' [*] Waiting for solutions on the \'' + config.vhost + '\' bus... To exit press CTRL+C');
        });

        // Subscribe to messages on queue
        queue.subscribe(function __listener(solution) {

          if (solutionsStore[solution.needUuid] == undefined) {
            solutionsStore[solution.needUuid] = [];
          }
        
          solutionsStore[solution.needUuid].push(solution);
          var bestSolution = {};
          var lowestPrice = null;

          for(var i = 0; i < solutionsStore[solution.needUuid].length; i++) {
            if (lowestPrice == null || solutionsStore[solution.needUuid][i].solution.price < lowestPrice) {
              lowestPrice = solutionsStore[solution.needUuid][i].solution.price;
              bestSolution = solutionsStore[solution.needUuid][i];
            }
          }
        
          //Pick the best solution
          connection.queue('final-solutions', config.queue, function __queueReady(solutionQueue) {
            exchange.publish('final-solutions', SolutionPackage.create(bestSolution.needUuid, 'Final', bestSolution.solution));
          });
        });
    });
  });
});
