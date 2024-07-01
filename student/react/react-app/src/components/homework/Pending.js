// import React, { useState, useEffect } from 'react';
// import { useLocation, useParams, useNavigate } from 'react-router-dom';
// import Modal from 'react-modal';
// import './pending.css';

// Modal.setAppElement('#root');

// const Pending = () => {
//   const [pendingHomework, setPendingHomework] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [modalIsOpen, setModalIsOpen] = useState(false);
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [successMessage, setSuccessMessage] = useState('');
//   const [formDetails, setFormDetails] = useState({
//     homeworkpending_id: '',
//     subject_id: '',
//     student_id: sessionStorage.getItem('studentid'), // Retrieve student_id from sessionStorage
//     description: '',
//     images: []
//   });

//   const location = useLocation();
//   const navigate = useNavigate();
//   const { subjectId, subjectName } = useParams();
//   const standard = location.state?.standard || sessionStorage.getItem('standard');
//   const division = location.state?.division || sessionStorage.getItem('division');
//   const college_code = location.state?.college_code || sessionStorage.getItem('college_code');
//   const subject_name = subjectName || sessionStorage.getItem('subject_name');
//   let subject_id = subjectId || location.state?.subject_id || sessionStorage.getItem('subject_id');
//   const student_id = sessionStorage.getItem('studentid');

//   useEffect(() => {
//     console.log('Student ID:', student_id);
//     console.log({
//       standard,
//       division,
//       college_code,
//       student_id,
//       subject_id
//     });

//     const fetchPendingHomework = async () => {
//       setLoading(true);
//       try {
//         if (!college_code || !standard || !division || !subject_name || !subject_id) {
//           throw new Error('Missing required session storage items');
//         }
//         const response = await fetch(`https://apiaws.onrender.com/homework_pending?standard=${standard}&division=${division}&college_code=${college_code}&student_id=${student_id}&subject_id=${subject_id}`);

//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }
//         const data = await response.json();
//         console.log('Fetched assignments:', data);
//         setPendingHomework(data);
//       } catch (error) {
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPendingHomework();
//   }, [college_code, standard, division, subject_name, subject_id, student_id]);

//   const handleDownload = (assignmentId, imageUrl) => {
//     const link = document.createElement('a');
//     link.href = imageUrl;
//     link.download = `assignment_${assignmentId}.jpg`;
//     link.click();
//   };

//   const handleView = (imageUrl) => {
//     console.log('Viewing assignment image:', imageUrl);
//     setSelectedImage(imageUrl);
//     setModalIsOpen(true);
//   };

//   const handleSubmitClick = (assignment) => {
//     setFormDetails({
//       ...formDetails,
//       homeworkpending_id: assignment.homeworkp_id,
//       subject_id: assignment.subject_id,
//       description: '',
//       images: []
//     });
//     setSelectedImage(null);
//     setModalIsOpen(true);
//   };

//   const handleInputChange = (event) => {
//     const { name, value } = event.target;
//     setFormDetails({ ...formDetails, [name]: value });
//   };

//   const handleFileChange = (event) => {
//     const files = Array.from(event.target.files);
//     const fileReaders = files.map(file => {
//       return new Promise((resolve, reject) => {
//         const reader = new FileReader();
//         reader.onload = () => resolve(reader.result);
//         reader.onerror = error => reject(error);
//         reader.readAsDataURL(file);
//       });
//     });
//     Promise.all(fileReaders)
//       .then(images => {
//         setFormDetails({ ...formDetails, images });
//       })
//       .catch(error => {
//         console.error('Error reading files:', error);
//       });
//   };

//   const handleSubmitForm = async (event) => {
//     event.preventDefault();
//     try {
//       console.log('Submitting form details:', formDetails);

//       const response = await fetch(`https://apiaws.onrender.com/submit_homework?college_code=MGVP`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formDetails),
//       });

//       if (!response.ok) {
//           throw new Error(`Network response was not ok`);
//       }
//       const result = await response.json();
//       console.log('Submission result:', result);
//       setSuccessMessage('Homework submitted successfully!');
//       setModalIsOpen(false);
//       setTimeout(() => {
//         setSuccessMessage('');
//         navigate('/Submitted', {
//           state: {
//             student_id: formDetails.student_id,
//             subject_name: subject_name,
//             college_code: college_code
//           }
//         });
//       }, );
//     } catch (error) {
//       console.error('Error submitting homework:', error);
//     }
//   };

