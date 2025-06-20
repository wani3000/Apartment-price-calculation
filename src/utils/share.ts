interface ShareData {
  title: string;
  text?: string;
  url: string;
}

// Web Share API를 사용한 공유 기능
export const shareContent = async (data: ShareData): Promise<boolean> => {
  try {
    // Web Share API 지원 여부 확인
    if (navigator.share) {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

      const shareDataForOS: ShareData = { ...data };

      // iOS의 '복사' 기능은 text 필드를 복사합니다.
      // '복사' 시 URL만 복사되도록 하려면 text 필드를 제거합니다.
      // 다른 앱(카톡 등)으로 공유 시에는 title과 url이 표시됩니다.
      if (isIOS) {
        delete shareDataForOS.text;
      }

      await navigator.share(shareDataForOS);
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
  const currentUrl = new URL(window.location.origin + '/result/final'); // 항상 최종 결과 페이지로 URL 고정
  currentUrl.searchParams.set('shared', 'true');
  currentUrl.searchParams.set('username', encodeURIComponent(username));
  currentUrl.searchParams.set('amount', encodeURIComponent(amount));
  currentUrl.searchParams.set('type', type);
  
  return {
    title: `${username}님의 아파트 구매 가능 금액`,
    text: `${username}님이 ${type} 시 살 수 있는 아파트: ${amount}`,
    url: currentUrl.toString()
  };
}; 