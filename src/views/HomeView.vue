<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import { useToast } from 'primevue'
import { showError, showSuccess } from '@/utils/toast'
import { admin } from '@/utils/admin'

export interface Iprops {
  admin: boolean
}

const toast = useToast()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const frogTable = ref<any[]>([])
const isLoading = ref(true)
const frogInput = ref<string>()
const frogUpdates = ref<Record<string, string>>({})

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
    showSuccess(toast, 'Content updated')
    frogUpdates.value[id] = ''
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
  <Card class="overflow-auto">
    <template #content>
      <Skeleton v-if="isLoading" />
      <div v-else>
        <div class="flex items-center flex-col">
          <div v-if="admin">
            <form @submit.prevent="onclickAdd" class="formScreen">
              <p class="text-1xl pr-1">Add a frog:</p>
              <InputText class="mr-3" name="fname" v-model="frogInput" required />
              <Button type="submit" label="Add" v-tooltip="'Add a frog'" />
            </form>
          </div>
          <div v-else>A small project made in preperation for my exam</div>
        </div>
        <Fieldset legend="My frogs">
          <div class="tableHeight">
            <DataTable
              :value="frogTable"
              scrollable
              scrollHeight="calc(100vh - 25em)"
              paginator
              stripedRows
              :rows="50"
              :rowsPerPageOptions="[5, 10, 20, 50]"
            >
              <Column header="Number" style="width: 10%">
                <template #body="slotProps">
                  {{ slotProps.data.id }}
                </template>
              </Column>
              <Column header="Name" style="width: 40%">
                <template #body="slotProps">
                  <div class="textSize">
                    {{ slotProps.data.frogs }}
                  </div>
                </template>
              </Column>
              <Column v-if="admin" header="Actions" style="width: 50%">
                <template #body="slotProps">
                  <form @submit.prevent="onclickUpdate(slotProps.data.id)">
                    <InputText
                      class="mr-5"
                      v-model="frogUpdates[slotProps.data.id]"
                      required
                      v-tooltip.top="'New frog content'"
                    />
                    <Button
                      type="submit"
                      class="!py-1"
                      label="Edit"
                      v-tooltip.top="'Edit the frog'"
                    />
                    <Button
                      class="!py-1 m-2"
                      label="Delete"
                      @click="onclickDelete(slotProps.data.id)"
                      v-tooltip.top="'Delete the frog'"
                    />
                  </form>
                </template>
              </Column>
            </DataTable>
          </div>
        </Fieldset>
      </div>
    </template>
  </Card>
</template>
