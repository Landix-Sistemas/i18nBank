<template lang="html">
  <q-layout>
    <q-toolbar slot="header" color="dark" class="titlebar">

      <q-toolbar-title>
        I18N Bank &amp; Manager
        <span slot="subtitle">Banco de dados e gerenciamento de traduções</span>
      </q-toolbar-title>
      <q-btn flat @click="$refs.configurationModal.open()">
        <q-icon name="fa-cog" />
      </q-btn>
    </q-toolbar>

    <q-card>
      <q-card-main>
        <div class="row items-center justify-between filters">
          <div>
            <q-btn color="primary" icon="add" @click="$refs.newTranslation.open()" v-if="translations.length">Nova label</q-btn>
          </div>
          <div>
            <q-btn color="primary" icon="file upload" @click="$refs.importFilesModal.open()">Importar Arquivo</q-btn>
          </div>
          <div>
            <q-btn color="primary" icon="cancel" @click="translateIncompletes" v-if="editableFiles().length">Traduzir Incomp.</q-btn>
          </div>
          <div class="row items-center">
            <q-btn color="primary" icon="filter list" @click="filterIncomplete" v-if="editableFiles().length">Incompletos</q-btn>
            <q-btn color="primary" icon="filter list" @click="filterAll" v-if="editableFiles().length">Todos</q-btn>
            <q-search
              v-model="search"
              :debounce="600"
              float-label="Buscar"
              placeholder=""
              v-if="editableFiles().length"
            />
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <table class="q-table bordered striped-odd horizontal-separator vertical-separator responsive" v-if="groupedTranslations.length">
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
                    <q-btn small flat @click="editTranslation(label.lang, lang)">
                      <q-icon name="edit" />
                    </q-btn>
                    <q-btn small flat v-if="label.lang[lang] && !alreadyInDataBase(label.lang[lang])" @click="addToDataBase(label.lang[lang])">
                      <q-icon name="add" />
                      <q-icon name="fa-database" />
                    </q-btn>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </q-card-main>
    </q-card>

    <q-modal ref="importFilesModal" :content-css="{minWidth: '50vw', minHeight: '320px'}">
      <q-modal-layout>
        <q-toolbar slot="header" class="justify-between"  color="dark">
          Importar arquivo de tradução
          <q-btn flat @click="$refs.importFilesModal.close()">
            <q-icon name="close" />
          </q-btn>
        </q-toolbar>

        <div class="layout-padding importFilesContent">
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
        </div>

        <q-toolbar slot="footer" class="justify-end" color="dark">
          <q-btn flat @click="addFile">
            <q-icon name="check" />
            Confirmar
          </q-btn>
        </q-toolbar>
      </q-modal-layout>
    </q-modal>

    <q-modal ref="configurationModal" :content-css="{minWidth: '50vw', height: '450px'}">
      <q-modal-layout>
        <q-toolbar slot="header" class="justify-between"  color="dark">
          Configuration
          <q-btn flat @click="$refs.configurationModal.close()">
            <q-icon name="close" />
          </q-btn>
        </q-toolbar>
        <div class="layout-padding">
          <div class="row">
            <div class="col-md-6">
              <fieldset>
                <legend>Linguagem</legend>
                <div class="col-md-12">
                  <q-input v-model="newLang" float-label="Nova lingua" />
                  <q-btn color="primary" class="pull-right" @click="addNewLanguage">
                    <q-icon name="add" />
                    Add
                  </q-btn>
                </div>
                <dl class="listLangs col-md-12">
                  <dt>Linguas Adicionadas:</dt>
                  <dd v-for="lang in languages" :key="lang.value">
                    {{lang.label}}
                  </dd>
                </dl>
              </fieldset>
            </div>
            <div class="col-md-6">
              <fieldset>
                <legend>Grupos</legend>
                <div class="col-md-12">
                  <q-input v-model="newGroup" float-label="Novo Grupo" />
                  <q-btn color="primary" class="pull-right" @click="addNewGroup">
                    <q-icon name="add" />
                    Add
                  </q-btn>
                </div>
                <dl class="listLangs col-md-12">
                  <dt>Grupos Adicionados:</dt>
                  <dd v-for="group in groups" :key="group.value">
                    {{group.label}}
                  </dd>
                </dl>
              </fieldset>
            </div>
          </div>
        </div>
      </q-modal-layout>
    </q-modal>

    <q-modal ref="editTranslation" :content-css="{minWidth: '50vw', minHeight: '300px'}">
      <q-modal-layout>
        <q-toolbar slot="header" class="justify-between"  color="dark">
          Editar Tradução
          <q-btn flat @click="$refs.editTranslation.close()">
            <q-icon name="close" />
          </q-btn>
        </q-toolbar>
        <q-toolbar slot="footer" class="justify-end" color="dark">
          <q-btn flat @click="saveEdition">
            <q-icon name="check" />
            Confirmar
          </q-btn>
        </q-toolbar>
        <div class="layout-padding">
          <div class="row items-center justify-between">

            <div class="col-md-9">
              <q-input v-model="edit.text" float-label="Digite a tradução ou digite em portugues e aperte no botão traduzir" />
            </div>
            <div class="col-md-1">
              <q-btn color="dark" @click="translateWatson" v-if="edit.langTarget !== 'pt-BR'">
                Traduzir
              </q-btn>
            </div>
            <div class="col-md-12">
              <q-checkbox v-for="(file, index) in editableFiles()" v-model="file.selected" :label="file.name" v-bind:key="index"/>
            </div>

          </div>
        </div>
      </q-modal-layout>
    </q-modal>

    <q-modal ref="newTranslation" :content-css="{minWidth: '50vw', minHeight: '450px'}">
      <q-modal-layout>
        <q-toolbar slot="header" class="justify-between"  color="dark">
          Nova Tradução
          <q-btn flat @click="$refs.newTranslation.close()">
            <q-icon name="close" />
          </q-btn>
        </q-toolbar>
        <div class="layout-padding newTranslationContent">
          <div class="row items-center justify-between">
            <div class="col-md-12">
              <q-checkbox
                v-for="(file, index) in selectedFiles"
                v-model="file.selected"
                :label="file.name"
                v-bind:key="index"
                @input="onNewLabelFileClick(file)"
              />
            </div>
            <div class="col-md-8 offset-2">
              <q-select
                v-model="newLabel.group"
                float-label="Grupo"
                :options="groups"
              />
            </div>
            <div class="col-md-4">
              <q-input v-model="newLabel.key" float-label="Chave" />
            </div>
            <div class="col-md-6">
              <div class="col-md-12" v-for="(label, index) in newLabel.labels" :key="index">
                <q-input v-model="label.model" :float-label="label.language" />
              </div>
            </div>
          </div>
        </div>
        <q-toolbar slot="footer" class="justify-end" color="dark">
          <q-btn flat @click="addNewLabel">
            <q-icon name="check" />
            Confirmar
          </q-btn>
        </q-toolbar>
      </q-modal-layout>
    </q-modal>

  </q-layout>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Watch } from 'vue-property-decorator'
