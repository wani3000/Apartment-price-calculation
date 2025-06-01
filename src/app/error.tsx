'use client'; // 에러 컴포넌트는 반드시 클라이언트 컴포넌트여야 합니다.

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 오류를 로깅 서비스에 기록합니다.
    console.error(error);
  }, [error]);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>문제가 발생했습니다!</h2>
      <p>{error.message || '알 수 없는 오류가 발생했습니다.'}</p>
      <button
        onClick={reset}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          cursor: 'pointer',
          backgroundColor: '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
        }}
      >
        다시 시도
      </button>
    </div>
  );
} 