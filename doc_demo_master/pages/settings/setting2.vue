<template>
	<view>
		<view class="setting-column">
			<text class="setting-column-title">请选择咨询单价(元)</text>
			<view class="setting-column-wrap">
				<view class="setting-item-price" :class="defaultNO === index?'select-item-price':''"
				v-for="(item,index) in settingPriceArray" :key="index" @click="changePrice(index)">
					{{item|retainfloat}}
				</view>
			</view>
		</view>
		<view class="setting-column mt-16">
			<text class="setting-column-title">自定义咨询单价(元)</text>
			<input class="setting-column-input" type="number" :value="settingCustomerPrice|retainfloat" />
		</view>
		<view class="setting_btn">
			<button hover-class="btn_hover" @tap="savePriceAction">保存</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				defaultNO:0,
				settingPriceArray: [1.00, 9.00, 19.00, 29.00, 39.00, 59.00, 99.00, 149.00],
				settingCustomerPrice: 1.00
			}
		},
		filters: {
			retainfloat(value) {
				return value.toFixed(value.toFixed(2).toString().split(".")[1].length).replace(/(\d)(?=(\d{3})+\.)/g,
					'$1,');
			}
		},
		methods: {
			savePriceAction: function() {
				uni.$emit('consulPrice', {
				    msg: this.settingCustomerPrice
				})
				uni.navigateBack({
					
				})
			},
			// 切换选项
			changePrice: function(index) {
				this.defaultNO = index;
				this.settingCustomerPrice=this.settingPriceArray[index];
			},
		}
	}
</script>

<style>
	@import url("setting.css");

	.setting-column-wrap {
		display: flex;
		flex-direction: row;
		margin: 16rpx;
		flex-wrap: wrap;
	}

	.setting-item-price {
		text-align: center;
		border-radius: 32rpx;
		color: #9FA4AE;
		width: 148rpx;
		height: 56rpx;
		background-color: #F1F2F3;
		font-size: 30rpx;
		margin: 10rpx 14rpx;
	}
	
	.select-item-price {
		color: #FFFFFF;
		background-color: #25B4A5;
	}

	.setting-column-input {
		height: 48rpx;
		line-height: 48rpx;
		font-size: 32rpx;
		padding: 4rpx;
		margin: 8rpx 48rpx;
	}
</style>