//   return (
//     <div className='Submittedcontent'>
//       {error && <p className="error-message">{error}</p>}
//       {loading ? (
//         <p>Loading...</p>
//       ) : (
//         pendingHomework.length === 0 ? (
//           <div className="no-data">No pending homework found.</div>
//         ) : (
//           pendingHomework.map((assignment, index) => (
//             <div className="pendingcontener2" key={index}>
//               <div className="pendingbuten">
//                 <div>
//                   <h1 className="pendingenglish">{assignment.subject_name} ({assignment.subject_id})</h1>
//                   <div className="pendingbuttons2">
//                     <span onClick={() => handleView(`data:image/jpeg;base64,${assignment.image}`)}>View</span>
//                     <span onClick={() => handleDownload(assignment.homeworkp_id, `data:image/jpeg;base64,${assignment.image}`)}>Download</span>
//                     <span onClick={() => handleSubmitClick(assignment)}>SUBMIT</span>
//                   </div>
//                 </div>
//               </div>
//               <div className="pendingcontener3">
//                 <h1 className="pendingassign">{assignment.homeworkp_id}</h1>
//                 <div className="pendingData">
//                   <div className="pendingbord">
//                     <ul>
//                       <li>Homework Date</li>
//                       <li>Submission Date</li>
//                       <li>Created By</li>
//                     </ul>
//                   </div>
//                   <div className="pendingDate">
//                     <ul>
//                       <li>{new Date(assignment.date_of_given).toLocaleDateString()}</li>
//                       <li>{new Date(assignment.date_of_creation).toLocaleDateString()}</li>
//                       <li>{assignment.teacher_name}</li>
//                     </ul>
//                   </div>
//                 </div>
//                 <div className="pendingcontener4">
//                   <h1 className="pendingdescription">Description</h1>
//                   <span>{assignment.description}</span>
//                 </div>
//               </div>
//             </div>
//           ))
//         )
//       )}
//       <Modal
//         isOpen={modalIsOpen}
//         onRequestClose={() => setModalIsOpen(false)}
//         contentLabel="View Assignment"
//         className="Modal"
//         overlayClassName="Overlay"
//       >
//         {selectedImage ? (
//           <>
//             <button onClick={() => setModalIsOpen(false)}>Close</button>
//             <img src={selectedImage} alt="Assignment" style={{ width: '100%' }} />
//           </>
//         ) : (
//           <form onSubmit={handleSubmitForm}>
//             <label>Homework ID:</label>
//             <input type="text" name="homeworkpending_id" value={formDetails.homeworkpending_id} readOnly />
//             <label>Subject ID:</label>
//             <input type="text" name="subject_id" value={formDetails.subject_id} readOnly />
//             <label>Student ID:</label>
//             <input type="text" name="student_id" value={formDetails.student_id} readOnly />
//             <label>Description:</label>
//             <textarea name="description" value={formDetails.description} onChange={handleInputChange} required />
//             <label>Upload Images:</label>
//             <input type="file" multiple accept="image/*" onChange={handleFileChange} required />
//             <button type="submit">Submit</button>
//           </form>
//         )}
//       </Modal>
//       {successMessage && <p className="success-message">{successMessage}</p>}
//     </div>
//   );
// };

// export default Pending;




