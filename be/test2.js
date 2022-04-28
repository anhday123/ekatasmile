var axios = require('axios');
var data = JSON.stringify({
    products: [
        {
            name: 'Bàn sứ',
            sku: 'BS',
            barcode: '',
            category_id: 1,
            supplier_id: 2,
            length: '',
            width: '',
            height: '',
            weight: '',
            unit: '',
            files: [],
            warranties: [],
            description: '',
            attributes: [
                {
                    option: 'Loại',
                    values: ['1', '2'],
                },
            ],
            variants: [
                {
                    title: 'Bàn sứ loại 1',
                    sku: 'BS-L1',
                    options: [],
                    image: [],
                    supplier: '',
                    price: 250000,
                    enable_bulk_price: false,
                    bulk_prices: [
                        {
                            min_quantity_apply: 2,
                            max_quantity_apply: 12,
                            price: 255555,
                        },
                        {
                            min_quantity_apply: 13,
                            max_quantity_apply: 24,
                            price: 250000,
                        },
                        {
                            min_quantity_apply: 25,
                            max_quantity_apply: 35,
                            price: 500000,
                        },
                    ],
                },
                {
                    title: 'Bàn sứ loại 2',
                    sku: 'BS-L2',
                    options: [],
                    image: [],
                    supplier: '',
                    price: 250000,
                    enable_bulk_price: false,
                    bulk_prices: [
                        {
                            min_quantity_apply: 2,
                            max_quantity_apply: 12,
                            price: 255555,
                        },
                        {
                            min_quantity_apply: 13,
                            max_quantity_apply: 24,
                            price: 250000,
                        },
                        {
                            min_quantity_apply: 25,
                            max_quantity_apply: 35,
                            price: 500000,
                        },
                    ],
                },
            ],
        },
    ],
});

