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
              <q-btn color="secondary" icon="filter_list" @click="filterIncomplete">Incompletos</q-btn>
              <q-btn color="secondary" icon="filter_list">Todos</q-btn>
              <q-input borderless dense debounce="300" v-model="filter" placeholder="Buscar">
                <template v-slot:prepend>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12">
              <q-table
                :data="data"
                :columns="columns"
                row-key="name"
                :filter="filter"
                :pagination.sync="pagination"
              >
                <!--<template v-slot:body="props">
                  <q-tr :props="props">
                    <q-td key="chave" :props="props">{{ props.row.name }}</q-td>
                    <q-td key="Espanhol" :props="props">
                      {{ props.row.Espanhol }}
                      <q-popup-edit v-model="props.row.Espanhol" title="Update" buttons>
                        <q-input v-model="props.row.Espanhol" dense autofocus />
                      </q-popup-edit>
                    </q-td>
                    <q-td key="Inglês" :props="props">
                      {{ props.row.Inglês }}
                      <q-popup-edit v-model="props.row.Inglês" title="Update Inglês" buttons>
                        <q-input v-model="props.row.Inglês" dense autofocus />
                      </q-popup-edit>
                    </q-td>
                  </q-tr>
                </template>-->
                <template v-slot:body="props">
                  <q-tr :props="props">
                    <q-td key="chave" :props="props">{{ props.row.name }}</q-td>
                    <q-td v-for="(lang) in selectedLanguages" :props="props" :key="lang">
                      {{props.row[lang] ? props.row[lang] : '-'}}
                        <!--<q-btn small flat @click="editTranslation(props.row[lang], lang)">-->
                        <!--<q-btn small flat @click="editTranslationDialog = true">-->
                        <q-btn small flat @click="editTranslation(props.row.name, props.row[lang], lang); editTranslationDialog = true">
                        <q-icon name="edit" />
                      </q-btn>
                      <q-btn small flat>
                        <q-icon name="save_alt" />
                      </q-btn>
                    </q-td>
                  </q-tr>
                </template>
              </q-table>
              <!--<q-markup-table class="q-table bordered striped-odd horizontal-separator vertical-separator responsive">
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
              </q-markup-table>-->
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
          <q-btn flat @click="addFile" v-close-popup>
            <q-icon name="check" />
            Confirmar
          </q-btn>
        </q-bar>
      </q-card>
    </q-dialog>
    <q-dialog v-model="editTranslationDialog" ref="editTranslationDialog" persistent>
      <q-card style="width: 700px; max-width: 80vw;">
        <q-bar class="row items-center bg-black text-white">
          <div class="text-h6 q-pl-sm">Editar</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-bar>
        <q-card-section class="layout-padding importFilesContent">
            <div class="col-md-9">
              <q-input v-model="edit.text" float-label="Digite a tradução ou digite em portugues e aperte no botão traduzir" />
            </div>
        </q-card-section>

        <q-bar align="right" class="row bg-black text-white">
          <q-space />
          <q-btn flat @click="saveEdition" v-close-popup>
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
      filter: '',
      pagination: {
        sortBy: 'name',
        descending: false,
        page: 1,
        rowsPerPage: 10
      },
      columns: [],
      data: [],
      importFilesDialog: false,
      editTranslationDialog: false,
      file: null,
      selectedFiles: [],
      languages: ['Espanhol', 'Inglês', 'Português'],
      selectedLanguages: [],
      fileLanguage: null,
      translations: [],
      filteredTranslations: this.groupedTranslations,
      edit: {
        text: '',
        langTarget: null,
        data: null
      }
    }
  },
  watch: {
    translations () {
      this.filteredTranslations = this.groupedTranslations
      this.columns = []
      this.columns.push({ name: 'chave', required: true, label: 'Chave', align: 'left', field: row => row.name, format: val => `${val}`, sortable: true })
      this.data = []
      let objData
      let i
      for (i = 0; i < this.selectedLanguages.length; i++) {
        this.columns.push({ name: this.selectedLanguages[i], align: 'center', label: this.selectedLanguages[i], field: this.selectedLanguages[i], sortable: false })
      }
      console.log(this.filteredTranslations)
      this.filteredTranslations.forEach((element, index, array) => {
        objData = {}
        objData.name = element.key
        for (i = 0; i < this.selectedLanguages.length; i++) {
          objData[this.selectedLanguages[i]] = element.lang[this.selectedLanguages[i]] ? element.lang[this.selectedLanguages[i]][0].value : '-'
        }
        this.data.push(objData)
      })
    }
  },
  computed: {
    /**
     * Group the list of translation objects by key and language
     *
     * @return {object} grouped translation objects
     */
    groupedTranslations () {
      return _.map(_.groupBy(this.translations, 'key'), (value, key) => {
        return { key: key, lang: _.groupBy(value, 'language') }
      })
    }
  },
  methods: {
    /**
     * Add a JSON or RESX translation file
     *
     * @return {void}
     */
    addFile () {
      // Check if a file was seletected
      if (!this.file.length) return

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
          } else if (this.file[0].name.endsWith('.resx')) {
            // Parse RESX file and create a translation object
            const resx2js = require('resx/resx2js')
            resx2js(e.target.result, (err, res) => {
              if (err) {
                console.log('error converting file to json', err)
              } else {
                _.each(res, (value, key) => {
                  this.translations.push({
                    fileID: fileId,
                    group: this.UnFormatGroup(key.split('_')[0], 'resx'),
                    /* key: key.split('_')[1], emilia */
                    key: key.split('_')[0],
                    value: value,
                    language: that.fileLanguage
                  })
                })
                // console.log(this.translations)
              }
            })
          }
        }
      }

      reader.onloadend = () => { Loading.hide() }

      reader.readAsText(this.file[0])
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
    },

    UnFormatGroup (group, fileType) {
      if (fileType === 'resx') {
        if (group === 'lbl') {
          return 'label'
        } else if (group === 'msg') {
          return 'message'
        } else {
          return group
        }
      } else {
        return group
      }
    },
    editTranslation (chave, data, language) {
      console.log(chave + data + language)
      // this.$refs.editTranslationDialog = true
      // this.$refs.editTranslationDialog.open()
      // this.$refs.editTranslationDialog.show()
      // this.edit.data = data
      this.edit.data = chave
      this.edit.langTarget = language
      // this.edit.text = data[language][0].value
      this.edit.text = data
    },
    saveEdition () {
      console.log('saveEdition')
      console.log(this.edit.data)
      // this.data[this.data.findIndex(el => el.name === this.edit.data)].Espanhol = this.edit.text
      // this.data[this.data.findIndex(el => el.name === this.edit.data)].[this.edit.langTarget] = this.edit.text
      this.data[this.data.findIndex(el => el.name === this.edit.data)][this.edit.langTarget] = this.edit.text
    },
    /**
     * Get label that was not tranlated to all the languages.
     *
     * @return {void}
     */
    filterIncomplete () {
      let filteredTranslations = []
      _.each(this.groupedTranslations, (translation) => {
        let incomplete = false
        _.each(this.selectedLanguages, (lang) => {
          if (!translation.lang[lang]) {
            incomplete = true
          }
        })
        if (incomplete) {
          filteredTranslations.push(translation)
          this.data.filter = translation.key
        }
      })
      let emiTeste = this.data.filter(a1 => filteredTranslations.find(a2 => a2.name === a1.name))
      // let emiTeste = this.data.filter(a1 => filteredTranslations.find(a2 => a2.key === a1.name))
      console.log(emiTeste)
      // console.log(filteredTranslations)
      // this.data = emiTeste
      console.log(this.data.filter)
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
