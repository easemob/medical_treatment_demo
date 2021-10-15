<template>
	<view class="login">
		<uni-nav-bar :status-bar="true" backgroundColor="#EFEFEF" left-icon="back" :border="false"
			@clickLeft="goBackAction">
		</uni-nav-bar>
		<view class="content">
			<!-- 头部logo -->
			<view class="header">
				<image src="@/static/icons/icon_showlog.png"></image>
				<text class="header_line"></text>
				<text class="header_text">医疗 Demo</text>
			</view>
			<!-- 主体表单 -->
			<view class="login_main">
				<text class="header_tips">手机号/Mobile</text>
				<view :class="'login_user ' + nameFocus">
					<input type="text" v-model="userName" placeholder="手机号" placeholder-style="color:rgb(173,185,193)"
						@focus="onFocusName" @blur="onBlurName" />
				</view>
				<text class="header_tips">密码/Key</text>
				<view :class="'login_pwd ' + psdFocus">
					<!-- 文本框 -->
					<input type="text" v-model="userPass" placeholder="密码" placeholder-style="color:rgb(173,185,193)"
						@focus="onFocusPsd" @blur="onBlurPsd" :password="!showPassword" maxlength="16" />
					<!-- 是否可见密码 -->
					<uni-icons class="pass_icon" :type="showPassword?'eye':'eye-slash'" color="#92939F" size="24"
						@tap="showPassAction" />
				</view>
			</view>


			<view class="login_btn">
				<button hover-class="btn_hover" @tap="startLogin">登录</button>
			</view>

			<!-- 注册信息 -->
			<view class="footer">
				<navigator url="register" open-type="navigate">注册账号</navigator>
			</view>

			<!-- 底部信息 -->
			<view class="login_bottom">
				<text>本产品由环信提供 当前版本：1.4.1</text>
			</view>
		</view>
	</view>
</template>

<script>
	import request from '@/common/request.js';
	import store from '@/store/index.js';
	let _this;
	let WebIM = require("../../utils/WebIM")["default"];
	let __test_account__, __test_psword__;
	let disp = require("../../utils/broadcast");
	let runAnimation = true;
	export default {
		data() {
			return {
				navigateFrom:'',//跳转来源
				showPassword: false, //是否显示明文
				logoImage: '/static/icons/icon_showlog.png', //logo图片 base64
				isRotate: false, //是否加载旋转
				isFocus: true, // 是否聚焦
				grant_type: "password",
				userName: "", //用户/电话
				userPass: "", //密码
				psdFocus: "",
				nameFocus: "",
			};
		},
		components: {

		},
		mounted() {
			_this = this;
		},
		onLoad(e) {
			this.navigateFrom = e.navigateFrom;
		},
		methods: {
			// 返回上一步
			goBackAction: function() {
				if(this.navigateFrom=='assistance'){
					uni.switchTab({
						url: "../index/main",
					});
				}else{
					uni.navigateBack({
						delta: 1
					});
				}
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
			showPassAction() {
				//是否显示密码
				this.showPassword = !this.showPassword
			},
			startLogin(e) {
				console.log(e)
				//登录
				if (this.isRotate) {
					//判断是否加载中，避免重复点击请求
					return false;
				}
				if (this.userName.length == "") {
					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: '手机号不能为空'
					});
					return;
				}
				if (this.userPass.length < 5) {
					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: '密码不正确'
					});
					return;
				}
				//手机号正则
				var mPattern = /^1[3456789]\d{9}$/; 
				if (!mPattern.test(this.userName)) {
					return uni.showToast({
						title: '手机号格式不正确',
						icon: 'none'
					});
				}
				console.log("登录成功")
				let data = {
					username: this.userName,
					password: this.userPass,
					usertype: "2"
				};
				_this.isRotate = true
				setTimeout(function() {
					_this.isRotate = false;
				}, 3000);
				let that = this;
				request.post('/user/login/dologinjson', data).then(res => {
					if (res.code == 101) {
						console.log("登录成功", res.referer);
						store.commit('login', res.referer.id);
						uni.setStorage({
							key:'user-info',
							data:JSON.stringify(res.referer)
						});
						that.openWebIM();
					} else {
						console.log(res.info);
						uni.showModal({
							title: '温馨提示',
							content: res.info,
							showCancel: false
						})
					}
				});
			},
			openWebIM() {
				uni.setStorage({
					key: "myUsername",
					data: this.userName.toLowerCase()
				});
				uni.setStorage({
					key: "myUserpass",
					data: this.userPass.toLowerCase()
				});
				console.log(111, {
					apiUrl: WebIM.config.apiURL,
					user: __test_account__ || this.userName.toLowerCase(),
					pwd: __test_psword__ || this.userPass,
					grant_type: this.grant_type,
					appKey: WebIM.config.appkey
				})
				getApp().globalData.conn.open({
					apiUrl: WebIM.config.apiURL,
					user: __test_account__ || this.userName.toLowerCase(),
					pwd: __test_psword__ || this.userPass,
					grant_type: this.grant_type,
					appKey: WebIM.config.appkey
				});
			},
			login_weixin() {
				//微信登录
				uni.showToast({
					icon: 'none',
					position: 'bottom',
					title: '...'
				});
			},
			login_weibo() {
				//微博登录
				uni.showToast({
					icon: 'none',
					position: 'bottom',
					title: '...'
				});
			},
			login_github() {
				//github登录
				uni.showToast({
					icon: 'none',
					position: 'bottom',
					title: '...'
				});
			}
		}
	}
</script>

<style>
	@import url("./css/main.css");
</style>
