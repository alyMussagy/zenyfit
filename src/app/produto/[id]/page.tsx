import { Metadata } from 'next';
import { supabase } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import ProductPageClient from '@/components/storefront/ProductPageClient';
import type { Product } from '@/types/product';

/* ─── Static params (ISR-like) ─── */
export async function generateStaticParams() {
  try {
    const { data } = await supabase.from('Product').select('id');
    if (!data) return [];
    return (data as { id: string }[]).map((p) => ({ id: p.id }));
  } catch {
    return [];
  }
}

/* ─── SEO Metadata ─── */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const { data } = await supabase.from('Product').select('*').eq('id', id).single();
    if (!data) return { title: 'Produto não encontrado | ZenyFit' };

    const product = data as Product;
    const title = `${product.name} | ZenyFit - Saúde, Beleza e Bem-estar`;
    const description = product.description
      ? product.description.length > 160
        ? product.description.substring(0, 157) + '...'
        : product.description
      : `Compre ${product.name} na ZenyFit. Produtos de saúde, beleza e bem-estar com entrega em Maputo e Matola.`;

    return {
      title,
      description,
      keywords: [
        product.name,
        product.category,
        'ZenyFit',
        'saúde',
        'beleza',
        'bem-estar',
        'Moçambique',
        'Maputo',
        'comprar online',
        ...(product.benefits || []).slice(0, 3),
      ].filter(Boolean) as string[],
      openGraph: {
        title,
        description,
        type: 'website',
        locale: 'pt_MZ',
        siteName: 'ZenyFit',
        images: product.image ? [{ url: product.image, width: 800, height: 800, alt: product.name }] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: product.image ? [product.image] : [],
      },
      alternates: {
        canonical: `/produto/${id}`,
      },
    };
  } catch {
    return { title: 'Produto | ZenyFit' };
  }
}

/* ─── Page ─── */
export default async function ProdutoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let product: Product | null = null;
  try {
    const { data, error } = await supabase.from('Product').select('*').eq('id', id).single();
    if (error || !data) {
      notFound();
    }
    product = data as Product;
  } catch {
    notFound();
  }

  return <ProductPageClient initialProduct={product} />;
}