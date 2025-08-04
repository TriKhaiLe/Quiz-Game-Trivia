// UNCOMMENT THIS ENTIRE FILE TO USE

import { createClient, type AuthChangeEvent, type Session } from '@supabase/supabase-js';

// Make sure to set these in your environment variables (.env file)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL!;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY!;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error("Supabase URL and Anon Key must be provided in environment variables.");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const supabaseAuthService = {
    async login(email: any, password: any) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw new Error(error.message);
        if (!data.session) throw new Error("Login successful but no session returned.");
        return { session: data.session };
    },

    async signup(email: any, password: any) {
        const { data, error } = await supabase.auth.signUp({ 
            email, 
            password,
        });
        if (error) throw new Error(error.message);
        // NOTE: Supabase returns a user object on signup, but session is often null until verification.
        // The session is returned here for immediate profile creation if email verification is off.
        if (!data.session) {
             console.warn("Signup successful, but session is null. Email verification might be required.");
        }
        return { session: data.session };
    },

    async loginWithGoogle() {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                // You may need to configure this in your Supabase project settings
                redirectTo: window.location.origin,
            },
        });
        if (error) throw new Error(error.message);
    },

    async logout() {
        const { error } = await supabase.auth.signOut();
        if (error) throw new Error(error.message);
    },

    async getCurrentSession(): Promise<Session | null> {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
            console.error("Error getting session:", error.message);
            return null;
        }
        return data.session;
    },

    async getToken(): Promise<string | null> {
        const session = await this.getCurrentSession();
        return session?.access_token || null;
    },

    onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void | Promise<void>) {
        return supabase.auth.onAuthStateChange(callback);
    }
};

