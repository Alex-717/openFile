import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index'

import 'highlight.js/styles/stackoverflow-light.css'
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import hljsVuePlugin from "@highlightjs/vue-plugin";

hljs.registerLanguage('javascript', javascript);


createApp(App).use(router).use(hljsVuePlugin).mount('#app')
