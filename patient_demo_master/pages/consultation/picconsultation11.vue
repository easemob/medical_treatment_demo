<template>
	<view>
		<view class="uni-flex">
			<text class="piccon_section">已预约以下时间</text>
		</view>
		<view class="uni-flex justify-around">
			<view class="piccon_flex">
				<text class="piccon_header">{{appmonth}}月{{appdate}}日，{{appWeek}}，{{apphour}}:00-{{parseInt(apphour)+1}}:00</text>
				<text class="piccon_second">医生会在该时间段联系你，请保持手机畅通</text>
			</view>
			<text class="piccon_right">重新预约</text>
		</view>
		<view class="uni-flex mt-20">
			<text class="piccon_title">病情描述</text>
		</view>
		<textarea v-model="consultationTitle" placeholder="请详细描述您的疾病或症状、是否用药、曾经做过的检查、治疗情况，以及想获得医生的帮助；

为了医生更准确诊断您的问题，请尽可能详细描述预约问题，如有检查报告等尽量上传（不少于20字）" class="piccon_textarea" />
		<view class="uni-flex flex-column text-left mt-48">
			<text class="piccon_title">图片资料 (非必填)</text>
			<text class="piccon_text">上传能展示病情的患处照片、检查资料、医院就诊病历记录等上传的内容仅对医生可见</text>
		</view>
		<!-- 多图上传 -->
		<view class="uni-uploader-body m-24">
			<view class="uni-uploader__files">
				<block v-for="(image,index) in imageList" :key="index">
					<view class="uni-uploader__file">
						<image class="uni-uploader__img" :src="image" :data-src="image" @tap="previewImage"></image>
					</view>
				</block>
				<view class="uni-uploader__input-box">
					<view class="uni-uploader__input" @tap="chooseImage"></view>
				</view>
			</view>
		</view>
		<view class="uni-flex">
			<button type="primary" class="piccon_button" @click="piconextAction11"><text
					class="font-md ml-2">下一步</text></button>
		</view>
	</view>
</template>

