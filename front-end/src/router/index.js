import Vue from 'vue'
import VueRouter from 'vue-router'
import VueSimpleAlert from "vue-simple-alert";
import Home from '../views/Home.vue'
import Creator from '../views/Creator.vue'

Vue.use(VueRouter)
Vue.use(VueSimpleAlert)

const routes = [{
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/creator',
    name: 'creator',
    component: Creator
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
