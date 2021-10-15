<template>
	<view class="register">

		<view class="content">
			<!-- 头部logo -->
			<view class="header">
				<image src="@/static/icons/icon_showlog.png"></image>
				<text class="header_line"></text>
				<text class="header_text">医疗 Demo</text>
			</view>
			<!-- 主体表单 -->
			<view class="register_main">
				<text class="header_tips">手机号/Mobile</text>
				<view :class="'register_user ' + nameFocus">
					<input type="number" v-model="username" placeholder="手机号" placeholder-style="color:rgb(173,185,193)"
						@focus="onFocusName" @blur="onBlurName">
				</view>
				<text class="header_tips">密码/Key</text>
				<view :class="'register_pwd ' + psdFocus">
					<input type="text" v-model="userpass" placeholder="密码" placeholder-style="color:rgb(173,185,193)"
						@focus="onFocusPsd" @blur="onBlurPsd"  :password="!showPassword" maxlength="16">
					<!-- 是否可见密码 -->
					<uni-icons class="pass_icon" :type="showPassword?'eye':'eye-slash'" color="#92939F" size="24"
						@tap="showPassAction" />
				</view>
				<text class="header_tips">确认密码/Key</text>
				<view :class="'register_again ' + againFocus">
					<input type="text" v-model="useragain" placeholder="确认密码" placeholder-style="color:rgb(173,185,193)"
						@focus="onFocusAgain" @blur="onBlurAgain" :password="!showPassagain" maxlength="16">
					<!-- 是否可见密码 -->
					<uni-icons class="pass_icon" :type="showPassagain?'eye':'eye-slash'" color="#92939F" size="24"
						@tap="showAgainAction" />
				</view>
				<view class="agree-view">
					<text :class="checkAgree?'agree-check':'agree-default'" @click="checkAction"></text>
					<text class="agree-text">同意环信服务条款与环信隐私协议</text>
				</view>
			</view>
			<view class="register_btn">
				<button hover-class="btn_hover" @tap="startReg">注册</button>
			</view>

			<!-- 返回登录 -->
			<view class="footer">
				<navigator url="login" open-type="navigate">返回登录</navigator>
			</view>

			<!-- 底部信息 -->
			<view class="register_bottom">
				<text>本产品由环信提供 当前版本：1.4.1</text>
			</view>
		</view>
	</view>
</template>

<script>
	import request from '@/common/request.js';
	import store from '@/store/index.js';
	let _this;
	export default {
		data() {
			return {
				//logo图片 base64
				logoImage: '/static/icons/icon_showlog.png',
				isRotate: false, //是否加载旋转
				isFocus: true, // 是否聚焦
				username: "",
				userpass: "",
				useragain: "",
				psdFocus: "",
				nameFocus: "",
				againFocus: "",
				checkAgree: false, //协议是否选择
				showPassword: false, //是否显示明文
				showPassagain: false, //是否显示明文
			}
		},
		components: {

		},
		mounted() {
			_this = this;
		},
		methods: {
			onFocusName: function() {
				this.setData({
					nameFocus: 'nameFocus'
				});
			},
			onBlurName: function() {
				this.setData({
					nameFocus: ''
				});
			},
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
			onFocusAgain: function() {
				this.setData({
					againFocus: 'againFocus'
				});
			},
			onBlurAgain: function() {
				this.setData({
					againFocus: ''
				});
			},
			showPassAction() {
				//是否显示密码
				this.showPassword = !this.showPassword
			},
			showAgainAction() {
				this.showPassagain = !this.showPassagain
			},
			checkAction() {
				//是否选择协议
				_this.checkAgree = !_this.checkAgree;
			},
			startReg() {
				//注册
				if (this.isRotate) {
					//判断是否加载中，避免重复点击请求
					return false;
				}
				if (this.showAgree == false) {
					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: '请先同意《协议》'
					});
					return false;
				}
				if (this.username.length != 11) {
					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: '手机号不正确'
					});
					return false;
				}
				if (this.userpass.length < 6) {
					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: '密码不正确'
					});
					return false;
				}
				if (this.userpass !== this.useragain) {
					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: '确认密码不正确'
					});
					return false;
				}
				let data={
					mobile:this.username,
					password:this.userpass,
					usertype:"2"
				};
				request.post('/user/register/doregisterjson',data).then(res=>{
					console.log(res);
					if(res.code==101){
						uni.showToast({
							title:"注册成功"
						});
						uni.navigateBack({
							
						});
						console.log("注册成功",res.referer);
					}else{
						console.log(res.info);
						uni.showModal({
							title: '温馨提示',
							content:res.info,
							showCancel:false
						})
					}
				});
				_this.isRotate = true
				setTimeout(function() {
					_this.isRotate = false
				}, 3000)
			}
		}
	}
</script>

<style>
	@import url("./css/main.css");

	.agree-view {
		display: flex;
		flex-direction: row;
		margin-left: 32rpx;
	}

	.agree-default {
		margin: 8rpx;
		width: 24rpx;
		height: 24rpx;
		border: 2rpx solid #999999;
		border-radius: 12rpx;
		box-sizing: border-box;
	}

	.agree-check {
		margin: 8rpx;
		width: 24rpx;
		height: 24rpx;
		border: 6rpx solid #25B4A5;
		border-radius: 12rpx;
		box-sizing: border-box;
	}

	.agree-text {
		color: #25B4A5;
		font-size: 24rpx;
	}
</style>
