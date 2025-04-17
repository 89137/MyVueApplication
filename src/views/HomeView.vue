<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import { useToast } from 'primevue'
import { showError, showSuccess } from '@/utils/toast'

const toast = useToast()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const frogTable = ref<any[]>([])
const isLoading = ref(true)
const frogInput = ref<string>()
const frogUpdates = ref<Record<string, string>>({})

const user = ref(true)

async function onclickAdd() {
  const { error } = await supabase.from('frogTable').insert([{ frogs: frogInput.value }])
  frogInput.value = ''
  if (error) {
    showError(toast, 'Failed to add content')
  } else {
    showSuccess(toast, 'content added')
  }
}

async function onclickDelete(id: string) {
  const { error } = await supabase.from('frogTable').delete().eq('id', id)
  if (error) {
    showError(toast, 'Failed to delete content')
  } else {
    showSuccess(toast, 'content deleted')
  }
}

async function onclickUpdate(id: string) {
  const updatedValue = frogUpdates.value[id]
  const { error } = await supabase.from('frogTable').update({ frogs: updatedValue }).eq('id', id)
  if (error) {
    showError(toast, 'Failed to update content')
  } else {
    showSuccess(toast, 'content updated')
  }
}

onMounted(() => {
  loadEntries()
})

const loadEntries = async () => {
  const { data, error } = await supabase.from('frogTable').select('*')

  if (data) {
    frogTable.value = data.sort((a, b) => a.id - b.id)
    subscribeEntries()
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
        <div class="flex justify-center">
          <form @submit.prevent="onclickAdd">
            <InputText class="mr-3" name="fname" v-model="frogInput" required />
            <Button type="submit" label="Add" />
          </form>
        </div>
        <ol class="p-5">
          <div v-if="frogTable.length === 0">No frogs available.</div>

          <li v-for="frogs in frogTable" :key="frogs.id" class="list-decimal">
            <div class="border-b mb-3 min-h-[50px]">
              {{ frogs.frogs }}
              <form v-if="user" @submit.prevent="onclickUpdate(frogs.id)">
                <InputText class="my-5 mr-5" v-model="frogUpdates[frogs.id]" required />
                <Button type="submit" class="!py-1" label="Edit" />
                <Button
                  v-if="user"
                  class="!py-1 m-2"
                  label="delete"
                  @click="onclickDelete(frogs.id)"
                ></Button>
              </form>
            </div>
          </li>
        </ol>
      </div>
    </template>
  </Card>
</template>
