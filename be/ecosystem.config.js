module.exports = {
    apps: [
        {
            script: 'index.js',
            name: 'AdminOrder',
            watch: true,
            env: {
                LOCAL_PORT: '5000',
                GLOBAL_PORT: '5001',
                DOMAIN: 'upsale.com.vn',
                END_POINT: 'api',
                TIMEZONE: 'Asia/Ho_Chi_Minh',
                EMAIL_USER: 'support@networkdemo.site',
                EMAIL_PASSWORD: 'u$65lxw0d8',
                MONGO_DATABASE_URI: 'mongodb://dangluu%40:%40Luu123456@103.81.87.65:27017/',
                DATABASE: 'RootAO',
                access_key_wasabi: 'FPGND4WEL36P7YBI22RU',
                secret_key_wasabi: 'iRLPt3iEwt0tCQf1rOLueI0fPAzjHsFwcd3K70e6',
                NODE_ENV: 'sandbox',
            },
            env_production: {
                LOCAL_PORT: '5000',
                GLOBAL_PORT: '5001',
                DOMAIN: 'upsale.com.vn',
                END_POINT: 'api',
                TIMEZONE: 'Asia/Ho_Chi_Minh',
                EMAIL_USER: 'support@networkdemo.site',
                EMAIL_PASSWORD: 'u$65lxw0d8',
                MONGO_DATABASE_URI: 'mongodb://dangluu%40:%40Luu123456@103.81.87.65:27017/',
                DATABASE: 'RootAO',
                access_key_wasabi: 'FPGND4WEL36P7YBI22RU',
                secret_key_wasabi: 'iRLPt3iEwt0tCQf1rOLueI0fPAzjHsFwcd3K70e6',
                NODE_ENV: 'production',
            },
        },
    ],
    deploy: {
        sandbox: {
            user: 'root',
            host: ['103.81.87.65'],
            ref: 'origin/master',
            repo: 'git@github.com:viesoftware/System_Admin_Order.git',
            path: '/root/System_Admin_Order',
            'post-deploy':
                'cd /root/System_Admin_Order/source/be && npm install && pm2 reload ecosystem.config.js --env sandbox',
        },
        production: {
            user: 'root',
            host: ['103.81.87.65'],
            ref: 'origin/master',
            repo: 'git@github.com:viesoftware/System_Admin_Order.git',
            path: '/root/System_Admin_Order',
            'post-deploy':
                'cd /root/System_Admin_Order/source/be && npm install && pm2 reload ecosystem.config.js --env production',
        },
    },
};
