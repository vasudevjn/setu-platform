-- Show the "interns help SMEs with digital transformation" USP in the demo data.
--
-- Migrations 3 and 4 may already be applied, so they stay as they were. This file:
--   1. Replaces the demo seeder so a reset or a fresh database gets the new business,
--      opening and applications, plus the sharpened digital-transformation wording.
--   2. Adds the new rows to a database that already has the old demo data, and updates
--      the two existing openings whose wording changed. Guarded by id and old value, so
--      a row someone has edited since is left alone.

create or replace function public.seed_demo_data()
returns void
language plpgsql
set search_path = public
as $fn$
begin
  insert into public.students (id, position, first_name, last_name, short_name, phone, college, course, year, town, skills, onboarded, college_verified) values
    ('stu_priya', 1, 'Priya', 'Kulkarni', 'Priya K.', '+91 98220 41207', 'BCOM Arts & Commerce College', 'BCom', 'Final year', 'Nashik', array['Tally', 'Excel', 'Customer service'], true, true),
    ('stu_aman', 2, 'Aman', 'Shaikh', 'Aman S.', '+91 97630 55810', 'BCOM Arts & Commerce College', 'BCom', 'Final year', 'Nashik', array['Excel', 'Stock keeping'], true, true),
    ('stu_neha', 3, 'Neha', 'Patil', 'Neha P.', '+91 90110 76342', 'BCOM Arts & Commerce College', 'BBA', 'Final year', 'Nashik', array['Social media', 'Canva', 'Communication'], true, true),
    ('stu_rahul', 4, 'Rahul', 'Mane', 'Rahul M.', '+91 88056 19934', 'BCOM Arts & Commerce College', 'BCom', 'Final year', 'Nashik', array['Billing', 'Excel', 'Basic English'], true, true),
    ('stu_sneha', 5, 'Sneha', 'Rane', 'Sneha R.', '+91 98904 20573', 'BCOM Arts & Commerce College', 'BCom', 'Final year', 'Nashik', array['Tally', 'GST basics'], true, true),
    ('stu_karan', 6, 'Karan', 'Deshpande', 'Karan D.', '+91 70200 88461', 'BCOM Arts & Commerce College', 'BCA', 'Final year', 'Nashik', array['Excel', 'Data entry', 'Customer calls'], true, true);

  insert into public.smes (id, position, name, kind, owner_name, owner_first_name, phone, area, town, staff, since_year, about, distance_km, verified, visited_on, submitted_on, onboarded, tone) values
    ('sme_sharma', 1, 'Sharma Traders', 'Wholesale grocery', 'Ramesh Sharma', 'Ramesh', '+91 98230 11876', 'Panchavati, Nashik', 'Nashik', '12 people', 2009, 'A family-run wholesale grocery supplier at Panchavati. We supply about 80 shops across Nashik and keep our books, stock and billing in-house.', 3, true, date '2025-10-11', date '2025-10-05', true, 'apricot'),
    ('sme_patel', 2, 'Patel Auto Parts', 'Auto spares retail', 'Hitesh Patel', 'Hitesh', '+91 98500 33418', 'Nashik Road, Nashik', 'Nashik', '8 people', 2004, 'A busy two-wheeler and car spares shop. We stock over 3,000 parts and want help keeping the stock register accurate.', 6, true, date '2025-10-09', date '2025-10-03', true, 'teal'),
    ('sme_mcomp', 3, 'Maharashtra Components', 'Metal parts maker', 'Vijay Joshi', 'Vijay', '+91 98811 60245', 'Satpur MIDC, Nashik', 'Nashik', '40 people', 1998, 'We make machined metal components for local auto and machinery companies. Our small office team could use a hand with orders and delivery tracking.', 5, true, date '2025-10-10', date '2025-10-04', true, 'apricot'),
    ('sme_kalyan', 4, 'Kalyan Accounting Services', 'Accounting and tax', 'Meena Kulkarni', 'Meena', '+91 99220 78125', 'College Road, Nashik', 'Nashik', '6 people', 2014, 'A small accounting office that handles GST, billing and books for about 60 local shops. Most client records are still on paper, and we want to move them onto a simple digital system.', 2, false, null, date '2025-10-12', true, 'teal'),
    ('sme_sahyadri', 5, 'Sahyadri Foods', 'Packaged foods', 'Anita More', 'Anita', '+91 94220 51789', 'Ambad MIDC, Nashik', 'Nashik', '25 people', 2016, 'We make pickles, papads and ready mixes, sold in local shops. We want to go digital: list ourselves on Google, sell on WhatsApp, and reach homes beyond our current shops.', 4, false, null, date '2025-10-13', true, 'apricot'),
    ('sme_deshmukh', 6, 'Deshmukh General Store', 'General store', 'Suresh Deshmukh', 'Suresh', '+91 96073 48512', 'Gangapur Road, Nashik', 'Nashik', '5 people', 2011, 'A neighbourhood general store on Gangapur Road. We serve about 200 families nearby, all by walk-in and phone orders so far. We want help getting online.', 4, true, date '2025-10-14', date '2025-10-08', true, 'teal');

  insert into public.internships (id, sme_id, title, tasks, requirements, stipend, weeks, hours, work_place, counts_for_credit, status, posted_at) values
    ('int_accounts', 'sme_sharma', 'Accounts Intern', array['Enter daily bills and GST in Tally', 'Help keep stock records up to date', 'Learn how a real business runs its books'], array['Final-year BCom or BBA student', 'Basic Excel is enough. Tally is a plus, not a must', 'Neat, careful and on time'], 4000, 8, '10–5', 'At the shop, Panchavati', true, 'live', now() - interval '3 days'),
    ('int_billing', 'sme_kalyan', 'Billing Assistant', array['Prepare GST invoices for clients', 'Keep a record of bills sent and payments received', 'Move paper client files into a shared digital record so nothing gets lost', 'Call clients kindly to remind them about pending bills'], array['Final-year BCom student', 'Comfortable with Excel', 'Clear speaking voice in Marathi or Hindi'], 5000, 6, '10–6', 'At our office, College Road', true, 'live', now() - interval '2 days'),
    ('int_operations', 'sme_mcomp', 'Operations Intern', array['Track customer orders from start to delivery', 'Update the daily production and dispatch sheet', 'Call transporters to confirm pickups'], array['Final-year BCom, BBA or BCA student', 'Good with Excel and simple numbers', 'Happy to spend some time on the shop floor'], 4500, 8, '9–5', 'At our unit, Satpur MIDC', true, 'live', now() - interval '5 days'),
    ('int_social', 'sme_sahyadri', 'Social Media Intern', array['List us on Google so people can find the shop when they search nearby', 'Set up a WhatsApp Business catalog so customers can order directly', 'Post photos of our products on Instagram and reply to messages'], array['Final-year student from any course', 'Uses Instagram and WhatsApp every day', 'Simple Marathi and English writing'], 3500, 6, '11–4', 'At our unit, Ambad MIDC', true, 'live', now() - interval '1 days'),
    ('int_inventory', 'sme_patel', 'Inventory Assistant', array['Update the stock register when parts come in and go out', 'Count stock every Saturday and note any gaps', 'Help the counter staff find parts quickly'], array['Final-year student, BCom preferred', 'Careful with numbers and handwriting', 'Interest in vehicles is a plus'], 4000, 8, '10–6', 'At the shop, Nashik Road', true, 'live', now() - interval '6 days'),
    ('int_digital', 'sme_deshmukh', 'Digital Transformation Intern', array['Set up a Google Business listing so customers can find us on Maps', 'Create a WhatsApp Business catalog with our products and prices', 'Put up a QR code at the counter so customers can pay digitally'], array['Final-year BCA, BBA or BCom student', 'Comfortable with smartphones and everyday apps', 'Patient enough to explain things to the owner step by step'], 3500, 6, '11–5', 'At the shop, Gangapur Road', true, 'live', now());

  insert into public.applications (id, internship_id, student_id, status, applied_at, decided_at, starts_on, distance_km, source) values
    ('app_1', 'int_accounts', 'stu_aman', 'waiting', now() - interval '2 days', null, null, 4, 'student'),
    ('app_2', 'int_accounts', 'stu_neha', 'waiting', now() - interval '2 days', null, null, 3, 'student'),
    ('app_3', 'int_accounts', 'stu_rahul', 'waiting', now() - interval '1 days', null, null, 6, 'student'),
    ('app_4', 'int_accounts', 'stu_sneha', 'waiting', now() - interval '1 days', null, null, 2, 'student'),
    ('app_5', 'int_accounts', 'stu_karan', 'waiting', now(), null, null, 5, 'student'),
    ('app_6', 'int_operations', 'stu_priya', 'waiting', now() - interval '1 days', null, null, 5, 'student'),
    ('app_7', 'int_operations', 'stu_rahul', 'waiting', now() - interval '3 days', null, null, 4, 'student'),
    ('app_8', 'int_inventory', 'stu_priya', 'not_selected', now() - interval '5 days', now() - interval '2 days', null, 6, 'student'),
    ('app_9', 'int_inventory', 'stu_aman', 'accepted', now() - interval '5 days', now() - interval '3 days', now() + interval '2 days', 3, 'student'),
    ('app_10', 'int_digital', 'stu_karan', 'waiting', now(), null, null, 4, 'student'),
    ('app_11', 'int_digital', 'stu_neha', 'waiting', now() - interval '1 days', null, null, 5, 'student');
