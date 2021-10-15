<template>
	<view class="review-main">
		<view class="flex-column">
			<view class="review-header" v-show="reviewState=='1'">
				<image src="@/static/icons/icon_review_review.png" class="review-header-image" />
				<text class="review-header-title">医师认证审核中</text>
				<text class="review-header-message">我们会在1-2个工作日内给予审核结果，请耐心等待</text>
			</view>
			<view class="review-header" v-show="reviewState=='2'">
				<image src="@/static/icons/icon_review_success.png" class="review-header-image" />
				<text class="review-header-title">医师认证成功</text>
			</view>
			<view class="review-header" v-show="reviewState=='3'">
				<image src="@/static/icons/icon_review_error.png" class="review-header-image" />
				<text class="review-header-title">医师认证失败</text>
				<text class="review-header-message">拒绝原因：您提交的信息无法确认职业医师的身份，请点击重新订证，按照资料上传要求相关认证信息</text>
			</view>
		</view>
		<view class="flex-column" v-show="true">
			<view class="review-column">
				<view class="review-column-section">
					<text class="review-column-tag">*</text>
					<text>医生头像</text>
				</view>
				<view class="review_column_picview">
					<image class="review_avatar_image" :src="reviewPath" mode="aspectFill" />
				</view>
			</view>
			<view class="review-column">
				<view class="review-column-section">
					<text class="review-column-tag">*</text>
					<text>身份证件(正反面均需上传)</text>
				</view>
				<view class="review_column_picview">
					<image class="review_column_image" :src="reviewPath1" mode="aspectFill" />
					<image class="review_column_image" :src="reviewPath2" mode="aspectFill" />
				</view>
			</view>
			<view class="review-column">
				<view class="review-column-section">
					<text class="review-column-tag">*</text>
					<text>胸牌/执业证/资格证/职称证，至少上传一项</text>
				</view>
				<view class="review_column_picview">
					<image class="review_column_image" :src="reviewPath3" mode="aspectFill" />
				</view>
				<view class="review-column-footer">
					<text>照片仅用作认证，平台会保护您的隐私，不会泄漏给第三方</text>
				</view>
			</view>
		</view>
		<view class="review_btn">
			<button hover-class="btn_hover" @tap="reviewAction">{{reviewButton}}</button>
		</view>
	</view>
</template>

<script>
	import request from '@/common/request.js';
	export default {
		data() {
			return {
				userData: {},
				rid:'',
				reviewState: '1',
				reviewButton: "修改认证",
				uploadToken: '',
				reviewPath: require('@/static/icons/icon_docavatar.png'),
				reviewPath1: require('@/static/icons/icon_accustomfront.png'),
				reviewPath2: require('@/static/icons/icon_accustomback.png'),
				reviewPath3: require('@/static/icons/icon_accustomground.png')
			}
		},
		onLoad() {
			
		},
		onShow: function() {
			uni.getStorage({
				key: "user-info",
				success: (res) => {
					if (res.data) {
						this.userData = JSON.parse(res.data);
						this.rid = this.userData.rid;
						this.reviewPath = this.userData.avatar;
						this.reviewPath1 = this.userData.doc_img1;
						this.reviewPath2 = this.userData.doc_img2;
						this.reviewPath3 = this.userData.doc_img3;
						this.reviewState = this.userData.doc_status;
					}
				}
			});
		},
		onPullDownRefresh() {
			console.log("pullrefresh");
			request.post('/user/doctor/getDoctorJson', {
				userid: this.userData.id
			}).then(res => {
				if (res.code == 101) {
					this.reviewPath = res.referer.avatar;
					this.reviewPath1 = res.referer.doc_img1;
					this.reviewPath2 = res.referer.doc_img2;
					this.reviewPath3 = res.referer.doc_img3;
					this.reviewState = res.referer.doc_status;
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
			reviewAction: function() {
				uni.navigateTo({
					url: "../review/review-one?rid=" + this.rid
				});
			}
		}
	}
</script>

<style>
	@import url("review.css");
</style>