var config = {
    method: 'post',
    url: 'https://upsale.com.vn/api/product/create',
    headers: {
        Authorization:
            'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7Il9pZCI6IjYyNmE1OTBlM2NmYzhmMWY5ZTdhMWI3YiIsInVzZXJfaWQiOi0xLCJ1c2VyX2NvZGUiOiIwMDAwMDEiLCJlbXBsb3llZV9pZCI6LTEsImNvZGUiOiIwMDAwMDEiLCJ1c2VybmFtZSI6IjA5Njc4NDU2MTkiLCJyb2xlX2lkIjotMSwiZW1haWwiOiJwaGFuZGFuZ2x1dS4wNzA2MTk5M0BnbWFpbC5jb20iLCJhdmF0YXIiOiJodHRwczovL3Vwc2FsZS5jb20udm4vYXBwL2xvZ28ucG5nIiwiZmlyc3RfbmFtZSI6IiIsImxhc3RfbmFtZSI6Imx1bHVzaG9wIiwibmFtZSI6Imx1bHVzaG9wIiwiYmlydGhfZGF5IjoiMjAyMi0wNC0yOFQxNjowNjoyMiswNzowMCIsImFkZHJlc3MiOiIiLCJkaXN0cmljdCI6IiIsInByb3ZpbmNlIjoiIiwiYnJhbmNoX2lkIjotMSwic3RvcmVfaWQiOi0xLCJvdHBfY29kZSI6IjAzOTQ2OCIsIm90cF90aW1lbGlmZSI6IjIwMjItMDQtMjhUMTY6MTE6MjIrMDc6MDAiLCJsYXN0X2xvZ2luIjoiMjAyMi0wNC0yOFQxNjowNzoxMiswNzowMCIsImNyZWF0ZV9kYXRlIjoiMjAyMi0wNC0yOFQxNjowNjoyMiswNzowMCIsImNyZWF0b3JfaWQiOi0xLCJsYXN0X3VwZGF0ZSI6IjIwMjItMDQtMjhUMTY6MDY6MjIrMDc6MDAiLCJ1cGRhdGVyX2lkIjotMSwiYWN0aXZlIjp0cnVlLCJzbHVnX25hbWUiOiJsdWx1c2hvcCIsInNsdWdfYWRkcmVzcyI6IiIsInNsdWdfZGlzdHJpY3QiOiIiLCJzbHVnX3Byb3ZpbmNlIjoiIiwiX3JvbGUiOnsiX2lkIjoiNjI2YTU5MGUzY2ZjOGYxZjllN2ExYjdmIiwicm9sZV9pZCI6LTEsImNvZGUiOiIwMDAwMDEiLCJuYW1lIjoiQURNSU4iLCJwZXJtaXNzaW9uX2xpc3QiOlsidGFvX2Rvbl9oYW5nIiwibmhvbV9zYW5fcGhhbSIsInRoZW1fc2FuX3BoYW0iLCJ4b2Ffc2FuX3BoYW0iLCJ0YW9fbmhvbV9zYW5fcGhhbSIsInhvYV9uaG9tX3Nhbl9waGFtIiwiY2FwX25oYXRfbmhvbV9zYW5fcGhhbSIsInRoZW1fY2hpX25oYW5oIiwiY2FwX25oYXRfY2hpX25oYW5oIiwidGhlbV9raG8iLCJjYXBfbmhhdF9raG8iLCJ0YW9fcGhpZXVfY2h1eWVuX2hhbmciLCJjYXBfbmhhdF90cmFuZ190aGFpX3BoaWV1X2NodXllbl9oYW5nIiwidGhlbV9uaGFfY3VuZ19jYXAiLCJjYXBfbmhhdF9uaGFfY3VuZ19jYXAiLCJ0aGVtX3BoaWV1X2Jhb19oYW5oIiwidGhlbV9raHV5ZW5fbWFpIiwidGhlbV9waGlldV9raWVtX2hhbmciLCJ0aGVtX2toYWNoX2hhbmciLCJjYXBfbmhhdF9raGFjaF9oYW5nIiwidGhlbV9waGlldV9kb2lfc29hdF92YW5fY2h1eWVuIiwidGhlbV9kb2lfdGFjX3Zhbl9jaHV5ZW4iLCJjYXBfbmhhdF9kb2lfdGFjX3Zhbl9jaHV5ZW4iLCJ4b2FfZG9pX3RhY192YW5fY2h1eWVuIiwidGhlbV9uZ3VvaV9kdW5nIiwidGhlbV9uaGFuX3N1IiwiY2FwX25oYXRfbmhhbl9zdSIsInRoZW1fdGh1ZSIsInRoZW1faGluaF90aHVjX3RoYW5oX3RvYW4iLCJ0YW9fcXV5ZW4iLCJ0YW9fdXVfZGFpIiwidGFvX2JhaV92aWV0IiwidGFvX3RodW9uZ19oaWV1IiwidGFvX2tlbmhfYmFuX2hhbmciXSwibWVudV9saXN0IjpbInRvbmdfcXVhbiIsImJhbl9oYW5nIiwiZGFuaF9zYWNoX2Rvbl9oYW5nIiwic2FuX3BoYW0iLCJxdWFuX2xpX3Nhbl9waGFtIiwicXVhbl9saV9jaGlfbmhhbmgiLCJxdWFuX2xpX2tobyIsInF1YW5fbGlfY2h1eWVuX2hhbmciLCJxdWFuX2xpX25oYV9jdW5nX2NhcCIsInF1YW5fbGlfYmFvX2hhbmgiLCJraHV5ZW5fbWFpIiwibmhhcF9oYW5nIiwia2llbV9oYW5nX2N1b2lfbmdheSIsInBoaWV1X2NodXllbl9oYW5nIiwidGljaF9kaWVtIiwicXVhbl9saV9raGFjaF9oYW5nIiwiYmFvX2Nhb19kb25faGFuZyIsImJhb19jYW9fdG9uX2tobyIsImJhb19jYW9fdGFpX2NoaW5oIiwidmFuX2NodXllbiIsImRvaV9zb2F0X3Zhbl9jaHV5ZW4iLCJxdWFuX2xpX2RvaV90YWNfdmFuX2NodXllbiIsImNhdV9oaW5oX3Rob25nX3RpbiIsInF1YW5fbGlfbmd1b2lfZHVuZyIsInF1YW5fbGlfbmhhbl9zdSIsInF1YW5fbGlfdGh1ZSIsInF1YW5fbGlfdGhhbmhfdG9hbiIsIm5oYXBfeHVhdF9maWxlIiwibmhhdF9raV9ob2F0X2RvbmciLCJxdWFuX2xpX3BoYW5fcXV5ZW4iXSwiZGVmYXVsdCI6dHJ1ZSwiY3JlYXRlX2RhdGUiOiIyMDIyLTA0LTI4VDE2OjA2OjIyKzA3OjAwIiwiY3JlYXRvcl9pZCI6LTEsImxhc3RfdXBkYXRlIjoiMjAyMi0wNC0yOFQxNjowNjoyMiswNzowMCIsInVwZGF0ZXJfaWQiOi0xLCJhY3RpdmUiOnRydWUsInNsdWdfbmFtZSI6ImFkbWluIn0sIl9icmFuY2giOnsiX2lkIjoiNjI2YTU5MGUzY2ZjOGYxZjllN2ExYjgzIiwiYnJhbmNoX2lkIjotMSwiY29kZSI6IjAwMDAwMSIsIm5hbWUiOiJDaGkgbmjDoW5oIG3hurdjIMSR4buLbmgiLCJsb2dvIjoiaHR0cHM6Ly91cHNhbGUuY29tLnZuL2FwcC9sb2dvLnBuZyIsInBob25lIjoiIiwiZW1haWwiOiIiLCJmYXgiOiIiLCJ3ZWJzaXRlIjoiIiwibGF0aXR1ZGUiOiIiLCJsb25naXR1ZGUiOiIiLCJ3YXJlaG91c2VfdHlwZSI6IlN0b3JlIiwiYWRkcmVzcyI6IiIsIndhcmQiOiIiLCJkaXN0cmljdCI6IiIsInByb3ZpbmNlIjoiIiwiYWNjdW11bGF0ZV9wb2ludCI6ZmFsc2UsInVzZV9wb2ludCI6ZmFsc2UsImNyZWF0ZV9kYXRlIjoiMjAyMi0wNC0yOFQxNjowNjoyMiswNzowMCIsImNyZWF0b3JfaWQiOi0xLCJsYXN0X3VwZGF0ZSI6IjIwMjItMDQtMjhUMTY6MDY6MjIrMDc6MDAiLCJ1cGRhdGVyX2lkIjotMSwiYWN0aXZlIjp0cnVlLCJzbHVnX25hbWUiOiJjaGktbmhhbmgtbWFjLWRpbmgiLCJzbHVnX3dhcmVob3VzZV90eXBlIjoic3RvcmUiLCJzbHVnX2FkZHJlc3MiOiIiLCJzbHVnX3dhcmQiOiIiLCJzbHVnX2Rpc3RyaWN0IjoiIiwic2x1Z19wcm92aW5jZSI6IiJ9LCJkYXRhYmFzZSI6Imx1bHVzaG9wREIiLCJfYnVzaW5lc3MiOnsiX2lkIjoiNjI2YTU5MGUzY2ZjOGYxZjllN2ExYjdhIiwiYnVzaW5lc3NfaWQiOjQxMCwidXNlcm5hbWUiOiIwOTY3ODQ1NjE5IiwicHJlZml4IjoibHVsdXNob3AiLCJidXNpbmVzc19uYW1lIjoibHVsdXNob3AiLCJkYXRhYmFzZV9uYW1lIjoibHVsdXNob3BEQiIsImNvbXBhbnlfbmFtZSI6IiIsImNvbXBhbnlfZW1haWwiOiIiLCJjb21wYW55X3Bob25lIjoiIiwiY29tcGFueV93ZWJzaXRlIjoiIiwiY29tcGFueV9sb2dvIjoiaHR0cHM6Ly9pY29uLWxpYnJhcnkuY29tL2ltYWdlcy9tZXJjaGFudC1pY29uL21lcmNoYW50LWljb24tMTIuanBnIiwiY29tcGFueV9hZGRyZXNzIjoiIiwiY29tcGFueV9kaXN0cmljdCI6IiIsImNvbXBhbnlfcHJvdmluY2UiOiIiLCJ0YXhfY29kZSI6IiIsImNhcmVlcl9pZCI6IiIsInByaWNlX3JlY2lwZSI6IkZJRk8iLCJ2ZXJpZnlfd2l0aCI6IlBIT05FIiwiYWN0aXZlIjp0cnVlfX0sImV4cCI6MTY1MzcyOTYxOSwiaWF0IjoxNjUxMTM3NjE5fQ.RqkCGWda2EngCdeeI2M5W2lhhDBuFR0GjwwPStuiXiRdj_F_E8R1MO2cAn78OUVt09L6axfssSkUpWZdaXxeluA_1kz_XIipx_v-PikQXlsd12b7x4ri3m0oKcj_JbettmQFwNVM7t7bVDiyeOd_s6qEn_Hsi_eeD06B_pHLRfA',
        'Content-Type': 'application/json',
    },
    data: data,
};

let _createProduct = async () => {
    try {
        let response = await axios(config);
        if (response && response.data) {
            console.log(response.data);
        }
    } catch (err) {
        throw err;
    }
};

Promise.all([_createProduct(), _createProduct()])
    .then((data) => {
        console.log(data);
    })
    .catch((err) => {
        console.log(err);
    });
