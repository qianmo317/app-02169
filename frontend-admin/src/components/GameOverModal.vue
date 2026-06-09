<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import { GameStatus } from '@/types/game'

const gameStore = useGameStore()

const isVisible = computed(() => gameStore.status === GameStatus.GAME_OVER)
const isNewRecord = computed(() => gameStore.score === gameStore.highScore && gameStore.score > 0)
const isLoading = ref(false)

async function handleRestart() {
  isLoading.value = true
  await new Promise(resolve => setTimeout(resolve, 300))
  gameStore.startGame()
  isLoading.value = false
}

function handleOpenHistory() {
  gameStore.openHistoryModal()
}

const restartButton = ref<HTMLButtonElement | null>(null)
watch(isVisible, (visible) => {
  if (visible) {
    setTimeout(() => {
      restartButton.value?.focus()
    }, 100)
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isVisible"
        class="modal-overlay"
        @click.self="handleRestart"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div class="modal-content">
          <!-- 头部 -->
          <header class="modal-header">
            <div class="modal-icon-wrapper" :class="{ 'is-record': isNewRecord }">
              <span class="modal-icon">{{ isNewRecord ? '🏆' : '🎮' }}</span>
            </div>
            <h2 id="modal-title" class="modal-title">
              {{ isNewRecord ? '新纪录！' : '游戏结束' }}
            </h2>
          </header>

          <!-- 内容 -->
          <div class="modal-body">
            <!-- 分数展示 -->
            <div class="score-display">
              <div class="score-item">
                <span class="score-label">本次得分</span>
                <span class="score-value current">{{ gameStore.score.toLocaleString() }}</span>
              </div>
              <div class="score-divider" aria-hidden="true"></div>
              <div class="score-item">
                <span class="score-label">最高纪录</span>
                <span class="score-value best">{{ gameStore.highScore.toLocaleString() }}</span>
              </div>
            </div>

            <!-- 最大连击 -->
            <div class="combo-display" v-if="gameStore.maxCombo > 0">
              <span class="combo-flame">🔥</span>
              <span class="combo-text">最大连击 <strong>{{ gameStore.maxCombo }}</strong> 次</span>
            </div>

            <!-- 新纪录庆祝 -->
            <Transition name="celebration">
              <div v-if="isNewRecord" class="celebration">
                <div class="celebration-stars" aria-hidden="true">
                  <span class="star">⭐</span>
                  <span class="star">⭐</span>
                  <span class="star">⭐</span>
                </div>
                <p class="celebration-text">恭喜你打破了最高纪录！</p>
              </div>
            </Transition>
          </div>

          <!-- 底部 -->
          <footer class="modal-footer">
            <button
              class="btn btn-secondary"
              @click="handleOpenHistory"
              type="button"
            >
              <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
              </svg>
              历史战绩
            </button>
            <button
              ref="restartButton"
              class="btn btn-primary"
              :class="{ 'is-loading': isLoading }"
              :disabled="isLoading"
              @click="handleRestart"
              type="button"
            >
              <svg v-if="!isLoading" class="btn-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
              </svg>
              <span v-if="isLoading" class="btn-spinner" aria-hidden="true"></span>
              {{ isLoading ? '加载中...' : '再来一局' }}
            </button>
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* ===================
 * 遮罩层
 * =================== */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  backdrop-filter: blur(8px);
  padding: var(--spacing-md);
}

/* ===================
 * 模态框内容
 * =================== */
.modal-content {
  background: var(--bg-secondary);
  border-radius: var(--border-radius-xl);
  padding: var(--spacing-xl);
  max-width: 400px;
  width: 100%;
  box-shadow: var(--shadow-xl);
  border: 1px solid var(--border-color);
}

/* ===================
 * 头部
 * =================== */
.modal-header {
  text-align: center;
  margin-bottom: var(--spacing-lg);
}

.modal-icon-wrapper {
  width: 80px;
  height: 80px;
  margin: 0 auto var(--spacing-md);
  background: var(--bg-card);
  border-radius: var(--border-radius-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--border-color);
}

.modal-icon-wrapper.is-record {
  background: var(--color-warning-bg);
  border-color: var(--color-warning);
  animation: icon-glow 1.5s ease-in-out infinite;
}

.modal-icon {
  font-size: 40px;
  animation: icon-bounce 1s ease-in-out infinite;
}

.modal-title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  margin: 0;
}

/* ===================
 * 内容区
 * =================== */
.modal-body {
  margin-bottom: var(--spacing-lg);
}

.score-display {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-lg);
  padding: var(--spacing-lg);
  background: var(--bg-card);
  border-radius: var(--border-radius-lg);
  margin-bottom: var(--spacing-md);
  border: 1px solid var(--border-color);
}

