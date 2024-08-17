import { defineStore } from 'pinia'
import {http} from "@/utils/http";

export const usePersonStore = defineStore('person', {
    state: () => ({
        data: null, // 假设这是从后端获取的数据
    }),
    actions: {
        fetchPersonCenter(token: string) {
            return http({
                url: 'users/archive/current',
                method: 'GET',
                headers: {
                    'Authorization': token
                }
            }).then(res => {
                if (res.data.code === 0) {
                    this.data = res.data.data;
                    return res.data; // 如果你需要在组件中使用这个数据
                } else {
                    alert(res.data.msg);
                    throw new Error(res.data.msg); // 或者返回一个 rejected Promise
                }
            }).catch(err => {
                console.error(err);
                throw err; // 确保错误被传播
            });
        }
    },
});

