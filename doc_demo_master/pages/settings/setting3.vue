<template>
	<view>
		<uni-list>
			<uni-list-item showSwitch="true" title="会话消息通知" @switchChange="onSwitchChange" switchColor="#25B4A5"
				:switchChecked="switchChecked" />
			<uni-list-item showArrow="true" title="修改密码" to="setting4" />
			<uni-list-item showArrow="true" clickable dishover title="注销账号" @click="cancellationAction" />
		</uni-list>
		<view class="fixed-bottom m-32">
			<button class="border-radius-whiteground" @tap="quiteAccountAction()">退出登录</button>
		</view>
	</view>
</template>

<script>
	import store from '@/store/index.js';
	let WebIM = require("../../utils/WebIM")["default"];
	export default {
		data() {
			return {
				switchChecked: true
			}
		},
		onLoad(e) {
			uni.getStorage({
				key: "session-message",
				success: (res) => {
					this.switchChecked = res.data;
				}
			});
		},
		methods: {
			onSwitchChange: function(e) {
				this.switchChecked=e.value;
				console.log(`switchChange:${e.value}`)
				uni.setStorage({
					key: 'session-message',
					data: e.value
				});
			},
			cancellationAction: function() {
				uni.showToast({
					title: "请联系客服注销",
					image: "../../static/icons/icon_gantan.png"
				})
				console.log(`cancellationAction`)
			},
			quiteAccountAction: function() {
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
							uni.removeStorage({
								key: 'qiniuArray'
							});
							store.commit('logout');
							uni.setStorageSync("INFORM", []);
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

			}
		}
	}
</script>

<style>
	@import url("setting.css");
</style>
