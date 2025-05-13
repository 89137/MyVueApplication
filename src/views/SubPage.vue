<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import { useToast } from 'primevue'
import { showError, showSuccess } from '@/utils/toast'

export interface Iprops {
  admin: boolean
}

const toast = useToast()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const wolfTable = ref<any[]>([])
const isLoading = ref(true)

onMounted(() => {
  loadEntries()
})

const loadEntries = async () => {
  const { data, error } = await supabase.from('wolfTable').select('*')

  if (data) {
    wolfTable.value = data.sort((a, b) => a.id - b.id)
    isLoading.value = false
  }
  if (error) {
    showError(toast, 'Failed to load content')
    isLoading.value = true
  }
}

</script>

<template>
  <Card class="overflow-auto">
    <template #content>
      <Skeleton v-if="isLoading" />
      <div v-else>
        <div class="flex items-center flex-col">

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
              <Column header="Name" style="width: 30%">
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
              <Column header="TimeStamp" style="width: 40%">
                <template #body="slotProps">
                  <div class="textSize">
                    {{ slotProps.data.created_at }}
                  </div>
                </template>
              </Column>

            </DataTable>
          </div>
        </Fieldset>
      </div>
    </template>
  </Card>
</template>
