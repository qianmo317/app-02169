<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'

const gameStore = useGameStore()

const records = computed(() => gameStore.historyRecords)
const hasRecords = computed(() => records.value.length > 0)

function formatDate(isoDate: string): string {
  const d = new Date(isoDate)
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  return `${month}-${day} ${hours}:${minutes}`
}

function handleClear() {
  gameStore.clearHistory()
}
</script>

<template>
  <div class="history-panel">
    <div class="history-header">
      <h3 class="history-title">历史战绩</h3>
      <button
        v-if="hasRecords"
        class="btn-clear"
        @click="handleClear"
        type="button"
      >
        <svg class="btn-clear-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        </svg>
        清空
      </button>
    </div>

    <div v-if="!hasRecords" class="history-empty">
      <span class="empty-icon" aria-hidden="true">📋</span>
      <p class="empty-text">暂无历史记录</p>
    </div>

    <TransitionGroup v-else name="list" tag="ul" class="history-list">
      <li
        v-for="(record, index) in records"
        :key="record.id"
        class="history-item"
        :class="{ 'is-record': record.isRecord }"
      >
        <div class="item-rank">
          <span v-if="record.isRecord" class="trophy" aria-label="破纪录">🏆</span>
          <span v-else class="rank-number">{{ index + 1 }}</span>
        </div>
        <div class="item-info">
          <div class="item-score">
            <span class="item-score-value">{{ record.score.toLocaleString() }}</span>
            <span class="item-score-unit">分</span>
          </div>
          <div class="item-meta">
            <span class="item-combo">🔥 {{ record.maxCombo }}连击</span>
            <span class="item-date">{{ formatDate(record.date) }}</span>
          </div>
        </div>
      </li>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.history-panel {
  width: 100%;
}

.history-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-md);
}

.history-title {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  margin: 0;
}

.btn-clear {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  color: var(--text-muted);
  background: transparent;
  border: 1px solid var(--border-color);
  cursor: pointer;
  transition:
    color var(--transition-fast),
    border-color var(--transition-fast),
    background-color var(--transition-fast);
}

.btn-clear:hover {
  color: var(--color-error);
  border-color: var(--color-error);
  background: var(--color-error-bg);
}

.btn-clear-icon {
  width: 14px;
  height: 14px;
}

.history-empty {
  text-align: center;
  padding: var(--spacing-xl) 0;
}

.empty-icon {
  font-size: 32px;
  display: block;
  margin-bottom: var(--spacing-sm);
}

.empty-text {
  font-size: var(--font-size-sm);
  color: var(--text-muted);
  margin: 0;
}

.history-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.history-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--bg-card);
  border-radius: var(--border-radius-md);
  border: 1px solid var(--border-color);
  transition:
    background-color var(--transition-fast),
    border-color var(--transition-fast);
}

.history-item:hover {
  background: var(--bg-card-hover);
}

.history-item.is-record {
  background: var(--color-warning-bg);
  border-color: var(--color-warning);
}

.item-rank {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.trophy {
  font-size: 20px;
  animation: trophy-shine 2s ease-in-out infinite;
}

.rank-number {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  color: var(--text-muted);
}

.item-info {
  flex: 1;
  min-width: 0;
}

.item-score {
  display: flex;
  align-items: baseline;
  gap: var(--spacing-xs);
}

.item-score-value {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  line-height: var(--line-height-tight);
}

.is-record .item-score-value {
  color: var(--color-warning);
}

.item-score-unit {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
}

.item-meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-top: 2px;
}

.item-combo {
  font-size: var(--font-size-xs);
  color: var(--color-error-light);
}

.item-date {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
}

@keyframes trophy-shine {
  0%, 100% {
    transform: scale(1);
    filter: brightness(1);
  }
  50% {
    transform: scale(1.1);
    filter: brightness(1.2);
  }
}

.list-enter-active {
  transition: all var(--transition-normal);
}

.list-leave-active {
  transition: all var(--transition-fast);
}

.list-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

@media (max-width: 480px) {
  .history-item {
    padding: var(--spacing-xs) var(--spacing-sm);
  }

  .item-score-value {
    font-size: var(--font-size-md);
  }
}
</style>
