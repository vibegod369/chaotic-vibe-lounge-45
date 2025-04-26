import { createClient } from '@supabase/supabase-js';
import { toast } from "sonner";

const supabaseUrl = "https://qolbhenjvoxizxdanrdi.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvbGJoZW5qdm94aXp4ZGFucmRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2Mjg0MzksImV4cCI6MjA2MDIwNDQzOX0.SjCA2IhbGsKLuWMrnvT9B5IvFMOCviIo9WEHY9ezN8I";

const supabase = createClient(supabaseUrl, supabaseKey);

// Points per referral
const POINTS_PER_REFERRAL = 10;

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
  total_points: number;
  total_rewards: number;  // now represents VIBE tokens
}

class ReferralService {
  // Generate a referral code based on wallet address
  generateReferralCode(address: string): string {
    return `VIBE-${address.slice(2, 8)}`;
  }
  
  // Create or get a referral entry for a user
  async getOrCreateReferral(walletAddress: string): Promise<string> {
    if (!walletAddress) return '';
    
    try {
      const referralCode = this.generateReferralCode(walletAddress);
      
      // Check if referral code exists
      const { data: existingReferral, error: fetchError } = await supabase
        .from('referrals')
        .select('referral_code')
        .eq('referrer_address', walletAddress)
        .maybeSingle();
      
      if (fetchError) {
        console.error('Error fetching referral:', fetchError);
        toast.error('Failed to fetch referral');
        return '';
      }
      
      if (existingReferral) {
        return existingReferral.referral_code;
      }
      
      // Create new referral entry
      const { error: insertError } = await supabase
        .from('referrals')
        .insert({
          referrer_address: walletAddress,
          referral_code: referralCode,
          status: 'pending'
        });
      
      if (insertError) {
        console.error('Error creating referral:', insertError);
        toast.error('Failed to create referral');
        return '';
      }
      
      return referralCode;
    } catch (error) {
      console.error('Referral service error:', error);
      toast.error('Referral service error');
      return '';
    }
  }
  
  // Process a referral when someone uses a referral link
  async processReferral(referralCode: string, newUserAddress: string): Promise<boolean> {
    if (!referralCode || !newUserAddress) return false;
    
    try {
      // Find the referrer
      const { data: referrerData, error: referrerError } = await supabase
        .from('referrals')
        .select('referrer_address')
        .eq('referral_code', referralCode)
        .maybeSingle();
      
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
      const { error: updateError } = await supabase
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
    } catch (error) {
      console.error('Referral processing error:', error);
      return false;
    }
  }
  
  // Get referral stats for a user
  async getReferralStats(walletAddress: string): Promise<ReferralStats> {
    if (!walletAddress) {
      return { total_points: 0, total_rewards: 0 };
    }
    
    try {
      // Count completed referrals
      const { data: referrals, error } = await supabase
        .from('referrals')
        .select('*')
        .eq('referrer_address', walletAddress)
        .eq('status', 'completed');
      
      if (error) {
        console.error('Error fetching referral stats:', error);
        return { total_points: 0, total_rewards: 0 };
      }
      
      // Calculate points (10 points per referral) and rewards in VIBE
      const totalReferrals = referrals?.length || 0;
      const totalPoints = totalReferrals * POINTS_PER_REFERRAL;
      const totalRewards = totalReferrals * 100; // 100 VIBE tokens per referral
      
      return {
        total_points: totalPoints,
        total_rewards: totalRewards
      };
    } catch (error) {
      console.error('Error getting referral stats:', error);
      return { total_points: 0, total_rewards: 0 };
    }
  }
  
  // Check if user came from a referral link
  checkReferralParam(): string | null {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('ref');
  }
}

export default new ReferralService();
