import {createApp} from 'vue'
import App from './App.vue'
import store from './store'
import clickOutside from "./directives/click-outside";


const app = createApp(App)

app.use(store)
app.directive('click-outside', clickOutside)

app.mount('#app')
