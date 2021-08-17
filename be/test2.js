require(`dotenv`).config();
const { MongoClient } = require('mongodb');
const uri = process.env.MONGO_DATABASE_URI;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

let arr = [];
for (let i = 0; i < 1000; i += 2) {
    let a = {
        warehouse: '1',
        sku: `PDL${i}`,
        name: `product ${i}`,
        barcode: '123123',
        category: '1',
        image: [
            'https://lavenderstudio.com.vn/wp-content/uploads/2017/09/chup-hinh-quang-cao-12-1.jpg',
            'https://www.chuphinhsanpham.vn/wp-content/uploads/2019/07/studio-chup-anh-my-pham-tphcm-1.jpg',
        ],
        length: 100,
        width: 10,
        height: 50,
        weight: 1000,
        warranty: ['2'],
        unit: 'Cái',
        suppliers: '1',
        has_variable: false,
        import_price: 1000,
        base_price: 2000,
        sale_price: 3000,
        quantity: 25,
        status_check: 10,
        description: 'Mô tả về sản phẩm ....',
    };
    let b = {
        warehouse: '1',
        sku: `PDL${i + 1}`,
        name: `Sản phẩm mẫu ${i + 1}`,
        barcode: '123123',
        category: '1',
        image: [
            'https://lavenderstudio.com.vn/wp-content/uploads/2017/09/chup-hinh-quang-cao-12-1.jpg',
            'https://www.chuphinhsanpham.vn/wp-content/uploads/2019/07/studio-chup-anh-my-pham-tphcm-1.jpg',
        ],
        length: 100,
        width: 10,
        height: 100,
        weight: 1000,
        unit: 'Cái',
        warranty: ['2'],
        suppliers: '1',
        has_variable: true,
        status_check: 10,
        attributes: [
            {
                option: 'Màu sắc',
                values: ['Trắng', 'Đen'],
            },
            {
                option: 'Kích thước',
                values: ['S', 'M'],
            },
        ],
        variants: [
            {
                title: `Sản phẩm mẫu ${i + 1} Trắng S`,
                sku: `PDL${i + 1}-TRANG-S`,
                image: [
                    'https://lavenderstudio.com.vn/wp-content/uploads/2017/09/chup-hinh-quang-cao-12-1.jpg',
                    'https://www.chuphinhsanpham.vn/wp-content/uploads/2019/07/studio-chup-anh-my-pham-tphcm-1.jpg',
                ],
                supplier: 'NCC1',
                options: [
                    {
                        name: 'Màu sắc',
                        values: 'Trắng',
                    },
                    {
                        name: 'Kích thước',
                        values: 'S',
                    },
                ],
                import_price: 100,
                base_price: 200,
                sale_price: 500,
                quantity: 111,
            },
            {
                title: `Sản phẩm mẫu ${i + 1} Trắng M`,
                sku: `PDL${i + 1}-TRANG-M`,
                image: [
                    'https://lavenderstudio.com.vn/wp-content/uploads/2017/09/chup-hinh-quang-cao-12-1.jpg',
                    'https://www.chuphinhsanpham.vn/wp-content/uploads/2019/07/studio-chup-anh-my-pham-tphcm-1.jpg',
                ],
                supplier: 'NCC1',
                options: [
                    {
                        name: 'Màu sắc',
                        values: 'Trắng',
                    },
                    {
                        name: 'Kích thước',
                        values: 'M',
                    },
                ],
                import_price: 100,
                base_price: 200,
                sale_price: 500,
                quantity: 20,
            },
            {
                title: 'Sản phẩm mẫu Đen S',
                sku: `PDL${i + 1}-DEN-S`,
                image: [
                    'https://lavenderstudio.com.vn/wp-content/uploads/2017/09/chup-hinh-quang-cao-12-1.jpg',
                    'https://www.chuphinhsanpham.vn/wp-content/uploads/2019/07/studio-chup-anh-my-pham-tphcm-1.jpg',
                ],
                supplier: 'NCC1',
                options: [
                    {
                        name: 'Màu sắc',
                        values: 'Đen',
                    },
                    { name: 'Kích thước', values: 'S' },
                ],
                import_price: 100,
                base_price: 200,
                sale_price: 500,
                quantity: 30,
            },
            {
                title: `Sản phẩm mẫu ${i + 1} Đen M`,
                sku: `PDL${i + 1}-DEN-M`,
                image: [
                    'https://lavenderstudio.com.vn/wp-content/uploads/2017/09/chup-hinh-quang-cao-12-1.jpg',
                    'https://www.chuphinhsanpham.vn/wp-content/uploads/2019/07/studio-chup-anh-my-pham-tphcm-1.jpg',
                ],
                supplier: 'NCC1',
                options: [
                    {
                        name: 'Màu sắc',
                        values: 'Đen',
                    },
                    {
                        name: 'Kích thước',
                        values: 'M',
                    },
                ],
                import_price: 100,
                base_price: 200,
                sale_price: 500,
                quantity: 40,
            },
        ],
        description: 'Mô tả về sản phẩm ....',
    };
    arr.push(a);
    arr.push(b);
}

new Promise(async (resolve, reject) => {
    await client.connect().catch((err) => {
        reject(err);
    });
    resolve(`Successfull database connect!`);
})
    .then(async (message) => {
        console.log(message);
        await client.db(process.env.DB).collection(`Products`).insertMany(arr);
    })
    .catch((err) => {
        console.log(`Failed database connect: ${err.message}!`);
    });
