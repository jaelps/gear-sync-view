import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity } from "lucide-react";
import { toast } from "sonner";

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nome, setNome] = useState("");
  const [role, setRole] = useState<"lider" | "funcionario">("funcionario");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isSignUp) {
      if (!nome.trim()) {
        toast.error("Informe seu nome.");
        setLoading(false);
        return;
      }
      const { error } = await signUp(email, password, nome, role);
      if (error) {
        toast.error(error);
      } else {
        toast.success("Conta criada! Verifique seu e-mail para confirmar.");
        setIsSignUp(false);
      }
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        toast.error(error);
      } else {
        navigate("/");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm glass-card p-8 space-y-6">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/20">
            <Activity className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-xl font-bold text-foreground tracking-wide">Datatec</h1>
          <p className="text-sm text-muted-foreground">
            {isSignUp ? "Criar nova conta" : "Acesse o sistema"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <>
              <div>
                <Label htmlFor="nome">Nome</Label>
                <Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Seu nome completo" />
              </div>
              <div>
                <Label htmlFor="role">Tipo de Acesso</Label>
                <Select value={role} onValueChange={(v) => setRole(v as "lider" | "funcionario")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lider">Líder de Setor</SelectItem>
                    <SelectItem value="funcionario">Funcionário</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
          <div>
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" />
          </div>
          <div>
            <Label htmlFor="password">Senha</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Aguarde..." : isSignUp ? "Cadastrar" : "Entrar"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          {isSignUp ? "Já tem conta?" : "Não tem conta?"}{" "}
          <button onClick={() => setIsSignUp(!isSignUp)} className="text-primary hover:underline">
            {isSignUp ? "Entrar" : "Cadastrar"}
          </button>
        </p>
      </div>
    </div>
  );
}
