import { useState } from 'react'
import './App.css'
import StartScreen from './components/StartScreen'
import GameMode from './components/GameMode'
import GameStory from './components/GameStory'
import MeetingPoint from './components/MeetingPoint'
import CommandCenter from './components/CommandCenter'
import CommandDetail from './components/CommandDetail'
import TurnSystem from './components/TurnSystem'
import IntelligenceSystem from './components/IntelligenceSystem'

export type GameState = {
  currentScreen: 'start' | 'mode' | 'story' | 'meeting' | 'command' | 'command-detail' | 'turn' | 'intelligence' | 'policy'
  selectedMode: 'free' | 'realistic' | null
  currentStory: number
  currentMeeting: number
  decisions: string[]
  meetingHistory: MeetingHistory[]
  selectedCommand: string | null
  commandProgress: CommandProgress
  turnData: TurnData
}

export type MeetingHistory = {
  meetingId: string
  decision: string
  effects: string[]
  timestamp: number
}

export type Meeting = {
  id: string
  title: string
  description: string
  options: MeetingOption[]
  mode: 'free' | 'realistic'
  month: number // 몇 번째 달의 회의인지
}

export type MeetingOption = {
  id: string
  title: string
  description: string
  effects: string[]
  consequences: string[]
}

export type CommandProgress = {
  politics: number
  diplomacy: number
  economy: number
  military: number
  research: number
}

export type Command = {
  id: string
  name: string
  description: string
  icon: string
  color: string
  policies: Policy[]
}

export type Policy = {
  id: string
  name: string
  description: string
  cost: number
  effects: string[]
  requirements: string[]
  unlocked: boolean
}

export type TurnData = {
  currentTurn: number
  currentWeek: number
  currentYear: number
  currentMonth: number
  actionPoints: number
  maxActionPoints: number
  funds: number
  taxIncome: number
  events: Event[]
  nationalPolicies: NationalPolicy[]
  completedActions: string[]
  unusedActionPoints: number
  intelligenceData?: IntelligenceData
}

export type Event = {
  id: string
  title: string
  description: string
  type: 'opportunity' | 'crisis' | 'neutral'
  actionPoints: number
  funds: number
  effects: string[]
  requirements: string[]
  available: boolean
}

export type NationalPolicy = {
  id: string
  name: string
  description: string
  actionPoints: number
  funds: number
  effects: string[]
  requirements: string[]
  available: boolean
}

export type IntelligenceData = {
  intelligenceLevel: number
  maxIntelligenceLevel: number
  intelligencePoints: number
  maxIntelligencePoints: number
  intelligenceReports: IntelligenceReport[]
  completedIntelligenceActions: string[]
  funds: number
}

export type IntelligenceReport = {
  id: string
  title: string
  description: string
  type: 'military' | 'political' | 'economic' | 'social'
  intelligencePoints: number
  funds: number
  effects: string[]
  requirements: string[]
  available: boolean
}

