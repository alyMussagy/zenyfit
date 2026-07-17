const { createClient } = require('@supabase/supabase-js');
const url = 'https://ldipatlofnuzeglzuexj.supabase.co';
const key = 'sb_publishable_Bq-7EE25uerGomhNFI1a7w__7VdU22Y';
const supabase = createClient(url, key);

(async () => {
  try {
    // Test 1: Products
    const { data: products, error: e1, count: pCount } = await supabase.from('Product').select('*', { count: 'exact' });
    console.log('=== PRODUTOS ===');
    console.log('Total:', pCount);
    if (e1) console.log('Erro:', e1.message);
    else if (products && products.length > 0) {
      products.slice(0, 3).forEach(p => console.log(' -', p.name, '|', p.price, 'MTn |', p.inStock ? 'Em stock' : 'Esgotado'));
      if (pCount > 3) console.log(' ... e mais ' + (pCount - 3) + ' produto(s)');
    } else {
      console.log(' Nenhum produto encontrado');
    }

    // Test 2: Orders
    const { data: orders, error: e2, count: oCount } = await supabase.from('Order').select('*', { count: 'exact' });
    console.log('\n=== ENCOMENDAS ===');
    console.log('Total:', oCount);
    if (e2) console.log('Erro:', e2.message);
    else console.log(orders && orders.length > 0 ? orders.length + ' encomenda(s) registada(s)' : 'Nenhuma encomenda');

    // Test 3: Admins
    const { data: admins, error: e3, count: aCount } = await supabase.from('Admin').select('*', { count: 'exact' });
    console.log('\n=== ADMINS ===');
    console.log('Total:', aCount);
    if (e3) console.log('Erro:', e3.message);
    else if (admins) admins.forEach(a => console.log(' -', a.email, '| role:', a.role));

    // Test 4: OrderItems
    const { count: oiCount, error: e4 } = await supabase.from('OrderItem').select('*', { count: 'exact', head: true });
    console.log('\n=== ORDER ITEMS ===');
    console.log('Total:', oiCount);
    if (e4) console.log('Erro:', e4.message);

    console.log('\n✅ Conexão Supabase: OK');
  } catch (err) {
    console.log('❌ Erro de conexão:', err.message);
  }
})();