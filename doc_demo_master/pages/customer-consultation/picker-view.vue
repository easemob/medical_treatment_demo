<template>
    <view>
		<view class="picker-flex">
			<view class="picker-text" @click="textAction(0)">
				<text class="text-dark">取消</text>
			</view>
			<view class="picker-title">
				<text>选择时间</text>
			</view>
			<view class="picker-text" @click="textAction(1)">
				<text class="text-green">确定</text>
			</view>
		</view>
		<picker-view :indicator-style="indicatorStyle" :value="valtime" @change="bindTime">
		    <picker-view-column>
		        <view class="item" v-for="(item,index) in hours" :key="index">{{item}}时</view>
		    </picker-view-column>
		    <picker-view-column>
		        <view class="item" v-for="(item,index) in minutes" :key="index">{{item}}分</view>
		    </picker-view-column>
		</picker-view>
    </view>
</template>

<script>
    export default {
        data () {
            const hours = []
            const minutes = []
			
			for (let i = 1; i <= 24; i++) {
				hours.push(i<10?'0'+i:i)
			    
			}
			for (let i = 1; i <= 60; i++) {
				minutes.push(i<10?'0'+i:i)
			}
            return {
				hours,
				hour:'12',
				minutes,
				minute:'30',
				groupId:'',
				valtime: [11, 29],
                indicatorStyle: `height: ${Math.round(uni.getSystemInfoSync().screenWidth/(750/100))}px;`
            }
        },
		onLoad(options) {
			this.groupId=options.groupId;
		},
        methods: {
			bindTime (e) {
			    const val = e.detail.value
			    this.hour = this.hours[val[0]]
			    this.minute = this.minutes[val[1]]
			},
			textAction (e) {
			    if(e==0){
					uni.navigateBack();
				}else{
					uni.$emit('reminder', {
						groupId:this.groupId,
					    msg: this.hour+':'+this.minute
					})
					uni.navigateBack()
					uni.showToast({
						title:'提醒设置成功'
					})
				}
			}
        }
    }
</script>

<style>
	
    picker-view {
        width: 100%;
        height: 600rpx;
        margin-top:20rpx;
    }

    .item {
		font-size: 32rpx;
        line-height: 100rpx;
        text-align: center;
    }
	.picker-flex {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
	}
	
	.picker-title {
		font-size:32rpx;
		font-weight:500;
		padding:20rpx 0;
		line-height:1.5;
	}
	.picker-text{
		font-size:28rpx;
		font-weight:500;
		padding:20rpx 0;
		line-height:1.5;
	}
	
	.picker-text text{
		margin: 32rpx;
		font-size:28rpx;
	}
	
	.picker-title text{
		margin: 32rpx;
		font-size:32rpx;
	}
</style>
