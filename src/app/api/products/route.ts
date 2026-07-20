import { supabase } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { validateAdmin, unauthorizedResponse } from '@/lib/auth';
import { randomUUID } from 'crypto';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');

    let query = supabase.from('Product').select('*').order('createdAt', { ascending: false });

    if (category && category !== 'Todos') {
      query = query.eq('category', category);
    }
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }
    if (featured === 'true') {
      query = query.eq('featured', true);
    }

    const { data, error } = await query;
    if (error) throw error;
    return NextResponse.json(Array.isArray(data) ? data : []);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { admin, error: authError, status } = await validateAdmin(request);
    if (authError) return unauthorizedResponse(authError);

    const body = await request.json();
    const { name, description, price, image, category, inStock, featured, ingredients, howToUse, benefits, weight, additionalImages } = body;

    const { data, error } = await supabase.from('Product').insert({
      id: randomUUID(),
      name,
      description,
      price: parseFloat(price),
      image: image || '',
      category,
      inStock: inStock ?? true,
      featured: featured ?? false,
      ingredients: Array.isArray(ingredients) ? ingredients : [],
      howToUse: howToUse?.trim() || '',
      benefits: Array.isArray(benefits) ? benefits : [],
      weight: weight?.trim() || '',
      additionalImages: Array.isArray(additionalImages) ? additionalImages : [],
    }).select().single();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: 'Erro ao criar produto', details: error.message, code: error.code }, { status: 500 });
    }
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    const msg = error instanceof Error ? error.message : 'Erro desconhecido';
    return NextResponse.json({ error: 'Erro ao criar produto', details: msg }, { status: 500 });
  }
}