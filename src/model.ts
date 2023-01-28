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
    category: string,
    ticker: string,
    message: string,
    date: Date
}

export interface MarketDataRequest {
    ticker: string

}