import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const results: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    checks: {} as Record<string, unknown>,
  };

  // ── 1. Env var check ──────────────────────────────────────────────────────
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  (results.checks as Record<string, unknown>)['env_vars'] = {
    NEXT_PUBLIC_SUPABASE_URL: url ? '✅ set' : '❌ missing',
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: key ? '✅ set' : '❌ missing',
  };

  if (!url || !key) {
    return NextResponse.json(
      { status: 'failed', reason: 'Missing environment variables', ...results },
      { status: 500 }
    );
  }

  // ── 2. Client creation ───────────────────────────────────────────────────
  let supabase;
  try {
    supabase = createClient(url, key);
    (results.checks as Record<string, unknown>)['client_creation'] = '✅ success';
  } catch (err) {
    (results.checks as Record<string, unknown>)['client_creation'] = `❌ failed: ${err}`;
    return NextResponse.json(
      { status: 'failed', reason: 'Could not create Supabase client', ...results },
      { status: 500 }
    );
  }

  // ── 3. Basic connectivity (lightweight RPC ping) ─────────────────────────
  try {
    const start = Date.now();
    // A simple query that always works regardless of table setup
    const { error } = await supabase.rpc('version');
    const latencyMs = Date.now() - start;

    if (error && error.code !== 'PGRST202') {
      // PGRST202 = function not found — still proves we can reach Supabase
      (results.checks as Record<string, unknown>)['connectivity'] = {
        status: '⚠️ reachable (rpc returned error)',
        error: error.message,
        latency_ms: latencyMs,
      };
    } else {
      (results.checks as Record<string, unknown>)['connectivity'] = {
        status: '✅ connected',
        latency_ms: latencyMs,
      };
    }
  } catch (err) {
    (results.checks as Record<string, unknown>)['connectivity'] = {
      status: '❌ unreachable',
      error: String(err),
    };
    return NextResponse.json(
      { status: 'failed', reason: 'Cannot reach Supabase', ...results },
      { status: 503 }
    );
  }

  // ── 4. Table access test (list public tables) ────────────────────────────
  try {
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .limit(10);

    if (error) {
      // Fallback: try a direct table query
      const fallback = await supabase.from('profiles').select('count').limit(1);
      (results.checks as Record<string, unknown>)['table_access'] = fallback.error
        ? { status: '⚠️ limited access', error: fallback.error.message }
        : { status: '✅ can read tables', sample_table: 'profiles' };
    } else {
      (results.checks as Record<string, unknown>)['table_access'] = {
        status: '✅ success',
        public_tables: (data ?? []).map((r: { table_name: string }) => r.table_name),
      };
    }
  } catch (err) {
    (results.checks as Record<string, unknown>)['table_access'] = {
      status: '❌ error',
      error: String(err),
    };
  }

  // ── 5. Auth service check ────────────────────────────────────────────────
  try {
    const { data: sessionData, error: authError } =
      await supabase.auth.getSession();
    (results.checks as Record<string, unknown>)['auth_service'] = authError
      ? { status: '❌ error', error: authError.message }
      : {
          status: '✅ reachable',
          session: sessionData.session ? 'active session found' : 'no active session (expected)',
        };
  } catch (err) {
    (results.checks as Record<string, unknown>)['auth_service'] = {
      status: '❌ error',
      error: String(err),
    };
  }

  return NextResponse.json({ status: 'ok', ...results });
}