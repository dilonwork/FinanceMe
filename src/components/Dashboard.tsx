import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard-page">
      <h2>Dashboard</h2>
      <p>這裡將顯示各模塊總金額加總及圖表。</p>
      {/* Chart will go here */}
      {/* Total assets and debt summary will go here */}
    </div>
  );
};

export default Dashboard;