<template>
	<view class="page">
		<uni-list :border="true" v-if="dataShow">
			<uni-list-item v-for="(value, index) in patientlist" :key="index"
				:to="`../customer-consultation/professional-consultaion?condetailData=${JSON.stringify(value)}`">
				<template slot="header">
					<image class="patient-image" :src="value.consultation_avatar" mode="aspectFill"></image>
					<text v-show="value.newChatFlag" class="avatar-icon-text">{{value.newChatCount}}</text>
				</template>
				<template slot="body">
					<view class="patient-item-column">
						<view class="patient-item-flex">
							<text class="patient-item-name">{{value.patient_realname}}</text>
							<text class="patient-item-tag"
								:class="'item-tag-bg'+value.consultation_type">{{typeArray[value.consultation_type]}}</text>
						</view>
						<text class="patient-item-text">{{value.consultation_title}}</text>
					</view>
				</template>
				<template slot="footer">
					<view class="patient-item-end">
						<text class="patient-item-time">{{value.createtime.substring(10,16)}}</text>
						<text class="patient-right-text"
							:class="'item-right-color'+value.consultation_status">{{stateArray[value.consultation_status]}}</text>
					</view>
				</template>
			</uni-list-item>
		</uni-list>
		<uni-load-more v-if="dataShow" :status="status" :icon-size="16" :content-text="contentText" />
		<view class="emptyView" v-if="emptyShow">
			<image class="emptyImage" src="@/static/icons/icon_empty_image.png"></image>
			<text class="emptyText">暂无问诊消息</text>
		</view>
	</view>
</template>

