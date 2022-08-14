import { reactive } from 'vue'

// Clean up the storage if it’s undefined.
if (localStorage.getItem('listsData') === 'undefined') {
  localStorage.removeItem('listsData')
}

const hasListData =
  localStorage.getItem('listsData') &&
  localStorage.getItem('listsData').charAt(0) === '['

const state = reactive({
  listsData: hasListData ? JSON.parse(localStorage.getItem('listsData')) : [],
  selectedListId: hasListData
    ? JSON.parse(localStorage.getItem('listsData'))[0].id
    : null,
})

const getters = {
  selectedListData() {
    if (!state.listsData || state.listsData.length === 0) return
    return state.listsData.filter((list) => list.id === state.selectedListId)[0]
  },
}

const mutations = {
  setListsData(newListsData) {
    state.listsData = newListsData
    localStorage.setItem('listsData', JSON.stringify(newListsData))
  },

  setSelectedList(listId) {
    if (listId === null) {
      state.selectedListId = null
      return
    }
    state.selectedListId = listId
  },

  addList(newList) {
    const newListsData = state.listsData
      ? [...state.listsData, newList]
      : [newList]
    mutations.setListsData(newListsData)
    // Select the recently created list.
    mutations.setSelectedList(state.listsData[state.listsData.length - 1].id)
  },

  editList(listId, newListTitle) {
    const newListsData = state.listsData
    const targetListIndex = newListsData.findIndex((list) => list.id === listId)
    newListsData[targetListIndex].title = newListTitle
    mutations.setListsData(newListsData)
  },

  removeList(listId) {
    const listIndex = state.listsData.findIndex((list) => list.id === listId)
    // Select the previous list (if it exists) before deleting.
    if (state.listsData.length > 1 && listIndex !== 0) {
      mutations.setSelectedList(state.listsData[listIndex - 1].id)
      // Select the next list (if it exists) before deleting.
    } else if (state.listsData.length > 1 && listIndex === 0) {
      mutations.setSelectedList(state.listsData[listIndex + 1].id)
      // Deselect the current list before deleting.
    } else {
      mutations.setSelectedList(null)
    }
    const newListsData = state.listsData.filter((list) => {
      return list.id !== listId
    })
    mutations.setListsData(newListsData)
  },

  addTask(listId, newTaskData) {
    const newListsData = state.listsData
    const targetListIndex = newListsData.findIndex((list) => list.id === listId)
    newListsData[targetListIndex].tasks.push(newTaskData)
    mutations.setListsData(newListsData)
  },

  editTask(listId, taskId, newTaskTitle) {
    const newListsData = state.listsData
    const targetListIndex = newListsData.findIndex((list) => list.id === listId)
    const targetTaskIndex = newListsData[targetListIndex].tasks.findIndex(
      (task) => task.id === taskId
    )
    newListsData[targetListIndex].tasks[targetTaskIndex].title = newTaskTitle
    mutations.setListsData(newListsData)
  },

  toggleTaskStatus(listId, taskId) {
    const newListsData = state.listsData
    const targetListIndex = newListsData.findIndex((list) => list.id === listId)
    const targetTaskIndex = newListsData[targetListIndex].tasks.findIndex(
      (task) => task.id === taskId
    )
    newListsData[targetListIndex].tasks[targetTaskIndex].isDone =
      !newListsData[targetListIndex].tasks[targetTaskIndex].isDone
    mutations.setListsData(newListsData)
  },

  removeTask(listId, taskId) {
    const newListsData = state.listsData
    const targetListIndex = newListsData.findIndex((list) => list.id === listId)
    const targetTaskIndex = newListsData[targetListIndex].tasks.findIndex(
      (task) => task.id === taskId
    )
    newListsData[targetListIndex].tasks.splice(targetTaskIndex, 1)
    mutations.setListsData(newListsData)
  },
}

export default {
  state,
  getters,
  mutations,
}
