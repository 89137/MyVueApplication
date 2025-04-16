<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const isDarkMode = ref(document.documentElement.classList.contains('my-app-dark'))

function toggleDarkMode() {
  document.documentElement.classList.toggle('my-app-dark')
  isDarkMode.value = document.documentElement.classList.contains('my-app-dark')
}

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

const isActiveRoute = (itemRoute: string) => route.name === itemRoute
</script>

<template>
  <div class="card">
    <Menubar :model="items" class="p-4 bg-surface-0" style="border-radius: 2rem">
      <template #start>
        <Image src="/images/axolotll.png" alt="Axolotll" width="35" height="40" class="h-8 px-2" />
      </template>

      <template #item="{ item }">
        <div :class="['p-Menubar-item', isActiveRoute(item.route) ? 'navbar rounded ' : '']">
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
      <template #end>
        <div class="hover:cursor-pointer pr-2" @click="toggleDarkMode()">
          <i v-if="isDarkMode" class="pi pi-sun"></i>
          <i v-else class="pi pi-moon"></i>
        </div>
      </template>
    </Menubar>
  </div>
</template>
