import { UserRole } from '@/types'

const API_URL = '/api/users'

export async function getUsers(): Promise<UserRole[]> {
    const res = await fetch(API_URL)
    if (!res.ok) throw new Error('Failed to fetch users')
    return res.json()
}

export async function assignRole(userId: string, roleId: string) {
    const res = await fetch(`/api/users/${userId}/role`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roleId }),
    })
    if (!res.ok) throw new Error('Failed to assign role')
    return res.json()
}

export async function createUser(data: { email: string; password: string }) {
    const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })
    if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to create user')
    }
    return res.json()
}
