import express from 'express';
import 'dotenv/config';
// import router from './routes/index.js';

//app config
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(express.json());
//cors

//api endpoints
app.get('/', (req, res) => {
    res.send("Server is running");
});

app.listen(port, () => console.log(`Server listening on port ${port}`));