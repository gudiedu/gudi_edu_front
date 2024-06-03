import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "axios";
import Modal from "vue-bs-modal";

//local css 적용
import "./assets/css/admin/reset.css";
import "./assets/css/admin/basic.css";
import "./assets/css/admin/common.css";
import "./assets/css/admin/layout.css";
//bootstrap lib css적용
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import mitt from "mitt";
import globals from "./commomGlobal/global.js";

//vuetify 적용
import { createVuetify } from "vuetify";
import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

// 실제 데이터를 json으로 주고받기 위해 무언가 요청할 때 사용할 수 있도록 설정
axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded";

const app = createApp(App);

const emitter = mitt();

const vuetify = createVuetify({
  components,
  directives,
});

app
  .use(store)
  .use(router)
  .use(globals)
  .use(emitter)
  .use(Modal, { dynamic: true })
  .use(vuetify)
  .mount("#app");

// app에 통신할 때 axios 쓸 거야 선언
app.config.globalProperties.axios = axios;
app.config.productionTip = false;

app.config.globalProperties.emitter = emitter;
