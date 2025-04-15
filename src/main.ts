import './assets/main.css'

import { definePreset } from '@primeuix/themes'
import Primevue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router/router'
import { ToastService } from 'primevue'

const app = createApp(App)

const MyPreset = definePreset(Aura, {
  semantic: {
    colorScheme: {
      light: {},
      dark: {},
    },
  },
})

app.use(router)
app.use(ToastService)
app.use(Primevue, {
  theme: {
    preset: MyPreset,
    options: {
      darkModeSelector: '.my-app-dark',
    },
  },
})

app.mount('#app')
