import { Permission } from '@/types'

const API_URL = '/api/permissions'

export async function getPermissions(): Promise<Permission[]> {
    const res = await fetch(API_URL)
    if (!res.ok) throw new Error('Failed to fetch permissions')
    return res.json()
}

export async function createPermission(data: { entity: string; operation: string; description?: string }): Promise<Permission> {
    const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to create permission')
    return res.json()
}