<script>
	import store from '@/store/index.js';
	import request from '@/common/request.js';
	let disp = require("../../utils/broadcast");
	var WebIM = require("../../utils/WebIM")["default"];
	export default {
		data() {
			return {
				uid: '2',
				dataShow: false,
				emptyShow: false,
				titleString: "医生列表",
				searchVal: '',
				patientlist: [],
				reload: false,
				status: 'more',
				contentText: {
					contentdown: '上拉加载更多',
					contentrefresh: '加载中',
					contentnomore: '没有更多'
				},
				unReadSpotNum: 0,
				unReadNoticeNum: 0,
				messageNum: 0,
				unReadTotalNotNum: 0,
				patientchatArray: [],
				typeArray: ["类型", "图文", "音频", "视频"],
				stateArray: ["状态", "待接诊", "咨询中", "已完成", "已退诊"]
			}
		},
		onLoad(e) {
			let that = this;
			setTimeout(function() {
				if (!store.state.hasLogin) {
					return uni.navigateTo({
						url: '../login/login'
					});
				}
			}, 200);
			//监听未读消息数
			disp.on("em.unreadspot", function(message) {
				if (message) {
					console.log("em.unreadspot", message);
					let patchatroomid = message.to;
					for (let i = 0; i < that.patientlist.length; i++) {
						let chatroomid = that.patientlist[i]['chatroomid'];
						if (patchatroomid == chatroomid) {
							that.patientlist[i]['newChatFlag'] = true;
							that.patientlist[i]['newChatCount']++;
						}
					}
				}
			});
		},
		onShow: function() {
			let that = this;
			setTimeout(function() {
				console.log("onShow", store.state);
				if (store.state.hasLogin) {
					that.uid = store.state.userid;
					that.getPatConsultations();
				} else {
					return uni.navigateTo({
						url: '../login/login'
					});
				}
			}, 1200);
		},
		onNavigationBarButtonTap(e) {
			console.log("onNavigationBarButtonTap");
			uni.navigateTo({
				url: '../Advanced/index'
			});
		},
		onPullDownRefresh() {
			this.reload = true;
			this.getPatConsultations();
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 2000);
		},
		onReachBottom() {
			uni.showToast({
				title: "loading",
				icon: "loading",
				duration: 2000
			});
			console.log("reachBottom");
		},
		methods: {
			getPatConsultations() {
				let that = this;
				let newChatMsgKeys = [];
				let myName = uni.getStorageSync("myUsername");
				let namelen = myName.length;
				uni.getStorageInfo({
					success: function(res) {
						let storageKeys = res.keys;
						storageKeys.forEach((item) => {
							if (item.slice(-namelen) == myName && item.indexOf("rendered_") == -1) {
								newChatMsgKeys.push(item);
							}
						});
					}
				});
				request.post('/user/consultation/getPatConsultations', {
					userid: this.uid
				}).then(res => {
					// console.log(res);
					this.apiCode = res.code
					let unReadState = false;
					if (this.apiCode == 101) {
						// console.log("获取患者问诊列表成功", res.referer);
						if (res.referer.length > 0) {
							if (res.referer.length < 20) {
								this.status = 'noMore';
							} else {
								this.status = 'more';
							}
							for (let i = 0; i < res.referer.length; i++) {
								let newChatFlag = false;
								let patConsultation = res.referer[i];
								let patchatroomid = patConsultation['chatroomid'] + myName;

								if (newChatMsgKeys.includes(patchatroomid)) {

									let newChatMsgs = uni.getStorageSync(patchatroomid);

									if (newChatMsgs && newChatMsgs.length) {
										newChatFlag = unReadState = true;
									}
								}
								res.referer[i]['newChatFlag'] = newChatFlag;
								res.referer[i]['newChatCount'] = newChatFlag ? 1 : 0;

							}
							this.patientlist = res.referer;

							this.dataShow = true;
							this.emptyShow = false;
						} else {
							this.dataShow = false;
							this.emptyShow = true;
						}
					} else {
						uni.showToast({
							title: res.info,
							icon: 'none'
						});
						console.log(res.info);
					}
					console.log('unReadState', unReadState);
					if (unReadState) {
						uni.showTabBarRedDot({
							index: 0
						})
					} else {
						uni.hideTabBarRedDot({
							index: 0
						})
					}
				});
			},
			// 包含陌生人版本
			getChatList() {
				var myName = uni.getStorageSync("myUsername");
				console.log(myName);
				var array = [];
				const me = this;
				uni.getStorageInfo({
					success: function(res) {
						let storageKeys = res.keys;
						let newChatMsgKeys = [];
						let historyChatMsgKeys = [];
						let len = myName.length;
						storageKeys.forEach((item) => {
							if (item.slice(-len) == myName && item.indexOf("rendered_") == -1) {
								newChatMsgKeys.push(item);
							} else if (
								item.slice(-len) == myName &&
								item.indexOf("rendered_") > -1
							) {
								historyChatMsgKeys.push(item);
							} else if (item === "INFORM") {
								newChatMsgKeys.push(item);
							}
						});
						if (newChatMsgKeys.length && historyChatMsgKeys.length) {
							cul.call(me, newChatMsgKeys, historyChatMsgKeys);
						} else {
							console.log("暂无新消息");
						}
					},
				});

				function cul(newChatMsgKeys, historyChatMsgKeys) {
					let array = [];
					let lastChatMsg;
					console.log("lastChatMsg:" + historyChatMsgKeys);
					for (let i = historyChatMsgKeys.length; i > 0, i--;) {
						let index = newChatMsgKeys.indexOf(historyChatMsgKeys[i].slice(9));
						if (index > -1) {
							let newChatMsgs = uni.getStorageSync(newChatMsgKeys[index]) || [];
							if (newChatMsgKeys.includes()) {}
							if (newChatMsgs.length) {
								lastChatMsg = newChatMsgs[newChatMsgs.length - 1];
								lastChatMsg.unReadCount = newChatMsgs.length;
								if (lastChatMsg.unReadCount > 99) {
									lastChatMsg.unReadCount = "99+";
								}
								let dateArr = lastChatMsg.time.split(" ")[0].split("-");
								let timeArr = lastChatMsg.time.split(" ")[1].split(":");
								let month = dateArr[2] < 10 ? "0" + dateArr[2] : dateArr[2];
								lastChatMsg.dateTimeNum = `${dateArr[1]}${month}${timeArr[0]}${timeArr[1]}${timeArr[2]}`;
								lastChatMsg.time = `${dateArr[1]}月${dateArr[2]}日 ${timeArr[0]}:${timeArr[1]}`;
								newChatMsgKeys.splice(index, 1);
							} else {
								let historyChatMsgs = uni.getStorageSync(historyChatMsgKeys[i]);
								if (historyChatMsgs.length) {
									lastChatMsg = historyChatMsgs[historyChatMsgs.length - 1];
									let dateArr = lastChatMsg.time.split(" ")[0].split("-");
									let timeArr = lastChatMsg.time.split(" ")[1].split(":");
									let month = dateArr[2] < 10 ? "0" + dateArr[2] : dateArr[2];
									lastChatMsg.dateTimeNum =
										`${dateArr[1]}${month}${timeArr[0]}${timeArr[1]}${timeArr[2]}`;
									lastChatMsg.time = `${dateArr[1]}月${dateArr[2]}日 ${timeArr[0]}:${timeArr[1]}`;
								}
							}
						} else {
							let historyChatMsgs = uni.getStorageSync(historyChatMsgKeys[i]);
							if (historyChatMsgs.length) {
								lastChatMsg = historyChatMsgs[historyChatMsgs.length - 1];
								let dateArr = lastChatMsg.time.split(" ")[0].split("-");
								let timeArr = lastChatMsg.time.split(" ")[1].split(":");
								let month = dateArr[2] < 10 ? "0" + dateArr[2] : dateArr[2];
								lastChatMsg.dateTimeNum = `${dateArr[1]}${month}${timeArr[0]}${timeArr[1]}${timeArr[2]}`;
								lastChatMsg.time = `${dateArr[1]}月${dateArr[2]}日 ${timeArr[0]}:${timeArr[1]}`;
							}
						}
						if (
							lastChatMsg &&
							(lastChatMsg.chatType == "groupchat" ||
								lastChatMsg.chatType == "chatRoom")
						) {
							lastChatMsg.groupName = me.groupName[lastChatMsg.info.to];
						}
						lastChatMsg && lastChatMsg.username != myName &&
							array.push(lastChatMsg);
					}
					console.log("newChatMsgKeys");
					for (let i = newChatMsgKeys.length; i > 0, i--;) {
						let newChatMsgs = uni.getStorageSync(newChatMsgKeys[i]) || [];
						if (newChatMsgs.length) {
							lastChatMsg = newChatMsgs[newChatMsgs.length - 1];
							lastChatMsg.unReadCount = newChatMsgs.length;
							if (lastChatMsg.unReadCount > 99) {
								lastChatMsg.unReadCount = "99+";
							}
							let dateArr = lastChatMsg.time.split(" ")[0].split("-");
							let timeArr = lastChatMsg.time.split(" ")[1].split(":");
							let month = dateArr[2] < 10 ? "0" + dateArr[2] : dateArr[2];
							lastChatMsg.dateTimeNum = `${dateArr[1]}${month}${timeArr[0]}${timeArr[1]}${timeArr[2]}`;
							lastChatMsg.time = `${dateArr[1]}月${dateArr[2]}日 ${timeArr[0]}:${timeArr[1]}`;
							if (
								lastChatMsg.chatType == "groupchat" ||
								lastChatMsg.chatType == "chatRoom"
							) {
								lastChatMsg.groupName = me.groupName[lastChatMsg.info.to];
							}
							lastChatMsg.username != myName && array.push(lastChatMsg);
						}
					}
					console.log("array.sort");
					array.sort((a, b) => {
						return b.dateTimeNum - a.dateTimeNum;
					});
					console.log(array);
					this.setData({
						patientchatArray: array,
					});
					console.log("arr: array");
				}
			},

			openSearch: function() {
				this.setData({
					search_btn: false,
					search_chats: true,
					gotop: true,
				});
			},
		},
	}
