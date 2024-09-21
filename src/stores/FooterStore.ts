import {defineStore} from "pinia";

export const useFooterStore = defineStore('useFooterStore', {
    state: () => ({
        footerStatus: true,
    }),
    actions: {
        changeFooterStatus(target: boolean) {
            if (this.footerStatus !== target){
                this.footerStatus = target;
            }
        }
    }
})