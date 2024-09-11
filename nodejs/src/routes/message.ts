import express from "express";

import produceMessage from '../services/kafka';

const messageRoutes = express.Router();


messageRoutes.get('/', (req, res) => {

    produceMessage().catch(console.error);
    res.send('Message produced to Kafka');
   
});

export default messageRoutes;