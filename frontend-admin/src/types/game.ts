// 宝石类型枚举 - 使用非紫色的6种颜色
export enum GemType {
  RED = 'red',
  BLUE = 'blue',
  GREEN = 'green',
  YELLOW = 'yellow',
  CYAN = 'cyan',
  ORANGE = 'orange'
}

// 宝石接口
export interface Gem {
  id: string
  type: GemType
  row: number
  col: number
  isSelected: boolean
  isMatched: boolean
  isNew: boolean
}

// 位置接口
export interface Position {
  row: number
  col: number
}

// 游戏状态枚举
export enum GameStatus {
  IDLE = 'idle',
  PLAYING = 'playing',
  PAUSED = 'paused',
  GAME_OVER = 'gameOver'
}

// 游戏配置
export interface GameConfig {
  rows: number
  cols: number
  gemTypes: GemType[]
  timeLimit: number
  matchMinLength: number
}

// Toast 消息类型
export type ToastType = 'success' | 'error' | 'info' | 'warning'

// Toast 消息接口
export interface ToastMessage {
  id: string
  type: ToastType
  message: string
  duration: number
}

// 游戏历史记录接口
export interface GameRecord {
  id: string
  score: number
  maxCombo: number
  date: number
  isRecord: boolean
}

// 历史记录最大保留数量
export const MAX_HISTORY_COUNT = 10

// 历史记录本地存储键
export const HISTORY_STORAGE_KEY = 'matchGame_history'

// 默认游戏配置
export const DEFAULT_CONFIG: GameConfig = {
  rows: 8,
  cols: 8,
  gemTypes: [
    GemType.RED,
    GemType.BLUE,
    GemType.GREEN,
    GemType.YELLOW,
    GemType.CYAN,
    GemType.ORANGE
  ],
  timeLimit: 120,
  matchMinLength: 3
}
