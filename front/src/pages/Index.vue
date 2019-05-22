<template>
  <q-layout>
    <q-header elevated class="q-pa-md q-gutter-y-sm bg-black text-white titlebar">
      <q-toolbar-title inset>
        I18N Bank &amp; Manager
      </q-toolbar-title>
    </q-header>
    <q-page-container>
      <q-card>
        <q-card-section>
          <div class="row items-center justify-between filters">
            <div>
              <q-btn color="secondary" icon="add">Nova label</q-btn>
            </div>
            <div>
              <q-btn color="secondary" icon="file_upload" @click="importFilesDialog = true">Importar Arquivo</q-btn>
            </div>
            <div>
              <q-btn color="secondary" icon="cancel">Traduzir Incomp.</q-btn>
            </div>
            <div class="row items-center">
              <q-btn color="secondary" icon="filter_list">Incompletos</q-btn>
              <q-btn color="secondary" icon="filter_list">Todos</q-btn>
              <q-input
                :debounce="600"
                float-label="Buscar"
                placeholder=""
              />
            </div>
          </div>
          <div class="row">
            <div class="col-md-12">
              <table class="q-table bordered striped-odd horizontal-separator vertical-separator responsive">
                <thead>
                  <tr>
                    <th class="text-left">Chave</th>
                    <th class="text-left" v-for="(lang, index) in selectedLanguages" :key="index">{{lang}}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(label, index) in filteredTranslations" :key="index">
                    <td>{{ label.key }}</td>
                    <td class="text-left" v-for="(lang, index) in selectedLanguages" :key="index" :data-th="lang">
                      {{label.lang[lang] ? label.lang[lang][0].value : '-'}}
                      <q-btn small flat>
                        <q-icon name="edit" />
                      </q-btn>
                      <q-btn small flat>
                        <q-icon name="add" />
                        <q-icon name="fa-database" />
                      </q-btn>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <q-dialog v-model="importFilesDialog" persistent>
      <q-card style="width: 700px; max-width: 80vw;">
        <q-bar class="row items-center bg-black text-white">
          <div class="text-h6 q-pl-sm">Importar arquivo de tradução</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-bar>
        <q-card-section class="layout-padding importFilesContent">
          <div class="row">

            <div class="col-md-6">
              <p v-for="file in selectedFiles" :key="file.id">
                {{ file.name }} | Idioma: {{ file.language }}
              </p>
            </div>
            <div class="col-md-6">
              <div class="row">
                <input
                  type="file"
                  @change="file = $event.target.files"
                  class="input-file"
                >
              </div>
              <div class="row">
                <div style="width: 500px; max-width: 90vw;">
                  <q-select
                    v-model="fileLanguage"
                    float-label="Idioma"
                    :options="languages"
                  />
                </div>
              </div>
            </div>

          </div>
        </q-card-section>

        <q-bar align="right" class="row bg-black text-white">
          <q-space />
          <q-btn flat @click="addFile">
            <q-icon name="check" />
            Confirmar
          </q-btn>
        </q-bar>
      </q-card>
    </q-dialog>

    </q-page-container>
  </q-layout>
</template>

<script>
/* emilia porque tem que colocar este import se já temno quasar.config plugins ??? */
import {
  Loading
} from 'quasar'
import _ from 'Lodash'
export default {
  name: 'i18n',
  data () {
    return {
      importFilesDialog: false,
      file: null,
      selectedFiles: [],
      languages: ['Espanhol', 'Ingles'],
      selectedLanguages: [],
      fileLanguage: null,
      filteredTranslations: []
    }
  },
  methods: {
    /**
     * Add a JSON or RESX translation file
     *
     * @return {void}
     */
    addFile () {
      console.log('addFile')
      // Check if a file was seletected
      if (!this.file.length) return

      console.log('addFile2')

      // Check if the file was already add
      if (_.find(this.selectedFiles, { 'path': this.file[0].path })) {
        return
      }

      Loading.show()

      let that = this
      let fileId = this.guid() // generete a new ID for the file

      // Add the to the list of inserted languages
      if (!_.find(this.selectedLanguages, (item) => { return item === that.fileLanguage })) {
        this.selectedLanguages.push(that.fileLanguage)
      }

      // Add to the list of selected files
      this.selectedFiles.push({
        id: fileId,
        name: this.file[0].name,
        language: that.fileLanguage,
        path: this.file[0].path,
        selected: false
      })
      /*
      let reader = new FileReader()

      // On File load
      reader.onload = (e) => {
        if (e.target.result) {
          if (this.file[0].name.endsWith('.json')) {
            // Parse JSON file and create a translation object
            _.each(JSON.parse(e.target.result), (value, key) => {
              let group = key
              _.each(value, (value, key) => {
                this.translations.push({
                  fileID: fileId,
                  group: group,
                  key: key,
                  value: value,
                  language: that.fileLanguage
                })
              })
            })
          }
          else if (this.file[0].name.endsWith('.resx')) {
            // Parse RESX file and create a translation object
            const resx2js = require('resx/resx2js')
            resx2js(e.target.result, (err, res) => {
              if (err) {
                console.log('error converting file to json', err)
              }
              else {
                _.each(res, (value, key) => {
                  this.translations.push({
                    fileID: fileId,
                    group: this.UnFormatGroup(key.split('_')[0], 'resx'),
                    key: key.split('_')[1],
                    value: value,
                    language: that.fileLanguage
                  })
                })
              }
            })
          }
        }
      }

      reader.onloadend = () => { Loading.hide() }

      reader.readAsText(this.file[0])
      this.$refs.importFilesModal.close() */
    },

    /**
     * Generate a new GUID.
     *
     * @return {string} the GUID.
     */
    guid () {
      function s4 () {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1)
      }
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4()
    }
  }
}
</script>

<style lang="stylus">
table
  width 100%
  &.q-table
    thead
      text-align left
      vertical-align bottom
      font-weight 700
      text-transform uppercase
      background #333
      color white
      font-size 16px

.filters
  button
    width 200px
    margin 5px

::-webkit-scrollbar-track
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3)
  border-radius: 0
  background-color: #333

::-webkit-scrollbar
  width: 12px
  background-color: #F5F5F5

::-webkit-scrollbar-thumb
  border-radius: 10px
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3)
  background-color: #999

dl
  overflow auto
  height 130px
  margin-top 55px
  margin-bottom 5px

dd
  &::before
    content '-'

dd
  margin-left 13px

.importFilesContent
  overflow auto
  height 220px

.newTranslationContent
  overflow auto
  height 350px

.q-checkbox
  padding 0 10px 0 10px

</style>
