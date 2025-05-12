export interface News {
    id: number
    title: string
    content: string
    summary: string
    imageUrl: string
    date: Date
    authorId: number
}

export interface CreateNews {    
    title: string
    content: string
    summary: string
    date: Date
}