<script setup lang="ts">
import { useGameStore } from '@/stores/gameStore'

const gameStore = useGameStore()
</script>

<template>
  <Transition name="combo-display">
    <div v-if="gameStore.combo > 1" class="combo-display" role="status" aria-live="polite">
      <div class="combo-content">
        <span class="combo-icon">🔥</span>
        <span class="combo-text">{{ gameStore.combo }}连击！</span>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.combo-display {
  display: flex;
  justify-content: center;
  margin-top: var(--spacing-md);
}

.combo-content {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-lg);
  background: linear-gradient(135deg, var(--bg-secondary), rgba(249, 115, 22, 0.15));
  border: 2px solid var(--gem-orange);
  border-radius: var(--border-radius-lg);
  box-shadow: 0 0 20px rgba(249, 115, 22, 0.3);
}

.combo-icon {
  font-size: 24px;
  animation: flame 0.5s ease-in-out infinite alternate;
}

.combo-text {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--gem-orange);
  text-shadow: 0 0 10px rgba(249, 115, 22, 0.5);
}

@keyframes flame {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.15);
  }
}

/* 过渡动画 */
.combo-display-enter-active {
  animation: combo-bounce-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.combo-display-leave-active {
  animation: combo-fade-out 0.3s ease-out;
}

@keyframes combo-bounce-in {
  0% {
    opacity: 0;
    transform: scale(0.5) translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes combo-fade-out {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(0.8);
  }
}
</style>