.score-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.score-label {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: var(--spacing-xs);
  font-weight: var(--font-weight-medium);
}

.score-value {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
}

.score-value.current {
  color: var(--color-primary-light);
}

.score-value.best {
  color: var(--color-warning);
}

.score-divider {
  width: 1px;
  height: 50px;
  background: var(--border-color);
}

/* ===================
 * 庆祝区域
 * =================== */
.celebration {
  padding: var(--spacing-md);
  background: linear-gradient(135deg, var(--color-warning-bg), rgba(249, 115, 22, 0.1));
  border-radius: var(--border-radius-md);
  border: 1px solid var(--color-warning);
  text-align: center;
}

.celebration-stars {
  display: flex;
  justify-content: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
}

.star {
  font-size: var(--font-size-xl);
  animation: star-spin 2s ease-in-out infinite;
}

.star:nth-child(2) {
  animation-delay: 0.2s;
}

.star:nth-child(3) {
  animation-delay: 0.4s;
}

.celebration-text {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-warning);
  margin: 0;
}

/* ===================
 * 最大连击展示
 * =================== */
.combo-display {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  background: var(--color-error-bg);
  border-radius: var(--border-radius-md);
  margin-bottom: var(--spacing-md);
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.combo-flame {
  font-size: var(--font-size-xl);
  animation: flame-flicker 0.8s ease-in-out infinite alternate;
}

.combo-text {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-error-light);
}

.combo-text strong {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-error);
}

@keyframes flame-flicker {
  from { transform: scale(1); }
  to { transform: scale(1.15); }
}

/* ===================
 * 底部
 * =================== */
.modal-footer {
  display: flex;
  justify-content: center;
  gap: var(--spacing-md);
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
    transform var(--transition-fast),
    opacity var(--transition-fast);
}

.btn:focus-visible {
  outline: 2px solid var(--color-primary-light);
  outline-offset: 2px;
}

.btn-large {
  padding: var(--spacing-md) var(--spacing-2xl);
  font-size: var(--font-size-lg);
}

.btn-primary {
  background: var(--color-primary);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: var(--color-primary-hover);
  box-shadow: var(--shadow-glow-primary);
  transform: translateY(-2px);
}

.btn-primary:active:not(:disabled) {
  transform: translateY(0);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-secondary {
  background: var(--bg-card);
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover:not(:disabled) {
  background: var(--bg-hover);
  color: var(--text-primary);
  border-color: var(--border-color-light);
  transform: translateY(-2px);
}

.btn-secondary:active:not(:disabled) {
  transform: translateY(0);
}

.btn-icon {
  width: 20px;
  height: 20px;
}

/* Loading 状态 */
.btn.is-loading {
  pointer-events: none;
}

.btn-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

/* ===================
 * 动画
 * =================== */
@keyframes icon-bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

@keyframes icon-glow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(245, 158, 11, 0.3);
  }
  50% {
    box-shadow: 0 0 30px rgba(245, 158, 11, 0.5);
  }
}

@keyframes star-spin {
  0%, 100% {
    transform: scale(1) rotate(0deg);
  }
  50% {
    transform: scale(1.2) rotate(180deg);
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 模态框过渡 */
.modal-enter-active {
  animation: modal-in 0.35s ease-out;
}

.modal-leave-active {
  animation: modal-out 0.25s ease-in;
}

.modal-enter-active .modal-content {
  animation: content-in 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-leave-active .modal-content {
  animation: content-out 0.25s ease-in;
}

@keyframes modal-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes modal-out {
  from { opacity: 1; }
  to { opacity: 0; }
}

@keyframes content-in {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes content-out {
  from {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
  to {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
}

/* 庆祝过渡 */
.celebration-enter-active {
  animation: celebration-in 0.4s ease-out;
}

@keyframes celebration-in {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* ===================
 * 响应式
 * =================== */
@media (max-width: 480px) {
  .modal-content {
    padding: var(--spacing-lg);
  }

  .modal-icon-wrapper {
    width: 64px;
    height: 64px;
  }

  .modal-icon {
    font-size: 32px;
  }

  .score-display {
    padding: var(--spacing-md);
    gap: var(--spacing-md);
  }

  .score-value {
    font-size: var(--font-size-xl);
  }

  .modal-footer {
    flex-direction: column-reverse;
  }

  .btn {
    width: 100%;
  }
}
</style>
