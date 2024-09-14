const { Kafka } = require('kafkajs');

// Kafka configuration
const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['kafka:9092'],
});

const producer = kafka.producer();

// Function to produce messages
const produceMessage = async () => {
  try {
    await producer.connect();
    const message = JSON.stringify({
      email: "example@example.com",
      msg: "Hello KafkaJS!",
      type: "Notification"
    });

    await producer.send({
      topic: 'test',
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
};



export default produceMessage;
