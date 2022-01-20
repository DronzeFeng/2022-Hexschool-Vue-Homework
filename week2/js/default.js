// Import createApp from Vue
import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.26/vue.esm-browser.min.js';

const app = createApp({
    // 資料
    data() {
        return {
            // User資料格式
            user: {
                username: 'cadiis.inc@gmail.com',
                password: '/ncjXPHEJr9A%WV',
            }
        }
    },
    // 方法
    methods: {
        login() {
            const api = 'https://vue3-course-api.hexschool.io/v2/admin/signin';
            axios.post(api, this.user).then((response) => {
                const { token, expired } = response.data;
                document.cookie = `myToken=${token};expires=${new Date(expired)}; path=/`;
                window.location = 'products.html';
            }).catch((error) => {
                alert(error.data.message);
            });
        }
    },
    // 生命週期
    created() {}
}).mount('#app');