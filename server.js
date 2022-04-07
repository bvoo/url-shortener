import express from 'express';
import mongoose from 'mongoose';
import Shorten from './models/shorten.js';
import dayjs from 'dayjs';

import 'dotenv/config';

const app = express();

async function start() {
    try {
        console.log('Starting server...');

        await mongoose.connect(process.env.CONNECTION_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }, 10000);

        console.log('Connected to MongoDB');

        app.listen(process.env.PORT, () => {
            console.log('Server has been started on port ' + process.env.PORT);
        });
    } catch (e) {
        console.log(e);
    }
}

start();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

// index
app.get('/', async (req, res) => {
    let shortUrls = await Shorten.find();

    // this is fucked
    let wicked = [];
    shortUrls.forEach(x => {
        wicked.push(
            {
                createdAt: dayjs(x.createdAt).format('YYYY-MM-DD HH:mm:ss a'),
                original: x.original,
                short: x.short,
                clicks: x.clicks
            }
        )
    });

    // reversed because we want the latest first
    res.render('index', { shortUrls: wicked.reverse() });
});

// create
app.post('/shorten', async (req, res) => {
    await Shorten.create({ original: req.body.url });
    console.log('Created new short url for ' + req.body.url);
    res.redirect('/');
});

// catchall
app.get('/:short', async (req, res) => {
    const shortUrl = await Shorten.findOne({ short: req.params.short });
    if (shortUrl) {
        shortUrl.clicks++;
        shortUrl.save();
        res.redirect(shortUrl.original);
    }
    if (shortUrl === null) {
        res.redirect('https://bvoo.xyz/404');
    }
});
