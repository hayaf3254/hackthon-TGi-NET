export interface Circle {
    circle_id: number;
    circle_name: string;
    text: string;
    user_owner_id: number;
}

export interface CircleListResponse {
    total: number;
    offset: number;
    limit: number;
    data: Circle[];
}

export interface AllCircleResponse {
    total: number;
    data: Circle[];
}

export interface ErrorResponse {
    error: string;
    message: string;
}

export interface PaginationQuery {
    offset?: string;
    limit?: string;
}