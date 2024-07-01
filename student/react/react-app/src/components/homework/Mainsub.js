import React, { useState, useEffect } from 'react';
import './mainsub.css';
import Pending from './Pending';
import Submitted from './Submitted';
import Evaluated from './Evaluated';
import { Outlet } from 'react-router-dom';

function Mainsub() {
  const [subjectId, setSubjectId] = useState(null);
  const [activeTab, setActiveTab] = useState('Pending');
  const [totalHomework, setTotalHomework] = useState([]);
  const [pendingHomework, setPendingHomework] = useState([]);
  const [approvedHomework, setApprovedHomework] = useState([]);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [selectedBox, setSelectedBox] = useState('Pending');

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    setSelectedBox(tabName);
  };

  useEffect(() => {
    const totalPending = pendingHomework.length;
    const totalApproved = approvedHomework.length;
    const total = totalPending + totalApproved;
    setTotalHomework(total);

    const percentage = total === 0 ? 0 : (totalApproved / total) * 100;
    setCompletionPercentage(percentage);
  }, [pendingHomework, approvedHomework]);

  return (
    <div className="maincontener">
      <div className="maincontener1">
        <div className="maintextimg">
          <h1 className="maintext">Your Homework<br></br>is here!</h1>
          <div className="mainimg"></div>
        </div>
      </div>
      <div className="mainbut1">
        <div className="mainbuttons1">
          {['Pending', 'Submitted', 'Evaluated'].map(tab => (
            <div key={tab}
              className={`div ${selectedBox === tab ? `selected ${tab}` : ''}`}
              onClick={() => handleTabChange(tab)}>
              <span className={`tab-button ${activeTab === tab ? 'active' : ''}`}>{tab}</span>
            </div>
          ))}
        </div>
      </div>
      <Outlet />
      {activeTab === 'Pending' && <Pending subjectId={subjectId} totalHomework={totalHomework} pendingHomework={pendingHomework} approvedHomework={approvedHomework} />}
      {activeTab === 'Submitted' && <Submitted approvedHomework={approvedHomework} />}
      {activeTab === 'Evaluated' && <Evaluated completionPercentage={completionPercentage} />}
    </div>
  );
}

export default Mainsub;
