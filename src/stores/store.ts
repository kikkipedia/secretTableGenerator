import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useTableStore = defineStore('table', () => {
  const table = ref('')
  const image = ref('')

  const setTable = (newTable: string) => {
    table.value = newTable
  }

  return { table, image, setTable }
})
