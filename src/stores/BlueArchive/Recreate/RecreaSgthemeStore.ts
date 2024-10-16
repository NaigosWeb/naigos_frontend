import {defineStore} from "pinia";

export const useBARecreateSgthemeStore = defineStore('BARecreateSgthemeStore', {
    state: () => ({
        isDetailShow: false,
        detailName: '',
        themeId: '',
    }),
    actions: {
        changeDetailsShow(targetIsShow: boolean, targetDetailName: string, targetThemeId: string) {
            if (targetIsShow !== this.isDetailShow) this.isDetailShow = targetIsShow;
            this.detailName = targetDetailName;
            this.themeId = targetThemeId;
        }
    }
})