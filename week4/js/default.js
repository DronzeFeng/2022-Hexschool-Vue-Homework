// Import createApp from Vue
import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.26/vue.esm-browser.min.js';

const app = createApp({
    data() {
        return {
            user: {
                username: 'cadiis.inc@gmail.com',
                password: '',
            }
        }
    },
    methods: {
        // 登入
        login() {
            const api = 'https://vue3-course-api.hexschool.io/v2/admin/signin';
            axios.post(api, this.user).then((response) => {
                const { token, expired } = response.data; // 解構賦值
                document.cookie = `hexschoolToken=${token};expires=${new Date(expired)}; path=/`;
                window.location = 'products.html';
            }).catch((error) => {
                alert(error.data.message);
            });
        }
    },
    mounted() {}
});

// 渲染
app.mount('#app');