<template>
	<view>
		<uni-nav-bar :status-bar="true" backgroundColor="#F7F8FA" left-icon="back" :border="false"
			@clickLeft="goBackAction">
			<view class="uni-navbar__header-container uni-navbar__content_view">
				<view class="uni-navbar__header-container-inner uni-navbar__column_view">
					<text class="uni-nav-bar-text">选择预约时间</text>
					<text class="uni-nav-bar-note">仅可预约未来七天 医生会在预约时间联系你</text>
				</view>
			</view>
		</uni-nav-bar>
		<view class="uni-calendar__box">
			<view class="uni-calendar__title-bg">
				<text class="uni-calendar__title-line"></text>
				<text class="uni-calendar__title-text">{{nowMonth}}</text>
				<text class="uni-calendar__title-line"></text>
			</view>
			<view class="uni-calendar__weeks">
				<view class="uni-calendar__weeks-day" v-for="(value, index) in applydayArray"
					@click="applySelectAction(index)">
					<text class="uni-calendar__weeks-day-text">{{value.sweek}}</text>
					<text
						:class="applyIndex === index?'uni-calendar__weeks-day-sbox':'uni-calendar__weeks-day-box'">{{value.sday}}</text>
				</view>
			</view>
		</view>
		<view class="uni-flex">
			<text class="piccon_section">上午</text>
		</view>
		<view>
			<uni-list :border="false">
				<uni-list-item v-for="(value, index) in mortimesArray" :key="index" :title="value" clickable
					@click="selectamTime(index)" />
			</uni-list>
		</view>
		<view class="uni-flex">
			<text class="piccon_section">下午</text>
		</view>
		<view>
			<uni-list :border="false">
				<uni-list-item v-for="(value, index) in afttimesArray" :key="index" :title="value" clickable
					@click="selectpmTime(index)" />
			</uni-list>
		</view>
	</view>
</template>

<script>
	var solarMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
	var solarWeeks = ['日', '一', '二', '三', '四', '五', '六']
	var solarMonths = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
	export default {
		components: {

		},
		data() {
			const date = new Date();
			const curYear = date.getFullYear();
			const cmonth = date.getMonth();
			const cdate = date.getDate();
			const cday = date.getDay();
			return {
				detailData: {},
				ctype: 2,
				curYear: curYear,
				cmonth: cmonth,
				cdate: cdate,
				cday: cday,
				nowMonth: '一月',
				applyIndex: 0,
				applydayArray: [],
				mortimesArray: [],
				afttimesArray: [],
				appointDay: ''
			}
		},
		computed: {

		},
		onLoad(options) {
			// 获取日历方法实例
			this.ctype = options.ctype;
			this.detailData = JSON.parse(options.detailData);
			this.appointDay = this.curYear + "-" + (this.cmonth+1) + "-" + this.cdate;
			console.log(this.appointDay);
			this.getApplyDay(6);
			this.getMorArray(6);
			this.getAfterArray(6);
		},
		methods: {
			// 返回上一步
			goBackAction() {
				uni.navigateBack({
					delta: 1
				});
			},
			/**
			 * 初始化日期显示
			 * @param {Object} date
			 */
			getApplyDay(count) {
				const date = new Date();
				this.nowMonth = solarMonths[this.cmonth];
				let monthdays = solarMonth[this.cmonth];
				for (let i = 0; i < count + 1; i++) {
					this.cday = this.cday < 7 ? this.cday : this.cday - 7;
					if (this.cdate > monthdays) {
						this.cdate = this.cdate - monthdays;
						this.cmonth = this.cmonth + 1;
					}
					let applyDay = {
						"sweek": solarWeeks[this.cday++],
						"sday": this.cdate++,
						"smonth": this.cmonth
					};
					this.applydayArray.push(applyDay);
				}
				// console.log(this.applydayArray);
			},
			applySelectAction(index) {
				this.applyIndex = index;
				this.nowMonth = solarMonths[this.applydayArray[index].smonth];
				this.appointDay = this.curYear + "-" + (this.applydayArray[index].smonth+1) + "-" + this.applydayArray[
					index].sday;
				console.log("预约时间为:" + this.appointDay);
			},
			getMorArray(count) {
				let endtime = 12;
				for (let i = 0; i < count; i++) {
					let mortime = endtime - 1 + ":00-" + (endtime--) + ":00";
					this.mortimesArray.unshift(mortime)
				}
			},
			getAfterArray(count) {
				let starttime = 12;
				for (let i = 0; i < count; i++) {
					let afttime = starttime + ":00-" + (++starttime) + ":00";
					this.afttimesArray.push(afttime)
				}
			},
			selectamTime(index) {
				let appointDate = this.appointDay + " " + (6 + index) + ":00:00";
				console.log(appointDate);
				uni.navigateTo({
					url: 'picconsultation11?detailData=' + JSON.stringify(this.detailData) + '&ctype=' + this.ctype + '&appointDate=' +
						appointDate
				});
			},
			selectpmTime(index) {
				let appointDate = this.appointDay + " " + (12 + index) + ":00:00";
				console.log(appointDate);
				uni.navigateTo({
					url: 'picconsultation11?detailData=' + JSON.stringify(this.detailData) + '&ctype=' + this.ctype + '&appointDate=' +
						appointDate
				});
			}
		}
	}
</script>

<style>
	page {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		background-color: #F7F8FA;
		min-height: 100%;
		height: auto;
		text-align: center;
	}

	.uni-navbar__header-container {
		flex: 1;
	}

	.uni-navbar__header-container-inner {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex: 1;
		align-items: center;
		justify-content: center;
		font-size: 14px;
	}

	.uni-navbar__content_view {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		align-items: center;
		flex-direction: row;
	}

	.uni-navbar__column_view {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		align-items: center;
		flex-direction: column;
	}

	.uni-nav-bar-text {
		font-size: 28rpx;
		line-height: 30rpx;
	}

	.uni-nav-bar-note {
		color: #BFC0C8;
		font-size: 20rpx;
	}

	.uni-calendar__weeks {
		position: relative;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		margin-top: 16rpx;
		margin-bottom: 48rpx;
	}

	.uni-calendar__weeks-item {
		flex: 1;
	}

	.uni-calendar__weeks-day {
		flex: 1;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 45px;
	}

	.uni-calendar__weeks-day-text {
		font-size: 24rpx;
	}

	.uni-calendar__weeks-day-box {
		color: #0f0f0f;
		background-color: #FFFFFF;
	}

	.uni-calendar__weeks-day-sbox {
		color: #FFFFFF;
		width: 48rpx;
		height: 64rpx;
		background-color: #1DB8A0;
	}

	.uni-calendar__box {
		margin-top: 32rpx;
		display: flex;
		flex-direction: column;
		position: relative;
		background-color: #FFFFFF;
	}

	.uni-calendar__title-bg {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		justify-content: center;
		align-items: center;
		margin: 48rpx 48rpx 32rpx;
	}

	.uni-calendar__title-line {
		height: 2rpx;
		flex: 1;
		background-color: #E7EAF1;
	}

	.uni-calendar__title-text {
		font-size: 32rpx;
		flex: 1;
		line-height: 1;
	}

	.piccon_section {
		margin: 24rpx 32rpx;
		font-size: 24rpx;
		color: #BFC0C8;
		letter-spacing: 2rpx;
		font-family: "SimHei";
	}
</style>
