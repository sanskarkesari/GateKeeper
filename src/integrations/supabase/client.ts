// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://uitaejnpfoopgtvaranl.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpdGFlam5wZm9vcGd0dmFyYW5sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3MDYzMTYsImV4cCI6MjA1NzI4MjMxNn0.WQ02N6iaAyOqtx-74BjRwTxmd5Ml9csxNdeDkR7QOUI";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);