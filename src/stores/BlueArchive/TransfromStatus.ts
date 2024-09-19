import {defineStore} from "pinia";

export const useTransfromStatus = defineStore('ba_tfs', {
    state: () => ({
        isTransfromStatus: false,
        isMainBgvStatus: false
    }),
    actions: {
        changeTransfromStatus() {
            this.isTransfromStatus = !this.isTransfromStatus;
        },
        changeMainBgvStatus() {
            this.isMainBgvStatus = !this.isMainBgvStatus;
        }
    }
})