<script setup>
import { ref, computed } from 'vue'
import store from '@/store'
import draggable from 'vuedraggable'
import BaseButton from './BaseButton.vue'
import BaseSVG from './BaseSVG.vue'

const listsData = computed({
  get: () => store.state.listsData,
  set: (reorderedData) => store.mutations.setListsData(reorderedData),
})
const selectedListData = computed(() => store.getters.selectedListData())
const newListTitle = ref('')

const selectList = (listId) => store.mutations.setSelectedList(listId)

const addList = () => {
  if (newListTitle.value !== '') {
    store.mutations.addList({
      id: new Date().getTime(),
      title: newListTitle.value,
      tasks: [],
    })
    newListTitle.value = ''
  }
}
</script>

<template>
  <section class="lists-section">
    <div class="lists-content">
      <draggable
        v-model="listsData"
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
        item-key="id"
      >
        <template #item="{ element }">
          <li
            class="list-item"
            :class="{
              'is-active':
                selectedListData && element.id === selectedListData.id,
            }"
            @click="selectList(element.id)"
          >
            <BaseSVG name="handle" classes="list-item__handle" />
            <span class="list-item__label">
              {{ element.title }}
            </span>
          </li>
        </template>
      </draggable>
      <form class="list-add" @submit.prevent="addList">
        <input
          v-model.trim="newListTitle"
          type="text"
          class="list-add__input"
        />
        <BaseButton
          type="submit"
          icon-class="fas fa-plus"
          variation="text-dark"
          @click="addList"
        />
      </form>
    </div>
  </section>
</template>

<style scoped lang="scss">
.lists-section {
  color: var(--white);
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
}

.list-add__input {
  flex: 1;
  font-size: 1.25rem;
  background-color: transparent;
  border: none;
  border-bottom: 2px solid var(--gray-100);
  outline: none;
  margin-left: 2rem;
  transition: border 0.32s ease;

  &:focus {
    border-bottom-color: white;
  }
}
</style>
