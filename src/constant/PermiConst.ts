export const PermiConst = () => {
    return {
        USER: 1,
        CREATOR: 1 << 1,
        DEVELOPER: 1 << 2,
        MANAGER: 1 << 3,
        ADMIN: 1 << 4,
    }
}
