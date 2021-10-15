<script>
	// #ifdef APP-PLUS
	import APPUpdate from '@/plugins/APPUpdate';
	// #endif
	import {
		getChannelToken
	} from '@/plugins/AgoraToken';
	import store from '@/store/index.js';
	let WebIM = (wx.WebIM = require("./utils/WebIM")["default"]);
	let msgStorage = require("./components/chat/msgstorage");
	let msgType = require("./components/chat/msgtype");
	let disp = require("./utils/broadcast");
	let logout = false;

	function ack(receiveMsg) {
		// 处理未读消息回执
		var bodyId = receiveMsg.id; // 需要发送已读回执的消息id
		console.log('receiveMsg', receiveMsg);
		var ackMsg = new WebIM.message("read", WebIM.conn.getUniqueId());
		ackMsg.set({
			id: bodyId,
			to: receiveMsg.from,
		});
		WebIM.conn.send(ackMsg.body);
	}

	function onMessageError(err) {
		if (err.type === "error") {
			uni.showToast({
				title: err.errorText,
			});
			return false;
		}

		return true;
	}

	function getCurrentRoute() {
		let pages = getCurrentPages();
		if (pages.length > 0) {
			let currentPage = pages[pages.length - 1];
			return currentPage.route;
		}
		return "/";
	}

	// 包含陌生人版本
	function calcUnReadSpot(message) {
		console.log(message);
		let myName = uni.getStorageSync("myUsername");
		console.log('unReadMessage', message);
		uni.getStorageInfo({
			success: function(res) {
				let storageKeys = res.keys;
				let newChatMsgKeys = [];
				let historyChatMsgKeys = [];
				storageKeys.forEach((item) => {
					if (item.indexOf(myName) > -1 && item.indexOf("rendered_") == -1) {
						newChatMsgKeys.push(item);
					}
				});
				let count = newChatMsgKeys.reduce(function(result, curMember, idx) {
					let chatMsgs;
					chatMsgs = uni.getStorageSync(curMember) || [];
					return result + chatMsgs.length;
				}, 0);

				getApp().globalData.unReadMessageNum = count;
				uni.showTabBarRedDot({
					index: 1
				})
				console.log('unReadMessageNum', count);
				disp.fire("em.unreadspot", message);
			},
		});
	}

	export default {
		globalData: {
			unReadMessageNum: 0,
			userInfo: null,
			saveFriendList: [],
			saveGroupInvitedList: [],
			isIPX: false, //是否为iphone X
			conn: {
				closed: false,
				curOpenOpt: {},

				open(opt) {
					uni.showLoading({
						title: "正在初始化客户端..",
						mask: true,
					});
					this.curOpenOpt = opt;
					WebIM.conn.open(opt);
					this.closed = false;
				},

				reopen() {
					if (this.closed) {
						//this.open(this.curOpenOpt);
						WebIM.conn.open(this.curOpenOpt);
						this.closed = false;
					}
				},
			},
			onLoginSuccess: function(myName) {
				console.log("onLoginSuccess:" + myName)
				uni.hideLoading();
				uni.switchTab({
					url: "../index/main?myName=" + myName,
				});
				uni.setStorage({
					key: "myLoginSuccess",
					data: true
				});
			},

			getUserInfo(cb) {
				var me = this;

				if (this.userInfo) {
					typeof cb == "function" && cb(this.userInfo);
				} else {
					// 调用登录接口
					uni.login({
						success() {
							uni.getUserInfo({
								success(res) {
									me.userInfo = res.userInfo;
									typeof cb == "function" && cb(me.userInfo);
								},
							});
						},
					});
				}
			},

			checkIsIPhoneX: function() {
				const me = this;
				uni.getSystemInfo({
					success: function(res) {
						// 根据 model 进行判断
						if (res.model && res.model.search("iPhone X") != -1) {
							me.isIPX = true;
						}
					},
				});
			},
		},
		onLaunch: function() {
			console.log('App Launch');
			// #ifdef APP-PLUS
			let platform = uni.getSystemInfoSync().platform;
			if (platform === 'android') {
				APPUpdate();
				console.log(platform);
			}
			if (!store.state.hasLogin) {
				uni.getStorage({
					key: "user-info",
					success: (res) => {
						if (res.data) {
							let userData = JSON.parse(res.data);
							store.commit('login', userData.id);
						}
					}
				});
			}
			uni.getStorage({
				key: "myLoginSuccess",
				success: (res) => {
					if (res.data) {
						console.log("调用 API 从本地缓存中获取数据:" + res.data)
						uni.showToast({
							title: "调用 API 从本地缓存中获取数据",
							icon: 'none'
						});
						let myUsername = uni.getStorageSync("myUsername").toLowerCase()
						let myUserpass = uni.getStorageSync("myUserpass").toLowerCase()
						getApp().globalData.conn.open({
							apiUrl: WebIM.config.apiURL,
							user: myUsername,
							pwd: myUserpass,
							grant_type: "password",
							appKey: WebIM.config.appkey
						});
					}
				},
				fail: () => {
					console.log("调用 API 从本地缓存中获取数据失败")
					uni.showToast({
						title: "调用 API 从本地缓存中获取数据失败",
						icon: 'none'
					});
				}

			});
			// #endif
			var me = this;
			var logs = uni.getStorageSync("logs") || [];
			logs.unshift(Date.now());
			uni.setStorageSync("logs", logs); //

			disp.on("em.main.ready", function() {
				console.log('em.main.ready');
				calcUnReadSpot();
			});
			disp.on("em.chatroom.leave", function() {
				console.log('em.chatroom.leave')
				calcUnReadSpot();
			});
			disp.on("em.chat.session.remove", function() {
				console.log('em.chat.session.remove')
				calcUnReadSpot();
			});
			disp.on("em.chat.audio.fileLoaded", function() {
				console.log('em.chat.audio.fileLoaded')
				calcUnReadSpot();
			});
			disp.on("em.main.deleteFriend", function() {
				console.log('em.main.deleteFriend')
				calcUnReadSpot();
			});
			WebIM.conn.listen({
				//链接成功回调
				onOpened(message) {
					console.log("onOpened");
					if (
						getCurrentRoute() == "pages/login/login" ||
						getCurrentRoute() == "pages/login_token/login_token"
					) {
						me.globalData.onLoginSuccess(
							uni.getStorageSync("myUsername").toLowerCase()
						);
					}
					uni.hideLoading();
				},
				//重连回调
				onReconnect() {
					uni.showToast({
						title: "重连中...",
						duration: 2000,
					});
				},
				//链接成功回调
				onSocketConnected() {
					uni.showToast({
						title: "socket连接成功",
						duration: 2000,
					});
				},
				//链接关闭回调
				onClosed() {
					console.log("onClosed");
					uni.showToast({
						title: "网络已断开",
						icon: "none",
						duration: 2000,
					});
					uni.redirectTo({
						url: "../login/login",
					});
					me.globalData.conn.closed = true;
					WebIM.conn.close();
				},
				//处理群组邀请
				onInviteMessage(message) {
					me.globalData.saveGroupInvitedList.push(message);
					disp.fire("em.invite.joingroup", message);
				},
				//链接成功回调
				onReadMessage(message) {
					console.log('已读', message)
				},
				//处理广播或发布订阅消息
				//onPresence为旧版 ，建议参考最新增删好友api文档 ：http://docs-im.easemob.com/im/web/basics/buddy
				onPresence(message) {
					console.log("onPresence");
					switch (message.type) {
						case "unsubscribe":
							break;
							// 好友邀请列表
						case "subscribe":
							uni.showToast({
								title: "好友邀请信息"
							});
							for (let i = 0; i < me.globalData.saveFriendList.length; i++) {
								if (me.globalData.saveFriendList[i].from === message.from) {
									me.globalData.saveFriendList[i] = message;
									disp.fire("em.subscribe");
									return;
								}
							}
							// 存添加好友消息，方便展示通知
							msgStorage.saveReceiveMsg(message, 'INFORM');
							me.globalData.saveFriendList.push(message);
							disp.fire("em.subscribe");
							break;
							// 添加成功
						case "subscribed":
							uni.showToast({
								title: "添加成功",
								duration: 1000,
							});
							disp.fire("em.subscribed");
							break;
							// 取消好友
						case "unsubscribed":
							disp.fire("em.unsubscribed");
							break;
							// 直接连接
						case "direct_joined":
							saveGroups();
							uni.showToast({
								title: "已进群",
								duration: 1000,
							});
							break;
							// 添加成功
						case "memberJoinPublicGroupSuccess":
							saveGroups();
							uni.showToast({
								title: "已进群",
								duration: 1000,
							});
							break;
						case "invite":
							// 防止重复添加
							for (let i = 0; i < me.globalData.saveGroupInvitedList.length; i++) {
								if (me.globalData.saveGroupInvitedList[i].from === message.from) {
									me.globalData.saveGroupInvitedList[i] = message;
									disp.fire("em.invite.joingroup")
									return;
								}
							}
							me.globalData.saveGroupInvitedList.push(message);
							disp.fire("em.invite.joingroup");
							msgStorage.saveReceiveMsg(message, 'INFORM'); //存添加好友消息，方便展示通知
							break;
							// 不可用的
						case "unavailable":
							disp.fire("em.contacts.remove");
							disp.fire("em.group.leaveGroup", message);
							break;
							// 删除群聊
						case "deleteGroupChat":
							disp.fire("em.invite.deleteGroup", message);
							break;
							// 离开组
						case "leaveGroup":
							disp.fire("em.group.leaveGroup", message);
							break;
							// 已从组中删除
						case "removedFromGroup":
							disp.fire("em.group.leaveGroup", message);
							break;

						default:
							break;
					}
				},
				//处理好友申请
				onRoster(message) {
					console.log("onRoster", message);
				},
				//获取视频多媒体信息
				onVideoMessage(message) {
					console.log("onVideoMessage: ", message);

					if (message) {
						msgStorage.saveReceiveMsg(message, msgType.VIDEO);
					}

					calcUnReadSpot(message);
					ack(message);
				},
				//链接成功回调
				onAudioMessage(message) {
					console.log("onAudioMessage", message);

					if (message) {
						if (onMessageError(message)) {
							msgStorage.saveReceiveMsg(message, msgType.AUDIO);
						}

						calcUnReadSpot(message);
						ack(message);
					}
				},
				//收到自定义消息
				onCustomMessage(message) {
					if (message) {
						console.log("onCustomMessage", message);
						onMessageError(message)
						if (message.ext.extmsg === "inviteVideoAction") {
							let inviteCode = message.ext.inviteCode;
							let extype = message.ext.extype;
							console.log("message.ext", message.ext);
							if (inviteCode == 1) {
								let myName = uni.getStorageSync("myUsername");
								let groupId = message.to;
								let username = {
									myName: myName,
									groupId: groupId
								};
								let agoradata = {
									mobile: myName,
									channel: groupId
								};
								console.log("agoradata", agoradata);
								getChannelToken(agoradata, res => {
									let encodeToken = encodeURIComponent(res.agoraToken);
									if(extype == 1){
										uni.navigateTo({
											url: "../showflex/showflexvideo1?username=" + JSON
												.stringify(username) + "&encodeToken=" + JSON
												.stringify(encodeToken)
										});
									}else{
										uni.navigateTo({
											url: "../showflex/showflexvideo?username=" + JSON
												.stringify(username) + "&encodeToken=" + JSON
												.stringify(encodeToken)
										});
									}
									
								});

							} else {
								uni.$emit('receiverInvite', {
									restate: false
								});
								msgStorage.saveReceiveMsg(message, msgType.CUSTOM);
							}
						}
						ack(message);
					}
				},
				//链接成功回调
				onCmdMessage(message) {

					console.log("onCmdMessage", message);

					if (message) {
						if (onMessageError(message)) {
							msgStorage.saveReceiveMsg(message, msgType.CMD);
						}

						calcUnReadSpot(message);
						ack(message);
					}
				},

				//收到文本消息
				onTextMessage(message) {
					console.log("onTextMessage", message);

					if (message) {
						if (onMessageError(message)) {
							msgStorage.saveReceiveMsg(message, msgType.TEXT);
						}

						calcUnReadSpot(message);
						ack(message);
					}
				},
				//收到表情消息
				onEmojiMessage(message) {
					console.log("onEmojiMessage", message);

					if (message) {
						if (onMessageError(message)) {
							msgStorage.saveReceiveMsg(message, msgType.EMOJI);
						}

						calcUnReadSpot(message);
						ack(message);
					}
				},
				//收到图标消息
				onPictureMessage(message) {
					console.log("onPictureMessage", message);

					if (message) {
						if (onMessageError(message)) {
							msgStorage.saveReceiveMsg(message, msgType.IMAGE);
						}

						calcUnReadSpot(message);
						ack(message);
					}
				},
				//收到文件消息
				onFileMessage(message) {
					console.log("onFileMessage", message);

					if (message) {
						if (onMessageError(message)) {
							msgStorage.saveReceiveMsg(message, msgType.FILE);
						}

						calcUnReadSpot(message);
						ack(message);
					}
				},

				// 各种异常
				onError(error) {
					console.log("error:", error); // 16: server-side close the websocket connection

					if (error.type == WebIM.statusCode.WEBIM_CONNCTION_OPEN_ERROR) {
						uni.hideLoading();
						disp.fire("em.error.passwordErr");
						uni.showModal({
							title: "用户名或密码错误",
							confirmText: "OK",
							showCancel: false
						});
					}

					if (error.type == WebIM.statusCode.WEBIM_CONNCTION_AUTH_ERROR) {
						uni.hideLoading();
						disp.fire("em.error.tokenErr");
					}

					if (error.type == "socket_error") {
						///sendMsgError
						console.log("socket_errorsocket_error", error);
						uni.showToast({
							title: "网络已断开",
							icon: "none",
							duration: 2000,
						});
						disp.fire("em.error.sendMsgErr", error);
					}
				},
			});
			uni.$on('cancelInvite', (res) => {
				console.log('cancelInviteDone', res);
				let myName = uni.getStorageSync("myUsername");
				let msg = new WebIM.message("custom", WebIM.conn.getUniqueId());
				msg.set({
					from: myName,
					to: res.groupId,
					ext: {
						'extmsg': 'inviteVideoAction',
						'extype': res.extype,//1语音通话,2视频通话
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
				WebIM.conn.send(msg.body);
			});
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/* #ifndef APP-PLUS-NVUE */
	/* uni.css - 通用组件、模板样式库，可以当作一套ui库应用 */
	/* @import "./common/main.css"; */
	@import "./common/icon.css";
	/*每个页面公共css */
	@import './common/common.css';
	/*每个页面公共css */
	/* 官方css库 */
	@import "./common/uni.css";
	/* 自定义图标库 */
	@import "./common/iconfont.css";
	/* 动画库 */
	@import "./common/animate.css";
	/* 自定义样式库 */
	@import "./common/free.css";
	/* #endif*/
</style>
