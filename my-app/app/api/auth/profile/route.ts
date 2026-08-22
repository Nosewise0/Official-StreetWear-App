import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '../../../lib/supabaseServer';

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();

    // Ensure user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ success: false, message: 'Not authenticated.' }, { status: 401 });
    }

    const { fullName } = await request.json();
    if (!fullName) {
      return NextResponse.json({ success: false, message: 'Full name is required.' }, { status: 400 });
    }

    const { data, error } = await supabase.auth.updateUser({
      data: { full_name: fullName },
    });

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
        created_at: data.user.created_at,
        user_metadata: data.user.user_metadata,
      },
    });
  } catch {
    return NextResponse.json({ success: false, message: 'Internal server error.' }, { status: 500 });
  }
}
