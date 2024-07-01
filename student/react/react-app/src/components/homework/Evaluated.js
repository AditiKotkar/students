// import React from 'react';
// import './Evaluated.css';
// function Evaluated () {
//   return (
//     <div className="Evaluatedcontener">
//         <div className="Evaluatedcontener1">
//             <div className="Evaluatedtext1">
//                 <h1 className="Evaluatedname">Hello, Sai Chaudhari</h1>
//                 <h2 className="Evaluateddate">12 March 2024</h2>
//             </div>
//         </div>
//         <div className="EvaluatedLine">
//             <div className="Evaluatedline"></div>
//         </div>
//         <div className="Evaluatedcontener2">
//             <div className="Evaluatedbox">
//                 <div className="Evaluatedpercent">
//                     <svg>
//                         <circle cx="70" cy="70" r="70"></circle>
//                     </svg>
//                 <div className="Evaluatednumber">
//                     <h2>100%</h2>
//                 </div>
//                 </div>
//             </div>
//             <div className="Evaluatedrighttext">
//                 <div className="Evaluatedblue">
//                     <div className="Evaluatedbluecolor"></div>
//                     <h1 className="EvaluatedCompleted">Completed</h1>
//                 </div>
//                 <div className="Evaluatedpink">
//                     <div className="Evaluatedpinkcolor"></div>
//                     <h1 className="EvaluatedCompleted">Incompleted</h1>
//                 </div>
//             </div>
//         </div>
//         <div className="EvaluatedLine">
//             <div className="Evaluatedline"></div>
//         </div>
//     </div>      
//   );
// }
// export default Evaluated;




import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import './Evaluated.css';

function Evaluated() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const { subjectId, subjectName } = useParams();

  const standard = location.state?.standard || sessionStorage.getItem('standard');
  const division = location.state?.division || sessionStorage.getItem('division');
  const college_code = location.state?.college_code || sessionStorage.getItem('college_code');
  const subject_id = subjectId || location.state?.subject_id || sessionStorage.getItem('subject_id');
  const student_id = sessionStorage.getItem('studentid');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://apiaws.onrender.com/evolution-homework?subject_id=${subject_id}&standard=${standard}&division=${division}&standred=${standard}&student_id=${student_id}&college_code=${college_code}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setData(result);
        sessionStorage.setItem('student_name', result.student_name);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, [college_code, standard, division, subject_id, student_id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const completionPercentage = data ? (data.approvedHomework / data.totalHomework) * 100 : 0;

  return (
    <div className="Evaluatedcontener">
      <div className="Evaluatedcontener1">
        <div className="Evaluatedtext1">
          {data && (
            <>
              <h1 className="Evaluatedname">{`Hello, ${data.student_name}`}</h1>
              <h2 className="Evaluateddate">{data.date}</h2>
            </>
          )}
        </div>
      </div>
      <div className="EvaluatedLine">
        <div className="Evaluatedline"></div>
      </div>
      <div className="Evaluatedcontener2">
        <div className="Evaluatedbox">
          <div className="Evaluatedpercent">
            <svg>
              <circle cx="70" cy="70" r="70" style={{ stroke: '#F3897B' }}></circle>
              <circle
                cx="70" cy="70" r="70"
                style={{ strokeDashoffset: `calc(440 - (440 * ${completionPercentage}) / 100)`, stroke: '#306fd4' }}
              ></circle>
            </svg>
            <div className="Evaluatednumber">
              <h2>{`${completionPercentage.toFixed(2)}%`}</h2>
            </div>
          </div>
        </div>
        <div className="Evaluatedrighttext">
          <div className="Evaluatedblue">
            <div className="Evaluatedbluecolor" style={{ backgroundColor: '#306fd4' }}></div>
            <h1 className="EvaluatedCompleted">Completed</h1>
          </div>
          <div className="Evaluatedpink">
            <div className="Evaluatedpinkcolor" style={{ backgroundColor: '#F3897B' }}></div>
            <h1 className="EvaluatedCompleted">Incomplete</h1>
          </div>
        </div>
      </div>
      <div className="EvaluatedLine">
        <div className="Evaluatedline"></div>
      </div>
    </div>
  );
}

export default Evaluated;
