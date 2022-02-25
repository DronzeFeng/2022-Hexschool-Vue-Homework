// Import createApp from Vue by ESM
// import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.26/vue.esm-browser.min.js";

// Hexschool API
const apiUrl = "https://vue3-course-api.hexschool.io/v2";
const apiPath = "cadiis";

// VeeValidate: 區域註冊 
const { defineRule, Form, Field, ErrorMessage, configure } = VeeValidate;
const { required, email, min, max } = VeeValidateRules;
const { localize, loadLocaleFromURL } = VeeValidateI18n;

// 定義表單欄位規則
defineRule('required', required);
defineRule('email', email);
defineRule('min', min);
defineRule('max', max);

// 讀取外部的資源
loadLocaleFromURL('https://unpkg.com/@vee-validate/i18n@4.1.0/dist/locale/zh_TW.json');

// 自訂設定
configure({ 
  generateMessage: localize('zh_TW'), // 啟用locale 
  //validateOnInput: true, // 調整為：輸入文字時，就立即進行驗證
});

// 使用ESM的寫法 => const app = createApp({...});
// 使用CDN的寫法 => const app = Vue.createApp({...});
const app = Vue.createApp({
  data() {
    return {
      cartData: {
        //carts: [],
      },
      products: [],
      productId: '',
      isLoadingItem: '',
      form: {
        user: {
          name: '',
          email: '',
          tel: '',
          address: '',
        },
        message: '',
      },
    };
  },
  components: {
    VForm: Form,
    VField: Field,
    ErrorMessage: ErrorMessage,
  },
  methods: {
    getProducts() {
      axios.get(`${apiUrl}/api/${apiPath}/products/all`)
      .then((res) => {
        this.products = res.data.products;
      })
      .catch((err) => {
        alert(err.data.message);
      });
    },
    openProductModal(id) {
      this.productId = id;
      this.$refs.productModal.openModal();
    },
    getCart() {
      axios.get(`${apiUrl}/api/${apiPath}/cart`)
      .then((res) => {
        console.log(res);
        this.cartData = res.data.data;
      })
      .catch((err) => {
        alert(err.data.message);
      });
    },
    addToCart(id, qty = 1) {
      const data = {
        product_id: id,
        qty,
      };
      this.isLoadingItem = id;
      axios.post(`${apiUrl}/api/${apiPath}/cart`, { data })
      .then((res) => {
        this.getCart();
        this.isLoadingItem = '';
      })
      .catch((err) => {
        alert(err.data.message);
      });
    },
    removeCartItem(id) {
      this.isLoadingItem = id;
      axios.delete(`${apiUrl}/api/${apiPath}/cart/${id}`)
      .then((res) => {
        this.getCart();
        this.$refs.productModal.closeModal();
        this.isLoadingItem = '';
      })
      .catch((err) => {
        alert(err.data.message);
      });
    },
    updateCartItem(item) {
      const data = {
        product_id: item.id,
        qty: item.qty,
      };
      this.isLoadingItem = item.id;
      axios.put(`${apiUrl}/api/${apiPath}/cart/${item.id}`, { data })
      .then((res) => {
        this.getCart();
        this.isLoadingItem = '';
      })
      .catch((err) => {
        alert(err.data.message);
      });
    },
    deleteCart() {
      const url = `${apiUrl}/api/${apiPath}/carts`;
      axios.delete(url).then((response) => {
        alert(response.data.message);
        this.getCart();
      }).catch((err) => {
        alert(err.data.message);
      });
    },
    createOrder() {
      const url = `${apiUrl}/api/${apiPath}/order`;
      const order = this.form;
      axios.post(url, { data: order }).then((response) => {
        alert(response.data.message);
        this.$refs.form.resetForm();
        this.getCart();
      }).catch((err) => {
        alert(err.data.message);
      });
    },
  },
  mounted() {
    this.getProducts();
    this.getCart();
  },
});

// $refs
app.component('product-modal',{
  template: '#userProductModal',
  props: ['id'],
  data() {
    return {
      modal: {},
      product: {},
      qty: 1,
    };
  },
  watch: {
    id() {
      this.getProduct();
    },
  },
  methods: {
    openModal() {
      this.modal.show();
    },
    closeModal() {
      this.modal.hide();
    },
    getProduct() {
      axios.get(`${apiUrl}/api/${apiPath}/product/${this.id}`)
      .then((res) => {
        this.product = res.data.product;
      })
      .catch((err) => {
        alert(err.data.message);
      });
    },
    addToCart() {
      this.$emit('add-cart', this.product.id, this.qty)
    },
  },
  mounted() {
    this.modal = new bootstrap.Modal(this.$refs.modal);
  }
});

app.mount('#app');