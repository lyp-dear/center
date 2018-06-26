import Vue from 'vue'
import App from './App'
import { Button, Cell,Field ,Picker  ,Popup ,Header } from 'mint-ui'
import router from './router'

Vue.config.productionTip = false
Vue.component(Button.name, Button)
Vue.component(Cell.name, Cell)
Vue.component(Field.name, Field);
Vue.component(Picker.name, Picker);
Vue.component(Popup.name, Popup);
Vue.component(Header.name, Header);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