import {
  QLayout,
  QToolbar,
  QToolbarTitle,
  QBtn,
  QCard,
  QCardMain,
  QModal,
  QModalLayout,
  QIcon,
  QInput,
  QSelect,
  QSearch,
  QCheckbox,
  Loading
} from 'quasar'
import * as _ from 'Lodash'
import * as pify from 'pify'
import 'gun/lib/path'
import 'assets/script/valMapEnd'
import axios from 'axios'
import resx2js from 'resx/resx2js'
import js2resx from 'resx/js2resx'

let getFS: () => any

function compareGroupKey (a: Translation, b: Translation): number {
  if (a.group > b.group) return 1
  if (a.group < b.group) return -1
  if (a.group === b.group) {
    if (a.key > b.key) return 1
    if (a.key < b.key) return -1
  }
  return 0
}

interface FileInfo {
  language: string
  path: string
  id: string
  name: string
  selected: boolean
}

interface Translation {
  group: string
  key: string
  value: string
  language: string
  fileID: string
}

interface GroupedTranslation {
  key: string
  lang: LangTranslations
}

interface LangTranslations {
  [k: string]: Translation[]
}

interface InputFile {
  name: string
  path: string
}

interface NewLabel {
  model: string
  language: string
}

interface JsonGroup {
  [k: string]: string
}

interface JsonFile {
  [k: string]: JsonGroup
}

