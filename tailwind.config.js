/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // 기본 폰트를 Inter로 설정
      },
      colors: {
        primary: '#4A90E2',   // 기본 블루
        secondary: '#7ED321', // 보조 그린
        danger: '#D0021B',    // 보조 레드
        background: '#F4F6F8', // 배경 라이트 그레이
        'text-primary': '#333333', // 텍스트 다크 그레이
        'text-secondary': '#888888', // 텍스트 서브 그레이
      },
      boxShadow: {
        'card': '0 4px 12px rgba(0, 0, 0, 0.1)', // 카드 그림자 효과
      },
      borderRadius: {
        'card': '12px', // 카드 모서리
        'button': '8px', // 버튼 모서리
      }
    },
  },
  plugins: [],
}; 