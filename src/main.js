import { createApp } from 'vue'
import App from './App.vue'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js' // ini untuk style JS yang lebih interaktif
import 'bootstrap-icons/font/bootstrap-icons.css'

import router from './router'
import { createPinia } from 'pinia'

import VCalendar from 'v-calendar'
import 'v-calendar/style.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(VCalendar, {})
app.mount('#app')