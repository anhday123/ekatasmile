const express = require(`express`);
const cors = require(`cors`);
const createError = require(`http-errors`);
const moment = require(`moment`);

const router = require(`./routers/index`);
const client = require('./config/mongo/mongodb');
const DB = process.env.DATABASE;

const app = express();
const endPoint = process.env.END_POINT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(`/` + endPoint, router)
    .use((req, res, next) => {
        next(new Error(`404 ~ Not Found!`));
    })
    .use((error, req, res, next) => {
        const messages = error.message
            .split(` ~ `)
            .map((v) => (Number(v) ? Number(v) : v));
        const httpError = createError(...messages);
        console.log(error.message);
        console.log(error);
        res.status(httpError.statusCode || 500).send(httpError);
    });

let clearVertifyLink = async () => {
    try {
        let _links = await client
            .db(DB)
            .collection(`VertifyLinks`)
            .find({ vertify_timelife: { $lte: moment().format() } })
            .toArray();
        await Promise.all(
            _links.map(async (item) => {
                let _link = item;
                await Promise.all([
                    client
                        .db(DB)
                        .collection(`VertifyLinks`)
                        .findOneAndDelete({ UID: _link.UID }),
                    client
                        .db(DB)
                        .collection(`Users`)
                        .findOneAndUpdate(
                            { user_id: _link.user_id, active: false },
                            {
                                $set: {
                                    username: `viesoftware`,
                                    email: `viesoftware`,
                                },
                            }
                        ),
                ]);
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
