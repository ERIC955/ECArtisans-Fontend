<template>
	<BPagination
		v-model="localCurrentPage"
		pills
		:total-rows="totalRows"
		:per-page="perPage"
		align="center"
		:size="resize >= 992 ? 'lg' : 'md'"
		:limit="resize >= 992 ? 7 : 5"
		class="page-item-bottom"
	>
		<template #first-text>
			<font-awesome-icon :icon="['fas', 'angles-left']" />
		</template>
		<template #prev-text>
			<font-awesome-icon :icon="['fas', 'angle-left']" />
		</template>
		<template #next-text>
			<font-awesome-icon :icon="['fas', 'angle-right']" />
		</template>
		<template #last-text>
			<font-awesome-icon :icon="['fas', 'angles-right']" />
		</template>
	</BPagination>
	<!-- <div>Current page : {{ localCurrentPage }}</div> -->
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useResize } from '@/stores/index';
const { resize } = useResize();
import { useRoute, useRouter } from 'vue-router';
// 使用方式可以參考'test-page'

const route = useRoute();
const router = useRouter();

// 接受 props
const props = defineProps({
	currentPage: Number,
	perPage: Number,
	totalRows: Number,
});

// 接收從父組件傳遞的頁碼，一開始為1
const localCurrentPage = ref(props.currentPage);

// 用戶在此組件的操作 -> 監聽localCurrentPage的變化
// 通過 emit 事件通知父組件，來啟動父組件重新計算頁碼
const emit = defineEmits(['update:currentPage']);

// 監聽 props 的變化，更新 localCurrentPage -> 使此組件與父組件同步
watch(
	() => props.currentPage,
	newPage => {
		localCurrentPage.value = newPage;
	}
);

// 監聽 localCurrentPage 的變化，通知父组件更新頁碼
watch(localCurrentPage, newPage => {
	emit('update:currentPage', newPage);
});
</script>
