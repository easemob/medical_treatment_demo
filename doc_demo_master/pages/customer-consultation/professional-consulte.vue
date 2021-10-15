<template>
	<view>
		<uni-nav-bar :border="false" :fixed="true" :statusBar="true" left-icon="back"
			:title="condetailData.patname + '-' + this.condetailData.mobile" @clickLeft="goBackAction"
			@clickRight="navigationAction">
		</uni-nav-bar>
		<view class="profess-body">
			<view class="chat_tip_view" :class="'chat-tip-color'+condetailData.consulstate"
				:style="'top:'+tipTop+'px;'">
				<text class="chattip-text">{{stateArray[condetailData.consulstate]}}</text>
			</view>
			<view class="profess_section margintop-bar">
				<text class="profess_text">{{appointime}}</text>
			</view>
			<view class="profess-cardbox">
				<view class="profess-preform">
					<text class="preform_title">病情描述</text>
					<view class="preform_row">
						<text class="preform_tips">基本信息</text>
						<text class="preform_text">{{condetailData.patname}}｜女｜3岁｜20kg</text>
					</view>
					<view class="preform_row">
						<text class="preform_tips">肝肾功能</text>
						<text class="preform_text">肝功能正常｜肾功能正常</text>
					</view>
					<view class="preform_row">
						<text class="preform_tips">孕育情况</text>
						<text class="preform_text">无</text>
					</view>
					<view class="preform_row">
						<text class="preform_tips">过敏史</text>
						<text class="preform_text">无</text>
					</view>
					<view class="preform_row">
						<text class="preform_tips">过往病史</text>
						<text class="preform_text">无</text>
					</view>
					<view class="section_line"><text class="text_line"></text></view>
				</view>

				<view class="profess-preform">
					<text class="preform_title">病情描述</text>
					<view class="preform_row">
						<text
							class="postform_text">主诉：至少20个字进行情况描述。请认真描述至少20个字进行情况描述。请认真描述至少20个字进行情况描述。请认真描述至少20个字进行情况描述。请认真描述至少20个字进行情况描述。请认真描述至少20个字进行情况描述。请认真描述至少20个字进行情况描述。请认真描述</text>
					</view>
					<!-- 多图展示 -->
					<view class="postform_picview__files">
						<block v-for="(image,index) in imageList" :key="index">
							<view class="postform_picview">
								<image class="postform_image" :src="image" :data-src="image" @tap="previewImage">
								</image>
							</view>
						</block>
					</view>
					<view class="preform_center-line">
						<view class="center-lineview"></view>
					</view>
					<text class="preform_title">音频问诊预约时间</text>
					<view class="preform_row">
						<text>11月2号，周一，7:00-8:00</text>
					</view>
				</view>
			</view>
			<view class="profess_butview">
				<button class="profess_flex1 profess_left_button" @click="leftButtonAction">退诊</button>
				<button class="profess_flex1 profess_right_button" @click="rightButtonAction">接诊</button>
			</view>
			<view class="profess_noteview" v-show="false">
				<text class="profess_note">温馨提示：
					您已接诊，请在11月2号周一7:00-8:00向患者发起语音问诊。
					如在预约时间结束前，您未于患者语音沟通，患者可要求全额退款。</text>
				<button class="profess_button" @click="openChatRoomDetail"><text
						class="font-md ml-2">设置拨打提醒</text></button>
			</view>
		</view>
	</view>
</template>

<script>
	var statusBarHeight = uni.getSystemInfoSync().statusBarHeight + 44;
	const imageDemo = [require("@/static/icons/icon_default.png"), require("@/static/icons/icon_default.png"),
		require("@/static/icons/icon_default.png")
	];
	export default {
		components: {

		},
		data() {
			return {
				tipTop: statusBarHeight,
				myName: "",
				condetailData: {},
				imageList: [],
				stateArray: ["●\xa0\xa0状态", "●\xa0\xa0等待接诊中，2小时内未接诊将自动退诊", "●\xa0\xa0正在咨询中，此次咨询将在24小时后结束",
					"●\xa0\xa0问诊已结束", "●\xa0\xa0已退诊"
				]
			}
		},
		onLoad(e) {
			this.condetailData = JSON.parse(e.condetailData);
			console.log(this.condetailData);
			this.imageList = imageDemo;
			this.myName = uni.getStorageSync("myUsername"); // 获取当前用户名
			uni.$on('rejudge', (res) => {
				console.log(`收到uni.$emit消息:${res.msg}`)
				this.condetailData.consulstate = 4;
			});
			uni.getSystemInfo({
				success: res => {
					console.log(res);
				},
			});
		},
		onUnload() {
			uni.$off('rejudge')
		},
		methods: {
			goBackAction: function() {
				uni.navigateBack({

				})
			},
			navigationAction: function() {
				uni.showModal({
					title: '温馨提示',
					content: "你确认需要退诊操作",
					success: function(res) {
						if (res.confirm) {
							uni.navigateTo({
								url: "rejudge"
							});
						}
					}
				});
			},
			previewImage: function(e) {
				var current = e.target.dataset.src
				uni.previewImage({
					current: current,
					urls: this.imageList
				})
			},
			previewGuideAction() {
				uni.navigateTo({
					url: '../mine/product-guide'
				});
			},
			leftButtonAction() {
				uni.showModal({
					title: '温馨提示',
					content: "你确认需要退诊操作",
					success: function(res) {
						if (res.confirm) {
							uni.navigateTo({
								url: "rejudge"
							});
						}
					}
				});
			},
			rightButtonAction() {
				var nameList = {
					myName: this.myName,
					your: this.condetailData.mobile,
				};
				let consultype = this.condetailData.consultype;
				if (consultype == 1) {
					uni.navigateTo({
						
					});
				} else if (consultype == 2) {
					uni.navigateTo({
						
					});
				} else if (consultype == 3) {
					uni.navigateTo({
						
					});
				}
			},
			// 进入聊天页面
			openChatRoomDetail() {
				var nameList = {
					myName: this.myName,
					your: this.condetailData.mobile,
				};
				let consultype = this.condetailData.consultype;
			},
		},
		computed: {
			appointime() {
				return this.condetailData.consultime.split(' ')[1];
			}
		},
		onNavigationBarButtonTap(e) {
			uni.showModal({
				title: '温馨提示',
				content: "你确认需要退诊操作",
				success: function(res) {
					if (res.confirm) {
						uni.navigateTo({
							url: "rejudge"
						});
					}
				}
			});
		},
	}
