import React from 'react'
import type { Command, CommandProgress, MeetingHistory, TurnData } from '../App'

interface CommandCenterProps {
  commands: Command[]
  onCommandSelect: (commandId: string) => void
  commandProgress: CommandProgress
  meetingHistory: MeetingHistory[]
  turnData: TurnData
  currentDate: string
}

const CommandCenter: React.FC<CommandCenterProps> = ({ 
  commands, 
  onCommandSelect, 
  commandProgress, 
  meetingHistory,
  turnData,
  currentDate
}) => {
  const formatFunds = (funds: number) => {
    if (funds >= 1000000) {
      return `${(funds / 1000000).toFixed(1)}M원`
    } else if (funds >= 1000) {
      return `${(funds / 1000).toFixed(0)}K원`
    } else {
      return `${funds.toLocaleString()}원`
    }
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
      default:
        return '알 수 없음'
    }
  }

  return (
    <div className="command-center">
      <div className="command-content">
        <div className="command-header">
          <h1 className="command-title">커멘드 센터</h1>
          <div className="command-status">
            <div className="status-item">
              <span className="status-label">현재 날짜:</span>
              <span className="status-value">{currentDate}</span>
            </div>
            <div className="status-item">
              <span className="status-label">턴:</span>
              <span className="status-value">{turnData.currentTurn}</span>
            </div>
            <div className="status-item">
              <span className="status-label">자금:</span>
              <span className="status-value funds">{formatFunds(turnData.funds)}</span>
            </div>
            <div className="status-item">
              <span className="status-label">행동력:</span>
              <span className="status-value action-points">{turnData.actionPoints} / {turnData.maxActionPoints}</span>
            </div>
          </div>
        </div>

        {meetingHistory.length > 0 && (
          <div className="meeting-summary">
            <h3>회의 결정 요약</h3>
            <div className="summary-list">
              {meetingHistory.map((meeting, index) => (
                <div key={index} className="summary-item">
                  회의 {index + 1}: {getMeetingDecisionText(meeting.decision)}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="commands-grid">
          {commands.map((command) => (
            <div 
              key={command.id} 
              className="command-card"
              style={{ borderColor: command.color }}
              onClick={() => onCommandSelect(command.id)}
            >
              <div className="command-icon" style={{ color: command.color }}>
                {command.icon}
              </div>
              <div className="command-info">
                <h3>{command.name}</h3>
                <p>{command.description}</p>
                <div className="command-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ 
                        width: `${commandProgress[command.id as keyof CommandProgress]}%`,
                        backgroundColor: command.color
                      }}
                    ></div>
                  </div>
                  <span className="progress-text">
                    {commandProgress[command.id as keyof CommandProgress]}%
                  </span>
                </div>
              </div>
              <div className="command-arrow">→</div>
            </div>
          ))}
        </div>

        <div className="command-stats">
          <h3>전체 진행 상황</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">정치</span>
              <span className="stat-value">{commandProgress.politics}%</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">외교</span>
              <span className="stat-value">{commandProgress.diplomacy}%</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">경제</span>
              <span className="stat-value">{commandProgress.economy}%</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">군사</span>
              <span className="stat-value">{commandProgress.military}%</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">연구</span>
              <span className="stat-value">{commandProgress.research}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CommandCenter 