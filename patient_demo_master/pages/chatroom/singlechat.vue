<template>
	<view class="main">
		<view class="margintop-bar">
			<chatSuitAudio ref="chatSuitAudio" :username="username" chatType="singleChat" @newAudioMsg="saveSendMsg">
			</chatSuitAudio>

			<chatSinglelist ref="chatSinglelist" :username="username" @msglistTap="normalScroll" id="chat-msglist">
			</chatSinglelist>
		</view>
		<chatInputbar ref="chatInputbar" :username="username" chatType="singleChat" @newTextMsg="saveSendMsg"
			@newImageMsg="saveSendMsg" @newLocationMsg="saveSendMsg" @newVideoMsg="saveSendMsg"
			@tapSendAudio="toggleRecordModal" @inputFocused="shortScroll" @inputBlured="normalScroll"></chatInputbar>
		<section-header :condetailItem="condetailData"></section-header>
	</view>
</template>

<script>
	let disp = require("../../utils/broadcast");
	let msgStorage = require("../../components/chat/msgstorage");
	import sectionHeader from '@/components/section-header/section-header.vue';
	import chatSinglelist from "../../components/chat/msglist/singlelist.vue";
	import chatInputbar from "../../components/chat/inputbar/inputbar";
	import chatSuitAudio from "../../components/chat/inputbar/suit/audio/audio";

	export default {
		components: {
			sectionHeader,
			chatSinglelist,
			chatInputbar,
			chatSuitAudio
		},
		data() {
			return {
				username: {
					your: ""
				},
				condetailData: {},
				action: null,
				showEmedia: false,
				showmultiEmedia: false
			};
		},
		// options = 系统传入的 url 参数
		onLoad(options) {
			let username = JSON.parse(options.username);
			this.condetailData = JSON.parse(options.condetailData);
			this.setData({
				username: username
			});
			console.log(options.username);
			// 生成的支付宝小程序在onLoad里获取不到，这里放到全局变量下
			uni.username = username;
			uni.setNavigationBarTitle({
				title: username.your
			});
		},

		onUnload() {
			disp.fire("em.chatroom.leave");
		},

		onPullDownRefresh: function() {
			uni.showNavigationBarLoading();
			this.$refs.chatSinglelist.getHistoryMsg();
			// 停止下拉动作
			uni.hideNavigationBarLoading();
			uni.stopPullDownRefresh();
		},
		methods: {
			toggleRecordModal() {
				this.$refs.chatSuitAudio.toggleRecordModal();
			},
			normalScroll() {
				this.$refs.chatSinglelist.normalScroll();
				this.$refs.chatInputbar.cancelEmoji();
				this.$refs.chatInputbar.closeFunModal();
			},
			shortScroll() {
				this.$refs.chatSinglelist.shortScroll();
			},
			saveSendMsg(evt) {
				msgStorage.saveMsg(evt.msg, evt.type);
				this.$refs.chatInputbar.cancelEmoji();
				this.$refs.chatInputbar.closeFunModal()
			}
		}
	};
</script>
<style>
	page {
		background-color: #FAFAFA;
		height: 100%;
		width: 100%;
		height: 100%;
	}

	.margintop-bar {
		margin-top: 148rpx;
	}
</style>
