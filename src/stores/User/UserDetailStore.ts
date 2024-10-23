import {defineStore} from "pinia";
import {httpSpring} from "@/utils/http";

export const useUserDetailStore = defineStore('UserDetailStore', {
    state: () => ({
        userDetails: {
            id: 0,
            qq_id: 0,
            nickname: '',
            group_real_user_id: '',
            register_real_group_id: '',
            city: '',
            score: 0,
            avatar: '',
            favorite: 0,
            email: '',
            safe_level: 0
        },
        userAvatar: '',
        userScore: {
            score: 0,
            favorite: 0,
        }
    }),
    actions: {
        fetchUserArchive(){
            if (window.localStorage.getItem('token')){
                httpSpring({
                    url: 'users/archive/current',
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        Authorization: window.localStorage.getItem('token'),
                    }
                }).then(res => {
                    if (res.status === 200 && res?.data?.code === 0) {
                        this.userDetails = res?.data?.data;
                    } else window.localStorage.removeItem('token');
                }).catch((err) => {
                    console.error(err);
                    window.localStorage.removeItem('token');
                })
            }
        },
        fetchUserAvatar(){
            if (window.localStorage.getItem('token')){
                httpSpring({
                    url: 'users/archive/me_avatar',
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        Authorization: window.localStorage.getItem('token'),
                    }
                }).then(res => {
                    if (res.status === 200 && res?.data?.code === 0) {
                        this.userAvatar = res.data?.data;
                        console.log('piniaAvatar', this.userAvatar);
                    } else window.localStorage.removeItem('token');
                }).catch((err) => {
                    console.error(err);
                    window.localStorage.removeItem('token');
                })
            }
        },
        fetchUserScore(){
            if (window.localStorage.getItem('token')){
                httpSpring({
                    url: 'users/archive/me_score',
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        Authorization: window.localStorage.getItem('token'),
                    }
                }).then(res => {
                    if (res?.data?.code === 0) {
                        this.userScore = res.data?.data;
                    }
                }).catch((err) => {
                    console.error(err);
                })
            }
        }
    }
})