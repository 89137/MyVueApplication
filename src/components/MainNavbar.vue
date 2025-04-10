<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const items = ref([
  {
    label: 'Home',
    route: 'Home',
  },
  {
    label: 'SubPage',
    route: 'SubPage',
  },
])

const isActiveRoute = (itemRoute) => route.name === itemRoute
</script>

<template>
  <div class="card">
    <MegaMenu :model="items" class="p-4 bg-surface-0" style="border-radius: 2rem">
      <template #start>
        <Image src="/images/axolotll.png" alt="Axolotll" width="35" height="40" class="h-8 pr-2" />
      </template>

      <template #item="{ item }">
        <div :class="['p-megamenu-item-content', isActiveRoute(item.route) ? 'bg-gray-800 ' : '']">
          <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
            <a
              v-ripple
              :href="href"
              @click="navigate"
              class="flex items-center cursor-pointer px-4 py-2 font-semibold text-lg uppercase"
              style="border-radius: 2rem"
            >
              <span>{{ item.label }}</span>
            </a>
          </router-link>
        </div>
      </template>
    </MegaMenu>
  </div>
</template>
