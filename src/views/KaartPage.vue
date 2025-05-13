<script setup lang="ts">
import { onMounted } from 'vue'
// Import the custom composable
import { useWolf } from '@/utils/wolf'

const {
  wolfTable,
  // isLoading,
  wolfInputAantal,
  wolfUpdates,
  loadEntries,
  onclickAdd,
  onclickDelete,
  onclickUpdate,
} = useWolf()

onMounted(() => {
  loadEntries()
})

function handleClick(index: number) {
  alert(index + 1)
}
</script>

<template>
  <Card>
    <template #title> Wolf map</template>
    <template #content>
      <div class="max-h-[68vh] overflow-auto">
        <div class="flex flex-row">
          <div class="relative w-full max-w-xl border mr-3">
            <!-- Afbeelding -->
            <img src="/src/assets/KaartNL.jpeg" class="w-full h-auto" alt="Grid map" />

            <!-- Overlay grid -->
            <div class="absolute top-0 left-0 w-full grid grid-cols-3 grid-rows-3 gap-2 p-4 calc">
              <Button
                v-for="(item, index) in 9"
                :key="index"
                :label="(index + 1).toString()"
                class="w-full h-full"
                @click="handleClick(index)"
                unstyled
              />
            </div>
          </div>
          <div class="border w-full">
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
  <Card class="mt-2">
    <template #content>
      <div class="flex items-center justify-center">
        <p class="text-1xl pr-2">Add a wolf:</p>
        <form @submit.prevent="onclickAdd" class="formScreen">
          <InputNumber class="mr-3" name="name" v-model.number="wolfInputAantal" required />
          <Button type="submit" label="Add" v-tooltip="'Add a wolf'" />
        </form>
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
  height: calc(100vw - 30em);
  max-height: 45em;
}
</style>
