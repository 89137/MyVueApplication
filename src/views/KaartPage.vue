<script setup lang="ts">
import { onMounted } from 'vue'
// Import the custom composable
import { useWolf } from '@/utils/wolf'

// Import the components
const { wolfTable, isLoading, wolfUpdates, totaalAantalWolven, loadEntries, onclickUpdate } =
  useWolf()

onMounted(() => {
  loadEntries()
})
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
            <img src="/src/assets/kaartnummer.png" class="w-full h-auto" alt="Grid map" />
          </div>
          <!-- Data Table -->
          <div class="border w-full calc-flex">
            <DataTable
              :value="wolfTable"
              scrollable
              scrollHeight="calc(100vh - 25em)"
              paginator
              stripedRows
              :rows="3"
              :rowsPerPageOptions="[3, 5, 9]"
            >
              <Column header="Locatie" style="width: 20%">
                <template #body="slotProps">
                  <div class="textSize pl-3">
                    {{ slotProps.data.locatie }}
                  </div>
                </template>
              </Column>

              <Column header="Aantal" style="width: 15%">
                <template #body="slotProps">
                  {{ slotProps.data.aantal }}
                </template>
              </Column>
              <Column header="Actions" style="width: 20%">
                <template #body="slotProps">
                  <form @submit.prevent="onclickUpdate(slotProps.data.id)">
                    <InputNumber
                      class="mr-5"
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

.calc {
  height: calc(100vh - 20em);
  max-height: 45em;
}
.calc-table {
  width: calc(100vh - 50em) !important;
}

@media only screen and (max-width: 1250px) {
  .calc-flex {
    flex-direction: column;
  }
}
</style>
