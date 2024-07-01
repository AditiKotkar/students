// import React, { useState } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faArrowLeft, faPlus } from '@fortawesome/free-solid-svg-icons';
// import Calendar from 'react-calendar';
// import 'react-calendar/dist/Calendar.css';
// import './AttendenceSheet.css';
// import { Link } from 'react-router-dom';
// const AttendenceSheet = () => {
//   const [value, setValue] = useState(new Date());
//   const [absentDates, setAbsentDates] = useState([
//     { title: 'Reasons of Holiday', date: new Date(2024, 4, 6), reason: 'ill' },
//     { title: 'Reasons of Holiday', date: new Date(2024, 4, 15), reason: 'Sister Function' },
//     { title: 'Reasons of Holiday', date: new Date(2024, 4, 19), reason: 'ill' },
//     { title: 'Reasons of Holiday', date: new Date(2024, 4, 24), reason: 'Sister Function' },
//   ]);
//   const [showModal, setShowModal] = useState(false);
//   const [newDate, setNewDate] = useState(new Date());
//   const [newReason, setNewReason] = useState('');
//   const [newTitle, setNewTitle] = useState('Reasons of Holiday');
//   const [currentMonth, setCurrentMonth] = useState(value);
//   const tileClassName = ({ date, view }) => {
//     if (view === 'month') {
//       const day = date.getDay();
//       if (absentDates.some(absent => absent.date.toDateString() === date.toDateString())) {
//         return 'absent';
//       } else if (day === 0) {
//         return 'sunday';
//       } else if (day === 6) {
//         return 'saturday';
//       } else {
//         return 'weekday';
//       }
//     }
//   };
//   const handleAddAbsentDate = () => {
//     setAbsentDates([...absentDates, {title: newTitle, date: newDate, reason: newReason}]);
//     setShowModal(false);
//     setNewDate(new Date());
//     setNewReason('');
//     setNewTitle('Reasons of Holiday');
//   };
//   const handleMonthChange = ({ activeStartDate }) => {
//     setCurrentMonth(activeStartDate);
//   };
//   const getAbsentDatesForCurrentMonth = () => {
//     return absentDates.filter(absent => 
//       absent.date.getMonth() === currentMonth.getMonth() && 
//       absent.date.getFullYear() === currentMonth.getFullYear()
//     );
//   };
//   const absentDatesForCurrentMonth = getAbsentDatesForCurrentMonth();
//   return (
//     <div className='Attendancecontener'>
//       <div className='Attendancecal'>
//         <Link to="/student"><FontAwesomeIcon icon={faArrowLeft} className='Attendanceicon' /></Link>
//         <h1>Attendance</h1>
//         <FontAwesomeIcon icon={faPlus} className='Attendanceicon' onClick={() => setShowModal(true)}/>
//       </div>
//       <div className='Attendanceday'>
//         <div className='Attendancedays'>
//           <Calendar
//             onChange={setValue}
//             value={value}
//             tileClassName={tileClassName}
//             onActiveStartDateChange={handleMonthChange}
//           />
//         </div>
//         <div className='attendancere'>
//           {absentDatesForCurrentMonth.length > 0 ? (
//             absentDatesForCurrentMonth.map((absent, index) => (
//               <div className='Attendanceevents' key={index}>
//                 <div className='Attendanceev'>
//                   <div className='Attendanceevent'>
//                     <div className='Attendancet'>
//                       <div className='Attendancedot'></div>
//                       <p>{absent.date.toDateString()}</p>
//                     </div>
//                     <h1>{absent.title}</h1>
//                     <h2>{absent.reason}</h2>
//                   </div>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className='no-absent-message'>
//               <h1>No absent this month...</h1>
//             </div>
//           )}
//         </div>
//       </div>
//       {showModal && (
//         <div className='Absentmodal'>
//           <div className='Absentmodal-content'>
//             <h2>Add Absent Date</h2>
//             <label>Date: <input type='date' value={newDate.toISOString().substring(0, 10)} onChange={(e) => setNewDate(new Date(e.target.value))}/></label><br></br>
//             <label>Reason: <input type='text' value={newReason} onChange={(e) => setNewReason(e.target.value)}/></label><br></br>
//             <button onClick={handleAddAbsentDate}>Add</button>
//             <button onClick={() => setShowModal(false)}>Cancel</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };
// export default AttendenceSheet;









