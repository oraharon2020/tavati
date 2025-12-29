import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database
export interface ChatSession {
  id: string;
  phone: string;
  messages: Message[];
  claim_data: Record<string, unknown>;
  current_step: number;
  status: 'in_progress' | 'completed' | 'paid';
  created_at: string;
  updated_at: string;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

// Session functions
export async function createSession(phone: string): Promise<ChatSession | null> {
  const { data, error } = await supabase
    .from('chat_sessions')
    .insert({
      phone,
      messages: [],
      claim_data: {},
      current_step: 1,
      status: 'in_progress'
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating session:', error);
    return null;
  }
  return data;
}

export async function getSessionByPhone(phone: string): Promise<ChatSession | null> {
  const { data, error } = await supabase
    .from('chat_sessions')
    .select('*')
    .eq('phone', phone)
    .eq('status', 'in_progress')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
    console.error('Error getting session:', error);
  }
  return data || null;
}

export async function updateSession(
  sessionId: string, 
  updates: Partial<Pick<ChatSession, 'messages' | 'claim_data' | 'current_step' | 'status'>>
): Promise<boolean> {
  const { error } = await supabase
    .from('chat_sessions')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', sessionId);

  if (error) {
    console.error('Error updating session:', error);
    return false;
  }
  return true;
}

export async function addMessageToSession(
  sessionId: string,
  message: Message
): Promise<boolean> {
  // First get current messages
  const { data: session } = await supabase
    .from('chat_sessions')
    .select('messages')
    .eq('id', sessionId)
    .single();

  if (!session) return false;

  const messages = [...(session.messages || []), message];

  return updateSession(sessionId, { messages });
}

// Phone OTP functions
export async function sendOTP(phone: string): Promise<{ success: boolean; error?: string }> {
  // Format phone for Israel (add +972 if needed)
  const formattedPhone = formatIsraeliPhone(phone);
  
  const { error } = await supabase.auth.signInWithOtp({
    phone: formattedPhone,
  });

  if (error) {
    console.error('Error sending OTP:', error);
    return { success: false, error: error.message };
  }
  return { success: true };
}

export async function verifyOTP(phone: string, token: string): Promise<{ success: boolean; error?: string }> {
  const formattedPhone = formatIsraeliPhone(phone);
  
  const { data, error } = await supabase.auth.verifyOtp({
    phone: formattedPhone,
    token,
    type: 'sms'
  });

  if (error) {
    console.error('Error verifying OTP:', error);
    return { success: false, error: error.message };
  }
  return { success: true };
}

function formatIsraeliPhone(phone: string): string {
  // Remove all non-digits
  const digits = phone.replace(/\D/g, '');
  
  // If starts with 0, replace with +972
  if (digits.startsWith('0')) {
    return '+972' + digits.slice(1);
  }
  // If starts with 972, add +
  if (digits.startsWith('972')) {
    return '+' + digits;
  }
  // If already has +, return as is
  if (phone.startsWith('+')) {
    return phone;
  }
  // Default: assume Israeli number without prefix
  return '+972' + digits;
}
