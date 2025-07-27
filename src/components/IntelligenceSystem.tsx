import React, { useState } from 'react'
import type { IntelligenceData, IntelligenceReport } from '../App'

interface IntelligenceSystemProps {
  intelligenceData: IntelligenceData
  onIntelligenceAction: (actionId: string, intelligencePoints: number, funds: number) => void
  onBack: () => void
}

const IntelligenceSystem: React.FC<IntelligenceSystemProps> = ({ 
  intelligenceData, 
  onIntelligenceAction, 
  onBack 
}) => {
  const [selectedAction, setSelectedAction] = useState<string | null>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)

  const formatFunds = (funds: number) => {
    if (funds >= 1000000) {
      return `${(funds / 1000000).toFixed(1)}M원`
    } else if (funds >= 1000) {
      return `${(funds / 1000).toFixed(0)}K원`
    } else {
      return `${funds.toLocaleString()}원`
    }
  }

  const handleActionSelect = (actionId: string) => {
    setSelectedAction(actionId)
    setShowConfirmation(true)
  }

  const handleConfirmAction = () => {
    if (selectedAction) {
      const action = intelligenceData.intelligenceReports.find(r => r.id === selectedAction)
      
      if (action && intelligenceData.intelligencePoints >= action.intelligencePoints) {
        onIntelligenceAction(selectedAction, action.intelligencePoints, action.funds)
        setSelectedAction(null)
        setShowConfirmation(false)
      }
    }
  }

  const handleCancelAction = () => {
    setSelectedAction(null)
    setShowConfirmation(false)
  }

  const getActionDisplayName = (actionId: string) => {
    const action = intelligenceData.intelligenceReports.find(r => r.id === actionId)
    return action?.title || '알 수 없음'
  }

  const getActionDescription = (actionId: string) => {
    const action = intelligenceData.intelligenceReports.find(r => r.id === actionId)
    return action?.description || ''
  }

  const getActionPoints = (actionId: string) => {
    const action = intelligenceData.intelligenceReports.find(r => r.id === actionId)
    return action?.intelligencePoints || 0
  }

  const getActionFunds = (actionId: string) => {
    const action = intelligenceData.intelligenceReports.find(r => r.id === actionId)
    return action?.funds || 0
  }

  const getActionEffects = (actionId: string) => {
    const action = intelligenceData.intelligenceReports.find(r => r.id === actionId)
    return action?.effects || []
  }

  const getReportTypeColor = (type: 'military' | 'political' | 'economic' | 'social') => {
    switch (type) {
      case 'military': return '#e74c3c'
      case 'political': return '#3498db'
      case 'economic': return '#f39c12'
      case 'social': return '#27ae60'
      default: return '#95a5a6'
    }
  }

  const getReportTypeText = (type: 'military' | 'political' | 'economic' | 'social') => {
    switch (type) {
      case 'military': return '군사'
      case 'political': return '정치'
      case 'economic': return '경제'
      case 'social': return '사회'
      default: return '기타'
    }
  }

  return (
    <div className="intelligence-system">
      <div className="intelligence-content">
        <div className="intelligence-header">
          <button className="back-button" onClick={onBack}>
            ← 뒤로 가기
          </button>
          <div className="intelligence-info">
            <h1 className="intelligence-title">첩보 시스템</h1>
            <p className="intelligence-subtitle">정보 수집 및 첩보 활동 관리</p>
          </div>
          <div className="intelligence-resources">
            <div className="resource-display">
              <div className="resource-circle intelligence-circle">
                <span className="resource-number">{intelligenceData.intelligencePoints}</span>
              </div>
              <span className="resource-label">첩보력</span>
            </div>
            <div className="resource-display">
              <div className="resource-circle funds-circle">
                <span className="resource-number">{formatFunds(intelligenceData.funds)}</span>
              </div>
              <span className="resource-label">자금</span>
            </div>
          </div>
        </div>

        <div className="intelligence-sections">
          <div className="section">
            <h2>정보 수집 활동</h2>
            <p className="section-description">
              첩보력과 자금을 사용하여 다양한 정보를 수집할 수 있습니다.
            </p>
            <div className="intelligence-grid">
              {intelligenceData.intelligenceReports.map((report) => (
                <div 
                  key={report.id} 
                  className={`intelligence-card ${intelligenceData.completedIntelligenceActions.includes(report.id) ? 'completed' : ''}`}
                  style={{ borderColor: getReportTypeColor(report.type) }}
                  onClick={() => !intelligenceData.completedIntelligenceActions.includes(report.id) && 
                    intelligenceData.intelligencePoints >= report.intelligencePoints &&
                    handleActionSelect(report.id)}
                >
                  <div className="intelligence-header">
                    <h3>{report.title}</h3>
                    <div className="report-type" style={{ backgroundColor: getReportTypeColor(report.type) }}>
                      {getReportTypeText(report.type)}
                    </div>
                  </div>
                  <div className="intelligence-costs">
                    <span className="intelligence-cost">{report.intelligencePoints} IP</span>
                    <span className="funds-cost">{formatFunds(report.funds)}</span>
                  </div>
                  <p className="intelligence-description">{report.description}</p>
                  <div className="intelligence-effects">
                    <h4>예상 효과:</h4>
                    <ul>
                      {report.effects.map((effect, index) => (
                        <li key={index} className="effect-item">• {effect}</li>
                      ))}
                    </ul>
                  </div>
                  {intelligenceData.completedIntelligenceActions.includes(report.id) && (
                    <div className="completed-badge">완료됨</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="intelligence-summary">
          <h3>첩보 활동 요약</h3>
          <div className="summary-content">
            <div className="summary-item">
              <span className="summary-label">남은 첩보력:</span>
              <span className="summary-value">{intelligenceData.intelligencePoints} / {intelligenceData.maxIntelligencePoints}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">완료된 활동:</span>
              <span className="summary-value">{intelligenceData.completedIntelligenceActions.length}개</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">첩보 레벨:</span>
              <span className="summary-value">{intelligenceData.intelligenceLevel} / {intelligenceData.maxIntelligenceLevel}</span>
            </div>
          </div>
        </div>

        {showConfirmation && selectedAction && (
          <div className="intelligence-confirmation">
            <div className="confirmation-content">
              <h3>첩보 활동 실행 확인</h3>
              <p>
                <strong>{getActionDisplayName(selectedAction)}</strong>을(를) 실행하시겠습니까?
              </p>
              <p className="action-details">
                {getActionDescription(selectedAction)}
              </p>
              <div className="action-effects-summary">
                <h4>예상 효과:</h4>
                <ul>
                  {getActionEffects(selectedAction).map((effect, index) => (
                    <li key={index} className="effect-item">• {effect}</li>
                  ))}
                </ul>
              </div>
              <div className="action-costs-display">
                <div className="cost-item">
                  소모 첩보력: <strong>{getActionPoints(selectedAction)}</strong>
                </div>
                <div className="cost-item">
                  소모 자금: <strong>{formatFunds(getActionFunds(selectedAction))}</strong>
                </div>
              </div>
              <div className="confirmation-buttons">
                <button 
                  className="confirm-action-button"
                  onClick={handleConfirmAction}
                  disabled={
                    intelligenceData.intelligencePoints < getActionPoints(selectedAction) ||
                    intelligenceData.funds < getActionFunds(selectedAction)
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

export default IntelligenceSystem 