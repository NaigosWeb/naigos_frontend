export interface BlogImpl {
    name: string;
    label: string | null;
    content: string | null;
    author: string;
    upload_date: number;
    last_date: number;
    attachment: string | null;
    classify_id: string | null;
    blog_id: string;
    cover_image: string | null;
    bg_image: string | null;

    author_cn?: string | null | undefined;
}
export interface BlogBriefImpl {
    name: string;
    label: string | null;
    author: string;
    cover_image: string | null;
    last_date: number;
    classify_id: string | null;
    blog_id: string;

    author_cn?: string | null | undefined;
}
