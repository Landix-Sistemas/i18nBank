<template>
  <div style="margin:20px; padding: 0px;">

    <br>
    <form class="form-signin" v-on:submit.prevent="submit()" style="text-align: center;">
      <q-input type="text" id="inputEmail" name="inputEmail" class="form-control" :placeholder="$t('Login.phEmail')" required autofocus v-model="USER_LOGIN" style="width: 100%;" />
      <q-input type="password" id="inputPassword" name="inputPassword" class="form-control" :placeholder="$t('Login.phPassword')" required v-model="USER_PASSW" style="width: 100%;" />
      <br>
      <q-btn color="primary" id="log_btn_entrar" type="submit">{{$t('Login.btnEnter')}}</q-btn><br>
    </form>

  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { LocalStorage } from 'quasar-framework/dist/quasar.mat.esm.js'
import store from '../store'
import axios from 'axios'

@Component({})
export default class Login extends Vue {
  USER_LOGIN = ''
  USER_PASSW = ''

  mounted () {
    Promise.resolve().then(async () => {
      // const conn = await RethinkConn()
      // let perfil = await ws.getPerfil(this.$route.query.invite);
      // if (perfil) window.location.replace(window.location.pathname + '#/');
    }).catch(() => undefined)
  }

  tratarErro (err: any) {
    if (err.response) { // axios error
      if (err.response.status === 401) { return alert('Não foi possível fazer login com o usuário/senha informados') }
      if (err.response.data && err.response.data.message) { return alert(err.response.data.message) }
      if (!err.response.status) { return alert('Erro ao comunicar com o servidor') }
      if (!err.message) { return alert('Erro ' + err.response.status) }
    }
    alert(err.message || 'Erro desconhecido')
  }

  submit () {
    const parametros = {
      USER_LOGIN: this.USER_LOGIN,
      USER_PASSW: this.USER_PASSW
    }
    Promise.resolve().then(async () => {
    // PostLogin.axiosReq(this.$axios, parametros).then((response) => {
    //   store.commit('setPerfil', response.perfil)
    //   // Events.$emit('perfil')
    //   if (response.sid) {
    //     Cookies.set('SID', response.sid, {
    //       // secure: true, // solicita ao navegador não enviar o SID se a conexão não for HTTPS
    //       expires: 366 // 366 dias
    //     })
    //   }
    //   this.USER_LOGIN = ''
    //   this.USER_PASSW = ''
    //   return window.location.replace(window.location.pathname + '#/')
    //   // window.location.replace(window.location.pathname)
    //   // window.location.reload()

      const response = await axios({url: store.state.servidorWS + '/login', method: 'get', params: parametros})
      LocalStorage.set('dbConnectionInfo', response.data)
      this.$router.push('/')
    }).catch(this.tratarErro)
  }
}
</script>

<style lang="stylus" scoped>
.form-signin
  max-width: 330px
  padding: 15px
  margin: 0 auto

.form-signin .form-control
  position: relative
  height: auto
  padding: 10px
  font-size: 16px

.form-signin input[type="email"]
  margin-bottom: -1px

.form-signin input[type="password"]
  margin-bottom: 10px
</style>
