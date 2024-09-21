import APMainPage from "@/views/ApplyDeveloper/APMainPage.vue";
import APDetails from "@/components/ApplyDeveloper/APDetails.vue";

export default {
    path: '/apply_developer',
    name: 'applyDeveloper',
    component: APMainPage,
    redirect: '/apply_developer/details',
    children: [
        {
            path: 'details',
            name: 'applyDeveloperDetails',
            component: APDetails
        },
        {
            path: 'contract',
            name: 'applyDeveloperContract',
            component: APDetails
        },
        {
            path: 'form',
            name: 'applyDeveloperForm',
            component: APDetails
        }
    ]
}