const express = require("express");
const cors = require(`cors`);
const createError = require(`http-errors`);
const moment = require(`moment-timezone`);

const router = require(`./routers/index`);
const client = require("./config/mongodb");
const DB = process.env.DATABASE;

const app = express();
const endPoint = process.env.END_POINT;

app.use(cors()).use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app
  .use(`/` + endPoint, router)
  .use((req, res, next) => {
    next(new Error(`404: Endpoint is not exists!`));
  })
  .use((error, req, res, next) => {
    console.log(error);
    let message = error.message
      .split(`: `)
      .map((v) => (Number(v) ? Number(v) : v));
    let httpError = createError(...message);
    res.status(httpError.statusCode || 500).send(httpError);
  });

let clearAccount = async () => {
  try {
    await Promise.all([
      client
        .db(DB)
        .collection("Users")
        .deleteMany({
          otp_timelife: { $lte: moment().utc().format() },
          active: false,
        }),
      client
        .db(DB)
        .collection("VertifyLinks")
        .deleteMany({
          vertify_timelife: { $lte: moment().utc().format() },
        }),
    ]);
  } catch (err) {
    console.log(err);
  }
};

setInterval(() => {
  clearAccount();
}, process.env.OTP_TIMELIFE || 300000);

module.exports = app;
