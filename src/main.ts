import Vue from 'vue'
import App from './App.vue'
//import VueMaterial from 'vue-material'
//import 'vue-material/dist/vue-material.css'
import { library } from '@fortawesome/fontawesome-svg-core';
import { faMars, faVenus, faTransgender, faEdit, faTrashAlt, faUserPlus, faSortAmountUpAlt, faSortAmountDownAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

//Vue.use(VueMaterial)
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import VueKonva from 'vue-konva'

library.add(faMars, faVenus, faTransgender, faEdit, faTrashAlt, faUserPlus, faSortAmountUpAlt, faSortAmountDownAlt);

Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.use(VueKonva)

Vue.use(BootstrapVue)
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
