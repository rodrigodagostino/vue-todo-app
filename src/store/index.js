import { createStore } from 'vuex'

export default createStore( {
	state() {
		return {
			listsData: JSON.parse( localStorage.getItem( 'listsData' ) ) || [],
			selectedList: JSON.parse( localStorage.getItem( 'listsData' ) )[ 0 ] || null,
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
			localStorage.setItem( 'listsData', JSON.stringify( payload.newListsData ) )
		},
		setSelectedList( state, payload ) {
			state.selectedList = payload.selectedListData
		},
	},
	actions: {
		addList( { state, commit }, payload ) {
			const newListsData = [
				...state.listsData,
				payload.newList,
			]
			commit( 'setListsData', { newListsData } )
		},
		selectList( { state, commit }, payload ) {
			const selectedListData = state.listsData.find( list => list.id === payload.listId )
			commit( 'setSelectedList', { selectedListData } )
		},
		editList( { state, commit }, payload ) {
			const newListsData = state.listsData
			const targetListIndex = newListsData.findIndex( list => list.id === payload.listId )
			newListsData[ targetListIndex ].text = payload.listText
			commit( 'setListsData', { newListsData } )
		},
		removeList( { state, commit }, payload ) {
			const newListsData = state.listsData.filter( list => {
				return list.id !== payload.listId
			} )
			commit( 'setListsData', { newListsData } )
		},

		addTask( { state, commit }, payload ) {
			const newListsData = state.listsData
			const targetListIndex = newListsData.findIndex( list => list.id === payload.listId )
			newListsData[ targetListIndex ].tasks.push( payload.taskData )
			commit( 'setListsData', { newListsData } )
		},
		editTask( { state, commit }, payload ) {
			const newListsData = state.listsData
			const targetListIndex = newListsData.findIndex( list => list.id === payload.listId )
			const targetTaskIndex = newListsData[ targetListIndex ].tasks.findIndex( task => task.id === payload.taskId )
			newListsData[ targetListIndex ].tasks[ targetTaskIndex ].text = payload.taskText
			commit( 'setListsData', { newListsData } )
		},
		toggleTaskStatus( { state, commit }, payload ) {
			const newListsData = state.listsData
			const targetListIndex = newListsData.findIndex( list => list.id === payload.listId )
			const targetTaskIndex = newListsData[ targetListIndex ].tasks.findIndex( task => task.id === payload.taskId )
			newListsData[ targetListIndex ].tasks[ targetTaskIndex ].isDone = !newListsData[ targetListIndex ].tasks[ targetTaskIndex ].isDone
			commit( 'setListsData', { newListsData } )
		},
		removeTask( { state, commit }, payload ) {
			const newListsData = state.listsData
			const targetListIndex = newListsData.findIndex( list => list.id === payload.listId )
			const targetTaskIndex = newListsData[ targetListIndex ].tasks.findIndex( task => task.id === payload.taskId )
			newListsData[ targetListIndex ].tasks.splice( targetTaskIndex, 1 )
			commit( 'setListsData', { newListsData } )
		},
	},
} )
