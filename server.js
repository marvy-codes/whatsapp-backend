import express from "express";
import mongoose from 'mongoose';
import Messages from './dbMessages.js';
import Pusher from 'pusher';
import Cors from 'cors';

//app config
const app = express();
const port = process.env.PORT || 9000;

//middleware
app.use(express.json());
app.use(Cors());

// DB config
const connection_url = "mongodb+srv://MarvyCodes:jGJYYqXtmce1xnX5@cluster0.vrzod.mongodb.net/whatsapp?retryWrites=true&w=majority";
mongoose.connect(connection_url, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
});

//???
const pusher = new Pusher({
    appId: "1243720",
    key: "fc05cdd3f53432f79111",
    secret: "c97e72b0c4da87bff269",
    cluster: "mt1",
    useTLS: true
});

const db = mongoose.connection;

db.once('open', () => {
    console.log("DB connected");
    const msgCollection = db.collection("messagecontents");
    const changeStream = msgCollection.watch();
    changeStream.on('change', (change) => {
        // console.log("changed", change);

        if (change.operationType == 'insert') {
            const messageDetails = change.fullDocument;
            pusher.trigger('messages', 'inserted', 
            {
                name: messageDetails.name,
                message: messageDetails.message
            });
            console.log("Triggered pusher")
        } else {
            console.log('Error triggering Pusher')
        }
    })
})

// api routes
app.get("/", (req, res) => res.status(200).send("Hello world"));

app.get('/messages/sync', (req, res) => {
    Messages.find((err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(200).send(data)
        }
    })
});

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