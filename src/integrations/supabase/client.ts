// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://rvxkjebdrohfcanbvztw.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2eGtqZWJkcm9oZmNhbmJ2enR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0OTQzNjQsImV4cCI6MjA1ODA3MDM2NH0.LCVqfXCVQCpmYSoRS4dzUSh50kCvd5jgzTAsD1r0w4c";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);