<template lang="html">
  <div>
    <q-toolbar color="dark">
      <q-toolbar-title>
        I18N Bank &amp; Manager
        <span slot="subtitle">Banco de dados e gerenciamento de traduções</span>
      </q-toolbar-title>
      <q-btn flat @click="$refs.configurationModal.show()">
        <q-icon name="fa-cog" />
      </q-btn>
    </q-toolbar>

    <q-card>
      <q-card-main>
        <div class="row items-center justify-between filters">
          <div>
            <q-btn color="primary" icon="add" @click="$refs.newTranslation.show()">Nova label</q-btn>
          </div>
          <div>
            <q-btn color="primary" icon="file upload" @click="$refs.importFilesModal.show()">Importar Arquivo</q-btn>
          </div>
          <div>
            <q-btn color="primary" icon="cancel" @click="translateIncompletes">Traduzir Incomp.</q-btn>
          </div>
          <div class="row items-center">
            <q-btn color="primary" icon="filter list" @click="filterIncomplete">Incompletos</q-btn>
            <q-btn color="primary" icon="filter list" @click="filterAll">Todos</q-btn>
            <q-search v-model="search" :debounce="600" float-label="Buscar" placeholder="" />
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <table class="q-table bordered striped-odd horizontal-separator vertical-separator responsive" v-if="groupedTranslations.length">
              <thead>
                <tr>
                  <th class="text-left">Chave</th>
                  <th class="text-left" v-for="(lang, index) in languages" :key="index">{{lang.value}}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(label, index) in filteredTranslations" :key="index">
                  <td>{{ label.key }}</td>
                  <td class="text-left" v-for="(lang, index) in languages" :key="index" :data-th="lang.value">
                    {{label.lang[lang.value] || '-'}}
                    <!-- q-btn small flat @click="editTranslation(label, lang)">
                      <q-icon name="edit" />
                    </q-btn -->
                    <!-- q-btn small flat v-if="label.lang[lang] && !alreadyInDataBase(label.lang[lang])" @click="addToDataBase(label.lang[lang])">
                      <q-icon name="add" />
                      <q-icon name="fa-database" />
                    </q-btn -->
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
          <q-btn flat @click="$refs.importFilesModal.hide()">
            <q-icon name="close" />
          </q-btn>
        </q-toolbar>

        <div class="layout-padding importFilesContent">
          <div class="row">

            <div class="col-md-6">
              <p v-for="localFile in localFiles" :key="localFile.id">
                {{ localFile.name }} | Idioma: {{ localFile.language }}
              </p>
            </div>
            <div class="col-md-6">
              <div class="row">
                <input
                  type="file"
                  @change="selectedFile = $event.target.files"
                  class="input-file"
                >
              </div>
              <div class="row">
                <div style="width: 500px; max-width: 90vw;">
                  <q-select
                    v-model="modalImportFiles.fileLanguage"
                    float-label="Idioma"
                    :options="languages"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>

        <q-toolbar slot="footer" class="justify-end" color="dark">
          <q-btn flat @click="addFile(modalImportFiles.fileLanguage)">
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
          <q-btn flat @click="$refs.configurationModal.hide()">
            <q-icon name="close" />
          </q-btn>
        </q-toolbar>
        <div class="layout-padding">
          <div class="row">
            <div class="col-md-6">
              <fieldset>
                <legend>Linguagem</legend>
                <div class="col-md-12">
                  <q-input v-model="modalConfig.newLang" float-label="Nova lingua" />
                  <q-btn color="primary" class="pull-right" @click="addNewLanguage(modalConfig.newLang)">
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
                  <q-input v-model="modalConfig.newGroup" float-label="Novo Grupo" />
                  <q-btn color="primary" class="pull-right" @click="addNewGroup(modalConfig.newGroup)">
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
          <q-btn flat @click="$refs.editTranslation.hide()">
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
              <q-checkbox v-for="(localFile, index) in localFiles" v-model="localFile.selected" :label="localFile.name" v-bind:key="index"/>
            </div>

          </div>
        </div>
      </q-modal-layout>
    </q-modal>

    <q-modal ref="newTranslation" :content-css="{minWidth: '50vw', minHeight: '450px'}">
      <q-modal-layout>
        <q-toolbar slot="header" class="justify-between"  color="dark">
          Nova Tradução
          <q-btn flat @click="$refs.newTranslation.hide()">
            <q-icon name="close" />
          </q-btn>
        </q-toolbar>
        <div class="layout-padding newTranslationContent">
          <div class="row items-center justify-between">
            <div class="col-md-12">
              <q-checkbox
                v-for="(localFile, index) in localFiles"
                v-model="localFile.selected"
                :label="localFile.name"
                v-bind:key="index"
                @input="onNewLabelFileClick(localFile)"
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
              <div class="col-md-12" v-for="lang in languages" :key="lang.value">
                <q-input v-model="newLabel[lang.value]" :float-label="lang.value" />
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

  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Watch } from 'vue-property-decorator'
