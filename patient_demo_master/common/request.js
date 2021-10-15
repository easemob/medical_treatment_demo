import $C from '@/common/config.js';
export default {
	common: {
		method: 'GET',
		header: {
			"content-type": "application/x-www-form-urlencoded"
		},
		data: {}
	},
	request(options = {}) {
		uni.showLoading({
			mask: true
		})
		options.url = (options.url.indexOf("http") == 0) ? options.url : $C.webUrl + options.url
		options.method = options.method || this.common.method
		options.header = options.header || this.common.header
		// console.log(options.url);
		// 验证权限token

		return new Promise((res, rej) => {
			uni.request({
				...options,
				success: (result) => {
					// console.log(result);
					// 请求服务端失败
					if (result.statusCode !== 200) {
						uni.showToast({
							title: result.data.info || '请求失败',
							icon: 'none'
						});
						uni.hideLoading()
						return rej(result.data)
					}
					// 成功
					res(result.data)
					// console.log(result.data);
					uni.hideLoading()
				},
				fail: (error) => {
					uni.showToast({
						title: error.errMsg || '请求失败',
						icon: 'none'
					});
					uni.hideLoading()
					return rej()
				}
			});
		})
	},
	get(url, data = {}, options = {}) {
		options.url = url
		options.data = data
		options.method = 'GET'
		return this.request(options)
	},
	post(url, data = {}, options = {}) {
		options.url = url
		options.data = data
		options.method = 'POST'
		return this.request(options)
	}
}

// 七牛云上传
const qiniuUploadFile = function(uploadPath) {
	this.get('/index/get_QiniuAuthJSON').then(res => {
		if(res.code == 101){
			let uploadToken=res.referer;
			let updateUrl = 'images/2021-07/'+time();
			// 交给七牛上传
			qiniuUploader.upload(uploadPath, (res) => {
				resolve(res.imageURL);
			}, (error) => {
				reject(error);
			}, {
				region: 'SCN', //地区
				domain: 'http://qiniu.500-china.com', // bucket 域名，下载资源时用到。
				key: updateUrl, //七牛文件名
				uptoken: uploadToken, // 由其他程序生成七牛 uptoken
				uptokenURL: 'UpTokenURL.com/uptoken' // 上传地址
			}, (res) => {
				console.log(requestInfo);
				requestInfo.onProgressUpdate && requestInfo.onProgressUpdate(Object.assign({}, fileData, res));
			});
		}
	});
}
