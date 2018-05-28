import Vue from 'vue'
import Vuex, { Store } from 'vuex'

Vue.use(Vuex)

interface State {
  servidorWS: string
  perfil: any // PerfilFront
}

const store: Store<State> = new Vuex.Store({
  state: {
    servidorWS: '//localhost:3100',
    perfil: null as any // Informações do usuário logado
  } as State,
  mutations: {
    // someMutation (state) {  }
    setPerfil (state, perfil) {
      state.perfil = perfil
    }
  },
  getters: {
    // someGetter (state) {  }
    getPerfil (state) {
      return () => {
        return state.perfil
      }
    }
  },
  actions: {
    // someAction (state) {  }
  }
})

export default store
