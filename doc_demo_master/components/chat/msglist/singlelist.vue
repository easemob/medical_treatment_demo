<template>
	<view scroll-y="true" :class="view + ' wrap ' + (isIPX?'scroll_view_X': '')" @tap="onTap" upper-threshold="-50"
		:scroll-into-view="toView">
		<view class="message" v-for="(item,index) in chatMsg" :key="index" :id="item.mid">
			<view class="main" :class="item.style">
				<view class="user">
					<!-- yourname：就是消息的 from -->
					<text class="user-text">{{item.time}}</text>
				</view>
				<image class="avatar" :src="'/static/icons/icon_marshalling'+item.style+'.png'" />
				<view class="single">
					<image class="err" :class="(item.style == 'self' && item.isFail) ?  'show' : 'hide'"
						src="/static/images/msgerr.png" />
					<view v-if="item.msg.type == 'img' || item.msg.type == 'video'">
						<image v-if="item.msg.type == 'img'" class="avatar" :src="item.msg.data"
							style="width:90px; height:120px; margin:2px auto;" mode="aspectFit" @tap="previewImage"
							:data-url="item.msg.data" />
					</view>
					<audio-msg v-if="item.msg.type == 'audio'" :msg="item"></audio-msg>
					<custom-msg v-if="item.msg.type == 'custom'" :msg="item"></custom-msg>
					<view v-else-if="item.msg.type == 'txt' || item.msg.type == 'emoji'">
						<view class="template" v-for="(d_item, d_index) in item.msg.data" :key="d_index">
							<text :data-msg="item" @tap="clickMsg" v-if="d_item.type == 'txt'" class="msg-text"
								style="float:left;" selectable="true">{{ d_item.data }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>


<script>
	let msgStorage = require("../msgstorage");
	let disp = require("../../../utils/broadcast");
	let LIST_STATUS = {
		SHORT: "scroll_view_change",
		NORMAL: "scroll_view"
	};
	let page = 0;
	let Index = 0;
	let curMsgMid = '';
	let isFail = false;
	import audioMsg from "./type/audio/audio";
	import customMsg from "./type/custom/custom";

	export default {
		data() {
			return {
				view: LIST_STATUS.NORMAL,
				toView: "",
				chatMsg: [],
				__visibility__: false,
				isIPX: false
			};
		},

		components: {
			audioMsg,
			customMsg
		},
		props: {
			username: {
				type: Object,
				default: () => ({})
			}
		},

		// lifetimes
		created() {},

		beforeMount() {
			this.__visibility__ = true;
			page = 0;
			Index = 0;
		},

		moved() {},

		destroyed() {
			this.__visibility__ = false;
			msgStorage.off("newChatMsg", this.dispMsg)
		},

		mounted(event) {
			let me = this;
			if (getApp().globalData.isIPX) {
				this.setData({
					isIPX: true
				});
			}
			this.username = uni.username;
			let username = this.username;
			let myUsername = uni.getStorageSync("myUsername");
			let sessionKey = username.groupId ? username.groupId + myUsername : username.your + myUsername;
			let chatMsg = uni.getStorageSync(sessionKey) || [];
			this.renderMsg(null, null, chatMsg, sessionKey);
			uni.setStorageSync(sessionKey, null);
			disp.on('em.error.sendMsgErr', function(err) {
				// curMsgMid = err.data.mid;
				isFail = true;
				// return;
				console.log('发送失败了');
				return;
				let msgList = me.chatMsg;
				msgList.map(item => {
					if (item.mid.substring(item.mid.length - 10) == curMsgMid.substring(curMsgMid.length -
							10)) {
						item.msg.data[0].isFail = true;
						item.isFail = true;
						me.setData({
							chatMsg: msgList
						});
					}
				});
				// if (me.curChatMsg[0].mid == curMsgMid) {
				//   me.curChatMsg[0].msg.data[0].isShow = false;
				//   me.curChatMsg[0].isShow = false;
				// }

				uni.setStorageSync("rendered_" + sessionKey, msgList);
			});
			msgStorage.on("newChatMsg", this.dispMsg);
		},

		methods: {
			normalScroll() {
				this.setData({
					view: LIST_STATUS.NORMAL
				});
			},
			dispMsg(renderableMsg, type, curChatMsg, sesskey) {
				let me = this;
				let username = this.username;
				let myUsername = uni.getStorageSync("myUsername");
				let sessionKey = username.groupId ? username.groupId + myUsername : username.your + myUsername;
				me.curChatMsg = curChatMsg;

				if (!me.__visibility__) return; // 判断是否属于当前会话

				if (username.groupId) {
					// 群消息的 to 是 id，from 是 name
					if (renderableMsg.info.from == username.groupId || renderableMsg.info.to == username.groupId) {
						if (sesskey == sessionKey) {
							me.renderMsg(renderableMsg, type, curChatMsg, sessionKey, 'newMsg');
						}
					}
				} else if (renderableMsg.info.from == username.your || renderableMsg.info.to == username.your) {
					if (sesskey == sessionKey) {
						me.renderMsg(renderableMsg, type, curChatMsg, sessionKey, 'newMsg');
					}
				}
			},
			shortScroll() {
				this.setData({
					view: LIST_STATUS.SHORT
				});
			},

			onTap() {
				this.$emit("msglistTap", null, {
					bubbles: true
				});
			},

			previewImage(event) {
				var url = event.target.dataset.url;
				uni.previewImage({
					urls: [url] // 需要预览的图片 http 链接列表

				});
			},

			getHistoryMsg() {
				let me = this;
				let username = this.username;
				let myUsername = uni.getStorageSync("myUsername");
				let sessionKey = username.groupId ? username.groupId + myUsername : username.your + myUsername;
				let historyChatMsgs = uni.getStorageSync("rendered_" + sessionKey) || [];

				if (Index < historyChatMsgs.length) {
					let timesMsgList = historyChatMsgs.slice(-Index - 10, -Index);
					this.setData({
						chatMsg: timesMsgList.concat(me.chatMsg),
						toView: timesMsgList[timesMsgList.length - 1].mid
					});
					Index += timesMsgList.length;

					if (timesMsgList.length == 10) {
						page++;
					}

					uni.stopPullDownRefresh();
				}
			},

			renderMsg(renderableMsg, type, curChatMsg, sessionKey, isnew) {
				let me = this;

				var historyChatMsgs = uni.getStorageSync("rendered_" + sessionKey) || [];
				// console.log("打印历史聊天记录:",historyChatMsgs);
				historyChatMsgs = historyChatMsgs.concat(curChatMsg);

				if (!historyChatMsgs.length) return;

				if (isnew == 'newMsg') {
					this.setData({
						chatMsg: this.chatMsg.concat(curChatMsg),
						// 跳到最后一条
						toView: historyChatMsgs[historyChatMsgs.length - 1].mid
					});
				} else {
					this.setData({
						chatMsg: historyChatMsgs.slice(-10),
						// 跳到最后一条
						toView: historyChatMsgs[historyChatMsgs.length - 1].mid
					});
				}

				uni.setStorageSync("rendered_" + sessionKey, historyChatMsgs);
				let chatMsg = uni.getStorageSync(sessionKey) || [];
				chatMsg.map(function(item, index) {
					curChatMsg.map(function(item2, index2) {
						if (item2.mid == item.mid) {
							chatMsg.splice(index, 1);
						}
					});
				});
				uni.setStorageSync(sessionKey, chatMsg);
				Index = historyChatMsgs.slice(-10).length;
				// setTimeout 兼容支付宝小程序
				setTimeout(() => {
					uni.pageScrollTo({
						scrollTop: 5000,
						duration: 300,
						fail: (e) => {
							//console.log('滚失败了', e)
						}
					});
				}, 100)

				if (isFail) {
					this.renderFail(sessionKey);
				}
			},

			renderFail(sessionKey) {
				let me = this;
				let msgList = me.chatMsg;
				msgList.map(item => {
					if (item.mid.substring(item.mid.length - 10) == curMsgMid.substring(curMsgMid.length - 10)) {
						item.msg.data[0].isFail = true;
						item.isFail = true;
						me.setData({
							chatMsg: msgList
						});
					}
				});

				if (me.curChatMsg[0].mid == curMsgMid) {
					me.curChatMsg[0].msg.data[0].isShow = false;
					me.curChatMsg[0].isShow = false;
				}

				uni.setStorageSync("rendered_" + sessionKey, msgList);
				isFail = false;
			},

			clickMsg(event) {
				if (typeof(event.target.dataset.msg) == 'object' &&
					event.target.dataset.msg.msg.ext &&
					event.target.dataset.msg.msg.ext.msg_extension) {
					this.$emit("clickMsg", event.target.dataset.msg.msg.ext)
				}
			}

		}
	};
</script>
<style>
	@import "./msglist.css";
</style>
