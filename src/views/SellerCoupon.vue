<template>
	<div class="row g-3 mx-0 mb-0 pb-0">
		<div class="col-12 m-0 p-0">
			<NavTabs :data="navTabs" />
			<div class="my-0">
				<NoData
					text="嗷嗷待哺的買家缺優惠劵!"
					v-if="paginatedData.length === 0"
				/>
				<div class="row m-0 p-0" v-else>
					<div
						v-for="couponItem in paginatedData"
						:key="couponItem._id"
						class="col-12 col-md-6 p-3 m-0"
					>
						<Card :data="formatCardData(couponItem)" />
					</div>
					<div class="col-12">
						<!-- 使用 Pagenation 子組件來顯示分頁 -->
						<!-- 當 Pagenation 組件中的頁碼更新時，子組件傳遞"update:currentPage"事件並觸發 updatePage 方法 -->
						<Pagenation
							:currentPage="currentPage"
							:perPage="perPage"
							:totalRows="totalRows"
							@update:currentPage="updatePage"
						/>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
// 組件
import NavTabs from '@/components/NavTabs.vue';
import Card from '@/components/CouponCard.vue';
import Pagenation from '@/components/Pagenation.vue';
import NoData from '@/components/NoData.vue';

import { useCoupon, useAuthStore, dayAndToDay } from '@/stores/index';
import { type CouponType } from '@/type/couponType';
import { type ActivityCardType } from '@/type/ActivityCardType';

const route = useRoute();
const router = useRouter();

const authStore = useAuthStore();
const userStore = useCoupon();
const navTabs = ref({}) as any;
// 封裝分類邏輯的函數，想要入口統一，之後比較好撰寫內容
function categorized(allData: CouponType[]) {
	let data = allData;
	let filterText = navTabs.value.schedule; //固定篩選條件

	//如果要更多篩選條件 可寫在這裡
	if (filterText === '2') {
		data = data.filter(item => {
			const { endDate, isEnabled } = item; // 從 item 中取出 endDate 和 isEnabled
			if (isEnabled && endDate) {
				// 將 endDate 轉換為 Date 對象
				const endDateObj = new Date(endDate);
				const today = new Date(); // 獲取當前日期
				return endDateObj >= today; // 比較 endDate 是否早於當前日期
			}
			return false;
		});
	}
	if (filterText === '3') {
		data = data.filter(item => {
			const { endDate, isEnabled } = item; // 從 item 中取出 endDate 和 isEnabled
			if (isEnabled && endDate) {
				// 將 endDate 轉換為 Date 對象
				const endDateObj = new Date(endDate);
				const today = new Date(); // 獲取當前日期
				return endDateObj < today; // 比較 endDate 是否早於當前日期
			}
			return false;
		});
	}
	if (filterText === '4') data = data.filter(itme => itme.isEnabled === false);

	if (data.length > 1) {
		data.sort((a, b) => {
			// 先按 isEnabled 排序，true 在前
			if (a.isEnabled && !b.isEnabled) return -1;
			if (!a.isEnabled && b.isEnabled) return 1;

			// 然后按 isEnabled && $dayAndToDay(endDate, '<=') 排序，true 在前
			const aEndDateValid = a.isEnabled && dayAndToDay(a.endDate, '<=');
			const bEndDateValid = b.isEnabled && dayAndToDay(b.endDate, '<=');

			if (aEndDateValid && !bEndDateValid) return -1;
			if (!aEndDateValid && bEndDateValid) return 1;

			// 最后按 isEnabled && $dayAndToDay(startDate, '>=') 排序，true 在前
			const aStartDateValid = a.isEnabled && dayAndToDay(a.startDate, '>=');
			const bStartDateValid = b.isEnabled && dayAndToDay(b.startDate, '>=');

			if (aStartDateValid && !bStartDateValid) return -1;
			if (!aStartDateValid && bStartDateValid) return 1;

			// 如果都相同，保持原顺序
			return 0;
		});
	}

	return data;
}

// 接收篩選後的結果
const filteredData = computed(() => categorized(userStore.allData));