import { Loading, LocalStorage } from 'quasar-framework/dist/quasar.mat.esm.js'
import * as _ from 'lodash'
import * as pify from 'pify'
import axios from 'axios'
import resx2js from 'resx/resx2js'
import js2resx from 'resx/js2resx'
import PouchDB from 'pouchdb'

const db = {
  languages: null,
  groups: null,
  labels: null
}

// db.languages.replicate.from('http://localhost:5984/languages', {live: true, retry: true})
// db.groups   .replicate.from('http://localhost:5984/groups',    {live: true, retry: true})

// var rep = PouchDB.replicate('http://localhost:5984/languages', 'languages', {
//   live: true,
//   retry: true
// }).on('change', function (info) {
//   // handle change
// }).on('paused', function (err) {
//   // replication paused (e.g. replication up to date, user went offline)
// }).on('active', function () {
//   // replicate resumed (e.g. new changes replicating, user went back online)
// }).on('denied', function (err) {
//   // a document failed to replicate (e.g. due to permissions)
// }).on('complete', function (info) {
//   // handle complete
// }).on('error', function (err) {
//   // handle error
// });

let getFS: () => any

function compareGroupKey(a: GroupedTranslation, b: GroupedTranslation): number {
  if (a.group > b.group) { return 1 }
  if (a.group < b.group) { return -1 }
  if (a.group === b.group) {
    if (a.key > b.key) { return 1 }
    if (a.key < b.key) { return -1 }
  }
  return 0
}

function compareGroupKey2(group: string, key: string, b: GroupedTranslation): number {
  if (group > b.group) { return 1 }
  if (group < b.group) { return -1 }
  if (group === b.group) {
    if (key > b.key) { return 1 }
    if (key < b.key) { return -1 }
  }
  return 0
}

interface DbLabelTranslation {
  language: string
  value: string
  approved: boolean
}

interface DbLabelProduct {
  product: string
  versions: string[]
}

interface DbLabelEvent {
  language: string
  authorEmail: string
  action: string
  date: string
  oldValue: string
  newValue: string
}

interface DbLabel {
  _id: string
  description: string
  group: string
  translations: DbLabelTranslation[]
  products: DbLabelProduct[]
  events: DbLabelEvent[]
}

interface FileInfo {
  language: string
  path: string
  id: string
  name: string
  selected: boolean
}

interface Translation {
  value: string
}

interface TranslationItem {
  key: string
  group: string
  language: string
  value: string
  fileID: string
}

interface GroupedTranslation {
  key: string
  group: string
  lang: LangTranslations
  filesIDs: string[]
}

interface LangTranslations {
  [k: string]: Translation
}

interface InputFile {
  name: string
  path: string
}

interface StringKeyValue {
  [k: string]: string
}

interface JsonFile {
  [k: string]: StringKeyValue
}

interface SelectOption {
  value: string
  label: string
}

@Component({})
export default class Index extends Vue {
  $refs: Vue['$refs'] & {
    configurationModal: { show: () => void, hide: () => void }
    importFilesModal: { show: () => void, hide: () => void }
    editTranslation: { show: () => void, hide: () => void }
    newTranslation: { show: () => void, hide: () => void }
  }
  nuncaTeve = true
  dbConnectionInfo: any = null
  selectedFile: File[] = null
  languages: SelectOption[] = []
  groups: SelectOption[] = []
  localFiles: FileInfo[] = []
  // selectedLanguages: string[] = []
  search = ''
  groupedTranslations: GroupedTranslation[] = []
  filteredTranslations: GroupedTranslation[] = []
  modalImportFiles = {
    fileLanguage: null as string
  }
  modalConfig = {
    newLang: '',
    newGroup: ''
  }
  edit = {
    text: '',
    langTarget: null as string,
    data: null as GroupedTranslation
  }
  newLabel = {
    group: '',
    key: '',
    lang: {}
  }

  mounted() {
    this.dbConnectionInfo = LocalStorage.get.item('dbConnectionInfo')
    if (!this.dbConnectionInfo) {
      this.$router.push('/login')
      return
    }
    db.languages = new PouchDB(this.dbConnectionInfo.host + '/languages', {auth: this.dbConnectionInfo.auth}),
    db.groups = new PouchDB(this.dbConnectionInfo.host + '/groups', {auth: this.dbConnectionInfo.auth}),
    db.labels = new PouchDB(this.dbConnectionInfo.host + '/labels', {auth: this.dbConnectionInfo.auth})
    this.getLanguages()
    this.getGroups()
    this.getDatabaseTranslations()
  }

