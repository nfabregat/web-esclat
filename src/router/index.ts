import Home from "@/pages/home/Home.vue";
import Artistas from "@/pages/artistas/Artistas.vue";
import ArtistasGaleria from "@/pages/artistas/Galeria.vue";
import Contacto from "@/pages/contacto/Contacto.vue";
import Entradas from "@/pages/entradas/Entradas.vue";
import Info from "@/pages/info/Info.vue";
import Menu from "@/pages/menu/Menu.vue";
import Programa from "@/pages/programa/Programa.vue";
import Producto from "@/pages/tienda/Producto.vue";
import Tienda from "@/pages/tienda/Tienda.vue";
import FestivalLayout from "@/layouts/FestivalLayout.vue";
import { createRouter, createWebHashHistory } from "vue-router";

export const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }

    if (to.hash) {
      return {
        el: to.hash,
        top: 0,
      };
    }

    return { top: 0, left: 0 };
  },

  routes: [
    {
      path: "/",
      component: FestivalLayout,
      children: [
        {
          path: "",
          name: "home",
          component: Home,
        },
        {
          path: "menu",
          name: "menu",
          component: Menu,
        },
        {
          path: "info",
          name: "info",
          component: Info,
        },
        {
          path: "programa",
          name: "programa",
          component: Programa,
        },
        {
          path: "artistas",
          name: "artistas",
          component: Artistas,
        },
        {
          path: "artistas/galeria",
          name: "artistas-galeria",
          component: ArtistasGaleria,
        },
        {
          path: "entradas",
          name: "entradas",
          component: Entradas,
        },
        {
          path: "tienda/:productId?",
          name: "tienda-product",
          component: Producto,
        },
        {
          path: "tienda",
          name: "tienda",
          component: Tienda,
        },
        {
          path: "contacto",
          name: "contacto",
          component: Contacto,
        },
      ],
    },
    {
      path: "/:patchMatch(.*)*",
      redirect: "/",
    },
  ],
});
