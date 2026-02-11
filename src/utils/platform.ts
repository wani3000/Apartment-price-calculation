/**
 * 현재 실행 환경이 Capacitor(네이티브 앱)인지 확인
 */
export const isNativeApp = (): boolean => {
  if (typeof window === 'undefined') return false;

  // Capacitor가 로드되었는지 확인
  return !!(window as any).Capacitor;
};

/**
 * 현재 실행 환경이 웹 브라우저인지 확인
 */
export const isWeb = (): boolean => {
  return !isNativeApp();
};
