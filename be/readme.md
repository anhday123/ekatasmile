# Server:

# AdminOrder:

-   ssh root@103.81.87.65
-   viesoftware
-   quantribanhang.viesoftware.net

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

-   mongodb://salemanager:salemanager%40123456@103.81.87.65:27017/admin?authSource=SaleManager&readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false

# POS-system:

-   mongodb://possytem:possytem123@194.233.78.9:27017/admin?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false

# B2B

-   mongodb://dangluu%40:%40Luu123456@194.233.82.28:27017/?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false

# Deploy

-   Đưa folder lên server, di chuyển vào folder dự án, npm install, pm2 start index.js --name <tên dự án> --watch true
