import ThemeView from "@/views/ThemeView.vue";
import ThemeClassifyComp from "@/components/Theme/ThemeClassifyComp.vue";
import TEligibleClassComp from "@/components/Theme/ThemeEligibleBox/TEligibleClassComp.vue";
import ThemeUploadComp from "@/components/Theme/ThemeUploadComp.vue";

export default {
    path: '/theme',
    component: ThemeView,
    children: [
        {
            path: '',
            name: 'Theme',
            component: ThemeClassifyComp
        },
        {
            path: ':classify_id',
            name: 'ThemeEligibleClassify',
            props: true,
            component: TEligibleClassComp,
            children: []
        },
        {
            path: 'upload',
            name: 'ThemeUpload',
            component: ThemeUploadComp
        }
    ]
}