-- Add industries and job_types columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN industries text[] DEFAULT '{}',
ADD COLUMN job_types text[] DEFAULT '{}';