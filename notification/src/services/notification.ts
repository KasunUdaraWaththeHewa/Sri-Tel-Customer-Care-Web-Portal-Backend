import { Kafka, Consumer, EachMessagePayload, KafkaMessage } from 'kafkajs';
import nodemailer, { Transporter, SendMailOptions } from 'nodemailer';

// Kafka configuration
const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['kafka:9092'],
});

const consumer: Consumer = kafka.consumer({ groupId: 'my-group' });

interface EmailMessage {
  email: string;
  msg: string;
  title: string;
}

// Email sending function (using nodemailer for demonstration)
const sendMail = async (email: string, message: string, title: string): Promise<void> => {
  const transporter: Transporter = nodemailer.createTransport({
    host: 'mail',
    port: 1025, // Default MailHog SMTP port
    secure: false, // MailHog does not use SSL
    
  });

  const mailOptions: SendMailOptions = {
    from: 'your-email@gmail.com', // Use environment variable here
    to: email,
    subject: `Sri Tel - ${title}`,
    text: message
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

// Consumer function to subscribe to the topic and handle incoming messages
const consumeMessages = async (): Promise<void> => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'notification', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }: EachMessagePayload) => {
      if (message.value) { // Check if value is not null
        const content: string = message.value.toString();
        const { email, msg, title }: EmailMessage = JSON.parse(content);
        console.log(`Received message: ${msg}, Email: ${email}, Title: ${title}`);
        await sendMail(email, msg, title);
      } else {
        console.error(`Received null or undefined message value in topic: ${topic} at partition: ${partition}`);
      }
    }
  });
};

// consumeMessages().catch(console.error);

export default consumeMessages;