import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Activity, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

type Mode = "login" | "forgot" | "setup";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<Mode>("login");
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [checkingLeader, setCheckingLeader] = useState(true);
  const [hasLeader, setHasLeader] = useState(true);

  // Setup form
  const [setupNome, setSetupNome] = useState("");
  const [setupEmail, setSetupEmail] = useState("");
  const [setupPassword, setSetupPassword] = useState("");
  const [setupLoading, setSetupLoading] = useState(false);

  const { signIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    supabase.rpc("has_any_leader").then(({ data }) => {
      const exists = !!data;
      setHasLeader(exists);
      if (!exists) setMode("setup");
      setCheckingLeader(false);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email, password);
    if (error) {
      toast.error(error);
    } else {
      navigate("/");
    }
    setLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      toast.error("Informe seu e-mail.");
      return;
    }
    setForgotLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("E-mail de recuperação enviado! Verifique sua caixa de entrada.");
      setMode("login");
    }
    setForgotLoading(false);
  };

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!setupNome.trim() || !setupEmail.trim() || !setupPassword.trim()) {
      toast.error("Preencha todos os campos.");
      return;
    }
    if (setupPassword.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    setSetupLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("setup-first-leader", {
        body: { email: setupEmail, password: setupPassword, nome: setupNome },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      toast.success("Gestor cadastrado com sucesso! Faça login.");
      setHasLeader(true);
      setMode("login");
      setEmail(setupEmail);
    } catch (err: any) {
      toast.error(err.message || "Erro ao cadastrar líder.");
    }
    setSetupLoading(false);
  };

  if (checkingLeader) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm glass-card p-8 space-y-6">
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/20">
            {mode === "setup" ? (
              <ShieldCheck className="w-7 h-7 text-primary" />
            ) : (
              <Activity className="w-7 h-7 text-primary" />
            )}
          </div>
          <h1 className="text-xl font-bold text-foreground tracking-wide">Datatec</h1>
          <p className="text-sm text-muted-foreground">
            {mode === "setup"
              ? "Configuração inicial — Cadastre o primeiro líder"
              : mode === "forgot"
              ? "Recuperar acesso"
              : "Acesse o sistema"}
          </p>
        </div>

        {mode === "setup" && (
          <form onSubmit={handleSetup} className="space-y-4">
            <div>
              <Label htmlFor="setup-nome">Nome completo</Label>
              <Input id="setup-nome" value={setupNome} onChange={(e) => setSetupNome(e.target.value)} placeholder="Seu nome" />
            </div>
            <div>
              <Label htmlFor="setup-email">E-mail</Label>
              <Input id="setup-email" type="email" value={setupEmail} onChange={(e) => setSetupEmail(e.target.value)} placeholder="seu@email.com" />
            </div>
            <div>
              <Label htmlFor="setup-password">Senha</Label>
              <Input id="setup-password" type="password" value={setupPassword} onChange={(e) => setSetupPassword(e.target.value)} placeholder="Mínimo 6 caracteres" />
            </div>
            <Button type="submit" className="w-full" disabled={setupLoading}>
              {setupLoading ? "Cadastrando..." : "Cadastrar Líder"}
            </Button>
          </form>
        )}

        {mode === "forgot" && (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div>
              <Label htmlFor="forgot-email">E-mail cadastrado</Label>
              <Input id="forgot-email" type="email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} placeholder="seu@email.com" />
            </div>
            <Button type="submit" className="w-full" disabled={forgotLoading}>
              {forgotLoading ? "Enviando..." : "Enviar link de recuperação"}
            </Button>
            <button type="button" onClick={() => setMode("login")} className="w-full text-sm text-primary hover:underline">
              Voltar ao login
            </button>
          </form>
        )}

        {mode === "login" && (
          <>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" />
              </div>
              <div>
                <Label htmlFor="password">Senha</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Aguarde..." : "Entrar"}
              </Button>
            </form>
            <button type="button" onClick={() => setMode("forgot")} className="w-full text-sm text-muted-foreground hover:text-primary transition-colors">
              Esqueci minha senha
            </button>
          </>
        )}

        <p className="text-center text-xs text-muted-foreground">
          {mode === "setup"
            ? "Este cadastro está disponível apenas porque ainda não há um líder no sistema."
            : "Acesso fornecido pelo líder do setor."}
        </p>
      </div>
    </div>
  );
}
