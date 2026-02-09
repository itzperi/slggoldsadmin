'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // MAP 'Admin' -> 'admin@slggolds.com'
            let finalEmail = email;
            if (email.toLowerCase() === 'admin') {
                finalEmail = 'admin@slggolds.com';
            }

            const { data, error: signInError } = await supabase.auth.signInWithPassword({
                email: finalEmail,
                password,
            });

            if (signInError) throw signInError;

            // Role Check
            // We use safe check because RLS might block reading 'profiles' directly for others
            // But Admin should read own profile.
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', data.user.id)
                .single();

            if (!profile || profile.role !== 'admin') {
                await supabase.auth.signOut();
                throw new Error('Access denied. Admin role required.');
            }

            router.push('/admin/dashboard'); // Use explicit path if possible, or just /admin
        } catch (err: any) {
            setError(err.message || 'Failed to sign in');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            background: 'radial-gradient(circle at center, #1a0f3e 0%, #0a051a 100%)'
        }}>
            <div className="glass animate-fade-in" style={{ padding: '40px', width: '100%', maxWidth: '400px' }}>
                <button onClick={() => router.push('/')} style={{ background: 'none', border: 'none', color: 'var(--secondary)', cursor: 'pointer', marginBottom: '20px' }}>← Back</button>
                <h1 className="gold-gradient" style={{ textAlign: 'center', fontSize: '1.8rem', marginBottom: '8px' }}>
                    Admin Login
                </h1>
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '0.8rem', color: 'var(--secondary)' }}>Username or Email</label>
                        <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} required className="glass" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--card-border)', padding: '12px', borderRadius: '8px', color: '#fff' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '0.8rem', color: 'var(--secondary)' }}>Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="glass" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--card-border)', padding: '12px', borderRadius: '8px', color: '#fff' }} />
                    </div>
                    {error && <div style={{ color: 'var(--error)', fontSize: '0.8rem', textAlign: 'center' }}>{error}</div>}
                    <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Checking...' : 'Sign In'}</button>
                </form>
            </div>
        </main>
    );
}
