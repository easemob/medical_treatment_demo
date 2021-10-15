<template>
	<view class="page">
		<view class="search-header">
			<uni-search-bar @confirm="search" @input="input" @cancel="cancel" class="search-body" bgColor="#F7F8FA" />
		</view>
		<view class="uni-list margintop-bar">
			<block v-for="(value, index) in lawyerlist" :key="index">
				<main-item :item="value" :index="index"></main-item>
			</block>
		</view>
		<uni-load-more :status="status" :icon-size="16" :content-text="contentText" />
	</view>
</template>

<script>
	import store from '@/store/index.js';
	import request from '@/common/request.js';
	import mainItem from '@/components/news/main-item.vue';
	export default {
		components: {
			mainItem
		},
		data() {
			return {
				titleString: "医生列表",
				searchVal: '',
				lawyerlist: [],
				reload: false,
				status: 'noMore',
				contentText: {
					contentdown: '上拉加载更多',
					contentrefresh: '加载中',
					contentnomore: '没有更多'
				}
			}
		},
		onLoad() {
			console.log("onLoad");
			if (store.state.hasLogin) {
				this.getRecommendDoctors();
				uni.$on('condetailData', (res) => {
					console.log(res.msg);
					setTimeout(function() {
						uni.navigateTo({
							url: '../customer-consultation/professional-consultaion?condetailData=' + JSON
								.stringify(res.msg)
						});
					}, 200);
					
				});
			}else{
				this.lawyerlist=[]
			}
		},
		onUnload() {
			uni.$off('condetailData')
		},
		onShow: function() {
			console.log("onShow");
			if (store.state.hasLogin) {
				this.getRecommendDoctors();
			}else{
				this.lawyerlist=[]
			}
		},
		onPullDownRefresh() {
			this.getRecommendDoctors();
		},
		onReachBottom() {

		},
		methods: {
			search(res) {
				if(res.value&&res.value.length>0){
					uni.showToast({
						title: '搜索：' + res.value,
						icon: 'none'
					})
					this.postRecommendDoctors(res.value);
				}
			},
			input(res) {
				this.searchVal = res.value
			},
			cancel(res) {
				uni.showToast({
					title: '点击取消，输入值为：' + res.value,
					icon: 'none'
				})
			},
			getRecommendDoctors() {
				let that = this;
				request.get('/user/consultation/getRecommendDoctors').then(res => {
					uni.stopPullDownRefresh();
					if (res.code == 101) {
						console.log("获取推荐医生列表成功", res.referer);
						this.lawyerlist = res.referer;
						if (this.lawyerlist.length < 20) {
							this.status = 'noMore';
						} else {
							this.status = 'more';
						}
					} else {
						console.log(res.info);
						uni.showModal({
							title: '温馨提示',
							content: res.info,
							showCancel: false
						})
					}
				});
			},
			postRecommendDoctors(keyword) {
				let that = this;
				let pdata={};
				if(keyword&&keyword.length>0){
					pdata['keyword']=keyword;
					console.log('keyword',keyword);
				}
				request.post('/user/consultation/getRecommendDoctors',pdata).then(res => {
					if (res.code == 101) {
						console.log("获取推荐医生列表成功", res.referer);
						this.lawyerlist = res.referer;
						if (this.lawyerlist.length < 20) {
							this.status = 'noMore';
						} else {
							this.status = 'more';
						}
					} else {
						console.log(res.info);
						uni.showModal({
							title: '温馨提示',
							content: res.info,
							showCancel: false
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
						console.log(res);
						let storageKeys = res.keys;
						let newChatMsgKeys = [];
						let historyChatMsgKeys = [];
						let len = myName.length;
						storageKeys.forEach((item) => {
							if (item.slice(-len) == myName && item.indexOf("rendered_") == -1) {
								
								newChatMsgKeys.push(item);
								console.log('newChat',item);
							} else if (item.slice(-len) == myName && item.indexOf("rendered_") > -1) {
								
								historyChatMsgKeys.push(item);
								console.log('hisChat',item);
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
					console.log("newChatMsgKeys:" + newChatMsgKeys);
					console.log("historyChatMsgKeys:" + historyChatMsgKeys);
					for (let i = historyChatMsgKeys.length; i > 0, i--;) {
						let index = newChatMsgKeys.indexOf(historyChatMsgKeys[i].slice(9));
						if (index > -1) {
							let newChatMsgs = uni.getStorageSync(newChatMsgKeys[index]) || [];
							if (newChatMsgs.length) {
								lastChatMsg = newChatMsgs[newChatMsgs.length - 1];
								lastChatMsg.unReadCount = newChatMsgs.length;
								if (lastChatMsg.unReadCount > 99) {
									lastChatMsg.unReadCount = "99+";
								}
								newChatMsgKeys.splice(index, 1);
								console.log('index',index);
							} else {
								let historyChatMsgs = uni.getStorageSync(historyChatMsgKeys[i]);
								if (historyChatMsgs.length) {
									lastChatMsg = historyChatMsgs[historyChatMsgs.length - 1];
									console.log('lastChatMsg',lastChatMsg);
								}
							}
							console.log('newChatMsgs', newChatMsgs);
						} else {
							let historyChatMsgs = uni.getStorageSync(historyChatMsgKeys[i]);
							if (historyChatMsgs.length) {
								lastChatMsg = historyChatMsgs[historyChatMsgs.length - 1];
								console.log('lastChatMsg', lastChatMsg);
							}
							console.log('historyChatMsgs', historyChatMsgs);
						}
						
						if (lastChatMsg && (lastChatMsg.chatType == "groupchat" || lastChatMsg.chatType == "chatRoom")) {
							lastChatMsg.groupName = lastChatMsg.info.to;
							console.log('lastChatMsg',lastChatMsg);
						}
						
						lastChatMsg && lastChatMsg.username != myName && array.push(lastChatMsg);
					}
					
					console.log("array", array);
					for (let i = newChatMsgKeys.length; i > 0, i--;) {
						let newChatMsgs = uni.getStorageSync(newChatMsgKeys[i]) || [];
						if (newChatMsgs.length) {
							lastChatMsg = newChatMsgs[newChatMsgs.length - 1];
							lastChatMsg.unReadCount = newChatMsgs.length;
							if (lastChatMsg.unReadCount > 99) {
								lastChatMsg.unReadCount = "99+";
							}
							if (
								lastChatMsg.chatType == "groupchat" ||
								lastChatMsg.chatType == "chatRoom"
							) {
								lastChatMsg.groupName = me.groupName[lastChatMsg.info.to];
							}
							lastChatMsg.username != myName && array.push(lastChatMsg);
						}
					}
					console.log("array", array);
					array.sort((a, b) => {
						return b.dateTimeNum - a.dateTimeNum;
					});
					console.log("array", array);
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

	.search-header {
		width: 100%;
		position: fixed;
		z-index: 996;
		padding: 0rpx 4rpx;
		font-size: 28rpx;
		background-color: #F7F8FA;
	}

	.search-body {
		margin: 4rpx;
		background-color: #F7F8FA;
	}

	.margintop-bar {
		margin-top: 110rpx;
	}
</style>
