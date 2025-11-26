-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Roles Table
create table public.roles (
  id uuid not null default uuid_generate_v4(),
  name text not null,
  description text,
  is_active boolean default true,
  created_at timestamptz default now(),
  constraint roles_pkey primary key (id),
  constraint roles_name_key unique (name)
);

-- Permissions Table
create table public.permissions (
  id uuid not null default uuid_generate_v4(),
  entity text not null,
  operation text not null,
  description text,
  created_at timestamptz default now(),
  constraint permissions_pkey primary key (id),
  constraint permissions_entity_operation_key unique (entity, operation)
);

-- Role Permissions Junction Table
create table public.role_permissions (
  role_id uuid not null references public.roles(id) on delete cascade,
  permission_id uuid not null references public.permissions(id) on delete cascade,
  constraint role_permissions_pkey primary key (role_id, permission_id)
);

-- User Roles Junction Table
create table public.user_roles (
  user_id uuid not null references auth.users(id) on delete cascade,
  role_id uuid not null references public.roles(id) on delete cascade,
  constraint user_roles_pkey primary key (user_id, role_id)
);

-- Enable RLS
alter table public.roles enable row level security;
alter table public.permissions enable row level security;
alter table public.role_permissions enable row level security;
alter table public.user_roles enable row level security;

-- RLS Policies (Simplified for initial setup - Admin access required for real app)
-- For now, allow read access to authenticated users for basic operation
create policy "Allow read access to authenticated users" on public.roles for select to authenticated using (true);
create policy "Allow read access to authenticated users" on public.permissions for select to authenticated using (true);
create policy "Allow read access to authenticated users" on public.role_permissions for select to authenticated using (true);
create policy "Allow read access to authenticated users" on public.user_roles for select to authenticated using (true);

-- Helper function to check user permission
create or replace function public.has_permission(user_id uuid, required_entity text, required_operation text)
returns boolean as $$
begin
  return exists (
    select 1
    from public.user_roles ur
    join public.role_permissions rp on ur.role_id = rp.role_id
    join public.permissions p on rp.permission_id = p.id
    where ur.user_id = user_id
    and p.entity = required_entity
    and p.operation = required_operation
  );
end;
$$ language plpgsql security definer;
