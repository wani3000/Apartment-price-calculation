interface ShareData {
  title: string;
  text: string;
  url: string;
}

// Web Share API를 사용한 공유 기능
export const shareContent = async (data: ShareData): Promise<boolean> => {
  try {
    // Web Share API 지원 여부 확인
    if (navigator.share) {
      await navigator.share(data);
      return true;
    } else {
      // fallback: URL 복사
      await copyToClipboard(data.url);
      alert('링크가 클립보드에 복사되었습니다!');
      return true;
    }
  } catch (error) {
    console.error('공유 실패:', error);
    
    // 사용자가 공유를 취소한 경우 (AbortError)
    if (error instanceof Error && error.name === 'AbortError') {
      return false;
    }
    
    // 다른 오류의 경우 fallback 시도
    try {
      await copyToClipboard(data.url);
      alert('링크가 클립보드에 복사되었습니다!');
      return true;
    } catch (clipboardError) {
      console.error('클립보드 복사 실패:', clipboardError);
      alert('공유에 실패했습니다. 링크를 수동으로 복사해주세요: ' + data.url);
      return false;
    }
  }
};

// 클립보드에 텍스트 복사
const copyToClipboard = async (text: string): Promise<void> => {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    await navigator.clipboard.writeText(text);
  } else {
    // fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
    } finally {
      document.body.removeChild(textArea);
    }
  }
};

// 홈페이지 공유 데이터
export const getHomeShareData = (): ShareData => ({
  title: '아파트 가격 계산기',
  text: '내 소득으로 얼마까지 아파트를 살 수 있을까? 투자와 실거주를 모두 고려한 아파트 가격 계산해보세요!',
  url: window.location.origin
});

// 결과페이지 공유 데이터
export const getResultShareData = (username: string, amount: string, type: '갭투자' | '실거주'): ShareData => {
  const currentUrl = new URL(window.location.href);
  currentUrl.searchParams.set('shared', 'true');
  
  return {
    title: `${username}님의 아파트 구매 가능 금액`,
    text: `${username}님이 ${type} 시 살 수 있는 아파트: ${amount}`,
    url: currentUrl.toString()
  };
}; 