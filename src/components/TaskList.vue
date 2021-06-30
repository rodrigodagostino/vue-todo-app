<template>
	<section class="tasks-section">
		<header class="tasks-header">
			<div class="tasks-header__top">
				<h2
					class="tasks-header__heading"
					ref="heading"
					@keydown.enter="confirmEditListChanges"
					@keydown.escape="cancelEditListChanges"
				>
					{{ selectedList.text }}
				</h2>
				<div v-if="isListBeingEdited" class="tasks-header__actions">
					<BaseButton
						iconClasses="fas fa-check"
						variation="text-neutral"
						@click="confirmEditListChanges"
					/>
					<BaseButton
						iconClasses="fas fa-times"
						variation="text-neutral"
						@click="cancelEditListChanges"
					/>
				</div>
				<div v-if="!isListBeingEdited" class="tasks-header__actions">
					<BaseButton
						iconClasses="fas fa-pen"
						variation="text-neutral"
						@click="editList"
					/>
					<BaseButton
						iconClasses="fas fa-trash"
						variation="text-neutral"
						@click="removeList"
					/>
				</div>
			</div>
			<div class="tasks-header__bottom">
				<transition name="fade">
					<p v-if="selectedList.tasks.length" class="tasks-header__subhead">
						{{ remainingTasks }}
					</p>
				</transition>
			</div>
		</header>
		<div class="tasks-content">
			<ul class="task-list">
				<transition-group name="fade-slide-up" leave-active-class="fade-leave-active">
					<TaskListItem
						v-for="(task, index) in selectedList.tasks"
						:key="task.id"
						:task="task"
						:index="index"
					/>
				</transition-group>
			</ul>
			<form @submit.prevent="addTask" class="task-add">
				<input type="text" class="task-add__input" v-model="newTask" />
				<BaseButton type="submit" iconClasses="fas fa-plus" variation="text-neutral" />
			</form>
		</div>
	</section>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import BaseButton from './BaseButton.vue'
import TaskListItem from './TaskListItem.vue'

export default {
	components: {
		BaseButton,
		TaskListItem,
	},
	setup() {
		const store = useStore()

		const selectedList = computed( () => store.getters.selectedList )
		const heading = ref( null )
		let headingPrevContent = null
		const isListBeingEdited = ref( false )
		const newTask = ref( '' )

		const remainingTasks = computed( () => {
			if ( selectedList.value ) {
				let remaining = 0
				for ( const task of selectedList.value.tasks ) {
					if ( !task.isDone ) remaining++
				}
				return `${ remaining } task${ remaining !== 1 ? 's' : '' } remaining`
			}
			return null
		} )

		const editList = () => {
			headingPrevContent = heading.value.textContent
			isListBeingEdited.value = true
			heading.value.setAttribute( 'contenteditable', true )
			heading.value.focus()
		}

		const confirmEditListChanges = () => {
			isListBeingEdited.value = false
			store.dispatch( 'editList', {
				listId: selectedList.value.id,
				listText: heading.value.textContent,
			} )
			heading.value.removeAttribute( 'contenteditable' )
		}

		const cancelEditListChanges = () => {
			isListBeingEdited.value = false
			heading.value.textContent = headingPrevContent
			heading.value.removeAttribute( 'contenteditable' )
		}

		const removeList = () => store.dispatch( 'removeList', { listId: selectedList.value.id } )

		const addTask = () => {
			if ( newTask.value !== '' ) {
				store.dispatch( 'addTask', {
					listId: selectedList.value.id,
					taskData: {
						id: new Date().getTime(),
						text: newTask.value,
						isDone: false,
					},
				} )
				newTask.value = ''
			}
		}

		return {
			selectedList,
			heading,
			isListBeingEdited,
			newTask,
			remainingTasks,
			editList,
			confirmEditListChanges,
			cancelEditListChanges,
			removeList,
			addTask,
		}
	},
}
</script>

<style scoped lang="scss">
.tasks-section {
	background-color: var(--white);
	max-width: 100%;
	overflow: hidden;

	.tasks-header {
		background-color: var(--gray-100);
		padding: 1.5rem;

		&__top {
			display: flex;
			justify-content: space-between;
			align-items: center;
		}

		&__heading {
			font-size: 2rem;
			line-height: 1;

			&[contenteditable='true'] {
				outline: none;
				box-shadow: 0 2px 0 var(--color-main);
				cursor: text;
			}
		}

		&__subhead {
			font-size: 1rem;
		}

		&__actions {
			white-space: nowrap;
		}
	}

	.tasks-content {
		padding: 1.5rem 1.5rem 2rem;
	}
}

.task-list {
	list-style-type: none;
}

.task-add {
	display: flex;
	margin-top: 1rem;

	.task-add__input {
		flex: 1;
		font-size: 1.25rem;
		background-color: transparent;
		border: none;
		border-bottom: 2px solid var(--gray-400);
		outline: none;
		transition: border 0.32s ease;

		&:focus {
			border-bottom-color: var(--color-main);
		}
	}
}
</style>
