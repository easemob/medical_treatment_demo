<template>
	<view class="page">
		<scroll-view scroll-y="true" :style="'height:'+scrollH+'px;'" @scrolltolower="loadmoreEvent">
			<block v-for="(item,index) in consultlist" :key="index">
				<consultation-item :item="item" :index="index" @click="openDetail(item)"></consultation-item>
			</block>
			<load-more :loadmore="loadmore"></load-more>
		</scroll-view>
	</view>
</template>

<script>
	let WebIM = require("../../utils/WebIM")["default"];
	let disp = require("../../utils/broadcast");
	let systemReady = false;
	import consultationItem from '@/components/consultation/consultation-item.vue';
	import loadMore from '@/components/common/load-more.vue';
	const consultdemo = [{
			docname: "张清北",
			docavatar: "/static/icons/icon-avatarimg.png",
			doclevel: "主治医师",
			dochospital: "上海市第一人民医院",
			docpartment: "消化内科",
			consultype: 1, //问诊类型：1,图文,2,音频,3,视频
			consulstate: 1, //问诊状态：1,待接诊,2,咨询中,3,已完成
			consultitle: "主诉：最近总是腹泻 腹泻时肚子疼肚子疼",
			consultime: "2017-09-02 10:33",
			mobile: "18661289339"
		},
		{
			docname: "张清北",
			docavatar: "/static/icons/icon-doctarimg.png",
			doclevel: "主治医师",
			dochospital: "上海市第一人民医院",
			docpartment: "消化内科",
			consultype: 2, //问诊类型：1,图文,2,音频,3,视频
			consulstate: 2, //问诊状态：1,待接诊,2,咨询中,3,已完成
			consultitle: "主诉：最近总是腹泻 腹泻时肚子疼肚子疼",
			consultime: "2017-09-02 10:33",
			mobile: "15358808888"
		},
		{
			docname: "张清北",
			docavatar: "/static/icons/icon_marshalling.png",
			doclevel: "主治医师",
			dochospital: "上海市第一人民医院",
			docpartment: "消化内科",
			consultype: 3, //问诊类型：1,图文,2,音频,3,视频
			consulstate: 2, //问诊状态：1,待接诊,2,咨询中,3,已完成
			consultitle: "主诉：最近总是腹泻 腹泻时肚子疼肚子疼",
			consultime: "2017-09-02 10:33",
			mobile: "15358801339"
		},
		{
			docname: "张清北",
			docavatar: "/static/icons/icon_marshalling.png",
			doclevel: "主治医师",
			dochospital: "上海市第一人民医院",
			docpartment: "消化内科",
			consultype: 1, //问诊类型：1,图文,2,音频,3,视频
			consulstate: 3, //问诊状态：1,待接诊,2,咨询中,3,已完成,4,已取消
			consultitle: "主诉：最近总是腹泻 腹泻时肚子疼肚子疼肚子疼",
			consultime: "2017-09-02 10:33",
			mobile: "15358801122"
		},
		{
			docname: "张清北",
			docavatar: "/static/icons/icon_marshalling.png",
			doclevel: "主治医师",
			dochospital: "上海市第一人民医院",
			docpartment: "消化内科",
			consultype: 1, //问诊类型：1,图文,2,音频,3,视频
			consulstate: 4, //问诊状态：1,待接诊,2,咨询中,3,已完成,4,已取消
			consultitle: "主诉：最近总是腹泻 腹泻时肚子疼肚子疼肚子疼",
			consultime: "2017-09-02 10:33",
			mobile: "15358801122"
		}
	];
	export default {
		components: {
			consultationItem,
			loadMore
		},
		data() {
			return {
				myName: "",
				member: [],
				messageNum: "",
				//加好友申请数
				unReadSpotNum: 0,
				//未读消息数
				unReadNoticeNum: 0,
				//加群通知数
				unReadTotalNotNum: 0,
				isActive: null,
				listMain: [],
				listTitles: [],
				scrollH: 500,
				consultlist: [],
				loadmore: "上拉加载更多",
			}
		},
		onLoad(e) {
			console.log("onLoad");
			// 加载测试数据
			uni.getSystemInfo({
				success: res => {
					this.scrollH = res.windowHeight;
				}
			});
			this.consultlist = [...consultdemo];
			this.getRoster();
			this.myName = uni.getStorageSync("myUsername"); // 获取当前用户名
		},
		onShow: function() {
			console.log("onShow");
		},
		onNavigationBarButtonTap(e) {
		    uni.navigateTo({
		        url: '../index/index'
		    });
		},
		methods: {
			getRoster() {
				let me = this;
				let rosters = {
					success(roster) {
						console.log(roster);
						var member = [];

						for (let i = 0; i < roster.length; i++) {
							if (roster[i].subscription == "both") {
								member.push(roster[i]);
							}
						}
						console.log(member);
						uni.setStorage({
							key: "member",
							data: member,
						});
						me.setData({
							member: member,
						});

						if (!systemReady) {
							disp.fire("em.main.ready");
							systemReady = true;
						}
						console.log(member)
						if (member.length) {
							console.log(member.length);
							me.consultlist=[];
							for (let i = 0; i < member.length; i++) {
							      let consultdic=consultdemo[i];
								  let memberdic=member[i];
								  consultdic['mobile']=memberdic['name'];
								  me.consultlist.push(consultdic);
							}
						}
					},

					error(err) {
						console.log("[main:getRoster]", err);
					},
				};

				WebIM.conn.getRoster(rosters);
			},
			// 进入聊天页面
			openDetail(item) {
				var nameList = {
					myName: this.myName,
					your: item.mobile,
				};
				console.log(item.consultag);
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