  @Watch('search')
  onSearchChanged(value: string): void {
    if (!value) {
      this.filteredTranslations = this.groupedTranslations
      return
    }

    Loading.show()
    Promise.resolve().then(() => {
      this.filteredTranslations = this.groupedTranslations.filter((label) => this.labelContainsText(label, value))
    })
    .catch(() => undefined)
    .then(() => Loading.hide())
  }

  // @Watch('translations')
  // onTranslationsChanged(): void {
  //   // Group the list of translation objects by key and language
  //   this.groupedTranslations = _.map(_.groupBy(this.translations, 'key'), (value: Translation[], key: string) => {
  //     return { key, lang: _.groupBy(value, 'language') }
  //   })
  //   this.filteredTranslations = this.groupedTranslations
  // }

   /*
    * List editable files by language
    *
    * @return {array} list of editable files
    */
  // editableFiles(): FileInfo[] {
  //   if (!this.edit.langTarget) {
  //     return this.selectedFiles
  //   }

  //   const languages: FileInfo[] = []

  //   _.each(this.selectedFiles, (item: FileInfo) => {
  //     if (item.language === this.edit.langTarget) {
  //       languages.push(item)
  //     }
  //   })

  //   return languages
  // }

   /*
    * Add new language to the database
    *
    * @return {void}
    */
  addNewLanguage(newLang: string): void {
    if (!newLang) return
    db.languages.get(newLang)
    .catch(() => db.languages.put({_id: newLang}))
    this.modalConfig.newLang = ''
  }

   /*
    * Add new group to the database
    *
    * @return {void}
    */
  addNewGroup(newGroup: string): void {
    if (!newGroup) return
    db.groups.get(newGroup)
    .catch(() => db.groups.put({_id: newGroup}))
    this.modalConfig.newGroup = ''
  }

   /*
    * Load the list of registered languages
    *
    * @return {void}
    */
  getLanguages(): void {
    db.languages.changes({since: 0, live: true, include_docs: true})
    .on('change', (change) => {
      // change.id contains the doc id, change.doc contains the doc
      if (change.deleted) {
        // document was deleted
        for (let i = this.languages.length - 1; i >= 0; i--) {
          if (this.languages[i].value === change.id) {
            this.languages.splice(i, 1)
          }
        }
      }
      else {
        // document was added/modified
        for (let i = this.languages.length - 1; i >= 0; i--) {
          if (this.languages[i].value === change.id) {
            this.languages[i] = {value: change.id, label: change.id}
            return
          }
        }
        this.languages.push({value: change.id, label: change.id})
      }
    })
    .on('error', (err) => {
      // handle errors
    })
  }

   /*
    * Load the list of registered groups
    *
    * @return {void}
    */
  getGroups(): void {
    db.groups.changes({since: 0, live: true, include_docs: true})
    .on('change', (change) => {
      // change.id contains the doc id, change.doc contains the doc
      if (change.deleted) {
        // document was deleted
        for (let i = this.groups.length - 1; i >= 0; i--) {
          if (this.groups[i].value === change.id) {
            this.groups.splice(i, 1)
          }
        }
      }
      else {
        // document was added/modified
        for (let i = this.groups.length - 1; i >= 0; i--) {
          if (this.groups[i].value === change.id) {
            this.groups[i] = {value: change.id, label: change.id}
            return
          }
        }
        this.groups.push({value: change.id, label: change.id})
      }
    })
    .on('error', (err) => {
      // handle errors
    })
  }

   /*
    * Load the list of registered translations
    *
    * @return {void}
    */
  getDatabaseTranslations(): void {
    Loading.show()
    Promise.resolve().then(async () => {
      const dbInfo = await db.labels.info()
      const result = await db.labels.allDocs({ include_docs: true })
      this.groupedTranslations = result.rows.map((row) => this.convertDbLabelToGroupedTranslation(row.doc))
      this.groupedTranslations.sort(compareGroupKey)
      this.filterAll()
      Loading.hide()
      return dbInfo
    })
    .catch((err) => {
      Loading.hide()
      console.log('Erro:', err)
      alert(err.message || err)
      return null
    })
    .then((dbInfo) => {
      if (dbInfo) {
        return db.labels.changes({since: dbInfo.update_seq, live: true, include_docs: true})
        .on('change', (change) => {
          if (!change.deleted) {
            // document was added/modified
            // Add the to the list of inserted languages
            const position = this.findLabelPosition(change.doc.group, change.id, 0)
            if (!this.groupedTranslations[position]) {
              this.groupedTranslations[position] = this.convertDbLabelToGroupedTranslation(change.doc)
            }
            else if (this.groupedTranslations[position].key === change.id) {
              Object.assign(this.groupedTranslations[position], this.convertDbLabelToGroupedTranslation(change.doc))
            }
            else {
              this.groupedTranslations.splice(position, 0, this.convertDbLabelToGroupedTranslation(change.doc))
            }
          }
        })
        .on('error', (err) => {
          // handle errors
          console.log(err)
        })
      }
    })
    .catch((err) => console.log(err))
  }

