import ApplyView from "@/views/Apply/ApplyView.vue";
import ApplyBandIComp from "@/components/Apply/ApplyBandIComp.vue";

export default {
    path: '/apply',
    component: ApplyView,
    children: [
        {
            path: '',
            name: 'Apply',
            component: ApplyBandIComp
        }
    ]
}