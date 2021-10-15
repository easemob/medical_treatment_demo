import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		hasLogin: false,
		userid: "",
		userLogin: "",
		userPass:"",
		loginData:{},
		agoraToken: "",
	    colorIndex: 0,
	    colorList: ['#FF0000','#00FF00','#0000FF']
	},
	mutations: {
		login(state, data) {
			state.hasLogin = true;
			state.userid = data.id;
			state.loginData = data;
			state.userLogin = data.user_login;
		},
		logout(state) {
			state.hasLogin = false
			state.userid = ""
			state.userLogin = ""
			state.loginData = {}
		},
		savePass(state, userPass) {
			state.userPass = userPass
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
