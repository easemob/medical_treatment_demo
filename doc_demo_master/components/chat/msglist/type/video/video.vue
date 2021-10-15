<template>
	<view class="audio-player">
		<text class="time">通话时长{{ audiotime }}</text>
		<view class="controls">
			<image src="../../../../../static/images/video.png"></image>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				audiotime: "1”"
			}
		},
		props: {
			msg: Object
		},

		mounted() {
			let recordTime = this.msg.ext.recordTime;
			this.audiotime = this.formatMinTime(recordTime);
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
		width: 30rpx;
		margin: 0 8rpx 0 100rpx;
	}

	.audio-player .time {
		font-size: 34rpx;
		line-height: 40rpx;
		flex: 1;
		text-align: left;
	}
</style>
