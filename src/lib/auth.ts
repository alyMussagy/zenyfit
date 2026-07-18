import { supabase } from './supabase/server';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Validate admin session from request headers.
 * Expects: Authorization header with value "Bearer <admin-email>"
 * Checks that the admin exists and is active.
 */
export async function validateAdmin(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return { admin: null, error: 'Não autorizado', status: 401 };
  }

  const email = authHeader.slice(7).trim();
  if (!email) {
    return { admin: null, error: 'Não autorizado', status: 401 };
  }

  const { data, error } = await supabase
    .from('Admin')
    .select('id, email, name, role, active')
    .eq('email', email)
    .eq('active', true)
    .single();

  if (error || !data) {
    return { admin: null, error: 'Sessão inválida', status: 401 };
  }

  return { admin: data, error: null, status: 200 };
}

/**
 * Returns 401 response. Use as short-circuit in protected routes.
 */
export function unauthorizedResponse(message = 'Não autorizado') {
  return NextResponse.json({ error: message }, { status: 401 });
}