let a = {
    sku: 'SPM',
    name: 'Sản phẩm mẫu',
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
    has_variant: true,
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
            title: 'Sản phẩm mẫu Trắng S',
            sku: 'SPM-Trắng-S',
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
            quantity: 10,
            import_price: 100,
            base_price: 200,
            sale_price: 500,
        },
        {
            title: 'Sản phẩm mẫu Trắng M',
            sku: 'SPM-Trắng-M',
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
            quantity: 10,
            import_price: 100,
            base_price: 200,
            sale_price: 500,
        },
        {
            title: 'Sản phẩm mẫu Đen S',
            sku: 'SPM-Đen-S',
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
            quantity: 10,
            import_price: 100,
            base_price: 200,
            sale_price: 500,
        },
        {
            title: 'Sản phẩm mẫu Đen M',
            sku: 'SPM-Đen-M',
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
            quantity: 10,
            import_price: 100,
            base_price: 200,
            sale_price: 500,
        },
    ],
};

let pc = {
    delivery_note_id: '1',
    bussiness: '1',
    from: 'WAREHOUSE',
    to: '1',
    products: [
        {
            sku: 'SPM',
            name: 'Sản phẩm mẫu',
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
            has_variant: true,
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
                    title: 'Sản phẩm mẫu Trắng S',
                    sku: 'SPM-Trắng-S',
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
                    quantity: 10,
                    import_price: 100,
                    base_price: 200,
                    sale_price: 500,
                },
                {
                    title: 'Sản phẩm mẫu Trắng M',
                    sku: 'SPM-Trắng-M',
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
                    quantity: 10,
                    import_price: 100,
                    base_price: 200,
                    sale_price: 500,
                },
                {
                    title: 'Sản phẩm mẫu Đen S',
                    sku: 'SPM-Đen-S',
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
                    quantity: 10,
                    import_price: 100,
                    base_price: 200,
                    sale_price: 500,
                },
                {
                    title: 'Sản phẩm mẫu Đen M',
                    sku: 'SPM-Đen-M',
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
                    quantity: 10,
                    import_price: 100,
                    base_price: 200,
                    sale_price: 500,
                },
            ],
        },
    ],
    status: 'PROGRESSING',
    // PROGRESSING - SHIPPING - CANCEL - COMPLETE
    create_date: '2021-08-02T00:00:00+07:00',
    creator: '1',
};

console.log(JSON.stringify(pc));
