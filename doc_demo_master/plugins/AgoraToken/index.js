/**** 此文件说明请看注释 *****/
// 可以用自己项目的请求方法
// 请求配置说明：https://ext.dcloud.net.cn/plugin?id=822
import $http from '@/common/request.js';
import store from '@/store/index.js';
/**** 结束 *****/

// AgoraToken默认方法
export default function(agoradata) {
	$http.post('/api/center/getAgoraToken', agoradata).then(
		res => {
			console.log(res);
			if (res.code == 101) {
				console.log("agoraToken", res.referer.token);
				store.commit('setAgoraToken', res.referer.token);
				console.log("store.state.agoraToken", store.state.agoraToken);
			}
		});
}

// 获取当前AgoraToken并返回
export const getChannelToken = function(agoradata, callback) {
	$http.post('/api/center/getAgoraToken', agoradata).then(
		res => {
			console.log(res);
			if (res.code == 101) {
				console.log("agoraToken", res.referer.token);
				store.commit('setAgoraToken', res.referer.token);
				callback && callback({
					agoraToken: res.referer.token
				});
			}
		});
}
