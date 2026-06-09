<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import { GameStatus } from '@/types/game'

const gameStore = useGameStore()

const isVisible = computed(() => gameStore.status === GameStatus.GAME_OVER)
const isNewRecord = computed(() => gameStore.score === gameStore.highScore && gameStore.score > 0)
const isLoading = ref(false)
const showHistory = ref(false)

async function handleRestart() {
  isLoading.value = true
  // 模拟短暂加载状态，提供交互反馈
  await new Promise(resolve => setTimeout(resolve, 300))
  showHistory.value = false
  gameStore.startGame()
  isLoading.value = false
}

function openHistory() {
  showHistory.value = true
}

function closeHistory() {
  showHistory.value = false
}

function handleClearHistory() {
  if (gameStore.history.length === 0) return
  if (window.confirm('确定要清空所有历史战绩吗？此操作不可恢复。')) {
    gameStore.clearHistory()
  }
}

function formatDate(timestamp: number): string {
  const d = new Date(timestamp)
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  const hh = String(d.getHours()).padStart(2, '0')
  const mi = String(d.getMinutes()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}`
}

// 当模态框显示时，聚焦到按钮
const restartButton = ref<HTMLButtonElement | null>(null)
watch(isVisible, (visible) => {
  if (visible) {
    showHistory.value = false
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
                <span class="score-label">最大连击</span>
                <span class="score-value combo">{{ gameStore.maxCombo }}</span>
              </div>
              <div class="score-divider" aria-hidden="true"></div>
              <div class="score-item">
                <span class="score-label">最高纪录</span>
                <span class="score-value best">{{ gameStore.highScore.toLocaleString() }}</span>
              </div>
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

            <!-- 历史战绩入口 -->
            <button
              class="history-entry"
              type="button"
              @click="openHistory"
            >
              <span class="history-entry-icon" aria-hidden="true">📜</span>
              <span class="history-entry-text">查看历史战绩</span>
              <span class="history-entry-count">{{ gameStore.history.length }} 局</span>
              <span class="history-entry-arrow" aria-hidden="true">›</span>
            </button>
          </div>

          <!-- 底部 -->
          <footer class="modal-footer">
            <button
              ref="restartButton"
              class="btn btn-primary btn-large"
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

          <!-- 历史战绩面板 -->
          <Transition name="history-panel">
            <div
              v-if="showHistory"
              class="history-panel"
              role="dialog"
              aria-modal="true"
              aria-labelledby="history-title"
            >
              <header class="history-header">
                <h3 id="history-title" class="history-title">
                  <span aria-hidden="true">📜</span>
                  历史战绩
                </h3>
                <button
                  class="history-close"
                  type="button"
                  aria-label="关闭"
                  @click="closeHistory"
                >×</button>
              </header>

              <div class="history-body">
                <div v-if="gameStore.history.length === 0" class="history-empty">
                  <span class="history-empty-icon" aria-hidden="true">📭</span>
                  <p class="history-empty-text">暂无历史战绩</p>
                </div>

                <ul v-else class="history-list">
                  <li
                    v-for="(record, index) in gameStore.history"
                    :key="record.id"
                    class="history-item"
                    :class="{ 'is-record': record.isRecord }"
                  >
                    <div class="history-rank">
                      <span v-if="record.isRecord" class="history-trophy" aria-label="破纪录">🏆</span>
                      <span v-else class="history-index">#{{ index + 1 }}</span>
                    </div>
                    <div class="history-info">
                      <div class="history-row">
                        <span class="history-score">{{ record.score.toLocaleString() }}</span>
                        <span class="history-combo">最大连击 ×{{ record.maxCombo }}</span>
                      </div>
                      <div class="history-date">{{ formatDate(record.date) }}</div>
                    </div>
                  </li>
                </ul>
              </div>

              <footer class="history-footer">
                <button
                  class="btn btn-danger"
                  type="button"
                  :disabled="gameStore.history.length === 0"
                  @click="handleClearHistory"
                >
                  一键清空
                </button>
                <button
                  class="btn btn-secondary"
                  type="button"
                  @click="closeHistory"
                >
                  返回
                </button>
              </footer>
            </div>
          </Transition>
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
  position: relative;
  overflow: hidden;
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
  gap: var(--spacing-md);
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
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
}

.score-value.current {
  color: var(--color-primary-light);
}

.score-value.combo {
  color: var(--color-success-light);
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
 * 底部
 * =================== */
.modal-footer {
  display: flex;
  justify-content: center;
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

.btn-icon {
  width: 22px;
  height: 22px;
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
 * 历史战绩入口
 * =================== */
.history-entry {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  width: 100%;
  margin-top: var(--spacing-md);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-md);
  color: var(--text-primary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition:
    background-color var(--transition-fast),
    border-color var(--transition-fast),
    transform var(--transition-fast);
}

.history-entry:hover {
  background: var(--bg-card-hover);
  border-color: var(--color-primary);
  transform: translateY(-1px);
}

.history-entry:focus-visible {
  outline: 2px solid var(--color-primary-light);
  outline-offset: 2px;
}

.history-entry-icon {
  font-size: var(--font-size-lg);
}

.history-entry-text {
  flex: 1;
  text-align: left;
}

.history-entry-count {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
  background: var(--bg-primary);
  padding: 2px var(--spacing-sm);
  border-radius: var(--border-radius-full);
}

.history-entry-arrow {
  color: var(--text-muted);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
}

/* ===================
 * 历史战绩面板
 * =================== */
.history-panel {
  position: absolute;
  inset: 0;
  background: var(--bg-secondary);
  display: flex;
  flex-direction: column;
  padding: var(--spacing-xl);
  z-index: 1;
}

.history-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--border-color);
}

.history-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  margin: 0;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.history-close {
  width: 32px;
  height: 32px;
  border: none;
  background: var(--bg-card);
  color: var(--text-secondary);
  border-radius: var(--border-radius-full);
  font-size: var(--font-size-xl);
  line-height: 1;
  cursor: pointer;
  transition:
    background-color var(--transition-fast),
    color var(--transition-fast);
}

.history-close:hover {
  background: var(--bg-card-hover);
  color: var(--text-primary);
}

.history-body {
  flex: 1;
  overflow-y: auto;
  margin-bottom: var(--spacing-md);
  min-height: 200px;
  max-height: 380px;
}

.history-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-2xl) 0;
  color: var(--text-muted);
}

.history-empty-icon {
  font-size: var(--font-size-3xl);
  margin-bottom: var(--spacing-sm);
}

.history-empty-text {
  font-size: var(--font-size-sm);
  margin: 0;
}

.history-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.history-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-md);
  transition:
    background-color var(--transition-fast),
    border-color var(--transition-fast);
}

.history-item:hover {
  background: var(--bg-card-hover);
}

.history-item.is-record {
  background: linear-gradient(135deg, var(--color-warning-bg), rgba(252, 211, 77, 0.08));
  border-color: var(--color-warning);
  box-shadow: 0 0 12px rgba(245, 158, 11, 0.25);
}

.history-rank {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.history-trophy {
  font-size: var(--font-size-xl);
  filter: drop-shadow(0 0 6px rgba(245, 158, 11, 0.6));
  animation: trophy-shine 2s ease-in-out infinite;
}

.history-index {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  color: var(--text-muted);
}

.history-info {
  flex: 1;
  min-width: 0;
}

.history-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--spacing-sm);
  margin-bottom: 2px;
}

.history-score {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
}

.history-item.is-record .history-score {
  color: var(--color-warning);
}

.history-combo {
  font-size: var(--font-size-xs);
  color: var(--color-success-light);
  font-weight: var(--font-weight-medium);
}

.history-date {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
}

.history-footer {
  display: flex;
  gap: var(--spacing-sm);
  justify-content: space-between;
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--border-color);
}

.btn-secondary {
  background: var(--bg-card);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover:not(:disabled) {
  background: var(--bg-card-hover);
  border-color: var(--color-primary);
}

.btn-danger {
  background: var(--color-error-bg);
  color: var(--color-error-light);
  border: 1px solid var(--color-error);
}

.btn-danger:hover:not(:disabled) {
  background: var(--color-error);
  color: white;
}

.btn-danger:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@keyframes trophy-shine {
  0%, 100% {
    transform: scale(1);
    filter: drop-shadow(0 0 6px rgba(245, 158, 11, 0.6));
  }
  50% {
    transform: scale(1.08);
    filter: drop-shadow(0 0 12px rgba(245, 158, 11, 0.9));
  }
}

/* 历史面板过渡 */
.history-panel-enter-active,
.history-panel-leave-active {
  transition: transform var(--transition-normal), opacity var(--transition-normal);
}

.history-panel-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.history-panel-leave-to {
  opacity: 0;
  transform: translateX(20px);
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
    gap: var(--spacing-sm);
  }

  .score-value {
    font-size: var(--font-size-lg);
  }

  .history-panel {
    padding: var(--spacing-lg);
  }

  .history-body {
    max-height: 300px;
  }
}
</style>
