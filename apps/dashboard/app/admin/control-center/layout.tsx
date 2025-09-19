import React from 'react';
// import { Toaster } from 'sonner';
const Toaster = ({ position, richColors }: { position?: string; richColors?: boolean }) => null;

const ControlCenterLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Toaster position="top-right" richColors />
      <div className="container mx-auto py-6 px-4">
        {children}
      </div>
    </div>
  );
};

export default ControlCenterLayout;
