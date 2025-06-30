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
nsg-frontend-template/
├── assets/                  # 앱에서 사용하는 이미지, 아이콘 등
│   └── NSG-logo.png
│
├── App.tsx                  # 앱 진입점
├── app.json                 # Expo 설정 파일
├── .env                     # 환경 변수 파일 (.gitignore에 의해 Git 추적 제외)
├── .env.example             # 환경 변수 예시 파일
├── .gitignore               # Git 추적 제외 설정
├── package.json             # 의존성 및 스크립트 정의
├── package-lock.json
├── tsconfig.json            # TypeScript 설정
├── index.ts
└── README.md                # 프로젝트 설명 문서
```