end;
$fn$;

revoke all on function public.seed_demo_data() from public, anon, authenticated;

-- Sharpen the wording on the two existing openings that already touched on going digital.
update public.smes set about = 'A small accounting office that handles GST, billing and books for about 60 local shops. Most client records are still on paper, and we want to move them onto a simple digital system.'
  where id = 'sme_kalyan' and about = 'A small accounting office that handles GST, billing and books for about 60 local shops. Busy at every month end.';

update public.smes set about = 'We make pickles, papads and ready mixes, sold in local shops. We want to go digital: list ourselves on Google, sell on WhatsApp, and reach homes beyond our current shops.'
  where id = 'sme_sahyadri' and about = 'We make pickles, papads and ready mixes, sold in local shops. We want to reach more homes on Instagram and WhatsApp.';

update public.internships set tasks = array['Prepare GST invoices for clients', 'Keep a record of bills sent and payments received', 'Move paper client files into a shared digital record so nothing gets lost', 'Call clients kindly to remind them about pending bills']
  where id = 'int_billing' and tasks = array['Prepare GST invoices for clients', 'Keep a record of bills sent and payments received', 'Call clients kindly to remind them about pending bills'];

update public.internships set tasks = array['List us on Google so people can find the shop when they search nearby', 'Set up a WhatsApp Business catalog so customers can order directly', 'Post photos of our products on Instagram and reply to messages']
  where id = 'int_social' and tasks = array['Post photos of our products on Instagram and WhatsApp', 'Reply to customer messages', 'Make simple posters in Canva'];

