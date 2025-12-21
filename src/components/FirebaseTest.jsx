import { useEffect, useState } from 'react';
import { testFirebaseConnection } from '../services/testFirebase';

/**
 * Temporary component to test Firebase connection
 * Add this to App.jsx or any page to test Firebase
 * Remove after confirming Firebase works
 */
const FirebaseTest = () => {
  const [testResults, setTestResults] = useState(null);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    const runTest = async () => {
      setIsTesting(true);
      try {
        const results = await testFirebaseConnection();
        setTestResults(results);
      } catch (error) {
        setTestResults({
          auth: { success: false, error: error.message },
          firestore: { success: false, error: error.message },
        });
      } finally {
        setIsTesting(false);
      }
    };

    runTest();
  }, []);

  if (isTesting) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Testing Firebase connection...</p>
      </div>
    );
  }

  if (!testResults) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: '80px',
        right: '20px',
        background: testResults.auth.success && testResults.firestore.success 
          ? '#10b981' 
          : '#ef4444',
        color: 'white',
        padding: '15px 20px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        zIndex: 9999,
        maxWidth: '300px',
      }}
    >
      <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>
        Firebase Test Results
      </h3>
      <div style={{ fontSize: '14px' }}>
        <p style={{ margin: '5px 0' }}>
          Auth: {testResults.auth.success ? '✅' : '❌'}
        </p>
        <p style={{ margin: '5px 0' }}>
          Firestore: {testResults.firestore.success ? '✅' : '❌'}
        </p>
        {testResults.auth.error && (
          <p style={{ margin: '5px 0', fontSize: '12px' }}>
            Auth Error: {testResults.auth.error}
          </p>
        )}
        {testResults.firestore.error && (
          <p style={{ margin: '5px 0', fontSize: '12px' }}>
            Firestore Error: {testResults.firestore.error}
          </p>
        )}
      </div>
      <p style={{ margin: '10px 0 0 0', fontSize: '12px', opacity: 0.9 }}>
        Check console for details
      </p>
    </div>
  );
};

export default FirebaseTest;

