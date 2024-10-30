export interface NaigosNoticeImpl {
    notice_id: string;
    title: string;
    content: string;
    author: string;
    attachment: string | null;
    image: string | null;
    upload_date: number;
    last_date: number;
}