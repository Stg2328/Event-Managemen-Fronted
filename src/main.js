import { createApp } from 'vue'
import App from './App.vue'
import router from './routes'
import Toast from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import store from './Store/store';

const app = createApp(App);

app.use(Toast, {
  position: "top-right",     
  autoClose: 3000,            
  hideProgressBar: false,    
  theme: "dark",           
  closeOnClick: true,       
  draggable: true,       
});


app.use(store);

app.use(router).mount('#app');
