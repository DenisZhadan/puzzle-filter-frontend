import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import {createApp} from 'vue';
import App from './App.vue';
import i18n from '@/plugins/i18n';
import ApiService from '@/services/ApiService';


const app = createApp(App);
app.use(i18n);
ApiService.init(app);
app.mount('#app');
