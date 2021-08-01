import express from "express";
import mongoose from 'mongoose';
import Messages from './dbMessages.js';

//app config
const app = express();
const port = process.env.PORT || 9000;

const connection_url = "mongodb+srv://MarvyCodes:jGJYYqXtmce1xnX5@cluster0.vrzod.mongodb.net/whatsapp?retryWrites=true&w=majority";
mongoose.connect(connection_url, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})

//middleware
app.use(express.json())

// DB config

//???

// api routes
app.get("/", (req, res) => res.status(200).send("Hello world"));

app.post('/messages/new', (req, res) => {
    const dbMessage = req.body;
    Messages.create(dbMessage, (err, data) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(201).send(data);
        }
    })


})

//listeners
app.listen(port, () => console.log(`Listening on localhost:${port}`))