<script>
	import request from '@/common/request.js';
	import qiniuUploader from '@/common/qiniuUploader.js';
	import permision from "@/common/permission.js"
	var sourceType = [
		['camera'],
		['album'],
		['camera', 'album']
	]
	var sizeType = [
		['compressed'],
		['original'],
		['compressed', 'original']
	]
	export default {
		data() {
			return {
				detailData: {},
				ctype: 2,
				appmonth: '',
				appdate: '',
				apphour: '',
				appWeek:'',
				userData: {},
				consultationTitle: "",
				appointDate: "",
				imageList: [],
				sourceTypeIndex: 2,
				sourceType: ['拍照', '相册', '拍照或相册'],
				sizeTypeIndex: 2,
				sizeType: ['压缩', '原图', '压缩或原图'],
				countIndex: 2,
				count: [1, 2, 3],
				showBack: false,
				qiniuArray: []
			}
		},
		onLoad(options) {
			// 初始化
			console.log('onLoad', options);
			this.detailData = JSON.parse(options.detailData);
			this.ctype = options.ctype;
			this.appointDate = options.appointDate;
			let appointArray=this.appointDate.split(' ');
			let dateArray=appointArray[0].split('-');
			let timeArray=appointArray[1].split(':');
			this.appmonth=dateArray[1];
			this.appdate=dateArray[2];
			this.apphour=timeArray[0];
			this.apphours=parseInt(this.apphour)+1;
			let appDate = new Date(dateArray[0], parseInt(dateArray[1] - 1), dateArray[2]);
			this.appWeek = "周" + "日一二三四五六".charAt(appDate.getDay());
			uni.getStorage({
				key: "user-info",
				success: (res) => {
					if (res.data) {
						this.userData = JSON.parse(res.data);
					}
				}
			});
		},
		onUnload() {
			this.imageList = [],
				this.sourceTypeIndex = 2,
				this.sourceType = ['拍照', '相册', '拍照或相册'],
				this.sizeTypeIndex = 2,
				this.sizeType = ['压缩', '原图', '压缩或原图'],
				this.countIndex = 2;
		},
		methods: {
			chooseImage: async function() {
				// #ifdef APP-PLUS
				// TODO 选择相机或相册时 需要弹出actionsheet，目前无法获得是相机还是相册，在失败回调中处理
				if (this.sourceTypeIndex !== 2) {
					let status = await this.checkPermission();
					if (status !== 1) {
						return;
					}
				}
				// #endif

				if (this.imageList.length === 3) {
					let isContinue = await this.isFullImg();
					console.log("是否继续?", isContinue);
					if (!isContinue) {
						return;
					}
				}
				uni.chooseImage({
					sourceType: sourceType[this.sourceTypeIndex],
					sizeType: sizeType[this.sizeTypeIndex],
					count: this.imageList.length + this.count[this.countIndex] > 3 ? 3 - this.imageList
						.length : this.count[this.countIndex],
					success: (res) => {
						this.imageList = this.imageList.concat(res.tempFilePaths);
					},
					fail: (err) => {
						// #ifdef APP-PLUS
						if (err['code'] && err.code !== 0 && this.sourceTypeIndex === 2) {
							this.checkPermission(err.code);
						}
						// #endif
						// #ifdef MP
						uni.getSetting({
							success: (res) => {
								let authStatus = false;
								switch (this.sourceTypeIndex) {
									case 0:
										authStatus = res.authSetting['scope.camera'];
										break;
									case 1:
										authStatus = res.authSetting['scope.album'];
										break;
									case 2:
										authStatus = res.authSetting['scope.album'] && res
											.authSetting['scope.camera'];
										break;
									default:
										break;
								}
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
			isFullImg: function() {
				return new Promise((res) => {
					uni.showModal({
						content: "已经有3张图片了,是否清空现有图片？",
						success: (e) => {
							if (e.confirm) {
								this.imageList = [];
								res(true);
							} else {
								res(false)
							}
						},
						fail: () => {
							res(false)
						}
					})
				})
			},
			previewImage: function(e) {
				var current = e.target.dataset.src
				uni.previewImage({
					current: current,
					urls: this.imageList
				})
			},
			async checkPermission(code) {
				let type = code ? code - 1 : this.sourceTypeIndex;
				let status = permision.isIOS ? await permision.requestIOS(sourceType[type][0]) :
					await permision.requestAndroid(type === 0 ? 'android.permission.CAMERA' :
						'android.permission.READ_EXTERNAL_STORAGE');

				if (status === null || status === 1) {
					status = 1;
				} else {
					uni.showModal({
						content: "没有开启权限",
						confirmText: "设置",
						success: function(res) {
							if (res.confirm) {
								permision.gotoAppSetting();
							}
						}
					})
				}

				return status;
			},
			piconextAction11() {
				console.log("piconextAction11");
				let that = this;
				this.qiniuArray = new Array;
				if (this.consultationTitle && this.consultationTitle.length > 20) {
					console.log("piconextAction");
					if (this.imageList && this.imageList.length > 0) {
						request.get('/index/get_QiniuAuthJSON').then(getData => {
							if (getData.code == 101) {
								let uploadToken = getData.referer;
								console.log(uploadToken);
								for (let i = 0; i < that.imageList.length; i++) {
									let imagePath = that.imageList[i];
									console.log(imagePath);
									that.uploaderImagePath(imagePath, uploadToken);
								}
							} else {
								uni.showToast({
									title: '上传图片出错，请稍后再试..',
									icon: 'none'
								})
							}
						});

					} else {
						this.navigatePicconsultation();
					}
				} else {
					uni.showToast({
						title: "病情描述20字",
						image: "../../static/icons/icon_gantan.png"
					})
				}
			},
			uploaderImagePath: function(imagePath, uploadToken) {
				// 交给七牛上传
				let updateUrl = 'images/2021-07/' + new Date().getTime();
				qiniuUploader.upload(imagePath, (qiniuData) => {
					console.log(qiniuData.imageURL);
					this.qiniuArray.push(qiniuData.imageURL);
					if (this.qiniuArray.length == this.imageList.length) {
						this.navigatePicconsultation();
					}
				}, (error) => {
					console.log(error);
				}, {
					region: 'SCN', //地区
					domain: 'http://qiniu.500-china.com', // bucket 域名，下载资源时用到。
					key: updateUrl, //七牛文件名
					uptoken: uploadToken, // 由其他程序生成七牛 uptoken
					uptokenURL: 'UpTokenURL.com/uptoken' // 上传地址
				}, (prores) => {
					// console.log(prores);
				});
			},
			navigatePicconsultation: function() {
				let that=this;
				let postData = {
					docid: this.detailData.uid,
					userid: this.userData.id,
					username: this.userData.user_nicename,
					useravatar: this.userData.avatar,
					contitle: this.consultationTitle,
					ctype: this.ctype
				}
				if (this.qiniuArray && this.qiniuArray.length > 0) {
					postData['photos_url'] = JSON.stringify(this.qiniuArray);
				}
				console.log(postData);
				request.post('/user/consultation/postNewConsultationsJson', postData).then(res => {
					if (res.code == 101) {
						let conID = res.referer;
						console.log(res);
						uni.navigateTo({
							url: 'picconsultation02?conid=' + conID + '&appointDate=' + this
								.appointDate
						});
					} else {
						console.log(res.info);
						uni.showModal({
							title: '温馨提示',
							content: res.info,
							showCancel: false
						})
					}
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
		background-color: #FFFFFF;
		min-height: 100%;
		height: auto;
	}

	.piccon_section {
		margin: 24rpx 32rpx;
		font-size: 24rpx;
		color: #BFC0C8;
		letter-spacing: 2rpx;
		font-family: "SimHei";
	}

	.piccon_flex {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-start;
	}

	.piccon_header {
		margin: 4rpx;
		font-size: 32rpx;
		color: #535568;
		line-height: 40rpx;
	}

	.piccon_second {
		margin: 4rpx;
		font-size: 24rpx;
		color: #BFC0C8;
	}

	.piccon_right {
		margin: 16rpx;
		font-size: 32rpx;
		color: #BFC0C8;
	}

	.piccon_title {
		margin: 24rpx 32rpx;
		font-size: 32rpx;
		color: #535568;
		font-weight: bold;
		letter-spacing: 2rpx;
		font-family: "SimHei";
	}

	.piccon_text {
		margin: 24rpx 32rpx;
		font-size: 28rpx;
		color: #9FA4AE;
	}

	.piccon_textarea {
		width: 88%;
		text-align: left;
		margin: 4rpx 3%;
		padding: 3%;
		background-color: #F7F8FA;
		font-size: 28rpx !important;
	}

	.piccon_button {
		width: 92%;
		padding: 0 72rpx;
		margin: 64rpx 32rpx;
		font-size: 48rpx;
		line-height: 1.8;
		border-radius: 8rpx;
		border-width: 0rpx;
		background-image: linear-gradient(90deg, #07C193, #3EAAB4);
	}
</style>
