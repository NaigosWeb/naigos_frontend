import MikaCakeView from "@/views/MikaCakeView.vue";
import MCHomeComp from "@/components/MikaCake/MCHomeComp.vue";

export default {
    path: '/mika_cake',
    component: MikaCakeView,
    children: [
        {
            path: '',
            name: 'MikaCake',
            component: MCHomeComp
        }
    ]
}