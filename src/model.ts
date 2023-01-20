export type PostResponse = {
    messages: Array<Message>
}

export type Message = {
    id: number
    body: string
    created_at: string
    likes: Likes
}

export type Likes = {
    total: number
}

export type Record = {
    id: number,
    postId: number,
    category: string,
    ticker: string,
    date: Date
}