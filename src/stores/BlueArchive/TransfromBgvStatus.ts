import {defineStore} from "pinia";

export const useTransfromBgvStatus = defineStore('ba_tfs', {
    state: () => ({
        isTransfromStatus: false,
        isMainBgvStatus: true
    }),
    actions: {
        changeTransfromStatus() {
            this.isTransfromStatus = !this.isTransfromStatus;
        },
        changeMainBgvStatus(target: boolean) {
            this.isMainBgvStatus = target;
        }
    }
})