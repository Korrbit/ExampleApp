import Vue from 'vue'
import Vuex from 'vuex'
import {API} from '../components/globals/api'

Vue.use(Vuex)

const state = {
  data: [],
  result: [],
  user: '',
  file: []
}

const configMultiPart = {
    header : {
      'Content-Type' : 'multipart/form-data'
    }
  }

const mutations = {
  RECEIVE_API (state, { api }) {
    state.data.push(api)
  },
  RESULT_API (state, { api }) {
    state.result.push(api)
  },
  CLEAR_API (state) {
    while (state.data.length) {
      state.data.pop()
    }
    while (state.result.length) {
      state.result.pop()
    }
  },
  SET_USER (state, { user }) {
    state.user = user
  },
  SET_FILE (state, { api }) {
    state.data.push(api)
  }
}

const actions = {
  async USER_LOGIN ({ commit }, name) {
    commit('SET_USER', { user: name })
  },
  async CLEAR_API ({ commit }, name) {
    commit('CLEAR_API')
  },
  async FETCH_API ({ commit }, name) {
    const { data, status, config } = await API.get(name)
    var returnApi
    if (data.api == null) {
      returnApi = { data: data, status: status, url: config.url }
      commit('RECEIVE_API', { api: returnApi })
    } else {
      returnApi = { data: data.response, status: status, url: config.url }
      commit('RECEIVE_API', { api: returnApi })
      returnApi = { data: data.api.response, status: data.api.status, url: data.api.url }
      commit('RECEIVE_API', { api: returnApi })
    }
    console.log('data: ')
    console.log(returnApi.data)
    console.log('status: ')
    console.log(returnApi.status)
    console.log('url: ')
    console.log(returnApi.url)
  },
  SEND_API ({ commit }, postdata) {
    return new Promise((resolve, reject) => {
      console.log('post data: ')
      console.log(postdata)
      // const { data, status, config } =
      API.post(postdata.page, postdata.data).then(response => {
        var data = response.data
        var status = response.status
        var config = response.config
        var returnApi
        if (data.api == null) {
          returnApi = { data: data, status: status, url: config.url }
          commit('RECEIVE_API', { api: returnApi })
          commit('RESULT_API', { api: returnApi.data })
          resolve(returnApi.data)
        } else {
          returnApi = { data: data.response, status: status, url: config.url }
          commit('RECEIVE_API', { api: returnApi })
          commit('RESULT_API', { api: returnApi.data })
          returnApi = { data: data.api.response, status: data.api.status, url: data.api.url }
          commit('RECEIVE_API', { api: returnApi })
          resolve(data.response)
        }
        console.log('data: ')
        console.log(returnApi.data)
        console.log('status: ')
        console.log(returnApi.status)
        console.log('url: ')
        console.log(returnApi.url)
      }, error => {
        // http failed, let the calling function know that action did not work out
        if (error) {
          reject(error)
        }
      })
    })
  },
  SENDMULTI_API ({ commit }, postdata) {
    return new Promise((resolve, reject) => {
      console.log('post data: ')
      console.log(postdata)
      // const { data, status, config } =
      API.post(postdata.page, postdata.data, configMultiPart).then(response => {

        commit('SET_FILE', { api: response.data })
        resolve(response.data)

      }, error => {
        // http failed, let the calling function know that action did not work out
        if (error) {
          reject(error)
        }
      })
    })
  }
}

const getters = {
  api: state => {
    return state.data.map(data => {
      return {
        data: data.data,
        url: data.url,
        status: data.status
      }
    })
  },
  result: state => {
    return state.result
  },
  user: state => {
    return state.user
  },
  file: state => {
    return state.file
  }
}

const store = new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})

export default store
