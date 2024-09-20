import {defineStore} from "pinia";

export const useTransfromBgvStatus = defineStore('ba_tfs', {
    state: () => ({
        statusObj: {
            isTransfromStatus: false,
            isMainBgvStatus: true
        }
    }),
    actions: {
        changeTransfromStatus() {
            this.statusObj.isTransfromStatus = !this.statusObj.isTransfromStatus;
        },
        changeMainBgvStatus(target: boolean) {
            this.statusObj.isMainBgvStatus = target;
        }
    }
})