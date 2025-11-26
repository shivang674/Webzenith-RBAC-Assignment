import { createClient } from '@/lib/supabase/server'

export async function checkPermission(entity: string, operation: string) {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        return false
    }

    // Call the database function we defined in the migration
    const { data, error } = await supabase.rpc('has_permission', {
        user_id: user.id,
        required_entity: entity,
        required_operation: operation,
    })

    if (error) {
        console.error(`Error checking permission for ${entity}.${operation}:`, error)
        return false
    }

    return data === true
}

export async function requirePermission(entity: string, operation: string) {
    const hasAccess = await checkPermission(entity, operation)
    if (!hasAccess) {
        throw new Error('Unauthorized')
    }
}
