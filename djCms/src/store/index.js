import Vue from 'vue'
import Vuex from 'vuex'
// import * as actions from './actions'
// import * as getters from './getters'

Vue.use(Vuex);


//types
const types = {
    USER_INFO: 'USER_INFO',
};

// state
const state = {
    userInfo: null,
};

// getters
const getters = {
    userInfo: state => state.userInfo,
};

// mutations
const mutations = {
    [types.USER_INFO](state, userInfo) {
        if (userInfo) {
            state.userInfo = userInfo;
        } else {
            state.userInfo = null;
        }
    },
};

// actions
const actions = {
    setUserInfo: ({ commit }, userInfo) => {
        commit(types.USER_INFO, userInfo);
    },
};

export default new Vuex.Store({
    state,
    getters,
    mutations,
    actions
});