<template>
	<div class="min-h-screen bg-gray-50">
		<!-- 顶部导航 -->
		<div class="bg-white border-b border-gray-200 sticky top-0 z-40">
			<div class="flex items-center justify-between px-4 py-3">
				<button @click="$router.go(-1)" class="p-2">
					<ArrowLeft :size="20" class="text-gray-600" />
				</button>
				<h1 class="text-lg font-bold text-gray-800">我的订单</h1>
				<div class="w-12"></div>
			</div>
		</div>

		<!-- 订单状态筛选 -->
		<div class="bg-white border-b border-gray-200">
			<div class="flex overflow-x-auto px-4 py-3 space-x-2 scrollbar-hide">
				<button
					@click="selectedStatus = ''"
					class="flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap"
					:class="
						selectedStatus === ''
							? 'bg-amber-600 text-white'
							: 'bg-gray-100 text-gray-600 hover:bg-gray-200'
					"
				>
					全部订单
				</button>
			</div>
		</div>

		<!-- 订单列表 -->
		<div class="px-4 py-4">
			<!-- 空状态 -->
			<div
				v-if="filteredOrders.length === 0"
				class="flex flex-col items-center justify-center py-20"
			>
				<FileText :size="64" class="text-gray-300 mb-4" />
				<h3 class="text-lg font-medium text-gray-500 mb-2">
					{{ selectedStatus ? "暂无相关订单" : "暂无订单" }}
				</h3>
				<p class="text-sm text-gray-400 mb-6">快去下单享受美味咖啡吧</p>
				<button
					@click="$router.push('/')"
					class="bg-amber-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-amber-700 transition-colors"
				>
					去下单
				</button>
			</div>

			<!-- 订单卡片 -->
			<div v-else class="space-y-4">
				<div
					v-for="order in filteredOrders"
					:key="order.id"
					class="bg-white rounded-xl shadow-sm overflow-hidden"
				>
					<!-- 订单商品 -->
					<div class="p-4">
						<div class="space-y-3">
							<div
								v-for="item in order.items"
								:key="`${item.id}-${item.size}-${item.temperature}`"
								class="flex items-center space-x-3"
							>
								<img
									:src="item.image"
									:alt="item.name"
									class="w-12 h-12 rounded-lg object-cover flex-shrink-0"
								/>
								<div class="flex-1 min-w-0">
									<h4 class="font-medium text-gray-800 text-sm">
										{{ item.name }}
									</h4>
									<div
										class="flex items-center space-x-2 text-xs text-gray-500"
									>
										<span>{{ item.size }}</span>
										<span>•</span>
										<span>{{ item.temperature }}</span>
										<span>•</span>
										<span>x{{ item.quantity }}</span>
									</div>
								</div>
								<div class="text-sm font-medium text-gray-800">
									¥{{ item.price * item.quantity }}
								</div>
							</div>
						</div>
					</div>

					<!-- 订单底部 -->
					<div class="px-4 pb-4">
						<div class="flex items-center justify-between">
							<div class="text-sm text-gray-600">
								共
								{{
									order.items.reduce((sum, item) => sum + item.quantity, 0)
								}}
								件商品
							</div>
							<div class="text-lg font-bold text-amber-600">
								¥{{ order.total }}
							</div>
						</div>

						<!-- 订单操作按钮 -->
						<div class="flex items-center justify-end space-x-3 mt-3">
							<button
								v-if="order.status === 'pending'"
								@click="cancelOrder(order.id)"
								class="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
							>
								取消订单
							</button>
							<button
								@click="reorder(order)"
								class="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors"
							>
								再来一单
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { ref, computed } from "vue";
	import { useRouter } from "vue-router";
	import { ArrowLeft, FileText, Store, Truck, Clock } from "lucide-vue-next";
	import { store, cartActions, orderActions, type Order } from "@/stores";
	import { toast } from "vue-sonner";

	const router = useRouter();
	const selectedStatus = ref("");

	// 过滤订单
	const filteredOrders = computed(() => {
		if (!selectedStatus.value) {
			return store.orders;
		}
		return store.orders.filter(
			(order) => order.status === selectedStatus.value,
		);
	});

	// 取消订单
	const cancelOrder = (orderId: string) => {
		if (confirm("确定要取消这个订单吗？")) {
			orderActions.updateOrderStatus(orderId, "cancelled");
			toast.success("订单已取消");
		}
	};

	// 再来一单
	const reorder = (order: Order) => {
		// 清空当前购物车
		cartActions.clearCart();

		// 将订单商品重新添加到购物车
		order.items.forEach((item) => {
			cartActions.addToCart(item, item.quantity, item.size, item.temperature);
		});

		toast.success("商品已添加到购物车");
		router.push("/cart");
	};
</script>

<style scoped>
	.scrollbar-hide {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}

	.scrollbar-hide::-webkit-scrollbar {
		display: none;
	}
</style>
