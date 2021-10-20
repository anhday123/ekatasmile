const express = require('express');
const cors = require(`cors`);
const createError = require(`http-errors`);
const moment = require(`moment-timezone`);

const router = require(`./routers/index`);
const client = require('./config/mongo/mongodb');
const DB = process.env.DATABASE;

const app = express();
const endPoint = process.env.END_POINT;

app.use(cors()).use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(`/` + endPoint, router)
    .use((req, res, next) => {
        next(new Error(`404: Endpoint is not exists!`));
    })
    .use((error, req, res, next) => {
        console.log(error);
        let message = error.message.split(`: `).map((v) => (Number(v) ? Number(v) : v));
        let httpError = createError(...message);
        res.status(httpError.statusCode || 500).send(httpError);
    });

let clearVertifyLink = async () => {
    try {
        let _links = await client
            .db(DB)
            .collection(`VertifyLinks`)
            .find({ vertify_timelife: { $lte: moment.tz(`Asia/Ho_Chi_Minh`).format() } })
            .toArray();
        await Promise.all(
            _links.map((_link) => {
                client.db(DB).collection(`VertifyLinks`).findOneAndDelete({ UID: _link.UID });
                client
                    .db(DB)
                    .collection(`Users`)
                    .findOneAndUpdate(
                        { user_id: _link.user_id, active: false },
                        {
                            $set: {
                                username: `user_was_delete`,
                                email: `user_was_delete`,
                            },
                        }
                    );
            })
        );
    } catch (err) {
        console.log(err);
    }
};

setInterval(() => {
    clearVertifyLink();
}, process.env.OTP_TIMELIFE);

module.exports = app;
