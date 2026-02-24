# MCP 배포/IOS 실사용 연결 가이드

## 1) 왜 필요한가
- 현재 앱은 정적 빌드(`output: "export"`) 구조이므로 Next API 라우트를 사용할 수 없습니다.
- 따라서 브라우저/IOS 앱이 MCP를 직접 호출하면 CORS/localhost 문제로 실사용에서 실패할 수 있습니다.
- 해결 방식: **추천 프록시 서버**를 별도 배포하고, 앱은 프록시만 호출합니다.

## 2) 구성
- `services/recommendation-proxy` : 앱 전용 추천 API
- 외부 MCP 서버(HTTP) : `real-estate-mcp`
- 앱(Next/Capacitor) : 기본적으로 `https://aptgugu.com/api` 또는 웹 동일 오리진 `/api` 호출
- Vercel Serverless API (`/api/*`) : MCP 서버로 중계

## 3) 사용자(운영자)가 직접 해야 하는 것
### A. MCP 서버 배포
1. `real-estate-mcp` 저장소 배포
2. 환경변수 설정
   - `DATA_GO_KR_API_KEY` = 공공데이터포털 **Decoding 키**
3. 외부에서 접근 가능한 HTTPS URL 확보
   - 예: `https://your-mcp.example.com/mcp`

### B. Vercel 환경변수 설정
1. 웹 배포 프로젝트 환경변수:
   - `REAL_ESTATE_MCP_URL` = 위 MCP URL (예: `https://your-mcp.example.com/mcp`)
2. 필요 시만 설정:
   - `NEXT_PUBLIC_RECOMMEND_PROXY_URL` (기본값을 덮어쓸 때만)
3. 재배포

## 4) 로컬 확인 방법
### 터미널 1: MCP
```bash
export DATA_GO_KR_API_KEY='YOUR_DECODING_KEY'
uv run --directory /tmp/re-mcp-work/real-estate-mcp python src/real_estate/mcp_server/server.py --transport http --host 127.0.0.1 --port 8011
```

### 터미널 2: 로컬 프록시(선택)
```bash
cd services/recommendation-proxy
npm install
REAL_ESTATE_MCP_URL='http://127.0.0.1:8011/mcp' npm start
```

### 터미널 3: 앱
```bash
cd /Users/chulwan/Documents/GitHub/Apartment-price-calculation
NEXT_PUBLIC_RECOMMEND_PROXY_URL='http://127.0.0.1:8787' npm run dev
```

## 5) 점검 포인트
- 추천 탭 진입 시 10개 리스트가 표시되는지
- 지역/예산 변경 시 추천이 갱신되는지
- 프록시 로그에서 4xx/5xx 없는지
- MCP 서버에서 `HTTP 401` 발생 시 키 인코딩/디코딩 상태 재확인
