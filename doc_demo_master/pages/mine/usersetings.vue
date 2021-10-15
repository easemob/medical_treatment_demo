<template>
	<view>
		<uni-list>
			<uni-list-item title="会话消息通知">
				<view slot="footer">
					<switch checked color="#25B4A5" :checked="switchChecked" @change="onSwitchChange"/>
				</view>
			</uni-list-item>
			<uni-list-item showArrow title="修改密码" />
			<uni-list-item showArrow title="注销账号" />
		</uni-list>

		<view class="fixed-bottom m-32">
			<button class="text-red text-white" style="border-radius: 50rpx;border: 0;" type="primary"
				@tap="userQuite()">退出登录</button>
		</view>

	</view>
</template>

<script>
	import store from '@/store/index.js';
	let WebIM = require("../../utils/WebIM")["default"];
	export default {
		components: {

		},
		data() {
			return {
				switchChecked:true
			}
		},
		onLoad() {
			uni.getStorage({
				key: "session-message",
				success: (res) => {
					this.switchChecked=res.data;
				}
			});
		},
		filters: {
			format(value) {
				return value > 1024 ? (value / 1024).toFixed(2) + 'MB' : value.toFixed(2) + 'KB';
			}
		},
		methods: {
			onSwitchChange(e) {
				this.switchChecked=e.detail;
				console.log(e.detail);
				uni.setStorage({
					key:'session-message',
					data:this.switchChecked
				});
			},
			open(path) {
				uni.navigateTo({
					url: `../${path}/${path}`
				});
			},
			// 清除缓存
			clear() {
				uni.showModal({
					title: '提示',
					content: '是否要清除所有缓存？',
					cancelText: '不清除',
					confirmText: '清除',
					success: res => {
						if (res.confirm) {
							uni.clearStorageSync()
							this.getStorageInfo()
							uni.showToast({
								title: '清除成功',
								icon: 'none'
							});
						}
					},
				});
			},
			userQuite() {
				uni.showModal({
					title: "提示",
					content: "是否确认退出",
					showCancel: true,
					cancelText: '取消',
					confirmText: '退出',
					success: res => {
						if (res.confirm) {
							uni.removeStorage({
								key: 'user-info'
							});
							store.commit('logout');
							uni.setStorageSync("INFORM",[])
							uni.setStorage({
								key: "myLoginSuccess",
								data: false
							});
							WebIM.conn.close(); 
							uni.redirectTo({
							  url: "../login/login"
							});
						} else {

						}
					}
				})
			},
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
</style>
