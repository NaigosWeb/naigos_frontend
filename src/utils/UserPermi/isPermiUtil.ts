let permission: number = 0;

export const setPermission = (target: number): void => {permission = target;}
export const hasPermission = (target: number): boolean => (permission & target) != 0;