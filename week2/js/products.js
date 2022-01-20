import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.26/vue.esm-browser.min.js';

const app = createApp({
    // 資料
    data() {
        return {
            // 產品資料
            apiUrl: 'https://vue3-course-api.hexschool.io/v2',
            apiPath: 'cadiis',
            products: [],
            productDetail:{}
        }
    },
    // 方法
    methods: {
        checkAdmin() {
            const url = `${this.apiUrl}/api/user/check`;
            axios.post(url)
            .then(() => {
                this.getData();
            })
            .catch((err) => {
                alert(err.data.message)
                window.location = 'index.html';
            });
        },
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
        getProduct(item) { 
            this.productDetail = item; 
        }
    },
    // 生命週期
    created() {
        // 取出 Token
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)myToken\s*=\s*([^;]*).*$)|^.*$/, '$1'); // regex
        axios.defaults.headers.common.Authorization = token;

        this.checkAdmin()
    }
}).mount('#app');