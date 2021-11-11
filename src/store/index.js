import { createStore } from 'vuex'

export default createStore({
  state() {
    return {
      listsData: JSON.parse( localStorage.getItem( 'listsData' ) ) || [],
      selectedList: localStorage.getItem( 'listsData' )
        ? JSON.parse( localStorage.getItem( 'listsData' ) )[ 0 ]
        : null,
    }
  },
  getters: {
    listsData( state ) {
      return state.listsData
    },
    selectedList( state ) {
      return state.selectedList
    },
  },
  mutations: {
    setListsData( state, payload ) {
      state.listsData = payload.newListsData
      localStorage.setItem(
        'listsData',
        JSON.stringify( payload.newListsData ),
      )
    },
    setSelectedList( state, payload ) {
      if ( payload === null ) {
        state.selectedList = null
        return
      }
      state.selectedList = payload.selectedListData
    },
  },
  actions: {
    addList({ state, commit, dispatch }, payload ) {
      const newListsData = [
        ...state.listsData,
        payload.newList,
      ]
      commit( 'setListsData', { newListsData })
      // Select the recently created list.
      dispatch( 'selectList', {
        listId: state.listsData[ state.listsData.length - 1 ].id,
      })
    },
    selectList({ state, commit }, payload ) {
      if ( payload === null ) {
        commit( 'setSelectedList', null )
        return
      }
      const selectedListData = state.listsData.find( list =>
        list.id === payload.listId,
      )
      commit( 'setSelectedList', { selectedListData })
    },
    editList({ state, commit }, payload ) {
      const newListsData = state.listsData
      const targetListIndex = newListsData.findIndex( list =>
        list.id === payload.listId,
      )
      newListsData[ targetListIndex ].title = payload.listTitle
      commit( 'setListsData', { newListsData })
    },
    removeList({ state, commit, dispatch }, payload ) {
      // Select the previous list (if it exists) before deleting.
      const targetListIndex = state.listsData.findIndex( list =>
        list.id === payload.listId,
      )
      if ( state.listsData.length > 1 && targetListIndex !== 0 ) {
        dispatch( 'selectList', {
          listId: state.listsData[ targetListIndex - 1 ].id,
        })
        // Select the next list (if it exists) before deleting.
      } else if ( state.listsData.length > 1 && targetListIndex === 0 ) {
        dispatch( 'selectList', {
          listId: state.listsData[ targetListIndex + 1 ].id,
        })
        // Deselect the current list before deleting.
      } else {
        dispatch( 'selectList', null )
      }
      const newListsData = state.listsData.filter( list => {
        return list.id !== payload.listId
      })
      commit( 'setListsData', { newListsData })
    },

    addTask({ state, commit }, payload ) {
      const newListsData = state.listsData
      const targetListIndex = newListsData.findIndex( list =>
        list.id === payload.listId,
      )
      newListsData[ targetListIndex ].tasks.push( payload.taskData )
      commit( 'setListsData', { newListsData })
    },
    editTask({ state, commit }, payload ) {
      const newListsData = state.listsData
      const targetListIndex =
        newListsData.findIndex( list => list.id === payload.listId )
      const targetTaskIndex =
        newListsData[ targetListIndex ].tasks.findIndex( task =>
          task.id === payload.taskId,
        )
      newListsData[ targetListIndex ].tasks[ targetTaskIndex ].title =
        payload.taskTitle
      commit( 'setListsData', { newListsData })
    },
    toggleTaskStatus({ state, commit }, payload ) {
      const newListsData = state.listsData
      const targetListIndex = newListsData.findIndex( list =>
        list.id === payload.listId,
      )
      const targetTaskIndex =
        newListsData[ targetListIndex ].tasks.findIndex( task =>
          task.id === payload.taskId,
        )
      newListsData[ targetListIndex ].tasks[ targetTaskIndex ].isDone =
        !newListsData[ targetListIndex ].tasks[ targetTaskIndex ].isDone
      commit( 'setListsData', { newListsData })
    },
    removeTask({ state, commit }, payload ) {
      const newListsData = state.listsData
      const targetListIndex = newListsData.findIndex( list =>
        list.id === payload.listId,
      )
      const targetTaskIndex =
        newListsData[ targetListIndex ].tasks.findIndex( task =>
          task.id === payload.taskId,
        )
      newListsData[ targetListIndex ].tasks.splice( targetTaskIndex, 1 )
      commit( 'setListsData', { newListsData })
    },
  },
})
