const { Kafka } = require('kafkajs');

// Kafka configuration
const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['kafka:9092'],
});

const producer = kafka.producer();

const notification = async (emailAddress, msg, title) => {
  try {
    await producer.connect();
    const message = JSON.stringify({
      emailAddress: emailAddress,
      msg: msg,
      type: title
    });

    await producer.send({
      topic: 'notification',
      messages: [
        { value: message },
      ],
    });

    console.log('Message sent successfully');
  } catch (error) {
    console.error('Failed to send message:', error);
  } finally {
    await producer.disconnect();
  }
}

module.exports = notification;
