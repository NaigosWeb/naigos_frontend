import {weekToChinese} from "@/utils/NumberToChinese";

export const todayDate = (): string => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}年${month}月${day}日`;
}
export const todayWeek = (): string => {
    const date = new Date();
    const week = date.getDay();
    console.log(week);
    return weekToChinese[week.toString()];
}