-- Add the new business, opening and applications if they are not there yet.
insert into public.smes (id, position, name, kind, owner_name, owner_first_name, phone, area, town, staff, since_year, about, distance_km, verified, visited_on, submitted_on, onboarded, tone)
select 'sme_deshmukh', 6, 'Deshmukh General Store', 'General store', 'Suresh Deshmukh', 'Suresh', '+91 96073 48512', 'Gangapur Road, Nashik', 'Nashik', '5 people', 2011, 'A neighbourhood general store on Gangapur Road. We serve about 200 families nearby, all by walk-in and phone orders so far. We want help getting online.', 4, true, date '2025-10-14', date '2025-10-08', true, 'teal'
where not exists (select 1 from public.smes where id = 'sme_deshmukh');

insert into public.internships (id, sme_id, title, tasks, requirements, stipend, weeks, hours, work_place, counts_for_credit, status, posted_at)
select 'int_digital', 'sme_deshmukh', 'Digital Transformation Intern', array['Set up a Google Business listing so customers can find us on Maps', 'Create a WhatsApp Business catalog with our products and prices', 'Put up a QR code at the counter so customers can pay digitally'], array['Final-year BCA, BBA or BCom student', 'Comfortable with smartphones and everyday apps', 'Patient enough to explain things to the owner step by step'], 3500, 6, '11–5', 'At the shop, Gangapur Road', true, 'live', now()
where not exists (select 1 from public.internships where id = 'int_digital');

insert into public.applications (id, internship_id, student_id, status, applied_at, decided_at, starts_on, distance_km, source)
select 'app_10', 'int_digital', 'stu_karan', 'waiting', now(), null, null, 4, 'student'
where not exists (select 1 from public.applications where id = 'app_10');

insert into public.applications (id, internship_id, student_id, status, applied_at, decided_at, starts_on, distance_km, source)
select 'app_11', 'int_digital', 'stu_neha', 'waiting', now() - interval '1 days', null, null, 5, 'student'
where not exists (select 1 from public.applications where id = 'app_11');
