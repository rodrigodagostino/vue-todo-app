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
						v-for="(list, index) in listsData"
						:key="list.id"
						class="list-item"
						:class="{ 'is-active': selectedList && list.id === selectedList.id }"
					>
						<span @click="selectList(index)" class="list-item__label">
							{{ list.text }}
						</span>
						<BaseButton
							iconClasses="fas fa-times"
							variation="text-dark"
							@click="removeList(index)"
						/>
					</li>
				</transition-group>
			</ul>
			<form @submit.prevent="addList" class="list-add">
				<input type="text" v-model.trim="newList" class="list-add__input" />
				<BaseButton type="submit" iconClasses="fas fa-plus" variation="text-dark" />
			</form>
		</div>
	</section>
</template>

<script>
import BaseButton from '../components/BaseButton.vue'
import { ref } from 'vue'

export default {
	components: {
		BaseButton,
	},
	emits: [ 'addList', 'selectList', 'removeList' ],
	props: {
		listsData: {
			type: Object,
			required: true,
		},
		selectedList: Object,
	},
	setup( _, context ) {
		const newList = ref( '' )

		const addList = () => {
			if ( newList.value !== '' ) {
				context.emit( 'addList', {
					id: new Date().getTime(),
					text: newList.value,
					tasks: [],
				} )
				newList.value = ''
			}
		}

		const selectList = index => context.emit( 'selectList', index )

		const removeList = index => context.emit( 'removeList', index )

		return {
			newList,
			addList,
			selectList,
			removeList,
		}
	},
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
	display: flex;
	justify-content: space-between;
	align-items: center;
	transition: background-color 0.32s ease, padding 0.32s ease;

	& > .list-item__label {
		cursor: pointer;
	}

	&.is-active {
		font-weight: 600;
		color: white;
		background-color: var(--color-main--dark);
		padding-left: 1rem;
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
