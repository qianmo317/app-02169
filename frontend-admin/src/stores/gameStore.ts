import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  Gem,
  Position,
  GameStatus,
  GameConfig,
  ToastMessage,
  ToastType,
  DEFAULT_CONFIG
} from '@/types/game'
import {
  initializeBoard,
  areAdjacent,
  swapGems,
  findMatches,
  markMatches,
  removeMatchesAndDrop,
  calculateScore,
  hasValidMoves,
  generateId
} from '@/utils/gameUtils'

export const useGameStore = defineStore('game', () => {
  // 状态
  const board = ref<Gem[][]>([])
  const score = ref(0)
  const highScore = ref(0)
  const combo = ref(0)
  const timeLeft = ref(DEFAULT_CONFIG.timeLimit)
  const status = ref<GameStatus>(GameStatus.IDLE)
  const selectedGem = ref<Position | null>(null)
  const isProcessing = ref(false)
  const toasts = ref<ToastMessage[]>([])
  const config = ref<GameConfig>(DEFAULT_CONFIG)

  // 计算属性
  const isPlaying = computed(() => status.value === GameStatus.PLAYING)
  const isGameOver = computed(() => status.value === GameStatus.GAME_OVER)

  // 定时器
  let timerInterval: number | null = null

  // 初始化游戏
  function initGame() {
    board.value = initializeBoard(config.value)
    score.value = 0
    combo.value = 0
    timeLeft.value = config.value.timeLimit
    status.value = GameStatus.IDLE
    selectedGem.value = null
    isProcessing.value = false

    // 加载最高分
    const saved = localStorage.getItem('matchGame_highScore')
    if (saved) {
      highScore.value = parseInt(saved, 10)
    }
  }

  // 开始游戏
  function startGame() {
    initGame()
    status.value = GameStatus.PLAYING
    startTimer()
    showToast('info', '游戏开始！')
  }

  // 暂停游戏
  function pauseGame() {
    if (status.value === GameStatus.PLAYING) {
      status.value = GameStatus.PAUSED
      stopTimer()
      showToast('info', '游戏已暂停')
    }
  }

  // 继续游戏
  function resumeGame() {
    if (status.value === GameStatus.PAUSED) {
      status.value = GameStatus.PLAYING
      startTimer()
      showToast('info', '游戏继续')
    }
  }

  // 结束游戏
  function endGame() {
    status.value = GameStatus.GAME_OVER
    stopTimer()

    if (score.value > highScore.value) {
      highScore.value = score.value
      localStorage.setItem('matchGame_highScore', score.value.toString())
      showToast('success', '🎉 新纪录！')
    } else {
      showToast('info', '游戏结束')
    }
  }

  // 开始计时器
  function startTimer() {
    stopTimer()
    timerInterval = window.setInterval(() => {
      if (timeLeft.value > 0) {
        timeLeft.value--
      } else {
        endGame()
      }
    }, 1000)
  }

  // 停止计时器
  function stopTimer() {
    if (timerInterval !== null) {
      clearInterval(timerInterval)
      timerInterval = null
    }
  }

  // 选择宝石
  async function selectGem(row: number, col: number) {
    if (!isPlaying.value || isProcessing.value) return

    const currentPos: Position = { row, col }

    // 如果没有选中的宝石，选中当前宝石
    if (!selectedGem.value) {
      selectedGem.value = currentPos
      board.value[row][col].isSelected = true
      return
    }

    // 如果点击的是同一个宝石，取消选中
    if (selectedGem.value.row === row && selectedGem.value.col === col) {
      board.value[row][col].isSelected = false
      selectedGem.value = null
      return
    }

    // 如果点击的是相邻的宝石，尝试交换
    if (areAdjacent(selectedGem.value, currentPos)) {
      await trySwap(selectedGem.value, currentPos)
    } else {
      // 否则，取消之前的选中，选中新的宝石
      board.value[selectedGem.value.row][selectedGem.value.col].isSelected = false
      board.value[row][col].isSelected = true
      selectedGem.value = currentPos
    }
  }

  // 尝试交换宝石
  async function trySwap(pos1: Position, pos2: Position) {
    isProcessing.value = true

    // 取消选中状态
    board.value[pos1.row][pos1.col].isSelected = false
    selectedGem.value = null

    // 交换宝石
    board.value = swapGems(board.value, pos1, pos2)

    await delay(200)

    // 检查是否有匹配
    const matches = findMatches(board.value, config.value)

    if (matches.length > 0) {
      // 有匹配，处理消除
      await processMatches(matches)
    } else {
      // 没有匹配，交换回来
      board.value = swapGems(board.value, pos1, pos2)
      showToast('warning', '无效移动')
    }

    isProcessing.value = false

    // 检查是否还有可用移动
    if (!hasValidMoves(board.value, config.value)) {
      showToast('info', '没有可用移动，重新生成面板')
      board.value = initializeBoard(config.value)
    }
  }

  // 处理匹配
  async function processMatches(matches: Position[][]) {
    combo.value++

    // 标记匹配的宝石
    board.value = markMatches(board.value, matches)

    // 计算得分
    const matchScore = calculateScore(matches) * combo.value
    score.value += matchScore

    // 显示得分提示
    if (combo.value > 1) {
      showToast('success', `${combo.value}连击！+${matchScore}分`)
    } else {
      showToast('success', `+${matchScore}分`)
    }

    await delay(300)

    // 移除匹配的宝石并下落
    board.value = removeMatchesAndDrop(board.value, config.value)

    // 清除新宝石标记
    await delay(300)
    board.value = board.value.map(row =>
      row.map(gem => ({ ...gem, isNew: false }))
    )

    // 检查是否有新的匹配
    const newMatches = findMatches(board.value, config.value)
    if (newMatches.length > 0) {
      await processMatches(newMatches)
    } else {
      combo.value = 0
    }
  }

  // 显示 Toast 消息
  function showToast(type: ToastType, message: string, duration = 2000) {
    const toast: ToastMessage = {
      id: generateId(),
      type,
      message,
      duration
    }
    toasts.value.push(toast)

    setTimeout(() => {
      removeToast(toast.id)
    }, duration)
  }

  // 移除 Toast 消息
  function removeToast(id: string) {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index !== -1) {
      toasts.value.splice(index, 1)
    }
  }

  // 延迟函数
  function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  return {
    // 状态
    board,
    score,
    highScore,
    combo,
    timeLeft,
    status,
    selectedGem,
    isProcessing,
    toasts,
    config,

    // 计算属性
    isPlaying,
    isGameOver,

    // 方法
    initGame,
    startGame,
    pauseGame,
    resumeGame,
    endGame,
    selectGem,
    showToast,
    removeToast
  }
})
