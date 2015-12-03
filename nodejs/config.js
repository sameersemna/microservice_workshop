module.exports = {
  // RabbitMQ connection
  host: 'rabbitmq',
  vhost: '/',
  login: 'guest',
  password: 'guest',

  // Exchange details
  exchangeName: 'rapids',
  exchange: {
    type: 'topic',
    durable: true,
    autoDelete: true
  },

  // Queue details
  queue: {
    exclusive: false
  }
};
