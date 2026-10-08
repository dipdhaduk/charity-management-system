export const StatCard = ({
  icon: Icon,
  title,
  value,
  subtitle,
}) => {
  return (
    <div className="bg-surface rounded-card border border-line p-5 sm:p-6 shadow-card flex flex-col justify-between">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted">{title}</p>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">{value}</h3>
        </div>
        {Icon && (
          <div className="w-10 h-10 rounded-full bg-soft text-brand flex items-center justify-center flex-shrink-0">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      {subtitle && <p className="text-xs text-muted mt-3 pt-3 border-t border-line">{subtitle}</p>}
    </div>
  );
};

export default StatCard;
