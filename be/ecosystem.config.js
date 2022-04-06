module.exports = {
    apps: [
        {
            script: 'index.js',
            name: 'AdminOrder',
            watch: true,
        },
    ],
    deploy: {
        production: {
            key: '~/.ssh/id_rsa',
            user: 'root',
            host: ['103.81.87.65'],
            ref: 'origin/master',
            repo: 'git@github.com:viesoftware/System_Admin_Order.git',
            path: '/root/System_Admin_Order',
            'post-deploy': 'cd /root/System_Admin_Order/source/be && npm install && pm2 reload ecosystem.config.js',
        },
    },
};
