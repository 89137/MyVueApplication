<script setup lang="ts">
import { onMounted, type Ref } from 'vue'
import { ref } from 'vue'
// Import the custom composable
import { useWolf } from '@/utils/wolf'
// import Toast
import { useToast } from 'primevue'
import { showInfo } from '@/utils/toast'
const toast = useToast()

// Import the components
const { wolfTable, isLoading, wolfUpdates, totaalAantalWolven, loadEntries, onclickUpdate } =
  useWolf()

onMounted(() => {
  loadEntries()
})

// Function to store the grid number
const selectedLocation: Ref<number | null> = ref(null)

const scrollToRow = (number: number) => {
  selectedLocation.value = number

  // Scroll to the row in the table
  const row = document.getElementById(`row-${number}`)
  if (row) {
    row.scrollIntoView({ behavior: 'smooth', block: 'center' })
    showInfo(toast, `Nummer ${number} is geselecteerd`)
  }

  // Add highlight to column
  const columnElements = document.querySelectorAll(`[data-row="${number}"]`)
  columnElements.forEach((element) => {
    ;(element as HTMLElement).classList.add('highlight') // Cast to HTMLElement
  })

  // Reset highlight after 3 seconds
  setTimeout(() => {
    columnElements.forEach((element) => {
      ;(element as HTMLElement).classList.remove('highlight') // Cast to HTMLElement
    })
  }, 3000)
}
</script>

<template>
  <Skeleton v-if="isLoading" height="80vh" />
  <Card v-else>
    <template #title>
      Wolf map <br />
      totaal aantal wolven: {{ totaalAantalWolven }}</template
    >
    <template #content>
      <div class="max-h-[90vh] overflow-auto calc-flex">
        <div class="flex flex-row calc-flex">
          <div class="relative w-full max-w-xl border rounded-md mr-3">
            <!-- Afbeelding -->
            <div class="grid grid-cols-3">
              <img
                v-for="number in 9"
                :key="number"
                :src="`/src/assets/kaartimages/kaartimage${number}.png`"
                :alt="`Kaart image ${number}`"
                :id="`kaartimage${number}`"
                class="w-full h-auto cursor-pointer transition-all duration-300 :hover:border"
                @click="scrollToRow(number)"
                :data-row="wolfTable[number - 1].locatie"
              />
            </div>
          </div>
          <!-- Data Table -->
          <div class="border w-full calc-flex rounded-md">
            <DataTable
              :value="wolfTable"
              scrollable
              scrollHeight="calc(100vh - 25em)"
              paginator
              stripedRows
              :rows="9"
            >
              <Column header="Locatie" style="width: 10%">
                <template #body="slotProps">
                  <div
                    class="textSize pl-3 transition-all duration-300"
                    :id="`row-${slotProps.data.locatie}`"
                    :data-row="slotProps.data.locatie"
                  >
                    {{ slotProps.data.locatie }}
                  </div>
                </template>
              </Column>

              <Column header="Aantal" style="width: 15%">
                <template #body="slotProps">
                  <div>{{ slotProps.data.aantal }}</div>
                </template>
              </Column>
              <Column header="Laatste update" style="width: 15%">
                <template #body="slotProps">
                  <div>{{ slotProps.data.created_at }}</div>
                </template>
              </Column>
              <Column header="Actions" style="width: 15%">
                <template #body="slotProps">
                  <form @submit.prevent="onclickUpdate(slotProps.data.id)">
                    <InputNumber
                      class="mr-5 w-16"
                      v-model.number="wolfUpdates[slotProps.data.id]"
                      required
                      size="small"
                      v-tooltip.top="'Hoeveel wolven?'"
                    />
                    <Button
                      type="submit"
                      class="!mt-1"
                      label="Voeg toe"
                      v-tooltip.top="'Voeg de wolven toe'"
                    />
                  </form>
                </template>
              </Column>
            </DataTable>
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>

<style scoped>
img {
  display: block;
}

button {
  border: 1px solid black;
  cursor: pointer;
}

.calc-table {
  width: calc(100vh - 50em) !important;
}

@media only screen and (max-width: 1250px) {
  .calc-flex {
    flex-direction: column;
  }
}

/* Highlight class */
.highlight {
  background-color: #ffeb3b;
  transition: background-color 0.3s ease;
}
</style>