@Component({
  components: {
    QLayout,
    QToolbar,
    QToolbarTitle,
    QBtn,
    QCard,
    QCardMain,
    QModal,
    QModalLayout,
    QIcon,
    QInput,
    QSelect,
    QSearch,
    QCheckbox
  }
})
export default class Index extends Vue {
  $refs: Vue["$refs"] & {
    importFilesModal: { open: () => void, close: () => void }
    editTranslation: { open: () => void, close: () => void }
    newTranslation: { open: () => void, close: () => void }
  }
  file: File[] = null
  newLang = ''
  newGroup = ''
  languages: string[] = []
  groups: string[] = []
  fileLanguage: string = null
  translations: Translation[] = []
  selectedFiles: FileInfo[] = []
  selectedLanguages: string[] = []
  search = ''
  groupedTranslations: GroupedTranslation[] = []
  filteredTranslations: GroupedTranslation[] = []
  edit = {
    text: '',
    langTarget: <string>null,
    data: <LangTranslations>null
  }
  newLabel = {
    group: '',
    key: '',
    labels: <NewLabel[]>[]
  }

  mounted () {
    this.getLanguages()
    this.getGroups()
    this.getDatabaseTranslations()
  }

  @Watch('search')
  onSearchChanged (value: string): void {
    Loading.show()

    Promise.resolve()
      .then(() => {
        this.searchByTerm(value)
        return Loading.hide()
      })
      .catch(() => true)
  }

  @Watch('translations')
  onTranslationsChanged (): void {
    // Group the list of translation objects by key and language
    this.groupedTranslations = _.map(_.groupBy(this.translations, 'key'), (value: Translation[], key: string) => {
      return { key: key, lang: _.groupBy(value, 'language') }
    })
    this.filteredTranslations = this.groupedTranslations
  }

  /**
    * List editable files by language
    *
    * @return {array} list of editable files
    */
  editableFiles (): FileInfo[] {
    if (!this.edit.langTarget) {
      return this.selectedFiles
    }

    const languages: FileInfo[] = []

    _.each(this.selectedFiles, (item: FileInfo) => {
      if (item.language === this.edit.langTarget) {
        languages.push(item)
      }
    })

    return languages
  }

  /**
    * Add new language to the database
    *
    * @return {void}
    */
  addNewLanguage (): void {
    const lang = this.$gun.get(`language/${this.newLang}`).put({value: this.newLang, label: this.newLang})
    this.$gun.get(`languages`).set(lang)
    this.newLang = ''
  }

  /**
    * Add new group to the database
    *
    * @return {void}
    */
  addNewGroup (): void {
    const group = this.$gun.get(`group/${this.newGroup}`).put({value: this.newGroup, label: this.newGroup})
    this.$gun.get(`groups`).set(group)
    this.newGroup = ''
  }

  /**
    * Load the list of registered languages
    *
    * @return {void}
    */
  getLanguages (): void {
    this.$gun.get('languages').map().val((lang) => {
      this.languages.push(lang)
    })
  }

  /**
    * Load the list of registered groups
    *
    * @return {void}
    */
  getGroups (): void {
    this.$gun.get('groups').map().val((group) => {
      this.groups.push(group)
    })
  }

  /**
    * Load the list of registered translations
    *
    * @return {void}
    */
  getDatabaseTranslations (): void {
    Loading.show()
    const trns: Translation[] = []
    this.$gun.get('translations').valMapEnd((label) => {
      let group: string, language: string

      this.$gun.get(label.group['#']).val((dbGroup) => {
        if (dbGroup) group = dbGroup.value
        else group = 'x'
      })

      this.$gun.get(label.language['#']).val((dbLang) => { language = dbLang.value })

      // Add the to the list of inserted languages
      if (!_.find(this.selectedLanguages, (item: string) => { return item === language })) {
        this.selectedLanguages.push(language)
      }

      trns.push({
        group: group,
        key: label.key,
        value: label.value,
        language: language,
        fileID: null
      })

      if (!_.find(this.selectedFiles, (item) => item.name === `Banco (${language})`)) {
        // Add to the list of selected files
        this.selectedFiles.push({
          name: `Banco (${language})`,
          language: language,
          selected: false,
          path: null,
          id: null
        })
      }
    }, () => {
      this.translations = this.translations.concat(trns)
      Loading.hide()
    })
  }

