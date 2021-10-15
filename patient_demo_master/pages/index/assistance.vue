<template>
	<view>
		<view class="flex align-center bg-white" @click="openMineData()">
			<image :src="userData.avatar" mode="aspectFill" class="avatar-image"></image>
			<view class="flex flex-column flex-1 px-2 align-start">
				<text class="font-md font-weight-bold text-dark">{{userData.user_nicename}}</text>
			</view>
		</view>

		<view class="flex align-center mt-32">
			<uni-list class="text-left" :border="false">
				<uni-list-item showArrow="true" title="设置" showExtraIcon="true" to="../mine/usersetings">
					<template slot="header">
						<image class="slot-image" src="@/static/iconfont/icon_assetting1.png"></image>
					</template>
				</uni-list-item>
			</uni-list>
		</view>

		<view class="flex align-center mt-32">
			<uni-list class="text-left" :border="false">
				<uni-list-item showArrow="true" title="问诊指南" showExtraIcon="true" to="../mine/product-guide">
					<template slot="header">
						<image class="slot-image" src="@/static/iconfont/icon_assetting2.png"></image>
					</template>
				</uni-list-item>
			</uni-list>
		</view>
	</view>
</template>

<script>
	import store from '@/store/index.js';
	export default {
		data() {
			return {
				userData: {}
			}
		},
		onLoad() {
			console.log('onLoad', store.state.hasLogin);
			if (!store.state.hasLogin) {
				return uni.navigateTo({
					url: '../login/login?navigateFrom=assistance'
				});
			}
		},
		onReady() {

		},
		onShow: function() {
			console.log('onShow');
			if (!store.state.hasLogin) {
				uni.navigateTo({
					url: '../login/login?navigateFrom=assistance'
				});
			}
			uni.getStorage({
				key: "user-info",
				success: (res) => {
					if (res.data) {
						this.userData = JSON.parse(res.data);
					}
				}
			});
		},
		methods: {
			// 点击用户资料设置
			openMineData() {
				uni.navigateTo({
					url: '../mine/personal-data'
				});
			},
		}
	}
</script>

<style>
	.border-main {
		padding: 0rpx 16rpx;
		border-radius: 16rpx;
		border-color: #25B4A5;
		border-width: 2rpx;
		border-style: solid;
	}

	.avatar-image {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		width: 128rpx;
		height: 128rpx;
		margin: 24rpx;
		border-radius: 64rpx;
	}

	.slot-image {
		/* #ifndef APP-NVUE */
		display: block;
		/* #endif */
		margin-right: 32rpx;
		margin-top: 4rpx;
		width: 48rpx;
		height: 51rpx;
	}
</style>
