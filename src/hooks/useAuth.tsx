import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

type AdminSession = {
  id: string;
  username: string;
  role: 'admin';
};

type AuthContextType = {
  session: Session | null;
  user: User | null;
  adminSession: AdminSession | null;
  signIn: (data: { email: string; password: string; token?: string; factorId?: string }) => Promise<any>;
  signUp: (data: { email: string; password: string; options?: any }) => Promise<any>;
  signOut: () => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  signInWithPhone: (phone: string) => Promise<any>;
  verifyOtp: (phone: string, token: string) => Promise<any>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [adminSession, setAdminSession] = useState<AdminSession | null>(null);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    // Check admin session
    const storedAdminSession = localStorage.getItem('adminSession');
    if (storedAdminSession) {
      try {
        setAdminSession(JSON.parse(storedAdminSession));
      } catch (error) {
        console.error('Error parsing admin session:', error);
        localStorage.removeItem('adminSession');
      }
    }

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async ({ 
    email, 
    password, 
    token, 
    factorId 
  }: { 
    email: string; 
    password: string; 
    token?: string; 
    factorId?: string 
  }) => {
    // If we have a token and factorId, we're in the MFA verification step
    if (token && factorId) {
      try {
        return await supabase.auth.mfa.challengeAndVerify({
          factorId: factorId,
          code: token
        });
      } catch (error) {
        console.error('MFA verification error:', error);
        return { error };
      }
    }
    
    // First step: Sign in with email and password
    const response = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    // If MFA token was provided and there was an MFA error in the first attempt, try the second step
    if (token && response.error?.message?.includes('mfa')) {
      try {
        // Get the factorId from the error response if not provided
        const extractedFactorId = factorId || (
          (response.error?.message && response.error.message.match(/factor_id=([^&]+)/)?.[1]) || ''
        );
        
        if (extractedFactorId) {
          // Use the factorId to verify the MFA token
          return await supabase.auth.mfa.challengeAndVerify({
            factorId: extractedFactorId,
            code: token
          });
        }
      } catch (error) {
        console.error('MFA verification error:', error);
      }
    }
    
    return response;
  };

  const signUp = async ({ email, password, options }: { email: string; password: string; options?: any }) => {
    return await supabase.auth.signUp({
      email,
      password,
      options,
    });
  };

  const signOut = async () => {
    // Clear admin session
    localStorage.removeItem('adminSession');
    setAdminSession(null);
    
    // Sign out from Supabase
    return await supabase.auth.signOut();
  };

  const signInWithGoogle = async () => {
    return await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
  };

  const signInWithPhone = async (phone: string) => {
    return await supabase.auth.signInWithOtp({
      phone: phone
    });
  };

  const verifyOtp = async (phone: string, token: string) => {
    return await supabase.auth.verifyOtp({
      phone: phone,
      token: token,
      type: 'sms'
    });
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        adminSession,
        signIn,
        signUp,
        signOut,
        signInWithGoogle,
        signInWithPhone,
        verifyOtp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
