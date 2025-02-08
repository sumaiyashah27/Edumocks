import React from 'react';
import { motion } from 'framer-motion';
import { BiBookOpen, BiCreditCard, BiCalendarCheck, BiBarChart } from 'react-icons/bi';
import { useInView } from 'react-intersection-observer';

const Steps = () => {
  // Scroll visibility hook for each card
  const { ref: stepRef1, inView: inView1 } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  const { ref: stepRef2, inView: inView2 } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  const { ref: stepRef3, inView: inView3 } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  const { ref: stepRef4, inView: inView4 } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <section style={{ backgroundColor: '#f8f9fa', padding: '5rem 2rem', textAlign: 'center' }} id="how-it-works">
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#100b5c' }}>How Edumocks Works</h2>
        <div style={{ width: '50px', height: '2px', backgroundColor: '#c80d18', margin: '1rem auto' }}></div>

        <div style={{
          display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'nowrap', overflowX: 'auto', padding: '1rem 0'
        }}>
          <motion.div
            ref={stepRef1}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: inView1 ? 1 : 0, y: inView1 ? 0 : 30 }}
            transition={{ duration: 0.8 }}
            style={{ flex: '0 0 auto', width: '220px', margin: '0' }}
          >
            <div style={{
              backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', padding: '1.5rem',
              textAlign: 'center', transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
              }}
            >
              <h5 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#c80d18' }}>Step 1</h5>
              <div style={{ margin: '1rem 0' }}>
                <BiBookOpen size={30} />
              </div>
              <h4 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#100b5c' }}>Choose Your Course</h4>
              <p style={{ color: '#555', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Select the CFA course that fits as per your preparation needs.
              </p>
            </div>
          </motion.div>

          <motion.div
            ref={stepRef2}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: inView2 ? 1 : 0, y: inView2 ? 0 : 30 }}
            transition={{ duration: 0.8 }}
            style={{ flex: '0 0 auto', width: '220px', margin: '0' }}
          >
            <div style={{
              backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', padding: '1.5rem',
              textAlign: 'center', transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
              }}
            >
              <h5 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#c80d18' }}>Step 2</h5>
              <div style={{ margin: '1rem 0' }}>
                <BiCreditCard size={30} />
              </div>
              <h4 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#100b5c' }}>Complete Payment</h4>
              <p style={{ color: '#555', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Secure your access to mock tests with the payment process.
              </p>
            </div>
          </motion.div>

          <motion.div
            ref={stepRef3}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: inView3 ? 1 : 0, y: inView3 ? 0 : 30 }}
            transition={{ duration: 0.8 }}
            style={{ flex: '0 0 auto', width: '220px', margin: '0' }}
          >
            <div style={{
              backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', padding: '1.5rem',
              textAlign: 'center', transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
              }}
            >
              <h5 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#c80d18' }}>Step 3</h5>
              <div style={{ margin: '1rem 0' }}>
                <BiCalendarCheck size={30} />
              </div>
              <h4 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#100b5c' }}>Schedule Your Test</h4>
              <p style={{ color: '#555', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Choose a convenient date and time to take your mock test.
              </p>
            </div>
          </motion.div>

          <motion.div
            ref={stepRef4}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: inView4 ? 1 : 0, y: inView4 ? 0 : 30 }}
            transition={{ duration: 0.8 }}
            style={{ flex: '0 0 auto', width: '220px', margin: '0' }}
          >
            <div style={{
              backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', padding: '1.5rem',
              textAlign: 'center', transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
              }}
            >
              <h5 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#c80d18' }}>Step 4</h5>
              <div style={{ margin: '1rem 0' }}>
                <BiBarChart size={30} />
              </div>
              <h4 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#100b5c' }}>Get Your Results</h4>
              <p style={{ color: '#555', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Receive detailed insights and analysis to track your progress.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Steps;
