<script setup lang="ts">
import { useGameStore } from '@/stores/gameStore'
import type { ToastType } from '@/types/game'

const gameStore = useGameStore()

// 使用统一的线性 SVG 图标
const iconPaths: Record<ToastType, string> = {
  success: 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z',
  error: 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z',
  warning: 'M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z',
  info: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z'
}
</script>

<template>
  <Teleport to="body">
    <div class="toast-container" role="region" aria-label="通知消息" aria-live="polite">
      <TransitionGroup name="toast">
        <div
          v-for="toast in gameStore.toasts"
          :key="toast.id"
          :class="['toast', `toast-${toast.type}`]"
          role="alert"
        >
          <div class="toast-icon-wrapper">
            <svg class="toast-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path :d="iconPaths[toast.type]"/>
            </svg>
          </div>
          <span class="toast-message">{{ toast.message }}</span>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-container {
  position: fixed;
  top: var(--spacing-lg);
  right: var(--spacing-lg);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  pointer-events: none;
  max-width: calc(100vw - var(--spacing-xl));
}

.toast {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-md);
  background: var(--bg-secondary);
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border-color);
  min-width: 200px;
  max-width: 350px;
  pointer-events: auto;
}

.toast-icon-wrapper {
  width: 28px;
  height: 28px;
  border-radius: var(--border-radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.toast-icon {
  width: 18px;
  height: 18px;
}

.toast-message {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
  line-height: var(--line-height-normal);
}

/* ===================
 * Toast 类型样式
 * =================== */
.toast-success {
  border-color: var(--color-success);
  background: linear-gradient(135deg, var(--bg-secondary), var(--color-success-bg));
}

.toast-success .toast-icon-wrapper {
  background: var(--color-success-bg);
  color: var(--color-success);
}

.toast-error {
  border-color: var(--color-error);
  background: linear-gradient(135deg, var(--bg-secondary), var(--color-error-bg));
}

.toast-error .toast-icon-wrapper {
  background: var(--color-error-bg);
  color: var(--color-error);
}

.toast-warning {
  border-color: var(--color-warning);
  background: linear-gradient(135deg, var(--bg-secondary), var(--color-warning-bg));
}

.toast-warning .toast-icon-wrapper {
  background: var(--color-warning-bg);
  color: var(--color-warning);
}

.toast-info {
  border-color: var(--color-info);
  background: linear-gradient(135deg, var(--bg-secondary), var(--color-info-bg));
}

.toast-info .toast-icon-wrapper {
  background: var(--color-info-bg);
  color: var(--color-info);
}

/* ===================
 * 过渡动画
 * =================== */
.toast-enter-active {
  animation: toast-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.toast-leave-active {
  animation: toast-out 0.25s ease-in;
}

.toast-move {
  transition: transform 0.3s ease;
}

@keyframes toast-in {
  0% {
    opacity: 0;
    transform: translateX(100%) scale(0.9);
  }
  100% {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
}

@keyframes toast-out {
  0% {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateX(50%) scale(0.9);
  }
}

/* ===================
 * 响应式
 * =================== */
@media (max-width: 480px) {
  .toast-container {
    top: var(--spacing-md);
    right: var(--spacing-md);
    left: var(--spacing-md);
  }

  .toast {
    min-width: auto;
    max-width: none;
  }
}
</style>
