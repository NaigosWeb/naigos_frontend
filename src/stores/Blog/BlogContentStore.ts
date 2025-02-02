import {defineStore} from "pinia";

export const useBlogContentStore = defineStore('BlogContentStore', {
    state: () => ({
        isContentViewShow: false,
        blogId: ''
    }),
    actions: {
        changeBlogContentViewShow() {
            this.isContentViewShow = !this.isContentViewShow;
        },
        infoBlogId(blogId: string) {
            this.blogId = blogId;
        }
    }
})