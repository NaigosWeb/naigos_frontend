import {defineStore} from "pinia";

export const useBABgvStore = defineStore('BABgvStore', {
    state: () => ({
        isHomeBgvShow: true,
    }),
    actions: {
        changeHomeBgvShow(target: boolean) {
            if (target !== this.isHomeBgvShow) this.isHomeBgvShow = target;
        }
    }
})