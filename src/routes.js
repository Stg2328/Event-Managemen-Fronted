import { createRouter, createWebHistory } from 'vue-router';
import Signup from './components/SignUp/signup.vue';
import Login from './components/Login/login.vue';
import Home from './components/Home/home.vue';
import NoPageFound from './components/NoPageFound/NoPageFound.vue';
import ConfirmUser from './components/ConfirmUser/confirmUser.vue';

function isAuthenticated() {
  return !!localStorage.getItem("token"); 
}

const routes = [
  {
    name: 'home',
    path: '/',
    component: Signup
  },
  {
    name: 'login',
    path: '/login',
    component: Login 
  },
  {
    name: 'landing',
    path: '/home',
    component: Home,
    meta: { requiresAuth: true },
  },
  {
    path: '/confirm/:email',
    name: 'confirmAccount',
    component: ConfirmUser,
    props: route => ({ email: route.params.email }),
  },
  {
    path: '/:pathMatch(.*)*', 
    name: 'not-found',
    component: NoPageFound, 
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});


router.beforeEach((to, from, next) => {
  if (isAuthenticated()) {
    if (to.name === 'login' || to.name === 'home') {
      return next({ name: 'landing' });
    }
  }

  if (to.meta.requiresAuth && !isAuthenticated()) {
    return next({ name: 'login' });
  }

  next();
});


export default router;
