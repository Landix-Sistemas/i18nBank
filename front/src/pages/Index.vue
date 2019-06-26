<template>
  <q-layout>
    <q-header elevated class="q-pa-md q-gutter-y-sm bg-black text-white titlebar">
      <!--<q-toolbar-title inset>
        I18N Bank &amp; Manager
      </q-toolbar-title>-->
      <q-toolbar>
        <q-toolbar-title inset>I18N Bank &amp; Manager
          <div slot="subtitle">Banco de dados e gerenciamento de traduções</div>
        </q-toolbar-title>
        <!--<span slot="subtitle">Banco de dados e gerenciamento de traduções</span>-->
        <!--<q-btn flat round dense icon="fa-cog" />-->
        <!--<q-btn flat round dense icon="search" />-->
        <q-btn flat icon="search" @click="configurationDialog = true">
            <!--<q-icon name="search" />-->
        </q-btn>
      </q-toolbar>
      <!--<q-toolbar inset>
        <q-toolbar-title><strong>Quasar</strong> Framework</q-toolbar-title>
      </q-toolbar>-->
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
              <q-btn color="secondary" icon="filter_list" @click="filterComplete">Todos</q-btn>
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
                <template v-slot:body="props">
                  <q-tr :props="props">
                    <q-td key="chave" :props="props">{{ props.row.name }}</q-td>
                    <q-td v-for="(lang) in selectedLanguages" :props="props" :key="lang">
                      {{props.row[lang] ? props.row[lang] : '-'}}
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
            </div>
          </div>
        </q-card-section>
      </q-card>
      <!--<q-dialog v-model="configurationDialog" persistent style="width: 700px; max-width: 80vw; height:400px;">-->
      <q-dialog v-model="configurationDialog" persistent>
        <!--<q-card style="width: 700px; max-width: 80vw;">-->
        <q-card style="width: 700px; max-width: 80vw; height:415px;">
        <!--<q-card>-->
          <q-bar class="row items-center bg-black text-white">
            <div class="text-h6 q-pl-sm">Configurações</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </q-bar>
          <!--<q-card-section class="layout-padding importFilesContent">-->
          <!--<q-card-section class="layout-padding importFilesContent" style="width: 700px; max-width: 80vw; height:346px;">-->
          <!--<q-card-section class="layout-padding importFilesContent" style="width: 700px; max-width: 80vw; height:347px;">--> <!-- 343 -->
          <q-card-section>
            <!--<q-input filled bottom-slots v-model="edit.text" label="Digite o idioma" />-->
            <fieldset>
            <!--<fieldset style="width: 650px; max-width: 75vw; height:350px;">-->
              <legend>Linguagem</legend>
              <div class="col-md-12">
                <q-input v-model="newLang" float-label="Nova lingua" />
                <q-btn color="black" class="pull-right" @click="addNewLanguage">
                  <q-icon name="add" />
                  Add
                </q-btn>
              </div>
              <dl class="listLangs col-md-12">
                <dt>Linguas Adicionadas:</dt>
                <dd v-for="lang in languages" :key="lang"> <!-- lang.value -->
                  <!--{{lang.label}}-->
                  {{lang}}
                </dd>
              </dl>
            </fieldset>
          </q-card-section>
          <!--<q-bar align="right" class="row bg-black text-white">-->
          <q-bar class="row bg-black text-white">
            <!--<q-space />
            <q-btn flat @click="addFile" v-close-popup>
              <q-icon name="check" />
              Confirmar
            </q-btn>-->
          </q-bar>
        </q-card>
      </q-dialog>
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
              <!--<q-input v-model="edit.text" label="Digite a tradução ou digite em portugues e aperte no botão traduzir" />-->
              <q-input filled bottom-slots v-model="edit.text" label="Digite a tradução ou digite em portugues e aperte no botão para traduzir" >
                <template v-slot:after>
                  <!-- No sistema antigo as linguagens eram cadastradas como siglas? -->
                  <q-btn round dense flat icon="translate" v-if="edit.langTarget !== 'pt-BR'"> <!-- emilia verificar como edit.langTarget está sendo populado -->
                    <q-tooltip anchor="bottom middle" self="top middle">Traduzir</q-tooltip>
                  </q-btn>
                </template>
              </q-input>
            </div>
            <!--<div class="col-md-1">
              <q-btn color="dark" v-if="edit.langTarget !== 'pt-BR'">
                Traduzir
              </q-btn>
            </div>-->
            <div class="col-md-12">
              <q-checkbox v-for="(file, index) in editableFiles()" v-model="file.selected" :label="file.name" v-bind:key="index"/>
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
import {
  Loading
} from 'quasar'
import _ from 'Lodash'
import pify from 'pify'
// Add a new function to the  lodash
_.mixin({
  'sortKeysBy': function (obj, comparator) {
    var keys = _.sortBy(_.keys(obj), function (key) {
      return comparator ? comparator(obj[key], key) : key
    })

    return _.zipObject(keys, _.map(keys, function (key) {
      return obj[key]
    }))
  }
})
export default {
  name: 'i18n',
  data () {
    return {
      newLang: '',
      filter: '',
      pagination: {
        sortBy: 'name',
        descending: false,
        page: 1,
        rowsPerPage: 10
      },
      columns: [],
      data: [],
      dataOriginal: [],
      configurationDialog: false,
      importFilesDialog: false,
      editTranslationDialog: false,
      file: null,
      selectedFiles: [],
      // languages: ['Espanhol', 'Inglês', 'Português'],
      languages: ['pt-BR', 'en-US', 'es-CL'],
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
      this.filteredTranslations.forEach((element, index, array) => {
        objData = {}
        objData.name = element.key
        for (i = 0; i < this.selectedLanguages.length; i++) {
          objData[this.selectedLanguages[i]] = element.lang[this.selectedLanguages[i]] ? element.lang[this.selectedLanguages[i]][0].value : '-'
        }
        this.data.push(objData)
      })
      this.dataOriginal = this.data
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
     * Add new language to the database
     *
     * @return {void}
    */
    addNewLanguage () {
      /* let lang = this.$gun.get(`language/${this.newLang}`).put({value: this.newLang, label: this.newLang})
      this.$gun.get(`languages`).set(lang)
      this.newLang = '' */
      console.log(this.selectedLanguages)
    },
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
                    /* group: this.UnFormatGroup(key.split('_')[0], 'resx'),
                    key: key.split('_')[0], emilia */
                    group: key,
                    key: key,
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
      this.edit.data = chave
      this.edit.langTarget = language
      this.edit.text = data
    },
    saveEdition () {
      // console.log(this.edit.data)
      this.data[this.data.findIndex(el => el.name === this.edit.data)][this.edit.langTarget] = this.edit.text

      let translations = _.groupBy(this.translations, 'fileID')
      let promises = []
      Loading.show()

      // Update all selected files
      _.each(_.groupBy(this.selectedFiles, 'selected')['true'], (file) => {
        if (file.id) {
          let fileTranslations = translations[file.id]
          // let editedLabelIndex = fileTranslations ? _.findIndex(fileTranslations, (item) => { return item.key === this.edit.data[Object.keys(this.edit.data)[0]][0].key }) : -1
          let editedLabelIndex = fileTranslations ? _.findIndex(fileTranslations, (item) => { return item.key === this.edit.data }) : -1
          // console.log(this.edit.data)
          // console.log(this.edit.data[Object.keys(this.edit.data)[0]][0].key)
          let newTranslation

          // if already exist the key in the file just change the value else create a translate object
          if (editedLabelIndex >= 0) {
            console.log('editedLabelIndex >= 0')
            fileTranslations[editedLabelIndex].value = this.edit.text
          } else {
            newTranslation = {
              fileID: file.id,
              // group: this.edit.data[Object.keys(this.edit.data)[0]][0].group,
              // key: this.edit.data[Object.keys(this.edit.data)[0]][0].key,
              group: this.edit.data,
              key: this.edit.data,
              value: this.edit.text,
              language: this.edit.langTarget
            }

            fileTranslations.push(newTranslation)
            this.translations.push(newTranslation)
          }
          // console.log(fileTranslations)

          // formata as labels no formato necessário para salvar o arquivo
          promises.push(this.formatJSONToFile(file.path.split('.').pop(), fileTranslations)
            .then((newFileString) => {
              // grava os dados no arquivo
              // console.log(newFileString)
              return this.writeFile(file.path, newFileString)
            })
            .catch((err) => {
              return console.log(err)
            }))
        }
      })

      Promise.all(promises).then(() => {
        // this.$refs.editTranslation.close()
        // Clean the selected file list
        this.selectedFiles = _.map(this.selectedFiles, (file) => {
          file.selected = false
          return file
        })
        return Loading.hide()
      }).catch(() => {
        // this.$refs.editTranslation.close()
        return Loading.hide()
      })
    },
    /**
     * Write the file with all labels.
     *
     * @param {string} filePath - File path
     * @param {string} newFileString - The labels to write the file
     * @return {Promise}
     */
    writeFile (filePath, newFileString) {
      // eslint-disable-next-line no-undef
      return pify(getFS().writeFile)(filePath, newFileString)
    },
    /**
     * Transform the labels array to the format of the file.
     *
     * @param {string} typeOfFile - the type of the file.
     * @param {object} jsonObject - the labels to save the file.
     * @return {string} File labels
     */
    formatJSONToFile (typeOfFile, jsonObject) {
      if (typeOfFile === 'resx') {
        return this.translationsToRESX(jsonObject)
      } else if (typeOfFile === 'json') {
        return this.translationsToJSON(jsonObject)
      }
    },
    /**
     * Transform the labels array to the format of resx file.
     *
     * @param {object} jsonObject - the labels to save the file.
     * @return {string} File labels
     */
    translationsToRESX (jsonObject) {
      let jsonFile = {}

      _.each(jsonObject, (item) => {
        // jsonFile[item.group + '_' + item.key] = item.value // emilia para que ter grupo ???
        jsonFile[item.key] = item.value
      })

      // order the labels
      jsonFile = _.sortKeysBy(jsonFile)

      return pify(require('resx/js2resx'))(jsonFile)
    },

    /**
     * Transform the labels array to the format of json file.
     *
     * @param {object} jsonObject - the labels to save the file.
     * @return {string} File labels
     */
    translationsToJSON (jsonObject) {
      let jsonFile = {}

      _.each(jsonObject, (item) => {
        if (!jsonFile[item.group]) jsonFile[item.group] = {} // create a new group if it wasn't created yet
        jsonFile[item.group][item.key] = item.value // emilia para que ter grupo ???
      })

      // order labels by group
      _.each(jsonFile, (value, key) => {
        jsonFile[key] = _.sortKeysBy(value)
      })

      // return json object idented with 4 spaces
      return Promise.resolve(JSON.stringify(jsonFile, null, '    '))
    },
    /**
     * List editable files by language
     *
     * @return {array} list of editable files
     */
    editableFiles () {
      if (!this.edit.langTarget) {
        return this.selectedFiles
      }

      let that = this
      let languages = []

      _.each(this.selectedFiles, (item) => {
        if (item.language === that.edit.langTarget) {
          languages.push(item)
        }
      })

      return languages
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
        }
      })
      let incompletes = this.data.filter(a1 => filteredTranslations.find(a2 => a2.key === a1.name))
      this.data = incompletes
    },
    filterComplete () {
      this.data = this.dataOriginal
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
