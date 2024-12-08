export interface ThemeImpl {
    name: string;
    url: string | null;
    introduce: string | null;
    header_image: string | null;
    detail_html: string | null;
    cost: number;
    eject_image: string | null;
    theme_id: string;
    classify_id: string | null;
    author: string | null;
}
export interface ThemeBriefImpl {
    name: string;
    header_image: string | null;
    theme_id: string;
    classify_id: string | null;
    author: string | null;
}
export interface ThemeClassifyImpl {
    classify_id: string;
    cover_image: string | null;
    banner_image: string | null;
    bg_image: string | null;
    zhsg_name: string;
    en_name: string | null;
    router_name: string;
    classify_value: string;
}
export interface ThemeClassifyBriefImpl {
    classify_id: string;
    cover_image: string | null;
    zhsg_name: string;
    router_name: string;
    classify_value: string;
}
export interface ThemeSubcategoryImpl {
    subcategory: string;
    category_value: string;
    cover_image: string | null;
    zhsg_name: string;
}