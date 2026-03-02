'use client';

import { useEffect, useState } from 'react';

export function WithAuth(Component: any) {
  return function ProtectedComponent(props: any) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      setMounted(true);
    }, []);

    if (!mounted) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-slate-600">Loading...</p>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}
