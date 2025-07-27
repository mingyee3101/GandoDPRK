import React, { useState } from 'react'
import type { Command } from '../App'

interface CommandDetailProps {
  command: Command
  onPolicyImplement: (commandId: string, policyId: string) => void
  onBack: () => void
  progress: number
}

const CommandDetail: React.FC<CommandDetailProps> = ({ 
  command, 
  onPolicyImplement, 
  onBack, 
  progress 
}) => {
  const [selectedPolicy, setSelectedPolicy] = useState<string | null>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)

  const handlePolicySelect = (policyId: string) => {
    setSelectedPolicy(policyId)
    setShowConfirmation(true)
  }

  const handleConfirmPolicy = () => {
    if (selectedPolicy) {
      onPolicyImplement(command.id, selectedPolicy)
      setSelectedPolicy(null)
      setShowConfirmation(false)
    }
  }

  const handleCancelPolicy = () => {
    setSelectedPolicy(null)
    setShowConfirmation(false)
  }

  return (
    <div className="command-detail">
      <div className="detail-content">
        <div className="detail-header">
          <button className="back-button" onClick={onBack}>
            ← 뒤로 가기
          </button>
          <div className="command-info">
            <div className="command-icon-large" style={{ color: command.color }}>
              {command.icon}
            </div>
            <div>
              <h1 className="detail-title">{command.name}</h1>
              <p className="detail-description">{command.description}</p>
            </div>
          </div>
          <div className="progress-display">
            <div className="progress-circle">
              <span className="progress-number">{progress}%</span>
            </div>
            <span className="progress-label">발전도</span>
          </div>
        </div>

        <div className="policies-section">
          <h2>정책 및 개혁</h2>
          <p className="policies-description">
            아래 정책들을 선택하여 {command.name}을 발전시킬 수 있습니다.
          </p>

          <div className="policies-grid">
            {command.policies.map((policy) => (
              <div 
                key={policy.id} 
                className={`policy-card ${selectedPolicy === policy.id ? 'selected' : ''}`}
                onClick={() => handlePolicySelect(policy.id)}
              >
                <div className="policy-header">
                  <h3>{policy.name}</h3>
                  <span className="policy-cost">{policy.cost} 포인트</span>
                </div>
                <p className="policy-description">{policy.description}</p>
                
                <div className="policy-effects">
                  <h4>예상 효과:</h4>
                  <ul>
                    {policy.effects.map((effect, index) => (
                      <li key={index} className="effect-item">✓ {effect}</li>
                    ))}
                  </ul>
                </div>

                {policy.requirements.length > 0 && (
                  <div className="policy-requirements">
                    <h4>요구사항:</h4>
                    <ul>
                      {policy.requirements.map((requirement, index) => (
                        <li key={index} className="requirement-item">⚠ {requirement}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {showConfirmation && selectedPolicy && (
          <div className="policy-confirmation">
            <div className="confirmation-content">
              <h3>정책 구현 확인</h3>
              <p>
                선택한 정책을 구현하시겠습니까? 이는 {command.name}의 발전도를 20% 증가시킵니다.
              </p>
              <div className="confirmation-buttons">
                <button 
                  className="confirm-policy-button"
                  onClick={handleConfirmPolicy}
                >
                  구현
                </button>
                <button 
                  className="cancel-policy-button"
                  onClick={handleCancelPolicy}
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="command-summary">
          <h3>현재 상태:</h3>
          <div className="summary-content">
            <div className="summary-item">
              <span className="summary-label">발전도:</span>
              <span className="summary-value">{progress}%</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">구현된 정책:</span>
              <span className="summary-value">{Math.floor(progress / 20)}개</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">남은 정책:</span>
              <span className="summary-value">{command.policies.length - Math.floor(progress / 20)}개</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CommandDetail 