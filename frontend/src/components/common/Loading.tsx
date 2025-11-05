export const Loading = ({ fullScreen = false }: { fullScreen?: boolean }) => {
  const containerClass = fullScreen
    ? 'fixed inset-0 flex items-center justify-center bg-gradient-to-br from-primary-50 to-accent-50 bg-opacity-95 z-50 backdrop-blur-sm'
    : 'flex items-center justify-center py-12';

  return (
    <div className={containerClass}>
      <div className="flex flex-col items-center">
        <div className="relative">
          {/* Outer spinning ring */}
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
          {/* Inner pulsing dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 bg-gradient-to-br from-accent-500 to-accent-600 rounded-full animate-pulse"></div>
          </div>
        </div>
        <p className="mt-6 text-gradient font-semibold text-lg">Chargement...</p>
      </div>
    </div>
  );
};