  convertDbLabelToGroupedTranslation (dbLabel: DbLabel): GroupedTranslation {
    const label = {
      key: dbLabel._id,
      group: dbLabel.group,
      filesIDs: [],
      lang: {}
    }
    for (const t of dbLabel.translations) {
      label.lang[t.language] = t.value
    }
    return label
  }

   /*
    * Add a JSON or RESX translation file
    *
    * @return {void}
    */
  addFile(fileLanguage: string): void {
    // Check if a file was seletected
    if ((!this.selectedFile.length) || (!fileLanguage)) {
      return
    }
    const fileInfo = this.selectedFile[0]

    // Check if the file was already added
    for (const localFile of this.localFiles) {
      if (localFile.path === fileInfo.path) {
        return
      }
    }

    Loading.show()

    const fileId = this.guid() // generete a new ID for the file

    // Add to the list of selected files
    this.localFiles.push({
      id: fileId,
      name: fileInfo.name,
      language: fileLanguage,
      path: fileInfo.path,
      selected: false
    })

    const reader = new FileReader()
    console.log('P1')

    // On File load
    reader.onload = (e) => {
      console.log('P2')
      const result: string = (e.target as any).result
      if (result) {
        if (fileInfo.name.endsWith('.json')) {
          // Parse JSON file and create a translation object
          const contents = JSON.parse(result)
          let position = 0
          for (const groupName in contents) {
            for (const labelId in contents[groupName]) {
              // position = this.findLabelPosition(groupName, labelId, position)
              this.insertNewLabel({
                fileID: fileId,
                group: groupName,
                key: labelId,
                value: contents[groupName][labelId],
                language: fileLanguage
              })
            }
          }
        }
        else if (fileInfo.name.endsWith('.resx')) {
          console.log('P3')
          // Parse RESX file and create a translation object
          resx2js(result, (err: Error, res: StringKeyValue) => {
            console.log('P4')
            if (err) {
              console.log('error converting file to json', err)
            }
            else {
              let position = 0
              console.log('P5')
              for (const labelId in res) {
                const groupName = this.UnFormatGroup(labelId.split('_')[0], 'resx')
                // position = this.findLabelPosition(groupName, labelId, position)
                this.insertNewLabel({
                  fileID: fileId,
                  group: groupName,
                  key: labelId.split('_')[1],
                  value: res[labelId],
                  language: fileLanguage
                })
              }
            }
          })
        }
      }
    }

    reader.onloadend = () => { Loading.hide() }

    reader.readAsText(fileInfo)
    this.$refs.importFilesModal.hide()
  }

  // addTranslation (translation: TranslationItem, position: number, override = false) {
  //   if (!this.groupedTranslations[position]) {
  //     // add new at the end
  //     const grTrans = {
  //       key: translation.key,
  //       group: translation.group,
  //       filesIDs: [translation.fileID],
  //       lang: {
  //         [translation.language]: { value: translation.value }
  //       }
  //     }
  //     this.groupedTranslations[position] = grTrans
  //   }
  //   else if (this.groupedTranslations[position].key === translation.key) {
  //     // update existing
  //     const grTrans = this.groupedTranslations[position]
  //     if (override || (!grTrans.lang[translation.language]) || (!grTrans.lang[translation.language].value)) {
  //       grTrans.lang[translation.language] = { value: translation.value }
  //     }
  //     if (translation.fileID && !grTrans.filesIDs.includes(translation.fileID)) {
  //       grTrans.filesIDs.push(translation.fileID)
  //     }
  //   }
  //   else {
  //     // add new label in the middle
  //     const grTrans = {
  //       key: translation.key,
  //       group: translation.group,
  //       filesIDs: [translation.fileID],
  //       lang: {
  //         [translation.language]: { value: translation.value }
  //       }
  //     }
  //     this.groupedTranslations.splice(position, 0, grTrans)
  //   }
  // }

  findLabel (id: string, startIndex: number) {
    if (startIndex < 0) startIndex = 0
    if (startIndex >= this.groupedTranslations.length) startIndex = 0
    let i = startIndex
    while (i < this.groupedTranslations.length) {
      if (this.groupedTranslations[i].key === id) {
        return this.groupedTranslations[i]
      }
      i++
      if (i >= this.groupedTranslations.length) i = 0
      if (i === startIndex) break
    }
    return null
  }

