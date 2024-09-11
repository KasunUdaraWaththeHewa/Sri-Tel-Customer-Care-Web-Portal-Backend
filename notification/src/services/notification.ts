const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['kafka:9092'], 
});

const producer = kafka.producer();

const produceMessage = async () => {
  await producer.connect();
  await producer.send({
    topic: 'test',
    messages: [
      { value: 'Hello KafkaJS!' },
    ],
  });
  await producer.disconnect();
};

export default produceMessage;

// produceMessage().catch(console.error);
