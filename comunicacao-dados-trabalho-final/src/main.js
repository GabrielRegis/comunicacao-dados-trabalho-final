import Vue from 'vue';
import VueApexCharts from "vue-apexcharts";
import VueSocketIO from 'vue-socket.io';
import App from './App.vue';
import './plugins/vuetify';

export const SocketInstance = new VueSocketIO({
  debug: true,
  connection: 'http://localhost:3000'
})

Vue.use(SocketInstance)
Vue.config.productionTip = false
Vue.component('apexchart', VueApexCharts)

new Vue({
  render: h => h(App),
}).$mount('#app')
