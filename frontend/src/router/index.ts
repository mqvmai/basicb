import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import PlaceView from "../views/PlaceView.vue";

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: HomeView },
    { path: "/place/:id", component: PlaceView },
  ],
});
