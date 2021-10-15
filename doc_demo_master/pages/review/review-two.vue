<template>
	<view>
		<view class="review-main">
			<uni-section title="请如实上传您的资料" titleBolder type="line" typeColor="success"></uni-section>
			<view class="review-column">
				<view class="review-column-section">
					<text class="review-column-tag">*</text>
					<text>医生头像</text>
				</view>
				<view class="review_column_picview">
					<image class="review_avatar_image" :src="reviewPath" @click="reviewImage(0)" mode="aspectFill" />
				</view>
			</view>
			<view class="review-column">
				<view class="review-column-section">
					<text class="review-column-tag">*</text>
					<text>身份证件(正反面均需上传)</text>
				</view>
				<view class="review_column_picview">
					<image class="review_column_image" :src="reviewPath1" @click="reviewImage(1)" mode="aspectFill" />
					<image class="review_column_image" :src="reviewPath2" @click="reviewImage(2)" mode="aspectFill" />
				</view>
			</view>
			<view class="review-column">
				<view class="review-column-section">
					<text class="review-column-tag">*</text>
					<text>胸牌/执业证/资格证/职称证，至少上传一项</text>
				</view>
				<view class="review_column_picview">
					<image class="review_column_image" :src="reviewPath3" @click="reviewImage(3)" mode="aspectFill" />
				</view>
				<view class="review-column-footer">
					<text>照片仅用作认证，平台会保护您的隐私，不会泄漏给第三方</text>
				</view>
			</view>
			<view class="review_btn">
				<button hover-class="btn_hover" @tap="reviewAction">提交认证</button>
			</view>
		</view>
	</view>
</template>

<script>
	import store from '@/store/index.js';
	import request from '@/common/request.js';
	let WebIM = require("../../utils/WebIM")["default"];
	import qiniuUploader from '@/common/qiniuUploader.js';
	export default {
		data() {
			return {
				rid:'',
				userData: {},
				uploadToken: '',
				navigateFrom:'',
				reviewPath: require('@/static/icons/icon_docavatar.png'),
				reviewPath1: require('@/static/icons/icon_accustomfront.png'),
				reviewPath2: require('@/static/icons/icon_accustomback.png'),
				reviewPath3: require('@/static/icons/icon_accustomground.png')
			}
		},
		onLoad(options) {
			this.rid = options.rid;
			if(options.navigateFrom){
				this.navigateFrom=options.navigateFrom;
			}
			this.userData = store.state;
			this.getQiniuAction();
		},
		methods: {
			reviewImage: function(position) {
				let that = this;
				console.log('reviewImage');
				uni.chooseImage({
					count: 1,
					sourceType: ['album', 'camera'],
					sizeType: ['compressed', 'original'],
					success: (imageres) => {
						this.uploaderImagePath(position, imageres.tempFilePaths[0]);
					},
					fail: (err) => {
						// #ifdef MP
						uni.getSetting({
							success: (res) => {
								let authStatus = res.authSetting['scope.album'] && res
									.authSetting[
										'scope.camera'];
								if (!authStatus) {
									uni.showModal({
										title: '授权失败',
										content: 'Hello uni-app需要从您的相机或相册获取图片，请在设置界面打开相关权限',
										success: (res) => {
											if (res.confirm) {
												uni.openSetting()
											}
										}
									})
								}
							}
						})
						// #endif
					}
				})
			},
			getQiniuAction: function() {
				request.get('/index/get_QiniuAuthJSON').then(getData => {
					if (getData.code == 101) {
						this.uploadToken = getData.referer;
					} else {
						uni.showToast({
							title: '上传图片出错，请稍后再试..',
							icon: 'none'
						})
					}
				});
			},
			uploaderImagePath: function(position, imagePath) {
				// 交给七牛上传
				let updateUrl = 'images/2021-08/' + new Date().getTime();
				qiniuUploader.upload(imagePath, (qiniuData) => {
					console.log(qiniuData.imageURL);
					switch (position) {
						case 0:
							this.reviewPath = qiniuData.imageURL;
							break;
						case 1:
							this.reviewPath1 = qiniuData.imageURL;
							break;
						case 2:
							this.reviewPath2 = qiniuData.imageURL;
							break;
						case 3:
							this.reviewPath3 = qiniuData.imageURL;
							break;
					}
				}, (error) => {
					console.log(error);
				}, {
					region: 'SCN', //地区
					domain: 'http://qiniu.500-china.com', // bucket 域名，下载资源时用到。
					key: updateUrl, //七牛文件名
					uptoken: this.uploadToken, // 由其他程序生成七牛 uptoken
					uptokenURL: 'UpTokenURL.com/uptoken' // 上传地址
				}, (prores) => {
					// console.log(prores);
				});
			},
			reviewAction: function() {
				if (this.reviewPath.startsWith('/static/icons')) {
					uni.showToast({
						title: '完善认证信息',
						icon: 'none'
					});
				}
				if (this.reviewPath1.startsWith('/static/icons')) {
					uni.showToast({
						title: '完善认证信息',
						icon: 'none'
					});
				}
				if (this.reviewPath2.startsWith('/static/icons')) {
					uni.showToast({
						title: '完善认证信息',
						icon: 'none'
					});
				}
				if (this.reviewPath3.startsWith('/static/icons')) {
					uni.showToast({
						title: '完善认证信息',
						icon: 'none'
					});
				}
				let postData = {
					rid: this.rid,
					useravatar: this.reviewPath,
					doc_img1: this.reviewPath1,
					doc_img2: this.reviewPath2,
					doc_img3: this.reviewPath3
				}
				request.post('/user/index/reviewDoctorJson', postData).then(res => {
					if (res.code == 101) {
						uni.showToast({
							title: '认证信息提交成功',
							icon: 'none'
						});
						this.userData['avatar'] = this.reviewPath;
						this.userData['doc_img1'] = this.reviewPath1;
						this.userData['doc_img2'] = this.reviewPath2;
						this.userData['doc_img3'] = this.reviewPath3;
						this.userData['doc_status'] = '2';
						uni.setStorage({
							key: 'user-info',
							data: JSON.stringify(this.userData)
						});
						if(this.navigateFrom=='login'){
							uni.setStorage({
								key:'user-info',
								data:JSON.stringify(userData)
							});
							that.openWebIM();
						}else{
							uni.navigateBack({
								delta:2
							})
						}
					} else {
						uni.showToast({
							title: res.info,
							icon: 'none'
						});
						console.log(res.info);
					}
				});
			},
			openWebIM() {
				let userName=store.state.userLogin;
				let userPass=store.state.userPass;
				uni.setStorage({
					key: "myUsername",
					data: userName.toLowerCase()
				});
				uni.setStorage({
					key: "myUserpass",
					data: userPass.toLowerCase()
				});
				console.log(111, {
					apiUrl: WebIM.config.apiURL,
					user: userName.toLowerCase(),
					pwd: userPass.toLowerCase(),
					grant_type: "password",
					appKey: WebIM.config.appkey
				})
				getApp().globalData.conn.open({
					apiUrl: WebIM.config.apiURL,
					user: userName.toLowerCase(),
					pwd: userName.toLowerCase(),
					grant_type: "password",
					appKey: WebIM.config.appkey
				});
			},
		}
	}
</script>

<style>
	@import url("review.css");
</style>
