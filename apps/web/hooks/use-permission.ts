'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export function usePermission(entity: string, operation: string) {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null)
    const supabase = createClient()

    useEffect(() => {
        async function check() {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                setHasPermission(false)
                return
            }

            const { data, error } = await supabase.rpc('has_permission', {
                user_id: user.id,
                required_entity: entity,
                required_operation: operation,
            })

            if (error) {
                console.error(`Permission check failed for ${entity}.${operation}:`, error)
                setHasPermission(false)
            } else {
                setHasPermission(data === true)
            }
        }

        check()
    }, [entity, operation, supabase])

    return { hasPermission, isLoading: hasPermission === null }
}
