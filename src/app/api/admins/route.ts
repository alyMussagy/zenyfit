import { supabase } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { validateAdmin, unauthorizedResponse } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { admin, error: authError } = await validateAdmin(request);
    if (authError) return unauthorizedResponse(authError);

    // Only owner can list admins
    if (admin.role !== 'owner') {
      return NextResponse.json({ error: 'Sem permissão' }, { status: 403 });
    }

    const { data, error } = await supabase
      .from('Admin')
      .select('id, email, name, role, active, createdAt')
      .order('createdAt', { ascending: true });

    if (error) throw error;
    return NextResponse.json(data || []);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch admins' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { admin, error: authError } = await validateAdmin(request);
    if (authError) return unauthorizedResponse(authError);

    // Only owner can create admins
    if (admin.role !== 'owner') {
      return NextResponse.json({ error: 'Sem permissão' }, { status: 403 });
    }

    const { email, name, accessCode, role } = await request.json();

    if (!email || !accessCode) {
      return NextResponse.json({ error: 'Email e código são obrigatórios' }, { status: 400 });
    }

    const { data, error } = await supabase.from('Admin').insert({
      id: crypto.randomUUID(),
      email: email.trim().toLowerCase(),
      name: name || '',
      accessCode,
      role: role || 'admin',
      active: true,
    }).select('id, email, name, role, active, createdAt').single();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'Este email já está registado' }, { status: 409 });
      }
      throw error;
    }

    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Erro ao criar administrador' }, { status: 500 });
  }
}