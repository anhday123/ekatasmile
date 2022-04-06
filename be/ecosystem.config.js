module.exports = {
    apps: [
        {
            script: 'index.js',
            name: 'AdminOrder',
            watch: true,
        },
        {
            script: './service-worker/',
            watch: true,
        },
    ],

    deploy: {
        production: {
            user: 'root',
            host: ['103.81.87.65'],
            ref: 'origin/master',
            repo: 'git@github.com:viesoftware/System_Admin_Order.git',
            path: '/root/System_Admin_Order',
            'post-deploy': 'cd /be && npm install && pm2 reload ecosystem.config.js',
        },
    },
};
