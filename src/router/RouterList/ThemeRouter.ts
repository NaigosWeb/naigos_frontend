import ThemeView from "@/views/ThemeView.vue";
import ThemeClassifyComp from "@/components/Theme/ThemeClassifyComp.vue";
import TEligibleComp from "@/components/Theme/ThemeEligibleBox/TEligibleComp.vue";
import ThemeUDUComp from "@/components/Theme/ThemeUDU/ThemeUDUComp.vue";
import TEligibleItemsComp from "@/components/Theme/ThemeEligibleBox/TEligibleItemsComp.vue";
import TEligibleOnlyComp from "@/components/Theme/ThemeEligibleBox/TEligibleOnlyComp.vue";
import TUDUUploadComp from "@/components/Theme/ThemeUDU/TUDUUploadComp.vue";

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
            path: 'udu',
            name: 'ThemeUDU',
            component: ThemeUDUComp,
            redirect: '/theme/udu/upload',
            children: [
                {
                    path: 'upload',
                    name: 'ThemeUDUUpload',
                    component: TUDUUploadComp
                }
            ]
        }
    ]
}