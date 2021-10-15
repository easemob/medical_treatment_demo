<template>
	<view>
		<view class="flex align-center bg-white" @click="openMineData()">
			<image :src="userData.avatar" mode="aspectFill" class="avatar-image"></image>
			<view class="flex flex-column flex-1 px-2 align-start">
				<text class="font-md font-weight-bold text-dark">{{userData.user_nicename}}</text>
			</view>
		</view>

		<uni-list>
			<view class="uni-review-section"></view>
			<uni-list-item showArrow="true" title="问诊服务设置" showExtraIcon="true" to="../settings/setting1"
				:border="false">
				<template slot="header">
					<image class="slot-image" src="@/static/iconfont/icon_assetting2.png"></image>
				</template>
			</uni-list-item>
			<view class="uni-review-section"></view>
			<uni-list-item showArrow="true" title="通用设置" showExtraIcon="true" to="../settings/setting3" :border="false">
				<template slot="header">
					<image class="slot-image" src="@/static/iconfont/icon_assetting1.png"></image>
				</template>
			</uni-list-item>
		</uni-list>
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
			if (!store.state.hasLogin) {
				uni.navigateTo({
					url: '../login/login'
				});
			}
		},
		onReady() {

		},
		onShow: function() {
			if (!store.state.hasLogin) {
				uni.navigateTo({
					url: '../login/login'
				});
			}
			uni.getStorage({
				key: "user-info",
				success: (res) => {
					if (res.data) {
						this.userData = JSON.parse(res.data);
						this.avatarPath = this.userData.avatar;
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
			}
		}
	}
</script>

<style>
	page {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		background-color: #F7F8FA;
		min-height: 100%;
		height: auto;
	}

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

	.uni-review-section {
		height: 16px;
		background-color: #F7F8FA;
	}
</style>
