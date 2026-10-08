export const Loader = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4" role="status" aria-live="polite">
      <div className="w-10 h-10 border-3 border-line border-t-brand rounded-full animate-spin" />
      <p className="mt-3 text-sm text-muted font-medium">{message}</p>
    </div>
  );
};

export default Loader;
