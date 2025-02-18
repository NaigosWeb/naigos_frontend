import PersonalCenterView from "@/views/PersonalCenterView.vue";
import PerCRightComp from "@/components/PersonalCenter/PerCRightComp.vue";
import PerCEditArchiveComp from "@/components/PersonalCenter/PerCEditArchiveComp.vue";
import PerCEditAvatarComp from "@/components/PersonalCenter/PerCEditAvatarComp.vue";
import PerCEditPasswordComp from "@/components/PersonalCenter/PerCEditPasswordComp.vue";

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
        },
        {
            path: 'avatar',
            name: 'PersonalCenterEditAvatar',
            component: PerCEditAvatarComp
        },
        {
            path: 'password',
            name: 'PersonalCenterEditPassword',
            component: PerCEditPasswordComp
        }
    ]
}