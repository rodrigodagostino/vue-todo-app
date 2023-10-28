<script setup>
import { ref, computed } from 'vue'
import store from '@/store'
import { VueDraggable } from 'vue-draggable-plus'
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
      <VueDraggable
        v-model="listsData"
        class="list-list"
        animation="200"
        chosen-class="list-item--chosen"
        drag-class="list-item--drag"
        ghost-class="list-item--ghost"
        handle=".list-item__handle"
      >
        <li
          v-for="list in listsData"
          :key="list.id"
          class="list-item"
          :class="{
            'is-active': selectedListData && list.id === selectedListData.id,
          }"
          @click="selectList(list.id)"
        >
          <BaseSVG name="handle" classes="list-item__handle" />
          <span class="list-item__label">
            {{ list.title }}
          </span>
        </li>
      </VueDraggable>
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

  &.list-item--drag {
    opacity: 0;
  }

  &.task-item--chosen {
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
