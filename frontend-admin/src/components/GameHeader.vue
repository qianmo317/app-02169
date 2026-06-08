<script setup lang="ts">
import { useGameStore } from '@/stores/gameStore'
import { GameStatus } from '@/types/game'

const gameStore = useGameStore()
</script>

<template>
  <header class="game-header">
    <div class="header-content">
      <!-- Logo 区域 -->
      <div class="logo">
        <span class="logo-icon" aria-hidden="true">💎</span>
        <h1 class="logo-text">消消乐</h1>
      </div>

      <!-- 操作按钮区域 -->
      <nav class="header-actions" aria-label="游戏控制">
        <button
          v-if="gameStore.status === GameStatus.IDLE"
          class="btn btn-primary"
          @click="gameStore.startGame"
          type="button"
        >
          <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M8 5v14l11-7z"/>
          </svg>
          开始游戏
        </button>

        <button
          v-else-if="gameStore.status === GameStatus.PLAYING"
          class="btn btn-secondary"
          @click="gameStore.pauseGame"
          type="button"
        >
          <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
          </svg>
          暂停
        </button>

        <button
          v-else-if="gameStore.status === GameStatus.PAUSED"
          class="btn btn-primary"
          @click="gameStore.resumeGame"
          type="button"
        >
          <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M8 5v14l11-7z"/>
          </svg>
          继续
        </button>

        <button
          v-if="gameStore.status !== GameStatus.IDLE"
          class="btn btn-outline"
          @click="gameStore.startGame"
          type="button"
        >
          <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
          </svg>
          重新开始
        </button>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.game-header {
  background: var(--bg-header);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-md) var(--spacing-lg);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-color);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
}

/* Logo 样式 */
.logo {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.logo-icon {
  font-size: var(--font-size-3xl);
  animation: gem-float 3s ease-in-out infinite;
}

.logo-text {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  background: linear-gradient(135deg, var(--color-primary-light), var(--color-primary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.5px;
}

/* 按钮组 */
.header-actions {
  display: flex;
  gap: var(--spacing-sm);
}

/* 按钮基础样式 */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-tight);
  cursor: pointer;
  border: 2px solid transparent;
  transition:
    background-color var(--transition-fast),
    border-color var(--transition-fast),
    box-shadow var(--transition-fast),
    transform var(--transition-fast);
  white-space: nowrap;
}

.btn:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.btn:hover {
  transform: translateY(-2px);
}

.btn:active {
  transform: translateY(0);
}

.btn-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

/* 主要按钮 */
.btn-primary {
  background: var(--color-primary);
  color: white;
}

.btn-primary:hover {
  background: var(--color-primary-hover);
  box-shadow: var(--shadow-glow-primary);
}

/* 次要按钮 */
.btn-secondary {
  background: var(--bg-card);
  color: var(--text-primary);
  border-color: var(--border-color);
}

.btn-secondary:hover {
  background: var(--bg-card-hover);
  border-color: var(--border-color-light);
}

/* 轮廓按钮 */
.btn-outline {
  background: transparent;
  color: var(--text-primary);
  border-color: var(--border-color);
}

.btn-outline:hover {
  background: var(--bg-card);
  border-color: var(--border-color-light);
}

/* 动画 */
@keyframes gem-float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-5px) rotate(5deg);
  }
}

/* 响应式 */
@media (max-width: 480px) {
  .header-content {
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .header-actions {
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
  }

  .btn {
    flex: 1;
    min-width: 120px;
  }
}
</style>
