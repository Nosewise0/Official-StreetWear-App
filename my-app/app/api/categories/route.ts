import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '../../lib/supabaseServer';

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from('products')
      .select('category')
      .order('category');

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    // Extract unique categories and prepend "All"
    const unique = Array.from(new Set((data ?? []).map((r: { category: string }) => r.category)));
    const categories = ['All', ...unique];

    return NextResponse.json({ success: true, data: categories });
  } catch {
    return NextResponse.json({ success: false, message: 'Internal server error.' }, { status: 500 });
  }
}
