import {useTransfromBgvStatus} from "@/stores/BlueArchive/TransfromBgvStatus";

export const bgvChange = (target: boolean) => {
    const transfromStatus = useTransfromBgvStatus();
    if (target !== transfromStatus.statusObj.isMainBgvStatus) {
        transfromStatus.changeMainBgvStatus(target);
    }
}