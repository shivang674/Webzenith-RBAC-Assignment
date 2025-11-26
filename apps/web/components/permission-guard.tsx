'use client'

import { usePermission } from '@/hooks/use-permission'

export default function PermissionGuard({
    entity,
    operation,
    children,
    fallback = null,
}: {
    entity: string
    operation: string
    children: React.ReactNode
    fallback?: React.ReactNode
}) {
    const { hasPermission, isLoading } = usePermission(entity, operation)

    if (isLoading) return null // Or a loading spinner
    if (!hasPermission) return fallback

    return <>{children}</>
}
