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
    if ($host = *.vdropship.vn) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


        listen 80;
        listen [::]:80;

        server_name *.vdropship.vn;
    return 404; # managed by Certbot


}

server {
    if ($host = vdropship.vn) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


        listen 80;
        listen [::]:80;

        server_name vdropship.vn;
    return 404; # managed by Certbot


}