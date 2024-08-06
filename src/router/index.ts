import { createMemoryHistory, createRouter } from 'vue-router'

const indexView = () => import('../components/index.vue')

const routes = [
  { path: '/', component: indexView },
]

export default createRouter({
  history: createMemoryHistory(),
  routes,
})

