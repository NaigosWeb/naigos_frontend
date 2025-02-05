import BlogView from "@/views/BlogView.vue";
import BlogContainerComp from "@/components/Blog/BlogContainerComp.vue";
import BlogContentComp from "@/components/Blog/BlogContent/BlogContentComp.vue";

export default {
    path: '/blog',
    component: BlogView,
    children: [
        {
            path: '',
            name: 'Blog',
            component: BlogContainerComp,
        },
        {
            path: ':blog_id',
            name: 'BlogContent',
            props: true,
            component: BlogContentComp
        }
    ]
}