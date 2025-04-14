
import { createClient } from '@supabase/supabase-js';
import { toast } from "sonner";

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Type definitions for our referral data
export interface Referral {
  id?: string;
  referrer_address: string;
  referred_address: string | null;
  referral_code: string;
  status: 'pending' | 'completed';
  created_at?: string;
  reward_claimed?: boolean;
}

export interface ReferralStats {
  total_referrals: number;
  total_rewards: number;
}

class ReferralService {
  private supabase = createClient(supabaseUrl, supabaseKey);
  
  // Generate a referral code based on wallet address
  generateReferralCode(address: string): string {
    return `VIBE-${address.slice(2, 8)}`;
  }
  
  // Create or get a referral entry for a user
  async getOrCreateReferral(walletAddress: string): Promise<string> {
    if (!walletAddress) return '';
    
    const referralCode = this.generateReferralCode(walletAddress);
    
    // Check if referral code exists
    const { data: existingReferral } = await this.supabase
      .from('referrals')
      .select('referral_code')
      .eq('referrer_address', walletAddress)
      .single();
    
    if (existingReferral) {
      return existingReferral.referral_code;
    }
    
    // Create new referral entry
    const { error } = await this.supabase
      .from('referrals')
      .insert({
        referrer_address: walletAddress,
        referral_code: referralCode,
        status: 'pending'
      });
    
    if (error) {
      console.error('Error creating referral:', error);
      toast.error('Failed to create referral');
      return '';
    }
    
    return referralCode;
  }
  
  // Process a referral when someone uses a referral link
  async processReferral(referralCode: string, newUserAddress: string): Promise<boolean> {
    if (!referralCode || !newUserAddress) return false;
    
    // Find the referrer
    const { data: referrerData, error: referrerError } = await this.supabase
      .from('referrals')
      .select('referrer_address')
      .eq('referral_code', referralCode)
      .single();
    
    if (referrerError || !referrerData) {
      console.error('Invalid referral code:', referrerError);
      return false;
    }
    
    // Don't allow self-referrals
    if (referrerData.referrer_address === newUserAddress) {
      toast.error('You cannot refer yourself');
      return false;
    }
    
    // Update the referral with the new user
    const { error: updateError } = await this.supabase
      .from('referrals')
      .insert({
        referrer_address: referrerData.referrer_address,
        referred_address: newUserAddress,
        referral_code: referralCode,
        status: 'completed'
      });
    
    if (updateError) {
      console.error('Error processing referral:', updateError);
      return false;
    }
    
    return true;
  }
  
  // Get referral stats for a user
  async getReferralStats(walletAddress: string): Promise<ReferralStats> {
    if (!walletAddress) {
      return { total_referrals: 0, total_rewards: 0 };
    }
    
    // Count completed referrals
    const { data: referrals, error } = await this.supabase
      .from('referrals')
      .select('*')
      .eq('referrer_address', walletAddress)
      .eq('status', 'completed');
    
    if (error) {
      console.error('Error fetching referral stats:', error);
      return { total_referrals: 0, total_rewards: 0 };
    }
    
    // Calculate rewards (5% of referred contributions, placeholder logic)
    const totalReferrals = referrals?.length || 0;
    const totalRewards = totalReferrals * 0.05; // Placeholder - would be calculated based on actual contributions
    
    return {
      total_referrals: totalReferrals,
      total_rewards: totalRewards
    };
  }
  
  // Check if user came from a referral link
  checkReferralParam(): string | null {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('ref');
  }
}

export default new ReferralService();
