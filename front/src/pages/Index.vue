<template>
  <q-layout>
      <q-header elevated>
      <q-toolbar class="glossy bg-black text-white">
        <q-toolbar-title inset>I18N Bank &amp; Manager
        </q-toolbar-title>
        <q-btn flat icon="settings" @click="configurationDialog = true"/>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-card>
        <q-card-section>
          <div class="row items-center justify-between filters">
            <div>
              <q-btn color="secondary" icon="add" v-if="translations.length" @click="newTranslationDialog = true">Nova label</q-btn>
            </div>
            <div>
              <q-btn color="secondary" icon="file_upload" @click="importFilesDialog = true">Importar Arquivo</q-btn>
            </div>
            <div>
              <q-btn color="secondary" icon="cancel" v-if="translations.length">Traduzir Incomp.</q-btn>
            </div>
            <div class="row items-center">
              <q-btn color="secondary" icon="filter_list" @click="filterIncomplete" v-if="translations.length">Incompletos</q-btn>
              <q-btn color="secondary" icon="filter_list" @click="filterComplete" v-if="translations.length">Todos</q-btn>
              <q-input borderless dense debounce="300" v-model="filter" placeholder="Buscar" v-if="translations.length">
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
                      <q-btn small flat icon="edit" @click="editTranslation(props.row.name, props.row[lang], lang); editTranslationDialog = true"/>
                      <!--<q-btn id="ALT101es-CL" small flat icon="save_alt" v-if="props.row[lang] && !alreadyInDataBase(props.row.name, lang)" @click="addToDataBase(props.row.name, props.row[lang], lang)"/>-->
                      <!--<q-btn id="@(props.row.name + lang)" small flat icon="save_alt" v-if="props.row[lang] && !alreadyInDataBase(props.row.name, lang)" @click="addToDataBase(props.row.name, props.row[lang], lang)"/>-->
                      <!--<q-btn id="{{props.row.name + lang}}" small flat icon="save_alt" v-if="props.row[lang] && !alreadyInDataBase(props.row.name, lang)" @click="addToDataBase(props.row.name, props.row[lang], lang)"/>-->
                      <!--<q-btn id=String.Concat(props.row.name, lang) small flat icon="save_alt" v-if="props.row[lang] && !alreadyInDataBase(props.row.name, lang)" @click="addToDataBase(props.row.name, props.row[lang], lang)"/>-->
                      <!--<q-btn id=props.row.name small flat icon="save_alt" v-if="props.row[lang] && !alreadyInDataBase(props.row.name, lang)" @click="addToDataBase(props.row.name, props.row[lang], lang)"/>-->
                      <!--<q-btn id="{{props.row.name}}" small flat icon="save_alt" v-if="props.row[lang] && !alreadyInDataBase(props.row.name, lang)" @click="addToDataBase(props.row.name, props.row[lang], lang)"/>-->
                      <q-btn id="ALT101" small flat icon="save_alt" v-if="props.row[lang] && !alreadyInDataBase(props.row.name, lang)" @click="addToDataBase(props.row.name, props.row[lang], lang)"/>
                      <q-btn small flat icon="report" v-if="props.row[lang] && !alreadyInDataBase(props.row.name, lang)" @click="addToDataBase(props.row.name, props.row[lang], lang)"/>
                    </q-td>
                  </q-tr>
                </template>
              </q-table>
            </div>
          </div>
        </q-card-section>
      </q-card>
      <q-dialog v-model="configurationDialog" persistent>
        <q-card style="width: 700px; max-width: 80vw; height:415px;">
          <q-bar class="row items-center bg-black text-white glossy">
            <div class="text-h6 q-pl-sm">Configurações</div>
            <q-space />
            <q-btn icon="close" flat v-close-popup />
          </q-bar>
          <q-card-section>
            <fieldset>
              <legend>Linguagem</legend>
              <div class="col-md-12">
                <q-input v-model="newLang" float-label="Nova lingua" />
                  <q-btn color="black" class="pull-right" @click="addNewLanguage">
                  <!-- <q-btn color="black" class="pull-right" @click="getDatabaseTranslations"> -->
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
          <q-bar class="row bg-black text-white glossy">
            <!--<q-space />
            <q-btn flat @click="addFile" v-close-popup>
              <q-icon name="check" />
              Confirmar
            </q-btn>-->
          </q-bar>
        </q-card>
      </q-dialog>
      <q-dialog v-model="newTranslationDialog" persistent>
        <q-card style="width: 700px; max-width: 80vw;">
          <q-bar class="row items-center bg-black text-white  glossy">
            <div class="text-h6 q-pl-sm">Nova Tradução</div>
            <q-space />
            <q-btn icon="close" flat v-close-popup />
          </q-bar>
          <q-card-section class="layout-padding newTranslationContent">
            <div class="col-md-12">
              <q-checkbox
                v-for="(file, index) in selectedFiles"
                v-model="file.selected"
                :label="file.name"
                v-bind:key="index"
                @input="onNewLabelFileClick(file)"
              />
            </div>
           <!-- <div class="col-md-8 offset-2">
              <q-select
                v-model="newLabel.group"
                float-label="Grupo"
                :options="groups"
              />
            </div> -->
            <div class="col-md-4">
              <q-input v-model="newLabel.key" label="Chave" />
            </div>
            <div class="col-md-6">
              <div class="col-md-12" v-for="(label, index) in newLabel.labels" :key="index">
                <q-input v-model="label.model" :label="label.language" />
              </div>
            </div>
          </q-card-section>
          <q-bar align="right" class="row bg-black text-white glossy">
            <q-space />
            <q-btn flat @click="addNewLabel" v-close-popup>
              <q-icon name="check" />
              Confirmar
            </q-btn>
          </q-bar>
      </q-card>
    </q-dialog>
    <q-dialog v-model="importFilesDialog" persistent>
        <q-card style="width: 700px; max-width: 80vw;">
          <q-bar class="row items-center bg-black text-white glossy">
            <div class="text-h6 q-pl-sm">Importar arquivo de tradução</div>
            <q-space />
            <q-btn icon="close" flat v-close-popup />
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
          <q-bar align="right" class="row bg-black text-white glossy">
            <q-space />
            <q-btn flat @click="addFile" v-close-popup>
              <q-icon name="check" />
              Confirmar
            </q-btn>
          </q-bar>
      </q-card>
    </q-dialog>
    <q-dialog v-model="editTranslationDialog" persistent>
      <q-card style="width: 700px; max-width: 80vw;">
        <q-bar class="row items-center bg-black text-white glossy">
          <div class="text-h6 q-pl-sm">Editar</div>
          <q-space />
          <q-btn icon="close" flat v-close-popup />
        </q-bar>
        <q-card-section class="layout-padding">
            <div class="col-md-9">
              <q-input filled bottom-slots v-model="edit.text" label="Digite a tradução ou digite em portugues e aperte no botão para traduzir" >
                <template v-slot:after>
                  <!-- No sistema antigo as linguagens eram cadastradas como siglas? -->
                  <q-btn flat icon="translate" v-if="edit.langTarget !== 'pt-BR'"> <!-- emilia verificar como edit.langTarget está sendo populado -->
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
        <q-bar align="right" class="row bg-black text-white glossy">
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
      newTranslationDialog: false,
      configurationDialog: false,
      importFilesDialog: false,
      editTranslationDialog: false,
      file: null,
      selectedFiles: [],
      // languages: ['Espanhol', 'Inglês', 'Português'],
      // languages: ['pt-BR', 'en-US', 'es-CL'],
      languages: [], // emilia
      selectedLanguages: [],
      fileLanguage: null,
      translations: [],
      filteredTranslations: this.groupedTranslations,
      edit: {
        text: '',
        langTarget: null,
        data: null
      },
      newLabel: {
        group: '',
        key: '',
        labels: []
      }
    }
  },
  mounted () {
    this.getLanguages()
    this.getDatabaseTranslations()
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
     * Load the list of registered languages
     *
     * @return {void}
     */
    getLanguages () {
      let that = this
      this.$axios.get('/language')
        .then((response) => {
          response.data.forEach(function (item) {
            that.languages.push(item.label)
          })
        })
        .catch(() => {
          alert('Erro ao selecionar linguagens')
        })
    },
    /**
     * Add new language to the database
     *
     * @return {void}
    */
    addNewLanguage () {
      let that = this
      this.$axios.post('/language', { '_id': this.newLang, 'label': this.newLang })
        .then((response) => {
          that.languages.push(response.data.label)
          this.newLang = ''
        })
        .catch(() => {
          alert('Erro ao cadastrar nova linguagem')
        })
    },
    /**
     * Load the list of registered translations
     *
     * @return {void}
     */
    getDatabaseTranslations () {
      Loading.show()
      let trns = []
      let that = this
      this.$axios.get('/translation')
        .then((response) => {
          response.data.forEach(function (item) {
            item.translations.forEach(function (trans) {
              // Add the to the list of inserted languages
              if (!_.find(that.selectedLanguages, (item) => { return item === trans.language })) {
                that.selectedLanguages.push(trans.language)
              }
              if (!_.find(that.selectedFiles, (item) => item.name === `Banco (${trans.language})`)) {
                // Add to the list of selected files
                that.selectedFiles.push({
                  name: `Banco (${trans.language})`,
                  language: trans.language,
                  selected: false
                })
              }
              trns.push({
                key: item._id,
                value: trans.value,
                language: trans.language
              })
            })
          })
          that.translations = that.translations.concat(trns)
          Loading.hide()
        })
        .catch(() => {
          alert('Erro ao selecionar traduções')
        })
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
          // console.log(this.translations)
        }
      }

      reader.onloadend = () => { Loading.hide() }

      reader.readAsText(this.file[0])
    },
    addToDataBase (chave, data, language) {
      // Grava no banco
      console.log('banco')
      let name = chave + language
      console.log(name)
      this.$axios.get(`/translation/${chave}`)
        .then((response) => {
          this.$axios.put(`/translation/${chave}/${language}/${data}`)
            .then((response) => {
              console.log(response)
              // emilia depois de inserir tirar o botão de inserir no banco, porque já inseriu
              // document.getElementById('ALT101es-CL').classList.add('hidden')
              document.getElementById('ALT101').classList.add('hidden')
            })
            .catch(() => {
              alert('Erro ao editar tradução no banco')
            })
        })
        .catch(() => {
          this.$axios.post('/translation', { '_id': chave, 'translations': [ { 'language': language, 'value': data } ] })
            .then((response) => {
              console.log('inseriu nova traducao')
              // emilia depois de inserir tirar o botão de inserir no banco
              // document.getElementById('ALT101es-CL').classList.add('hidden')
              document.getElementById('ALT101').classList.add('hidden')
            })
            .catch(() => {
              alert('Erro ao inserir nova traducao no banco')
            })
        })
      /* let lang = this.$gun.get(`language/${translation[0].language}`)
      let group = this.$gun.get(`group/${translation[0].group}`)

      let translationDB = this.$gun.get(`translation/${translation[0].key}-${translation[0].language}`)

      translationDB.path('key').put(translation[0].key)
      translationDB.path('value').put(translation[0].value)
      translationDB.path('language').put(lang)
      translationDB.path('group').put(group)

      this.$gun.get(`translations`).set(translationDB)
      this.translations.push({
        group: translation[0].group,
        key: translation[0].key,
        value: translation[0].value,
        language: translation[0].language
      }) */
    },
    alreadyInDataBase (chave, language) {
      // emilia importante descomentar !!!
      /* return !!_.find(this.translations, (item) => item.key === chave && item.language === language && !item.fileID) */
      if (chave === 'ALT101' && language === 'es-CL') {
        return false
      } else {
        return true
      }
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
    formatGroup (group, fileType) {
      if (fileType === 'resx') {
        if (group === 'label') {
          return 'lbl'
        } else if (group === 'message') {
          return 'msg'
        }
      } else {
        return group
      }
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
    addNewLabel () {
      let dbLg = []
      let that = this
      _.each(this.selectedFiles, (file) => {
        if (file.selected) {
          let labelValue = _.find(this.newLabel.labels, (item) => item.language === file.language).model

          if (file.id) {
            // Grava no arquivo
            let label = {
              fileID: file.id,
              group: this.formatGroup(this.newLabel.group),
              key: this.newLabel.key,
              value: labelValue,
              language: file.language
            }

            // união entre as labels já existente no arquivo com as novas labels traduzidas
            let grpTrand = _.groupBy(this.translations, 'fileID')[file.id]
            grpTrand ? grpTrand.push(label) : [].push(label)
            // formata as labels no formato necessário para salvar o arquivo
            return this.formatJSONToFile(file.path.split('.').pop(), grpTrand)
              .then((newFileString) => {
                // grava os dados no arquivo
                return this.writeFile(file.path, newFileString)
                  .then(() => {
                    // Atualiza a lista de traduções
                    this.translations.push(label)
                    return true
                  })
              })
              .catch(() => {
                return console.log('err')
              })
          } else {
          // Grava no banco
            dbLg.push({ 'language': file.language, 'value': labelValue })
          }
        }
      })
      if (dbLg.length) {
        let ch = this.newLabel.key
        this.$axios.get(`/translation/${this.newLabel.key}`)
          .then((response) => {
            alert('Já existe este código')
          })
          .catch(() => {
            console.log('não encontrou no banco')
            let teste = {
              '_id': ch,
              'translations': dbLg
            }
            this.$axios.post('/translation', teste)
              .then((response) => {
                console.log('inseriu nova traducao')
                dbLg.forEach(function (item) {
                  let label = {
                    fileID: undefined,
                    group: undefined,
                    key: ch,
                    value: item.value,
                    language: item.language
                  }
                  // console.log(label)
                  // console.log(that.translations)
                  // this.translations.push(label)
                  that.translations.push(label)
                })
              })
              .catch(() => {
                alert('Erro ao inserir nova traducao no banco')
              })
          })
      }
      this.newLabel = { group: '',
        key: '',
        labels: [] }
      // Clean the selected file list
      this.selectedFiles = _.map(this.selectedFiles, (file) => {
        file.selected = false
        return file
      })
      // console.log(this.translations)
    },
    onNewLabelFileClick (file) {
      if (file.selected) {
        if (!_.find(this.newLabel.labels, (item) => item.language === file.language)) {
          this.newLabel.labels.push({
            model: '',
            language: file.language
          })
        }
      } else {
        if (!_.find(this.selectedFiles, (item) => item.language === file.language && item.selected)) {
          _.remove(this.newLabel.labels, (item) => item.language === file.language)
          this.newLabel = Object.assign({}, this.newLabel)
        }
      }
    },
    editTranslation (chave, data, language) {
      this.edit.data = chave
      this.edit.langTarget = language
      this.edit.text = data
    },
    saveEdition () {
      this.data[this.data.findIndex(el => el.name === this.edit.data)][this.edit.langTarget] = this.edit.text
      // console.log(this.data)

      let translations = _.groupBy(this.translations, 'fileID')
      let promises = []
      Loading.show()

      console.log(this.selectedFiles)
      // Update all selected files
      _.each(_.groupBy(this.selectedFiles, 'selected')['true'], (file) => {
        if (file.id) {
          let fileTranslations = translations[file.id]
          let editedLabelIndex = fileTranslations ? _.findIndex(fileTranslations, (item) => { return item.key === this.edit.data }) : -1
          let newTranslation

          // if already exist the key in the file just change the value else create a translate object
          if (editedLabelIndex >= 0) {
            fileTranslations[editedLabelIndex].value = this.edit.text
          } else {
            newTranslation = {
              fileID: file.id,
              group: this.edit.data,
              key: this.edit.data,
              value: this.edit.text,
              language: this.edit.langTarget
            }

            fileTranslations.push(newTranslation)
            this.translations.push(newTranslation)
          }
          // formata as labels no formato necessário para salvar o arquivo
          promises.push(this.formatJSONToFile(file.path.split('.').pop(), fileTranslations)
            .then((newFileString) => {
              // grava os dados no arquivo
              return this.writeFile(file.path, newFileString)
            })
            .catch((err) => {
              return console.log(err)
            }))
        } else {
          // Grava no banco
          // let that = this
          console.log('banco')
          this.$axios.get(`/translation/${this.edit.data}`)
            .then((response) => {
              this.$axios.put(`/translation/${this.edit.data}/${this.edit.langTarget}/${this.edit.text}`)
                .then((response) => {
                  console.log(response)
                  // console.log(`/translation/${this.edit.data}/${this.edit.langTarget}/${this.edit.text}`)
                })
                .catch(() => {
                  alert('Erro ao editar tradução no banco')
                })
            })
            .catch(() => {
              this.$axios.post('/translation', { '_id': this.edit.data, 'translations': [ { 'language': this.edit.langTarget, 'value': this.edit.text } ] })
                .then((response) => {
                  // that.languages.push(response.data.label)
                  // this.newLang = ''
                  console.log('inseriu nova traducao')
                })
                .catch(() => {
                  alert('Erro ao inserir nova traducao no banco')
                })
            })
        }
      })

      Promise.all(promises).then(() => {
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
