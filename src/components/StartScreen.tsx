import React from 'react'

interface StartScreenProps {
  onStart: () => void
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  return (
    <div className="start-screen">
      <div className="start-content">
        <h1 className="game-title">연변의 새아침</h1>
        <p className="game-subtitle">대체역사 시뮬레이션</p>
        <p className="game-description">
          1951년 7월 27일, 김일성이 국군과 UN군에 패배하여 연변으로 망명한 후의 이야기입니다.
          중공군의 한반도 철수로 인해 대한민국 주도의 통일이 이루어진 세계에서,
          연변에서 새로운 미래를 만들어가세요.
        </p>
        <button className="start-button" onClick={onStart}>
          게임 시작
        </button>
      </div>
    </div>
  )
}

export default StartScreen 