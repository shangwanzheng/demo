import './assets/bootstrap.min.css'
import './assets/base.css'
import './assets/all.min.js'
// import 'element-plus/dist/index.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
// import ElementPlus from 'element-plus'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
// app.use(ElementPlus)
app.use(router)

app.mount('#app')