  findLabelPosition (group: string, id: string, startIndex: number) {
    if (this.groupedTranslations.length === 0) return 0
    if (startIndex < 0) startIndex = 0
    if (startIndex >= this.groupedTranslations.length) startIndex = this.groupedTranslations.length - 1
    let i = startIndex
    while (true) {
      if (i === this.groupedTranslations.length) return i
      else if (compareGroupKey2(group, id, this.groupedTranslations[i]) > 0) i++
      else {
        if (i === 0) return 0
        else if (compareGroupKey2(group, id, this.groupedTranslations[i - 1]) > 0) return i
        else i--
      }
    }
  }

   /*
    * Open the edition modal and translate the label.
    *
    * @param {object} data - Translation object
    * @param {string} language - The target language to translate
    * @return {Promise}
    */
  editTranslation(data: GroupedTranslation, language: string): void {
    // open the modal to edit the label
    this.$refs.editTranslation.show()
    this.edit.data = data
    this.edit.langTarget = language

    // If a translation for this label not exist then tranlate
    if (data[language]) {
      this.edit.text = data[language].value
    }
    else {
      const text: string = data['en-US'] ? data['en-US'].value : data[Object.keys(data)[0]].value
      const langSource: string = data['en-US'] ? 'en-US' : Object.keys(data)[0]
      const langTarget: string = data['en-US'] ? language : 'en-US'

      Loading.show()

      // Call Watson API to translate the label
      this.translateValue(text, langSource, langTarget, language)
      .then((translation) => {
        this.edit.text = translation
        return true
      })
      .catch((err) => console.error(err))
      .then(() => {
        Loading.hide()
        return true
      })
      .catch(() => null)
    }
  }

   /*
    * Translate from portugues (Brazil) to any language
    *
    * @return {void}
    */
  translateWatson(): void {
    Loading.show()

    this.translateValue(this.edit.text, 'pt-BR', 'en-US', this.edit.langTarget)
    .then((translation) => {
      this.edit.text = translation
      return true
    })
    .catch((err) => console.error(err))
    .then(() => {
      Loading.hide()
      return true
    })
    .catch(() => null)
  }

   /*
    * Save label edition on the file or/and database.
    *
    * @return {void}
    */
  saveEdition(): void {
    // // const translations = _.groupBy(this.translations, 'fileID')
    // const promises: Array<Promise<void>> = []
    // Loading.show()
    // // const language = Object.keys(this.edit.data)[0]
    // const editedLabelId = this.edit.data.key

    // // Update all selected files
    // for (const file of this.selectedFiles) {
    //   if (!file.selected) continue
    //   if (file.id) {
    //     // // Grava no arquivo
    //     // const fileTranslations: Translation[] = translations[file.id]
    //     // const editedLabelIndex: number = fileTranslations ? _.findIndex(fileTranslations, (item) => item.key === editedLabelId) : -1
    //     // let newTranslation: Translation

    //     // // if already exist the key in the file just change the value else create a translate object
    //     // if (editedLabelIndex >= 0) {
    //     //   fileTranslations[editedLabelIndex].value = this.edit.text
    //     // }
    //     // else {
    //     //   newTranslation = {
    //     //     fileID: file.id,
    //     //     group: this.edit.data[Object.keys(this.edit.data)[0]][0].group,
    //     //     key: this.edit.data[Object.keys(this.edit.data)[0]][0].key,
    //     //     value: this.edit.text,
    //     //     language: this.edit.langTarget
    //     //   }

    //     //   fileTranslations.push(newTranslation)
    //     //   this.translations.push(newTranslation)
    //     // }

    //     // // formata as labels no formato necessário para salvar o arquivo
    //     // promises.push(this.formatJSONToFile(file.path.split('.').pop(), fileTranslations)
    //     //   .then((newFileString) => {
    //     //     // grava os dados no arquivo
    //     //     return this.writeFile(file.path, newFileString)
    //     //   })
    //     //   .catch((err) => {
    //     //     return console.log(err)
    //     //   }))
    //   }
    //   else {
    //     // // Grava no banco
    //     // const newTranslation = {
    //     //   fileID: undefined as string,
    //     //   group: this.edit.data[Object.keys(this.edit.data)[0]][0].group,
    //     //   key: this.edit.data[Object.keys(this.edit.data)[0]][0].key,
    //     //   value: this.edit.text,
    //     //   language: this.edit.langTarget
    //     // }

    //     // const lang = this.$gun.get(`language/${newTranslation.language}`)
    //     // const group = this.$gun.get(`group/${newTranslation.group}`)

    //     // const translationDB = this.$gun.get(`translation/${newTranslation.key}-${newTranslation.language}`)

    //     // translationDB.path('key').put(newTranslation.key)
    //     // translationDB.path('value').put(newTranslation.value)
    //     // translationDB.path('language').put(lang)
    //     // translationDB.path('group').put(group)

    //     // this.$gun.get(`translations`).set(translationDB)

    //     // const edition = _.findIndex(this.translations, (item) => item.key === newTranslation.key && item.language === newTranslation.language && !item.fileID)

    //     // if (edition >= 0) {
    //     //   this.translations[edition].value = newTranslation.value
    //     //   const aux = this.translations
    //     //   this.translations = []
    //     //   this.translations = aux
    //     // }
    //     // else {
    //     //   this.translations.push(newTranslation)
    //     // }
    //   }
    // }

    // Promise.all(promises)
    // .then(() => {
    //   this.$refs.editTranslation.hide()
    //   // Clean the selected file list
    //   for (const file of this.selectedFiles) {
    //     file.selected = false
    //   }
    //   this.selectedFiles = Object.assign({}, this.selectedFiles)
    //   return Loading.hide()
    // })
    // .catch(() => {
    //   this.$refs.editTranslation.hide()
    //   return Loading.hide()
    // })
  }

