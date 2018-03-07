// 1. Tenha certeza de importar 'vue' antes de declarar tipos ampliados
import Vue from 'vue'

interface GunElement {
  get: (p: string) => GunElement
  path: (p: string) => GunElement
  put: (p: any) => GunElement
  set: (p: GunElement) => GunElement
  val: (p: (p: any) => void) => void
  map: () => GunElement

  valMapEnd: (p: (p: any) => void, r: () => void) => void
}

// 2. Especifique o arquivo com os tipos que quer ampliar
//    Vue tem um construtor de tipos em types/vue.d.ts
declare module 'vue/types/vue' {
  // 3. Declare a ampliação para Vue
  interface Vue {
    $gun: GunElement
  }
}
