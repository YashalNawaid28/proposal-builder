import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user } = body;

    if (!user || !user.id) {
      return NextResponse.json(
        { error: 'User data is required' },
        { status: 400 }
      );
    }

    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching user:', fetchError);
      return NextResponse.json(
        { error: 'Failed to check user existence' },
        { status: 500 }
      );
    }

    if (existingUser) {
      // User exists, update last_active_at
      const { error: updateError } = await supabase
        .from('users')
        .update({ 
          last_active_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (updateError) {
        console.error('Error updating user:', updateError);
        return NextResponse.json(
          { error: 'Failed to update user' },
          { status: 500 }
        );
      }

      return NextResponse.json({ 
        message: 'User updated successfully',
        user: existingUser 
      });
    } else {
      // User doesn't exist, create new user
      const newUser = {
        id: user.id, // Using user.id as the primary key
        display_name: user.name || user.displayName || 'Unknown User',
        email: user.email || null,
        avatar_url: user.imageUrl || user.avatar || null,
        last_active_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      

      const { data: createdUser, error: insertError } = await supabase
        .from('users')
        .insert(newUser)
        .select()
        .single();

      if (insertError) {
        console.error('Error creating user:', insertError);
        return NextResponse.json(
          { error: 'Failed to create user' },
          { status: 500 }
        );
      }

      return NextResponse.json({ 
        message: 'User created successfully',
        user: createdUser 
      });
    }
  } catch (error) {
    console.error('Error in sync-user API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 