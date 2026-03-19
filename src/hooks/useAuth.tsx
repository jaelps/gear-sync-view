import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

type AppRole = "lider" | "funcionario";

interface ProfileFlags {
  lider_producao: boolean;
  responsavel_estoque: boolean;
  responsavel_limpeza: boolean;
}

interface AuthContext {
  user: User | null;
  session: Session | null;
  role: AppRole | null;
  profileFlags: ProfileFlags;
  loading: boolean;
  isLider: boolean;
  isLiderProducao: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, nome: string, role: AppRole) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const defaultFlags: ProfileFlags = { lider_producao: false, responsavel_estoque: false, responsavel_limpeza: false };

const AuthContext = createContext<AuthContext | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [profileFlags, setProfileFlags] = useState<ProfileFlags>(defaultFlags);
  const [loading, setLoading] = useState(true);

  const fetchRole = async (userId: string) => {
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .maybeSingle();
    setRole((data?.role as AppRole) ?? "funcionario");
  };

  const fetchProfileFlags = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("lider_producao, responsavel_estoque, responsavel_limpeza")
      .eq("user_id", userId)
      .maybeSingle();
    if (data) {
      setProfileFlags({
        lider_producao: data.lider_producao ?? false,
        responsavel_estoque: data.responsavel_estoque ?? false,
        responsavel_limpeza: data.responsavel_limpeza ?? false,
      });
    } else {
      setProfileFlags(defaultFlags);
    }
  };

  const loadUserData = async (userId: string) => {
    await Promise.all([fetchRole(userId), fetchProfileFlags(userId)]);
  };

  const refreshProfile = async () => {
    if (user) await fetchProfileFlags(user.id);
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          await loadUserData(session.user.id);
        } else {
          setRole(null);
          setProfileFlags(defaultFlags);
        }
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        await loadUserData(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  };

  const signUp = async (email: string, password: string, nome: string, role: AppRole) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nome } },
    });
    if (error) return { error: error.message };
    if (data.user) {
      await supabase.from("user_roles").insert({ user_id: data.user.id, role });
    }
    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const isLider = role === "lider";
  const isLiderProducao = profileFlags.lider_producao;

  return (
    <AuthContext.Provider value={{ user, session, role, profileFlags, loading, isLider, isLiderProducao, signIn, signUp, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
