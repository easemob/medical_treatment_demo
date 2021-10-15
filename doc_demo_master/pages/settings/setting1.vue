<template>
	<view>
		<uni-list>
			<uni-list-item :show-switch="true" :switch-checked="conState=='1'" title="接诊开关" note="已开启，患者可向您发起问诊" @switchChange="onSwitchChange"
				switchColor="#25B4A5" />
			<view class="uni-review-section"></view>
			<uni-list-item showArrow="true" title="问诊价格" to="setting2" :border="false">
				<template slot="footer">
					<text class="item-orange-right">¥{{scustomerPrice}}.00</text>
				</template>
			</uni-list-item>
		</uni-list>
		<view class="fixed-bottom m-32">
			<button class="bg-main text-white" style="border-radius: 50rpx;border: 0;" type="primary"
				@tap="saveDataAction()">保存资料</button>
		</view>
	</view>
</template>

<script>
	import request from '@/common/request.js';
	export default {
		data() {
			return {
				userData: {},
				conState:'1',
				scustomerPrice: '29'
			}
		},
		onLoad(e) {
			uni.getStorage({
				key: "user-info",
				success: (res) => {
					if (res.data) {
						this.userData = JSON.parse(res.data);
						this.conState = this.userData.con_state;
						this.scustomerPrice = this.userData.docfootprice;
					}
				}
			});
			uni.$on('consulPrice', (res) => {
				console.log(`收到uni.$emit消息:${res.msg}`)
				this.scustomerPrice = res.msg;
			});
		},
		onUnload() {
			uni.$off('consulPrice')
		},
		onPullDownRefresh() {
			console.log("pullrefresh");
			request.post('/user/doctor/getDoctorJson', {
				userid: this.userData.id
			}).then(res => {
				if (res.code == 101) {
					this.conState = this.userData.con_state= res.referer.con_state;
					this.scustomerPrice = this.userData.docfootprice = res.referer.docfootprice;
					uni.setStorage({
						key:'user-info',
						data:JSON.stringify(this.userData)
					});
				} else {
					uni.showToast({
						title: res.info,
						icon: 'none'
					});
				}
			});
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 2000);
		},
		methods: {
			onSwitchChange(e) {
				this.conState=e.value?'1':'0';
			},
			saveDataAction: function() {
				this.userData.con_state=this.conState;
				this.userData.docfootprice=this.scustomerPrice;
				let postData = {
					uid: this.userData.id,
					con_state: this.conState,
					docfootprice: this.scustomerPrice
				}
				request.post('/user/doctor/saveDoctorJson', postData).then(res => {
					this.apiCode = res.code
					if (this.apiCode == 101) {
						uni.setStorage({
							key: 'user-info',
							data: JSON.stringify(this.userData)
						});
						uni.navigateBack();
						uni.showToast({
							title: '资料更新成功',
						})
					} else {
						uni.showToast({
							title:res.info,
							icon:'none'
						});
						console.log(res.info);
					}
				});
			}
		}
	}
</script>

<style>
	@import url("setting.css");
</style>
