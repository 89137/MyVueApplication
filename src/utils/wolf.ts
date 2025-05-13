

import { ref } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import { useToast } from 'primevue'
import { showError, showSuccess } from '@/utils/toast'

export function useWolf() {
  const toast = useToast()
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  const wolfTable = ref<any[]>([])
  const isLoading = ref(true)
  const wolfInputAantal = ref<number>()
  const wolfUpdates = ref<Record<number, number>>({})

  // Load the initial entries
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

  // Function to add a new entry
  const onclickAdd = async () => {
    const { error } = await supabase.from('wolfTable').insert([{ aantal: wolfInputAantal.value }])
    wolfInputAantal.value = 0
    if (error) {
      showError(toast, 'Failed to add content')
    } else {
      showSuccess(toast, 'Content toegevoegd')
    }
  }

  // Function to delete an entry temporarily commented out

  // const onclickDelete = async (id: number) => {
  //   const { error } = await supabase.from('wolfTable').delete().eq('id', id)
  //   if (error) {
  //     showError(toast, 'Failed to delete content')
  //   } else {
  //     showSuccess(toast, 'Content verwijderd')
  //   }
  // }

  // Function to update an entry
  const onclickUpdate = async (id: number) => {
    const inputValue = Number(wolfUpdates.value[id])
    if (isNaN(inputValue)) {
      showError(toast, 'ongeldige invoer')
      return
    }

    const { data, error: fetchError } = await supabase
      .from('wolfTable')
      .select('aantal')
      .eq('id', id)
      .single()

    if (fetchError || !data) {
      showError(toast, 'Could not fetch current quantity')
      return
    }

    wolfUpdates.value[id] = 0
  }

  // Function to subscribe to changes in the table meaning
  // it will update the UI when there are changes in the database

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

  // Return the reactive variables and functions
  return {
    wolfTable,
    isLoading,
    wolfInputAantal,
    wolfUpdates,
    loadEntries,
    onclickAdd,
    // onclickDelete,
    onclickUpdate
  }
}
