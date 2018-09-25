import Vue from 'vue'
import Router from 'vue-router'
import ebook from '@/Ebook'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/ebook'
    },
    {
      path: '/ebook',
      name: 'ebook',
      component: ebook
    }
  ]
})
