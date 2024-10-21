export interface UserArchiveImpl{
    id: number;
    qq_id: number | null;
    nickname: string;
    group_real_user_id: string | null;
    register_real_group_id: string | null;
    city: string;
    score: number;
    avatar: string | null;
    favorite: number;
    email: string | null;
    safe_level: number;
}