</script>

<style>
	page {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		background-color: #F7F8FA;
		min-height: 100%;
		height: auto;
	}

	.patient-image {
		margin: 8rpx 2rpx;
		width: 84rpx;
		min-width: 84rpx;
		height: 84rpx;
		border-radius: 42rpx;
	}

	.avatar-icon-text {
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 24rpx;
		color: #ffffff;
		width: 28rpx;
		height: 28rpx;
		margin-top: 8rpx;
		margin-left: 64rpx;
		position: absolute;
		border-radius: 14rpx;
		background-color: #FF2B2B;
	}

	.patient-item-column {
		max-width: 80%;
		width: 75%;
		margin: 8rpx 12rpx;
		display: flex;
		flex-direction: column;
	}

	.patient-item-end {
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
	}

	.patient-item-flex {
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.patient-item-name {
		color: #535568;
		line-height: 36rpx;
		margin: 8rpx;
		font-size: 32rpx;
		font-weight: bold;
	}

	.patient-item-tag {
		display: flex;
		align-items: center;
		border-radius: 4rpx;
		padding-left: 16rpx;
		padding-right: 16rpx;
		color: #FFFFFF;
		margin: 2rpx 16rpx;
		font-size: 20rpx;
	}

	.patient-item-time {
		font-size: 24rpx;
		display: flex;
		color: #9FA4AE;
		justify-content: flex-end;
	}

	.patient-item-text {
		margin-top: 4rpx;
		font-size: 24rpx;
		line-height: 36rpx;
		color: #9FA4AE;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		lines: 1;
	}

	.item-tag-bg1 {
		background-color: #F1B976;
	}

	.item-tag-bg2 {
		background-color: #25B4A5;
	}

	.item-tag-bg3 {
		background-color: #0091FF;
	}

	.patient-right-text {
		font-size: 24rpx;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		lines: 1;
	}

	.item-right-color0 {
		color: #9FA4AE;
	}

	.item-right-color1 {
		color: #F7B500;
	}

	.item-right-color2 {
		color: #0AC195;
	}

	.item-right-color3 {
		color: #9FA4AE;
	}

	.item-right-color4 {
		color: #E71E1E;
	}

	.emptyView {
		display: flex;
		flex: 1;
		flex-direction: column;
		align-items: center;
	}

	.emptyImage {
		margin-top: 320rpx;
		width: 308rpx;
		height: 200rpx;
	}

	.emptyText {
		margin-top: 36rpx;
		text-align: center;
		color: #A3A3A3;
		font-size: 28rpx;
	}
</style>