// 如果是 user 的 navTabs 資料
const UserTitleData = {
	routeName: 'UserCoupon',
	title: [
		{
			title: '全部',
			path: { name: 'UserCoupon', query: { page: 1, type: '1' } },
		},
		{
			title: '未結束',
			path: { name: 'UserCoupon', query: { page: 1, type: '2' } },
		},
		{
			title: '結束',
			path: { name: 'UserCoupon', query: { page: 1, type: '3' } },
		},
		{
			title: '停止',
			path: { name: 'UserCoupon', query: { page: 1, type: '4' } },
		},
	],
	schedule: computed(() => {
		return (route.query.type as string) || '1';
	}),
};
// 如果是 seller 的 navTabs 資料
const sellerTitleData = {
	routeName: 'SellerCoupon',
	title: [
		{
			title: '全部',
			path: { name: 'SellerCoupon', query: { page: 1, type: '1' } },
		},
		{
			title: '未結束',
			path: { name: 'SellerCoupon', query: { page: 1, type: '2' } },
		},
		{
			title: '結束',
			path: { name: 'SellerCoupon', query: { page: 1, type: '3' } },
		},
		{
			title: '停止',
			path: { name: 'SellerCoupon', query: { page: 1, type: '4' } },
		},
	],
	schedule: computed(() => {
		return (route.query.type as string) || '1';
	}),
};

// Card 資料
const formatCardData = (item: CouponType) =>
	({
		title: item.couponName,
		state: item.isEnabled as boolean, // 狀態：啟用中
		type: item.type as number, //優惠劵 型態 Ex:免運劵、優惠劵
		percentage: item.percentage as number, //優惠劵 型態 Ex:免運劵、優惠劵
		id: item._id as string,
		date: {
			sDate: item.startDate as string,
			eDate: item.endDate as string,
		},
		btn: [
			{
				title: '查看',
				go: { name: 'SellerCouponCheck', params: { id: item._id } },
			},
			{
				title: '修改',
				go: { name: 'SellerCouponCheck', params: { id: item._id } },
			},
		],
		seller: item.seller,
	}) as ActivityCardType;

const currentPage = computed(() => parseInt(route.query.page as string) || 1);
const perPage = ref(6); // 一頁要顯示多少的項目數量
const totalRows = computed(() => filteredData.value.length); // 總項目數量
const maxPage = computed(() =>
	Math.ceil(filteredData.value.length / perPage.value)
);
// 當currentPage或perPage改變時重新計算當前頁的資料
const paginatedData = computed(() => {
	const start = (currentPage.value - 1) * perPage.value;
	const end = start + perPage.value;
	return filteredData.value.slice(start, end);
});

// 更新頁碼
const updatePage = (page: number) => {
	router.push({ query: { ...route.query, page: page } });
};

// 全局的路由前置守衛，處理篩選條件不存在或資料為空的情況
// router.beforeEach((to, from, next) => {
// 	const { query } = to;
// 	const page = parseInt(query.page as string) || 1;
// 	const filterType = (query.type as string) || '1';

// 	// 確保 navTabs.title 是一個有效的陣列
// 	if (Array.isArray(navTabs.value.title) && navTabs.value.title.length > 0) {
// 		// 判斷目標文字是否存在於 path.query.type 中
// 		const isInNavTabs = navTabs.value.title.some(
// 			(tab: any) => tab.path.query.type === filterType
// 		);

// 		// 篩選條件不存在的情況
// 		if (!isInNavTabs) {
// 			next({ path: to.path, query: { page: '1', type: '1' } });
// 			return;
// 		}
// 		if (page > maxPage.value) {
// 			next({ path: to.path, query: { ...query, page: 1 } });
// 			return;
// 		}
// 	}

// 	next();
// });

onMounted(async () => {
	// 因為要設置路由守衛 會有抓資料的問題，判斷改在這裡獲取 navTabs 的資料
	if (route.matched[0].path === '/seller') {
		navTabs.value = {
			title: sellerTitleData.title,
			schedule: sellerTitleData.schedule,
			btn: { title: '新增優惠劵', path: { name: 'SellerCouponNew' } },
		};
		await userStore.getCouponAll(authStore.token);
	} else {
		navTabs.value = {
			title: UserTitleData.title,
			schedule: UserTitleData.schedule,
		};
		await userStore.getCouponAll(authStore.id);
	}
});
</script>

<style lang="scss" scoped></style>
