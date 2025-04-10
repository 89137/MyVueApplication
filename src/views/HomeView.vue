<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import { useToast } from 'primevue'
import { showError, showSuccess } from '@/utils/toast'

const toast = useToast()

const frogTable = ref<unkown[]>([])
const isLoading = ref(true)

onMounted(() => {
  loadEntries()
})

const loadEntries = async () => {
  const { data, error } = await supabase.from('frogTable').select('*')

  if (data) {
    frogTable.value = data.sort((a, b) => a.id - b.id)
    showSuccess(toast, 'Content loaded')
    isLoading.value = false
  }
  if (error) {
    showError(toast, 'Failed to load content')
    isLoading.value = true
  }
}
</script>

<template>
  <Card>
    <template #content>
      <Skeleton v-if="isLoading" />
      <div v-else>
        <ol>
          <div v-if="frogTable.length === 0">No frogs available</div>

          <li v-for="frogs in frogTable" :key="frogs.id">
            <div>{{ frogs.id }} {{ frogs.frogs }}</div>
          </li>
        </ol>
      </div>
    </template>
  </Card>
</template>
