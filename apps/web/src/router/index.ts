/**
 * Vue Router Configuration
 * 
 * Defines application routes and navigation structure.
 * Uses Vue Router for client-side routing with history mode.
 */

import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import PostView from "../views/PostView.vue";
import LoginView from "../views/LoginView.vue";

/**
 * Create and configure Vue Router instance
 * Sets up routes for home, posts, and login pages
 */
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/posts",
      name: "posts",
      component: PostView,
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
  ],
});

export default router;
