<template>
	<nav class="navbar navbar-expand-xl navbar-light bg-white">
		<div
			class="container"
			:class="{
				'navbar-min-size': resize < 1200,
				container: resize >= 1200,
			}"
		>
			<router-link to="/" class="nav-link">
				<h1 class="ms-3 ms-xl-0 mb-0 me-3 d-flex align-items-center">
					<img
						src="/images/ECArtisans.svg"
						class="logo"
						alt="ECArtisans"
						title="ECArtisans"
					/>
				</h1>
			</router-link>

			<!-- 商家獨立按鈕 -->
			<button
				v-if="route.name === 'SellerHome' && (!isLoggedIn || isUser)"
				class="btn btn-primary mx-3 px-xxl-4 mx-xl-0"
				type="button"
				@click="$go({ name: 'SellerLogin' })"
			>
				<p class="m-0 px-2">申請/登入商家</p>
			</button>
			<button
				v-if="
					route.name !== 'SellerHome' &&
					isSellerRoute &&
					(!isLoggedIn || isUser)
				"
				class="btn btn-primary mx-3 px-xxl-4 mx-xl-0"
				type="button"
				@click="$go({ name: 'SellerHome' })"
			>
				<p class="m-0 px-2">商家推薦</p>
			</button>

			<!-- 縮小按鈕 -->

			<!-- 小圖示 -->
			<div
				class="position-relative d-flex btn-group"
				v-if="
					route.name !== 'SellerHome' &&
					route.name !== 'SellerLogin' &&
					route.name !== 'SellerSignUp'
				"
			>
				<button
					v-if="(isSellerRoute && isLoggedIn) || !isSellerRoute"
					class="me-2 navbar-toggler collapsed d-flex d-xl-none flex-column justify-content-around"
					type="button"
					@click="toggleCollapse()"
				>
					<span class="navbar-toggler-icon"></span>
				</button>
				<button
					v-if="!isSellerRoute && resize < 1200"
					class="btn btn-primary rounded-circle me-4 btn-size"
					@click="$go({ name: 'Cart' })"
				>
					<i class="bi bi-bag"></i>
					<span
						v-if="isUser"
						class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger rounded-circle"
					>
						{{ cartNum }}
						<span class="visually-hidden">purchase car list</span>
					</span>
				</button>
			</div>
			<div
				v-if="
					route.name !== 'SellerHome' &&
					route.name !== 'SellerLogin' &&
					route.name !== 'SellerSignUp'
				"
				class="collapse navbar-collapse d-xl-flex navbar-menu bg-white p-0 w-100"
				:class="{
					'justify-content-xl-between': !isSellerRoute,
					'justify-content-end': isSellerRoute,
				}"
				ref="collapseElement"
			>
				<!-- 商家登入後的下拉選單 是商家的路由 / 登入商家角色 -->
				<div
					v-if="isSellerRoute && isSeller && isLoggedIn"
					class="py-4 py-xl-2 px-3 pe-xl-0 w-100"
					:style="{
						'overflow-y': resize < 1200 ? 'auto' : 'visible',
					}"
				>
					<div
						:class="{
							'row flex-column flex-nowrap ': resize < 1200,
							'd-flex justify-content-end w-100 p-0': resize >= 1200,
						}"
					>
						<div
							:class="{
								'col-12 order-2': resize < 1200,
								'd-flex align-items-center justify-content-center':
									resize >= 1200,
							}"
							class=""
						>
							<ul
								:class="{
									'row m-0 p-0': resize < 1200,
									'navbar-nav mb-2 mb-lg-0': resize >= 1200,
								}"
								style="list-style: none"
							>
								<li
									v-if="resize < 992"
									:class="{
										'col-12 my-3 fs-5 m-0 p-0': resize < 1200,
										'nav-item dropdown': resize >= 1200,
									}"
									style="list-style: none"
								>
									<button
										:class="{
											'nav-link mb-3 mb-lg-0 px-3 ': resize < 1200,
											'nav-link dropdown-toggle text-primary fs-6':
												resize >= 1200,
										}"
										id="navbarScrollingDropdown"
										role="button"
										data-bs-toggle="dropdown"
										aria-expanded="false"
									>
										<span>選單</span>
									</button>
									<div
										:class="{
											'col-12 m-0 p-0': resize < 1200,
											'dropdown-menu': resize >= 1200,
										}"
									>
										<ol
											:class="{
												'row m-0 p-0 ': resize < 1200,
												'ps-0': resize >= 1200,
											}"
											aria-labelledby="navbarScrollingDropdown"
										>
											<li
												v-for="(sMenuItem, sMenuIndex) in sellerMenu"
												:key="sMenuIndex"
												style="list-style: none"
												:class="{
													'col-6 col-sm-3 m-0 p-2': resize < 1200,
													'dropdown-item ': resize >= 1200,
												}"
											>
												<RouterLink
													:to="sMenuItem.path"
													:class="{
														'btn btn-Bg rounded-2 text-center w-100 h-100 py-2':
															resize < 1200,
														'btn  text-center py-2': resize >= 1200,
													}"
													@click="hideCollapse()"
												>
													{{ sMenuItem.title }}
												</RouterLink>
											</li>
										</ol>
									</div>
								</li>
								<li
									:class="{
										'col-12 my-3 fs-5 m-0 p-0': resize < 1200,
										'nav-item dropdown': resize >= 1200,
									}"
									style="list-style: none"
								>
									<button
										:class="{
											'nav-link mb-3 mb-lg-0 px-3 ': resize < 1200,
											'nav-link dropdown-toggle text-primary fs-6':
												resize >= 1200,
										}"
										id="navbarScrollingDropdown"
										role="button"
										data-bs-toggle="dropdown"
										aria-expanded="false"
									>
										<i v-if="resize >= 1200" class="bi bi-shop-window me-1"></i>
										<!-- 商家 -->
										<span>會員中心</span>
									</button>
									<div
										:class="{
											'col-12 m-0 p-0': resize < 1200,
											'dropdown-menu': resize >= 1200,
										}"
									>
										<ol
											:class="{
												'row m-0 p-0 ': resize < 1200,
												'ps-0': resize >= 1200,
											}"
											aria-labelledby="navbarScrollingDropdown"
										>
											<li
												style="list-style: none"
												:class="{
													'col-6 col-sm-3 m-0 p-2': resize < 1200,
													'dropdown-item ': resize >= 1200,
												}"
											>
												<button
													:class="{
														'btn btn-Bg rounded-2 text-center w-100 h-100 py-2':
															resize < 1200,
														'btn text-center py-2': resize >= 1200,
													}"
													@click="toLogout()"
												>
													登出
												</button>
											</li>
										</ol>
									</div>
								</li>
							</ul>
						</div>
					</div>
				</div>

				<!-- 買家登入後的下拉選單 是買家的路由-->
				<div
					v-if="!isSellerRoute"
					class="py-4 py-xl-2 px-3 pe-xl-0 w-100"
					:style="{
						height: resize < 1200 ? ' calc(100vh - 56px)' : 'fit-content',
						'overflow-y': resize < 1200 ? 'auto' : 'visible',
					}"
				>
					<div
						:class="{
							'row flex-column flex-nowrap ': resize < 1200,
							'd-flex justify-content-between w-100 p-0': resize >= 1200,
						}"
					>
						<div
							:class="{
								'd-flex align-items-center': resize >= 1200,
							}"
						>
							<!-- 買家 選單 還未判定只有會員中心會出現 -->
							<div
								v-if="resize < 1200 && isUser && isUserRoute"
								:class="{
									'col-12 order-2': resize < 1200,
									'd-flex align-items-center justify-content-center':
										resize >= 1200,
								}"
							>
								<ul
									:class="{
										'row m-0 p-0': resize < 1200,
										'navbar-nav mb-2 mb-lg-0': resize >= 1200,
									}"
									style="list-style: none"
								>
									<li
										v-if="resize < 992"
										:class="{
											'col-12 my-3 fs-5 m-0 p-0': resize < 1200,
											'nav-item dropdown': resize >= 1200,
										}"
										style="list-style: none"
									>
										<button
											:class="{
												'nav-link mb-3 mb-lg-0 px-3 ': resize < 1200,
												'nav-link dropdown-toggle text-primary fs-6':
													resize >= 1200,
											}"
											id="navbarScrollingDropdown"
											role="button"
											data-bs-toggle="dropdown"
											aria-expanded="false"
										>
											<span>選單</span>
										</button>
										<div
											class="z-5"
											:class="{
												'col-12 d-flex m-0 p-0': resize < 1200,
												'dropdown-menu md-menu': resize >= 1200,
											}"
										>
											<li
												v-for="(sMenuItem, sMenuIndex) in userMenu"
												:key="sMenuIndex"
												style="list-style: none"
												:class="{
													'col-6 col-sm-3 m-0 p-2': resize < 1200,
													'dropdown-item ': resize >= 1200,
												}"
											>
												<RouterLink
													:to="sMenuItem.path"
													:class="{
														'btn btn-Bg rounded-2 text-center w-100 h-100 py-2':
															resize < 1200,
														'btn  text-center py-2': resize >= 1200,
													}"
													@click="hideCollapse()"
												>
													{{ sMenuItem.title }}
												</RouterLink>
											</li>
										</div>
									</li>
								</ul>
							</div>
							<!-- 買家 商品總覽 -->
							<div
								:class="{
									'col-12 order-2': resize < 1200,
									'd-flex align-items-center justify-content-center':
										resize >= 1200,
								}"
								class=""
							>
								<ul
									:class="{
										'row m-0 p-0': resize < 1200,
										'navbar-nav mb-2 mb-lg-0': resize >= 1200,
									}"
									style="list-style: none"
								>
									<li
										:class="{
											'col-12 my-3 fs-5 m-0 p-0': resize < 1200,
											'nav-item dropdown': resize >= 1200,
										}"
										style="list-style: none"
									>
										<button
											:class="{
												'nav-link mb-3 mb-lg-0 px-2': resize < 1200,
												'nav-link dropdown-toggle fs-6': resize >= 1200,
											}"
											id="navbarScrollingDropdown"
											role="button"
											data-bs-toggle="dropdown"
											aria-expanded="false"
											ref=""
										>
											商品總覽
										</button>
										<div
											:class="{
												'col-12 m-0 p-0': resize < 1200,
												'dropdown-menu md-menu': resize >= 1200,
											}"
										>
											<ol
												:class="{ 'row m-0 p-0 ': resize < 1200 }"
												aria-labelledby="navbarScrollingDropdown"
											>
												<li
													v-for="(menu, menuIndex) in menulist"
													:key="menuIndex"
													style="list-style: none"
													:class="{ 'col-6 col-sm-3 m-0 p-2': resize < 1200 }"
													@click="
														$go({
															name: 'ProductOverview',
															query: { category: menu, page: 1 },
														})
													"
												>
													<RouterLink
														to="/"
														:class="{
															'btn btn-Bg rounded-2 text-center w-100 h-100 py-2':
																resize < 1200,
															'dropdown-item overflow-y-hidden': resize >= 1200,
														}"
														@click="hideCollapse()"
													>
														{{ menu }}
														<div v-if="resize >= 1200" class="dot"></div>
													</RouterLink>
												</li>
											</ol>
										</div>
									</li>
								</ul>
							</div>
						</div>
						<!-- 搜尋框  搜尋框 --------------------------- -->
						<div
							:class="{
								'col-12 order-1 mb-3': resize < 1200,
								'd-flex align-items-center justify-content-center':
									resize >= 1200,
							}"
						>
							<div
								class="d-flex align-items-center justify-content-center me-3 nav-search"
							>
								<input
									id="search"
									name="請輸入名稱"
									type="search"
									v-model="searchKeyword"
									class="form-control nav-search-input"
									aria-label="請輸入名稱"
									placeholder="請輸入名稱..."
								/>
								<div class="btn-group">
									<div class="dropdown-center">
										<button
											class="btn nav-btn-search dropdown-toggle d-flex align-items-center justify-content-center"
											type="button"
											data-bs-toggle="dropdown"
											aria-expanded="false"
										>
											<div class="line flex-shrink">
												{{ searchText }}
											</div>
										</button>
										<ul class="dropdown-menu menu-search text-center">
											<li
												v-for="(searchType, searchTypeIndex) in searchlist"
												:key="searchTypeIndex"
												@click="getSearchText(searchType)"
											>
												<div class="dropdown-item">
													{{ searchType }}
												</div>
											</li>
										</ul>
									</div>
								</div>
								<button
									class="btn btn-primary btn-search d-flex align-items-center justify-content-center"
									type="button"
									@click="onSubmit1(searchKeyword)"
									style="width: 36px; height: 36px"
								>
									<font-awesome-icon :icon="['fas', 'magnifying-glass']" />
								</button>
							</div>
						</div>

						<!-- 其他 按鈕 --------------------------- -->

						<div
							:class="{
								'col-12 order-3 m-0 p-0': resize < 1200,
								'd-flex align-items-center justify-content-center px-2 m-0':
									resize >= 1200,
							}"
						>
							<div
								:class="{
									'row m-0 px-2': resize < 1200,
									'd-flex align-items-center justify-content-center':
										resize >= 1200,
								}"
							>
								<div
									class="flex-shrink"
									:class="{
										'col-12 px-2': resize < 1200,
									}"
								>
									<button
										@click="
											isLoggedIn && isSeller
												? $go({ name: 'SellerProfile' })
												: $go({ name: 'SellerHome' })
										"
										class="btn text-primary flex-shrink"
										:class="{
											'col-12 py-4 px-0 text-start w-100 rounded-0 border-bottom border-1':
												resize < 1200,
										}"
									>
										<i class="bi bi-shop-window"></i>
										<span>
											{{ isSeller ? '前往商店' : '我要開店' }}
										</span>
									</button>
								</div>
								<div
									v-if="!isLoggedIn || (isLoggedIn && !isUser)"
									class="flex-shrink"
									:class="{
										'col-12 px-2': resize < 1200,
									}"
								>
									<button
										@click="$go({ name: 'UserLogin' })"
										class="btn text-primary flex-shrink"
										:class="{
											'col-12 py-4 px-0 text-start w-100 rounded-0 border-bottom border-1':
												resize < 1200,
										}"
									>
										<i class="bi bi-shop-window"></i>
										<span>會員中心</span>
									</button>
								</div>

								<div
									v-else-if="isLoggedIn && isUser"
									class="btn-group flex-shrink"
									:class="{
										'col-12 px-0': resize < 1200,
									}"
								>
									<div
										:class="{
											'nav-item w-100 px-2 ': resize < 1200,
											dropdown: resize >= 1200,
										}"
									>
										<button
											class="btn text-primary m-0 text-start"
											:class="{
												'w-100 rounded-0 border-bottom border-1': resize < 1200,
											}"
											:style="{
												padding: resize >= 1200 ? '6px 12px' : '24px 0px',
											}"
											type="button"
											id="dropdownMenuButton"
											data-bs-toggle="dropdown"
											aria-expanded="false"
										>
											<i class="bi bi-person"></i>
											會員中心
										</button>
										<ul
											class="dropdown-menu dropdown-menu-lg-st z-3"
											aria-labelledby="dropdownMenuButton"
										>
											<li @click="$go({ name: 'UserProfile' })">
												<a class="dropdown-item">會員資訊</a>
											</li>
											<li>
												<a class="dropdown-item" @click="toLogout()">登出</a>
											</li>
										</ul>
									</div>
								</div>

								<!-- 收藏 -->
								<div
									v-if="isUser"
									class="btn-group flex-shrink"
									:class="{
										'col-12 px-0 p-0 m-0': resize < 1200,
									}"
								>
									<div
										:class="{
											'nav-item w-100 px-2 m-0': resize < 1200,
											dropdown: resize >= 1200,
										}"
									>
										<button
											class="btn text-primary m-0 text-start"
											:class="{
												'w-100 rounded-0': resize < 1200,
											}"
											:style="{
												padding: resize >= 1200 ? '6px 12px' : '24px 0px',
											}"
											type="button"
											id="dropdownMenuButton"
											data-bs-toggle="dropdown"
											aria-expanded="false"
										>
											<i class="bi bi-heart"></i>
											收藏
										</button>
										<ol
											:class="{
												'row m-0 pt-0 d-flex w-100 rounded-0 border-0 pb-5 border-bottom border-1':
													resize < 1200,
											}"
											class="dropdown-menu dropdown-menu-lg-st"
											aria-labelledby="dropdownMenuButton"
										>
											<li
												style="list-style: none"
												:class="{ 'col-6 col-sm-3 m-0 p-2': resize < 1200 }"
											>
												<a
													:class="{
														'btn btn-Bg rounded-2 text-center w-100 h-100 py-2':
															resize < 1200,
														'dropdown-item overflow-y-hidden': resize >= 1200,
													}"
													@click="
														$go({ name: 'UserCollect', query: { page: 1 } })
													"
												>
													收藏商品
												</a>
											</li>
											<li
												style="list-style: none"
												:class="{ 'col-6 col-sm-3 m-0 p-2': resize < 1200 }"
											>
												<a
													:class="{
														'btn btn-Bg rounded-2 text-center w-100 h-100 py-2':
															resize < 1200,
														'dropdown-item overflow-y-hidden': resize >= 1200,
													}"
													@click="
														$go({ name: 'UserFollow', query: { page: 1 } })
													"
												>
													關注商家
												</a>
											</li>
										</ol>
									</div>
								</div>

								<button
									v-if="resize >= 1200"
									class="ms-2 btn btn-primary rounded-circle position-relative btn-size"
									@click="$go({ name: 'Cart' })"
								>
									<i class="bi bi-bag"></i>
									<span
										v-if="isUser"
										class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger rounded-circle"
									>
										{{ cartNum }}
										<span class="visually-hidden">purchase car list</span>
									</span>
									<span v-else>
										<span class="visually-hidden">purchase car list</span>
									</span>
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</nav>
</template>

