<template>
	<view>
		<!-- 主体表单 -->
		<view class="login_main">
			<view :class="'login_pwd ' + psdFocus">
				<!-- 文本框 -->
				<input type="text" v-model="userPass" placeholder="请输入新密码" placeholder-style="color:rgb(173,185,193)"
					@focus="onFocusPsd" @blur="onBlurPsd" maxlength="16" />
				<!-- 是否可见密码 -->
				<uni-icons class="pass_icon" type="locked-filled" color="#92939F" size="24" />
			</view>
			<view :class="'login_again ' + againFocus">
				<!-- 文本框 -->
				<input type="text" v-model="userAgain" placeholder="请再次输入密码" placeholder-style="color:rgb(173,185,193)"
					@focus="onFocusAga" @blur="onBlurAga" maxlength="16" />
				<!-- 是否可见密码 -->
				<uni-icons class="pass_icon" type="locked-filled" color="#92939F" size="24" />
			</view>
		</view>
		<view class="setting_btn">
			<button hover-class="btn_hover" @tap="changePassAction">修改密码</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userPass: "", //密码
				userAgain: "", //再次确认
				psdFocus: "",
				againFocus: "",
			}
		},
		methods: {
			onFocusPsd: function() {
				this.setData({
					psdFocus: 'psdFocus'
				});
			},
			onBlurPsd: function() {
				this.setData({
					psdFocus: ''
				});
			},
			onFocusAga: function() {
				this.setData({
					againFocus: 'againFocus'
				});
			},
			onBlurAga: function() {
				this.setData({
					againFocus: ''
				});
			},
			changePassAction: function() {
				uni.showModal({
					content: '密码修改成功',
					showCancel: false,
					success: function(res) {
						if (res.confirm) {
							uni.navigateBack({
								
							})
						} 
					}
				})
				
			},
		}
	}
</script>

<style>
	@import url("setting.css");

	/* 主体 */
	.login_main {
		display: flex;
		margin-top: 64rpx;
		padding: 16rpx;
		flex-direction: column;
	}

	.login_pwd,
	.login_again {
		display: flex;
		text-align: start;
	}

	.login_pwd input,
	.login_again input {
		height: 84rpx;
		background-color: #ffffff;
		border: 2rpx solid #C2C3CA;
		border-radius: 8rpx;
		box-sizing: border-box;
		padding: 2rpx 80rpx;
		font-size: 34rpx;
		color: #000;
		margin: 24rpx;
		display: inline-block;
		flex: 1;
	}

	.psdFocus input,
	.againFocus input {
		border: 4rpx solid #00C58F;
		box-sizing: border-box;
	}

	.pass_icon {
		position: fixed;
		padding: 20rpx;
		left: 40rpx;
	}
</style>
