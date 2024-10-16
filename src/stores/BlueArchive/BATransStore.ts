import {defineStore} from "pinia";

export const useBATransStore = defineStore('BATransStore', {
    state: () => ({
        isBATransShow: false,
    }),
    actions: {
        changeBATransShow(target: boolean) {
            if (target !== this.isBATransShow) this.isBATransShow = target;
        }
    }
})