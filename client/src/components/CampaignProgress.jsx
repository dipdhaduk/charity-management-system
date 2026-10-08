export const CampaignProgress = ({
  raisedAmount = 0,
  goalAmount = 1,
  variant = 'default', // 'default' | 'featured'
  showLabels = true,
}) => {
  const safeGoal = Math.max(1, Number(goalAmount) || 1);
  const safeRaised = Math.max(0, Number(raisedAmount) || 0);
  const percentage = Math.min(100, Math.round((safeRaised / safeGoal) * 100));

  const isFeatured = variant === 'featured';

  return (
    <div className="w-full space-y-1.5">
      <div
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${percentage}% of goal raised`}
        className={`w-full h-2 rounded-full overflow-hidden ${
          isFeatured ? 'bg-white/20' : 'bg-line dark:bg-line/40'
        }`}
      >
        <div
          className={`h-full rounded-full transition-all duration-300 ease-out ${
            isFeatured ? 'bg-accent' : 'bg-brand'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {showLabels && (
        <div
          className={`flex items-center justify-between text-xs ${
            isFeatured ? 'text-white/80' : 'text-muted'
          }`}
        >
          <span className={`font-semibold ${isFeatured ? 'text-accent' : 'text-brand'}`}>
            {percentage}% funded
          </span>
          <span>Goal ₹{safeGoal.toLocaleString('en-IN')}</span>
        </div>
      )}
    </div>
  );
};

export default CampaignProgress;
