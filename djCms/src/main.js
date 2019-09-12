import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/index'
import 'font-awesome/css/font-awesome.min.css'
import vueParticles from "vue-particles"
Vue.use(vueParticles)




import axios from "./http"
Vue.prototype.$axios = axios;

import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

Vue.use(ElementUI);

/* ------------------------------------------ */
//使用富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(VueQuillEditor);
/* ------------------------------------------ */

new Vue({
    router,
    store,
  render: h => h(App)
}).$mount('#app');

