import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import UserPass from '@/components/forgot/userpass'
import RegisterUser from '@/components/register/index'
import MonitorUser from '@/components/monitor/index'
import UserBulkSearch from '@/components/bulk/usersearch'
import DomainBulkSearch from '@/components/bulk/domainsearch'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/forgotpass',
      name: 'Forgot Password',
      component: UserPass
    },
    {
      path: '/register',
      name: 'Register',
      component: RegisterUser
    },
    {
      path: '/monitor',
      name: 'Monitor',
      component: MonitorUser
    },
    {
      path: '/domainbulk',
      name: 'Bulk Search',
      component: DomainBulkSearch
    },
    {
      path: '/userbulk',
      name: 'Bulk Search',
      component: UserBulkSearch
    }
  ]
})