   /*
    * Get label that was not tranlated to all the languages.
    *
    * @return {void}
    */
  filterIncomplete() {
    this.filteredTranslations = Object.assign({}, this.getIncompleteTranlations())
  }

   /*
   * Get label that was not tranlated to all the languages.
   *
   * @return {array} List of incompleted labels.
   */
  getIncompleteTranlations(): GroupedTranslation[] {
    const filteredTranslations: GroupedTranslation[] = []

    for (const translation of this.groupedTranslations) {
      for (const lang of this.languages) {
        if (!translation.lang[lang.value]) {
          filteredTranslations.push(translation)
          break
        }
      }
    }

    return filteredTranslations
  }

   /*
    * Clear all filters.
    *
    * @return {void}
    */
  filterAll(): void {
    this.filteredTranslations = this.groupedTranslations
  }

   /*
    * Translate all incompletes labels.
    *
    * @return {void}
    */
  translateIncompletes() {
    // Loading.show()
    // // Busca as traduções para os arquivos incompletos
    // this.getLabelTranslated(this.getIncompleteTranlations())
    // .then((translated) => {
    //   const groupedTranslated = _.groupBy(translated, 'fileID') // agrupa as traduções por arquivo

    //   // salva cada arquivo que teve uma label traduzida
    //   _.each(groupedTranslated, (value, key) => {
    //     // união entre as labels já existente no arquivo com as novas labels traduzidas
    //     const grpTrans = _.groupBy(this.translations, 'fileID')[key]
    //     const fileLabels = grpTrans ? _.concat(grpTrans, value) : value

    //     // busca as informações do arquivo que será alterado
    //     const file = _.find(this.selectedFiles, (item) => item.id === key)

    //     if (file) {
    //       // formata as labels no formato necessário para salvar o arquivo
    //       return this.formatJSONToFile(file.path.split('.').pop(), fileLabels)
    //         .then((newFileString) => {
    //           // grava os dados no arquivo
    //           return this.writeFile(file.path, newFileString)
    //             .then(() => {
    //               // Atualiza a lista de traduções
    //               _.each(value, (item) => {
    //                 this.translations.push(item)
    //               })
    //               return true
    //             })
    //             .catch(() => {
    //               return console.log('err')
    //             })
    //         })
    //         .catch(() => {
    //           return console.log('err')
    //         })
    //     }
    //     else {
    //       _.each(value, (item) => {
    //         // Grava no banco
    //         const lang = this.$gun.get(`language/${item.language}`)
    //         const group = this.$gun.get(`group/${item.group}`)

    //         const translationDB = this.$gun.get(`translation/${item.key}-${item.language}`)

    //         translationDB.path('key').put(item.key)
    //         translationDB.path('value').put(item.value)
    //         translationDB.path('language').put(lang)
    //         translationDB.path('group').put(group)

    //         this.$gun.get(`translations`).set(translationDB)

    //         this.translations.push({
    //           group: item.group,
    //           key: item.key,
    //           value: item.value,
    //           language: item.language,
    //           fileID: null
    //         })
    //       })
    //     }
    //   })
    //   return true
    // })
    // .then(() => {
    //   return Loading.hide()
    // })
    // .catch(() => {
    //   Loading.hide()
    //   return console.log('error')
    // })
  }

