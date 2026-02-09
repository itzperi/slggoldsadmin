import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables for client.');
}

// Standard client for client-side operations (uses Anon Key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth helpers
export async function signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    return { data, error };
}

export async function signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
}

export async function getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    return { session, error };
}

export async function getUserRole(userId: string) {
    const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

    return { role: data?.role, error };
}

export async function getStaffType(userId: string) {
    const { data, error } = await supabase
        .from('staff_metadata')
        .select('staff_type')
        .eq('user_id', userId)
        .single();

    return { staffType: data?.staff_type, error };
}

export async function redirectAfterLogin(userId: string): Promise<string> {
    // Get user role
    const { role, error: roleError } = await getUserRole(userId);

    if (roleError || !role) {
        throw new Error('Failed to fetch user role');
    }

    // Admin redirect
    if (role === 'admin') {
        return '/admin/dashboard';
    }

    // Staff redirect
    if (role === 'staff') {
        const { staffType, error: staffError } = await getStaffType(userId);

        if (staffError || !staffType) {
            throw new Error('Failed to fetch staff type');
        }

        if (staffType === 'office') {
            return '/office/dashboard';
        }

        if (staffType === 'collection') {
            throw new Error('Collection staff cannot access website. Please use mobile app.');
        }
    }

    // Customer redirect
    if (role === 'customer') {
        throw new Error('Customers cannot access website. Please use mobile app.');
    }

    throw new Error('Invalid user role');
}
