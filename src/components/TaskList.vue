<template>
  <section class="tasks-section">
    <header class="tasks-header">
      <div class="tasks-header__top">
        <h2
          class="tasks-header__title"
          ref="title"
          @keydown.enter="confirmEditListChanges"
          @keydown.escape="cancelEditListChanges"
        >
          {{ selectedListData.title }}
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
            @click="editListTitle"
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
          <p v-if="selectedListData.tasks" class="tasks-header__subhead">
            {{ remainingTasks }}
          </p>
        </transition>
      </div>
    </header>
    <div class="tasks-content">
      <draggable
        class="task-list"
        ghost-class="task-item--ghost"
        handle=".task-item__handle"
        tag="transition-group"
        :component-data="{
          tag: 'ul',
          type: 'transition-group',
          name: 'fade-slide-up',
          leaveActiveClass: 'fade-leave-active',
        }"
        animation="200"
        v-model="selectedListData.tasks"
        item-key="id"
        @end="confirmEditListChanges"
      >
        <template #item="{ element }">
          <TaskListItem :task="element" />
        </template>
      </draggable>
      <form @submit.prevent="addTask" class="task-add">
        <input type="text" class="task-add__input" v-model="newTaskTitle" />
        <BaseButton
          type="submit"
          iconClasses="fas fa-plus"
          variation="text-neutral"
        />
      </form>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import store from '@/store'
import draggable from 'vuedraggable'
import BaseButton from './BaseButton.vue'
import TaskListItem from './TaskListItem.vue'

const selectedListData = computed( () => store.getters.selectedListData() )
const title = ref( null )
let titlePrevContent = null
const isListBeingEdited = ref( false )
const newTaskTitle = ref( '' )

const remainingTasks = computed( () => {
  if ( selectedListData.value ) {
    let remaining = 0
    for ( const task of selectedListData.value.tasks ) {
      if ( !task.isDone ) remaining++
    }
    return `${ remaining } task${ remaining !== 1 ? 's' : '' } remaining`
  }
  return null
})

const editListTitle = () => {
  titlePrevContent = title.value.textContent
  isListBeingEdited.value = true
  title.value.setAttribute( 'contenteditable', true )
  title.value.focus()
}

const confirmEditListChanges = () => {
  isListBeingEdited.value = false
  store.mutations.editList( selectedListData.value.id, title.value.textContent )
  title.value.removeAttribute( 'contenteditable' )
}

const cancelEditListChanges = () => {
  isListBeingEdited.value = false
  title.value.textContent = titlePrevContent
  title.value.removeAttribute( 'contenteditable' )
}

const removeList = () => store.mutations.removeList( selectedListData.value.id )

const addTask = () => {
  if ( newTaskTitle.value !== '' ) {
    store.mutations.addTask( selectedListData.value.id, {
      id: new Date().getTime(),
      title: newTaskTitle.value,
      isDone: false,
    })
    newTaskTitle.value = ''
  }
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

    &__title {
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
    margin-left: 2rem;
    outline: none;
    transition: border 0.32s ease;

    &:focus {
      border-bottom-color: var(--color-main);
    }
  }
}
</style>
