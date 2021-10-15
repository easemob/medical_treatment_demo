<template>
	<view>
		<view class="profess-body">
			<section-header :condetailItem="condetailData"></section-header>
			<view class="profess_section margintop-bar">
				<text class="profess_text">17:30</text>
			</view>
			<view class="profess-cardbox">
				<view class="profess-preform">
					<text class="preform_title">病情描述</text>
					<view class="preform_row">
						<text class="preform_tips">基本信息</text>
						<text
							class="preform_text">{{condetailData.patient_realname}}｜{{sexname[condetailData.patient_sex]}}｜{{patientAge}}岁｜{{condetailData.patient_weight}}kg</text>
					</view>
					<view class="preform_row">
						<text class="preform_tips">肝肾功能</text>
						<text
							class="preform_text">肝功能{{health[condetailData.patient_liver]}}｜肾功能{{health[condetailData.patient_kidney]}}</text>
					</view>
					<view class="preform_row">
						<text class="preform_tips">孕育情况</text>
						<text class="preform_text">无</text>
					</view>
					<view class="preform_row">
						<text class="preform_tips">过敏史</text>
						<text class="preform_text">{{healthy[condetailData.patient_allergic]}}</text>
					</view>
					<view class="preform_row">
						<text class="preform_tips">过往病史</text>
						<text class="preform_text">{{healthy[condetailData.patient_fall]}}</text>
					</view>
					<view class="section_line"><text class="text_line"></text></view>
				</view>

				<view class="profess-preform">
					<text class="preform_title">病情描述</text>
					<view class="preform_row">
						<text class="postform_text">主诉：{{condetailData.consultation_title}}</text>
					</view>
					<!-- 多图展示 -->
					<view class="postform_picview__files">
						<block v-for="(image,index) in condetailData.consultation_photos" :key="index">
							<view class="postform_picview">
								<image class="postform_image" :src="image" :data-src="image" @tap="previewImage"
									mode="aspectFill">
								</image>
							</view>
						</block>
					</view>
				</view>
			</view>
			<view class="profess_section" v-show="condetailData.consultation_status=='1'">
				<text class="profess_note">医生已收到您的提问，预计2小时内回复，您可以查看咨询指南了解问诊注意事项。了解问诊指南。</text>
			</view>
			<view class="uni-flex">
				<button type="primary" class="profess_button" @click="previewGuideAction"
					v-show="condetailData.consultation_status=='1'"><text class="font-md">查看问诊指南</text></button>
				<button type="primary" class="profess_button" @click="updateConsultaion(2)"
					v-show="condetailData.consultation_status=='3'"><text class="font-md">继续提问</text></button>
			</view>
			<view v-show="condetailData.consultation_status!=='1'">
				<chatSuitAudio ref="chatSuitAudio" :username="username" chatType="chatRoom" @newAudioMsg="saveSendMsg">
				</chatSuitAudio>
				<chatSinglelist ref="chatSinglelist" :username="username" @msglistTap="normalScroll" id="chat-msglist">
				</chatSinglelist>
			</view>
		</view>
		<chatInputbar ref="chatInputbar" :username="username" chatType="chatRoom" @newTextMsg="saveSendMsg"
			@newImageMsg="saveSendMsg" @newLocationMsg="saveSendMsg" @newVideoMsg="saveSendMsg"
			@tapSendAudio="toggleRecordModal" @inputFocused="shortScroll" @inputBlured="normalScroll"
			v-show="condetailData.consultation_status=='2'" :contype="condetailData.consultation_type"></chatInputbar>
	</view>
</template>

