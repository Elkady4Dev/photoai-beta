-- Insert unlimited dev team token
INSERT INTO public.testers (token, label, max_gens)
VALUES ('keshodevtoken', 'Dev Team - Unlimited', -1)
ON CONFLICT (token) DO UPDATE SET max_gens = -1, is_active = true, label = 'Dev Team - Unlimited';
