<script setup>
import { ref, computed } from 'vue'
import store from '@/store'
import BaseButton from '@/components/BaseButton.vue'
import BaseSVG from './BaseSVG.vue'

const props = defineProps({
  task: {
    type: Object,
    default: () => {},
  },
  index: {
    type: Number,
    default: 0,
  },
})

const selectedList = computed(() => store.getters.selectedListData())
const label = ref(null)
let labelPrevContent = null
const checkbox = ref(null)
const isTaskBeingEdited = ref(false)

const editTask = () => {
  labelPrevContent = label.value.textContent
  isTaskBeingEdited.value = true
  checkbox.value.setAttribute('disabled', true)
  label.value.setAttribute('contenteditable', true)
  label.value.focus()
}

const confirmEditTaskChanges = () => {
  isTaskBeingEdited.value = false
  store.mutations.editTask(
    selectedList.value.id,
    props.task.id,
    label.value.textContent
  )
  checkbox.value.removeAttribute('disabled')
  label.value.removeAttribute('contenteditable')
}

const cancelEditTaskChanges = () => {
  isTaskBeingEdited.value = false
  label.value.textContent = labelPrevContent
  checkbox.value.removeAttribute('disabled')
  label.value.removeAttribute('contenteditable')
}

const toggleTaskStatus = () =>
  store.mutations.toggleTaskStatus(selectedList.value.id, props.task.id)

const removeTask = () =>
  store.mutations.removeTask(selectedList.value.id, props.task.id)
</script>

<template>
  <li class="task-item" :class="{ 'task-item--done': task.isDone }">
    <BaseSVG name="handle" classes="task-item__handle" />
    <input
      :id="task.id"
      ref="checkbox"
      type="checkbox"
      :checked="task.isDone"
      class="task-item__checkbox"
      @click="toggleTaskStatus"
    />
    <label
      ref="label"
      :for="task.id"
      class="task-item__label"
      @keydown.enter="confirmEditTaskChanges"
      @keydown.escape="cancelEditTaskChanges"
    >
      {{ task.title }}
    </label>
    <div v-if="isTaskBeingEdited" class="task-item__actions">
      <BaseButton
        icon-class="fas fa-check"
        variation="text-neutral"
        @click="confirmEditTaskChanges"
      />
      <BaseButton
        icon-class="fas fa-times"
        variation="text-neutral"
        @click="cancelEditTaskChanges"
      />
    </div>
    <div v-if="!isTaskBeingEdited" class="task-item__actions">
      <BaseButton
        icon-class="fas fa-pen"
        variation="text-neutral"
        @click="editTask"
      />
      <BaseButton
        icon-class="fas fa-trash"
        variation="text-neutral"
        @click="removeTask"
      />
    </div>
  </li>
</template>

<style scoped lang="scss">
.task-item {
  display: flex;
  align-items: center;
  padding: 0.25rem 0;
  border-bottom: 1px solid var(--gray-200);

  &.task-item--ghost {
    background-color: var(--gray-100);
  }
}

.task-item__handle {
  display: flex;
  max-width: 1.5rem;
  fill: var(--gray-400);
  cursor: move;
  transition: fill 0.24s ease;

  &:focus,
  &:hover {
    fill: var(--color-main);
  }
}

.task-item__checkbox,
.task-item__label {
  cursor: pointer;
  transition: opacity 0.32s ease;
}

.task-item__checkbox {
  flex-shrink: 0;
  margin-left: 0.5rem;
}

.task-item__label {
  font-size: 1.25rem;
  line-height: 1.2;
  margin-left: 0.75rem;

  &[contenteditable='true'] {
    outline: none;
    box-shadow: 0 2px 0 var(--color-main);
    cursor: text;
  }
}

.task-item__actions {
  margin-left: auto;
  white-space: nowrap;
}

.task-item--done {
  .task-item__label {
    text-decoration: line-through;
    opacity: 0.5;
  }
}
</style>
