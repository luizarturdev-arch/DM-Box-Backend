import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// --- Configuração ---
const app = express();
app.use(cors()); // Permite que seu frontend acesse o backend
app.use(express.json()); // Permite que o express leia JSON do body

// --- Conexão com Supabase ---
// ATENÇÃO: Guarde isso em variáveis de ambiente (.env) e não direto no código!
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY ; // Pode ser a chave 'anon' (pública)
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- Endpoint de Login ---
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
  }

  try {
    // Aqui acontece a mágica: o backend valida com o Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      // Se o Supabase retornar um erro (ex: senha errada)
      return res.status(401).json({ error: error.message });
    }

    // Login com sucesso!
    // Retorna a sessão (que inclui o access_token) e os dados do usuário
    res.status(200).json({ session: data.session, user: data.user });

  } catch (error) {
    res.status(500).json({ error: 'Erro interno no servidor.' });
  }
});

// --- Iniciar o Servidor ---
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor Node.js rodando na porta ${PORT}`);
});