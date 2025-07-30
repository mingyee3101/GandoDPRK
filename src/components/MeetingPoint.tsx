import React, { useState } from 'react'
import type { Meeting, MeetingHistory } from '../App'

interface MeetingPointProps {
  meeting: Meeting
  onDecision: (meetingId: string, decision: string, effects: string[]) => void
  meetingHistory: MeetingHistory[]
  currentMeetingIndex: number
  totalMeetings: number
}

const MeetingPoint: React.FC<MeetingPointProps> = ({ 
  meeting, 
  onDecision, 
  meetingHistory,
  currentMeetingIndex,
  totalMeetings
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)

  const handleOptionClick = (optionId: string) => {
    setSelectedOption(optionId)
    setShowConfirmation(true)
  }

  const handleConfirmDecision = () => {
    if (selectedOption) {
      const selectedOptionData = meeting.options.find(o => o.id === selectedOption)
      if (selectedOptionData) {
        onDecision(meeting.id, selectedOption, selectedOptionData.effects)
        // 결정 후 모달 자동 닫기
        setSelectedOption(null)
        setShowConfirmation(false)
      }
    }
  }

  const handleCancelDecision = () => {
    setSelectedOption(null)
    setShowConfirmation(false)
  }

  const getPreviousMeetingEffects = () => {
    if (meetingHistory.length === 0) return []
    
    const lastMeeting = meetingHistory[meetingHistory.length - 1]
    return lastMeeting.effects
  }

  const getMeetingDecisionText = (decision: string) => {
    switch (decision) {
      case 'guerrilla_focus':
        return '빨치산 투쟁 중심'
      case 'community_focus':
        return '조선족 공동체 확대'
      case 'military_investment':
        return '군사력 강화'
      case 'economic_development':
        return '경제 발전'
      case 'pro_soviet':
        return '소련 중심 외교'
      case 'pro_china_diplomacy':
        return '친중 외교'
      case 'centralized_leadership':
        return '중앙집권적 지도'
      case 'collective_leadership':
        return '집단 지도 체제'
      case 'planned_economy':
        return '계획 경제'
      case 'market_economy':
        return '시장 경제'
      case 'ideological_education':
        return '이념 교육 중심'
      case 'practical_education':
        return '실용 교육 중심'
      case 'cultural_preservation':
        return '문화 보존'
      case 'cultural_integration':
        return '문화 융합'
      case 'defensive_strategy':
        return '방어 전략'
      case 'offensive_strategy':
        return '공세 전략'
      case 'military_technology':
        return '군사 기술'
      case 'civilian_technology':
        return '민간 기술'
      case 'soviet_alliance':
        return '소련 동맹 강화'
      case 'multilateral_diplomacy':
        return '다자간 외교'
      case 'welfare_state':
        return '복지 국가'
      case 'self_reliance':
        return '자립 정책'
      case 'unification_goal':
        return '통일 목표'
      case 'regional_power':
        return '지역 강국'
      case 'authoritarian_system':
        return '권위주의 체제'
      case 'democratic_system':
        return '민주적 체제'
      default:
        return '알 수 없음'
    }
  }

  const getSelectedOptionData = () => {
    if (!selectedOption) return null
    return meeting.options.find(o => o.id === selectedOption)
  }

  return (
    <div className="meeting-point">
      <div className="meeting-content">
        <div className="meeting-header">
          <div className="meeting-progress">
            {currentMeetingIndex + 1} / {totalMeetings}
          </div>
          <h1 className="meeting-title">{meeting.title}</h1>
          <p className="meeting-description">{meeting.description}</p>
        </div>

        {getPreviousMeetingEffects().length > 0 && (
          <div className="previous-effects">
            <h3>이전 회의의 효과</h3>
            <div className="effects-list">
              {getPreviousMeetingEffects().map((effect, index) => (
                <span key={index} className="effect-tag">{effect}</span>
              ))}
            </div>
          </div>
        )}

        <div className="meeting-options">
          {meeting.options.map((option) => (
            <div 
              key={option.id}
              className="meeting-option"
              onClick={() => handleOptionClick(option.id)}
            >
              <h3>{option.title}</h3>
              <p>{option.description}</p>
              <div className="option-details">
                <div className="effects">
                  <h4>예상 효과</h4>
                  <ul>
                    {option.effects.map((effect, index) => (
                      <li key={index} className="effect-item">{effect}</li>
                    ))}
                  </ul>
                </div>
                <div className="consequences">
                  <h4>예상 결과</h4>
                  <ul>
                    {option.consequences.map((consequence, index) => (
                      <li key={index} className="consequence-item">{consequence}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {meetingHistory.length > 0 && (
          <div className="meeting-history">
            <h3>이전 회의 결정</h3>
            <div className="history-list">
              {meetingHistory.map((history, index) => (
                <div key={index} className="history-item">
                  <span className="history-meeting">
                    회의 {index + 1}: {getMeetingDecisionText(history.decision)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 결정 확인 팝업 모달 */}
      {showConfirmation && selectedOption && (
        <div className="decision-modal-overlay">
          <div className="decision-modal">
            <div className="modal-header">
              <h2>결정 확인</h2>
              <button className="modal-close" onClick={handleCancelDecision}>
                ×
              </button>
            </div>
            <div className="modal-content">
              <div className="selected-option-info">
                <h3>{getSelectedOptionData()?.title}</h3>
                <p className="option-description">{getSelectedOptionData()?.description}</p>
              </div>
              
              <div className="option-effects">
                <h4>예상 효과</h4>
                <ul>
                  {getSelectedOptionData()?.effects.map((effect, index) => (
                    <li key={index} className="effect-item">• {effect}</li>
                  ))}
                </ul>
              </div>
              
              <div className="option-consequences">
                <h4>예상 결과</h4>
                <ul>
                  {getSelectedOptionData()?.consequences.map((consequence, index) => (
                    <li key={index} className="consequence-item">• {consequence}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="modal-actions">
              <button className="confirm-button" onClick={handleConfirmDecision}>
                채택
              </button>
              <button className="cancel-button" onClick={handleCancelDecision}>
                다시 선택
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MeetingPoint 