</script>

<style>
	@import url("consultation.css");

	page {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		background-color: #F7F8FA;
		min-height: 100%;
		color: #535568;
		height: auto;
	}

	.profess-body {
		flex-direction: column;
	}

	.chat_tip_view {
		display: flex;
		position: fixed;
		width: 100%;
		height: 72rpx;
		align-items: center;
	}

	.chattip-text {
		margin-left: 50rpx;
		font-size: 24rpx;
	}

	.profess_section {
		display: flex;
		align-items: center;
		flex-direction: column;
		justify-content: center;
		margin: 16rpx 32rpx;
	}

	.preform_center-line {
		display: flex;
		margin: 24rpx 16rpx 16rpx;
		align-items: center;
		justify-content: center;
	}

	.center-lineview {
		margin: 16rpx;
		background-color: #ECEDEF;
		width: 260rpx;
		height: 4rpx;
	}

	.profess_text {
		font-size: 24rpx;
		color: #BFC0C8;
	}

	.profess-cardbox {
		background-color: #FFFFFF;
		border-radius: 8rpx;
		margin: 8rpx 40rpx;
		padding: 8rpx;
	}

	.profess-preform {
		margin: 32rpx 16rpx;
	}

	.preform_title {
		margin: 24rpx 16rpx;
		font-size: 32rpx;
		color: #535568;
		font-weight: bold;
		letter-spacing: 2rpx;
	}

	.preform_row {
		display: flex;
		margin: 8rpx;
		letter-spacing: 2rpx;
	}

	.preform_tips {
		width: 128rpx;
		color: #9FA4AE;
		margin: 4rpx 8rpx;
	}

	.preform_text {
		margin: 4rpx 8rpx;
	}

	.postform_text {
		margin: 4rpx;
		color: #9FA4AE;
	}

	.section_line {
		display: flex;
		justify-content: center;
		margin: 48rpx 32rpx;
	}

	.text_line {
		width: 256rpx;
		height: 4rpx;
		background-color: #F2F2F2;
	}

	.postform_picview__files {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
	}

	.postform_picview {
		margin: 4rpx;
		display: block;
		width: 188rpx;
		height: 120rpx;
	}

	.postform_image {
		margin: 4rpx;
		display: block;
		width: 180rpx;
		height: 120rpx;
	}

	.profess_butview {
		display: flex;
		margin: 32rpx;
		align-items: center;
	}

	.profess_flex1 {
		flex: 1;
	}

	.profess_left_button {
		margin: 32rpx;
		color: #25B4A5;
		border-color: #25B4A5;
		letter-spacing: 8rpx;
		border-style: solid;
	}

	.profess_right_button {
		margin: 32rpx;
		color: #FFFFFF;
		letter-spacing: 8rpx;
		background-image: linear-gradient(90deg, #07C193, #3EAAB4);
	}

	.profess_noteview {
		display: flex;
		background-color: #ECEDF0;
		flex-direction: column;
		justify-content: center;
		margin: 36rpx 32rpx 128rpx;
		border-radius: 8rpx;
		padding: 16rpx;
	}

	.profess_note {
		margin: 8rpx;
		text-align: center;
		font-size: 22rpx;
		color: #6c757d;
	}

	.profess_button {
		width: 92%;
		color: #FFFFFF;
		padding: 0 72rpx;
		margin: 24rpx;
		font-size: 48rpx;
		line-height: 1.8;
		border-width: 0rpx;
		background-image: linear-gradient(90deg, #07C193, #3EAAB4);
	}

	.margintop-bar {
		margin-top: 80rpx;
	}
</style>
