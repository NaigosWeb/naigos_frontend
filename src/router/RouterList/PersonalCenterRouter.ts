import PersonalCenterView from "@/views/PersonalCenterView.vue";
import PerCRightComp from "@/components/PersonalCenter/PerCRightComp.vue";
import PerCEditArchiveComp from "@/components/PersonalCenter/PerCEditArchiveComp.vue";

export default {
    path: '/personal_center',
    component: PersonalCenterView,
    children: [
        {
            path: '',
            name: 'PersonalCenter',
            component: PerCRightComp
        },
        {
            path: 'edit',
            name: 'PersonalCenterEditArchive',
            component: PerCEditArchiveComp
        }
    ]
}