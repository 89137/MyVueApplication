<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import { useToast } from 'primevue'
import { showError, showSuccess } from '@/utils/toast'

const toast = useToast()

const frogTable = ref<any[]>([])
const isLoading = ref(true)

onMounted(() => {
  loadEntries()
})

const loadEntries = async () => {
  const { data, error } = await supabase.from('frogTable').select('*')

  if (data) {
    frogTable.value = data.sort((a, b) => a.id - b.id)
    subscribeEntries()
    showSuccess(toast, 'Content loaded')
    isLoading.value = false
  }
  if (error) {
    showError(toast, 'Failed to load content')
    isLoading.value = true
  }
}

const subscribeEntries = () => {
  supabase
    .channel('frogs-channel')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'frogTable' }, (payload) => {
      console.log('Change received!', payload)

      if (payload.eventType === 'INSERT') {
        frogTable.value.push(payload.new)
      }

      if (payload.eventType === 'DELETE') {
        const deletedId = payload.old.id
        frogTable.value = frogTable.value.filter((frog) => frog.id !== deletedId)
      }
      if (payload.eventType === 'UPDATE') {
        const updatedId = payload.new.id
        const index = frogTable.value.findIndex((frog) => frog.id === updatedId)
        if (index !== -1) Object.assign(frogTable.value[index], payload.new)
      }
    })
    .subscribe()
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
