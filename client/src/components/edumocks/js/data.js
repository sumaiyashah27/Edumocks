import React, { useEffect, useState } from 'react';
import { FaUsers, FaCheckCircle, FaQuestionCircle } from 'react-icons/fa';
import { useInView } from 'react-intersection-observer';
import '../css/data.css';

const Data = () => {
  const [counters, setCounters] = useState({
    students: 0,
    questions: 0,
    rate: 0,
  });

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  const incrementValues = {
    students: 1000,
    questions: 10000,
    rate: 95,
  };

  const increments = {
    students: 10,
    questions: 100,
    rate: 1,
  };

  useEffect(() => {
    if (inView) {
      const interval = setInterval(() => {
        setCounters((prev) => {
          const updated = { ...prev };

          Object.keys(incrementValues).forEach((key) => {
            if (prev[key] < incrementValues[key]) {
              updated[key] = Math.min(prev[key] + increments[key], incrementValues[key]);
            }
          });

          if (Object.values(updated).every((value, index) => value === Object.values(incrementValues)[index])) {
            clearInterval(interval);
          }

          return updated;
        });
      }, 30);

      return () => clearInterval(interval);
    }
  }, [inView]);

  return (
    <div ref={ref} className='main-section'>
      <h2 className='fs-1 fw-bold'>Our Strength</h2>
      <div  className="data-section">
      <DataItem
        icon={<FaUsers className="data-icon" />}
        value={`${counters.students}+`}
        label="No. of Satisfied Students"
      />
      <DataItem
        icon={<FaQuestionCircle className="data-icon" />}
        value={`${counters.questions}+`}
        label="No. of Questions Answered"
      />
      <DataItem
        icon={<FaCheckCircle className="data-icon" />}
        value={`${counters.rate}%`}
        label="Passing Rate"
      />
      </div>
    </div>
  );
};

const DataItem = ({ icon, value, label }) => (
  <div className="data-item">
    {icon}
    <div className="data-text">
      <h2>{value}</h2>
      <p>{label}</p>
    </div>
  </div>
);

export default Data;
