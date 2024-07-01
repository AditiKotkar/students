// import React from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
// import './feedback.css';
// import { Link } from 'react-router-dom';

// function Feedback() {
//   return (
//     <div className='feedbackcontent'>
//       <div className='feedbackheader'>
//         <Link to="/student"><FontAwesomeIcon icon={faArrowLeft} className='Attendanceicon' /></Link>
//         <h1>feedback</h1>
//       </div>
//       <div className='feedbackteacher'>
//       <div class="field name">
//         <h2>Teacher Name</h2>
//         <input className='feedbackconten1' type="text" placeholder="Enter Name" required/>
//       </div>
//       <div class="field name">
//         <h2>Your Name</h2>
//         <input className='feedbackconten1' type="text" name="Enter Name" placeholder="Enter Name" />
//       </div>
//       <div class="field name">
//         <h2>Subject</h2>
//         <input className='feedbackconten1' type="text" name="Enter Name" placeholder="Enter Name" />
//       </div>
//       <div class="field textarea">
//         <h2>Deatails Explanation</h2>
//         <textarea  className='feedbackconten2'  placeholder="Type here....." required></textarea>
//       </div>
//       <div className='butons'>
//       <Link to="/student"><button className='BACK'>BACK</button></Link>
//         <button className='SUBMIT'>SUBMIT</button>
//       </div>
//       </div>
//       </div>
//   );
// }

// export default Feedback;


// import React from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
// import './feedback.css';
// import { Link, useLocation } from 'react-router-dom';

// function Feedback() {
//   const location = useLocation();
//   const { college_code } = location.state || {};

//   const handleSubmit = async () => {
//     if (!college_code) {
//       console.error('No college_code found');
//       return;
//     }

//     const feedbackData = {
//       teacherName: document.querySelector('input[name="teacherName"]').value,
//       studentName: document.querySelector('input[name="studentName"]').value,
//       subject: document.querySelector('input[name="subject"]').value,
//       details: document.querySelector('textarea[name="details"]').value,
//       college_code: college_code,
//     };

//     console.log('Submitting feedback with data:', feedbackData);

//     try {
//       const response = await fetch(`https://apiaws.onrender.com/feedback?college_code=MGVP` ,{
//       // const response = await fetch(`https://apiaws.onrender.com/feedback?college_code=${college_code}`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(feedbackData),
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error('Network response was not ok');
//       }
//       const result = await response.json();
//       console.log('Feedback submission response:', result);
//       alert('Feedback submitted successfully');
//     } catch (error) {
//       console.error('Error submitting feedback:', error);
//       alert('There was an error submitting your feedback. Please try again later.');
//     }
//   };
//   return (
//     <div className='feedbackcontent'>
//       <div className='feedbackheader'>
//         <Link to="/student"><FontAwesomeIcon icon={faArrowLeft} className='Attendanceicon' /></Link>
//         <h1>Feedback</h1>
//       </div>
//       <div className='feedbackteacher'>
//         <div className="field name">
//           <h2>Teacher Name</h2>
//           <input className='feedbackconten1' type="text" name="teacherName" placeholder="Enter Name" required />
//         </div>
//         <div className="field name">
//           <h2>Your Name</h2>
//           <input className='feedbackconten1' type="text" name="studentName" placeholder="Enter Name" />
//         </div>
//         <div className="field name">
//           <h2>Subject</h2>
//           <input className='feedbackconten1' type="text" name="subject" placeholder="Enter Name" />
//         </div>
//         <div className="field textarea">
//           <h2>Details Explanation</h2>
//           <textarea className='feedbackconten2' name="details" placeholder="Type here....." required></textarea>
//         </div>
//         <div className='butons'>
//           <Link to="/student"><button className='BACK'>BACK</button></Link>
//           <button className='SUBMIT' onClick={handleSubmit}>SUBMIT</button>
//         </div>
//       </div>
//     </div>
//   );
// }
// export default Feedback;





import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import './feedback.css';
import { Link } from 'react-router-dom';

function Feedback() {
  const [formData, setFormData] = useState({
    teacher_name: '',
    your_name: '',
    subject: '',
    explanation: ''
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://apiaws.onrender.com/feedback?college_code=MGVP', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (response.ok) {
        setSuccessMessage(data.message);
        setFormData({
          teacher_name: '',
          your_name: '',
          subject: '',
          explanation: ''
        });
      } else {
        setErrorMessage(data.error || 'Failed to submit feedback');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setErrorMessage('Failed to submit feedback');
    }
  };

  return (
    <div className='feedbackcontent'>
      <div className='feedbackheader'>
        <Link to="/student"><FontAwesomeIcon icon={faArrowLeft} className='Attendanceicon' /></Link>
        <h1>Feedback</h1>
      </div>
      <div className='feedbackteacher'>
        <form onSubmit={handleSubmit}>
          <div className="field name">
            <h2>Teacher Name</h2>
            <input
              className='feedbackconten1'
              type="text"
              name="teacher_name"
              value={formData.teacher_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="field name">
            <h2>Your Name</h2>
            <input
              className='feedbackconten1'
              type="text"
              name="your_name"
              value={formData.your_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="field name">
            <h2>Subject</h2>
            <input
              className='feedbackconten1'
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
            />
          </div>
          <div className="field textarea">
            <h2>Detailed Explanation</h2>
            <textarea
              className='feedbackconten2'
              name="explanation"
              value={formData.explanation}
              onChange={handleChange}
              placeholder="Type here....."
              required
            ></textarea>
          </div>
          <div className='butons'>
           <Link to="/student"><button className='BACK'>BACK</button></Link>
           <button type="submit" className='SUBMIT'>SUBMIT</button>
         </div>
        </form>
        {successMessage && <div className="success-message">{successMessage}</div>}
        {errorMessage && <div className="error-message">{errorMessage}</div>}
      </div>
    </div>
  );
}

export default Feedback;