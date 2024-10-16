import {defineStore} from "pinia";

export const useBAStStore = defineStore('BAStStore', {
    state: () => ({
        isBAStShow: false,
    }),
    actions: {
        changeBAStShow(target: boolean) {
            if (target !== this.isBAStShow) this.isBAStShow = target;
        }
    }
})