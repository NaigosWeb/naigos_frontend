import WebManageView from "@/views/WebManageView.vue";
import WManageNoticeComp from "@/components/WebManage/WManageNoticeComp.vue";
import WManageUserComp from "@/components/WebManage/WManageUserComp.vue";

export default {
    path: '/web_manage',
    component: WebManageView,
    redirect: '/web_manage/notice',
    children: [
        {
            path: 'notice',
            name: 'WebManageNotice',
            component: WManageNoticeComp
        },
        {
            path: 'user',
            name: 'WebManageUser',
            component: WManageUserComp
        }
    ]
}