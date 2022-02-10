import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.26/vue.esm-browser.min.js';

let productModal = {};
let delProductModal = {}; 

const app = createApp({
    data() {
        return {
            // 產品資料
            apiUrl: 'https://vue3-course-api.hexschool.io/v2',
            apiPath: 'cadiis',
            products: [],
            isNew: false,
            productDetail:{
                imagesUrl: []
            }
        }
    },
    methods: {
        // 確認是否有登入
        checkAdmin() {
            const url = `${this.apiUrl}/api/user/check`;
            // 取出 Token
            const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexschoolToken\s*=\s*([^;]*).*$)|^.*$/, '$1'); // Regex
            axios.defaults.headers.common.Authorization = token; // 傳遞token

            axios.post(url)
            .then(() => {
                this.getData();
            })
            .catch((err) => {
                alert(err.data.message)
                window.location = 'index.html';
            });
        },
        // 取得產品資料
        getData() {
            const url = `${this.apiUrl}/api/${this.apiPath}/admin/products`;
            axios.get(url)
            .then((response) => {
                this.products = response.data.products;
            })
            .catch((err) => {
                alert(err.data.message);
            });
        },
        // 更新產品資訊
        updateProduct() {
            let url = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
            let method = 'post';

            if (!this.isNew) { // 判斷是否為新增產品
                // 修改產品資訊
                url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.productDetail.id}`;
                method = 'put';
            }
            axios[method](url, { data: this.productDetail })
            .then((response) => {
                alert(response.data.message);
                this.getData();
                productModal.hide();
            })
            .catch((err) => {
                alert(err.data.message);
            });
        },
        // 刪除產品
        delProduct() {
            const url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.productDetail.id}`;

            axios.delete(url)
            .then((response) => {
                alert(response.data.message);
                delProductModal.hide();
                this.getData();
            })
            .catch((err) => {
                alert(err.data.message);
            });
        },
        // 觸發Modal的情境
        openModal(status, item) {
            if (status === 'new') {
                this.productDetail = {
                  imagesUrl: [],
                };
                productModal.show();
                this.isNew = true;
              } else if (status === 'edit') {
                this.productDetail = { imagesUrl: [], ...item }; //淺拷貝
                productModal.show();
                this.isNew = false;
              } else if (status === 'delete') {
                this.productDetail = { ...item }; //淺拷貝
                delProductModal.show();
              }
        },
        // 啟用狀態切換
        statusCheck(item) {
            if (item.is_enabled){
                item.is_enabled = 0;
            } else {
                item.is_enabled = 1;
            }
        },
    },
    mounted() {
        productModal = new bootstrap.Modal(document.getElementById('productModal'));
        delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'));

        this.checkAdmin();
    }
});

// 渲染
app.mount('#app');