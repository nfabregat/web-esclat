import Home from "@/pages/home/Home.vue";
import Artistas from "@/pages/artistas/Artistas.vue";
import Contacto from "@/pages/contacto/Contacto.vue";
import Entradas from "@/pages/entradas/Entradas.vue";
import Info from "@/pages/info/Info.vue";
import Menu from "@/pages/menu/Menu.vue";
import Programa from "@/pages/programa/Programa.vue";
import Tienda from "@/pages/tienda/Tienda.vue";
import { createRouter, createWebHashHistory } from "vue-router";



export const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/menu',
      name: 'menu',
      component: Menu
    },
    {
      path: '/info',
      name: 'info',
      component: Info
    },
    {
      path: '/programa',
      name: 'programa',
      component: Programa
    },
    {
      path: '/artistas',
      name: 'artistas',
      component: Artistas
    },
    {
      path: '/entradas',
      name: 'entradas',
      component: Entradas
    },
    {
      path: '/tienda',
      name: 'tienda',
      component: Tienda
    },
    {
      path: '/contacto',
      name: 'contacto',
      component: Contacto
    },
    {
      path: '/:patchMatch(.*)',
      redirect: '/'
    }
  ]
})
