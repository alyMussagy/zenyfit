import { supabase } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/products/related?category=X&excludeId=Y&limit=4
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const excludeId = searchParams.get('excludeId');
    const limit = parseInt(searchParams.get('limit') || '4', 10);

    if (!category) {
      return NextResponse.json({ error: 'category is required' }, { status: 400 });
    }

    let query = supabase
      .from('Product')
      .select('id, name, description, price, image, category, inStock, featured, weight')
      .eq('category', category)
      .eq('inStock', true)
      .order('createdAt', { ascending: false })
      .limit(limit + 2); // fetch extra in case some are excluded

    const { data, error } = await query;

    if (error) throw error;

    // Exclude current product
    let products = (data || []).filter((p: { id: string }) => p.id !== excludeId);
    products = products.slice(0, limit);

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching related products:', error);
    return NextResponse.json({ error: 'Failed to fetch related products' }, { status: 500 });
  }
}