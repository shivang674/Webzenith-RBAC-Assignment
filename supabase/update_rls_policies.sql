-- Enable RLS policies for write operations based on permissions

-- 1. Roles Table
create policy "Allow create roles" on public.roles for insert with check (public.has_permission(auth.uid(), 'roles', 'create'));
create policy "Allow update roles" on public.roles for update using (public.has_permission(auth.uid(), 'roles', 'update'));
create policy "Allow delete roles" on public.roles for delete using (public.has_permission(auth.uid(), 'roles', 'delete'));

-- 2. Permissions Table (Usually static, but allowing updates if needed)
create policy "Allow create permissions" on public.permissions for insert with check (public.has_permission(auth.uid(), 'permissions', 'create'));
create policy "Allow update permissions" on public.permissions for update using (public.has_permission(auth.uid(), 'permissions', 'update'));
create policy "Allow delete permissions" on public.permissions for delete using (public.has_permission(auth.uid(), 'permissions', 'delete'));

-- 3. Role Permissions (Managed when updating roles)
create policy "Allow manage role permissions" on public.role_permissions for all using (public.has_permission(auth.uid(), 'roles', 'update'));

-- 4. User Roles (Managed when updating users)
create policy "Allow manage user roles" on public.user_roles for all using (public.has_permission(auth.uid(), 'users', 'update'));
