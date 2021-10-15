<template>
	<view class="consultation-item" @click="consultationDetailAction">
		<image :src="item.docavatar" class="list-item-avatar"></image>
		<view class="list-item-right">
			<view class="list-item-baseline"><text class="font-34">{{item.docname}}</text>
				<text class="font-24 ml-20">{{item.docpartment}}</text>
				<text class="list-item-tag" :class="'item-tag-bg'+item.consultype">{{typeArray[item.consultype]}}</text>
				<text class="item-right-text" :class="'item-right-color'+item.consulstate">{{stateArray[item.consulstate]}}</text>
			</view>
			<view class="list-item-bottom">
				<text class="consultation-title">{{item.consultitle}}</text>
				<text class="list-item-docexpert mt-4">
					{{item.consultime}}
				</text>
			</view>
		</view>
	</view>
</template>

<script>
	//consultype问诊类型：1,图文yellow,2,音频green,3,视频blue
	//consulstate问诊状态：1,待接诊yellow,2,咨询中green,3,已完成gray,4,已取消gray
	export default {
		data() {
			return {
				typeArray: ["类型", "图文", "音频", "视频"],
				stateArray: ["状态", "待接诊", "咨询中", "已完成", "已取消"]
			}
		},
		props: {
			item: Object,
			index: Number
		},
		methods: {
			consultationDetailAction() {
				uni.navigateTo({
					url: '../../pages/customer-consultation/professional-consultaion?condetailData='+JSON.stringify(this.item),
				});
			}
		},
	}
</script>

<style>
	.consultation-item {
		display: flex;
		flex-direction: row;
		margin: 36rpx;
		padding: 4rpx;
		background-color: #FFFFFF;
		border-radius: 8rpx;
	}

	.list-item-avatar {
		margin: 20rpx;
		width: 84rpx;
		min-width: 84rpx;
		height: 84rpx;
		border-radius: 42rpx;
	}

	.list-item-right {
		margin: 8rpx 32rpx 8rpx 8rpx;
		flex-direction: column;
		text-align: left;
	}

	.list-item-baseline {
		height: 48rpx;
		color: #535568;
		flex-direction: row;
		margin: 16rpx 4rpx;
	}

	.list-item-tag {
		border-radius: 4rpx;
		padding: 2rpx 16rpx;
		color: #FFFFFF;
		margin-left: 20rpx;
		font-size: 20rpx;
	}

	.item-right-text {
		float: right;
		margin-top: 12rpx;
		font-size: 24rpx;
	}

	.list-item-docexpert {
		color: #9FA4AE;
		font-size: 24rpx;
	}

	.list-item-bottom {
		display: flex;
		flex-direction: column;
		margin: 20rpx 4rpx 32rpx;
	}

	.consultation-title {
		font-size: 32rpx;
		color: #535568;
		font-weight: bold;
		letter-spacing: 2rpx;
		overflow: hidden;
		-webkit-line-clamp: 2;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
	}

	.uni-product-title {
		width: 300rpx;
		word-break: break-all;
		display: -webkit-box;
		overflow: hidden;
		line-height: 1.5;
		text-overflow: ellipsis;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
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
