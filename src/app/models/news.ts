export interface News {
    id: number
    title: string
    content: string
    summary: string
    imageUrl: string
    date: Date
    status: string
    authorId: number
}

export interface CreateNews {    
    title: string
    content: string
    summary: string
    date: Date
}