import { supabase } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { validateAdmin, unauthorizedResponse } from '@/lib/auth';

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
    const { name, description, price, image, category, inStock, featured } = body;

    const { data, error } = await supabase.from('Product').insert({
      name,
      description,
      price: parseFloat(price),
      image: image || '',
      category,
      inStock: inStock ?? true,
      featured: featured ?? false,
    }).select().single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}