import express,{ Express , Request, Response} from "express";
import cors from "cors";
import UserRoutes from './routes/User';
import messageRoutes from "./routes/message";
// import bodyParser from 'body-parser';

// env
require('dotenv').config();

const PORT = process.env.PORT || 4901;

const app: Express = express();
app.use(express.json());
app.use(cors());

app.get("/", (req: Request, res: Response) => {
    res.send("API is running");
});

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
    
});




app.use('/api/user',UserRoutes)
app.use('/api/message',messageRoutes)
