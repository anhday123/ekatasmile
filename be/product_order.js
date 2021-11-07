let product = {
    product_id: 'PID1',
    business_id: 'BID1',
    sku: 'SKUDEMO',
    name: 'SẢN PHẨM DEMO',
    slug: 'ten-san-pham',
    category_id: 'CID1',
    supplier_id: 'SID1',
    waranties: [
        {
            warranty_id: 'WID1',
            business_id: 'BID1',
            name: 'BẢO HÀNH NỨT VỠ',
            type: 'hỗ trợ toàn giá',
            time: 6,
            description: '',
        },
    ],
    taxes: [
        {
            tax_id: 'TID1',
            business_id: 'BID1',
            name: 'VAT',
            value: 10,
            description: '',
        },
    ],
    length: 10,
    width: 10,
    height: 10,
    weight: 10,
    unit: 'chai',
    description: 'mô tả',
    create_date: '2021-09-30T00:00:00+07:00',
    creator_id: 'UID1',
    delete: false,
    active: true,
};

let attribute_1 = {
    attribute_id: 'AID1',
    product_id: 'PID1',
    business_id: 'BID1',
    option: 'COLOR',
    values: ['WHITE', 'BLACK'],
};

let attribute_2 = {
    attribute_id: 'AID2',
    product_id: 'PID1',
    business_id: 'BID1',
    option: 'SIZE',
    values: ['S', 'M'],
};

let variant_1 = {
    variant_id: 'VID1',
    product_id: 'PID1',
    business_id: 'BID1',
    sku: 'SKUDEMO-WHITE-S',
    name: 'SẢN PHẨM DEMO WHITE S',
    images: ['link image 1', 'link image 2'],
    option1: 'WHITE',
    option2: 'S',
    import_price: 100000,
    base_price: 150000,
    sale_price: 500000,
    locations: [
        {
            location_id: '1',
            name: 'store',
            available_stock_quantity: 200,
            low_stock_quantity: 0,
            out_stock_quantity: 0,
            shipping_quantity: 0,
            return_quantity: 0,
            status_check: 10,
            status_check_value: 20,
            status: 'available_stock',
        },
        {
            location_id: '1',
            name: 'branch',
            available_stock_quantity: 200,
            low_stock_quantity: 0,
            out_stock_quantity: 0,
            shipping_quantity: 0,
            return_quantity: 0,
            status_check: 10,
            status_check_value: 20,
            status: 'available_stock',
        },
    ],
};

let variant_2 = {
    variant_id: 'VID2',
    product_id: 'PID1',
    business_id: 'BID1',
    sku: 'SKUDEMO-WHITE-M',
    name: 'SẢN PHẨM DEMO WHITE M',
    images: ['link image 1', 'link image 2'],
    option1: 'WHITE',
    option2: 'M',
    import_price: 100000,
    base_price: 150000,
    sale_price: 500000,
    available_stock_quantity: 0,
    low_stock_quantity: 10,
    out_stock_quantity: 0,
    shipping_quantity: 0,
    return_quantity: 0,
    status_check: 10,
    status_check_value: 20,
    status: 'low_stock',
};

let variant_3 = {
    variant_id: 'VID3',
    product_id: 'PID1',
    business_id: 'BID1',
    sku: 'SKUDEMO-BLACK-S',
    name: 'SẢN PHẨM DEMO BLACK S',
    images: ['link image 1', 'link image 2'],
    option1: 'BLACK',
    option2: 'S',
    import_price: 100000,
    base_price: 150000,
    sale_price: 500000,
    available_stock_quantity: 0,
    low_stock_quantity: 0,
    out_stock_quantity: 100,
    shipping_quantity: 0,
    return_quantity: 0,
    status_check: 10,
    status_check_value: 20,
    status: 'out_stock',
};

let variant_4 = {
    variant_id: 'VID4',
    product_id: 'PID1',
    business_id: 'BID1',
    sku: 'SKUDEMO-BLACK-M',
    name: 'SẢN PHẨM DEMO BLACK M',
    images: ['link image 1', 'link image 2'],
    option1: 'BLACK',
    option2: 'M',
    import_price: 100000,
    base_price: 150000,
    sale_price: 500000,
    available_stock_quantity: 200,
    low_stock_quantity: 0,
    out_stock_quantity: 0,
    shipping_quantity: 50,
    return_quantity: 50,
    status_check: 10,
    status_check_value: 30,
    status: 'available_stock',
};

