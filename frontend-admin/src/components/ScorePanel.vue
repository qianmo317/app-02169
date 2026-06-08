<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import { formatTime } from '@/utils/gameUtils'

const gameStore = useGameStore()

const formattedTime = computed(() => formatTime(gameStore.timeLeft))
const timeWarning = computed(() => gameStore.timeLeft <= 30 && gameStore.timeLeft > 10)
const timeCritical = computed(() => gameStore.timeLeft <= 10)
</script>

<template>
  <aside class="score-panel" aria-label="游戏信息">
    <!-- 时间卡片 -->
    <article class="panel-card time-card" :class="{ warning: timeWarning, critical: timeCritical }">
      <div class="stat-item">
        <div class="stat-icon-wrapper time-icon">
          <svg class="stat-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
          </svg>
        </div>
        <div class="stat-content">
          <span class="stat-label">剩余时间</span>
          <span class="stat-value time-value">{{ formattedTime }}</span>
        </div>
      </div>
    </article>

    <!-- 当前得分卡片 -->
    <article class="panel-card score-card">
      <div class="stat-item">
        <div class="stat-icon-wrapper score-icon">
          <svg class="stat-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
        <div class="stat-content">
          <span class="stat-label">当前得分</span>
          <span class="stat-value current-score">{{ gameStore.score.toLocaleString() }}</span>
        </div>
      </div>
    </article>

    <!-- 最高纪录卡片 -->
    <article class="panel-card record-card">
      <div class="stat-item">
        <div class="stat-icon-wrapper record-icon">
          <svg class="stat-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"/>
          </svg>
        </div>
        <div class="stat-content">
          <span class="stat-label">最高纪录</span>
          <span class="stat-value high-score">{{ gameStore.highScore.toLocaleString() }}</span>
        </div>
      </div>
    </article>

    <!-- 游戏规则卡片 -->
    <article class="panel-card rules-card">
      <h3 class="rules-title">游戏规则</h3>
      <ul class="rules-list">
        <li>点击选中宝石</li>
        <li>交换相邻宝石</li>
        <li>三个以上相同消除</li>
        <li>连击获得额外分数</li>
      </ul>
    </article>
  </aside>
</template>

<style scoped>
.score-panel {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  width: 220px;
  flex-shrink: 0;
}

/* 卡片基础样式 */
.panel-card {
  background: var(--bg-aside);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-md);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-color);
  transition:
    border-color var(--transition-fast),
    box-shadow var(--transition-fast);
}

.panel-card:hover {
  border-color: var(--border-color-light);
}

/* 统计项布局 */
.stat-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.stat-icon-wrapper {
  width: 40px;
  height: 40px;
  border-radius: var(--border-radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon {
  width: 22px;
  height: 22px;
}

.stat-content {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.stat-label {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: var(--font-weight-medium);
}

.stat-value {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  line-height: var(--line-height-tight);
}

/* 时间卡片 */
.time-icon {
  background: var(--color-info-bg);
  color: var(--color-info);
}

.time-value {
  font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
  color: var(--color-info);
}

.time-card.warning {
  border-color: var(--color-warning);
}

.time-card.warning .time-value {
  color: var(--color-warning);
}

.time-card.critical {
  border-color: var(--color-error);
  animation: pulse-border 0.5s ease-in-out infinite;
}

.time-card.critical .time-value {
  color: var(--color-error);
  animation: pulse-text 0.5s ease-in-out infinite;
}

/* 得分卡片 */
.score-icon {
  background: var(--color-success-bg);
  color: var(--color-success);
}

.current-score {
  color: var(--color-success);
}

/* 纪录卡片 */
.record-icon {
  background: var(--color-warning-bg);
  color: var(--color-warning);
}

.high-score {
  color: var(--color-warning);
}

/* 规则卡片 */
.rules-card {
  margin-top: var(--spacing-sm);
}

.rules-title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-sm);
  padding-bottom: var(--spacing-xs);
  border-bottom: 1px solid var(--border-color);
}

.rules-list {
  list-style: none;
  font-size: var(--font-size-xs);
  color: var(--text-muted);
  line-height: var(--line-height-relaxed);
}

.rules-list li {
  padding: var(--spacing-xs) 0;
  padding-left: var(--spacing-md);
  position: relative;
}

.rules-list li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-primary);
}

/* 动画 */
@keyframes pulse-border {
  0%, 100% { border-color: var(--color-error); }
  50% { border-color: rgba(239, 68, 68, 0.5); }
}

@keyframes pulse-text {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

/* 响应式 */
@media (max-width: 768px) {
  .score-panel {
    width: 100%;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
  }

  .panel-card {
    flex: 1;
    min-width: 150px;
    max-width: 200px;
  }

  .rules-card {
    display: none;
  }
}
</style>
