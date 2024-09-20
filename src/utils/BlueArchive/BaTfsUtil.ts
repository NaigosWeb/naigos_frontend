import {useTransfromBgvStatus} from "@/stores/BlueArchive/TransfromBgvStatus";

export const tfsChange = () => {
    const transfromStatus = useTransfromBgvStatus();
    transfromStatus.statusObj.changeTransfromStatus();
    setTimeout(() => {
        transfromStatus.statusObj.changeTransfromStatus();
    }, 2000);
}
