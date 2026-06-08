<script setup lang="ts">
import { computed } from 'vue'
import { Gem, GemType } from '@/types/game'

const props = defineProps<{
  gem: Gem
  disabled: boolean
}>()

const emit = defineEmits<{
  click: []
}>()

// 宝石 emoji 映射 - 使用统一的线性风格图标
const gemEmoji = computed(() => {
  const emojiMap: Record<GemType, string> = {
    [GemType.RED]: '❤️',
    [GemType.BLUE]: '💙',
    [GemType.GREEN]: '💚',
    [GemType.YELLOW]: '💛',
    [GemType.CYAN]: '🩵',
    [GemType.ORANGE]: '🧡'
  }
  return emojiMap[props.gem.type]
})

const gemClass = computed(() => ({
  'gem-cell': true,
  'gem-selected': props.gem.isSelected,
  'gem-matched': props.gem.isMatched,
  'gem-new': props.gem.isNew,
  'gem-disabled': props.disabled,
  [`gem-${props.gem.type}`]: true
}))

function handleClick() {
  if (!props.disabled) {
    emit('click')
  }
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    handleClick()
  }
}
</script>

<template>
  <button
    :class="gemClass"
    @click="handleClick"
    @keydown="handleKeydown"
    :disabled="disabled"
    :aria-label="`${gem.type}色宝石，位于第${gem.row + 1}行第${gem.col + 1}列${gem.isSelected ? '，已选中' : ''}`"
    :aria-pressed="gem.isSelected"
    type="button"
  >
    <span class="gem-emoji" aria-hidden="true">{{ gemEmoji }}</span>
    <span class="gem-shine" aria-hidden="true"></span>
    <span class="gem-ring" aria-hidden="true"></span>
  </button>
</template>

<style scoped>
.gem-cell {
  width: 52px;
  height: 52px;
  border-radius: var(--border-radius-md);
  border: 2px solid transparent;
  background: var(--bg-card);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  transition:
    transform var(--transition-fast),
    border-color var(--transition-fast),
    box-shadow var(--transition-fast),
    background-color var(--transition-fast);
  box-shadow: var(--shadow-sm);
}

.gem-cell:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.gem-cell:hover:not(.gem-disabled) {
  transform: scale(1.08);
  box-shadow: var(--shadow-md);
  border-color: var(--border-color-light);
}

.gem-cell:active:not(.gem-disabled) {
  transform: scale(0.95);
}

.gem-emoji {
  font-size: 28px;
  z-index: 2;
  transition: transform var(--transition-fast);
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

/* 光泽效果 */
.gem-shine {
  position: absolute;
  top: -50%;
  left: -100%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    120deg,
    transparent 30%,
    rgba(255, 255, 255, 0.15) 50%,
    transparent 70%
  );
  transform: rotate(25deg);
  transition: left var(--transition-slow);
  pointer-events: none;
  z-index: 1;
}

.gem-cell:hover:not(.gem-disabled) .gem-shine {
  left: 100%;
}

/* 选中环效果 */
.gem-ring {
  position: absolute;
  inset: -4px;
  border-radius: var(--border-radius-lg);
  border: 2px solid transparent;
  pointer-events: none;
  z-index: 0;
}

/* ===================
 * 选中状态
 * =================== */
.gem-selected {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-glow-primary);
  transform: scale(1.05);
}

.gem-selected .gem-emoji {
  transform: scale(1.1);
  animation: gem-bounce 0.6s ease-in-out infinite;
}

.gem-selected .gem-ring {
  border-color: var(--color-primary-light);
  animation: ring-pulse 1s ease-in-out infinite;
}

/* ===================
 * 匹配状态
 * =================== */
.gem-matched {
  animation: gem-matched 0.35s ease-out forwards;
}

/* ===================
 * 新宝石状态
 * =================== */
.gem-new {
  animation: gem-drop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* ===================
 * 禁用状态
 * =================== */
.gem-disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.gem-disabled:hover {
  transform: none;
}

/* ===================
 * 不同颜色的宝石背景
 * =================== */
.gem-red {
  background: linear-gradient(145deg, var(--bg-card), var(--gem-red-bg));
}
.gem-red.gem-selected {
  border-color: var(--gem-red);
  box-shadow: 0 0 16px rgba(239, 68, 68, 0.4);
}

.gem-blue {
  background: linear-gradient(145deg, var(--bg-card), var(--gem-blue-bg));
}
.gem-blue.gem-selected {
  border-color: var(--gem-blue);
  box-shadow: 0 0 16px rgba(59, 130, 246, 0.4);
}

.gem-green {
  background: linear-gradient(145deg, var(--bg-card), var(--gem-green-bg));
}
.gem-green.gem-selected {
  border-color: var(--gem-green);
  box-shadow: 0 0 16px rgba(16, 185, 129, 0.4);
}

.gem-yellow {
  background: linear-gradient(145deg, var(--bg-card), var(--gem-yellow-bg));
}
.gem-yellow.gem-selected {
  border-color: var(--gem-yellow);
  box-shadow: 0 0 16px rgba(234, 179, 8, 0.4);
}

.gem-cyan {
  background: linear-gradient(145deg, var(--bg-card), var(--gem-cyan-bg));
}
.gem-cyan.gem-selected {
  border-color: var(--gem-cyan);
  box-shadow: 0 0 16px rgba(6, 182, 212, 0.4);
}

.gem-orange {
  background: linear-gradient(145deg, var(--bg-card), var(--gem-orange-bg));
}
.gem-orange.gem-selected {
  border-color: var(--gem-orange);
  box-shadow: 0 0 16px rgba(249, 115, 22, 0.4);
}

/* ===================
 * 动画定义
 * =================== */
@keyframes gem-bounce {
  0%, 100% {
    transform: scale(1.1) translateY(0);
  }
  50% {
    transform: scale(1.1) translateY(-3px);
  }
}

@keyframes ring-pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.05);
  }
}

@keyframes gem-matched {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  30% {
    transform: scale(1.2);
    opacity: 1;
  }
  100% {
    transform: scale(0);
    opacity: 0;
  }
}

@keyframes gem-drop {
  0% {
    transform: translateY(-80px) scale(0.8);
    opacity: 0;
  }
  60% {
    transform: translateY(5px) scale(1.05);
    opacity: 1;
  }
  100% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

/* ===================
 * 响应式
 * =================== */
@media (max-width: 480px) {
  .gem-cell {
    width: 42px;
    height: 42px;
  }

  .gem-emoji {
    font-size: 22px;
  }
}
</style>
