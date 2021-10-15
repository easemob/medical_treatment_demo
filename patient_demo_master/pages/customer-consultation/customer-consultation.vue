<template>
	<view class="page">
		<view class="uni-list bg-muted">
			<block v-for="(item,index) in consultlist" :key="index">
				<consultation-item :item="item" :index="index"></consultation-item>
			</block>
		</view>
		<uni-load-more :status="status" :icon-size="16" :content-text="contentText" />
	</view>
</template>

<script>
	import store from '@/store/index.js';
	import request from '@/common/request.js';
	let disp = require("../../utils/broadcast");
	import consultationItem from '@/components/consultation/consultation-item.vue';
	import loadMore from '@/components/common/load-more.vue';
	export default {
		components: {
			consultationItem,
			loadMore
		},
		data() {
			return {
				uid: '3',
				status: 'noMore',
				consultlist: [],
				contentText: {
					contentdown: '上拉加载更多',
					contentrefresh: '加载中',
					contentnomore: '没有更多'
				},
			}
		},
		onLoad(e) {
			console.log("onLoad");
			//监听未读消息数
			let that = this;
			if (store.state.hasLogin) {
				disp.on("em.unreadspot", function(message) {
					if (message) {
						console.log("em.unreadspot", message);
						let docchatroomid = message.to;
						for (let i = 0; i < that.consultlist.length; i++) {
							let chatroomid = that.consultlist[i]['chatroomid'];
							if (docchatroomid == chatroomid) {
								that.consultlist[i]['newChatFlag'] = true;
								that.consultlist[i]['newChatCount']++;
							}
						}
					}
				});
			}
		},
		onShow: function() {
			let that = this;
			setTimeout(function() {
				console.log("onShow", store.state);
				if (store.state.hasLogin) {
					that.uid = store.state.userid;
					that.getDocConsultations();
				} else {
					this.consultlist = []
				}
			}, 800);
		},
		onPullDownRefresh() {
			if (store.state.hasLogin) {
				that.uid = store.state.userid;
				that.getDocConsultations();
			} else {
				uni.stopPullDownRefresh();
				uni.navigateTo({
					url: '../login/login?navigateFrom=assistance'
				});
			}
		},
		onNavigationBarButtonTap(e) {
			console.log("onNavigationBarButtonTap");
			uni.navigateTo({
				url: '../showflex/showflexview'
			});
		},
		methods: {
			getDocConsultations() {
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
				request.post('/user/consultation/getDocConsultations', {
					userid: this.uid
				}).then(res => {
					uni.stopPullDownRefresh();
					if (res.code == 101) {
						console.log("获取问诊列表成功", res.referer);
						if (res.referer.length > 0) {

							if (res.referer.length < 20) {
								this.status = 'noMore';
							} else {
								this.status = 'more';
							}

							for (let i = 0; i < res.referer.length; i++) {
								let newChatFlag = false;
								let docConsultation = res.referer[i];
								let docchatroomid = docConsultation['chatroomid'] + myName;

								if (newChatMsgKeys.includes(docchatroomid)) {

									let newChatMsgs = uni.getStorageSync(docchatroomid);
									if (newChatMsgs && newChatMsgs.length) {
										newChatFlag = true;
									}
								}
								res.referer[i]['newChatFlag'] = newChatFlag;
								res.referer[i]['newChatCount'] = newChatFlag ? 1 : 0;
							}
							that.consultlist = res.referer;
						} else {
							uni.showToast({
								title: "暂无问诊",
								icon: "none"
							})
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
			// 上拉加载
			loadmoreEvent() {
				// 验证当前是否处于可加载状态
				if (this.loadmore !== '上拉加载更多') return;
				// 设置加载状态
				this.loadmore = '加载中...'
				// 模拟请求数据
				setTimeout(() => {
					// 加载数据
					// this.consultlist = [...consultdemo, ...consultdemo]
					// 设置加载状态
					this.loadmore = '上拉加载更多'
				}, 2000)
			},
		}
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
</style>
