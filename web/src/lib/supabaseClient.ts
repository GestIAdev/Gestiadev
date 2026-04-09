import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ============================================================
// TIPOS DE BASE DE DATOS
// ============================================================
export interface DbCategory {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  sort_order: number;
  created_at: string;
}

export interface DbProfile {
  id: string;
  username: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface DbThread {
  id: string;
  author_id: string;
  title: string;
  content: string;
  is_pinned: boolean;
  created_at: string;
  // Relaciones via JOIN
  author: { username: string; avatar_url: string | null } | null;
  category: { name: string; slug: string } | null;
  // Contador calculado via Supabase (requires DB view or RPC)
  reply_count: number;
}

export interface DbReply {
  id: string;
  author_id: string;
  content: string;
  created_at: string;
  author: { username: string; avatar_url: string | null } | null;
}

// ============================================================
// QUERIES — WAVE 2506
// ============================================================

export async function fetchCategories(): Promise<DbCategory[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function fetchThreads(categorySlug?: string): Promise<DbThread[]> {
  // El join usa el nombre FK definido en el schema
  let query = supabase
    .from('threads')
    .select(`
      id,
      author_id,
      title,
      content,
      is_pinned,
      created_at,
      author:profiles!author_id ( username, avatar_url ),
      category:categories!category_id ( name, slug ),
      reply_count:replies ( count )
    `)
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(50);

  if (categorySlug) {
    // Filtramos via subquery en la tabla relacionada
    const { data: cat } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', categorySlug)
      .single();
    if (cat) query = query.eq('category_id', cat.id);
  }

  const { data, error } = await query;
  if (error) throw error;

  // Normalizar el count que Supabase devuelve como array [{count: N}]
  return (data ?? []).map((row: any) => ({
    ...row,
    author: Array.isArray(row.author) ? row.author[0] : row.author,
    reply_count: Array.isArray(row.reply_count) ? (row.reply_count[0]?.count ?? 0) : (row.reply_count ?? 0),
  }));
}

export async function insertThread(payload: {
  category_id: string;
  author_id: string;
  title: string;
  content: string;
}): Promise<void> {
  const { error } = await supabase.from('threads').insert(payload);
  if (error) throw error;
}

export async function fetchReplies(threadId: string): Promise<DbReply[]> {
  const { data, error } = await supabase
    .from('replies')
    .select(`
      id,
      author_id,
      content,
      created_at,
      author:profiles!author_id ( username, avatar_url )
    `)
    .eq('thread_id', threadId)
    .order('created_at', { ascending: true });
  if (error) throw error;
    if (error) throw error;
  
    // Mapeamos los datos: si Supabase devuelve el autor como array, cogemos el primero [0].
    // Si lo devuelve como objeto, lo dejamos tal cual. Luego silenciamos a TS.
    return (data ?? []).map((row: any) => ({
      ...row,
      author: Array.isArray(row.author) ? row.author[0] : row.author
    })) as unknown as DbReply[];
}

export async function insertReply(payload: {
  thread_id: string;
  author_id: string;
  content: string;
}): Promise<void> {
  const { error } = await supabase.from('replies').insert(payload);
  if (error) throw error;
}

// ============================================================
// PROFILES — WAVE 2530
// ============================================================

export async function fetchProfile(userId: string): Promise<DbProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, avatar_url, created_at')
    .eq('id', userId)
    .single();
  if (error) return null;
  return data;
}

export async function updateProfile(
  userId: string,
  updates: { username?: string; avatar_url?: string }
): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);
  if (error) throw error;
}
