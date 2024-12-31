import express from 'express';
import 'dotenv/config';
import adminroutes from './routes/adminroutes.js';
import userroutes from './routes/userroutes.js';
import connectDb from './config/db.js';

//app config
const app = express();
const port = process.env.PORT || 5000;
connectDb();


//middleware
app.use(express.json());
//cors

//api endpoints
app.get('/', (req, res) => {
    res.send("Server is running");
});

app.use('/api/admin', adminroutes);
app.use('/api/user', userroutes);


app.listen(port, () => console.log(`Server listening on port ${port}`));