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
    cover_image_800: string | null;
    cover_image_1200: string | null;
    bg_image: string | null;

    author_cn?: string | null | undefined;
}
export interface BlogBriefImpl {
    name: string;
    label: string | null;
    author: string;
    cover_image: string | null;
    cover_image_800: string | null;
    cover_image_1200: string | null;
    last_date: number;
    classify_id: string | null;
    blog_id: string;

    author_cn?: string | null | undefined;
}
export interface BlogCommentAndReplyImpl {
    comment: BlogCommentImpl
    replies: Array<BlogCommentReplyImpl>
}
export interface BlogCommentImpl {
    comment_id: string;
    blog_id: string;
    author: string;
    content: string;
    upload_time: number;
    author_cn?: string;
    avatar?: string | null;
}
export interface BlogCommentReplyImpl {
    reply_id: string;
    comment_id: string;
    author: string;
    content: string;
    upload_time: number;
    author_cn?: string;
    avatar?: string | null;
}
