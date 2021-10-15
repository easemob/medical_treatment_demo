<template>
	<view>
		<uni-list>
			<uni-list-item title="会话消息通知">
				<view slot="footer">
					<switch :checked="switchChecked" @change="onSwitchChange" color="#25B4A5"/>
				</view>
			</uni-list-item>
			<uni-list-item showArrow title="修改密码" to="setting4"/>
			<uni-list-item showArrow clickable title="注销账号" @click="cancellationAction"/>
		</uni-list>

		<view class="fixed-bottom m-32">
			<button class="bg-main text-white" style="border-radius: 50rpx;border: 0;" type="primary"
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
				switchChecked: true
			}
		},
		onLoad() {
			uni.getStorage({
				key: "session-message",
				success: (res) => {
					this.switchChecked = res.data;
					console.log(this.switchChecked)
				}
			});
		},
		filters: {
			format(value) {
				return value > 1024 ? (value / 1024).toFixed(2) + 'MB' : value.toFixed(2) + 'KB';
			}
		},
		methods: {
			onSwitchChange: function(e) {
				this.switchChecked=e.detail.value;
				console.log(this.switchChecked)
				uni.setStorage({
					key: 'session-message',
					data: this.switchChecked
				});
			},
			cancellationAction: function() {
				uni.showToast({
					title: "请联系客服注销",
					image: "../../static/icons/icon_gantan.png"
				})
				console.log(`cancellationAction`)
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
							uni.setStorageSync("INFORM",[]);
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
