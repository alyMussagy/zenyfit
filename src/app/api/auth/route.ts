import { supabase } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, accessCode } = await request.json();

    if (!email || !accessCode) {
      return NextResponse.json({ error: 'Email e código são obrigatórios' }, { status: 400 });
    }

    const { data: admin, error } = await supabase
      .from('Admin')
      .select('*')
      .eq('email', email.trim().toLowerCase())
      .eq('accessCode', accessCode)
      .eq('active', true)
      .single();

    if (error || !admin) {
      return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });
    }

    // Return admin data (without accessCode)
    return NextResponse.json({
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    });
  } catch {
    return NextResponse.json({ error: 'Erro de autenticação' }, { status: 500 });
  }
}