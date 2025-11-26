import PermissionGuard from '@/components/permission-guard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function DashboardPage() {
    return (
        <div className="p-8 space-y-6">
            <h1 className="text-3xl font-bold">Dashboard</h1>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <PermissionGuard entity="leads" operation="read" fallback={<ForbiddenCard title="Leads" />}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Leads</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>You have access to view leads.</p>
                            <PermissionGuard entity="leads" operation="create">
                                <p className="text-sm text-green-600 mt-2">You can also create leads.</p>
                            </PermissionGuard>
                        </CardContent>
                    </Card>
                </PermissionGuard>

                <PermissionGuard entity="users" operation="read" fallback={<ForbiddenCard title="User Management" />}>
                    <Card>
                        <CardHeader>
                            <CardTitle>User Management</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>You have access to manage users.</p>
                        </CardContent>
                    </Card>
                </PermissionGuard>

                <PermissionGuard entity="roles" operation="read" fallback={<ForbiddenCard title="Role Management" />}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Role Management</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>You have access to manage roles.</p>
                        </CardContent>
                    </Card>
                </PermissionGuard>
            </div>
        </div>
    )
}

function ForbiddenCard({ title }: { title: string }) {
    return (
        <Card className="opacity-50 bg-gray-50">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-red-500">Access Denied</p>
            </CardContent>
        </Card>
    )
}
