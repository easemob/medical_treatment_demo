<template>
	<view class="room_bar">
		<chatSuitEmoji ref="chatSuitEmoji" @newEmojiStr="emojiAction"></chatSuitEmoji>
		<chatSuitMain ref="chatSuitMain" :username="username" :chatType="chatType" @inputFocused="closeAllModal"
			@openEmoji="openEmoji" @openRecordModal="toggleRecordModal" @openFunModal="openFunModal"></chatSuitMain>
		<chatSuitImage ref="chatSuitImage" :username="username" :chatType="chatType" @hideSwiper="closeAllModal">
		</chatSuitImage>
		<!-- <chat-suit-location id="chat-suit-location" username="{{ username }}"></chat-suit-location> -->
		<!-- <chat-suit-video ref="chatSuitVideo" :username="username"></chat-suit-video> -->
		<chatSuitPtopcall ref="chatSuitPtopcall" :chatType="chatType" @makeVideoCall="onMakeVideoCall">
		</chatSuitPtopcall>

		<swiper :class="showFunModal" :indicator-dots="true" :autoplay="false" :interval="5000" :duration="1000">
			<swiper-item>
				<view :class="'other_func ' + (isIPX ? 'other_func_X' : '')">
					<view class="open_camera" @tap="openCamera">
						<image src="/static/images/camora.png"></image>
						相机
					</view>
					<view class="send_image" @tap="sendImage">
						<image src="/static/images/pic.png"></image>
						相册
					</view>
					<view class="send_image" @tap="voiceCallAction" v-show="contype == 2">
						<image src="/static/images/icon_voice_call.png"></image>
						语音通话
					</view>
					<view class="send_image" @tap="videoCallAction" v-show="contype == 3">
						<image src="/static/images/icon_video_call.png"></image>
						视频通话
					</view>
					<view class="send_image" @tap="edit_group" v-show="false">
						<image src="/static/images/pic.png"></image>
						群信息
					</view>

					<view class="send_image" @tap="sendVideo" v-show="false">
						<image src="/static/images/video.png" style="height: 20px; width: 20px"></image>
					</view>
					<view class="send_image" bind:tap="sendLocation" v-show="false">
						<image src="../../../static/images/iconLocation2x.png" style="height: 18px" />
					</view>

					<view class="v-record" @tap="callVideo" v-show="false">
						<image src="/static/images/call2x.png" style="height: 24px; width: 15px" />
					</view>
				</view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import store from '../../../store/index.js';
	let WebIM = require("../../../utils/WebIM")["default"];
	let RecordStatus = require("./suit/audio/record_status").RecordStatus;
	let msgType = require("../msgtype");
	import chatSuitEmoji from "./suit/emoji/emoji";
	import chatSuitImage from "./suit/image/image";
	import chatSuitLocation from "./suit/location/location";
	import chatSuitMain from "./suit/main/main";
	import chatSuitPtopcall from "./suit/ptopcall/ptopcall.vue";

	// import chatSuitVideo from "./suit/videoComp/videoComp"

	let FUNMODAL_STATUS = {
		OPENED: "showFunModal",
		CLOSED: "fun_list",
	};

	export default {
		data() {
			return {
				recordStatus: RecordStatus.HIDE,
				RecordStatus,
				__comps__: {
					main: null,
					emoji: null,
					image: null,
					location: null,
					video: null,
				},
				isIPX: "",
				showFunModal: FUNMODAL_STATUS.CLOSED,
			};
		},

		components: {
			chatSuitEmoji,
			chatSuitImage,
			chatSuitLocation,
			chatSuitMain,
			chatSuitPtopcall,
			// chatSuitVideo
		},
		props: {
			username: {
				type: Object,
				default: () => ({}),
			},
			chatType: {
				type: String,
				default: msgType.chatType.SINGLE_CHAT,
			},
			contype: {
				type: String,
				default: '1',
			}
		},

		// lifetimes
		created() {},

		beforeMount() {},

		moved() {},

		destroyed() {},

		onLoad() {
			this.setData({
				isIPX: false, //getApp().globalData.isIPX
			});
			// let comps = this.$data.__comps__;
			// comps.main = this.selectComponent("#chatSuitMain");
			// comps.emoji = this.selectComponent("#chatSuitEmoji");
			// comps.image = this.selectComponent("#chatSuitImage");
		},

		methods: {
			// 事件有长度限制：仅限 26 字符
			toggleRecordModal() {
				this.$emit("tapSendAudio", null, {
					bubbles: true,
					composed: true,
				});
			},

			sendVideo() {
				this.$refs.chatSuitVideo.sendVideo();
			},
			openCamera() {
				this.$refs.chatSuitImage.openCamera();
				this.closeFunModal();
			},

			openEmoji() {
				setTimeout(() => {
					this.setData({
						showFunModal: FUNMODAL_STATUS.CLOSED,
					});
				}, 100);
				this.$refs.chatSuitEmoji.openEmoji();
			},

			cancelEmoji() {
				this.$refs.chatSuitEmoji.cancelEmoji();
			},

			sendImage() {
				this.$refs.chatSuitImage.sendImage();
				this.closeFunModal();
			},

			sendLocation() {
				this.data.__comps__.location.sendLocation();
			},

			emojiAction(evt) {
				this.$refs.chatSuitMain.emojiAction(evt.msg);
			},

			callVideo() {
				this.$refs.chatSuitPtopcall.show();
			},
			voiceCallAction() {
				let encodeToken = encodeURIComponent(store.state.agoraToken);
				console.log(this.username);
				uni.navigateTo({
					url: "../showflex/showflexvideo1?username=" + JSON.stringify(this.username) + "&encodeToken=" +
						JSON.stringify(encodeToken)
				});
				this.inviteVideoAction(1);
				this.closeFunModal();
			},
			videoCallAction() {
				let encodeToken = encodeURIComponent(store.state.agoraToken);
				uni.navigateTo({
					url: "../showflex/showflexvideo?username=" + JSON.stringify(this.username) + "&encodeToken=" +
						JSON.stringify(encodeToken)
				});
				this.inviteVideoAction(2);
				this.closeFunModal();
			},
			onMakeVideoCall() {
				console.log("onMakeVideoCall -> inputbar");
				this.$emit("makeVideoCall", null, "single");
			},

			openFunModal() {
				this.setData({
					showFunModal: FUNMODAL_STATUS.OPENED,
				});
				this.cancelEmoji()
			},
			closeFunModal() {
				this.setData({
					showFunModal: FUNMODAL_STATUS.CLOSED,
				});
				this.cancelEmoji()
			},
			closeAllModal() {
				this.cancelEmoji()
				this.closeFunModal()
			},
			edit_group() {
				var nameList = {
					myName: this.username.myName,
					groupName: this.username.your,
					roomId: this.username.groupId,
				};
				uni.navigateTo({
					url: "../groupSetting/groupSetting?groupInfo=" + JSON.stringify(nameList),
				});
			},
			// 进入邀请视频的方法
			inviteVideoAction(extype) {
				console.log("inviteVideoAction", this.username);
				let uid = WebIM.conn.getUniqueId();
				let msg = new WebIM.message("custom", uid);
				msg.set({
					from: this.username.myName,
					to: this.username.groupId,
					ext: {
						'extmsg': 'inviteVideoAction',
						'extype': extype,//1语音通话,2视频通话
						'inviteCode': 1
					},
					chatType: "chatRoom",
					success(id, serverMsgId) {
						console.log("发送邀请消息成功");
					},
					fail(id, serverMsgId) {
						console.log("发送邀请消息失败了", id);
					},
				});
				WebIM.conn.send(msg.body);
			},
		},
	};
</script>
<style>
	@import "./inputbar.css";
</style>
