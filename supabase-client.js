// ============================================================
// supabase-client.js
// One shared Supabase connection used by every PrepX page.
// Include this AFTER the Supabase CDN script and BEFORE any
// other script that talks to Supabase, e.g.:
//
//   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
//   <script src="supabase-client.js"></script>
//   <script src="script.js"></script>
// ============================================================
 
// PASTE YOUR OWN VALUES HERE (from Supabase → Project Settings → API)
const SUPABASE_URL = "https://uxdlrwkuowofswxcahor.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4ZGxyd2t1b3dvZnN3eGNhaG9yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY2Mzg1NjYsImV4cCI6MjEwMjIxNDU2Nn0.t2jz5GSu7lXavBcpqnLge7ZPtjlV1iOEUl1PrZf1O10";
 
// Creates one global client that every page can reuse.
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
 
// ------------------------------------------------------------
// Helper: get the currently logged-in user (or null).
// ------------------------------------------------------------
async function getCurrentUser() {
  const { data: { user } } = await supabaseClient.auth.getUser();
  return user;
}
 
// ------------------------------------------------------------
// Helper: get the current user's profile row (full_name, etc).
// ------------------------------------------------------------
async function getCurrentProfile() {
  const user = await getCurrentUser();
  if (!user) return null;
 
  const { data, error } = await supabaseClient
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
 
  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
  return data;
}
 
// ------------------------------------------------------------
// Helper: protect a page. Call this at the top of any page
// that requires login. Redirects to login.html if not signed in.
// Returns the user object if logged in.
// ------------------------------------------------------------
async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    window.location.href = 'login.html';
    return null;
  }
  return user;
}
 
// ------------------------------------------------------------
// Helper: sign the user out and send them back to login.
// ------------------------------------------------------------
async function signOutAndRedirect() {
  await supabaseClient.auth.signOut();
  window.location.href = 'login.html';
}
 
// ============================================================
// MODULE HELPERS
// Copy-paste-ready functions for saving results from each
// module into its Supabase table. Wire these into the actual
// submit logic on aptitude.html / coding.html / resume.html /
// interview.html when you're ready to move off the PHP/MySQL
// path — none of these run automatically yet.
// ============================================================
 
async function saveAptitudeResult({ score_percentage, correct_count, total_questions, time_taken, warnings_count, status }) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Not logged in' };
 
  return await supabaseClient.from('aptitude_results').insert({
    user_id: user.id,
    score_percentage, correct_count, total_questions, time_taken, warnings_count, status
  });
}
 
async function saveCodingSubmission({ problem_id, problem_title, language, code, verdict, runtime_ms }) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Not logged in' };
 
  return await supabaseClient.from('coding_submissions').insert({
    user_id: user.id,
    problem_id, problem_title, language, code, verdict, runtime_ms
  });
}
 
async function saveResumeScan({ file_name, ats_score, matched_keywords, missing_keywords, feedback }) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Not logged in' };
 
  return await supabaseClient.from('resume_scans').insert({
    user_id: user.id,
    file_name, ats_score, matched_keywords, missing_keywords, feedback
  });
}
 
async function saveInterviewSession({ role_target, question, answer_transcript, confidence_score, clarity_score, overall_grade, feedback }) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Not logged in' };
 
  return await supabaseClient.from('interview_sessions').insert({
    user_id: user.id,
    role_target, question, answer_transcript, confidence_score, clarity_score, overall_grade, feedback
  });
}
 