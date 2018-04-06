<template>
  <div style="padding: 20px;">

    <br>
    <form class="form-signin" v-on:submit.prevent="submit()" style="text-align: center;">
      <q-input type="text" id="inputEmail" name="inputEmail" class="form-control" placeholder="Email" required autofocus v-model="USER_LOGIN" style="width: 100%;" />
      <q-input type="password" id="inputPassword" name="inputPassword" class="form-control" placeholder="Senha" required v-model="USER_PASSW" style="width: 100%;" />
      <br>
      <q-btn color="primary" id="log_btn_entrar" type="submit">Entrar</q-btn><br>
    </form>

  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import axios from 'axios'
import { LocalStorage } from 'quasar-framework/dist/quasar.mat.esm.js'


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

  tratarErro (response: any) {
    if (response.status === 401) return alert('Não foi possível fazer login com o usuário/senha informados')
    alert(response.message || response.data.message || ('Erro ' + response.status))
  }

  submit () {
    const parametros = {
      USER_LOGIN: this.USER_LOGIN,
      USER_PASSW: this.USER_PASSW
    }
    Promise.resolve().then(async () => {
      const response = await axios({url: 'http://localhost:3100/login', method: 'get', params: parametros})
      LocalStorage.set('dbConnectionInfo', response.data)
      this.$router.push('/')
    }).catch(this.tratarErro)
  }
}
</script>

<style lang="css" scoped>
  .form-signin {
    max-width: 330px;
    padding: 15px;
    margin: 0 auto;
  }
  .form-signin .form-control {
    position: relative;
    height: auto;
    padding: 10px;
    font-size: 16px;
  }
  .form-signin input[type="email"] {
    margin-bottom: -1px;
  }
  .form-signin input[type="password"] {
    margin-bottom: 10px;
  }
</style>
