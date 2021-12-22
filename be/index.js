const http = require(`http`);
const https = require(`https`);
const fs = require(`fs`);
require(`dotenv`).config();
// require(`./utils/env-config`).configEnv();

const client = require(`./config/mongodb`);
const app = require(`./app`);

try {
    const localServer = http.createServer(app);
    localServer.listen(process.env.LOCAL_PORT, () => {
        console.log(`Local server runing at http://localhost:${process.env.LOCAL_PORT}/`);
    });

    let opsys = process.platform;
    if (opsys != `darwin` && opsys != `win32`) {
        const options = {
            key: fs.readFileSync(`/etc/letsencrypt/live/${process.env.GLOBAL_HOST_NAME}/privkey.pem`),
            cert: fs.readFileSync(`/etc/letsencrypt/live/${process.env.GLOBAL_HOST_NAME}/cert.pem`),
            ca: fs.readFileSync(`/etc/letsencrypt/live/${process.env.GLOBAL_HOST_NAME}/chain.pem`),
        };
        const globalServer = https.createServer(options, app);
        globalServer.listen(process.env.GLOBAL_PORT, () => {
            console.log(`Global server runing at https://${process.env.GLOBAL_HOST_NAME}:${process.env.GLOBAL_PORT}/`);
        });
    }
} catch (err) {
    console.log(err);
}
