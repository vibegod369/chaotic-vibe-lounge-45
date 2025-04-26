
import { AlertCircleIcon } from 'lucide-react';

const ReferralServiceError = () => {
  return (
    <div className="p-6 border border-orange-500/50 rounded-lg bg-orange-500/10">
      <div className="flex items-center gap-2 text-orange-400 mb-4">
        <AlertCircleIcon className="h-5 w-5" />
        <h3 className="font-medium">Referral Service Unavailable</h3>
      </div>
      <p className="text-gray-400 text-sm mb-4">
        The referral service is currently unavailable. This may be due to missing configuration or connection issues.
      </p>
      <p className="text-gray-400 text-sm">
        Please make sure the Supabase environment variables are correctly set up and try again later.
      </p>
    </div>
  );
};

export default ReferralServiceError;