<script lang="ts" setup>
import Collapse from 'bootstrap/js/dist/collapse';
import { onMounted, ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore, useCartStore } from '@/stores/index';
import Logo from './Logo.vue';
import { useResize, go } from '@/stores/index';
const { resize } = useResize();

const authStore = useAuthStore();
const useCart = useCartStore();

const route = useRoute();
const router = useRouter();

const menulist = [
	'服飾',
	'運動',
	'食品',
	'生活用品',
	'娛樂',
	'家具',
	'3C產品',
	'寵物用品',
	'清潔用品',
];

const searchlist = ['找商品']; //暫時拿掉
const searchText = ref('找商品');
const searchKeyword = ref('');

const collapseElement = ref<HTMLElement | null>(null);
let collapseInstance: Collapse | null = null;

const toggleCollapse = () => {
	if (collapseInstance) {
		collapseInstance.toggle();
	}
};

const hideCollapse = () => {
	if (collapseInstance) {
		collapseInstance.hide();
	}
};

const scrollToTop = () => {
	window.scrollTo({ top: 0, behavior: 'smooth' });
};

const onSubmit1 = async (searchKeyword: string) => {
	if (
		route.name !== 'ProductOverview' ||
		route.query.keyword !== searchKeyword ||
		route.query.page !== '1'
	) {
		await router.push({
			name: 'ProductOverview',
			query: { keyword: searchKeyword, page: 1 },
			replace: true,
		});
	}
	clearSearchKeyword();
	scrollToTop();
};

