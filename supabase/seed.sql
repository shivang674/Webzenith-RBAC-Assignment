-- Insert Default Roles
insert into public.roles (name, description) values
('Admin', 'Full system access'),
('Manager', 'Departmental access'),
('User', 'Standard access');

-- Insert Default Permissions
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
('leads', 'delete', 'Can delete leads');

-- Assign Permissions to Admin (All)
insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
cross join public.permissions p
where r.name = 'Admin';

-- Assign Permissions to Manager (Leads + Users Read)
insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
join public.permissions p on (
  (p.entity = 'leads') or
  (p.entity = 'users' and p.operation = 'read')
)
where r.name = 'Manager';

-- Assign Permissions to User (Leads Read/Create)
insert into public.role_permissions (role_id, permission_id)
select r.id, p.id
from public.roles r
join public.permissions p on (
  (p.entity = 'leads' and p.operation in ('read', 'create'))
)
where r.name = 'User';
