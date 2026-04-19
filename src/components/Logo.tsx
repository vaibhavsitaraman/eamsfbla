import React from 'react';

const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <img
        src="/FBLA-Symbol.png"
        alt="FBLA symbol"
        className="h-8 w-auto select-none"
        loading="eager"
        draggable={false}
      />
    </div>
  );
};

export default Logo;
