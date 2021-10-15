<template>
	<view>
		<view class="profess-body">
			<view class="chat_tip_view" :class="'chat-tip-color'+condetailData.consultation_status">
				<text class="chattip-text">{{stateArray[condetailData.consultation_status]}}</text>
			</view>
			<view class="profess_section margintop-bar">
				<text class="profess_text">{{showTime}}</text>
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
					<!-- 音视频预约信息 -->
					<view v-if="appoinshow">
						<view class="preform_center-line">
							<view class="center-lineview"></view>
						</view>
						<text class="preform_title">{{typeArray[condetailData.consultation_type]}}问诊预约时间</text>
						<view class="preform_row">
							<text>{{appointime}}</text>
						</view>
					</view>
				</view>
			</view>
			<view class="profess_butview" v-show="condetailData.consultation_status=='1'">
				<button class="profess_flex1 profess_left_button" @click="rejectConsultaion">退诊</button>
				<button class="profess_flex1 profess_right_button" @click="updateConsultaion(2)">接诊</button>
			</view>
			<view class="profess_noteview" v-show="receiveStates">
				<text class="profess_note">温馨提示：
					您已接诊，请在{{appointime}}向患者发起语音问诊。
					如在预约时间结束前，您未于患者语音沟通，患者可要求全额退款。</text>
				<button class="profess_button" @click="reminderAction">设置拨打提醒</button>
				<view class="receiveView" v-show="condetailData.consultation_status=='1'"></view>
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
	import request from '@/common/request.js';
	import AgoraToken from '@/plugins/AgoraToken';
	import store from '@/store/index.js';
	let WebIM = require("../../utils/WebIM")["default"];
	let disp = require("../../utils/broadcast");
	let msgStorage = require("../../components/chat/msgstorage");
	import chatSinglelist from "../../components/chat/msglist/singlelist.vue";
	import chatInputbar from "../../components/chat/inputbar/inputbar";
	import chatSuitAudio from "../../components/chat/inputbar/suit/audio/audio";
	function getToday(type) {
		const date = new Date();
		let month = date.getMonth() + 1;
		let day = date.getDate();
		return `${month}月${day}号`;
	}
	export default {
		components: {
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
				showTime: "10:00",
				condetailData: {},
				appoinshow: false,
				sexname: ["保密", "男", "女"], //0：保密，1：男；2：女
				health: ["异常", "正常"],
				healthy: ["无", "有"],
				typeArray: ["类型", "图文", "音频", "视频"],
				stateArray: ["●\xa0\xa0状态", "●\xa0\xa0等待接诊中，2小时内未接诊将自动退诊", "●\xa0\xa0正在咨询中，此次咨询将在24小时后结束",
					"●\xa0\xa0问诊已结束", "●\xa0\xa0已退诊"
				]
			}
		},
		onLoad(options) {
			let date = new Date();
			let minute = date.getMinutes(); // 分
			minute = minute < 10 ? "0" + minute : minute; // 如果只有一位，则前面补零
			this.showTime = date.getHours() + ":" + minute;
			this.condetailData = JSON.parse(options.condetailData);
			console.log('onLoad',this.condetailData);
			this.myName = uni.getStorageSync("myUsername"); // 获取当前用户名
			let username = {
				myName: this.myName, // 获取当前用户名
				your: this.condetailData.chatroomname,
				groupId: this.condetailData.chatroomid,
				yourName:this.condetailData.patient_realname
			};
			console.log('username', username);
			let joindata = {
				roomId: this.condetailData.chatroomid, // 聊天室id
				message: 'chatroom' // 原因（可选参数）
			}
			WebIM.conn.joinChatRoom(joindata).then((res) => {
				console.log(res)
			})
			this.setData({
				username: username
			});
			uni.username = username;
			console.log('username', this.username);
			uni.setNavigationBarTitle({
				title: this.condetailData.patient_realname
			})
			uni.$once('reminder', (res) => {
				console.log(`收到uni.$emit消息:${res.msg}`);
				if(this.username.groupId==res.groupId){
					this.sendChatRoomMessage('患者你好，我已设置拨打提醒时间为'+getToday()+res.msg+'，请到时留意接听电话，谢谢');
				}
			});
			uni.$once('rejudge', (res) => {
				console.log(`收到uni.$emit消息:${res.msg}`);
				if(this.username.groupId==res.groupId){
					this.updateConsultaion(4);
				}
			});
			uni.$on('cancelInvite', (res) => {
				console.log('cancelInviteDone', res);
				this.cancelInviteAction(res.extype,res.recordtime);
			});
			if (this.condetailData.consultation_type == 2 || this.condetailData.consultation_type == 3) {
				let agoradata = {
					mobile: this.myName,
					channel: this.condetailData.chatroomid
				};
				this.appoinshow = true;
				AgoraToken(agoradata);
			}
		},
		onUnload() {
			uni.$off('cancelInvite')
		},
		computed: {
			receiveStates(){
				return (this.condetailData.consultation_type == 2 || this.condetailData.consultation_type == 3)&&this.condetailData.consultation_status=='2';
			},
			patientAge() {
				let birthArray = this.condetailData.patient_birthday.split('-');
				let birthYear = parseInt(birthArray[0]);
				let currYear = new Date().getFullYear();
				return currYear - birthYear;
			},
			appointime() {
				let appointArray = this.condetailData.patient_appointday.split(' ');
				let dateArray = appointArray[0].split('-');
				let timeArray = appointArray[1].split(':');
				let appmonth = dateArray[1];
				let appdate = dateArray[2];
				let apphour = timeArray[0];
				let apphours = parseInt(apphour) + 1;
				let appDate = new Date(dateArray[0], parseInt(dateArray[1] - 1), dateArray[2]);
				let appWeek = "周" + "日一二三四五六".charAt(appDate.getDay());
				return appmonth + '月' + appdate + '号，' + appWeek + '，' + apphour + ':00-' +
					apphours + ':00';
			}
		},
		methods: {
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
					urls: this.condetailData.consultation_photos
				})
			},
			rejectConsultaion: function() {
				let that=this;
				uni.showModal({
					title: '温馨提示',
					content: "你确认需要退诊操作",
					success: function(res) {
						if (res.confirm) {
							uni.navigateTo({
								url: "rejudge?groupId="+that.username.groupId
							});
						}
					}
				});
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
								title: '接诊成功'
							});
							console.log('接诊成功', this.condetailData);
							that.sendChatRoomMessage('患者你好，我已接诊');
							console.log('接诊成功');
						} else if (restatus == 3) {
							uni.showToast({
								title: '订单完成'
							});
						} else if (restatus == 4) {
							uni.showToast({
								title: '已退诊',
								icon: 'none'
							});
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
			},
			// 设置拨打提醒
			reminderAction() {
				console.log("reminderAction");
				uni.navigateTo({
					url: "picker-view?groupId="+this.username.groupId
				});
			},
			toggleRecordModal() {
				this.$refs.chatSuitAudio.toggleRecordModal();
			},
			normalScroll() {
				if (this.condetailData.consultation_status == '2') {
					this.$refs.chatSinglelist.normalScroll();
					this.$refs.chatInputbar.closeFunModal();
				}
			},
			shortScroll() {
				this.$refs.chatSinglelist.shortScroll();
			},
			saveSendMsg(evt) {
				msgStorage.saveMsg(evt.msg, evt.type);
				this.$refs.chatInputbar.closeFunModal();
			},
			// 取消视频通话
			cancelInviteAction(extype,recordTime) {
				console.log("cancelInviteAction", this.username);
				let uid = WebIM.conn.getUniqueId();
				let msg = new WebIM.message("custom", uid);
				msg.set({
					from: this.username.myName,
					to: this.username.groupId,
					ext: {
						'extmsg': 'inviteVideoAction',
						'extype': extype,//1语音通话,2视频通话
						'recordTime': recordTime,
						'inviteCode': 0
					},
					chatType: "chatRoom",
					success(id, serverMsgId) {
						console.log("取消视频通话成功");
					},
					fail(id, serverMsgId) {
						console.log("取消视频通话失败了", id);
					},
				});
				msg.setChatType("groupchat");
				WebIM.conn.send(msg.body);
				console.log('msg',msg);
				msgStorage.saveMsg(msg, "custom");
			},
		},
		onNavigationBarButtonTap(e) {
			let that = this;
			uni.showModal({
				title: '温馨提示',
				content: "你确认需要结单操作",
				success: function(res) {
					if (res.confirm) {
						that.updateConsultaion(3);
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
		top: 0;
		z-index: 888;
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
		padding: 16rpx;
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
		padding: 8rpx 8rpx 36rpx;
	}

	.profess-preform {
		margin: 16rpx 16rpx;
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
		margin: 32rpx;
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
		margin-top: 4rpx;
		margin-bottom: 16rpx;
		padding-top: 16rpx;
		padding-bottom: 16rpx;
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
		margin: 36rpx 32rpx;
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
		margin: 24rpx;
		letter-spacing: 2rpx;
		background-image: linear-gradient(90deg, #07C193, #3EAAB4);
	}

	.receiveView {
		width: 100%;
		height: 72rpx;
	}

	.margintop-bar {
		margin-top: 80rpx;
	}
</style>
