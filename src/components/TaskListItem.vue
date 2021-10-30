<template>
	<li class="task-item" :class="{ 'task-item--done': task.isDone }">
		<input
			type="checkbox"
			:id="task.id"
			:checked="task.isDone"
			@click="toggleTaskStatus"
			class="task-item__checkbox"
			ref="checkbox"
		/>
		<label
			:for="task.id"
			class="task-item__label"
			ref="label"
			@keydown.enter="confirmEditTaskChanges"
			@keydown.escape="cancelEditTaskChanges"
		>
			{{ task.text }}
		</label>
		<div v-if="isTaskBeingEdited" class="task-item__actions">
			<BaseButton
				iconClasses="fas fa-check"
				variation="text-neutral"
				@click="confirmEditTaskChanges"
			/>
			<BaseButton
				iconClasses="fas fa-times"
				variation="text-neutral"
				@click="cancelEditTaskChanges"
			/>
		</div>
		<div v-if="!isTaskBeingEdited" class="task-item__actions">
			<BaseButton iconClasses="fas fa-pen" variation="text-neutral" @click="editTask" />
			<BaseButton iconClasses="fas fa-trash" variation="text-neutral" @click="removeTask" />
		</div>
	</li>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import BaseButton from '@/components/BaseButton.vue'

export default {
	components: {
		BaseButton,
	},
	props: {
		task: Object,
		index: Number,
	},
	setup( props ) {
		const store = useStore()

		const selectedList = computed( () => store.getters.selectedList )
		const label = ref( null )
		let labelPrevContent = null
		const checkbox = ref( null )
		const isTaskBeingEdited = ref( false )

		const editTask = () => {
			labelPrevContent = label.value.textContent
			isTaskBeingEdited.value = true
			checkbox.value.setAttribute( 'disabled', true )
			label.value.setAttribute( 'contenteditable', true )
			label.value.focus()
		}

		const confirmEditTaskChanges = () => {
			isTaskBeingEdited.value = false
			store.dispatch( 'editTask', {
				listId: selectedList.value.id,
				taskId: props.task.id,
				taskText: label.value.textContent,
			} )
			checkbox.value.removeAttribute( 'disabled' )
			label.value.removeAttribute( 'contenteditable' )
		}

		const cancelEditTaskChanges = () => {
			isTaskBeingEdited.value = false
			label.value.textContent = labelPrevContent
			checkbox.value.removeAttribute( 'disabled' )
			label.value.removeAttribute( 'contenteditable' )
		}

		const toggleTaskStatus = () => {
			store.dispatch( 'toggleTaskStatus', {
				listId: selectedList.value.id,
				taskId: props.task.id,
			} )
		}

		const removeTask = () => {
			store.dispatch( 'removeTask', {
				listId: selectedList.value.id,
				taskId: props.task.id,
			} )
		}

		return {
			label,
			checkbox,
			isTaskBeingEdited,
			editTask,
			confirmEditTaskChanges,
			cancelEditTaskChanges,
			removeTask,
			toggleTaskStatus,
		}
	},
}
</script>

<style scoped lang="scss">
.task-item {
	display: flex;
	align-items: center;
	padding: 0.25rem 0;
	border-bottom: 1px solid var(--gray-200);

	.task-item__checkbox,
	.task-item__label {
		cursor: pointer;
		transition: opacity 0.32s ease;
	}

	.task-item__checkbox {
		flex-shrink: 0;
	}

	.task-item__label {
		font-size: 1.25rem;
		line-height: 1.2;

		&[contenteditable='true'] {
			outline: none;
			box-shadow: 0 2px 0 var(--color-main);
			cursor: text;
		}
	}

	& > * + * {
		margin-left: 0.75rem;
	}

	.task-item__actions {
		margin-left: auto;
		white-space: nowrap;
	}
}

.task-item--done {
	.task-item__label {
		text-decoration: line-through;
		opacity: 0.5;
	}
}
</style>
