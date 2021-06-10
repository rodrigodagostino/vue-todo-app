<template>
	<header class="site-header">
		<div class="container">
			<h1>stuff I need to do</h1>
		</div>
	</header>
	<main class="site-main">
		<div class="container">
			<transition name="fade-slide-up" leave-active-class="fade-leave-active" appear>
				<ListList
					:listsData="listsData"
					:selectedList="selectedList"
					@addList="addList"
					@selectList="selectList"
					@removeList="removeList"
				/>
			</transition>
			<transition name="fade-slide-up" leave-active-class="fade-leave-active" appear>
				<TaskList
					v-if="selectedList"
					:selectedList="selectedList"
					@addTask="addTask"
					@toggleTaskIsDone="toggleTaskIsDone"
					@removeTask="removeTask"
				/>
			</transition>
		</div>
	</main>
</template>

<script>
import ListList from './components/ListList.vue'
import TaskList from './components/TaskList.vue'
import { ref, reactive } from 'vue'

export default {
	name: 'App',
	components: {
		ListList,
		TaskList,
	},
	setup() {
		const listsData = reactive( [] )
		const selectedList = ref( null )

		const addList = newList => {
			listsData.push( newList )
			// Select last pushed list as the active one.
			selectedList.value = listsData[ listsData.length - 1 ]
		}

		const selectList = index => selectedList.value = listsData[ index ]

		const removeList = index => {
			// If there is a list selected and its ID matches the one of the list being deleted…
			if ( selectedList.value && selectedList.value.id === listsData[ index ].id ) {
				// If there’s a list before the one currently being deleted…
				if ( listsData[ index - 1 ] ) {
					selectedList.value = listsData[ index - 1 ]
					// Else if there’s a list after the one currently being deleted…
				} else if ( listsData[ index + 1 ] ) {
					selectedList.value = listsData[ index + 1 ]
					// Else if there’s no other list around…
				} else {
					selectedList.value = null
				}
			}
			listsData.splice( index, 1 )
		}

		const addTask = taskData => {
			for ( const list of listsData ) {
				if ( list.id === selectedList.value.id ) {
					list.tasks.push( taskData )
				}
			}
		}

		const toggleTaskIsDone = index => {
			for ( const list of listsData ) {
				if ( list.id === selectedList.value.id ) {
					list.tasks[ index ].isDone = !list.tasks[ index ].isDone
				}
			}
		}

		const removeTask = index => {
			for ( const list of listsData ) {
				if ( list.id === selectedList.value.id ) {
					list.tasks.splice( index, 1 )
				}
			}
		}

		return {
			listsData,
			selectedList,
			addList,
			selectList,
			removeList,
			addTask,
			toggleTaskIsDone,
			removeTask,
		}
	},
}
</script>

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
	/* Inherit box-sizing to make it easier to change the property for components that leverage other behavior; see http://css-tricks.com/inheriting-box-sizing-probably-slightly-better-best-practice/ */
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

#app {
	width: 100%;
	height: 100%;
}

.container {
	display: flex;
	max-width: 52rem;
	margin: 0 auto;
	padding: 1rem;
	position: relative;
}

.site-header {
	.container {
		display: block;
	}

	h1 {
		font-size: 6rem;
		color: var(--color-main--dark);
		font-weight: 900;
		text-align: center;
		white-space: nowrap;
		display: inline-block;
		margin-top: -2rem;
	}
}

.site-main {
	.container {
		display: grid;
		grid-template-columns: 20rem auto;
		align-items: flex-start;
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