import React, { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import './pending.css';

Modal.setAppElement('#root');

const Pending = () => {
  const [pendingHomework, setPendingHomework] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [formDetails, setFormDetails] = useState({
    homeworkpending_id: '',
    subject_id: '',
    student_id: sessionStorage.getItem('studentid'),  // Retrieve student_id from sessionStorage
    description: '',
    images: []
  });

  const location = useLocation();
  const navigate = useNavigate();
  const { subjectId, subjectName } = useParams();
  const standard = location.state?.standard || sessionStorage.getItem('standard');
  const division = location.state?.division || sessionStorage.getItem('division');
  const college_code = location.state?.college_code || sessionStorage.getItem('college_code');
  const subject_name = subjectName || sessionStorage.getItem('subject_name');
  let subject_id = subjectId || location.state?.subject_id || sessionStorage.getItem('subject_id');
  const student_id = sessionStorage.getItem('studentid');

  useEffect(() => {
    console.log('Student ID:', student_id);
    console.log({
      standard,
      division,
      college_code,
      student_id,
      subject_id
    });

    const fetchPendingHomework = async () => {
      setLoading(true);
      try {
        if (!college_code || !standard || !division || !subject_name || !subject_id) {
          throw new Error('Missing required session storage items');
        }
        const response = await fetch(`https://apiaws.onrender.com/teacher_pending?college_code=MGVP&teacher_code=T1&Standard=10&Division=A&subject_id=S1`);

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Fetched assignments:', data);
        setPendingHomework(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingHomework();
  }, [college_code, standard, division, subject_name, subject_id, student_id]);

  const handleDownload = (assignmentId, imageUrl) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `assignment_${assignmentId}.jpg`;
    link.click();
  };

  const handleView = (imageUrl) => {
    console.log('Viewing assignment image:', imageUrl);
    setSelectedImage(imageUrl);
    setModalIsOpen(true);
  };

  const handleSubmitClick = (assignment) => {
    setFormDetails({
      ...formDetails,
      homeworkpending_id: assignment.homeworkp_id,
      subject_id: assignment.subject_id,
      description: '',
      images: []
    });
    setSelectedImage(null);
    setModalIsOpen(true);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormDetails({ ...formDetails, [name]: value });
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const fileReaders = files.map(file => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
      });
    });
    Promise.all(fileReaders)
      .then(images => {
        setFormDetails({ ...formDetails, images });
      })
      .catch(error => {
        console.error('Error reading files:', error);
      });
  };

  const handleSubmitForm = async (event) => {
    event.preventDefault();
    try {
      console.log('Submitting form details:', formDetails);

      const response = await fetch(`https://apiaws.onrender.com/submit_homework?college_code=MGVP`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formDetails),
      });

      if (!response.ok) {
        const errorDetails = await response.json();
        if (errorDetails.error === "Homework already submitted") {
          throw new Error("Homework has already been submitted.");
        } else {
          throw new Error(`Network response was not ok: ${errorDetails}`);
        }
      }

      const result = await response.json();
      console.log('Submission result:', result);
      setSuccessMessage('Homework submitted successfully!');
      setModalIsOpen(false);
      setTimeout(() => {
        setSuccessMessage('');
        navigate('/Submitted', {
          state: {
            student_id: formDetails.student_id,
            subject_name: subject_name,
            college_code: college_code
          }
        });
      }, 3000);
    } catch (error) {
      console.error('Error submitting homework:', error.message);
      setError(`Error submitting homework: ${error.message}`);
    }
  };

  return (
    <div className='Submittedcontent'>
      {error && <p>Error: {error}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : (
        pendingHomework.length === 0 ? (
          <div className="no-data">No pending homework found.</div>
        ) : (
          pendingHomework.map((assignment, index) => (
            <div className="pendingcontener2" key={index}>
              <div className="pendingbuten">
                <div>
                  <h1 className="pendingenglish">{assignment.subject_name} ({assignment.subject_id})</h1>
                  <div className="pendingbuttons2">
                    <span onClick={() => handleView(`data:image/jpeg;base64,${assignment.image}`)}>View</span>
                    <span onClick={() => handleDownload(assignment.homeworkp_id, `data:image/jpeg;base64,${assignment.image}`)}>Download</span>
                    <span onClick={() => handleSubmitClick(assignment)}>SUBMIT</span>
                  </div>
                </div>
              </div>
              <div className="pendingcontener3">
                <h1 className="pendingassign">{assignment.homeworkp_id}</h1>
                <div className="pendingData">
                  <div className="pendingbord">
                    <ul>
                      <li>Homework Date</li>
                      <li>Submission Date</li>
                      <li>Created By</li>
                    </ul>
                  </div>
                  <div className="pendingDate">
                    <ul>
                      <li>{new Date(assignment.date_of_given).toLocaleDateString()}</li>
                      <li>{new Date(assignment.date_of_creation).toLocaleDateString()}</li>
                      <li>{assignment.teacher_name}</li>
                    </ul>
                  </div>
                </div>
                <div className="pendingcontener4">
                  <h1 className="pendingdescription">Description</h1>
                  <span>{assignment.description}</span>
                </div>
              </div>
            </div>
          ))
        )
      )}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="View Assignment"
        className="Modal"
        overlayClassName="Overlay"
      >
        {selectedImage ? (
          <>
            <button onClick={() => setModalIsOpen(false)}>Close</button>
            <img src={selectedImage} alt="Assignment" style={{ width: '100%' }} />
          </>
        ) : (
          <form onSubmit={handleSubmitForm}>
            <label>Homework ID:</label>
            <input type="text" name="homeworkpending_id" value={formDetails.homeworkpending_id} readOnly />
            <label>Subject ID:</label>
            <input type="text" name="subject_id" value={formDetails.subject_id} readOnly />
            <label>Student ID:</label>
            <input type="text" name="student_id" value={formDetails.student_id} readOnly />
            <label>Description:</label>
            <textarea name="description" value={formDetails.description} onChange={handleInputChange} required />
            <label>Upload Images:</label>
            <input type="file" multiple accept="image/*" onChange={handleFileChange} required />
            <button type="submit">Submit</button>
          </form>
        )}
      </Modal>
      {successMessage && <div className="success-message">{successMessage}</div>}
    </div>
  );
};

export default Pending;
