module.exports = {
    apps: [
        {
            name: 'AdminOrder',
            script: './index.js',
            autorestart: true,
            watch: true,
            // env: {
            //     NODE_ENV: 'development',
            // },
            // env_production: {
            //     NODE_ENV: 'production',
            //     PORT: 5050,
            // },
        },
    ],

    // deploy: {
    //     production: {
    //         user: 'root', // user để ssh
    //         host: ['103.81.87.65'], // IP của server này (theo sơ đồ)
    //         ref: 'origin/main', // branch để pull source
    //         repo: 'git@github.com:DieepjAnhr/BE_AdminOrder.git', // repo của project
    //         path: '/root/AdminOrder', // sẽ deploy vào thư mục này
    //         'post-deploy': 'npm install && pm2 startOrRestart ecosystem.config.js --env production', // cmd để deploy
    //     },
    // },
};
