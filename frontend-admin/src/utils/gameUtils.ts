import { Gem, GemType, Position, GameConfig, DEFAULT_CONFIG } from '@/types/game'

// 生成唯一 ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 11)
}

// 获取随机宝石类型
export function getRandomGemType(gemTypes: GemType[]): GemType {
  const index = Math.floor(Math.random() * gemTypes.length)
  return gemTypes[index]
}

// 创建新宝石
export function createGem(row: number, col: number, type: GemType, isNew = false): Gem {
  return {
    id: generateId(),
    type,
    row,
    col,
    isSelected: false,
    isMatched: false,
    isNew
  }
}

// 初始化游戏面板
export function initializeBoard(config: GameConfig = DEFAULT_CONFIG): Gem[][] {
  const board: Gem[][] = []

  for (let row = 0; row < config.rows; row++) {
    board[row] = []
    for (let col = 0; col < config.cols; col++) {
      let gemType: GemType

      // 确保初始化时不会有三连
      do {
        gemType = getRandomGemType(config.gemTypes)
      } while (wouldCreateMatch(board, row, col, gemType, config))

      board[row][col] = createGem(row, col, gemType)
    }
  }

  return board
}

// 检查是否会产生匹配
function wouldCreateMatch(
  board: Gem[][],
  row: number,
  col: number,
  type: GemType,
  config: GameConfig
): boolean {
  // 检查水平方向
  let horizontalCount = 1
  for (let c = col - 1; c >= 0 && board[row][c]?.type === type; c--) {
    horizontalCount++
  }
  if (horizontalCount >= config.matchMinLength) return true

  // 检查垂直方向
  let verticalCount = 1
  for (let r = row - 1; r >= 0 && board[r][col]?.type === type; r--) {
    verticalCount++
  }
  if (verticalCount >= config.matchMinLength) return true

  return false
}

// 检查两个位置是否相邻
export function areAdjacent(pos1: Position, pos2: Position): boolean {
  const rowDiff = Math.abs(pos1.row - pos2.row)
  const colDiff = Math.abs(pos1.col - pos2.col)
  return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1)
}

// 交换两个宝石
export function swapGems(board: Gem[][], pos1: Position, pos2: Position): Gem[][] {
  const newBoard = board.map(row => [...row])
  const temp = { ...newBoard[pos1.row][pos1.col] }

  newBoard[pos1.row][pos1.col] = {
    ...newBoard[pos2.row][pos2.col],
    row: pos1.row,
    col: pos1.col
  }

  newBoard[pos2.row][pos2.col] = {
    ...temp,
    row: pos2.row,
    col: pos2.col
  }

  return newBoard
}

// 查找所有匹配
export function findMatches(board: Gem[][], config: GameConfig = DEFAULT_CONFIG): Position[][] {
  const matches: Position[][] = []
  const rows = board.length
  const cols = board[0]?.length || 0

  // 查找水平匹配
  for (let row = 0; row < rows; row++) {
    let col = 0
    while (col < cols) {
      const type = board[row][col].type
      const match: Position[] = [{ row, col }]

      let nextCol = col + 1
      while (nextCol < cols && board[row][nextCol].type === type) {
        match.push({ row, col: nextCol })
        nextCol++
      }

      if (match.length >= config.matchMinLength) {
        matches.push(match)
      }

      col = nextCol
    }
  }

  // 查找垂直匹配
  for (let col = 0; col < cols; col++) {
    let row = 0
    while (row < rows) {
      const type = board[row][col].type
      const match: Position[] = [{ row, col }]

      let nextRow = row + 1
      while (nextRow < rows && board[nextRow][col].type === type) {
        match.push({ row: nextRow, col })
        nextRow++
      }

      if (match.length >= config.matchMinLength) {
        matches.push(match)
      }

      row = nextRow
    }
  }

  return matches
}

// 标记匹配的宝石
export function markMatches(board: Gem[][], matches: Position[][]): Gem[][] {
  const newBoard = board.map(row => row.map(gem => ({ ...gem })))

  for (const match of matches) {
    for (const pos of match) {
      newBoard[pos.row][pos.col].isMatched = true
    }
  }

  return newBoard
}

// 移除匹配的宝石并下落
export function removeMatchesAndDrop(
  board: Gem[][],
  config: GameConfig = DEFAULT_CONFIG
): Gem[][] {
  const rows = board.length
  const cols = board[0]?.length || 0
  const newBoard: Gem[][] = Array(rows).fill(null).map(() => Array(cols).fill(null))

  for (let col = 0; col < cols; col++) {
    let writeRow = rows - 1

    // 从下往上遍历，保留未匹配的宝石
    for (let row = rows - 1; row >= 0; row--) {
      if (!board[row][col].isMatched) {
        newBoard[writeRow][col] = {
          ...board[row][col],
          row: writeRow,
          isSelected: false
        }
        writeRow--
      }
    }

    // 填充新宝石
    while (writeRow >= 0) {
      const newType = getRandomGemType(config.gemTypes)
      newBoard[writeRow][col] = createGem(writeRow, col, newType, true)
      writeRow--
    }
  }

  return newBoard
}

// 计算得分
export function calculateScore(matches: Position[][]): number {
  let score = 0

  for (const match of matches) {
    const baseScore = match.length * 10
    const bonus = match.length > 3 ? (match.length - 3) * 20 : 0
    score += baseScore + bonus
  }

  return score
}

// 检查是否有可用的移动
export function hasValidMoves(board: Gem[][], config: GameConfig = DEFAULT_CONFIG): boolean {
  const rows = board.length
  const cols = board[0]?.length || 0

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // 检查向右交换
      if (col < cols - 1) {
        const swapped = swapGems(board, { row, col }, { row, col: col + 1 })
        if (findMatches(swapped, config).length > 0) {
          return true
        }
      }

      // 检查向下交换
      if (row < rows - 1) {
        const swapped = swapGems(board, { row, col }, { row: row + 1, col })
        if (findMatches(swapped, config).length > 0) {
          return true
        }
      }
    }
  }

  return false
}

// 格式化时间
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}
