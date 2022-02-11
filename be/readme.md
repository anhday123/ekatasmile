# Server:

# AdminOrder:

-   ssh root@103.81.87.65
-   viesoftware
-   quantribanhang.viesoftware.vn

# POS-system:

-   ssh root@194.233.78.9
-   viesoftware
-   admin.anreji.jp

# B2B:

-   ssh root@194.233.82.28
-   viesoftware
-   ipackvina.com

# Mongo URI:

# AdminOrder:

-   mongodb://salemanager:salemanager%40123456@103.81.87.65:27017/

# POS-system:

-   mongodb://possytem:possytem123@194.233.78.9:27017/

# B2B

-   mongodb://dangluu%40:%40Luu123456@194.233.82.28:27017/

# Deploy

-   Đưa folder lên server qua git/ssh, di chuyển vào folder dự án, npm install, pm2 start index.js --name <tên dự án> --watch true

server {

        root /var/www/quantribanhang/build;
        index index.html index.htm index.nginx-debian.html;

        server_name upsale.com.vn *.upsale.com.vn;

        location / {
                try_files $uri /index.html;
        }
        location /api/ {
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header Host $http_host;
                proxy_pass http://localhost:5000/api/;
                proxy_redirect off;
        }
        location /api-docs/ {
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header Host $http_host;
                proxy_pass http://localhost:5000/api-docs/;
                proxy_redirect off;
        }

    #listen [::]:443 ssl ipv6only=on; # managed by Certbot
    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/upsale.com.vn/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/upsale.com.vn/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot


}
server {
    if ($host = *.upsale.com.vn) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


        listen 80;
        listen [::]:80;

        server_name *.upsale.com.vn;
    return 404; # managed by Certbot


}
server {
    if ($host = upsale.com.vn) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


        listen 80;
        listen [::]:80;

        server_name upsale.com.vn;
    return 404; # managed by Certbot


}

https://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@github.com/viesoftware/System_Admin_Order

echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt sources.list.d/docker.list > /dev/null

sudo certbot certonly --manual -d *.upsale.com.vn -d upsale.com.vn --agree-tos --no-bootstrap --manual-public-ip-logging-ok --preferred-challenges dns-01 --server https://acme-v02.api.letsencrypt.org/directory

sudo certbot certonly --agree-tos --email phandangluu.viesoftware@gmail.com --manual --preferred-challenges=dns -d *.upsale.com.vn -d upsale.com.vn --server https://acme-v02.api.letsencrypt.org/directory
