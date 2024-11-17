export interface Profile {
    id: string;
    username: string;
    full_name: string;
    avatar_url: string;
    images_generated: number;
    paid: boolean;
    subscription_id: string;
}

export interface Design {
    id: number;
    creator: string;
    name: string;
    created_at: string;
    image: string;
    text_style: JSON[];
}