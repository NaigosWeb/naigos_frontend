import BaDefaultComp from "@/components/BlueArchive/BaContainers/BaDefaultComp.vue";
import BaRecordComp from "@/components/BlueArchive/BaContainers/BaRecordComp.vue";
import BaT2Comp from "@/components/BlueArchive/BaContainers/BaT2Comp.vue";
import BaReCreationComp from "@/components/BlueArchive/BaContainers/ReCreation/BaReCreationComp.vue";

export default {
    path: '/blue_archive',
    name: 'ba',
    component: () => import('@/views/BlueArchive.vue'),
    children: [
        {
            path: '',
            name: 'blueArchive',
            component: BaDefaultComp
        },
        {
          path: 're-creation',
          name: 'baReCreation',
          component: BaReCreationComp
        },
        {
            path: 'record',
            name: 'baRecord',
            component: BaRecordComp
        },
        {
            path: 't2',
            name: 't2',
            component: BaT2Comp
        }
    ]
}