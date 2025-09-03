import React from 'react';

const ControlCenterLayout = ({ children }) => {
  return (
    <div className="control-center-layout">
      <header>Control Center Header</header>
      <aside>Left Rail</aside>
      <main>{children}</main>
    </div>
  );
};

export default ControlCenterLayout;
