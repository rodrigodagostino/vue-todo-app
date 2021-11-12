<template>
  <section class="lists-section">
    <header class="lists-header">
      <h2 class="lists-header__heading">My lists</h2>
    </header>
    <div class="lists-content">
      <draggable
        class="list-list"
        ghost-class="list-item--ghost"
        handle=".list-item__handle"
        tag="transition-group"
        :component-data="{
          tag: 'ul',
          type: 'transition-group',
          name: 'fade-slide-up',
          leaveActiveClass: 'fade-leave-active',
        }"
        animation="200"
        v-model="listsData"
        item-key="id"
      >
        <template #item="{ element }">
          <li
            class="list-item"
            :class="{
              'is-active': selectedList && element.id === selectedList.id,
            }"
            @click="selectList(element.id)"
          >
            <svg
              class="list-item__handle"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              role="img"
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="M9.75 15a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5zm4.5 0a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5zm-4.5-4.131a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5zm4.5 0a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5zM9.75 6.5a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5zm4.5 0a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5z"
              />
            </svg>
            <span class="list-item__label">
              {{ element.title }}
            </span>
          </li>
        </template>
      </draggable>
      <form @submit.prevent="addList" class="list-add">
        <input type="text" v-model.trim="newList" class="list-add__input" />
        <BaseButton
          type="submit"
          iconClasses="fas fa-plus"
          variation="text-dark"
          @click="addList"
        />
      </form>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import draggable from 'vuedraggable'
import BaseButton from './BaseButton.vue'

const store = useStore()

const listsData = computed({
  get: () => store.getters.listsData,
  set: rearrangedData =>
    store.commit( 'setListsData', { newListsData: rearrangedData }),
})
const selectedList = computed( () => store.getters.selectedList )
const newList = ref( '' )

const selectList = listId => {
  store.dispatch( 'selectList', { listId })
}

const addList = () => {
  if ( newList.value !== '' ) {
    store.dispatch( 'addList', {
      newList: {
        id: new Date().getTime(),
        title: newList.value,
        tasks: [],
      },
    })
    newList.value = ''
  }
}
</script>

<style scoped lang="scss">
.lists-section {
  color: var(--white);
  padding-right: 1rem;

  .lists-header {
    padding: 1.5rem;

    &__heading {
      font-size: 2rem;
    }
  }

  .lists-content {
    padding: 1.5rem 1.5rem 2rem;
  }
}

.list-list {
  list-style-type: none;
  padding: 0;
}

.list-item {
  display: flex;
  font-size: 1.5rem;
  line-height: 1.2;
  padding: 1rem 0;
  transition: background-color 0.32s ease, padding 0.32s ease;
  cursor: pointer;

  &.is-active {
    font-weight: 600;
    color: white;
    background-color: var(--color-main--dark);
    padding: 1rem;
  }

  &.task-item--ghost {
    background-color: var(--gray-100);
  }
}

.list-item__handle {
  display: flex;
  max-width: 1.5rem;
  fill: var(--color-main--lighter);
  cursor: move;
  transition: fill 0.24s ease;

  &:focus,
  &:hover {
    fill: var(--color-main--lightest);
  }
}

.list-item__label {
  margin-left: 0.75rem;
}

.list-add {
  display: flex;
  margin-top: 1rem;
}

.list-add__input {
  flex: 1;
  font-size: 1.25rem;
  background-color: transparent;
  border: none;
  border-bottom: 2px solid var(--gray-100);
  outline: none;
  transition: border 0.32s ease;

  &:focus {
    border-bottom-color: white;
  }
}
</style>
