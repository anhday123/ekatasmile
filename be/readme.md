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

-   Mac:

    -   Setup (1 lần đầu tiên): Bỏ qua nếu đã thực hiện ở dự án khác
        -   1: ssh-keygen -t rsa
        -   4: ssh-copy-id root@103.81.87.65
        -   5: nhập password: viesoftware
    -   Steps:
        -   1: Push code lên git:
        -   2: chạy lệnh:
            -   npm run deploy-sandbox với phiên bản sandbox
            -   npm run deploy-production với phiên bản production

-   Windows:

    -   Setup (1 lần đầu tiên):
        -   1: ssh-keygen
        -   2: type C:\Users\<username>\.ssh\id_rsa.pub | ssh root@103.81.87.65 'cat >> .ssh/authorized_keys'
    -   Steps:
        -   1: Push code lên git:
        -   2: chạy lệnh:
            -   npm run deploy-sandbox với phiên bản sandbox
            -   npm run deploy-production với phiên bản production
