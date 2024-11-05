import ApplyView from "@/views/Apply/ApplyView.vue";
import ApplyBandIComp from "@/components/Apply/ApplyBandIComp.vue";
import ApFrontendComp from "@/components/Apply/Frontend/ApFrontendComp.vue";
import ApJoinDevComp from "@/components/Apply/JoinDev/ApJoinDevComp.vue";

export default {
    path: '/apply',
    component: ApplyView,
    children: [
        {
            path: '',
            name: 'NaigosApply',
            component: ApplyBandIComp
        },
        {
            path: 'join_dev',
            name: 'ApplyJoinDev',
            component: ApJoinDevComp
        },
        {
            path: 'frontend',
            name: 'ApplyFrontend',
            component: ApFrontendComp
        }
    ]
}