let order = {
    order_id: 'OID1',
    business_id: 'BID1',
    sale_at: {
        store_id: 'SID1',
    },
    employee_id: 'EID1',
    customer_id: 'CID1',
    order_details: [
        {
            product_id: 'PID1',
            variant_id: 'VID2',
            variants: [
                {
                    variant_id: 'VID1',
                    product_id: 'PID1',
                    business_id: 'BID1',
                    sku: 'SKUDEMO-WHITE-S',
                    name: 'SẢN PHẨM DEMO WHITE S',
                    images: ['link image 1', 'link image 2'],
                    option1: 'WHITE',
                    option2: 'S',
                    import_price: 100000,
                    base_price: 150000,
                    sale_price: 500000,
                    available_stock_quantity: 200,
                    low_stock_quantity: 0,
                    out_stock_quantity: 0,
                    shipping_quantity: 0,
                    return_quantity: 0,
                    status_check: 10,
                    status_check_value: 20,
                    status: 'available_stock',
                },
                {
                    variant_id: 'VID2',
                    product_id: 'PID1',
                    business_id: 'BID1',
                    sku: 'SKUDEMO-WHITE-M',
                    name: 'SẢN PHẨM DEMO WHITE M',
                    images: ['link image 1', 'link image 2'],
                    option1: 'WHITE',
                    option2: 'M',
                    import_price: 100000,
                    base_price: 150000,
                    sale_price: 500000,
                    available_stock_quantity: 0,
                    low_stock_quantity: 10,
                    out_stock_quantity: 0,
                    shipping_quantity: 0,
                    return_quantity: 0,
                    status_check: 10,
                    status_check_value: 20,
                    status: 'low_stock',
                },
                {
                    variant_id: 'VID3',
                    product_id: 'PID1',
                    business_id: 'BID1',
                    sku: 'SKUDEMO-BLACK-S',
                    name: 'SẢN PHẨM DEMO BLACK S',
                    images: ['link image 1', 'link image 2'],
                    option1: 'BLACK',
                    option2: 'S',
                    import_price: 100000,
                    base_price: 150000,
                    sale_price: 500000,
                    available_stock_quantity: 0,
                    low_stock_quantity: 0,
                    out_stock_quantity: 100,
                    shipping_quantity: 0,
                    return_quantity: 0,
                    status_check: 10,
                    status_check_value: 20,
                    status: 'out_stock',
                },
                {
                    variant_id: 'VID4',
                    product_id: 'PID1',
                    business_id: 'BID1',
                    sku: 'SKUDEMO-BLACK-M',
                    name: 'SẢN PHẨM DEMO BLACK M',
                    images: ['link image 1', 'link image 2'],
                    option1: 'BLACK',
                    option2: 'M',
                    import_price: 100000,
                    base_price: 150000,
                    sale_price: 500000,
                    available_stock_quantity: 200,
                    low_stock_quantity: 0,
                    out_stock_quantity: 0,
                    shipping_quantity: 50,
                    return_quantity: 50,
                    status_check: 10,
                    status_check_value: 30,
                    status: 'available_stock',
                },
            ],
            properties: [
                { name: 'COLOR', value: 'WHITE' },
                { name: 'SIZE', value: 'M' },
            ],
            images: ['link image 1', 'link image 2'],
            length: 10,
            width: 10,
            height: 10,
            weight: 10,
            import_price: 100000,
            base_price: 150000,
            sale_price: 500000,
            quantity: 10,
            total: 5000000,
            taxable: true,
            tax_amount: 500000,
            discount: 500000,
            cost: 4000000,
            fulfillment_service: 'dhl',
            fulfillment_id: '1',
            fulfillment_status: 'shipped',
            fulfillable_quantity: 0,
            requires_shipping: true,
            supplier: 'TÊN NHÀ CUNG CẤP',
            tracking_number: '1',
            gift_card: true,
            carrier: 'dhl',
            status: 'done',
        },
    ],
    payments: [
        {
            method: 'CASH',
            value: 1000000,
        },
        {
            method: 'CARD',
            value: 2000000,
        },
    ],
    shipping_company_id: 'SCID1',
    shipping_info: {
        ship_code: 'SC1',
        to_name: 'Tên người nhận',
        to_phone: 'SĐT người nhận',
        to_address: 'Địa chỉ người nhận',
        to_ward: 'phường xã người nhận',
        to_district: 'quận huyện người nhận',
        to_province: 'tỉnh thành phố người nhận',
        return_name: 'Tên người nhận lại nếu đơn hàng bị hủy mặc định là nơi bán',
        return_phone: 'SĐT người nhận lại nếu đơn hàng bị hủy mặc định là nơi bán',
        return_address: 'Địa chỉ người nhận lại nếu đơn hàng bị hủy mặc định là nơi bán',
        return_ward: 'phường xã người nhận lại nếu đơn hàng bị hủy mặc định là nơi bán',
        return_district: 'quận huyện người nhận lại nếu đơn hàng bị hủy mặc định là nơi bán',
        return_province: 'tỉnh thành phố người nhận lại nếu đơn hàng bị hủy mặc định là nơi bán',
        ship_cost: 20000,
        payer: 'SELF',
        delivery_time: '2021-09-30T00:00:00+07:00',
        complete_time: '2021-10-30T00:00:00+07:00',
    },
    voucher: 'VOUCHER_0001',
    promotion: {
        promotion_id: 'PRID1',
        business_id: 'BID1',
        name: 'KHUYẾN MÃI DEMO',
        promotion_code: 'KMD',
        type: 'percent',
        value: 10,
        has_voucher: true,
        limit: {
            amount: 2,
            branchs: ['BRID1', 'BRID2'],
            stores: ['SID1', 'SID2'],
        },
        vouchers: [
            {
                voucher: 'KMD_0001',
                order_id: 'OID1',
                discount_amount: 500000,
                active: false,
            },
            {
                voucher: 'KMD_0361',
                order_id: '',
                discount_amount: 0,
                active: true,
            },
        ],
        total_discount: 500000,
        description: 'mo ta khuyen mai',
    },
    total_cost: 5000000,
    total_tax: 500000,
    total_discount: 500000,
    final_cost: 4000000,
    customer_paid: 4000000,
    customer_debt: true,
    customer_debt_value: 1000000,
    bill_status: 'DRAFT', // DRAFT - DOING - COMPLETE - CANCEL - REFUN
    ship_status: 'SHIPPING', // SHIPPING - COMPLETE - CANCEL
    note: 'ghi chú cho đơn hàng',
    create_date: '2021-09-30T00:00:00+07:00',
};