<template>
	<view>
		<uni-list>
			<uni-list-item clickable dishover :title="item.value" v-for="(item,index) in rejudgeArray"
				@click="checkboxAction(index)">
				<template slot="footer">
					<image class="item-checkbox" :src="item.checked?'../../static/icons/icon_item_checked.png':'../../static/icons/icon_item_uncheck.png'"/>
				</template>
			</uni-list-item>
		</uni-list>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				groupId:'',
				rejudgeArray: [{
					value: '咨询不对症',
					checked: false
				}, {
					value: '患者缺少诊疗资料',
					checked: false
				}, {
					value: '患者病情复杂',
					checked: false
				}]
			}
		},
		onLoad(options) {
			this.groupId=options.groupId;
		},
		methods: {
			checkboxAction: function(index) {
				console.log(index);
				this.rejudgeArray[index].checked = !this.rejudgeArray[index].checked;
			}
		},
		onNavigationBarButtonTap(e) {
			let selectChecked=false;
			for(let i=0;i<this.rejudgeArray.length;i++){
				let checked=this.rejudgeArray[i].checked;
				if(this.rejudgeArray[i].checked){
					selectChecked=true;
				}
			}
			if(selectChecked){
				uni.navigateBack();
				uni.$emit('rejudge', {
					groupId:this.groupId,
				    msg: 'restatus'
				})
			}else{
				uni.showToast({
					title: "请选择原因",
					image: "../../static/icons/icon_gantan.png"
				})
			}
			
		},
	}
</script>

<style>
	.item-checkbox{
		margin: 4rpx;
		width: 40rpx;
		height: 40rpx;
	}
	
</style>