function getSearchText(value: string) {
	searchText.value = value;
}

function clearSearchKeyword() {
	searchKeyword.value = '';
}

function sellerlogin() {
	hideCollapse();
	router.push({ name: 'SellerLogin' });
}

function toLogin() {
	hideCollapse();
	router.push({ name: 'UserLogin' });
}

function toSellerHome() {
	hideCollapse();
	router.push({ name: 'SellerHome' });
}

function toLogout() {
	hideCollapse();
	authStore.logout(); // 等待登出操作完成
}
// const isShopRoute = ref(false);

// watchEffect(() => {
// 	isShopRoute.value = route.path.toLowerCase().startsWith('/seller');
// });
const isUser = computed(() => {
	return authStore.accountType === 'user';
});
const isSeller = computed(() => {
	return authStore.accountType === 'seller';
});
const isLoggedIn = computed(() => {
	return authStore.isLoggedIn;
});
const isSellerRoute = computed(() => {
	return route.matched.length > 0 && route.matched[0].path.includes('/seller');
});
const isUserRoute = computed(() => {
	return route.matched.length > 0 && route.matched[0].path.includes('/user');
});

// 會員選單
import { useUserStore } from '@/stores/index';
import type { Form } from 'vee-validate';
const userUserStore = useUserStore();
const sellerMenu = userUserStore.sellerMenu;
const userMenu = userUserStore.userMenu;

onMounted(() => {
	if (collapseElement.value) {
		collapseInstance = new Collapse(collapseElement.value);
	}

	// 根據當前路由加載資料
	if (route && route.name === 'SellerProfile') {
		// init.value = sellerTitleData;
	} else if (route && route.name === 'UserProfile') {
		// init.value = userTitleData;
	}
});

//
const cartNum = computed(() => useCart.cartNum);

onMounted(async () => {
	await useCart.getAllCart();
});
</script>

<style scoped>
.search-size {
	/* width: 400px; */
}
.btn-size {
	padding: 6px 12px 10px 12px;
}
</style>
