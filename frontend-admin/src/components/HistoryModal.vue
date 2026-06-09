<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useGameStore } from '@/stores/gameStore'

const gameStore = useGameStore()

const isVisible = computed(() => gameStore.showHistoryModal)
const isConfirmingClear = ref(false)

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) {
    return `今天 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
  } else if (days === 1) {
    return `昨天 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
  } else if (days < 7) {
    return `${days}天前`
  } else {
    return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
  }
}

function handleClose() {
  gameStore.closeHistoryModal()
  isConfirmingClear.value = false
}

function handleClearClick() {
  isConfirmingClear.value = true
}

function handleConfirmClear() {
  gameStore.clearGameHistory()
  isConfirmingClear.value = false
}

function handleCancelClear() {
  isConfirmingClear.value = false
}

// 当模态框显示时，聚焦到关闭按钮
const closeButton = ref<HTMLButtonElement | null>(null)
watch(isVisible, (visible) => {
  if (visible) {
    setTimeout(() => {
      closeButton.value?.focus()
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
        @click.self="handleClose"
        role="dialog"
        aria-modal="true"
        aria-labelledby="history-modal-title"
      >
        <div class="modal-content history-modal">
          <!-- 头部 -->
          <header class="modal-header">
            <div class="modal-icon-wrapper">
              <span class="modal-icon">📊</span>
            </div>
            <h2 id="history-modal-title" class="modal-title">
              历史战绩
            </h2>
            <p class="modal-subtitle">最近 {{ gameStore.gameHistory.length }} 局游戏记录</p>
          </header>

          <!-- 内容 -->
          <div class="modal-body">
            <!-- 历史记录列表 -->
            <div v-if="gameStore.gameHistory.length > 0" class="history-list">
              <div
                v-for="(record, index) in gameStore.gameHistory"
                :key="record.id"
                class="history-item"
                :class="{ 'is-record': record.isNewRecord }"
              >
                <div class="history-rank">
                  <span v-if="record.isNewRecord" class="trophy-icon" aria-label="破纪录">🏆</span>
                  <span v-else class="rank-number">{{ index + 1 }}</span>
                </div>

                <div class="history-info">
                  <div class="history-score">
                    <span class="score-value">{{ record.score.toLocaleString() }}</span>
                    <span class="score-label">分</span>
                  </div>
                  <div class="history-details">
                    <span class="detail-item">
                      <span class="detail-icon">🔥</span>
                      最高 {{ record.maxCombo }} 连击
                    </span>
                    <span class="detail-divider">·</span>
                    <span class="detail-item">{{ formatDate(record.date) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 空状态 -->
            <div v-else class="empty-state">
              <div class="empty-icon">🎮</div>
              <p class="empty-text">暂无游戏记录</p>
              <p class="empty-hint">开始游戏后，记录将显示在这里</p>
            </div>
          </div>

          <!-- 底部 -->
          <footer class="modal-footer">
            <div v-if="gameStore.gameHistory.length > 0" class="footer-actions">
              <button
                v-if="!isConfirmingClear"
                class="btn btn-ghost btn-danger"
                @click="handleClearClick"
                type="button"
              >
                清空记录
              </button>
              <div v-else class="confirm-clear">
                <span class="confirm-text">确定清空？</span>
                <button class="btn btn-ghost btn-small" @click="handleCancelClear" type="button">
                  取消
                </button>
                <button class="btn btn-danger btn-small" @click="handleConfirmClear" type="button">
                  确定
                </button>
              </div>
            </div>
            <button
              ref="closeButton"
              class="btn btn-primary"
              @click="handleClose"
              type="button"
            >
              关闭
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
  max-width: 450px;
  width: 100%;
  box-shadow: var(--shadow-xl);
  border: 1px solid var(--border-color);
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.history-modal {
  max-height: 85vh;
}

/* ===================
 * 头部
 * =================== */
.modal-header {
  text-align: center;
  margin-bottom: var(--spacing-lg);
}

.modal-icon-wrapper {
  width: 64px;
  height: 64px;
  margin: 0 auto var(--spacing-sm);
  background: var(--bg-card);
  border-radius: var(--border-radius-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--border-color);
}

.modal-icon {
  font-size: 32px;
}

.modal-title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  margin: 0 0 var(--spacing-xs);
}

.modal-subtitle {
  font-size: var(--font-size-sm);
  color: var(--text-muted);
  margin: 0;
}

/* ===================
 * 内容区
 * =================== */
.modal-body {
  flex: 1;
  overflow-y: auto;
  margin-bottom: var(--spacing-lg);
  padding-right: var(--spacing-xs);
}

/* 历史记录列表 */
.history-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.history-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--bg-card);
  border-radius: var(--border-radius-lg);
  border: 1px solid var(--border-color);
  transition: all var(--transition-fast);
}

.history-item:hover {
  background: var(--bg-card-hover);
}

.history-item.is-record {
  background: linear-gradient(135deg, var(--color-warning-bg), rgba(249, 115, 22, 0.05));
  border-color: var(--color-warning);
  box-shadow: 0 0 15px rgba(245, 158, 11, 0.1);
}

.history-rank {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-secondary);
  border-radius: var(--border-radius-md);
  border: 1px solid var(--border-color);
}

.rank-number {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  color: var(--text-secondary);
}

.trophy-icon {
  font-size: 24px;
  animation: trophy-bounce 2s ease-in-out infinite;
}

.history-info {
  flex: 1;
  min-width: 0;
}

.history-score {
  display: flex;
  align-items: baseline;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-xs);
}

.score-value {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
}

.score-label {
  font-size: var(--font-size-sm);
  color: var(--text-muted);
}

.history-details {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  flex-wrap: wrap;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.detail-icon {
  font-size: 14px;
}

.detail-divider {
  color: var(--text-muted);
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: var(--spacing-2xl) var(--spacing-lg);
}

.empty-icon {
  font-size: 64px;
  margin-bottom: var(--spacing-md);
  opacity: 0.5;
}

.empty-text {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--text-secondary);
  margin: 0 0 var(--spacing-xs);
}

.empty-hint {
  font-size: var(--font-size-sm);
  color: var(--text-muted);
  margin: 0;
}

/* ===================
 * 底部
 * =================== */
.modal-footer {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.footer-actions {
  display: flex;
  justify-content: center;
}

.confirm-clear {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.confirm-text {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
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

.btn-small {
  padding: var(--spacing-xs) var(--spacing-md);
  font-size: var(--font-size-sm);
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

.btn-ghost {
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
}

.btn-ghost:hover:not(:disabled) {
  background: var(--bg-card);
  color: var(--text-primary);
}

.btn-danger {
  color: var(--color-error);
  border-color: var(--color-error);
}

.btn-danger:hover:not(:disabled) {
  background: var(--color-error-bg);
  color: var(--color-error);
}

/* ===================
 * 动画
 * =================== */
@keyframes trophy-bounce {
  0%, 100% {
    transform: scale(1) rotate(0deg);
  }
  50% {
    transform: scale(1.1) rotate(-5deg);
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

/* ===================
 * 滚动条样式
 * =================== */
.modal-body::-webkit-scrollbar {
  width: 6px;
}

.modal-body::-webkit-scrollbar-track {
  background: var(--bg-secondary);
  border-radius: var(--border-radius-full);
}

.modal-body::-webkit-scrollbar-thumb {
  background: var(--border-color-light);
  border-radius: var(--border-radius-full);
}

.modal-body::-webkit-scrollbar-thumb:hover {
  background: var(--bg-hover);
}

/* ===================
 * 响应式
 * =================== */
@media (max-width: 480px) {
  .modal-content {
    padding: var(--spacing-lg);
  }

  .modal-icon-wrapper {
    width: 56px;
    height: 56px;
  }

  .modal-icon {
    font-size: 28px;
  }

  .history-item {
    padding: var(--spacing-sm);
    gap: var(--spacing-sm);
  }

  .history-rank {
    width: 36px;
    height: 36px;
  }

  .score-value {
    font-size: var(--font-size-lg);
  }
}
</style>
