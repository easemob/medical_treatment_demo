<template>
	<view class="page">
		<view class="flex align-center">
			<uni-list class="text-left m-2" :border="false">
				<uni-list-item leftText="头像">
					<template slot="footer">
						<image class="avatar-image" :src="avatarPath" mode="aspectFill">
						</image>
					</template>
				</uni-list-item>
				<uni-list-item title="昵称" :rightText="userData.user_nicename" rightColor="black" showArrow clickable
					@click="nicenameAction">

				</uni-list-item>
				<uni-list-item title="性别" :rightText="sexname[userData.sex]" rightColor="black" showArrow clickable
					@click="sheetSexAction">

				</uni-list-item>
				<view class="uni-list-cell border-top hei-88">
					<view class="uni-list-cell-left">
						<text class="text-dark">生日</text>
					</view>
					<view class="uni-list-cell-db text-right">
						<picker mode="multiSelector" :value="multiIndex" :range="multiArray" @change="bindPickerChange">
							<view class="uni-input text-dark">
								{{this.userData.birthday}}
							</view>
						</picker>
					</view>
				</view>
			</uni-list>
		</view>
		<view class="fixed-bottom m-32">
			<button class="bg-main text-white" style="border-radius: 50rpx;border: 0;" type="primary"
				@tap="saveDataAction()">保存资料</button>
		</view>
		<uni-popup id="dialogInput" ref="dialogInput" type="dialog" @change="change">
			<uni-popup-dialog mode="input" title="昵称" :value="userData.user_nicename" placeholder="请输入内容"
				@confirm="dialogInputConfirm"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	import request from '@/common/request.js';
	import qiniuUploader from '@/common/qiniuUploader.js';
	export default {
		data() {
			const date = new Date()
			const years = []
			const year = date.getFullYear()
			const months = []
			const month = date.getMonth() + 1
			const days = []
			const day = date.getDate()

			for (let i = date.getFullYear(); i >= 1970; i--) {
				years.push(i)
			}

			for (let i = 1; i <= 12; i++) {
				months.push((i < 10) ? '0' + i : i)
			}

			for (let i = 1; i <= 31; i++) {
				days.push((i < 10) ? '0' + i : i)
			}
			return {
				years,
				year,
				months,
				month,
				days,
				day,
				userData: {},
				sexname: ["保密", "男", "女"],
				multiArray: [years, months, days],
				multiIndex: [21, 0, 0],
				avatarPath: ''
			}
		},
		onLoad() {
			uni.getStorage({
				key: "user-info",
				success: (res) => {
					if (res.data) {
						console.log(res);
						this.userData = JSON.parse(res.data);
						this.avatarPath = this.userData.avatar;
					}
				}
			});
			console.log(this.multiArray);
		},
		methods: {
			nicenameAction() {
				this.$refs.dialogInput.open();
			},
			change(e) {
				console.log('popup ' + e.type + ' 状态', e.show)
			},
			/**
			 * 输入对话框的确定事件
			 */
			dialogInputConfirm(done, val) {
				if (val.length > 2) {
					this.userData.user_nicename = val;
					done();
				} else {
					uni.showToast({
						title: "昵称长度至少2位",
						icon: "none"
					})
				}

			},
			chooseAvatar() {
				let that = this;
				uni.chooseImage({
					count: 1,
					sourceType: ['album', 'camera'],
					sizeType: ['compressed', 'original'],
					success: (imageres) => {
						that.avatarPath = imageres.tempFilePaths[0];
						let imgPath = imageres.tempFilePaths[0];
						return new Promise((prores) => {
							var localPath = plus.io.convertAbsoluteFileSystem(imgPath.replace(
								'file://', ''));
							console.log('after' + localPath);
							// 压缩size
							plus.io.resolveLocalFileSystemURL(localPath, (entry) => {
								entry.file((file) => { // 可通过entry对象操作图片 
									console.log('getFile:' + JSON.stringify(file));
									if (file.size > 20480) { // 压缩后size 大于20Kb
										plus.zip.compressImage({
											src: imgPath,
											dst: imgPath.replace('.jpg',
												'compress.jpg').replace(
												'.JPG', 'compress.JPG'),
											width: '20%',
											height: '20%',
											quality: 1,
											overwrite: true
										}, (event) => {
											console.log('success zip****' +
												event.size);
											let newPath = imgPath.replace(
													'.jpg', 'compress.jpg')
												.replace('.JPG',
													'compress.JPG');
											that.uploaderImagePath(newPath);
										}, function(error) {
											uni.showModal({
												content: '头像图片太大,需要请重新选择图片!',
												showCancel: false
											})
										});
									} else {
										that.uploaderImagePath(imgPath);
									}
								});
							}, (e) => {
								console.log('Resolve file URL failed: ' + e.message);
								uni.showModal({
									content: '头像图片太大,需要请重新选择图片!',
									showCancel: false
								})
							});
						})
					},
					fail: (err) => {
						// #ifdef MP
						uni.getSetting({
							success: (res) => {
								let authStatus = res.authSetting['scope.album'] && res.authSetting[
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
			sheetSexAction() {
				uni.showActionSheet({
					title: '性别',
					itemList: ['保密', '男', '女'],
					success: (e) => {
						console.log(e.tapIndex);
						this.userData.sex = e.tapIndex;
					}
				})
			},
			uploaderImagePath: function(imagePath) {
				request.get('/index/get_QiniuAuthJSON').then(getData => {
					if (getData.code == 101) {
						console.log("getData", getData);
						let uploadToken = getData.referer;
						console.log(uploadToken);
						let updateUrl = 'images/2021-07/' + new Date().getTime();
						console.log(updateUrl);
						// 交给七牛上传
						console.log("imagePath", imagePath);
						qiniuUploader.upload(imagePath, (qiniuData) => {
							console.log(qiniuData.imageURL);
							that.userData.avatar = qiniuData.imageURL;
						}, (error) => {
							console.log(error);
						}, {
							region: 'SCN', //地区
							domain: 'http://qiniu.500-china.com', // bucket 域名，下载资源时用到。
							key: updateUrl, //七牛文件名
							uptoken: uploadToken, // 由其他程序生成七牛 uptoken
							uptokenURL: 'UpTokenURL.com/uptoken' // 上传地址
						}, (prores) => {
							console.log(prores);
						});
					}
				});
			},
			bindPickerChange: function(e) {
				this.multiIndex = e.detail.value;
				this.userData.birthday = this.years[this.multiIndex[0]] + '-' + this.months[this.multiIndex[1]] + '-' +
					this
					.days[this.multiIndex[2]];
				console.log('picker发送选择改变，携带值为：' + e.detail.value)
			},
			saveDataAction: function() {
				request.post('/user/index/saveProfileJson', this.userData).then(res => {
					this.apiCode = res.code
					if (this.apiCode == 101) {
						uni.setStorage({
							key: 'user-info',
							data: JSON.stringify(this.userData)
						});
						uni.navigateBack();
						uni.showToast({
							title: '资料更新成功',
						})
					} else {
						uni.showToast({
							title:res.info,
							icon:'none'
						});
						console.log(res.info);
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
		background-color: #ffffff;
		min-height: 100%;
		height: auto;
	}

	.avatar-image {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		width: 96rpx;
		height: 96rpx;
		border-radius: 48rpx;
	}
</style>
