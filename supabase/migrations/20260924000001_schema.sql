-- SETU demo schema.
-- Five tables. Ids are text so the app can keep readable ids like 'sme_sharma'.

create table public.students (
  id                text primary key,
  position          smallint    not null default 0,
  first_name        text        not null,
  last_name         text        not null,
  short_name        text        not null,
  phone             text        not null,
  college           text        not null,
  course            text        not null,
  year              text        not null default 'Final year',
  town              text        not null,
  skills            text[]      not null default '{}',
  onboarded         boolean     not null default false,
  college_verified  boolean     not null default false,
  created_at        timestamptz not null default now()
);

create table public.smes (
  id                text primary key,
  position          smallint    not null default 0,
  name              text        not null,
  kind              text        not null,
  owner_name        text        not null,
  owner_first_name  text        not null,
  phone             text        not null,
  area              text        not null,
  town              text        not null,
  staff             text        not null,
  since_year        smallint    not null,
  about             text        not null,
  distance_km       numeric(5,1) not null check (distance_km >= 0),
  verified          boolean     not null default false,
  visited_on        date,
  submitted_on      date        not null,
  onboarded         boolean     not null default false,
  tone              text        not null default 'apricot' check (tone in ('apricot', 'teal')),
  created_at        timestamptz not null default now(),
  -- "Visited by Setu" must never show for a business that was not visited.
  constraint smes_verified_needs_visit check (not verified or visited_on is not null)
);

create table public.internships (
  id                 text primary key,
  sme_id             text        not null references public.smes (id) on delete cascade,
  title              text        not null,
  tasks              text[]      not null default '{}',
  requirements       text[]      not null default '{}',
  stipend            integer     check (stipend is null or stipend >= 0), -- rupees per month, null = unpaid
  weeks              smallint    not null check (weeks > 0),
  hours              text        not null,
  work_place         text        not null,
  counts_for_credit  boolean     not null default false,
  status             text        not null default 'live' check (status in ('live', 'closed')),
  posted_at          timestamptz not null default now()
);
create index internships_sme_id_idx on public.internships (sme_id);

create table public.applications (
  id             text primary key,
  internship_id  text        not null references public.internships (id) on delete cascade,
  student_id     text        not null references public.students (id) on delete cascade,
  status         text        not null default 'waiting'
                 check (status in ('waiting', 'accepted', 'not_selected', 'completed', 'withdrawn')),
  applied_at     timestamptz not null default now(),
  decided_at     timestamptz,
  starts_on      timestamptz,
  distance_km    numeric(5,1) not null default 0 check (distance_km >= 0),
  source         text        not null default 'student' check (source in ('student', 'setu')),
  -- One application per student per opening. A withdrawn one is reused.
  constraint applications_one_per_student unique (internship_id, student_id)
);
create index applications_student_id_idx on public.applications (student_id);

create table public.notifications (
  id          text primary key,
  role        text        not null check (role in ('student', 'sme', 'admin')),
  target_id   text        not null,
  title       text        not null,
  body        text        not null,
  href        text,
  ref_id      text,
  kind        text        check (kind in ('decision', 'info')),
  read        boolean     not null default false,
  created_at  timestamptz not null default now()
);
create index notifications_target_idx on public.notifications (role, target_id);
