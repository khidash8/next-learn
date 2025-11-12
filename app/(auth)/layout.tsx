import React from 'react';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen items-center justify-center bg-[url('/images/auth_bg.png')] bg-cover bg-center text-white">
      <div className="m-2 flex min-h-[500px] w-full max-w-3xl rounded-lg bg-gradient-to-br from-[#1C3141] to-[#487EA7]">
        {/* Left */}
        <div className="hidden flex-1 bg-[url('/images/auth_left.png')] bg-cover bg-center md:block" />
        {/* Right */}
        <div className="m-3 flex-1">{children}</div>
      </div>
    </div>
  );
};
export default AuthLayout;
