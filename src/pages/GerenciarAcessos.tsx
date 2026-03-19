import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { UserPlus, Users, Package, Shield, Factory, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface UserProfile {
  user_id: string;
  nome: string;
  responsavel_estoque: boolean;
  lider_producao: boolean;
  responsavel_limpeza: boolean;
  role?: string;
}

export default function GerenciarAcessos() {
  const { session } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", nome: "", role: "funcionario" as "lider" | "funcionario" });

  const fetchUsers = async () => {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, nome, responsavel_estoque, lider_producao, responsavel_limpeza");

    const { data: roles } = await supabase
      .from("user_roles")
      .select("user_id, role");

    if (profiles) {
      const merged = profiles.map((p) => ({
        ...p,
        role: roles?.find((r) => r.user_id === p.user_id)?.role || "funcionario",
      }));
      setUsers(merged);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome.trim() || !form.email.trim() || !form.password.trim()) {
      toast.error("Preencha todos os campos.");
      return;
    }
    if (form.password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setFormLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-user", {
        body: { email: form.email, password: form.password, nome: form.nome, role: form.role },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      toast.success(`Usuário ${form.nome} criado com sucesso!`);
      setForm({ email: "", password: "", nome: "", role: "funcionario" });
      setDialogOpen(false);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message || "Erro ao criar usuário.");
    }
    setFormLoading(false);
  };

  const toggleProfileFlag = async (userId: string, field: "responsavel_estoque" | "lider_producao" | "responsavel_limpeza", current: boolean) => {
    const labels: Record<string, [string, string]> = {
      responsavel_estoque: ["Líder de Estoque concedido.", "Líder de Estoque removido."],
      lider_producao: ["Líder de Produção concedido.", "Líder de Produção removido."],
      responsavel_limpeza: ["Responsável de limpeza atribuído.", "Responsável de limpeza removido."],
    };

    const { error } = await supabase
      .from("profiles")
      .update({ [field]: !current })
      .eq("user_id", userId);

    if (error) {
      toast.error("Erro ao atualizar permissão.");
    } else {
      toast.success(!current ? labels[field][0] : labels[field][1]);
      setUsers((prev) => prev.map((u) => u.user_id === userId ? { ...u, [field]: !current } : u));
    }
  };

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gerenciar Acessos</h1>
          <p className="text-sm text-muted-foreground mt-1">Cadastre usuários e delegue responsabilidades</p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <UserPlus className="w-4 h-4" /> Novo Usuário
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Cadastrar Novo Usuário</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 mt-2">
              <div>
                <Label htmlFor="nome">Nome completo</Label>
                <Input id="nome" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} placeholder="Nome do funcionário" />
              </div>
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="email@empresa.com" />
              </div>
              <div>
                <Label htmlFor="password">Senha inicial</Label>
                <Input id="password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Mínimo 6 caracteres" />
              </div>
              <div>
                <Label>Tipo de Acesso</Label>
                <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v as "lider" | "funcionario" })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="funcionario">Funcionário</SelectItem>
                    <SelectItem value="lider">Gestor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full" disabled={formLoading}>
                {formLoading ? "Criando..." : "Cadastrar Usuário"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card p-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-primary/15">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Total</p>
              <p className="text-2xl font-bold text-foreground">{users.length}</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-accent/15">
              <Shield className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Gestores</p>
              <p className="text-2xl font-bold text-foreground">{users.filter((u) => u.role === "lider").length}</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-success/15">
              <Factory className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Líd. Produção</p>
              <p className="text-2xl font-bold text-foreground">{users.filter((u) => u.lider_producao).length}</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-secondary/30">
              <Package className="w-5 h-5 text-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Líd. Estoque</p>
              <p className="text-2xl font-bold text-foreground">{users.filter((u) => u.responsavel_estoque).length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* User List */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left p-4 text-muted-foreground font-medium">Nome</th>
                <th className="text-left p-4 text-muted-foreground font-medium hidden sm:table-cell">Tipo</th>
                <th className="text-center p-4 text-muted-foreground font-medium">Líd. Produção</th>
                <th className="text-center p-4 text-muted-foreground font-medium">Líd. Estoque</th>
                <th className="text-center p-4 text-muted-foreground font-medium">Limpeza Hoje</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">Carregando...</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">Nenhum usuário encontrado</td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.user_id} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <p className="font-medium text-foreground">{u.nome}</p>
                    </td>
                    <td className="p-4 hidden sm:table-cell">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        u.role === "lider" ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                      }`}>
                        {u.role === "lider" ? "Gestor" : "Funcionário"}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center">
                        <Switch
                          checked={u.lider_producao}
                          onCheckedChange={() => toggleProfileFlag(u.user_id, "lider_producao", u.lider_producao)}
                        />
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center">
                        <Switch
                          checked={u.responsavel_estoque}
                          onCheckedChange={() => toggleProfileFlag(u.user_id, "responsavel_estoque", u.responsavel_estoque)}
                        />
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center">
                        <Switch
                          checked={u.responsavel_limpeza}
                          onCheckedChange={() => toggleProfileFlag(u.user_id, "responsavel_limpeza", u.responsavel_limpeza)}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
