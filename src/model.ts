import { CreationOptional } from "sequelize"

export type PostResponse = {
    messages: Array<Message>
}

export type Message = {
    id: number
    body: string
    created_at: string
    likes: Likes,
    symbols?: Array<Symbol>
}

export type Symbol = {
    symbol: string
}

export type Likes = {
    total: number
}

export interface Record {
    id?: CreationOptional<number>,
    postId: number,
    message: string,
    ticker: string,
    category: string,
    price: number,
    date: Date,
    isClosed: boolean,
    quality?: TypeQuality,
    bestPrice?: number,
    bestPricePercent?: number,
    bestDate?: Date
}

export interface Play {
    ticker: string
    date: Date
    price: number
}

export interface PlayEvaluation {
    quality: TypeQuality,
    date: Date
    price: number
    percentChange?: number
    row: Array<string>
}

export enum TypeQuality {
    F,
    A,
    AA,
    AAA,
    AAAA,
    AAAAA,
    AAAAAA,
}