<template>
	<uni-indexed-list :options="list" :showSelect="false" @click="bindClick"></uni-indexed-list>
</template>

<script>
	import store from '@/store/index.js';
	export default {
		data() {
			return {
				list: [{
					"letter": "Basic",
					"data": [
						"JoinChannelAudio",
						"JoinChannelVideo",
						"StringUid"
					]
				}, {
					"letter": "Advanced",
					"data": [
						"MultiChannel"
					]
				}]
			}
		},
		onLoad() {

		},
		methods: {
			bindClick(e) {
				let navigatePage=`../${e.item.key}/${e.item.name}`;
				console.log(navigatePage);
				let myUsername = uni.getStorageSync("myUsername"); // 获取当前用户名
				uni.navigateTo({
					url: navigatePage
					// url: navigatePage+ "?myUsername=" + JSON.stringify(myUsername)+ "&chatroomAgoraToken=" + JSON.stringify(store.state.agoraToken)
				})
			}
		}
	}
</script>
