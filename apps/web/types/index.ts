export interface Role {
    id: string
    name: string
    description?: string
    is_active: boolean
    created_at: string
}

export interface Permission {
    id: string
    entity: string
    operation: string
    description?: string
    created_at: string
}

export interface UserRole {
    user_id: string
    role_id: string
    roles: Role
}
