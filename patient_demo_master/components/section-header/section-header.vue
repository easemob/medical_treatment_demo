<template>
	<view class="list-item-row">
		<image :src="condetailItem.avatar" class="list-item-avatar"></image>
		<view class="profess-item-row">
			<view class="hei-48"><text class="font-34 text-bold">{{condetailItem.docname}}</text>
				<text class="list-item-tag"
					:class="'item-tag-bg'+condetailItem.consultation_type">{{typeArray[condetailItem.consultation_type]}}</text>
			</view>
			<view><text
					class="font-24 text-dark-light">{{condetailItem.doclevel}}&nbsp;&nbsp;|&nbsp;&nbsp;{{condetailItem.docpartment}}</text>
			</view>
		</view>
		<view class="profess-item-right">
			<text class="profess-item-text text-dark-light">
				{{condetailItem.createtime.substring(10,16)}}
			</text>
			<text class="profess-item-text"
				:class="'item-right-color'+condetailItem.consultation_status">{{stateArray[condetailItem.consultation_status]}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			condetailItem: Object
		},
		data() {
			return {
				typeArray: ["类型", "图文", "音频", "视频"],
				stateArray: ["状态", "待接诊", "咨询中", "已完成", "已取消"]
			}
		},
		mounted() {

		},
		methods: {

		},
		computed: {
			
		}
	}
</script>

<style>
	.list-item-row {
		width: 100%;
		position: fixed;
		top: 0;
		z-index: 888;
		display: flex;
		flex-direction: row;
		background-color: #FFFFFF;
	}

	.list-item-avatar {
		margin: 30rpx 2rpx 30rpx 28rpx;
		width: 84rpx;
		min-width: 84rpx;
		height: 84rpx;
		border-radius: 42rpx;
	}

	.list-item-tag {
		border-radius: 8rpx;
		padding: 4rpx 16rpx;
		color: #FFFFFF;
		margin-left: 20rpx;
		font-size: 20rpx;
	}

	.profess-item-row {
		display: flex;
		flex-direction: column;
		margin: 24rpx;
	}

	.profess-item-right {
		flex: 1;
		align-items: flex-end;
		display: flex;
		flex-direction: column;
		margin: 32rpx;
	}

	.profess-item-text {
		font-size: 24rpx;
		line-height: 32rpx;
		margin: 4rpx;
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
		color: #9FA4AE;
	}
</style>