  /**
    * Add a JSON or RESX translation file
    *
    * @return {void}
    */
  addFile (): void {
    // Check if a file was seletected
    if (!this.file.length) return

    // Check if the file was already add
    if (_.find(this.selectedFiles, { 'path': this.file[0].path })) {
      return
    }

    Loading.show()

    const fileId = this.guid() // generete a new ID for the file

    // Add the to the list of inserted languages
    if (!_.find(this.selectedLanguages, (item: string) => { return item === this.fileLanguage })) {
      this.selectedLanguages.push(this.fileLanguage)
    }

    // Add to the list of selected files
    this.selectedFiles.push({
      id: fileId,
      name: this.file[0].name,
      language: this.fileLanguage,
      path: this.file[0].path,
      selected: false
    })

    const reader = new FileReader()

    // On File load
    reader.onload = (e) => {
      const result: string = (<any>e.target).result
      if (result) {
        if (this.file[0].name.endsWith('.json')) {
          // Parse JSON file and create a translation object
          _.each(JSON.parse(result), (value: JsonGroup, key: string) => {
            const group = key
            _.each(value, (value: string, key: string) => {
              this.translations.push({
                fileID: fileId,
                group: group,
                key: key,
                value: value,
                language: this.fileLanguage
              })
            })
          })
        }
        else if (this.file[0].name.endsWith('.resx')) {
          // Parse RESX file and create a translation object
          resx2js(result, (err: Error, res: { [k: string]: string }) => {
            if (err) {
              console.log('error converting file to json', err)
            }
            else {
              _.each(res, (value: string, key: string) => {
                this.translations.push({
                  fileID: fileId,
                  group: this.UnFormatGroup(key.split('_')[0], 'resx'),
                  key: key.split('_')[1],
                  value: value,
                  language: this.fileLanguage
                })
              })
            }
          })
        }
      }
    }

    reader.onloadend = () => { Loading.hide() }

    reader.readAsText(this.file[0])
    this.$refs.importFilesModal.close()
  }

  /**
    * Open the edition modal and translate the label.
    *
    * @param {object} data - Translation object
    * @param {string} language - The target language to translate
    * @return {Promise}
    */
  editTranslation (data: LangTranslations, language: string): void {
    // open the modal to edit the label
    this.$refs.editTranslation.open()
    this.edit.data = data
    this.edit.langTarget = language

    // If a translation for this label not exist then tranlate
    if (data[language]) {
      this.edit.text = data[language][0].value
    }
    else {
      const text: string = data['en-US'] ? data['en-US'][0].value : data[Object.keys(data)[0]][0].value
      const langSource: string = data['en-US'] ? 'en-US' : data[Object.keys(data)[0]][0].language
      const langTarget: string = data['en-US'] ? language : 'en-US'

      Loading.show()

      // Call Watson API to translate the label
      this.translateValue(text, langSource, langTarget, language)
        .then((translation) => {
          this.edit.text = translation
          return true
        })
        .catch(() => {
          console.log('erro')
          return false
        })
        .then(() => {
          Loading.hide()
          return true
        })
        .catch(() => null)
    }
  }

  /**
    * Translate from portugues (Brazil) to any language
    *
    * @return {void}
    */
  translateWatson (): void {
    Loading.show()

    this.translateValue(this.edit.text, 'pt-BR', 'en-US', this.edit.langTarget)
      .then((translation) => {
        this.edit.text = translation
        return true
      })
      .catch(() => {
        console.log('erro')
        return false
      })
      .then(() => {
        Loading.hide()
        return true
      })
      .catch(() => null)
  }

