<template>
	<view class="consultation-item" @click="consultationDetailAction">
		<view class="list-item-view">
			<image :src="item.avatar" class="list-item-avatar"></image>
			<text v-show="item.newChatFlag" class="avatar-icon-text">{{item.newChatCount}}</text>
		</view>
		<view class="list-item-right">
			<view class="list-item-baseline"><text class="item-doc-name">{{item.docname}}</text>
				<text class="font-24 ml-20">{{item.docpartment}}</text>
				<text class="list-item-tag"
					:class="'item-tag-bg'+item.consultation_type">{{typeArray[item.consultation_type]}}</text>
				<text class="item-right-text"
					:class="'item-right-color'+item.consultation_status">{{stateArray[item.consultation_status]}}</text>
			</view>
			<view class="list-item-bottom">
				<text class="consultation-title">主诉：{{item.consultation_title}}</text>
				<text class="list-item-docexpert mt-4">
					{{item.createtime}}
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
					url: 'professional-consultaion?condetailData=' + JSON.stringify(this.item)
				});
			}
		},
	}
</script>

<style>
	.consultation-item {
		display: flex;
		flex-direction: row;
		margin: 36rpx 36rpx 8rpx;
		padding: 4rpx;
		background-color: #FFFFFF;
		border-radius: 8rpx;
	}

	.list-item-view {
		display: flex;
		margin: 12rpx 2rpx;
		width: 120rpx;
		min-width: 120rpx;
		height: 120rpx;
	}

	.list-item-avatar {
		margin: 16rpx;
		width: 84rpx;
		min-width: 84rpx;
		height: 84rpx;
		border-radius: 42rpx;
	}

	.avatar-icon-text {
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 24rpx;
		color: #ffffff;
		width: 28rpx;
		height: 28rpx;
		margin-top: 16rpx;
		margin-left: 80rpx;
		position: absolute;
		border-radius: 14rpx;
		background-color: #FF2B2B;
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
		max-width: 540rpx;
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
		word-wrap: break-word;
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
	
	.item-doc-name {
		max-width: 32rpx;
		font-size: 34rpx;
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
