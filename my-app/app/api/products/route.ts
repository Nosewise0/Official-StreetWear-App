import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '../../lib/supabaseServer';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const search = searchParams.get('search');

    const supabase = await createSupabaseServerClient();
    let query = supabase.from('products').select('*');

    if (category && category !== 'All') {
      query = query.ilike('category', category);
    }
    if (minPrice) {
      query = query.gte('price', Number(minPrice));
    }
    if (maxPrice) {
      query = query.lte('price', Number(maxPrice));
    }
    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    const { data, error } = await query.order('id');

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, count: data.length, data });
  } catch {
    return NextResponse.json({ success: false, message: 'Internal server error.' }, { status: 500 });
  }
}
