const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const app = express();
const PORT=process.env.PORT;
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true, //access-control-allow-credentials:true
  };
  
app.use(cors(corsOptions));
app.use(bodyParser.json());

const URL=process.env.MONGODB_URL;
mongoose.connect(URL,{
    //useCreateIndex:true,
    useNewUrlParser:true,
    useUnifiedTopology:true,
    //useFindAndModify:false
});
const connection=mongoose.connection;
connection.once("open",()=>{
    console.log("MongoDB Connection Success!");
})

const dataTopUpRoutes=require("./routes/dataTopUpRoutes");
app.use("/valueAdded/data",dataTopUpRoutes);
const internationalRoamingRoutes=require("./routes/internationalRoamingRoutes");
app.use("/valueAdded/roaming",internationalRoamingRoutes);
const ringToneRoutes=require("./routes/ringToneRoutes");
app.use("/valueAdded/ringtone",ringToneRoutes);
const subscriptionBasedRoutes=require("./routes/subscriptionBasedRoutes");
app.use("/valueAdded/subscription",subscriptionBasedRoutes);



app.listen(PORT,()=>{
    console.log(`Server is up and running on port: ${PORT}`);
})