import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import Signup from '../views/Signup.vue';
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/signup',
    name: 'Signup',
    component: Signup,
    beforeEnter: (to, from, next) => {
      if (localStorage.getItem('token')) {
        next('/dashboard');
      } else {
        next();
      }
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    beforeEnter: (to, from, next) => {
      if (localStorage.getItem('token')) {
        next('/dashboard');
      } else {
        next();
      }
    },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    beforeEnter: (to, from, next) => {
      if (localStorage.getItem('token')) {
        next();
      } else {
        next('/login');
      }
    },
  },
];

const router = new VueRouter({
  routes,
});

export default router;
