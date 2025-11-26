import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requirePermission } from '@/lib/rbac'
import { z } from 'zod'

const createPermissionSchema = z.object({
    entity: z.string().min(1),
    operation: z.string().min(1),
    description: z.string().optional(),
})

export async function GET(req: NextRequest) {
    try {
        await requirePermission('roles', 'read') // Viewing permissions requires role read access (or separate permission)
        const supabase = await createClient()

        const { data, error } = await supabase
            .from('permissions')
            .select('*')
            .order('entity', { ascending: true })
            .order('operation', { ascending: true })

        if (error) throw error

        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal Server Error' },
            { status: error instanceof Error && error.message === 'Unauthorized' ? 403 : 500 }
        )
    }
}

export async function POST(req: NextRequest) {
    try {
        await requirePermission('roles', 'update') // Creating permissions is an admin task
        const body = await req.json()
        const validated = createPermissionSchema.parse(body)

        const supabase = await createClient()
        const { data, error } = await supabase
            .from('permissions')
            .insert(validated)
            .select()
            .single()

        if (error) throw error

        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal Server Error' },
            { status: error instanceof Error && error.message === 'Unauthorized' ? 403 : 500 }
        )
    }
}
