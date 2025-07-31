import React, { useState } from 'react'
import type { TurnData, Event, NationalPolicy } from '../App'

interface PolicySystemProps {
  turnData: TurnData
  onActionExecute: (actionId: string, actionType: 'policy' | 'event', actionPoints: number, funds: number, useExtraFunds?: boolean) => void
  onBack: () => void
}

const PolicySystem: React.FC<PolicySystemProps> = ({ 
  turnData, 
  onActionExecute, 
  onBack 
}) => {
  const [selectedAction, setSelectedAction] = useState<string | null>(null)
  const [selectedActionType, setSelectedActionType] = useState<'policy' | 'event' | null>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [useExtraFunds, setUseExtraFunds] = useState(false)

  const formatFunds = (funds: number) => {
    if (funds >= 1000000) {
      return `${(funds / 1000000).toFixed(1)}M원`
    } else if (funds >= 1000) {
      return `${(funds / 1000).toFixed(0)}K원`
    } else {
      return `${funds.toLocaleString()}원`
    }
  }

  const getCurrentDate = () => {
    const week = turnData.currentWeek
    const year = turnData.currentYear
    const month = turnData.currentMonth // 현재 월 사용
    const weekInMonth = ((week - 1) % 4) + 1
    
    return `${year}년 ${month}월 ${weekInMonth}주차`
  }

  const handleActionSelect = (actionId: string, actionType: 'policy' | 'event') => {
    setSelectedAction(actionId)
    setSelectedActionType(actionType)
    setUseExtraFunds(false)
    setShowConfirmation(true)
  }

  const handleConfirmAction = () => {
    if (selectedAction && selectedActionType) {
      const action = selectedActionType === 'policy' 
        ? turnData.nationalPolicies.find(p => p.id === selectedAction)
        : turnData.events.find(e => e.id === selectedAction)
      
      if (action) {
        const actualActionPoints = useExtraFunds ? 5 : action.actionPoints
        const actualFunds = useExtraFunds ? action.funds * 2 : action.funds
        
        if (turnData.actionPoints >= actualActionPoints && turnData.funds >= actualFunds) {
          onActionExecute(selectedAction, selectedActionType, action.actionPoints, action.funds, useExtraFunds)
          setSelectedAction(null)
          setSelectedActionType(null)
          setShowConfirmation(false)
          setUseExtraFunds(false)
        }
      }
    }
  }

  const handleCancelAction = () => {
    setSelectedAction(null)
    setSelectedActionType(null)
    setShowConfirmation(false)
    setUseExtraFunds(false)
  }

  const getActionDisplayName = (actionId: string, actionType: 'policy' | 'event') => {
    const action = actionType === 'policy' 
      ? turnData.nationalPolicies.find(p => p.id === actionId)
      : turnData.events.find(e => e.id === actionId)
    
    if (actionType === 'policy') {
      const policy = action as NationalPolicy
      return policy?.name || '알 수 없음'
    } else {
      const event = action as Event
      return event?.title || '알 수 없음'
    }
  }

  const getActionDescription = (actionId: string, actionType: 'policy' | 'event') => {
    const action = actionType === 'policy' 
      ? turnData.nationalPolicies.find(p => p.id === actionId)
      : turnData.events.find(e => e.id === actionId)
    return action?.description || ''
  }

  const getActionPoints = (actionId: string, actionType: 'policy' | 'event') => {
    const action = actionType === 'policy' 
      ? turnData.nationalPolicies.find(p => p.id === actionId)
      : turnData.events.find(e => e.id === actionId)
    return action?.actionPoints || 0
  }

  const getActionFunds = (actionId: string, actionType: 'policy' | 'event') => {
    const action = actionType === 'policy' 
      ? turnData.nationalPolicies.find(p => p.id === actionId)
      : turnData.events.find(e => e.id === actionId)
    return action?.funds || 0
  }

  const getActionEffects = (actionId: string, actionType: 'policy' | 'event') => {
    const action = actionType === 'policy' 
      ? turnData.nationalPolicies.find(p => p.id === actionId)
      : turnData.events.find(e => e.id === actionId)
    return action?.effects || []
  }

  const getEventTypeColor = (type: 'opportunity' | 'crisis' | 'neutral') => {
    switch (type) {
      case 'opportunity': return '#27ae60'
      case 'crisis': return '#e74c3c'
      case 'neutral': return '#95a5a6'
      default: return '#95a5a6'
    }
  }

  const getEventTypeText = (type: 'opportunity' | 'crisis' | 'neutral') => {
    switch (type) {
      case 'opportunity': return '기회'
      case 'crisis': return '위기'
      case 'neutral': return '중립'
      default: return '기타'
    }
  }

  const canUseExtraFunds = (actionId: string, actionType: 'policy' | 'event') => {
    const action = actionType === 'policy' 
      ? turnData.nationalPolicies.find(p => p.id === actionId)
      : turnData.events.find(e => e.id === actionId)
    
    if (!action) return false
    
    const extraFundsCost = action.funds * 2
    return turnData.funds >= extraFundsCost && turnData.actionPoints >= 5
  }

  return (
    <div className="policy-system">
      <div className="policy-content">
        <div className="policy-header">
          <button className="back-button" onClick={onBack}>
            ← 뒤로 가기
          </button>
          <div className="policy-info">
            <h1 className="policy-title">정책 관리 시스템</h1>
            <p className="policy-subtitle">국가 정책 및 이벤트 관리</p>
            <div className="current-date">{getCurrentDate()}</div>
          </div>
          <div className="policy-resources">
            <div className="resource-display">
              <div className="resource-circle action-points-circle">
                <span className="resource-number">{turnData.actionPoints}</span>
              </div>
              <span className="resource-label">행동력</span>
            </div>
            <div className="resource-display">
              <div className="resource-circle funds-circle">
                <span className="resource-number">{formatFunds(turnData.funds)}</span>
              </div>
              <span className="resource-label">자금</span>
            </div>
          </div>
        </div>

        <div className="policy-sections">
          <div className="section">
            <h2>국가 정책</h2>
            <p className="section-description">
              행동력과 자금을 사용하여 국가 정책을 실행할 수 있습니다.
            </p>
            <div className="policy-grid">
              {turnData.nationalPolicies.map((policy) => (
                <div 
                  key={policy.id} 
                  className={`policy-card ${turnData.completedActions.includes(policy.id) ? 'completed' : ''}`}
                  onClick={() => !turnData.completedActions.includes(policy.id) && 
                    turnData.actionPoints >= policy.actionPoints &&
                    turnData.funds >= policy.funds &&
                    handleActionSelect(policy.id, 'policy')}
                >
                  <div className="policy-header">
                    <h3>{policy.name}</h3>
                    <div className="policy-type">
                      정책
                    </div>
                  </div>
                  <div className="policy-costs">
                    <span className="action-points-cost">{policy.actionPoints} AP</span>
                    <span className="funds-cost">{formatFunds(policy.funds)}</span>
                  </div>
                  <p className="policy-description">{policy.description}</p>
                  <div className="policy-effects">
                    <h4>예상 효과:</h4>
                    <ul>
                      {policy.effects.map((effect, index) => (
                        <li key={index} className="effect-item">• {effect}</li>
                      ))}
                    </ul>
                  </div>
                  {turnData.completedActions.includes(policy.id) && (
                    <div className="completed-badge">완료됨</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="section">
            <h2>이벤트</h2>
            <p className="section-description">
              다양한 이벤트에 대응하여 기회를 활용하거나 위기를 극복할 수 있습니다.
            </p>
            <div className="event-grid">
              {turnData.events.map((event) => (
                <div 
                  key={event.id} 
                  className={`event-card ${turnData.completedActions.includes(event.id) ? 'completed' : ''}`}
                  style={{ borderColor: getEventTypeColor(event.type) }}
                  onClick={() => !turnData.completedActions.includes(event.id) && 
                    turnData.actionPoints >= event.actionPoints &&
                    turnData.funds >= event.funds &&
                    handleActionSelect(event.id, 'event')}
                >
                  <div className="event-header">
                    <h3>{event.title}</h3>
                    <div className="event-type" style={{ backgroundColor: getEventTypeColor(event.type) }}>
                      {getEventTypeText(event.type)}
                    </div>
                  </div>
                  <div className="event-costs">
                    <span className="action-points-cost">{event.actionPoints} AP</span>
                    <span className="funds-cost">{formatFunds(event.funds)}</span>
                  </div>
                  <p className="event-description">{event.description}</p>
                  <div className="event-effects">
                    <h4>예상 효과:</h4>
                    <ul>
                      {event.effects.map((effect, index) => (
                        <li key={index} className="effect-item">• {effect}</li>
                      ))}
                    </ul>
                  </div>
                  {turnData.completedActions.includes(event.id) && (
                    <div className="completed-badge">완료됨</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="policy-summary">
          <h3>정책 활동 요약</h3>
          <div className="summary-content">
            <div className="summary-item">
              <span className="summary-label">남은 행동력:</span>
              <span className="summary-value">{turnData.actionPoints} / {turnData.maxActionPoints}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">완료된 활동:</span>
              <span className="summary-value">{turnData.completedActions.length}개</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">현재 턴:</span>
              <span className="summary-value">{turnData.currentTurn}</span>
            </div>
          </div>
        </div>

        {showConfirmation && selectedAction && selectedActionType && (
          <div className="policy-confirmation">
            <div className="confirmation-content">
              <h3>정책/이벤트 실행 확인</h3>
              <p>
                <strong>{getActionDisplayName(selectedAction, selectedActionType)}</strong>을(를) 실행하시겠습니까?
              </p>
              <p className="action-details">
                {getActionDescription(selectedAction, selectedActionType)}
              </p>
              <div className="action-effects-summary">
                <h4>예상 효과:</h4>
                <ul>
                  {getActionEffects(selectedAction, selectedActionType).map((effect, index) => (
                    <li key={index} className="effect-item">• {effect}</li>
                  ))}
                </ul>
              </div>
              <div className="action-costs-display">
                <div className="cost-item">
                  소모 행동력: <strong>{useExtraFunds ? 5 : getActionPoints(selectedAction, selectedActionType)}</strong>
                </div>
                <div className="cost-item">
                  소모 자금: <strong>{formatFunds(useExtraFunds ? getActionFunds(selectedAction, selectedActionType) * 2 : getActionFunds(selectedAction, selectedActionType))}</strong>
                </div>
              </div>
              {canUseExtraFunds(selectedAction, selectedActionType) && (
                <div className="extra-funds-option">
                  <label className="checkbox-label">
                    <input 
                      type="checkbox" 
                      checked={useExtraFunds}
                      onChange={(e) => setUseExtraFunds(e.target.checked)}
                    />
                    <span className="checkbox-text">자금을 2배 투자하여 행동력을 5로 줄이기</span>
                  </label>
                </div>
              )}
              <div className="confirmation-buttons">
                <button 
                  className="confirm-action-button"
                  onClick={handleConfirmAction}
                  disabled={
                    turnData.actionPoints < (useExtraFunds ? 5 : getActionPoints(selectedAction, selectedActionType)) ||
                    turnData.funds < (useExtraFunds ? getActionFunds(selectedAction, selectedActionType) * 2 : getActionFunds(selectedAction, selectedActionType))
                  }
                >
                  실행
                </button>
                <button 
                  className="cancel-action-button"
                  onClick={handleCancelAction}
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PolicySystem 