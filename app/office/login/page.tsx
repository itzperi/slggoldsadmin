'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function OfficeLogin() {
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
            // MAP 'Office' -> 'Office@slggolds.com'
            let finalEmail = email;
            if (email.toLowerCase() === 'office') {
                finalEmail = 'Office@slggolds.com';
            }

            // PER PRODUCTION REQUIREMENT: Office@slggolds.com / 1234@
            const { data, error: loginError } = await supabase.auth.signInWithPassword({
                email: finalEmail,
                password: password
            });

            if (loginError) throw loginError;

            // Role Check
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', data.user.id)
                .single();

            // Allow office_staff OR staff (for legacy compatibility if configured that way)
            if (!profile || (profile.role !== 'office_staff' && profile.role !== 'staff')) {
                await supabase.auth.signOut();
                throw new Error(`Access denied. Role: ${profile?.role}`);
            }

            router.push('/office/dashboard');
        } catch (err: any) {
            setError(err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main style={{
            minHeight: '100vh',
            background: 'radial-gradient(circle at center, #1a0f3e 0%, #0a051a 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
            <div className="glass" style={{ padding: '40px', borderRadius: '24px', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
                <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>🏢 Office Staff Login</h2>
                <p style={{ color: 'var(--secondary)', marginBottom: '32px', fontSize: '0.9rem' }}>Nagercoil Branch Operations</p>

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '0.8rem', color: 'var(--secondary)' }}>Username or Email</label>
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Enter 'Office'"
                            className="glass"
                            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--card-border)', padding: '12px', borderRadius: '8px', color: '#fff' }}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '0.8rem', color: 'var(--secondary)' }}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Enter password"
                            className="glass"
                            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--card-border)', padding: '12px', borderRadius: '8px', color: '#fff' }}
                        />
                    </div>

                    {error && <div style={{ color: 'var(--error)', fontSize: '0.8rem', textAlign: 'center' }}>{error}</div>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary"
                        style={{ width: '100%', padding: '16px', background: 'var(--primary)', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                        {loading ? 'AUTHENTICATING...' : 'LOGIN TO OFFICE DASHBOARD'}
                    </button>
                </form>

                <button
                    onClick={() => router.push('/')}
                    style={{ background: 'none', border: 'none', color: 'var(--secondary)', marginTop: '24px', cursor: 'pointer', fontSize: '0.8rem' }}
                >
                    ← Return to Landing Page
                </button>
            </div>
        </main>
    );
}
