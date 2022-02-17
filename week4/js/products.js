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
            },
            pagination: {}
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
        getData(page = 1) {
            const url = `${this.apiUrl}/api/${this.apiPath}/admin/products?page=${page}`;
            axios.get(url)
            .then((response) => {
                const { products, pagination } = response.data; // 解構賦值
                this.products = products;
                this.pagination = pagination;
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
        }
    },
    mounted() { // 只執行一次
        productModal = new bootstrap.Modal(document.getElementById('productModal'));
        delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'));

        this.checkAdmin();
    }
});

// 元件-分頁
app.component('pagination', {
    template: '#pagination',
    props: ['pages'],
    methods: {
        emitPages(item) {
            this.$emit('emit-pages', item);
        }
    },
    mounted() {} // 只執行一次
});
// 元件-外跳視窗：新增、編輯產品
app.component('productModal',{
    template: '#productModal',
    props: ['product', 'isNew'],
    data() {
        return {
            apiUrl: 'https://vue3-course-api.hexschool.io/v2',
            apiPath: 'cadiis'
        }
    },
    methods: {
        // 更新產品資訊
        updateProduct() {
            let url = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
            let method = 'post';

            if (!this.isNew) { // 判斷是否為新增產品
                // 修改產品資訊
                url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.product.id}`;
                method = 'put';
            }

            axios[method](url, { data: this.product })
            .then((response) => {
                alert(response.data.message);
                this.$emit('update'); // 回傳給自身Modal
                productModal.hide();
            })
            .catch((err) => {
                alert(err.data.message);
            });
        }
    },
    mounted() { // 只執行一次
        productModal = new bootstrap.Modal(document.getElementById('productModal'), {
            keyboard: false,
            backdrop: 'static'
        });
    }
});
// 元件-外跳視窗：刪除產品
app.component('delProductModal',{
    template: '#delProductModal',
    props: ['item'],
    data() {
        return {
            apiUrl: 'https://vue3-course-api.hexschool.io/v2',
            apiPath: 'cadiis'
        }
    },
    methods: {
        // 刪除產品
        delProduct() {
            const url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.item.id}`;

            axios.delete(url)
            .then((response) => {
                alert(response.data.message);
                this.$emit('update');
                delProductModal.hide();
            })
            .catch((err) => {
                alert(err.data.message);
            });
        },
    },
    mounted() { // 只執行一次
        productModal = new bootstrap.Modal(document.getElementById('productModal'), {
            keyboard: false,
            backdrop: 'static'
        });
    }
});
// 渲染
app.mount('#app');