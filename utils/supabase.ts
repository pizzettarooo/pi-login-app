import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://lytlsiqllcbyqziveqca.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5dGxzaXFsbGNieXF6aXZlcWNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxOTU1NTksImV4cCI6MjA1Nzc3MTU1OX0.P4mWU1dXtt82lk0bHc6I9cURfK3c6rl09RF2miqSglA";

export const supabase = createClient(supabaseUrl, supabaseKey);
