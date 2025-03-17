export interface UserExchangeUuidImpl {
    web_uuid: string;
    group_uuid: string;
    code: string | null;
    is_code: boolean;
    expiration: number | null;
}