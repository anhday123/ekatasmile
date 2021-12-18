const express = require('express');
const cors = require(`cors`);
const createError = require(`http-errors`);
const moment = require(`moment-timezone`);

const router = require(`./routers/index`);
const client = require('./config/mongodb');
const DB = process.env.DATABASE;
const swaggerUi = require('./docs/swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const options = {
    swaggerOptions: {
        validatorUrl: null,
    },
    customCss: `
  .topbar-wrapper img {content:url('https://s3.ap-northeast-1.wasabisys.com/ecom-fulfill/2021/09/02/95131dfc-bf13-4c49-82f3-6c7c43a7354d_logo_quantribanhang%201.png'); width:100px; height:auto;}
  .swagger-ui .topbar { background-color: #ffffff; border-bottom: 2px solid #5dc6d1; color: #000000}`,
    customSiteTitle: 'Quản trị bán hàng APIs',
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));

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

let clearAccount = async () => {
    try {
        await Promise.all([
            client
                .db(DB)
                .collection('Users')
                .deleteMany({
                    otp_timelife: { $lte: moment().utc().format() },
                    active: false,
                }),
            client
                .db(DB)
                .collection('VertifyLinks')
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
