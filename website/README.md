deploy:
ssh root@vdropship.vn
rm -r /var/www/quantribanhang/build
viesoftware
deploy: scp -r ./build root@vdropship.vn:/var/www/quantribanhang/build
