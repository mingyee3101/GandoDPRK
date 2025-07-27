import React from 'react'

interface GameModeProps {
  onModeSelect: (mode: 'free' | 'realistic') => void
}

const GameMode: React.FC<GameModeProps> = ({ onModeSelect }) => {
  return (
    <div className="game-mode">
      <div className="mode-content">
        <h1 className="mode-title">게임 모드를 선택하세요</h1>
        <p className="mode-description">
          어떤 방식으로 대체역사를 경험하고 싶으신가요?
        </p>
        
        <div className="mode-options">
          <div className="mode-card" onClick={() => onModeSelect('free')}>
            <h2>자유로운 가능성</h2>
            <p>
              더 자유롭고 창의적인 선택이 가능한 모드입니다.
              역사적 제약에서 벗어나 다양한 가능성을 탐험해보세요.
            </p>
            <div className="mode-features">
              <span>• 더 많은 선택지</span>
              <span>• 창의적인 결과</span>
              <span>• 자유로운 스토리 전개</span>
            </div>
          </div>
          
          <div className="mode-card" onClick={() => onModeSelect('realistic')}>
            <h2>현실적인 가능성</h2>
            <p>
              실제 역사적 맥락을 고려한 현실적인 선택지들입니다.
              당시의 정치적, 경제적 상황을 반영한 결정을 내려보세요.
            </p>
            <div className="mode-features">
              <span>• 역사적 정확성</span>
              <span>• 현실적인 제약</span>
              <span>• 정치적 고려사항</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GameMode 