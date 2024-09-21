import {useTransfromBgvStatus} from "@/stores/BlueArchive/TransfromBgvStatus";

export const tfsChange = () => {
    class TfsTimer{
        private timerId? : NodeJS.Timeout;
        startTimer() {
            this.stopTimer();
            const transfromStatus = useTransfromBgvStatus();
            transfromStatus.changeTransfromStatus();
            this.timerId = setTimeout(() => {
                transfromStatus.changeTransfromStatus();
            }, 1500);
        }
        stopTimer() {
            if (this.timerId){
                clearTimeout(this.timerId);
                this.timerId = undefined;
            }
        }
    }
    const tfsTimer: TfsTimer = new TfsTimer();
    tfsTimer.stopTimer();
    tfsTimer.startTimer();
}

export const bgvChange = (target: boolean) => {

    const transfromBgvStatus = useTransfromBgvStatus();
    if (transfromBgvStatus.isMainBgvStatus !== target) {
        setTimeout(() => {
            transfromBgvStatus.changeMainBgvStatus(target);
        }, 500)
    }
}
