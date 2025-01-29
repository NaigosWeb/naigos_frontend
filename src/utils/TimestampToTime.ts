export const timestampToTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    return `${
        date.getFullYear()}-${
        String(date.getMonth() + 1).padStart(2, '0')}-${
        String(date.getDate()).padStart(2, '0')} ${
        String(date.getHours()).padStart(2, '0')}:${
        String(date.getMinutes()).padStart(2, '0')}:${
        String(date.getSeconds()).padStart(2, '0')}`;
}
export const timestampToTimeByDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return `${
        date.getFullYear()}-${
        String(date.getMonth() + 1).padStart(2, '0')}-${
        String(date.getDate()).padStart(2, '0')}`;
}
export const timestampToTimeByTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    return `${
        String(date.getHours()).padStart(2, '0')}:${
        String(date.getMinutes()).padStart(2, '0')}:${
        String(date.getSeconds()).padStart(2, '0')}`;
}
export const timestampToTimeByTimeNoSecond = (timestamp: number): string => {
    const date = new Date(timestamp);
    return `${
        String(date.getHours()).padStart(2, '0')}:${
        String(date.getMinutes()).padStart(2, '0')}`;
}