   /*
    * Write the file with all labels.
    *
    * @param {string} filePath - File path
    * @param {string} newFileString - The labels to write the file
    * @return {Promise}
    */
  writeFile(filePath: string, newFileString: string) {
    // eslint-disable-next-line no-undef
    return pify(getFS().writeFile)(filePath, newFileString)
  }

   /*
    * Translate a list of labels.
    *
    * @param {array} toTranslate - List of labels (incompletes) to translate
    * @return {array} List of transleted labels
    */
  // getLabelTranslated(toTranslate: GroupedTranslation[]): Promise<Translation[]> {
  //   const promises: Array<Promise<Translation>> = []

  //   // For each item to be translated
  //   _.each(toTranslate, (item) => {
  //     // Translate for each language
  //     _.each(this.selectedLanguages, (lang) => {
  //       // Check if some language was not transleted yet
  //       if (!item.lang[lang]) {
  //         // Watson can translate any language to english and english to any language, so if the target is not english and the source is not english then translate to english first
  //         const text = item.lang['en-US'] ? item.lang['en-US'][0].value : item.lang[Object.keys(item.lang)[0]][0].value
  //         const langSource = item.lang['en-US'] ? 'en-US' : item.lang[Object.keys(item.lang)[0]][0].language
  //         const langTarget = item.lang['en-US'] ? lang : 'en-US'

  //         // Add all tradutions to a list o promises
  //         promises.push(this.translateValue(text, langSource, langTarget, lang)
  //           .then((translation) => {
  //             return {
  //               fileID: _.find(this.selectedFiles, (item2) => item2.language === lang).id,
  //               group: item.lang[Object.keys(item.lang)[0]][0].group,
  //               key: item.key,
  //               value: translation,
  //               language: lang
  //             }
  //           }))
  //       }
  //     })
  //   })

  //   // Resolve all promises and return their results as a array
  //   return Promise.all(promises)
  // }

   /*
    * Transform the labels array to the format of the file.
    *
    * @param {string} typeOfFile - the type of the file.
    * @param {object} jsonObject - the labels to save the file.
    * @return {string} File labels
    */
  formatJSONToFile(typeOfFile: string, jsonObject: GroupedTranslation[], language: string) {
    if (typeOfFile === 'resx') {
      return this.translationsToRESX(jsonObject, language)
    }
    else if (typeOfFile === 'json') {
      return this.translationsToJSON(jsonObject, language)
    }
  }

   /*
    * Transform the labels array to the format of resx file.
    *
    * @param {object} jsonObject - the labels to save the file.
    * @return {string} File labels
    */
  translationsToRESX(jsonObject: GroupedTranslation[], language: string): Promise<string> {
    const jsonFile: any = {}

    // order the labels
    jsonObject.sort(compareGroupKey)

    for (const item of jsonObject) {
      if (!item.lang[language]) { continue }
      jsonFile[item.group + '_' + item.key] = item.lang[language].value
    }

    return pify(js2resx)(jsonFile)
  }

   /*
    * Transform the labels array to the format of json file.
    *
    * @param {object} jsonObject - the labels to save the file.
    * @return {string} File labels
    */
  translationsToJSON(jsonObject: GroupedTranslation[], language: string): Promise<string> {
    const jsonFile: any = {}

    // order the labels
    jsonObject.sort(compareGroupKey)

    for (const item of jsonObject) {
      if (!jsonFile[item.group]) { jsonFile[item.group] = {} } // create a new group if it wasn't created yet
      jsonFile[item.group][item.key] = item.lang[language].value
    }

    // return json object idented with 4 spaces
    return Promise.resolve(JSON.stringify(jsonFile, null, '  '))
  }

   /*
    * Translate a value.
    *
    * @param {string} text - text to tranlate.
    * @param {string} langSource - the source language.
    * @param {string} langTarget - the target language.
    * @param {string} finalLang - the final language.
    * @return {string} Translated text
    */
  translateValue(text: string, langSource: string, langTarget: string, finalLang: string): Promise<string> {
    return this.translateNew(text, langSource, langTarget).then((response1) => {
      const translation = response1.data.translations[0].translation

      // If the target language isn't the en-US and the final language isn't 'en-US' so need to tranlate to the final language
      if (langSource !== 'en-US' && finalLang !== 'en-US' && langSource !== 'en' && finalLang !== 'en') {
        return this.translateNew(translation, 'en-US', finalLang).then((response2) => {
          return response2.data.translations[0].translation
        })
      }
      else {
        return translation
      }
    })
  }

   /*
    * Call the API to translate some text.
    *
    * @param {string} text - text to tranlate.
    * @param {string} langSource - the source language.
    * @param {string} langTarget - the target language.
    * @return {Promise}
    */
  translateNew(text: string, langSource: string, langTarget: string) {
    return axios({method: 'get', url: `http://localhost:3100/translate`, params: {texto: text, source: langSource, target: langTarget}})
  }

