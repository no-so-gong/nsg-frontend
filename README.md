# NSG Frontend Template (React Native + Expo)

**No-So-Gong 팀 프로젝트**의 프론트엔드 개발을 위한 Expo(with React Native + TypeScript) 템플릿입니다.

---

## 📦 로컬 개발 가이드

### 1. 프로젝트 클론

```bash
git clone https://github.com/no-so-gong/nsg-frontend.git
cd nsg-frontend
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 환경 변수 설정(백엔드 연동)
`.env` 파일을 프로젝트 루트에 생성하고 아래와 같이 설정합니다:
```bash
# 예시
API_URL=http://<your-ipv4-address>:8000
```
`<your-ipv4-address>`는 **호스트 컴퓨터의 IP 주소**입니다. <br/> Windows에서 확인 방법: 명령 프롬프트(cmd)에서 `ipconfig` 입력 → `IPv4 주소` 확인
- ⚠️ localhost 또는 127.0.0.1은 모바일 기기에서 작동하지 않습니다.

### 4. 실행

🍎 iOS(Expo Go 앱 사용)
```bash
npx expo start
```

🌐 Web
```bash
npx expo start --web
```
⚠️ Web 실행 전, 아래 명령어로 필요한 의존성을 설치하세요:
```bash
npx expo install react-dom react-native-web @expo/metro-runtime
```
<br/>

```bash
# 실행 시 캐시 초기화 (문제 발생 시 추천)
npx expo start --clear
```
> 💡 앱이 이상하게 작동할 경우 이 명령어로 캐시를 초기화하세요.

## 📁 프로젝트 디렉토리 구조
```bash
nsg-frontend/
├── assets/                    # 앱에서 사용하는 정적 리소스
│   ├── fonts/                 # 커스텀 폰트
│   ├── icons/                 # SVG 아이콘 (예: bone.svg)
│   └── images/                # PNG 및 SVG 이미지
│
├── src/                       # 주요 기능 구현 소스
│   ├── apis/                  # API 요청 함수 정의
│   │   ├── pets.ts            
│   │   └── users.ts           
│   │
│   ├── components/            # 공통 UI 컴포넌트
│   │   ├── BoneLabelSvg.tsx
│   │   ├── CharacterNameModal.tsx
│   │   ├── CommonButton.tsx 
│   │   ├── LoadingSpinner.tsx 
│   │   └── SplashScreen.tsx
│   │
│   ├── constants/             # 전역 상수
│   │   ├── dimensions.ts      # 반응형 width/height 상수
│   │   └── endpoints.ts       # API 엔드포인트 정의
│   │
│   ├── screens/               # 화면 단위 구성
│   │   ├── InitScreen.tsx     # 앱 첫 진입 화면 + UUID 생성 + 이름 등록
│   │   └── SplashScreen.tsx       # 스플래시 화면
│
├── utils/                     # 유틸 함수 및 헬퍼 모음
│   │   └── InitScreen.tsx  # 로딩 화면 API 호출 시 자동 처리
│
├── zustand/                   # 전역 상태 관리
│   │   ├── useLoadingStore.ts      # 로딩 상태 저장/관리 
│   │   ├── useSplashStore.ts      # 스플래시 상태 저장/관리 
│   └── useUserStore.ts        # userId 상태 저장 및 AsyncStorage 연동
│
├── App.tsx                    # 앱 진입점
├── app.config.ts              # Expo 설정 파일
├── babel.config.js            # Babel 설정
├── declarations.d.ts          # SVG 및 기타 타입 선언
├── index.ts                   # 앱 실행 엔트리포인트
├── metro.config.js            # Metro 번들러 설정
├── .env.example               # 환경 변수 예시
├── .gitignore                 # Git 추적 제외 설정
├── package.json               # 프로젝트 메타 및 의존성
├── package-lock.json          # lock 파일
└── tsconfig.json              # TypeScript 설정

```
