<template>
	<view>
		<view class="guide-body">
			<view class="guide-paragraph">
				<view class="guide-section">
					<text>在系统设置的问诊单之外，请对照以下“问诊补充项目”，是否有遗漏，麻烦详实提供信息，甚至有所补充，并在此系统填写。</text>
				</view>
				<view class="guide-section"><text>
						除非是您认定的没有任何异常、任何不适和阳性表现的方面，否则不建议考虑予不提供或简略提供；如果您认为病情相关信息尚未完全提供，或者需要补充，请不要付药费，不要服用此前开出的任何药物。
					</text></view>
				<view class="guide-section"><text>
						医生在开具处方之前，如果确实没有等到您提供的某些相关信息，只能认为，您在那些方面没有任何异常和阳性表现，所以建议您一定认真按以上建议填写。
					</text></view>
				<view class="guide-remind"><text>
						温馨提醒，如您有违以上建议，所产生一切后果，您责任自负。
					</text></view>
				<view class="guide-section"><text class="text-tips">
						线上问诊填写重点：
					</text></view>
				<view class="guide-section"><text>
						年龄、性别、身高、体重等基本信息，饭量情况（大概是正常成人的多少），尤其是小朋友需要就诊的，请准确提供；
					</text></view>
				<view class="guide-section"><text>
						是否发热，是否去过疫区或接触过疫区来人，或接触过感染患者，或有任何形式的与疫情相关的流行病学关联；
					</text></view>
				<view class="guide-section"><text>
						既往药物及其他任何的过敏史，以及既往用某药或某些饮食后产生不良反应的病史，宗教、信仰、习俗等要求忌讳应用某些药物食物等情况都要写清楚；
					</text></view>
				<view class="guide-section"><text>
						心、肝、肾等重要脏器有无疾病，近期肝肾功能检查是否有异常（比如肌酐、转氨酶等）；
					</text></view>
				<view class="guide-section"><text>
						是否有脾胃不适，如反酸、恶心、呕吐、胃痛、胃胀、腹痛、腹泻等；
					</text></view>
				<view class="guide-section"><text>
						先写最不舒服、最重的症状或体征，之后是次要的，再之后是更次要的，以重要性为序写明；
					</text></view>
				<view class="guide-section"><text>
						呼吸方面问题，还要写明，咳嗽之前那一刻的感觉，比如是否咽喉一痒就咳，或因想把痰咳出来才咳嗽，或者气往上一顶就咳，或者咽喉正常而胸前正中觉得痒才咳，或者咽喉有异物感才咳，或者咽喉疼痛，或者因为其他不适……
					</text></view>
				<view class="guide-remind"><text class="text-remind">
						特别提示：在线咨询不能取代线下面诊，如出现发热、乏力、咳嗽、呼吸困难等呼吸道症状，请做好防护措施，及时就医。
					</text></view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {

		}
	}
</script>

<style>
	page {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		background-color: #ffffff;
		min-height: 100%;
		height: auto;
	}

	.guide-body {
		margin: 8rpx;
	}

	.guide-paragraph {
		margin: 16rpx;
		padding-top: 8rpx;
		padding-bottom: 16rpx;
	}

	.guide-section {
		margin: 24rpx;
		font-size: 28rpx;
		color: #535568;
		line-height: 48rpx;
		letter-spacing: 2rpx;
	}

	.guide-remind {
		margin: 36rpx 24rpx;
		font-size: 28rpx;
		color: #35BAAC;
		line-height: 40rpx;
		letter-spacing: 2rpx;
		background-color: #E4F6F4;
		padding: 32rpx 36rpx;
		border-radius: 16rpx;
	}

	.text-tips {
		color: #37BAAD;
		font-weight: bold;
	}

	.text-remind {
		line-height: 48rpx;
	}
</style>
