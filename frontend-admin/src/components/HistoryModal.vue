<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'

const gameStore = useGameStore()

const isVisible = computed(() => gameStore.showHistoryModal)

function formatDate(isoString: string): string {
  const date = new Date(isoString)
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${month}-${day} ${hours}:${minutes}`
}

function handleClose() {
  gameStore.closeHistoryModal()
}

function handleClear() {
  gameStore.clearHistory()
}
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
        <div class="modal-content">
          <header class="modal-header">
            <div class="modal-icon-wrapper">
              <span class="modal-icon">📊</span>
            </div>
            <h2 id="history-modal-title" class="modal-title">历史战绩</h2>
            <button
              class="close-btn"
              @click="handleClose"
              aria-label="关闭"
              type="button"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
          </header>

          <div class="modal-body">
            <div v-if="gameStore.history.length === 0" class="empty-state">
              <span class="empty-icon">🎮</span>
              <p class="empty-text">暂无游戏记录</p>
              <p class="empty-hint">完成一局游戏后记录将显示在这里</p>
            </div>

            <div v-else class="history-list">
              <div
                v-for="(record, index) in gameStore.history"
                :key="record.id"
                class="history-item"
                :class="{ 'is-record': record.isNewRecord }"
              >
                <div class="record-rank">
                  <span v-if="record.isNewRecord" class="trophy" title="新纪录">🏆</span>
                  <span v-else class="rank-number">{{ index + 1 }}</span>
                </div>

                <div class="record-info">
                  <div class="record-score">
                    <span class="score-value">{{ record.score.toLocaleString() }}</span>
                    <span class="score-label">分</span>
                  </div>
                  <div class="record-meta">
                    <span class="combo-badge">
                      <span class="combo-icon">🔥</span>
                      {{ record.maxCombo }}连击
                    </span>
                    <span class="record-date">{{ formatDate(record.date) }}</span>
                  </div>
                </div>

                <div v-if="record.isNewRecord" class="record-gold-bar" aria-hidden="true"></div>
              </div>
            </div>
          </div>

          <footer class="modal-footer">
            <button
              v-if="gameStore.history.length > 0"
              class="btn btn-danger"
              @click="handleClear"
              type="button"
            >
              <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
              </svg>
              清空记录
            </button>
            <button
              class="btn btn-primary"
              @click="handleClose"
              type="button"
            >
              确定
            </button>
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10001;
  backdrop-filter: blur(8px);
  padding: var(--spacing-md);
}

.modal-content {
  background: var(--bg-secondary);
  border-radius: var(--border-radius-xl);
  padding: var(--spacing-xl);
  max-width: 440px;
  width: 100%;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-xl);
  border: 1px solid var(--border-color);
}

.modal-header {
  text-align: center;
  margin-bottom: var(--spacing-lg);
  position: relative;
}

.close-btn {
  position: absolute;
  top: 0;
  right: 0;
  width: 36px;
  height: 36px;
  border-radius: var(--border-radius-full);
  border: none;
  background: var(--bg-card);
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
}

.close-btn:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.close-btn svg {
  width: 20px;
  height: 20px;
}

.modal-icon-wrapper {
  width: 64px;
  height: 64px;
  margin: 0 auto var(--spacing-md);
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
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  margin: 0;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  margin-bottom: var(--spacing-lg);
  padding-right: var(--spacing-xs);
}

.modal-body::-webkit-scrollbar {
  width: 6px;
}

.modal-body::-webkit-scrollbar-track {
  background: var(--bg-card);
  border-radius: 3px;
}

.modal-body::-webkit-scrollbar-thumb {
  background: var(--border-color-light);
  border-radius: 3px;
}

.empty-state {
  text-align: center;
  padding: var(--spacing-2xl) var(--spacing-lg);
}

.empty-icon {
  font-size: 48px;
  display: block;
  margin-bottom: var(--spacing-md);
}

.empty-text {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
  margin: 0 0 var(--spacing-xs);
}

.empty-hint {
  font-size: var(--font-size-sm);
  color: var(--text-muted);
  margin: 0;
}

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
  position: relative;
  overflow: hidden;
  transition: all var(--transition-fast);
}

.history-item:hover {
  background: var(--bg-card-hover);
}

.history-item.is-record {
  border-color: var(--color-warning);
  background: linear-gradient(135deg, var(--color-warning-bg), var(--bg-card));
}

.record-rank {
  width: 40px;
  height: 40px;
  border-radius: var(--border-radius-full);
  background: var(--bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 2px solid var(--border-color);
}

.history-item.is-record .record-rank {
  background: var(--color-warning);
  border-color: var(--color-warning-light);
}

.trophy {
  font-size: 20px;
}

.rank-number {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-bold);
  color: var(--text-secondary);
}

.record-info {
  flex: 1;
  min-width: 0;
}

.record-score {
  display: flex;
  align-items: baseline;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-xs);
}

.score-value {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-light);
}

.history-item.is-record .score-value {
  color: var(--color-warning);
}

.score-label {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
}

.record-meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  flex-wrap: wrap;
}

.combo-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  color: var(--color-error-light);
  background: var(--color-error-bg);
  padding: 2px 8px;
  border-radius: var(--border-radius-full);
}

.combo-icon {
  font-size: 12px;
}

.record-date {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
}

.record-gold-bar {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(to bottom, var(--color-warning-light), var(--color-warning));
}

.modal-footer {
  display: flex;
  justify-content: center;
  gap: var(--spacing-md);
}

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

.btn-danger {
  background: var(--color-error-bg);
  color: var(--color-error-light);
  border: 1px solid var(--color-error);
}

.btn-danger:hover:not(:disabled) {
  background: var(--color-error);
  color: white;
  transform: translateY(-2px);
}

.btn-danger:active:not(:disabled) {
  transform: translateY(0);
}

.btn-icon {
  width: 18px;
  height: 18px;
}

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

@media (max-width: 480px) {
  .modal-content {
    padding: var(--spacing-lg);
  }

  .modal-footer {
    flex-direction: column-reverse;
  }

  .btn {
    width: 100%;
  }
}
</style>
