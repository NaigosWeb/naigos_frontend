import ThemeView from "@/views/ThemeView.vue";
import ThemeClassifyComp from "@/components/Theme/ThemeClassifyComp.vue";
import TEligibleComp from "@/components/Theme/ThemeEligibleBox/TEligibleComp.vue";
import ThemeUploadComp from "@/components/Theme/ThemeUploadComp.vue";
import TEligibleItemsComp from "@/components/Theme/ThemeEligibleBox/TEligibleItemsComp.vue";
import TEligibleOnlyComp from "@/components/Theme/ThemeEligibleBox/TEligibleOnlyComp.vue";

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
            props: true,
            component: TEligibleComp,
            children: [
                {
                    path: '',
                    name: 'ThemeEligible',
                    component: TEligibleItemsComp
                },
                {
                    path: ':theme_id',
                    props: true,
                    name: 'ThemeEligibleOnly',
                    component: TEligibleOnlyComp
                }
            ]
        },
        {
            path: 'upload',
            name: 'ThemeUpload',
            component: ThemeUploadComp
        }
    ]
}