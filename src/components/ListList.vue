<template>
	<section class="lists-section">
		<header class="lists-header">
			<h2 class="lists-header__heading">My lists</h2>
		</header>
		<div class="lists-content">
			<ul class="list-list">
				<transition-group
					name="fade-slide-right"
					leave-active-class="fade-leave-active"
					tag="li"
				>
					<li
						v-for="list in listsData"
						:key="list.id"
						class="list-item"
						:class="{ 'is-active': selectedList && list.id === selectedList.id }"
						@click="selectList(list.id)"
					>
						<span class="list-item__label">
							{{ list.text }}
						</span>
					</li>
				</transition-group>
			</ul>
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

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import BaseButton from './BaseButton.vue'

export default {
	components: {
		BaseButton,
	},
	setup() {
		const store = useStore()

		const listsData = computed( () => store.getters.listsData )
		const selectedList = computed( () => store.getters.selectedList )
		const newList = ref( '' )

		const addList = () => {
			if ( newList.value !== '' ) {
				store.dispatch( 'addList', {
					newList: {
						id: new Date().getTime(),
						text: newList.value,
						tasks: [],
					},
				} )
				newList.value = ''
			}
		}

		const selectList = listId => {
			store.dispatch( 'selectList', { listId } )
		}

		return {
			listsData,
			selectedList,
			newList,
			addList,
			selectList,
		}
	},
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
	font-size: 1.5rem;
	line-height: 1.2;
	padding: 1rem 0;
	transition: background-color 0.32s ease, padding 0.32s ease;
	cursor: pointer;

	& > .list-item__label {
	}

	&.is-active {
		font-weight: 600;
		color: white;
		background-color: var(--color-main--dark);
		padding: 1rem;
	}
}

.list-add {
	display: flex;
	margin-top: 1rem;

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
}
</style>
