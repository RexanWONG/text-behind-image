import { z } from 'zod'

export interface Profile {
    id: string;
    username: string
    full_name: string;
    avatar_url: string;
}