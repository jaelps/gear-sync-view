import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Check if any leader already exists
    const { data: hasLeader } = await adminClient.rpc("has_any_leader");
    if (hasLeader) {
      throw new Error("Já existe um líder cadastrado no sistema.");
    }

    const { email, password, nome } = await req.json();

    if (!email || !password || !nome) {
      throw new Error("Preencha todos os campos.");
    }
    if (password.length < 6) {
      throw new Error("A senha deve ter pelo menos 6 caracteres.");
    }

    // Create the first leader
    const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { nome },
    });

    if (createError) throw createError;

    // Assign leader role
    await adminClient
      .from("user_roles")
      .insert({ user_id: newUser.user.id, role: "lider" });

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
