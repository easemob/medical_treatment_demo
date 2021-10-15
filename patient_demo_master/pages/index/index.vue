<template>
	<uni-indexed-list :options="list" :showSelect="false" @click="bindClick"></uni-indexed-list>
</template>

<script>
	import AgoraToken from '@/plugins/AgoraToken';
	import store from '@/store/index.js';
	export default {
		data() {
			return {
				username:{},
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
			let myName = uni.getStorageSync("myUsername");
			this.username = {
				mobile: myName,
				channel: myName
			};
			console.log(this.username);
			// AgoraToken(this.username);
		},
		methods: {
			bindClick(e) {
				let navigatePage=`../${e.item.key}/${e.item.name}`;
				// if(e.item.name==="JoinChannelVideo"){
				// 	let agoraToken=store.state.agoraToken;
				// 	console.log(agoraToken);
				// 	navigatePage=`../${e.item.key}/${e.item.name}?username=`+ JSON.stringify(this.username)+"&chatroomAgoraToken="+ JSON.stringify(agoraToken);
				// }
				console.log(navigatePage)
				uni.navigateTo({
					url: navigatePage
				})
			}
		}
	}
</script>
