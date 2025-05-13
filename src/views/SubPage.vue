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
const wolfInputAantal = ref<number>()
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
  const { error } = await supabase.from('wolfTable').insert([{ aantal: wolfInputAantal.value }])
  wolfInputAantal.value = 0
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

async function onclickUpdate(id: number) {
  const inputValue = Number(wolfUpdates.value[id])
  if (isNaN(inputValue)) {
    showError(toast, 'Ongeldige invoer')
    return
  }

  // Haal het huidige aantal op
  const { data, error: fetchError } = await supabase
    .from('wolfTable')
    .select('aantal')
    .eq('id', id)
    .single()

  if (fetchError || !data) {
    showError(toast, 'Kan huidige hoeveelheid niet ophalen')
    return
  }

  const updatedAantal = data.aantal + inputValue

  const { error: updateError } = await supabase
    .from('wolfTable')
    .update({ aantal: updatedAantal })
    .eq('id', id)

  if (updateError) {
    showError(toast, 'Bijwerken mislukt')
  } else {
    showSuccess(toast, 'Wolven toegevoegd')
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
            <InputNumber class="mr-3" name="name" v-model.number="wolfInputAantal" required />
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
              <Column header="Locatie" style="width: 20%">
                <template #body="slotProps">
                  <div class="textSize">
                    {{ slotProps.data.locatie }}
                  </div>
                </template>
              </Column>
              <Column header="Hoeveelheid" style="width: 15%">
                <template #body="slotProps">
                  {{ slotProps.data.aantal }}
                </template>
              </Column>
              <Column header="Laatste update" style="width: 15%">
                <template #body="slotProps">
                  {{ slotProps.data.created_at }}
                </template>
              </Column>
              <Column v-if="!admin" header="Actions" style="width: 20%">
                <template #body="slotProps">
                  <form @submit.prevent="onclickUpdate(slotProps.data.id)">
                    <InputNumber
                      class="mr-5"
                      v-model.number="wolfUpdates[slotProps.data.id]"
                      required
                      v-tooltip.top="'Hoeveel wolven?'"
                    />
                    <Button
                      type="submit"
                      class="!py-1"
                      label="Voeg toe"
                      v-tooltip.top="'Voeg de wolven toe'"
                    />
                    <Button
                      class="!py-1 m-2"
                      label="Delete"
                      @click="onclickDelete(slotProps.data.id)"
                      v-tooltip.top="'Verwijder de wolven '"
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
