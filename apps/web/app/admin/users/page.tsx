'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getUsers, assignRole } from '@/lib/api/users'
import { getRoles } from '@/lib/api/roles'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'

import { CreateUserDialog } from '@/components/create-user-dialog'

export default function UsersPage() {
    const queryClient = useQueryClient()
    const { toast } = useToast()

    const { data: users, isLoading: usersLoading } = useQuery({
        queryKey: ['users'],
        queryFn: getUsers,
    })

    const { data: roles } = useQuery({
        queryKey: ['roles'],
        queryFn: getRoles,
    })

    const assignMutation = useMutation({
        mutationFn: ({ userId, roleId }: { userId: string; roleId: string }) =>
            assignRole(userId, roleId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
            toast({ title: 'Role assigned' })
        },
    })

    if (usersLoading) return <div>Loading...</div>

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Users</h1>
                <CreateUserDialog />
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User ID</TableHead>
                            <TableHead>Current Role</TableHead>
                            <TableHead>Assign Role</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users?.map((user) => (
                            <TableRow key={user.user_id}>
                                <TableCell className="font-mono text-xs">{user.user_id}</TableCell>
                                <TableCell>
                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                        {user.roles?.name || 'No Role'}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <Select
                                        defaultValue={user.role_id}
                                        onValueChange={(value) =>
                                            assignMutation.mutate({ userId: user.user_id, roleId: value })
                                        }
                                    >
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Select a role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {roles?.map((role) => (
                                                <SelectItem key={role.id} value={role.id}>
                                                    {role.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
