import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		hasLogin: false,
		userid: "",
		userLogin: "",
		agoraToken: "",
	    colorIndex: 0,
	    colorList: ['#FF0000','#00FF00','#0000FF']
	},
	mutations: {
		login(state, userid) {
			state.hasLogin = true;
			state.userid = userid;
		},
		logout(state) {
			state.hasLogin = false
			state.userid = 0
		},
		setOpenid(state, userid) {
			state.userid = userid
		},
		setAgoraToken(state, token) {
			state.agoraToken = token
		}
	},
	getters:{
	    currentState(state){
	        return state.hasLogin
	    },
		getAgoraToken(state){
		    return state.agoraToken
		}
	},
	actions: {
		// lazy loading openid
		
	}
})