function App() {
  const [gameState, setGameState] = useState<GameState>({
    currentScreen: 'start',
    selectedMode: null,
    currentStory: 0,
    currentMeeting: 0,
    decisions: [],
    meetingHistory: [],
    selectedCommand: null,
    commandProgress: {
      politics: 0,
      diplomacy: 0,
      economy: 0,
      military: 0,
      research: 0
    },
    turnData: {
      currentTurn: 1,
      currentWeek: 1,
      currentYear: 1951,
      currentMonth: 3, // 3월부터 시작
      actionPoints: 100,
      maxActionPoints: 100,
      funds: 1000000,
      taxIncome: 50000, // 초기 세금 수입
      events: [],
      nationalPolicies: [],
      completedActions: [],
      unusedActionPoints: 0
    }
  })

  const [showNewYearMessage, setShowNewYearMessage] = useState(false)
  const [showNewYearWarning, setShowNewYearWarning] = useState(false)
  const [isNewYearTurn, setIsNewYearTurn] = useState(false)
  const [showSeasonMessage, setShowSeasonMessage] = useState(false)
  const [currentSeason, setCurrentSeason] = useState<string>('')
  const [lastCheckedMonth, setLastCheckedMonth] = useState<number>(3) // 3월부터 시작하므로 3월로 초기화

  const checkSeasonChange = (newMonth: number) => {
    const newSeason = getSeasonByMonth(newMonth)
    const oldSeason = getSeasonByMonth(gameState.turnData.currentMonth)
    
    if (newSeason !== oldSeason) {
      setCurrentSeason(newSeason)
      setShowSeasonMessage(true)
      setLastCheckedMonth(newMonth)
      // 스크롤을 맨 위로 이동
      window.scrollTo(0, 0)
      setTimeout(() => {
        setShowSeasonMessage(false)
        // 계절 팝업이 자동으로 닫힌 후 1월이나 7월이면 회의 화면으로 이동
        if (newMonth === 1 || newMonth === 7) {
          setGameState(prev => ({
            ...prev,
            currentScreen: 'meeting'
          }))
        }
      }, 10000) // 10초 후 자동으로 숨김
    }
  }

  const checkNewYear = (newYear: number, oldYear: number) => {
    if (newYear > oldYear) {
      setShowNewYearMessage(true)
      setIsNewYearTurn(true)
      // 스크롤을 맨 위로 이동
      window.scrollTo(0, 0)
      setTimeout(() => {
        setShowNewYearMessage(false)
        // 새해 팝업이 자동으로 닫힌 후 1월이면 회의 화면으로 이동
        const currentMonth = gameState.turnData.currentMonth
        if (currentMonth === 1) {
          setGameState(prev => ({
            ...prev,
            currentScreen: 'meeting'
          }))
        }
      }, 10000) // 10초 후 자동으로 숨김
    }
  }

  const getSeasonByMonth = (month: number) => {
    if (month >= 3 && month <= 5) return '봄'
    if (month >= 6 && month <= 8) return '여름'
    if (month >= 9 && month <= 11) return '가을'
    return '겨울'
  }

  const handleNewYearWarningConfirm = () => {
    setShowNewYearWarning(false)
    setIsNewYearTurn(false)
    
    // 페널티 적용 (새해 턴이거나 행동을 완료하지 않은 경우)
    const hasUnusedActionPoints = gameState.turnData.actionPoints > 0
    const hasCompletedActions = gameState.turnData.completedActions.length > 0
    
    if (isNewYearTurn || hasUnusedActionPoints || !hasCompletedActions) {
      setGameState(prev => ({
        ...prev,
        turnData: {
          ...prev.turnData,
          actionPoints: Math.floor(prev.turnData.actionPoints * 0.9), // 행동력 10% 감소
          taxIncome: Math.floor(prev.turnData.taxIncome * 0.95) // 세금 수입 5% 감소
        }
      }))
    }
    
    handleNormalTurnEnd()
  }

  const handleNewYearWarningCancel = () => {
    setShowNewYearWarning(false)
  }

  const handleNormalTurnEnd = () => {
    // 기존의 턴 종료 로직
    setGameState(prev => {
      const newMonth = prev.turnData.currentMonth + 1
      const newYear = prev.turnData.currentYear + Math.floor((newMonth - 1) / 12)
      const adjustedMonth = ((newMonth - 1) % 12) + 1
      
      // 새해 체크
      checkNewYear(newYear, prev.turnData.currentYear)
      
      // 계절 체크
      checkSeasonChange(adjustedMonth)
      
      // 1월과 7월에만 회의가 있는지 확인
      const hasNewMeetings = adjustedMonth === 1 || adjustedMonth === 7
      
      // 팝업이 표시 중이면 커멘드 화면으로 이동, 그렇지 않으면 회의 또는 커멘드 화면으로 이동
      const nextScreen = (hasNewMeetings && !showSeasonMessage && !showNewYearMessage) ? 'meeting' : 'command'
      
      return {
        ...prev,
        currentScreen: nextScreen,
        turnData: {
          ...prev.turnData,
          currentTurn: prev.turnData.currentTurn + 1,
          currentWeek: 1,
          currentYear: newYear,
          currentMonth: adjustedMonth,
          actionPoints: prev.turnData.maxActionPoints,
          completedActions: [],
          unusedActionPoints: 0
        },
        currentMeeting: hasNewMeetings ? 0 : prev.currentMeeting
      }
    })
    
    // 턴 넘길 때마다 스크롤을 맨 위로 올림
    setTimeout(() => {
      window.scrollTo(0, 0)
    }, 100)
  }

  const getMeetingsForMonth = (month: number): Meeting[] => {
    const baseMeetings: Meeting[] = [
      {
        id: 'first_meeting',
        title: '첫 번째 회의: 연변 정착 방향',
        description: '연변에 정착한 김일성은 첫 번째 회의를 열고 앞으로의 방향을 결정해야 합니다.',
        mode: 'free',
        month: 1,
        options: [
          {
            id: 'guerrilla_focus',
            title: '빨치산 투쟁 중심',
            description: '한반도로 돌아가기 위한 빨치산 투쟁을 중심으로 활동합니다.',
            effects: ['무장 세력 조직', '한반도 침투 계획', '국제 지원 모색'],
            consequences: ['높은 위험성', '자원 소모', '국제적 주목']
          },
          {
            id: 'community_focus',
            title: '조선족 공동체 확대',
            description: '연변에서 조선족 공동체를 확대하여 새로운 기반을 구축합니다.',
            effects: ['조선족 이주 유치', '경제 기반 구축', '문화 정체성 보존'],
            consequences: ['장기적 안정성', '목표 달성 어려움', '중국 정부 협력']
          }
        ]
      },
      {
        id: 'second_meeting',
        title: '두 번째 회의: 자원 배분',
        description: '제한된 자원을 어떻게 배분할지 결정해야 합니다.',
        mode: 'realistic',
        month: 1,
        options: [
          {
            id: 'military_investment',
            title: '군사력 강화',
            description: '가용 자원의 대부분을 군사력 강화에 투자합니다.',
            effects: ['무장 세력 확대', '전투력 향상', '군사 훈련 강화'],
            consequences: ['경제적 어려움', '민간 지원 부족', '국제적 압박']
          },
          {
            id: 'economic_development',
            title: '경제 발전',
            description: '자원을 경제 발전과 인프라 구축에 투자합니다.',
            effects: ['경제 기반 확대', '민생 개선', '지속가능한 발전'],
            consequences: ['군사력 약화', '목표 달성 지연', '안정적 성장']
          }
        ]
      },
      {
        id: 'third_meeting',
        title: '세 번째 회의: 외교 정책',
        description: '국제 사회와의 관계를 어떻게 설정할지 결정합니다.',
        mode: 'free',
        month: 1,
        options: [
          {
            id: 'pro_soviet',
            title: '소련 중심 외교',
            description: '소련과의 관계를 우선시하고 소련의 지원을 받습니다.',
            effects: ['소련 지원 확보', '군사 기술 이전', '정치적 보호'],
            consequences: ['소련 의존성', '자주성 상실', '국제적 고립']
          },
          {
            id: 'pro_china_diplomacy',
            title: '친중 외교',
            description: '중국과의 관계를 우선시하고 중국의 지원을 받습니다.',
            effects: ['중국 지원 확보', '경제 협력 강화', '지리적 이점'],
            consequences: ['중국 의존성', '자주성 제한', '국제적 고립']
          }
        ]
      }
    ]

    // 2달차 회의들
    const secondMonthMeetings: Meeting[] = [
      {
        id: 'fourth_meeting',
        title: '네 번째 회의: 내부 조직',
        description: '연변 내부 조직 체계를 어떻게 구성할지 결정합니다.',
        mode: 'realistic',
        month: 2,
        options: [
          {
            id: 'centralized_leadership',
            title: '중앙집권적 지도',
            description: '김일성을 중심으로 한 강력한 중앙집권 체제를 구축합니다.',
            effects: ['의사결정 속도 향상', '정치적 안정성', '지도력 강화'],
            consequences: ['개인 숭배', '민주성 부족', '지도자 의존']
          },
          {
            id: 'collective_leadership',
            title: '집단 지도 체제',
            description: '여러 지도자들이 협의하여 의사결정하는 체제를 만듭니다.',
            effects: ['민주적 의사결정', '다양한 의견 수렴', '지도자 교체 용이'],
            consequences: ['의사결정 지연', '내부 갈등 가능성', '정치적 불안정']
          }
        ]
      },
      {
        id: 'fifth_meeting',
        title: '다섯 번째 회의: 경제 정책',
        description: '연변의 경제 발전 방향을 결정합니다.',
        mode: 'free',
        month: 2,
        options: [
          {
            id: 'planned_economy',
            title: '계획 경제',
            description: '중앙에서 모든 경제 활동을 계획하고 관리합니다.',
            effects: ['자원 효율적 배분', '빠른 산업화', '경제 안정성'],
            consequences: ['시장 메커니즘 부족', '혁신성 저하', '비효율성']
          },
          {
            id: 'market_economy',
            title: '시장 경제',
            description: '시장 메커니즘을 활용한 경제 발전을 추구합니다.',
            effects: ['경제 활성화', '혁신 촉진', '효율성 향상'],
            consequences: ['경제 불평등', '불안정성', '자원 낭비']
          }
        ]
      }
    ]

    // 3달차 회의들
    const thirdMonthMeetings: Meeting[] = [
      {
        id: 'sixth_meeting',
        title: '여섯 번째 회의: 교육 정책',
        description: '연변의 교육 체계를 어떻게 구축할지 결정합니다.',
        mode: 'realistic',
        month: 3,
        options: [
          {
            id: 'ideological_education',
            title: '이념 교육 중심',
            description: '정치 이념과 사상을 중심으로 한 교육을 실시합니다.',
            effects: ['정치적 통일성', '이념 확산', '지도자 숭배'],
            consequences: ['학문적 자유 부족', '창의성 저하', '국제적 고립']
          },
          {
            id: 'practical_education',
            title: '실용 교육 중심',
            description: '실무 능력과 기술을 중심으로 한 교육을 실시합니다.',
            effects: ['기술 발전', '실무 능력 향상', '경제 발전'],
            consequences: ['이념 교육 부족', '정치적 통일성 저하', '목표 달성 지연']
          }
        ]
      },
      {
        id: 'seventh_meeting',
        title: '일곱 번째 회의: 문화 정책',
        description: '조선족 문화를 어떻게 보존하고 발전시킬지 결정합니다.',
        mode: 'free',
        month: 3,
        options: [
          {
            id: 'cultural_preservation',
            title: '문화 보존',
            description: '전통 조선족 문화를 철저히 보존하고 계승합니다.',
            effects: ['문화 정체성 유지', '민족 의식 강화', '전통 계승'],
            consequences: ['문화적 폐쇄성', '현대화 지연', '외부 문화 배제']
          },
          {
            id: 'cultural_integration',
            title: '문화 융합',
            description: '중국 문화와 조선족 문화를 융합하여 새로운 문화를 만듭니다.',
            effects: ['문화적 다양성', '현대화 촉진', '국제적 교류'],
            consequences: ['전통 문화 훼손', '정체성 혼란', '민족 의식 약화']
          }
        ]
      }
    ]

    // 4달차 회의들
    const fourthMonthMeetings: Meeting[] = [
      {
        id: 'eighth_meeting',
        title: '여덟 번째 회의: 군사 전략',
        description: '연변의 군사 전략을 어떻게 수립할지 결정합니다.',
        mode: 'realistic',
        month: 4,
        options: [
          {
            id: 'defensive_strategy',
            title: '방어 전략',
            description: '연변 지역을 지키는 방어 중심의 군사 전략을 수립합니다.',
            effects: ['지역 안정성', '자원 절약', '평화적 발전'],
            consequences: ['공세 능력 부족', '목표 달성 어려움', '약세 이미지']
          },
          {
            id: 'offensive_strategy',
            title: '공세 전략',
            description: '한반도 진출을 위한 공세적 군사 전략을 수립합니다.',
            effects: ['공세 능력 확보', '목표 달성 가능성', '강력한 이미지'],
            consequences: ['높은 위험성', '자원 대량 소모', '국제적 압박']
          }
        ]
      },
      {
        id: 'ninth_meeting',
        title: '아홉 번째 회의: 기술 발전',
        description: '연변의 기술 발전 방향을 결정합니다.',
        mode: 'free',
        month: 4,
        options: [
          {
            id: 'military_technology',
            title: '군사 기술',
            description: '군사 기술 발전에 집중하여 군사력을 강화합니다.',
            effects: ['군사력 강화', '국방력 향상', '전략적 우위'],
            consequences: ['민간 기술 부족', '경제 발전 지연', '자원 낭비']
          },
          {
            id: 'civilian_technology',
            title: '민간 기술',
            description: '민간 기술 발전에 집중하여 경제를 발전시킵니다.',
            effects: ['경제 발전', '민생 개선', '지속가능한 성장'],
            consequences: ['군사력 약화', '국방력 저하', '전략적 열세']
          }
        ]
      }
    ]

    // 5달차 회의들
    const fifthMonthMeetings: Meeting[] = [
      {
        id: 'tenth_meeting',
        title: '열 번째 회의: 외교 확장',
        description: '연변의 외교 관계를 어떻게 확장할지 결정합니다.',
        mode: 'realistic',
        month: 5,
        options: [
          {
            id: 'soviet_alliance',
            title: '소련 동맹 강화',
            description: '소련과의 동맹 관계를 더욱 강화하여 지원을 확대합니다.',
            effects: ['대규모 지원 확보', '기술 이전', '정치적 보호'],
            consequences: ['소련 의존성', '자주성 상실', '다른 국가와의 관계 악화']
          },
          {
            id: 'multilateral_diplomacy',
            title: '다자간 외교',
            description: '여러 국가와의 관계를 동시에 발전시켜 외교적 균형을 맞춥니다.',
            effects: ['다양한 파트너십', '자주성 확보', '국제적 인정'],
            consequences: ['자원 분산', '복잡한 외교', '효율성 저하']
          }
        ]
      },
      {
        id: 'eleventh_meeting',
        title: '열한 번째 회의: 사회 정책',
        description: '연변의 사회 복지와 민생 정책을 결정합니다.',
        mode: 'free',
        month: 5,
        options: [
          {
            id: 'welfare_state',
            title: '복지 국가',
            description: '포괄적인 사회 복지 체계를 구축하여 민생을 개선합니다.',
            effects: ['민생 개선', '사회 안정', '지지도 증가'],
            consequences: ['정부 지출 증가', '경제 부담', '의존성 증가']
          },
          {
            id: 'self_reliance',
            title: '자립 정책',
            description: '개인의 자립과 책임을 강조하는 정책을 실시합니다.',
            effects: ['자립 의식 강화', '정부 부담 감소', '경제 효율성'],
            consequences: ['사회적 불평등', '민생 악화', '지지도 하락']
          }
        ]
      }
    ]

    // 6달차 회의들
    const sixthMonthMeetings: Meeting[] = [
      {
        id: 'twelfth_meeting',
        title: '열두 번째 회의: 미래 계획',
        description: '연변의 장기적 발전 계획을 수립합니다.',
        mode: 'realistic',
        month: 6,
        options: [
          {
            id: 'unification_goal',
            title: '통일 목표',
            description: '한반도 통일을 최종 목표로 하는 장기 계획을 수립합니다.',
            effects: ['명확한 목표', '국민 동원', '국제적 주목'],
            consequences: ['높은 위험성', '장기적 투자', '국제적 압박']
          },
          {
            id: 'regional_power',
            title: '지역 강국',
            description: '연변을 중심으로 한 지역 강국 건설을 목표로 합니다.',
            effects: ['지역 안정성', '경제 발전', '국제적 영향력'],
            consequences: ['목표 달성 어려움', '자원 소모', '주변국 반발']
          }
        ]
      },
      {
        id: 'thirteenth_meeting',
        title: '열세 번째 회의: 체제 정비',
        description: '연변의 정치 체제를 어떻게 정비할지 결정합니다.',
        mode: 'free',
        month: 6,
        options: [
          {
            id: 'authoritarian_system',
            title: '권위주의 체제',
            description: '강력한 중앙집권 체제를 구축하여 효율적인 통치를 실현합니다.',
            effects: ['의사결정 속도', '정치적 안정성', '정책 실행력'],
            consequences: ['민주성 부족', '개인 숭배', '부정부패']
          },
          {
            id: 'democratic_system',
            title: '민주적 체제',
            description: '민주적 의사결정 과정을 도입하여 시민 참여를 확대합니다.',
            effects: ['민주성 확보', '시민 참여', '정치적 투명성'],
            consequences: ['의사결정 지연', '정치적 불안정', '정책 실행력 저하']
          }
        ]
      }
    ]

    const allMeetings = [
      ...baseMeetings,
      ...secondMonthMeetings,
      ...thirdMonthMeetings,
      ...fourthMonthMeetings,
      ...fifthMonthMeetings,
      ...sixthMonthMeetings
    ]

    return allMeetings.filter(meeting => meeting.month <= month)
  }

  const getCurrentMonth = () => {
    const month = gameState.turnData.currentMonth
    // 1월과 7월에만 회의
    if (month === 1 || month === 7) {
      return Math.floor((month - 1) / 6) + 1 // 1월은 1번째, 7월은 2번째 회의
    }
    return 0 // 회의가 없는 달
  }

  const getCurrentSeason = () => {
    const month = gameState.turnData.currentMonth
    if (month >= 3 && month <= 5) return '봄'
    if (month >= 6 && month <= 8) return '여름'
    if (month >= 9 && month <= 11) return '가을'
    return '겨울'
  }

  const getCurrentDate = () => {
    const month = gameState.turnData.currentMonth
    const year = gameState.turnData.currentYear
    const season = getCurrentSeason()
    
    return `${year}년 ${month}월 (${season})`
  }

  const getAvailableMeetings = () => {
    const currentMonth = getCurrentMonth()
    if (currentMonth === 0) return [] // 회의가 없는 달
    return getMeetingsForMonth(currentMonth)
  }

  const commands: Command[] = [
    {
      id: 'politics',
      name: '정치 커멘드',
      description: '내부 정치 체계와 지도력 강화',
      icon: '🏛️',
      color: '#e74c3c',
      policies: [
        {
          id: 'centralization',
          name: '중앙집권화',
          description: '정치 권력을 중앙에 집중시켜 효율적인 의사결정을 만듭니다.',
          cost: 100,
          effects: ['의사결정 속도 향상', '정치적 안정성 증가', '지도력 강화'],
          requirements: [],
          unlocked: true
        },
        {
          id: 'democratization',
          name: '민주화 개혁',
          description: '민주적 의사결정 과정을 도입하여 지지도를 높입니다.',
          cost: 150,
          effects: ['민간 지지도 증가', '정치적 투명성', '사회 안정'],
          requirements: [],
          unlocked: true
        }
      ]
    },
    {
      id: 'diplomacy',
      name: '외교 커멘드',
      description: '국제 관계와 외교 정책 수립',
      icon: '🌍',
      color: '#3498db',
      policies: [
        {
          id: 'soviet_alliance',
          name: '소련 동맹 강화',
          description: '소련과의 동맹 관계를 더욱 강화합니다.',
          cost: 120,
          effects: ['군사 지원 확대', '기술 이전', '정치적 보호'],
          requirements: [],
          unlocked: true
        },
        {
          id: 'multilateral_diplomacy',
          name: '다자간 외교',
          description: '여러 국가와의 관계를 동시에 발전시킵니다.',
          cost: 200,
          effects: ['다양한 파트너십', '자주성 확보', '국제적 인정'],
          requirements: [],
          unlocked: true
        }
      ]
    },
    {
      id: 'economy',
      name: '경제 커멘드',
      description: '경제 발전과 인프라 구축',
      icon: '💰',
      color: '#f39c12',
      policies: [
        {
          id: 'industrialization',
          name: '산업화',
          description: '기본 산업을 발전시켜 경제 기반을 확대합니다.',
          cost: 150,
          effects: ['생산력 증가', '고용 창출', '경제 성장'],
          requirements: [],
          unlocked: true
        },
        {
          id: 'agricultural_reform',
          name: '농업 개혁',
          description: '농업 생산성을 향상시켜 식량 자급자족을 달성합니다.',
          cost: 100,
          effects: ['식량 자급자족', '농민 지지', '사회 안정'],
          requirements: [],
          unlocked: true
        }
      ]
    },
    {
      id: 'military',
      name: '군사 커멘드',
      description: '군사력 강화와 전략 수립',
      icon: '⚔️',
      color: '#8e44ad',
      policies: [
        {
          id: 'modernization',
          name: '군사 현대화',
          description: '최신 무기와 전술을 도입하여 군사력을 강화합니다.',
          cost: 200,
          effects: ['전투력 향상', '기술적 우위', '국방력 강화'],
          requirements: [],
          unlocked: true
        },
        {
          id: 'guerrilla_training',
          name: '빨치산 훈련',
          description: '특수 작전과 빨치산 전술을 전문적으로 훈련시킵니다.',
          cost: 120,
          effects: ['특수 작전 능력', '유연한 전술', '침투 작전'],
          requirements: [],
          unlocked: true
        }
      ]
    },
    {
      id: 'research',
      name: '연구 커멘드',
      description: '기술 발전과 연구 개발',
      icon: '🔬',
      color: '#27ae60',
      policies: [
        {
          id: 'technology_center',
          name: '기술 연구소',
          description: '최신 기술을 연구하고 개발하는 연구소를 건설합니다.',
          cost: 180,
          effects: ['기술 발전', '혁신 능력', '경쟁력 향상'],
          requirements: [],
          unlocked: true
        },
        {
          id: 'education_reform',
          name: '교육 개혁',
          description: '교육 체계를 개혁하여 인재를 양성합니다.',
          cost: 100,
          effects: ['인재 양성', '지식 수준 향상', '장기적 발전'],
          requirements: [],
          unlocked: true
        }
      ]
    },
    {
      id: 'policy_system',
      name: '정책 관리 커멘드',
      description: '국가 정책 및 이벤트 관리',
      icon: '📋',
      color: '#e67e22',
      policies: [
        {
          id: 'policy_management',
          name: '정책 관리 시스템',
          description: '국가 정책과 이벤트 실행',
          cost: 0,
          effects: ['정책 실행', '이벤트 관리', '국가 운영'],
          requirements: [],
          unlocked: true
        }
      ]
    },
    {
      id: 'intelligence_system',
      name: '첩보 커멘드',
      description: '정보 수집 및 첩보 활동 관리',
      icon: '🕵️',
      color: '#34495e',
      policies: [
        {
          id: 'intelligence_network',
          name: '첩보망 구축',
          description: '정보 수집을 위한 첩보망을 구축합니다.',
          cost: 0,
          effects: ['정보 수집', '상황 파악', '전략 수립'],
          requirements: [],
          unlocked: true
        }
      ]
    },
    {
      id: 'turn_system',
      name: '턴 관리 커멘드',
      description: '턴 진행 및 시간 관리',
      icon: '⏰',
      color: '#9b59b6',
      policies: [
        {
          id: 'turn_management',
          name: '턴 관리 시스템',
          description: '주차별 시간 진행과 턴 종료',
          cost: 0,
          effects: ['턴 진행', '시간 관리', '주차별 진행'],
          requirements: [],
          unlocked: true
        }
      ]
    }
  ]

  const nationalPolicies: NationalPolicy[] = [
    {
      id: 'military_mobilization',
      name: '군사 동원령',
      description: '전시 체제로 전환하여 모든 자원을 군사 목적으로 동원합니다.',
      actionPoints: 10,
      funds: 500000,
      effects: ['군사력 급증', '생산력 군사 전용', '민간 생활 제한'],
      requirements: [],
      available: true
    },
    {
      id: 'economic_stimulus',
      name: '경제 부양책',
      description: '대규모 경제 부양책을 시행하여 경제를 활성화합니다.',
      actionPoints: 10,
      funds: 300000,
      effects: ['경제 성장', '고용 증가', '정부 지출 증가'],
      requirements: [],
      available: true
    },
    {
      id: 'diplomatic_offensive',
      name: '외교 공세',
      description: '적극적인 외교 활동을 통해 국제적 지지를 확보합니다.',
      actionPoints: 10,
      funds: 200000,
      effects: ['국제적 지지', '동맹국 확대', '외교적 성과'],
      requirements: [],
      available: true
    },
    {
      id: 'social_reform',
      name: '사회 개혁',
      description: '사회 복지와 교육을 개선하여 민생을 향상시킵니다.',
      actionPoints: 10,
      funds: 150000,
      effects: ['민생 개선', '사회 안정', '지지도 증가'],
      requirements: [],
      available: true
    }
  ]

  const events: Event[] = [
    {
      id: 'soviet_support',
      title: '소련 지원 제안',
      description: '소련이 군사 및 경제 지원을 제안했습니다.',
      type: 'opportunity',
      actionPoints: 10,
      funds: 100000,
      effects: ['군사 지원 확대', '기술 이전', '정치적 보호'],
      requirements: [],
      available: true
    },
    {
      id: 'internal_conflict',
      title: '내부 갈등',
      description: '지도부 내에서 정책 방향에 대한 갈등이 발생했습니다.',
      type: 'crisis',
      actionPoints: 10,
      funds: 50000,
      effects: ['정치적 불안정', '의사결정 지연', '지지도 하락'],
      requirements: [],
      available: true
    },
    {
      id: 'economic_opportunity',
      title: '경제 기회',
      description: '새로운 경제 협력 기회가 나타났습니다.',
      type: 'opportunity',
      actionPoints: 10,
      funds: 200000,
      effects: ['경제 성장', '무역 확대', '기술 발전'],
      requirements: [],
      available: true
    },
    {
      id: 'military_threat',
      title: '군사적 위협',
      description: '주변국으로부터 군사적 위협이 감지되었습니다.',
      type: 'crisis',
      actionPoints: 10,
      funds: 300000,
      effects: ['군사력 강화 필요', '외교적 긴장', '국방비 증가'],
      requirements: [],
      available: true
    }
  ]

  const intelligenceReports: IntelligenceReport[] = [
    {
      id: 'south_korea_intelligence',
      title: '남한 정보 수집',
      description: '남한의 정치, 경제, 군사 상황에 대한 정보를 수집합니다.',
      type: 'military',
      intelligencePoints: 15,
      funds: 200000,
      effects: ['남한 상황 파악', '전략적 우위', '정책 수립'],
      requirements: [],
      available: true
    },
    {
      id: 'soviet_intelligence',
      title: '소련 정보 수집',
      description: '소련의 정책 변화와 지원 의향을 파악합니다.',
      type: 'political',
      intelligencePoints: 10,
      funds: 150000,
      effects: ['소련 정책 파악', '외교적 대응', '지원 확보'],
      requirements: [],
      available: true
    },
    {
      id: 'china_intelligence',
      title: '중국 정보 수집',
      description: '중국 정부의 연변 정책과 태도를 파악합니다.',
      type: 'political',
      intelligencePoints: 12,
      funds: 180000,
      effects: ['중국 정책 파악', '협력 관계 구축', '안정성 확보'],
      requirements: [],
      available: true
    },
    {
      id: 'international_intelligence',
      title: '국제 정보 수집',
      description: '국제 사회의 반응과 지원 가능성을 파악합니다.',
      type: 'economic',
      intelligencePoints: 8,
      funds: 120000,
      effects: ['국제적 지지', '외교적 기회', '자원 확보'],
      requirements: [],
      available: true
    }
  ]

  const handleStartGame = () => {
    setGameState(prev => ({ ...prev, currentScreen: 'mode' }))
  }

  const handleModeSelect = (mode: 'free' | 'realistic') => {
    setGameState(prev => ({ 
      ...prev, 
      selectedMode: mode, 
      currentScreen: 'story' 
    }))
  }

  const handleStoryContinue = () => {
    setGameState(prev => ({ 
      ...prev, 
      currentScreen: 'meeting' 
    }))
  }

  const handleMeetingDecision = (meetingId: string, decision: string, effects: string[]) => {
    const currentMeeting = getAvailableMeetings().find(m => m.id === meetingId)
    const selectedOption = currentMeeting?.options.find(o => o.id === decision)
    
    setGameState(prev => {
      const newCurrentMeeting = prev.currentMeeting + 1
      const newMeetingHistory = [
        ...prev.meetingHistory,
        {
          meetingId,
          decision,
          effects: selectedOption?.effects || [],
          timestamp: Date.now()
        }
      ]
      
      // 현재 달의 모든 회의가 완료되면 커멘드 화면으로 이동
      const currentMonth = getCurrentMonth()
      const availableMeetings = getMeetingsForMonth(currentMonth)
      
      if (newCurrentMeeting >= availableMeetings.length) {
        return {
          ...prev,
          meetingHistory: newMeetingHistory,
          currentMeeting: 0, // 다음 달 회의를 위해 리셋
          currentScreen: 'command'
        }
      }
      
      return {
        ...prev,
        meetingHistory: newMeetingHistory,
        currentMeeting: newCurrentMeeting
      }
    })
  }

  const handleCommandSelect = (commandId: string) => {
    if (commandId === 'turn_system') {
      setGameState(prev => ({ 
        ...prev, 
        currentScreen: 'turn',
        turnData: {
          ...prev.turnData,
          events: events,
          nationalPolicies: nationalPolicies
        }
      }))
    } else if (commandId === 'policy_system') {
      setGameState(prev => ({ 
        ...prev, 
        currentScreen: 'policy',
        turnData: {
          ...prev.turnData,
          events: events,
          nationalPolicies: nationalPolicies
        }
      }))
    } else if (commandId === 'intelligence_system') {
      setGameState(prev => ({ 
        ...prev, 
        currentScreen: 'intelligence',
        turnData: {
          ...prev.turnData,
          intelligenceData: {
            intelligenceLevel: 1,
            maxIntelligenceLevel: 10,
            intelligencePoints: 50,
            maxIntelligencePoints: 50,
            intelligenceReports: intelligenceReports,
            completedIntelligenceActions: [],
            funds: prev.turnData.funds
          }
        }
      }))
    } else {
      setGameState(prev => ({ 
        ...prev, 
        selectedCommand: commandId,
        currentScreen: 'command-detail'
      }))
    }
  }

  const handlePolicyImplement = (commandId: string, policyId: string) => {
    const command = commands.find(c => c.id === commandId)
    const policy = command?.policies.find(p => p.id === policyId)
    
    if (policy) {
      setGameState(prev => ({
        ...prev,
        commandProgress: {
          ...prev.commandProgress,
          [commandId]: prev.commandProgress[commandId as keyof CommandProgress] + 20
        }
      }))
    }
  }

  const handleActionExecute = (actionId: string, actionType: 'policy' | 'event', actionPoints: number, funds: number, useExtraFunds: boolean = false) => {
    const actualActionPoints = useExtraFunds ? 5 : actionPoints
    
    setGameState(prev => ({
      ...prev,
      turnData: {
        ...prev.turnData,
        actionPoints: prev.turnData.actionPoints - actualActionPoints,
        funds: prev.turnData.funds - (useExtraFunds ? funds * 2 : funds),
        completedActions: [...prev.turnData.completedActions, actionId]
      }
    }))
  }

  const handleIntelligenceAction = (actionId: string, intelligencePoints: number, funds: number) => {
    setGameState(prev => ({
      ...prev,
      turnData: {
        ...prev.turnData,
        intelligenceData: {
          ...prev.turnData.intelligenceData!,
          intelligencePoints: prev.turnData.intelligenceData!.intelligencePoints - intelligencePoints,
          funds: prev.turnData.intelligenceData!.funds - funds, // 첩보 자금 차감
          completedIntelligenceActions: [...prev.turnData.intelligenceData!.completedIntelligenceActions, actionId]
        }
      }
    }))
  }

  const handleTurnEnd = (unusedActionPoints: number, maintenancePeriod: '1month' | '3months' | '6months' | '1year') => {
    const hasUnusedActionPoints = gameState.turnData.actionPoints > 0
    const hasCompletedActions = gameState.turnData.completedActions.length > 0
    
    // 새해 턴이거나 행동을 완료하지 않은 경우 경고창 표시
    if (isNewYearTurn || hasUnusedActionPoints || !hasCompletedActions) {
      setShowNewYearWarning(true)
      return
    }

    // 정상적으로 턴 종료
    handleNormalTurnEnd()
  }

  const handleSeasonMessageClose = () => {
    setShowSeasonMessage(false)
    // 계절 팝업이 닫힌 후 1월이나 7월이면 회의 화면으로 이동
    const currentMonth = gameState.turnData.currentMonth
    if (currentMonth === 1 || currentMonth === 7) {
      setGameState(prev => ({
        ...prev,
        currentScreen: 'meeting'
      }))
    }
  }

  const handleNewYearMessageClose = () => {
    setShowNewYearMessage(false)
    // 새해 팝업이 닫힌 후 1월이면 회의 화면으로 이동
    const currentMonth = gameState.turnData.currentMonth
    if (currentMonth === 1) {
      setGameState(prev => ({
        ...prev,
        currentScreen: 'meeting'
      }))
    }
  }

  const getCurrentMeeting = () => {
    const availableMeetings = getAvailableMeetings()
    if (gameState.currentMeeting < availableMeetings.length) {
      return availableMeetings[gameState.currentMeeting]
    }
    return null
  }

  const getSelectedCommand = () => {
    return commands.find(c => c.id === gameState.selectedCommand)
  }

  const renderCurrentScreen = () => {
    switch (gameState.currentScreen) {
      case 'start':
        return <StartScreen onStart={handleStartGame} />
      case 'mode':
        return <GameMode onModeSelect={handleModeSelect} />
      case 'story':
        return <GameStory 
          mode={gameState.selectedMode!} 
          onContinue={handleStoryContinue} 
        />
      case 'meeting':
        const currentMeeting = getCurrentMeeting()
        if (currentMeeting) {
          return <MeetingPoint 
            meeting={currentMeeting}
            onDecision={handleMeetingDecision}
            meetingHistory={gameState.meetingHistory}
            currentMeetingIndex={gameState.currentMeeting}
            totalMeetings={getAvailableMeetings().length}
          />
        }
        // 회의가 없으면 커멘드 화면으로 리다이렉트
        return <CommandCenter 
          commands={commands}
          onCommandSelect={handleCommandSelect}
          commandProgress={gameState.commandProgress}
          meetingHistory={gameState.meetingHistory}
          turnData={gameState.turnData}
          currentDate={getCurrentDate()}
        />
      case 'command-detail':
        const selectedCommand = getSelectedCommand()
        if (selectedCommand) {
          return <CommandDetail 
            command={selectedCommand}
            onPolicyImplement={handlePolicyImplement}
            onBack={() => setGameState(prev => ({ 
              ...prev, 
              currentScreen: 'command',
              selectedCommand: null
            }))}
            progress={gameState.commandProgress[selectedCommand.id as keyof CommandProgress]}
          />
        }
        return <CommandCenter 
          commands={commands}
          onCommandSelect={handleCommandSelect}
          commandProgress={gameState.commandProgress}
          meetingHistory={gameState.meetingHistory}
          turnData={gameState.turnData}
          currentDate={getCurrentDate()}
        />
      case 'command':
        return <CommandCenter 
          commands={commands}
          onCommandSelect={handleCommandSelect}
          commandProgress={gameState.commandProgress}
          meetingHistory={gameState.meetingHistory}
          turnData={gameState.turnData}
          currentDate={getCurrentDate()}
        />
      case 'turn':
        return <TurnSystem 
          turnData={gameState.turnData}
          onActionExecute={handleActionExecute}
          onTurnEnd={handleTurnEnd}
          onBack={() => setGameState(prev => ({ 
            ...prev, 
            currentScreen: 'command'
          }))}
        />
      case 'policy':
        return <PolicySystem 
          turnData={gameState.turnData}
          onActionExecute={handleActionExecute}
          onBack={() => setGameState(prev => ({ 
            ...prev, 
            currentScreen: 'command'
          }))}
        />
      case 'intelligence':
        return <IntelligenceSystem 
          intelligenceData={gameState.turnData.intelligenceData!}
          onIntelligenceAction={handleIntelligenceAction}
          onBack={() => setGameState(prev => ({ 
            ...prev, 
            currentScreen: 'command'
          }))}
        />
      default:
        return <StartScreen onStart={handleStartGame} />
    }
  }

  return (
    <div className="app">
      {showNewYearMessage && (
        <div className="new-year-message">
          <button className="close-popup-button" onClick={handleNewYearMessageClose}>×</button>
          <h2>🎉 새해가 밝았습니다! 🎉</h2>
          <p>{gameState.turnData.currentYear}년이 시작되었습니다.</p>
          <p>새로운 해의 계획을 세우고 목표를 향해 나아가세요!</p>
        </div>
      )}
      
      {showSeasonMessage && (
        <div className="season-message">
          <button className="close-popup-button" onClick={handleSeasonMessageClose}>×</button>
          <h2>🌱 계절이 바뀌었습니다! 🌱</h2>
          <p>{currentSeason}이 시작되었습니다.</p>
          {currentSeason === '봄' && <p>새로운 시작과 성장의 계절입니다.</p>}
          {currentSeason === '여름' && <p>활동과 발전의 계절입니다.</p>}
          {currentSeason === '가을' && <p>수확과 성숙의 계절입니다.</p>}
          {currentSeason === '겨울' && <p>휴식과 준비의 계절입니다.</p>}
        </div>
      )}
      
      {showNewYearWarning && (
        <div className="new-year-warning">
          <h3>턴 종료 경고</h3>
          <p>턴을 종료하시겠습니까?</p>
          {isNewYearTurn && <p>새해 턴입니다.</p>}
          <p>행동력이나 완료된 행동이 있으면 페널티가 적용됩니다.</p>
          <p><strong>페널티:</strong> 행동력 10% 감소, 세금 수입 5% 감소</p>
          <button onClick={handleNewYearWarningConfirm}>확인</button>
          <button onClick={handleNewYearWarningCancel}>취소</button>
        </div>
      )}
      {renderCurrentScreen()}
    </div>
  )
}

export default App
