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
const wolfTable = ref<any[]>([])
const isLoading = ref(true)
const wolfInput = ref<string>()
const wolfUpdates = ref<Record<string, string>>({})

onMounted(() => {
  loadEntries()
})

const loadEntries = async () => {
  const { data, error } = await supabase.from('wolfTable').select('*')

  if (data) {
    wolfTable.value = data.sort((a, b) => a.id - b.id)
    subscribeEntries()
    isLoading.value = false
  }
  if (error) {
    showError(toast, 'Failed to load content')
    isLoading.value = true
  }
}

async function onclickAdd() {
  const { error } = await supabase.from('wolfTable').insert([{ naam: wolfInput.value }])
  wolfInput.value = ''
  if (error) {
    showError(toast, 'Failed to add content')
  } else {
    showSuccess(toast, 'content added')
  }
}

async function onclickDelete(id: number) {
  const { error } = await supabase.from('wolfTable').delete().eq('id', id)
  if (error) {
    showError(toast, 'Failed to delete content')
  } else {
    showSuccess(toast, 'content deleted')
  }
}

async function onclickUpdate(id: string) {
  const updatedValue = wolfUpdates.value[id]
  const { error } = await supabase.from('wolfTable').update({ naam: updatedValue }).eq('id', id)
  if (error) {
    showError(toast, 'Failed to update content')
  } else {
    showSuccess(toast, 'Content updated')
    wolfUpdates.value[id] = ''
  }
}

const subscribeEntries = () => {
  supabase
    .channel('naam-channel')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'wolfTable' }, (payload) => {
      console.log('Change received!', payload)

      if (payload.eventType === 'INSERT') {
        wolfTable.value.push(payload.new)
      }

      if (payload.eventType === 'DELETE') {
        const deletedId = payload.old.id
        wolfTable.value = wolfTable.value.filter((wolf) => wolf.id !== deletedId)
      }
      if (payload.eventType === 'UPDATE') {
        const updatedId = payload.new.id
        const index = wolfTable.value.findIndex((wolf) => wolf.id === updatedId)
        if (index !== -1) Object.assign(wolfTable.value[index], payload.new)
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
          <form @submit.prevent="onclickAdd" class="formScreen">
              <p class="text-1xl pr-1">Add a wolf:</p>
              <InputText class="mr-3" name="name" v-model="wolfInput" required />
              <Button type="submit" label="Add" v-tooltip="'Add a wolf'" />
            </form>
        </div>
        <Fieldset legend="My wolfs">
          <div class="tableHeight">
            <DataTable
              :value="wolfTable"
              scrollable
              scrollHeight="calc(100vh - 25em)"
              paginator
              stripedRows
              :rows="50"
              :rowsPerPageOptions="[5, 10, 20, 50]"
            >
              <Column header="Number" style="width: 15%">
                <template #body="slotProps">
                  {{ slotProps.data.id }}
                </template>
              </Column>
              <Column header="Naam" style="width: 30%">
                <template #body="slotProps">
                  <div class="textSize">
                    {{ slotProps.data.naam }}
                  </div>
                </template>
              </Column>
              <Column header="Locatie" style="width: 100%">
                <template #body="slotProps">
                  <div class="textSize">
                    {{ slotProps.data.locatie }}
                  </div>
                </template>
              </Column>
              <Column v-if="!admin" header="Actions" style="width: 50%">
                <template #body="slotProps">
                  <form @submit.prevent="onclickUpdate(slotProps.data.id)">
                    <InputText
                      class="mr-5"
                      v-model="wolfUpdates[slotProps.data.id]"
                      required
                      v-tooltip.top="'New wolf content'"
                    />
                    <Button
                      type="submit"
                      class="!py-1"
                      label="Edit"
                      v-tooltip.top="'Edit the wolf'"
                    />
                    <Button
                      class="!py-1 m-2"
                      label="Delete"
                      @click="onclickDelete(slotProps.data.id)"
                      v-tooltip.top="'Delete the wolf'"
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
