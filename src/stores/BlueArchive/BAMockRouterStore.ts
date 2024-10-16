import {defineStore} from "pinia";

export const useBAMockRouterStore = defineStore('BAMockRouterStore', {
    state: () => ({
        mockRouter: 'home',
    }),
    actions: {
        changeMockRouter(target: string) {
            this.mockRouter = target;
        }
    }
})