<script>
	import AgoraToken from '@/plugins/AgoraToken';
	import store from '@/store/index.js';
	let WebIM = require("../../utils/WebIM")["default"];
	let disp = require("../../utils/broadcast");
	let msgStorage = require("../../components/chat/msgstorage");
	import chatSinglelist from "../../components/chat/msglist/singlelist.vue";
	import chatInputbar from "../../components/chat/inputbar/inputbar";
	import chatSuitAudio from "../../components/chat/inputbar/suit/audio/audio";
	import sectionHeader from '@/components/section-header/section-header.vue';
	export default {
		components: {
			sectionHeader,
			chatSinglelist,
			chatInputbar,
			chatSuitAudio
		},
		data() {
			return {
				myName: "",
				username: {
					your: ""
				},
				condetailData: {},
				sexname: ["保密", "男", "女"], //0：保密，1：男；2：女
				health: ["异常", "正常"],
				healthy: ["无", "有"]
			}
		},
		onLoad(options) {
			this.condetailData = JSON.parse(options.condetailData);
			console.log(this.condetailData);
			this.myName = uni.getStorageSync("myUsername"); // 获取当前用户名
			let username = {
				myName: this.myName, // 获取当前用户名
				your: this.condetailData.chatroomname,
				groupId: this.condetailData.chatroomid
			};
			this.setData({
				username: username
			});
			uni.username = username;
			console.log('username', this.username);
			uni.setNavigationBarTitle({
				title: this.condetailData.docname
			});
		},
		methods: {
			previewImage: function(e) {
				var current = e.target.dataset.src
				uni.previewImage({
					current: current,
					urls: this.condetailData.consultation_photos
				})
			},
			previewGuideAction() {
				uni.navigateTo({
					url: '../mine/product-guide'
				});
			},
			toggleRecordModal() {
				this.$refs.chatSuitAudio.toggleRecordModal();
			},
			normalScroll() {
				this.$refs.chatSinglelist.normalScroll();
				this.$refs.chatInputbar.closeFunModal();
			},
			shortScroll() {
				this.$refs.chatSinglelist.shortScroll();
			},
			saveSendMsg(evt) {
				msgStorage.saveMsg(evt.msg, evt.type);
				this.$refs.chatInputbar.closeFunModal();
			},
			updateConsultaion: function(restatus) {
				let that = this;
				let postdata = {
					conid: this.condetailData.id,
					restatus: restatus
				};
				request.post('/user/consultation/updateConsultationStatus', postdata).then(res => {
					this.apiCode = res.code
					if (this.apiCode == 101) {
						if (restatus == 2) {
							uni.showToast({
								title: '问诊继续提问'
							});
							that.sendChatRoomMessage('医生你好，我需要继续提问');
						} 
						this.condetailData.consultation_status = restatus;
					} else {
						uni.showToast({
							title: res.info,
							icon: 'none'
						});
					}
				});
			},
			sendChatRoomMessage: function(sendMessage) {
				let id = WebIM.conn.getUniqueId();
				let msg = new WebIM.message("txt", id);
				console.log(id, sendMessage);
				msg.set({
					msg: sendMessage,
					from: this.username.myName,
					to: this.username.groupId,
					chatType: "chatRoom",
					success(id, serverMsgId) {
						console.log("成功了", id);
						disp.fire("em.chat.sendSuccess", id, sendMessage);
					},
					fail(id, serverMsgId) {
						console.log("失败了", id);
					},
				});
				console.log("groupchat");
				msg.setChatType("groupchat");
				WebIM.conn.send(msg.body);
				msgStorage.saveMsg(msg, "txt");
			}
		},
		computed: {
			patientAge() {
				let birthArray = this.condetailData.patient_birthday.split('-');
				let birthYear = parseInt(birthArray[0]);
				let currYear = new Date().getFullYear();
				return currYear - birthYear;
			}
		}
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

	.profess_section {
		display: flex;
		justify-content: center;
		margin: 16rpx 32rpx;
	}

	.profess_text {
		font-size: 24rpx;
		color: #BFC0C8;
	}

	.profess-cardbox {
		background-color: #FFFFFF;
		border-radius: 8rpx;
		margin: 8rpx 48rpx;
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
		margin: 4rpx 4rpx 16rpx;
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
		height: 140rpx;
	}

	.profess_note {
		margin-left: 16rpx;
		margin-right: 16rpx;
		text-align: center;
		font-size: 24rpx;
		color: #BFC0C8;
		background-color: #ECEDF0;
		border-radius: 8rpx;
		padding: 16rpx;
	}

	.profess_button {
		width: 92%;
		padding: 0 72rpx;
		margin: 64rpx 32rpx;
		font-size: 48rpx;
		line-height: 1.8;
		border-radius: 8rpx;
		border-width: 0rpx;
		background-image: linear-gradient(90deg, #07C193, #3EAAB4);
	}

	.margintop-bar {
		margin-top: 148rpx;
	}
</style>
