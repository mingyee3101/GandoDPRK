import React, { useState } from 'react'
import type { TurnData } from '../App'

interface TurnSystemProps {
  turnData: TurnData
  onTurnEnd: (unusedActionPoints: number, maintenancePeriod: '1month' | '3months' | '6months' | '1year') => void
  onBack: () => void
}

const TurnSystem: React.FC<TurnSystemProps> = ({ 
  turnData, 
  onTurnEnd, 
  onBack 
}) => {
  const [showTurnEnd, setShowTurnEnd] = useState(false)
  const [selectedMaintenancePeriod, setSelectedMaintenancePeriod] = useState<'1month' | '3months' | '6months' | '1year'>('1month')

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

  const handleTurnEndClick = () => {
    setShowTurnEnd(true)
  }

  const handleConfirmTurnEnd = () => {
    onTurnEnd(turnData.actionPoints, selectedMaintenancePeriod)
    setShowTurnEnd(false)
  }

  const handleCancelTurnEnd = () => {
    setShowTurnEnd(false)
  }

  const getMaintenancePeriodText = (period: '1month' | '3months' | '6months' | '1year') => {
    switch (period) {
      case '1month': return '1개월'
      case '3months': return '3개월'
      case '6months': return '6개월'
      case '1year': return '1년'
    }
  }

  return (
    <div className="turn-system">
      <div className="turn-content">
        <div className="turn-header">
          <button className="back-button" onClick={onBack}>
            ← 뒤로 가기
          </button>
          <div className="turn-info">
            <h1 className="turn-title">턴 관리 시스템</h1>
            <p className="turn-subtitle">시간 진행 및 턴 관리</p>
            <div className="turn-date">
              <span className="current-date">{getCurrentDate()}</span>
              <span className="turn-number">턴 {turnData.currentTurn}</span>
            </div>
          </div>
          <div className="turn-resources">
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

        <div className="turn-sections">
          <div className="section">
            <h2>턴 관리</h2>
            <p className="section-description">
              현재 턴을 종료하고 다음 턴으로 진행할 수 있습니다. 
              사용하지 않은 행동력은 자금으로 변환되어 다음 턴에 추가됩니다.
            </p>
            
            <div className="turn-status">
              <div className="status-item">
                <span className="status-label">현재 날짜:</span>
                <span className="status-value">{getCurrentDate()}</span>
              </div>
              <div className="status-item">
                <span className="status-label">현재 턴:</span>
                <span className="status-value">{turnData.currentTurn}</span>
              </div>
              <div className="status-item">
                <span className="status-label">남은 행동력:</span>
                <span className="status-value">{turnData.actionPoints} / {turnData.maxActionPoints}</span>
              </div>
              <div className="status-item">
                <span className="status-label">현재 자금:</span>
                <span className="status-value">{formatFunds(turnData.funds)}</span>
              </div>
            </div>

            <div className="turn-controls">
              <div className="turn-summary">
                <h3>턴 종료 시 주의사항</h3>
                <ul>
                  <li>사용하지 않은 행동력은 자금으로 변환됩니다</li>
                  <li>1주차씩 시간이 진행됩니다</li>
                  <li>새로운 달이 시작되면 회의가 있을 수 있습니다</li>
                  <li>턴이 종료되면 커멘드 센터로 돌아갑니다</li>
                </ul>
              </div>
              
              <button 
                className="turn-end-button"
                onClick={handleTurnEndClick}
              >
                턴 종료
              </button>
              
              {turnData.actionPoints >= 10 && (
                <div className="turn-warning">
                  <p>⚠️ 아직 {turnData.actionPoints}의 행동력이 남아있습니다. 턴을 종료하면 페널티가 적용될 수 있습니다.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {showTurnEnd && (
          <div className="turn-end-confirmation">
            <div className="confirmation-content">
              <h3>턴 종료 확인</h3>
              <p>
                현재 턴을 종료하고 다음 턴으로 진행하시겠습니까?
              </p>
              <div className="turn-end-details">
                <div className="detail-item">
                  <span className="detail-label">현재 날짜:</span>
                  <span className="detail-value">{getCurrentDate()}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">사용하지 않은 행동력:</span>
                  <span className="detail-value">{turnData.actionPoints}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">예상 추가 자금:</span>
                  <span className="detail-value">{formatFunds(turnData.actionPoints * 1000)}</span>
                </div>
              </div>
              
              <div className="maintenance-options">
                <h4>사용하지 않은 행동력 유지 기간:</h4>
                <div className="radio-options">
                  <label className="radio-label">
                    <input 
                      type="radio" 
                      name="maintenancePeriod" 
                      value="1month"
                      checked={selectedMaintenancePeriod === '1month'}
                      onChange={(e) => setSelectedMaintenancePeriod(e.target.value as any)}
                    />
                    <span className="radio-text">1개월 (4주차)</span>
                  </label>
                  <label className="radio-label">
                    <input 
                      type="radio" 
                      name="maintenancePeriod" 
                      value="3months"
                      checked={selectedMaintenancePeriod === '3months'}
                      onChange={(e) => setSelectedMaintenancePeriod(e.target.value as any)}
                    />
                    <span className="radio-text">3개월 (12주차)</span>
                  </label>
                  <label className="radio-label">
                    <input 
                      type="radio" 
                      name="maintenancePeriod" 
                      value="6months"
                      checked={selectedMaintenancePeriod === '6months'}
                      onChange={(e) => setSelectedMaintenancePeriod(e.target.value as any)}
                    />
                    <span className="radio-text">6개월 (24주차)</span>
                  </label>
                  <label className="radio-label">
                    <input 
                      type="radio" 
                      name="maintenancePeriod" 
                      value="1year"
                      checked={selectedMaintenancePeriod === '1year'}
                      onChange={(e) => setSelectedMaintenancePeriod(e.target.value as any)}
                    />
                    <span className="radio-text">1년 (48주차)</span>
                  </label>
                </div>
              </div>
              
              <div className="confirmation-buttons">
                <button 
                  className="confirm-turn-end-button"
                  onClick={handleConfirmTurnEnd}
                >
                  턴 종료
                </button>
                <button 
                  className="cancel-turn-end-button"
                  onClick={handleCancelTurnEnd}
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

export default TurnSystem 