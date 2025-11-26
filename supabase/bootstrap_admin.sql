-- 1. Insert Default Roles (if they don't exist)
insert into public.roles (name, description) values
('Admin', 'Full system access'),
('Manager', 'Departmental access'),
('User', 'Standard access')
on conflict (name) do nothing;

-- 2. Insert Default Permissions (if they don't exist)
insert into public.permissions (entity, operation, description) values
('users', 'create', 'Can create users'),
('users', 'read', 'Can view users'),
('users', 'update', 'Can update users'),
('users', 'delete', 'Can delete users'),
('roles', 'create', 'Can create roles'),
('roles', 'read', 'Can view roles'),
('roles', 'update', 'Can update roles'),
('roles', 'delete', 'Can delete roles'),
('leads', 'create', 'Can create leads'),
('leads', 'read', 'Can view leads'),
('leads', 'update', 'Can update leads'),
('leads', 'delete', 'Can delete leads')
on conflict (entity, operation) do nothing;

-- 3. Assign Permissions to Admin (All)
insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
cross join public.permissions p
where r.name = 'Admin'
on conflict (role_id, permission_id) do nothing;

-- 4. Assign Permissions to Manager (Leads + Users Read)
insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
join public.permissions p on (
  (p.entity = 'leads') or
  (p.entity = 'users' and p.operation = 'read')
)
where r.name = 'Manager'
on conflict (role_id, permission_id) do nothing;

-- 5. Assign Permissions to User (Leads Read/Create)
insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
join public.permissions p on (
  (p.entity = 'leads' and p.operation in ('read', 'create'))
)
where r.name = 'User'
on conflict (role_id, permission_id) do nothing;

-- 6. Assign Admin Role to User (REPLACE 'YOUR_EMAIL' with your actual email)
-- This assumes the user has already signed up via Supabase Auth
insert into public.user_roles (user_id, role_id)
select u.id, r.id
from auth.users u
join public.roles r on r.name = 'Admin'
where u.email = 'YOUR_EMAIL_HERE' -- <--- CHANGE THIS TO YOUR EMAIL
on conflict (user_id, role_id) do nothing;