   /*
    * Search all languages by a term
    *
    * @param {string} value - The term searched.
    */
  labelContainsText(item: GroupedTranslation, value: string) {
    if (item.key.includes(value)) { return true }
    for (const language in item.lang) {
      if (item.lang[language].value.includes(value)) { return true }
    }
    return false
  }

  insertNewLabel(novo: {fileID: string, group: string, key: string, value: string, language: string}, override = false) {
    Promise.resolve().then(async () => {
      const existing = await db.labels.get(novo.key).catch(() => null)
      if (!existing) {
        const label: DbLabel = {
          _id: novo.key,
          group: novo.group,
          description: '',
          translations: [ {language: novo.language, value: novo.value, approved: false}],
          products: [],
          events: []
        }
        return db.labels.put(label)
      }
      else {
        for (const lang of this.languages) {
          if (!novo[lang.value]) { continue }
          let alreadyDefined = false
          for (const trad of existing.translations) {
            if (trad.language === lang.value) {
              alreadyDefined = true
              if (override) {
                trad.value = novo[lang.value]
              }
              break
            }
          }
          if (alreadyDefined) { continue }
          existing.translations.push({
            language: lang.value,
            value: novo[lang.value],
            approved: false
          })
        }
        if (this.nuncaTeve) console.dir(existing)
        this.nuncaTeve = false
        return db.labels.put(existing)
      }
    })
    .catch((err) => console.log(err))
  }

  addNewLabel() {
    if (!this.newLabel.key) return
    if (!this.newLabel.group) return
    Promise.resolve().then(async () => {
      const existing = await db.labels.get(this.newLabel.key).catch(() => null)
      if (!existing) {
        const label: DbLabel = {
          _id: this.newLabel.key,
          group: this.newLabel.group,
          description: '',
          translations: [],
          products: [],
          events: []
        }
        for (const lang of this.languages) {
          if (this.newLabel[lang.value]) {
            label.translations.push({
              language: lang.value,
              value: this.newLabel[lang.value],
              approved: false
            })
          }
        }
        return db.labels.put(label)
      }
      else {
        for (const lang of this.languages) {
          if (!this.newLabel[lang.value]) { continue }
          let alreadyDefined = false
          for (const trad of existing.translations) {
            if (trad.language === lang.value) {
              alreadyDefined = true
              break
            }
          }
          if (alreadyDefined) { continue }
          existing.translations.push({
            language: lang.value,
            value: this.newLabel[lang.value],
            approved: false
          })
        }
        return db.labels.put(existing)
      }
    })
    .then(() => {
      this.newLabel.group = ''
      this.newLabel.key = ''
      this.newLabel.lang = {}
      this.$refs.newTranslation.hide()
    })
    .catch((err) => console.log(err))
  }

  onNewLabelFileClick(file: FileInfo) {
    // if (file.selected) {
    //   if (!_.find(this.newLabel.labels, (item) => item.language === file.language)) {
    //     this.newLabel.labels.push({
    //       model: '',
    //       language: file.language
    //     })
    //   }
    // }
    // else {
    //   if (!_.find(this.selectedFiles, (item) => item.language === file.language && item.selected)) {
    //     _.remove(this.newLabel.labels, (item) => item.language === file.language)
    //     this.newLabel = Object.assign({}, this.newLabel)
    //   }
    // }
  }

  formatGroup(group: string, fileType: string) {
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

  UnFormatGroup(group: string, fileType: string) {
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

  // addToDataBase(translation: Translation[]) {
  //   const lang = this.$gun.get(`language/${translation[0].language}`)
  //   const group = this.$gun.get(`group/${translation[0].group}`)

  //   const translationDB = this.$gun.get(`translation/${translation[0].key}-${translation[0].language}`)

  //   translationDB.path('key').put(translation[0].key)
  //   translationDB.path('value').put(translation[0].value)
  //   translationDB.path('language').put(lang)
  //   translationDB.path('group').put(group)

  //   this.$gun.get(`translations`).set(translationDB)
  //   this.translations.push({
  //     group: translation[0].group,
  //     key: translation[0].key,
  //     value: translation[0].value,
  //     language: translation[0].language,
  //     fileID: null
  //   })
  // }

  // alreadyInDataBase(translationDB: Translation[]) {
  //   for (const item of translationDB) {
  //     if (!item.fileID) return true
  //   }
  //   return false
  // }

   /*
    * Generate a new GUID.
    *
    * @return {string} the GUID.
    */
  guid(): string {
    function s4(): string {
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
