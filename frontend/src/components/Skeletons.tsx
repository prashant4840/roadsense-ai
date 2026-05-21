"use client";

export function FormSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {[...Array(5)].map((_, i) => (
        <div key={`skeleton-${i}`} className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
      <div className="flex gap-4">
        <div className="flex-1 h-12 bg-blue-300 rounded-lg"></div>
        <div className="w-24 h-12 bg-gray-300 rounded-lg"></div>
      </div>
    </div>
  );
}

export function RiskDisplaySkeleton() {
  return (
    <div className="p-8 rounded-lg shadow-lg bg-white animate-pulse">
      <div className="flex items-center gap-6 mb-8">
        <div className="text-7xl text-gray-200">⏳</div>
        <div className="flex-1">
          <div className="h-10 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mt-2"></div>
        </div>
      </div>
      <div className="h-3 bg-gray-200 rounded-full mb-8"></div>
      <div className="grid grid-cols-2 gap-4">
        <div className="h-20 bg-gray-200 rounded"></div>
        <div className="h-20 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
      <div className="h-64 bg-gray-200 rounded"></div>
    </div>
  );
}
