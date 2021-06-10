<template>
	<section class="tasks-section">
		<header class="tasks-header">
			<h2 class="tasks-header__heading">{{ selectedList.text }}</h2>
			<p class="tasks-header__subhead">{{ remainingTasks }}</p>
		</header>
		<div class="tasks-content">
			<ul class="task-list">
				<transition-group name="fade-slide-up" leave-active-class="fade-leave-active">
					<li
						v-for="(task, index) in selectedList.tasks"
						:key="task.id"
						class="task-item"
						:class="{ 'task-item--done': task.isDone }"
					>
						<input
							type="checkbox"
							:id="task.id"
							:checked="task.isDone"
							@click="toggleTaskIsDone(index)"
							class="task-item__checkbox"
						/>
						<label :for="task.id" class="task-item__label">
							{{ task.text }}
						</label>
						<div class="task-item__actions">
							<BaseButton
								iconClasses="fas fa-times"
								variation="text-neutral"
								@click="removeTask(index)"
							/>
						</div>
					</li>
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
import BaseButton from '../components/BaseButton.vue'
import { ref, computed } from 'vue'

export default {
	components: {
		BaseButton,
	},
	emits: [ 'addTask', 'toggleTaskIsDone', 'removeTask' ],
	props: {
		selectedList: Object,
	},
	setup( props, context ) {
		const newTask = ref( '' )
		const remainingTasks = computed( () => {
			if ( props.selectedList ) {
				let remaining = 0
				for ( const task of props.selectedList.tasks ) {
					if ( !task.isDone ) remaining++
				}
				return `${ remaining } task${ remaining !== 1 ? 's' : '' } remaining`
			}
			return null
		} )

		const addTask = () => {
			if ( newTask.value.trim !== '' ) {
				context.emit( 'addTask', {
					id: new Date().getTime(),
					text: newTask.value,
					isDone: false,
				} )
				newTask.value = ''
			}
		}

		const toggleTaskIsDone = index => context.emit( 'toggleTaskIsDone', index )

		const removeTask = index => context.emit( 'removeTask', index )

		return {
			newTask,
			remainingTasks,
			addTask,
			toggleTaskIsDone,
			removeTask,
		}
	},
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.tasks-section {
	background-color: var(--white);
	max-width: 100%;
	overflow: hidden;

	.tasks-header {
		background-color: var(--gray-100);
		padding: 1.5rem;
		display: flex;
		justify-content: space-between;
		align-items: center;

		&__heading {
			font-size: 2rem;
		}

		&__subhead {
			font-size: 1rem;
		}
	}

	.tasks-content {
		padding: 1.5rem 1.5rem 2rem;
	}
}

.task-list {
	list-style-type: none;
}

.task-item {
	font-size: 1.25rem;
	display: flex;
	align-items: center;
	padding: 0.25rem 0;
	border-bottom: 1px solid var(--gray-200);

	& > .task-item__checkbox,
	& > .task-item__label {
		cursor: pointer;
		transition: opacity 0.32s ease;
	}

	& > * + * {
		margin-left: 0.75rem;
	}

	.task-item__actions {
		margin-left: auto;
	}
}

.task-item--done {
	.task-item__label {
		text-decoration: line-through;
		opacity: 0.5;
	}
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
