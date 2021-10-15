<template>
	<view>
		<view class="flex align-center">
			<uni-list class="text-left" :border="true">
				<uni-list-item leftText="患者姓名">
					<view slot="body">
						<input class="uni-input" name="realname" v-model="realname" maxlength="5"
							placeholder="请填写真实姓名" />
					</view>
				</uni-list-item>
				<uni-list-item leftText="患者身份证号">
					<view slot="body">
						<input type="number" class="uni-input" name="idnumber" maxlength="20" v-model="idnumber"
							placeholder="请填写身份证号" />
					</view>
				</uni-list-item>
				<uni-list-item leftText="性别">
					<view slot="body">
						<view class="tag-view">
							<uni-tag class="mx-20" text="男" @click="setGender(true)"
								:type="genderd ? 'indigo' : 'default'" />
							<uni-tag class="piccon-tag" text="女" @click="setGender(false)"
								:type="genderd ? 'default' : 'indigo'" />
						</view>
					</view>
				</uni-list-item>
				<uni-list-item leftText="出生日期">
					<view slot="body">
						<picker mode="date" :value="birthday" :start="startDate" :end="endDate"
							@change="bindDateChange">
							<view class="uni-input">{{birthday}}</view>
						</picker>
					</view>
				</uni-list-item>
				<uni-list-item leftText="体重">
					<view slot="body">
						<input type="number" class="uni-input" name="weight" maxlength="5" v-model="weight"
							placeholder="请输入体重(kg)" />
					</view>
				</uni-list-item>
				<uni-list-item leftText="过敏史">
					<view slot="body">
						<view class="tag-view">
							<uni-tag class="mx-20" text="无" @click="setAllergic(true)"
								:type="allergic ? 'indigo' : 'default'" />
							<uni-tag class="piccon-tag" text="有" @click="setAllergic(false)"
								:type="allergic ? 'default' : 'indigo'" />
						</view>
					</view>
				</uni-list-item>
				<uni-list-item leftText="过往病史">
					<view slot="body">
						<view class="tag-view">
							<uni-tag class="mx-20" text="无" @click="setFall(true)"
								:type="fall ? 'indigo' : 'default'" />
							<uni-tag class="piccon-tag" text="有" @click="setFall(false)"
								:type="fall ? 'default' : 'indigo'" />
						</view>
					</view>
				</uni-list-item>
				<uni-list-item leftText="肝功能">
					<view slot="body">
						<view class="tag-view">
							<uni-tag class="mx-20" text="正常" @click="setLiver(true)"
								:type="liver ? 'indigo' : 'default'" />
							<uni-tag class="piccon-tag" text="异常" @click="setLiver(false)"
								:type="liver ? 'default' : 'indigo'" />
						</view>
					</view>
				</uni-list-item>
				<uni-list-item leftText="肾功能">
					<view slot="body">
						<view class="tag-view">
							<uni-tag class="mx-20" text="正常" @click="setKidney(true)"
								:type="kidney ? 'indigo' : 'default'" />
							<uni-tag class="piccon-tag" text="异常" @click="setKidney(false)"
								:type="kidney ? 'default' : 'indigo'" />
						</view>
					</view>
				</uni-list-item>
			</uni-list>
		</view>
		<view class="uni-flex mt-20">
			<button type="primary" class="piccon_button" @click="picodoneAction"><text
					class="font-md">提交</text></button>
		</view>
	</view>
</template>

<script>
	import request from '@/common/request.js';

	function getDate(type) {
		const date = new Date();

		let year = date.getFullYear();
		let month = date.getMonth() + 1;
		let day = date.getDate();

		if (type === 'start') {
			year = year - 60;
		} else if (type === 'end') {
			year = year + 2;
		}
		month = month > 9 ? month : '0' + month;;
		day = day > 9 ? day : '0' + day;

		return `${year}-${month}-${day}`;
	}
	export default {
		data() {
			return {
				conid:'',
				appointDate: '',
				realname: "",
				idnumber: "",
				weight: "",
				genderd: true,
				allergic: true,
				fall: true,
				liver: true,
				kidney: true,
				birthday: getDate({
					format: true
				}),
				startDate: getDate('start'),
				endDate: getDate('end'),
				userData: {}
			}
		},
		onLoad(options) {
			// 初始化
			console.log(options);
			this.conid = options.conid;
			if (options.appointDate) {
				this.appointDate = options.appointDate;
			}
			uni.getStorage({
				key: "user-info",
				success: (res) => {
					if (res.data) {
						this.userData = JSON.parse(res.data);
						this.realname=this.userData['user_nicename'];
					}
				}
			});
		},
		methods: {
			// 性别选择
			setGender(state) {
				this.genderd = state;
			},
			setAllergic(state) {
				this.allergic = state;
			},
			setFall(state) {
				this.fall = state;
			},
			setLiver(state) {
				this.liver = state;
			},
			setKidney(state) {
				this.kidney = state;
			},
			bindDateChange: function(e) {
				this.birthday = e.detail.value
			},
			picodoneAction: function() {
				console.log(this.realname);
				console.log(this.idnumber);
				console.log(this.weight);
				if (this.realname.length<2) {
					return uni.showToast({
						icon: 'none',
						title: '请完善患者姓名'
					})
				}
				if (this.idnumber.length<18) {
					return uni.showToast({
						icon: 'none',
						title: '请完善身份证号'
					})
				}
				if (this.weight.length<2) {
					return uni.showToast({
						icon: 'none',
						title: '请完善体重信息'
					})
				}

				let postData = {
					conid: this.conid,
					realname: this.realname,
					idnumber: this.idnumber,
					weight: this.weight,
					birthday: this.birthday
				}
				let deltaCount = 2;
				postData['genderd'] = this.genderd ? '1' : '2';
				postData['allergic'] = this.allergic ? '0' : '1';
				postData['fall'] = this.fall ? '0' : '1';
				postData['liver'] = this.liver ? '1' : '0';
				postData['kidney'] = this.kidney ? '1' : '0';
				if (this.appointDate) {
					deltaCount = 3;
					postData['appointday'] = this.appointDate;
				}
				request.post('/user/consultation/postConsuMessageJson', postData).then(res => {
					console.log(res);
					if (res.code == 101) {
						uni.$emit('condetailData', {
						    msg: res['referer']
						})
						uni.navigateBack({
							delta: deltaCount
						});
						uni.showToast({
							title: '问诊发布成功'
						});
					} else {
						console.log(res.info);
						uni.showModal({
							title: '温馨提示',
							content: res.info,
							showCancel: false
						})
					}
				});

			},
		}
	}
</script>

<style>
	page {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		background-color: #FFFFFF;
		min-height: 100%;
		height: auto;
	}

	.tag-view {
		/* #ifndef APP-PLUS-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		justify-content: flex-start;
		align-items: flex-start;
	}

	.piccon-tag {
		margin-left: 20rpx;
		margin-right: 20rpx;
	}

	.piccon_button {
		width: 92%;
		padding: 0 72rpx;
		margin: 64rpx 32rpx;
		font-size: 48rpx;
		line-height: 1.8;
		border-radius: 8rpx;
		border-width: 0rpx;
		background-image: linear-gradient(90deg, #07C193, #3EAAB4);
	}
</style>