import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPlus } from '@fortawesome/free-solid-svg-icons';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Link } from 'react-router-dom';
import './AttendenceSheet.css';

const AttendanceSheet = () => {
  const [value, setValue] = useState(new Date());
  const [absentDates, setAbsentDates] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newDate, setNewDate] = useState(new Date());
  const [newReason, setNewReason] = useState('');
  const [newTitle, setNewTitle] = useState('Reasons of Holiday');
  const [currentMonth, setCurrentMonth] = useState(value);
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [selectedAbsent, setSelectedAbsent] = useState(null);
  const [fetchedReason, setFetchedReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const collegeCode = sessionStorage.getItem('college_code');
  const studentId = sessionStorage.getItem('studentid');

  useEffect(() => {
    fetchAttendanceData(currentMonth.getMonth() + 1, currentMonth.getFullYear());
  }, [currentMonth]);

  const fetchAttendanceData = async (month, year) => {
    console.log('Fetching attendance data:', collegeCode, studentId);
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`https://apiaws.onrender.com/fetchattendance?college_code=${collegeCode}&currentMonth=${month}&currentYear=${year}&student_id=${studentId}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      console.log('Fetched attendance data:', data);
      setAbsentDates(Array.isArray(data.absentDates) ? data.absentDates : []);
      setAttendanceData(Array.isArray(data.attendanceData) ? data.attendanceData : []);
    } catch (error) {
      console.error('Error fetching attendance data:', error);
      setError('Error fetching attendance data');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchReasonForDate = async (date) => {
    console.log('Fetching reason:', collegeCode, studentId, date);
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`https://apiaws.onrender.com/fetchreason?college_code=${collegeCode}&date=${date}&student_id=${studentId}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      console.log('Fetched reason for date:', date, data);
      setFetchedReason(data.reason);
    } catch (error) {
      console.error('Error fetching reason:', error);
      setFetchedReason('Error fetching reason');
    } finally {
      setIsLoading(false);
    }
  };

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const dateString = date.toDateString();
      const isAbsent = absentDates.some(absent => new Date(absent.date).toDateString() === dateString);
      if (isAbsent) {
        return 'absent';
      } else {
        const foundDate = attendanceData.find(item => item.date === date.toISOString().substring(0, 10));
        if (foundDate && foundDate.status === 0) {
          return 'status-0';
        } else {
          const day = date.getDay();
          if (day === 0) {
            return 'sunday';
          } else if (day === 6) {
            return 'saturday';
          } else {
            return 'weekday';
          }
        }
      }
    }
  };

  const handleAddAbsentDate = async () => {
    console.log('Adding absent date:', collegeCode, studentId);
    const formattedDate = newDate.toISOString().substring(0, 10);
    const newAbsent = { title: newTitle, date: formattedDate, reason: newReason };
    console.log('Payload data:', {
      student_id: studentId,
      date: formattedDate,
      reason: newReason,
    });

    try {
      const response = await fetch(`https://apiaws.onrender.com/add-reason?college_code=${collegeCode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: studentId,
          date: formattedDate,
          reason: newReason,
        }),
      });
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error('Network response was not ok');
      }
      const responseData = await response.json();
      console.log('Add absent date response:', responseData);
      setAbsentDates([...absentDates, newAbsent]);
      setShowModal(false);
      setNewDate(new Date());
      setNewReason('');
      setNewTitle('Reasons of Holiday');
      setError('');
    } catch (error) {
      console.error('Error adding absent date:', error);
      setError('Error adding absent date');
    }
  };

  const handleMonthChange = ({ activeStartDate }) => {
    setCurrentMonth(activeStartDate);
  };

  const getAbsentDatesForCurrentMonth = () => {
    return absentDates.filter(
      (absent) =>
        new Date(absent.date).getMonth() === currentMonth.getMonth() &&
        new Date(absent.date).getFullYear() === currentMonth.getFullYear()
    );
  };

  const absentDatesForCurrentMonth = getAbsentDatesForCurrentMonth();

  const handleDateClick = (absent) => {
    setSelectedAbsent(absent);
    fetchReasonForDate(absent.date);
    setShowReasonModal(true);
  };

  const handleStatusZeroClick = (date) => {
    fetchReasonForDate(date.toISOString().substring(0, 10));
    setShowReasonModal(true);
  };

  return (
    <div className="Attendancecontener">
      <div className="Attendancecal">
        <Link to="/student">
          <FontAwesomeIcon icon={faArrowLeft} className="Attendanceicon" />
        </Link>
        <h1>Attendance</h1>
        <FontAwesomeIcon icon={faPlus} className="Attendanceicon" onClick={() => setShowModal(true)} />
      </div>
      <div className="Attendanceday">
        <div className="Attendancedays">
          <Calendar
            onChange={setValue}
            value={value}
            tileClassName={tileClassName}
            onActiveStartDateChange={handleMonthChange}
            tileContent={({ date, view }) => {
              if (view === 'month' && attendanceData.find(item => item.date === date.toISOString().substring(0, 10) && item.status === 0)) {
                return (
                  <div className="status-zero-date" onClick={() => handleStatusZeroClick(date)}>
                    •
                  </div>
                );
              }
              return null;
            }}
          />
        </div>
        <div className="attendancere">
          {isLoading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : absentDatesForCurrentMonth.length > 0 ? (
            absentDatesForCurrentMonth.map((absent, index) => (
              <div className="Attendanceevents" key={index} onClick={() => handleDateClick(absent)}>
                <div className="Attendanceev">
                  <div className="Attendanceevent">
                    <div className="Attendancet">
                      <div className="Attendancedot"></div>
                      <p>{new Date(absent.date).toDateString()}</p>
                    </div>
                    <h1>{absent.title}</h1>
                    <h2>{absent.reason}</h2>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-absent-message">
              <p></p>
            </div>
          )}
        </div>
      </div>
      {showModal && (
        <Modal title="Add Absent Date" onClose={() => setShowModal(false)}>
          <label>
            Date: <input type="date" value={newDate.toISOString().substring(0, 10)} onChange={(e) => setNewDate(new Date(e.target.value))} />
          </label>
          <br />
          <label>
            Reason: <input type="text" value={newReason} onChange={(e) => setNewReason(e.target.value)} />
          </label>
          <br />
          <button onClick={handleAddAbsentDate}>Add</button>
          <button onClick={() => setShowModal(false)}>Cancel</button>
        </Modal>
      )}
      <div className='attendancere'>
      {showReasonModal && (
        <Modal title="Absent Reason" onClose={() => setShowReasonModal(false)}>
          <div className='Attendanceevents'>
                 <div className='Attendanceev'>
                   <div className='Attendanceevent'>
                     <div className='Attendancet'>
                       <div className='Attendancedot'></div>
                       <p> <strong>Date:</strong> {selectedAbsent && new Date(selectedAbsent.date).toDateString()} </p>
                    </div>
                    <h2><strong>Reason:</strong> {fetchedReason}</h2>
                   </div>
                 </div>
               </div>
        </Modal>
      )}
      </div>
    </div>
  );
};

const Modal = ({ title, onClose, children }) => {
  return (
    <div className='attendancere'>
    <div className="Absentmodal">
        {children}
    </div>
    </div>
  );
};

export default AttendanceSheet;
