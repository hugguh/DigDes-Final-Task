// JS
import './js/'

// SCSS
import './assets/scss/main.scss'

// CSS (example)
// import './assets/css/main.css'

// Vue.js
window.Vue = require('vue')
// import store from './store'

import VueRouter from 'vue-router'
import axios from 'axios'

var Main = require('./components/main.vue').default;
var Topic = require('./components/topic.vue').default;
var Create = require('./components/create.vue').default;

console.log(Main)

Vue.use(VueRouter)

var router = new VueRouter({
    routes: [
        {path: '/', component: Main},
        {path: '/topic/:id', component: Topic},
        {path: '/create', component: Create}
    ]
})
// Vue components (for use in html)


const main = new Vue({
    el: '#main',
    router: router,
})
// Vue init
// const app = new Vue({
//   data () {
//     return {
//       component: false,
//     }
//   },
//   store,
//   el: '#app'
// })





