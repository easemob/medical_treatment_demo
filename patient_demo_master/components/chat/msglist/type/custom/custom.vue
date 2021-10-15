<template>
	<view class="audio-player" v-show="customShow">
		<text class="time">{{ audiotext }}</text>
		<view class="controls">
			<image
				:src="extype == 1? '../../../../../static/images/voicecall.png' : '../../../../../static/images/video.png'" />
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				customShow: false,
				audiotext: "已取消",
				extype: 1
			}
		},
		props: {
			msg: Object
		},

		mounted() {
			if (this.msg.msg) {
				let msgbody = this.msg.msg;
				if (msgbody.ext.extmsg === "inviteVideoAction" && msgbody.ext.inviteCode == 0) {
					this.customShow = true;
					this.extype = msgbody.ext.extype;
					let recordTime=msgbody.ext.recordTime;
					if(recordTime){
						let audiotime = this.formatMinTime(msgbody.ext.recordTime);
						this.audiotext='通话时长 '+audiotime;
					}
				}
			}
		},

		methods: {
			formatMinTime(time) {
				if (typeof time !== 'number' || time < 0) {
					return time
				}

				var minute = parseInt(time / 60)
				time = time % 60
				var second = time

				return ([minute, second]).map(function(n) {
					n = n.toString()
					return n[1] ? n : '0' + n
				}).join('”')
			}
		}
	};
</script>
<style>
	.audio-player {
		position: relative;
		overflow: hidden;
		display: flex;
	}

	.audio-player .controls {
		height: 40rpx;
		align-items: center;
		display: flex;
	}

	.audio-player .controls image {
		height: 48rpx;
		width: 48rpx;
		margin: 0 8rpx 0 32rpx;
	}

	.audio-player .time {
		font-size: 34rpx;
		line-height: 40rpx;
		flex: 1;
		text-align: left;
	}
</style>
