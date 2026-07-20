import { supabase } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { validateAdmin, unauthorizedResponse } from '@/lib/auth';

// GET /api/popups — público (storefront precisa)
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('Popup')
      .select('*')
      .eq('active', true)
      .order('createdAt', { ascending: false })
      .limit(1);

    if (error) {
      // Tabela pode não existir ainda
      console.error('Error fetching popups:', error);
      return NextResponse.json([]);
    }
    return NextResponse.json(Array.isArray(data) ? data : []);
  } catch (error) {
    console.error('Error fetching popups:', error);
    return NextResponse.json([]);
  }
}

// POST /api/popups — criar novo popup (admin)
export async function POST(request: NextRequest) {
  try {
    const { admin, error: authError } = await validateAdmin(request);
    if (authError) return unauthorizedResponse(authError);

    const body = await request.json();
    const {
      title,
      subtitle,
      benefits,
      stockAlert,
      ctaText,
      ctaLink,
      footerText,
      urgencyLabel,
      cooldownHours,
      active,
    } = body;

    // Validar campos obrigatórios
    if (!title?.trim()) {
      return NextResponse.json({ error: 'Título é obrigatório' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('Popup')
      .insert({
        title: title.trim(),
        subtitle: subtitle?.trim() || '',
        benefits: Array.isArray(benefits) ? benefits : [],
        stockAlert: stockAlert?.trim() || '',
        ctaText: ctaText?.trim() || 'VER OFERTAS',
        ctaLink: ctaLink?.trim() || '#produtos',
        footerText: footerText?.trim() || '',
        urgencyLabel: urgencyLabel?.trim() || 'Oferta por tempo limitado',
        cooldownHours: parseFloat(cooldownHours) || 12,
        active: active ?? true,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error creating popup:', error);
    return NextResponse.json({ error: 'Erro ao criar popup' }, { status: 500 });
  }
}