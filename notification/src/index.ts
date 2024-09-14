import express,{ Express , Request, Response} from "express";
import cors from "cors";
import consumeMessages from "./services/notification";

// import bodyParser from 'body-parser';

// env
require('dotenv').config();

const PORT = process.env.PORT || 4902;

const app: Express = express();
app.use(express.json());
app.use(cors());

app.get("/", (req: Request, res: Response) => {
    res.send("API is running");
});

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
    
});

consumeMessages().catch(console.error);

