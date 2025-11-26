import { Role } from '@/types'

const API_URL = '/api/roles'

export async function getRoles(): Promise<Role[]> {
    const res = await fetch(API_URL)
    if (!res.ok) throw new Error('Failed to fetch roles')
    return res.json()
}

export async function createRole(data: { name: string; description?: string }): Promise<Role> {
    const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to create role')
    return res.json()
}

export async function updateRole(id: string, data: Partial<Role>): Promise<Role> {
    const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to update role')
    return res.json()
}

export async function deleteRole(id: string): Promise<void> {
    const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
    })
    if (!res.ok) throw new Error('Failed to delete role')
}
