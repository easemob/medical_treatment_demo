<template>
	<view>
		<view class="circleBoxView">
			<view class="circleBox" @click="circleAction(0)">
				<image class="circleImg" src="/static/iconfont/icon_video_quiet.png"></image>
				<text class="hint">静音</text>
			</view>
			<view class="circleBox" @click="circleAction(1)">
				<image class="circleImg" src="/static/iconfont/icon_video_cancel.png"></image>
				<text class="hint">取消</text>
			</view>
			<view class="circleBox" @click="circleAction(2)">
				<image class="circleImg" src="/static/iconfont/icon_video_speaker.png"></image>
				<text class="hint">免提</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {
			circleAction: function() {
				
			}
		}
	}
</script>

<style>
	.circleBoxView {
		width: 100%;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		background-color: #00AA00;
	}

	.circleBox {
		width: 200upx;
		padding: 30upx 0;
		margin: 10upx;
		align-items: center;
		flex-direction: column;
		background-color: #0A00A0;
	}

	.circleImg {
		width: 128rpx;
		height: 128rpx;
	}

	.hint {
		font-size: 30upx;
		color: #FFFFFF;
		padding-top: 20upx;
	}
</style>
