<template>
	<view>
		<view class="flex align-center">
			<uni-list :border="true">
				<uni-section title="请如实上传您的资料" titleBolder type="line" typeColor="success"></uni-section>
				<uni-list-item>
					<template slot="header">
						<view class="review-header-section">
							<text class="review-column-tag">*</text>
							<text>真实姓名</text>
						</view>
					</template>
					<template slot="body">
						<input @input="onkeyupInput" class="uni-input" name="docname" v-model="docname" maxlength="5"
							placeholder="请填写您的真实姓名" />
					</template>
				</uni-list-item>
				<uni-list-item>
					<template slot="header">
						<view class="review-header-section">
							<text class="review-column-tag">*</text>
							<text>就职医院</text>
						</view>
					</template>
					<template slot="body">
						<input @input="onkeyupInput1" class="uni-input"
							name="dochospital" v-model="dochospital" maxlength="12" placeholder="您填写您目前所执业的医院(5字以上)" />
					</template>
				</uni-list-item>
				<uni-list-item>
					<template slot="header">
						<view class="review-header-section">
							<text class="review-column-tag">*</text>
							<text>所属科室</text>
						</view>
					</template>
					<template slot="body">
						<input @input="onkeyupInput2" class="uni-input"
							name="docpartment" v-model="docpartment" maxlength="8" placeholder="请填写您所属的科室" />
					</template>
				</uni-list-item>
				<uni-list-item>
					<template slot="header">
						<view class="review-header-section">
							<text class="review-column-tag">*</text>
							<text>职称</text>
						</view>
					</template>
					<template slot="body">
						<input @input="onkeyupInput3" class="uni-input" name="doclevel"
							v-model="doclevel" maxlength="8" placeholder="请填写您目前的职称" />
					</template>
				</uni-list-item>
				<view class="uni-review-section"></view>
				<uni-list-item :border="false">
					<template slot="header">
						<view class="review-header-section">
							<text class="review-column-tag">*</text>
							<text>擅长领域</text>
						</view>
					</template>
					<template slot="body">
						<input class="uni-input" name="docexpert" v-model="docexpert" maxlength="25"
							placeholder="请填写您擅长的治疗领域(2字以上)" />
					</template>
				</uni-list-item>
				<uni-list-item>
					<template slot="header">
						<view class="review-header-section">
							<text class="review-column-tag">*</text>
							<text>个人简介</text>
						</view>
					</template>
					<template slot="body">
						<input class="uni-input" name="docresume" v-model="docresume" maxlength="25"
							placeholder="请填写个人简介(8字以上)" />
					</template>
				</uni-list-item>
				<uni-list-item>
					<template slot="header">
						<view class="review-header-section">
							<text class="review-column-tag">*</text>
							<text>职业经历</text>
						</view>
					</template>
					<template slot="body">
						<input class="uni-input" name="docexperience" v-model="docexperience" maxlength="25"
							placeholder="请填写您的职业经历(8字以上)" />
					</template>
				</uni-list-item>
			</uni-list>
		</view>
		<view class="uni-flex mt-20">
			<button type="primary" class="piccon_button" @click="picodoneAction12"><text
					class="font-md">继续认证</text></button>
		</view>
	</view>
</template>

<script>
	import request from '@/common/request.js';
	export default {
		data() {
			return {
				rid: "",
				docname: "",
				dochospital: "",
				docpartment: "",
				doclevel: "",
				docexpert: "",
				docresume: "",
				docexperience: ""
			}
		},
		onLoad(options) {
			this.rid = options.rid;
		},
		methods: {
			onkeyupInput: function(event) {
				var value = event.detail.value;
				if (!value || value == " ") {
					return '';
				}
				const rule = /[^\u4E00-\u9FA5]{2,5}$/; //2-5个中文字正则表达式
				this.$nextTick(function() {
					this.docname = value.replace(rule, '');
				})
			},
			onkeyupInput1: function(event) {
				var value = event.detail.value;
				if (!value || value == " ") {
					return '';
				}
				const rule = /[^\u4E00-\u9FA5]{4,12}$/; 
				this.$nextTick(function() {
					this.dochospital = value.replace(rule, '');
				})
			},
			onkeyupInput2: function(event) {
				var value = event.detail.value;
				if (!value || value == " ") {
					return '';
				}
				const rule = /[^\u4E00-\u9FA5]{2,9}$/; 
				this.$nextTick(function() {
					this.docpartment = value.replace(rule, '');
				})
			},
			onkeyupInput3: function(event) {
				var value = event.detail.value;
				if (!value || value == " ") {
					return '';
				}
				const rule = /[^\u4E00-\u9FA5]{2,8}$/; 
				this.$nextTick(function() {
					this.doclevel = value.replace(rule, '');
				})
			},
			picodoneAction12: function() {
				if (this.docname.length < 2) {
					return uni.showToast({
						icon:'none',
						title: '请完善真实姓名'
					})
				}
				if (this.dochospital.length < 5) {
					return uni.showToast({
						icon:'none',
						title: '请完善就职医院,5字以上'
					})
				}
				if (this.docpartment.length < 2) {
					return uni.showToast({
						icon:'none',
						title: '请完善所属科室'
					})
				}
				if (this.doclevel.length < 2) {
					return uni.showToast({
						icon:'none',
						title: '请完善职称'
					})
				}
				if (this.docexpert.length < 2) {
					return uni.showToast({
						icon:'none',
						title: '请完善擅长领域'
					})
				}
				if (this.docresume.length < 8) {
					return uni.showToast({
						icon:'none',
						title: '请完善个人简介,8字以上'
					})
				}
				if (this.docexperience.length < 8) {
					return uni.showToast({
						icon:'none',
						title: '请完善职业经历,8字以上'
					})
				}
				let postData = {
					rid: this.rid,
					docname: this.docname,
					dochospital: this.dochospital,
					docpartment: this.docpartment,
					doclevel: this.doclevel,
					docexpert: this.docexpert,
					docresume: this.docresume,
					docexperience: this.docexperience,
					doctag: '三级甲等',
					doc_status: 2
				}
				
				request.post('/user/index/saveDoctorJson', postData).then(res => {
					console.log(res);
					if (res.code == 101) {
						uni.navigateTo({
							url: 'review-two?rid=' + this.rid
						});
					} else {
						uni.showToast({
							title: res.info,
							icon: 'none'
						});
						console.log(res.info);
					}
				});
			},
		}
	}
</script>

<style>
	@import url("review.css");
</style>
