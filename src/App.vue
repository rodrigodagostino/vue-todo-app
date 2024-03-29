<script setup>
import { computed } from 'vue'
import store from '@/store'
import ListList from './components/ListList.vue'
import TaskList from './components/TaskList.vue'

const selectedListData = computed(() => store.getters.selectedListData())
</script>

<template>
  <header class="site-header">
    <div class="container">
      <h1 class="site-heading">stuff I need to do</h1>
    </div>
  </header>
  <main class="site-main">
    <div class="container">
      <transition
        name="fade-slide-up"
        leave-active-class="fade-leave-active"
        appear
      >
        <ListList />
      </transition>
      <transition
        name="fade-slide-up"
        leave-active-class="fade-leave-active"
        appear
        mode="out-in"
      >
        <TaskList v-if="selectedListData" :key="selectedListData.id" />
      </transition>
    </div>
  </main>
  <footer class="site-footer">
    <div class="container">
      <a
        href="https://github.com/rodrigodagostino/vue-todo-app"
        target="_blank"
      >
        Made with <img src="@/assets/vue-logo.png" alt="Vue.js logo" /> by
        Rodrigo D’Agostino
      </a>
    </div>
  </footer>
</template>

<style lang="scss">
/**
 * Variables
 */
:root {
  --font-main: 'Poppins', Avenir, Helvetica, Arial, sans-serif;

  --color-main--lightest: #c7d2fe;
  --color-main--lighter: #a5b4fc;
  --color-main--light: #818cf8;
  --color-main: #6366f1;
  --color-main--dark: #4f46e5;
  --color-main--darker: #4338ca;
  --color-main--darkest: #3730a3;

  --white: #f3f3f5;
  --gray-050: #ededf0;
  --gray-100: #e1e1e6;
  --gray-150: #d2d2da;
  --gray-200: #c3c3ce;
  --gray-300: #a4a6b5;
  --gray-400: #86889d;
  --gray-500: #686a84;
  --gray-600: #585a70;
  --gray-650: #515266;
  --gray-700: #494a5c;
  --gray-750: #414253;
  --gray-800: #393a49;
  --gray-850: #31323f;
  --gray-900: #2a2a35;
  --gray-950: #22222b;
  --black: #15151a;
}

/**
 * Reset styles.
 */
html {
  box-sizing: border-box;
  height: 100%;
}

*,
*::before,
*::after {
  // Inherit box-sizing to make it easier to change the property
  // for components that leverage other behavior
  // http://css-tricks.com/inheriting-box-sizing-probably-slightly-better-best-practice/
  box-sizing: inherit;
}

/* Reset margins and paddings on most elements */
body,
h1,
h2,
h3,
h4,
h5,
h6,
ul,
ol,
li,
p,
pre,
blockquote,
figure,
hr {
  margin: 0;
  padding: 0;
}

a {
  color: var(--white);
  transition: outline 0.32s ease;
  outline: 1px dotted transparent;
}

a:focus {
  outline: 1px dotted var(--white);
}

/* Reset forms and buttons */
input,
textarea,
select,
button {
  color: inherit;
  font: inherit;
  letter-spacing: inherit;
}

input,
textarea,
button {
  border: 1px solid gray;
  min-width: 0;
}

button {
  border-radius: 0;
  padding: 0.75em 1em;
  background-color: transparent;
}

button * {
  pointer-events: none;
}

/* Easy responsive for media elements */
embed,
iframe,
img,
object,
video {
  display: block;
  max-width: 100%;
}

/* Useful table styles */
table {
  table-layout: fixed;
  width: 100%;
}

/**
 * Base styles.
 */
body {
  font-family: var(--font-main);
  color: var(--gray-800);
  background-color: var(--color-main);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
  display: flex;
  justify-content: center;
}

.site {
  display: flex;
  flex-direction: column;
  max-width: 100%;
  min-height: 100vh;
}

.container {
  display: flex;
  max-width: 52rem;
  margin: 0 auto;
  padding: 1.25rem;
  position: relative;
}

.site-header {
  .container {
    display: block;
  }

  .site-heading {
    font-size: clamp(2rem, 10vw, 5.8125rem);
    font-weight: 900;
    color: var(--color-main--dark);
    text-align: center;
    margin-bottom: -0.5em;
    white-space: nowrap;
    opacity: 0.4;
  }
}

.site-main {
  .container {
    flex-direction: column;
  }
}

.lists-section + .tasks-section {
  margin-top: 3rem;
}

.site-footer {
  font-size: 0.875rem;
  text-align: center;
  margin-top: auto;
}

.site-footer .container {
  display: flex;
  justify-content: center;
  padding: 1rem 0;
}

.site-footer a {
  color: var(--gray-200);
  text-decoration: none;
  transition: color 0.24s ease;
}

.site-footer a:focus,
.site-footer a:hover {
  color: var(--white);
}

.site-footer img {
  height: 1.25rem;
  width: auto;
  vertical-align: middle;
  margin: 0 0.25rem;
  display: inline-block;
}

@media screen and (min-width: 48em) {
  .site-main {
    .container {
      display: grid;
      grid-template-columns: 18rem auto;
      grid-gap: 2rem;
      align-items: flex-start;
    }
  }

  .lists-section + .tasks-section {
    margin-top: 0;
  }
}

.fade-slide-up-enter-active {
  animation: fade-slide-up 0.32s ease;
}

.fade-slide-up-leave-active {
  animation: fade-slide-up 0.32s ease reverse;
}

@keyframes fade-slide-up {
  from {
    opacity: 0;
    transform: translate3d(0, 2rem, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

.fade-slide-right-enter-active {
  animation: fade-slide-right 0.32s ease;
}

.fade-slide-right-leave-active {
  animation: fade-slide-right 0.32s ease reverse;
}

@keyframes fade-slide-right {
  from {
    opacity: 0;
    transform: translate3d(-2rem, 0, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

.fade-enter-active {
  animation: fade 0.32s ease;
}

.fade-leave-active {
  animation: fade 0.32s ease reverse;
}

@keyframes fade {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
