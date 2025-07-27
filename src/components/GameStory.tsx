import React from 'react'

interface GameStoryProps {
  mode: 'free' | 'realistic'
  onContinue: () => void
}

const GameStory: React.FC<GameStoryProps> = ({ mode, onContinue }) => {
  const storyContent = {
    free: {
      title: "자유로운 가능성의 세계",
      content: [
        "1951년 7월 27일, 국군과 UN군의 압도적인 승리로 김일성은 패배를 인정할 수밖에 없었습니다.",
        "중공군은 한반도에서 완전히 철수했고, 대한민국은 주도적으로 통일을 이끌어갔습니다.",
        "패배한 김일성은 연변으로 도망쳐 정착했지만, 여전히 자신의 이상을 포기하지 못했습니다.",
        "연변에서의 첫 회의에서, 김일성은 두 가지 선택지에 직면합니다:",
        "빨치산 투쟁을 통해 다시 한반도로 돌아갈 것인지, 아니면 조선족의 수를 늘려 새로운 터전을 만들 것인지..."
      ]
    },
    realistic: {
      title: "현실적인 가능성의 세계",
      content: [
        "1951년 7월 27일, 국군과 UN군의 전술적 우위로 인해 김일성은 불가피한 패배를 맞이했습니다.",
        "중공군의 철수는 소련의 압박과 국제적 여론을 고려한 현실적인 선택이었습니다.",
        "대한민국은 주도적으로 통일을 추진했지만, 여전히 많은 정치적, 경제적 과제가 남아있었습니다.",
        "연변에 정착한 김일성은 현실적인 두 가지 선택지에 직면합니다:",
        "제한된 자원으로 빨치산 투쟁을 계속할 것인지, 아니면 조선족 공동체를 확대하여 새로운 기반을 구축할 것인지..."
      ]
    }
  }

  const currentStory = storyContent[mode]

  return (
    <div className="game-story">
      <div className="story-content">
        <h1 className="story-title">{currentStory.title}</h1>
        <div className="story-text">
          {currentStory.content.map((paragraph, index) => (
            <p key={index} className="story-paragraph">
              {paragraph}
            </p>
          ))}
        </div>
        <div className="story-date">
          <span>1951년 7월 27일 - 연변</span>
        </div>
        <button className="continue-button" onClick={onContinue}>
          계속하기
        </button>
      </div>
    </div>
  )
}

export default GameStory 