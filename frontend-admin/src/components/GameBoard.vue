<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import { GameStatus } from '@/types/game'
import GemCell from './GemCell.vue'

const gameStore = useGameStore()

const isDisabled = computed(() =>
  gameStore.status !== GameStatus.PLAYING || gameStore.isProcessing
)

const boardStyle = computed(() => ({
  gridTemplateColumns: `repeat(${gameStore.config.cols}, 1fr)`,
  gridTemplateRows: `repeat(${gameStore.config.rows}, 1fr)`
}))
</script>

<template>
  <div class="game-board-wrapper">
    <div class="game-board-container">
      <!-- 游戏面板 -->
      <div
        class="game-board"
        :style="boardStyle"
        :class="{ 'board-disabled': isDisabled }"
        role="grid"
        :aria-label="`${gameStore.config.rows}行${gameStore.config.cols}列的游戏面板`"
      >
        <template v-for="row in gameStore.board" :key="row[0]?.row">
          <GemCell
            v-for="gem in row"
            :key="gem.id"
            :gem="gem"
            :disabled="isDisabled"
            @click="gameStore.selectGem(gem.row, gem.col)"
          />
        </template>
      </div>

      <!-- 游戏未开始遮罩 -->
      <Transition name="overlay">
        <div v-if="gameStore.status === GameStatus.IDLE" class="board-overlay">
          <div class="overlay-content">
            <div class="overlay-icon-wrapper">
              <span class="overlay-icon">🎮</span>
            </div>
            <h2 class="overlay-title">准备开始</h2>
            <p class="overlay-text">点击上方"开始游戏"按钮开始挑战</p>
          </div>
        </div>
      </Transition>

      <!-- 游戏暂停遮罩 -->
      <Transition name="overlay">
        <div v-if="gameStore.status === GameStatus.PAUSED" class="board-overlay">
          <div class="overlay-content">
            <div class="overlay-icon-wrapper paused">
              <span class="overlay-icon">⏸️</span>
            </div>
            <h2 class="overlay-title">游戏已暂停</h2>
            <p class="overlay-text">休息一下，准备好后继续挑战</p>
            <button class="btn btn-primary btn-large" @click="gameStore.resumeGame" type="button">
              <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M8 5v14l11-7z"/>
              </svg>
              继续游戏
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.game-board-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}

.game-board-container {
  position: relative;
  background: var(--bg-secondary);
  border-radius: var(--border-radius-xl);
  padding: var(--spacing-md);
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border-color);
}

.game-board {
  display: grid;
  gap: 6px;
  transition: opacity var(--transition-normal);
}

.board-disabled {
  pointer-events: none;
}

/* ===================
 * 遮罩层
 * =================== */
.board-overlay {
  position: absolute;
  inset: 0;
  background: rgba(15, 23, 42, 0.92);
  border-radius: var(--border-radius-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(6px);
  z-index: 10;
}

.overlay-content {
  text-align: center;
  padding: var(--spacing-xl);
  max-width: 280px;
}

.overlay-icon-wrapper {
  width: 80px;
  height: 80px;
  margin: 0 auto var(--spacing-md);
  background: var(--bg-card);
  border-radius: var(--border-radius-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border-color);
}

.overlay-icon-wrapper.paused {
  background: var(--color-warning-bg);
  border-color: var(--color-warning);
}

.overlay-icon {
  font-size: 40px;
  animation: icon-float 2.5s ease-in-out infinite;
}

.overlay-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  margin-bottom: var(--spacing-sm);
}

.overlay-text {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-lg);
  line-height: var(--line-height-relaxed);
}

/* ===================
 * 按钮样式
 * =================== */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  border: none;
  transition:
    background-color var(--transition-fast),
    box-shadow var(--transition-fast),
    transform var(--transition-fast);
}

.btn:focus-visible {
  outline: 2px solid var(--color-primary-light);
  outline-offset: 2px;
}

.btn-large {
  padding: var(--spacing-md) var(--spacing-xl);
}

.btn-primary {
  background: var(--color-primary);
  color: white;
}

.btn-primary:hover {
  background: var(--color-primary-hover);
  box-shadow: var(--shadow-glow-primary);
  transform: translateY(-2px);
}

.btn-primary:active {
  transform: translateY(0);
}

.btn-icon {
  width: 20px;
  height: 20px;
}

/* ===================
 * 动画
 * =================== */
@keyframes icon-float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

/* 遮罩过渡 */
.overlay-enter-active {
  animation: overlay-in 0.3s ease-out;
}

.overlay-leave-active {
  animation: overlay-out 0.25s ease-in;
}

@keyframes overlay-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes overlay-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

/* ===================
 * 响应式
 * =================== */
@media (max-width: 480px) {
  .game-board-container {
    padding: var(--spacing-sm);
  }

  .game-board {
    gap: 4px;
  }

  .overlay-content {
    padding: var(--spacing-md);
  }

  .overlay-icon-wrapper {
    width: 64px;
    height: 64px;
  }

  .overlay-icon {
    font-size: 32px;
  }
}
</style>