  /**
    * Save label edition on the file or/and database.
    *
    * @return {void}
    */
  saveEdition (): void {
    const translations = _.groupBy(this.translations, 'fileID')
    const promises: Promise<void>[] = []
    Loading.show()

    // Update all selected files
    _.each(_.groupBy(this.selectedFiles, 'selected')['true'], (file) => {
      if (file.id) {
        const fileTranslations: Translation[] = translations[file.id]
        const editedLabelIndex: number = fileTranslations ? _.findIndex(fileTranslations, (item) => { return item.key === this.edit.data[Object.keys(this.edit.data)[0]][0].key }) : -1
        let newTranslation: Translation

        // if already exist the key in the file just change the value else create a translate object
        if (editedLabelIndex >= 0) {
          fileTranslations[editedLabelIndex].value = this.edit.text
        }
        else {
          newTranslation = {
            fileID: file.id,
            group: this.edit.data[Object.keys(this.edit.data)[0]][0].group,
            key: this.edit.data[Object.keys(this.edit.data)[0]][0].key,
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
      }
      else {
        // Grava no banco
        const newTranslation = {
          fileID: <string>undefined,
          group: this.edit.data[Object.keys(this.edit.data)[0]][0].group,
          key: this.edit.data[Object.keys(this.edit.data)[0]][0].key,
          value: this.edit.text,
          language: this.edit.langTarget
        }

        const lang = this.$gun.get(`language/${newTranslation.language}`)
        const group = this.$gun.get(`group/${newTranslation.group}`)

        const translationDB = this.$gun.get(`translation/${newTranslation.key}-${newTranslation.language}`)

        translationDB.path('key').put(newTranslation.key)
        translationDB.path('value').put(newTranslation.value)
        translationDB.path('language').put(lang)
        translationDB.path('group').put(group)

        this.$gun.get(`translations`).set(translationDB)

        const edition = _.findIndex(this.translations, (item) => { return item.key === newTranslation.key && item.language === newTranslation.language && !item.fileID })

        if (edition >= 0) {
          this.translations[edition].value = newTranslation.value
          const aux = this.translations
          this.translations = []
          this.translations = aux
        }
        else {
          this.translations.push(newTranslation)
        }
      }
    })

    Promise.all(promises).then(() => {
      this.$refs.editTranslation.close()
      // Clean the selected file list
      this.selectedFiles = _.map(this.selectedFiles, (file) => {
        file.selected = false
        return file
      })
      return Loading.hide()
    }).catch(() => {
      this.$refs.editTranslation.close()
      return Loading.hide()
    })
  }

  /**
    * Get label that was not tranlated to all the languages.
    *
    * @return {void}
    */
  filterIncomplete () {
    this.filteredTranslations = Object.assign({}, this.getIncompleteTranlations())
  }

  /**
   * Get label that was not tranlated to all the languages.
   *
   * @return {array} List of incompleted labels.
   */
  getIncompleteTranlations (): GroupedTranslation[] {
    const filteredTranslations: GroupedTranslation[] = []

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

    return filteredTranslations
  }

  /**
    * Clear all filters.
    *
    * @return {void}
    */
  filterAll (): void {
    this.filteredTranslations = this.groupedTranslations
  }

  /**
    * Translate all incompletes labels.
    *
    * @return {void}
    */
  translateIncompletes () {
    Loading.show()
    // Busca as traduções para os arquivos incompletos
    this.getLabelTranslated(this.getIncompleteTranlations())
      .then((translated) => {
        const groupedTranslated = _.groupBy(translated, 'fileID') // agrupa as traduções por arquivo

        // salva cada arquivo que teve uma label traduzida
        _.each(groupedTranslated, (value, key) => {
          // união entre as labels já existente no arquivo com as novas labels traduzidas
          const grpTrans = _.groupBy(this.translations, 'fileID')[key]
          const fileLabels = grpTrans ? _.concat(grpTrans, value) : value

          // busca as informações do arquivo que será alterado
          const file = _.find(this.selectedFiles, (item) => { return item.id === key })

          if (file) {
            // formata as labels no formato necessário para salvar o arquivo
            return this.formatJSONToFile(file.path.split('.').pop(), fileLabels)
              .then((newFileString) => {
                // grava os dados no arquivo
                return this.writeFile(file.path, newFileString)
                  .then(() => {
                    // Atualiza a lista de traduções
                    _.each(value, (item) => {
                      this.translations.push(item)
                    })
                    return true
                  })
                  .catch(() => {
                    return console.log('err')
                  })
              })
              .catch(() => {
                return console.log('err')
              })
          }
          else {
            _.each(value, (item) => {
              // Grava no banco
              const lang = this.$gun.get(`language/${item.language}`)
              const group = this.$gun.get(`group/${item.group}`)

              const translationDB = this.$gun.get(`translation/${item.key}-${item.language}`)

              translationDB.path('key').put(item.key)
              translationDB.path('value').put(item.value)
              translationDB.path('language').put(lang)
              translationDB.path('group').put(group)

              this.$gun.get(`translations`).set(translationDB)

              this.translations.push({
                group: item.group,
                key: item.key,
                value: item.value,
                language: item.language,
                fileID: null
              })
            })
          }
        })
        return true
      })
      .then(() => {
        return Loading.hide()
      })
      .catch(() => {
        Loading.hide()
        return console.log('error')
      })
  }

  /**
    * Write the file with all labels.
    *
    * @param {string} filePath - File path
    * @param {string} newFileString - The labels to write the file
    * @return {Promise}
    */
  writeFile (filePath: string, newFileString: string) {
    // eslint-disable-next-line no-undef
    return pify(getFS().writeFile)(filePath, newFileString)
  }

  /**
    * Translate a list of labels.
    *
    * @param {array} toTranslate - List of labels (incompletes) to translate
    * @return {array} List of transleted labels
    */
  getLabelTranslated (toTranslate: GroupedTranslation[]): Promise<Translation[]> {
    const promises: Promise<Translation>[] = []

    // For each item to be translated
    _.each(toTranslate, (item) => {
      // Translate for each language
      _.each(this.selectedLanguages, (lang) => {
        // Check if some language was not transleted yet
        if (!item.lang[lang]) {
          // Watson can translate any language to english and english to any language, so if the target is not english and the source is not english then translate to english first
          const text = item.lang['en-US'] ? item.lang['en-US'][0].value : item.lang[Object.keys(item.lang)[0]][0].value
          const langSource = item.lang['en-US'] ? 'en-US' : item.lang[Object.keys(item.lang)[0]][0].language
          const langTarget = item.lang['en-US'] ? lang : 'en-US'

          // Add all tradutions to a list o promises
          promises.push(this.translateValue(text, langSource, langTarget, lang)
            .then((translation) => {
              return {
                fileID: _.find(this.selectedFiles, item => { return item.language === lang }).id,
                group: item.lang[Object.keys(item.lang)[0]][0].group,
                key: item.key,
                value: translation,
                language: lang
              }
            }))
        }
      })
    })

    // Resolve all promises and return their results as a array
    return Promise.all(promises)
  }

  /**
    * Transform the labels array to the format of the file.
    *
    * @param {string} typeOfFile - the type of the file.
    * @param {object} jsonObject - the labels to save the file.
    * @return {string} File labels
    */
  formatJSONToFile (typeOfFile: string, jsonObject: Translation[]) {
    if (typeOfFile === 'resx') {
      return this.translationsToRESX(jsonObject)
    }
    else if (typeOfFile === 'json') {
      return this.translationsToJSON(jsonObject)
    }
  }

  /**
    * Transform the labels array to the format of resx file.
    *
    * @param {object} jsonObject - the labels to save the file.
    * @return {string} File labels
    */
  translationsToRESX (jsonObject: Translation[]): Promise<string> {
    const jsonFile: any = {}

    // order the labels
    jsonObject.sort(compareGroupKey)

    _.each(jsonObject, (item) => {
      jsonFile[item.group + '_' + item.key] = item.value
    })

    return pify(js2resx)(jsonFile)
  }

  /**
    * Transform the labels array to the format of json file.
    *
    * @param {object} jsonObject - the labels to save the file.
    * @return {string} File labels
    */
  translationsToJSON (jsonObject: Translation[]): Promise<string> {
    const jsonFile: any = {}

    // order the labels
    jsonObject.sort(compareGroupKey)

    _.each(jsonObject, (item) => {
      if (!jsonFile[item.group]) jsonFile[item.group] = {} // create a new group if it wasn't created yet
      jsonFile[item.group][item.key] = item.value
    })

    // return json object idented with 4 spaces
    return Promise.resolve(JSON.stringify(jsonFile, null, '    '))
  }

  /**
    * Translate a value.
    *
    * @param {string} text - text to tranlate.
    * @param {string} langSource - the source language.
    * @param {string} langTarget - the target language.
    * @param {string} finalLang - the final language.
    * @return {string} Translated text
    */
  translateValue (text: string, langSource: string, langTarget: string, finalLang: string): Promise<string> {
    return this.translateNew(text, langSource, langTarget).then(response => {
      const translation = response.data.translations[0].translation

      // If the target language isn't the en-US and the final language isn't 'en-US' so need to tranlate to the final language
      if (langSource !== 'en-US' && finalLang !== 'en-US' && langSource !== 'en' && finalLang !== 'en') {
        return this.translateNew(translation, 'en-US', finalLang).then(response => {
          return response.data.translations[0].translation
        })
      }
      else {
        return translation
      }
    })
  }

  /**
    * Call the API to translate some text.
    *
    * @param {string} text - text to tranlate.
    * @param {string} langSource - the source language.
    * @param {string} langTarget - the target language.
    * @return {Promise}
    */
  translateNew (text: string, langSource: string, langTarget: string) {
    return axios.get(`http://localhost:3100/?texto=${encodeURIComponent(text)}&source=${langSource}&target=${langTarget}`)
  }

  /**
    * Search all languages by a term
    *
    * @param {string} value - The term searched.
    */
  searchByTerm (value: string) {
    if (value) {
      this.filteredTranslations = []
      _.each(this.groupedTranslations, (item) => {
        if (_.includes(item.key, value)) {
          this.filteredTranslations.push(item)
        }
        else {
          let included = false
          _.each(item.lang, (lang) => {
            if (!included) {
              _.each(lang, (o) => {
                if (_.includes(o.value, value)) {
                  this.filteredTranslations.push(item)
                  included = true
                }
              })
            }
          })
        }
      })
    }
    else {
      this.filteredTranslations = this.groupedTranslations
    }
  }

  addNewLabel () {
    _.each(this.selectedFiles, (file) => {
      if (file.selected) {
        const labelValue = _.find(this.newLabel.labels, (item) => item.language === file.language).model

        if (file.id) {
          // Grava no arquivo
          const label: Translation = {
            fileID: file.id,
            group: this.formatGroup(this.newLabel.group, file.path ? file.path.split('.').pop() : '?'),
            key: this.newLabel.key,
            value: labelValue,
            language: file.language
          }

          // união entre as labels já existente no arquivo com as novas labels traduzidas
          const grpTrand = _.groupBy(this.translations, 'fileID')[file.id]
          grpTrand ? grpTrand.push(label) : [].push(label)

          // formata as labels no formato necessário para salvar o arquivo
          return this.formatJSONToFile(file.path.split('.').pop(), grpTrand)
            .then((newFileString) => {
              // grava os dados no arquivo
              return this.writeFile(file.path, newFileString)
                .then(() => {
                  // Atualiza a lista de traduções
                  this.translations.push(label)
                  this.$refs.newTranslation.close()
                  return true
                })
            })
            .catch(() => {
              this.$refs.newTranslation.close()
              return console.log('err')
            })
        }
        else {
          // Grava no banco
          const lang = this.$gun.get(`language/${file.language}`)
          const group = this.$gun.get(`group/${this.newLabel.group}`)

          const translationDB = this.$gun.get(`translation/${this.newLabel.key}-${file.language}`)

          translationDB.path('key').put(this.newLabel.key)
          translationDB.path('value').put(labelValue)
          translationDB.path('language').put(lang)
          translationDB.path('group').put(group)

          this.$gun.get(`translations`).set(translationDB)
          this.$refs.newTranslation.close()
        }
      }
    })
  }

  onNewLabelFileClick (file: FileInfo) {
    if (file.selected) {
      if (!_.find(this.newLabel.labels, (item) => item.language === file.language)) {
        this.newLabel.labels.push({
          model: '',
          language: file.language
        })
      }
    }
    else {
      if (!_.find(this.selectedFiles, (item) => item.language === file.language && item.selected)) {
        _.remove(this.newLabel.labels, (item) => item.language === file.language)
        this.newLabel = Object.assign({}, this.newLabel)
      }
    }
  }

  formatGroup (group: string, fileType: string) {
    if (fileType === 'resx') {
      if (group === 'label') {
        return 'lbl'
      }
      else if (group === 'message') {
        return 'msg'
      }
    }
    else {
      return group
    }
  }

  UnFormatGroup (group: string, fileType: string) {
    if (fileType === 'resx') {
      if (group === 'lbl') {
        return 'label'
      }
      else if (group === 'msg') {
        return 'message'
      }
      else {
        return group
      }
    }
    else {
      return group
    }
  }

  addToDataBase (translation: Translation[]) {
    const lang = this.$gun.get(`language/${translation[0].language}`)
    const group = this.$gun.get(`group/${translation[0].group}`)

    const translationDB = this.$gun.get(`translation/${translation[0].key}-${translation[0].language}`)

    translationDB.path('key').put(translation[0].key)
    translationDB.path('value').put(translation[0].value)
    translationDB.path('language').put(lang)
    translationDB.path('group').put(group)

    this.$gun.get(`translations`).set(translationDB)
    this.translations.push({
      group: translation[0].group,
      key: translation[0].key,
      value: translation[0].value,
      language: translation[0].language,
      fileID: null
    })
  }

  alreadyInDataBase (translationDB: Translation[]) {
    return !!_.find(translationDB, (item) => !item.fileID)
  }

  /**
    * Generate a new GUID.
    *
    * @return {string} the GUID.
    */
  guid (): string {
    function s4 (): string {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1)
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4()
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
