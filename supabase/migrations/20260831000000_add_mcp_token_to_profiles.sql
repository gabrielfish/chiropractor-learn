-- Add mcp_token column to profiles for member-level MCP access
alter table public.profiles
  add column if not exists mcp_token uuid;

-- Each member's token is unique
create unique index if not exists profiles_mcp_token_idx on public.profiles (mcp_token)
  where mcp_token is not null;

-- Members can read their own token; admins can read all
comment on column public.profiles.mcp_token is
  'Personal MCP API token — grants member-level access to the DCPG MCP server';
