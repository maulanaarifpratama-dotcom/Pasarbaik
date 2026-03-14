import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://wfpkdgzvwudiydznxwod.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndmcGtkZ3p2d3VkaXlkem54d29kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1MTI1NjEsImV4cCI6MjA4OTA4ODU2MX0.fLIPODRr1XG6LwNfPKZHBrPmp00CDne_WekDLIGrkp4";

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);
