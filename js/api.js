// Minimal Supabase client written for this site (no external library).
// It talks to two Supabase services over HTTPS with fetch():
//   - Auth (GoTrue)     /auth/v1/...  sign-in with an email code, session refresh, sign-out
//   - Data (PostgREST)  /rest/v1/...  tables and functions, filtered by RLS in the database
//
// PowerShell analogy: fetch() is Invoke-RestMethod; "await" waits for the result.
//
// The session (access + refresh tokens) is kept in localStorage so members stay signed in.

const SESSION_KEY = "family-gifts.session";

let config = null;          // { supabaseUrl, supabasePublishableKey } from ../config.js
let session = null;         // { access_token, refresh_token, expires_at, user_id }
let refreshing = null;      // pending refresh, shared so we never refresh twice at once

/** Error raised for any failed call. `key` is a stable code used to pick a French message. */
export class ApiError extends Error {
  constructor(key, status, detail) {
    super(detail || key);
    this.key = key;
    this.status = status;
  }
}

/** Loads config.js (generated at deployment). Returns false if the site is not configured. */
export async function initApi() {
  try {
    ({ config } = await import("../config.js?v=6604111"));
  } catch {
    config = null;
    return false;
  }
  session = readStoredSession();
  return true;
}

export function isConfigured() {
  return config !== null;
}

export function isSignedIn() {
  return session !== null;
}

export function currentUserId() {
  return session?.user_id ?? null;
}

// ---------------------------------------------------------------------------
// Sign-in with an email code
// ---------------------------------------------------------------------------

/**
 * Asks Supabase to email a 6-digit code. create_user:false means unknown addresses
 * never get an account (sign-ups are disabled anyway).
 */
export async function sendCode(email) {
  await request("/auth/v1/otp", {
    method: "POST",
    auth: false,
    body: { email, create_user: false },
  });
}

/** Checks the code; on success the session is stored and the member is signed in. */
export async function verifyCode(email, token) {
  const data = await request("/auth/v1/verify", {
    method: "POST",
    auth: false,
    body: { type: "email", email, token },
  });
  storeSession(data);
}

export async function signOut() {
  try {
    if (session) await request("/auth/v1/logout", { method: "POST" });
  } catch {
    // Signing out locally is what matters; ignore network errors.
  }
  clearSession();
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

/**
 * Reads rows from a table. `query` uses PostgREST syntax, e.g.
 *   select("members", "select=id,display_name&order=display_name")
 */
export function select(table, query = "select=*") {
  return request(`/rest/v1/${table}?${query}`);
}

/** Calls a database function, e.g. rpc("get_my_draws"). */
export function rpc(name, args = {}) {
  return request(`/rest/v1/rpc/${name}`, { method: "POST", body: args });
}

/** Inserts one row and returns it as saved (with its id). */
export async function insert(table, row) {
  const rows = await request(`/rest/v1/${table}`, {
    method: "POST",
    body: row,
    prefer: "return=representation",
  });
  return rows[0];
}

/**
 * Updates the rows matching `filter` (PostgREST syntax, e.g. "id=eq.123") and returns
 * them. An empty result means RLS did not allow the change.
 */
export function update(table, filter, values) {
  return request(`/rest/v1/${table}?${filter}`, {
    method: "PATCH",
    body: values,
    prefer: "return=representation",
  });
}

/** Deletes the rows matching `filter`. */
export function remove(table, filter) {
  return request(`/rest/v1/${table}?${filter}`, { method: "DELETE" });
}

/** Inserts or updates one row identified by the `conflictColumn` unique column. */
export async function upsert(table, row, conflictColumn) {
  const rows = await request(`/rest/v1/${table}?on_conflict=${conflictColumn}`, {
    method: "POST",
    body: row,
    prefer: "resolution=merge-duplicates,return=representation",
  });
  return rows[0];
}

let me = null;

/**
 * The signed-in member ({ id, display_name, is_admin }), or null if the account is not
 * linked to an active member. Loaded once, then cached until sign-out.
 */
export async function getMe({ refresh = false } = {}) {
  if (me && !refresh) return me;
  const rows = await select(
    "members",
    `select=id,display_name,is_admin&user_id=eq.${encodeURIComponent(currentUserId())}`,
  );
  me = rows[0] ?? null;
  return me;
}

// ---------------------------------------------------------------------------
// Internals
// ---------------------------------------------------------------------------

async function request(path, { method = "GET", body, auth = true, prefer } = {}) {
  if (!config) throw new ApiError("not_configured", 0);

  const headers = { apikey: config.supabasePublishableKey };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (prefer) headers.Prefer = prefer;
  if (auth) {
    const valid = await validSession();
    if (valid) headers.Authorization = `Bearer ${valid.access_token}`;
  }

  let response;
  try {
    response = await fetch(config.supabaseUrl + path, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError("network", 0);
  }

  const text = await response.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }

  if (!response.ok) {
    if (response.status === 401 && auth) clearSession();
    throw new ApiError(errorKey(data, response.status), response.status, data?.message || data?.msg);
  }
  return data;
}

// Database functions raise stable keys such as "draw.receiver_taken"; Auth returns
// codes such as "otp_expired". Both become ApiError.key.
function errorKey(data, status) {
  const message = data?.message;
  if (typeof message === "string" && /^[a-z_]+\.[a-z_]+$/.test(message)) return message;
  if (data?.error_code) return data.error_code;
  if (status === 429) return "rate_limited";
  return data?.code ? String(data.code) : `http_${status}`;
}

function storeSession(data) {
  session = {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: data.expires_at ?? Math.floor(Date.now() / 1000) + data.expires_in,
    user_id: data.user?.id ?? session?.user_id ?? null,
  };
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    // Private browsing: the session simply lasts until the tab is closed.
  }
}

function readStoredSession() {
  try {
    const stored = JSON.parse(localStorage.getItem(SESSION_KEY));
    return stored?.refresh_token ? stored : null;
  } catch {
    return null;
  }
}

function clearSession() {
  session = null;
  me = null;
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    // nothing to do
  }
}

// Returns a session whose access token is valid for at least one more minute,
// refreshing it when needed. Returns null when the member must sign in again.
async function validSession() {
  if (!session) return null;
  if (session.expires_at - 60 > Date.now() / 1000) return session;

  refreshing ??= (async () => {
    try {
      const data = await request("/auth/v1/token?grant_type=refresh_token", {
        method: "POST",
        auth: false,
        body: { refresh_token: session.refresh_token },
      });
      storeSession(data);
    } catch (error) {
      if (error.key !== "network") clearSession();
    } finally {
      refreshing = null;
    }
  })();
  await refreshing;
  return session;
}
