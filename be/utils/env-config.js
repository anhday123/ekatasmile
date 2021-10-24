const { getMyIP } = require('./get-my-ip');

let configEnv = () => {
    process.env.MONGO_DATABASE_URI = (() => {
        let IPs = getMyIP();
        if (IPs[0] == '103.81.87.65' || IPs.includes('103.81.87.65')) {
            return 'mongodb://salemanager:salemanager%40123456@103.81.87.65:27017/admin?authSource=SaleManager&readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false';
        }
        if (IPs[0] == '194.233.78.9' || IPs.includes('194.233.78.9')) {
            return 'mongodb://possytem:possytem123@194.233.78.9:27017/admin?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false';
        }
        if (IPs[0] == '194.233.82.28' || IPs.includes('194.233.82.28')) {
            return 'mongodb://dangluu%40:%40Luu123456@194.233.82.28:27017/?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false';
        }
        return process.env.MONGO_DATABASE_URI;
    })();

    process.env.DATABASE = (() => {
        let IPs = getMyIP();
        if (IPs[0] == '103.81.87.65' || IPs.includes('103.81.87.65')) {
            return 'SaleManager';
        }
        if (IPs[0] == '194.233.78.9' || IPs.includes('194.233.78.9')) {
            return 'POS';
        }
        if (IPs[0] == '194.233.82.28' || IPs.includes('194.233.82.28')) {
            return 'B2B';
        }
        return process.env.DATABASE;
    })();
    process.env.GLOBAL_HOST_NAME = (() => {
        let IPs = getMyIP();
        if (IPs[0] == '103.81.87.65' || IPs.includes('103.81.87.65')) {
            return 'quantribanhang.viesoftware.net';
        }
        if (IPs[0] == '194.233.78.9' || IPs.includes('194.233.78.9')) {
            return 'admin.anreji.jp';
        }
        if (IPs[0] == '194.233.82.28' || IPs.includes('194.233.82.28')) {
            return 'ipackvina.com';
        }
        return process.env.DATABASE;
    })();
};

module.exports = { configEnv };
