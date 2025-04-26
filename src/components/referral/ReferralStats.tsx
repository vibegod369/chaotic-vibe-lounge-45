
import { ReferralStats as ReferralStatsType } from '@/services/referral';

interface ReferralStatsProps {
  stats: ReferralStatsType;
}

const ReferralStats = ({ stats }: ReferralStatsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4 text-center">
      <div className="p-3 border border-vibe-blue/30 rounded-lg">
        <div className="text-vibe-blue text-2xl font-bold">{stats?.total_points || 0}</div>
        <div className="text-xs text-gray-400">Points</div>
      </div>
      <div className="p-3 border border-vibe-pink/30 rounded-lg">
        <div className="text-vibe-pink text-2xl font-bold">{stats?.total_rewards.toFixed(2) || "0.00"} VIBE</div>
        <div className="text-xs text-gray-400">Earned Rewards</div>
      </div>
    </div>
  );
};

export default ReferralStats;
