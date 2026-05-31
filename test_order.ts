import { createClient } from '@supabase/supabase-js';

const url = process.env.VITE_SUPABASE_URL || 'https://egyaqyhggxopfvpucbpn.supabase.co';
const key = process.env.VITE_SUPABASE_KEY || 'sb_publishable_LEbWJNUGkn3nB4hh3q3wYQ_vrYJUUPl';

const supabase = createClient(url, key);

async function testOrder() {
  console.warn('Sending test order...');

  const { data, error } = await supabase.from('orders').insert({
    customer_name: 'Antigravity Test',
    customer_email: 'nxrscripts@gmail.com', // Using your email to ensure you get it
    customer_phone: '900000000',
    product_name: 'Servidor Teste NXRSCRIPTS',
    product_price: 1500000,
    quantity: 1,
    source: 'form',
    message: 'Isto é uma compra de teste para verificar a integração do Webhook com a Resend API.',
    status: 'new',
  });

  if (error) {
    console.error('Error inserting order:', error);
  } else {
    console.warn('Order inserted successfully!', data);
    console.warn('Webhook should have triggered the Edge Function.');
  }
}

testOrder();
