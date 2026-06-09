<script setup lang="ts">
import { onMounted } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import GameHeader from '@/components/GameHeader.vue'
import GameBoard from '@/components/GameBoard.vue'
import ScorePanel from '@/components/ScorePanel.vue'
import ComboDisplay from '@/components/ComboDisplay.vue'
import ToastMessage from '@/components/ToastMessage.vue'
import GameOverModal from '@/components/GameOverModal.vue'
import HistoryModal from '@/components/HistoryModal.vue'

const gameStore = useGameStore()

onMounted(() => {
  gameStore.initGame()
})
</script>

<template>
  <div class="app">
    <!-- 背景层 -->
    <div class="app-background" aria-hidden="true"></div>

    <!-- 主容器 -->
    <div class="app-container">
      <!-- 头部区域 -->
      <GameHeader />

      <!-- 主内容区域 -->
      <main class="main-content">
        <!-- 侧边栏 -->
        <aside class="sidebar">
          <ScorePanel />
        </aside>

        <!-- 游戏区域 -->
        <section class="game-section">
          <GameBoard />
          <ComboDisplay />
        </section>
      </main>

      <!-- 页脚 -->
      <footer class="app-footer">
        <p class="footer-text">消消乐游戏 © 2026 | 使用 Vue 3 + TypeScript 构建</p>
      </footer>
    </div>

    <!-- 全局组件 -->
    <ToastMessage />
    <GameOverModal />
    <HistoryModal />
  </div>
</template>

<style>
/* ===================
 * 全局重置
 * =================== */
*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  font-size: 16px;
  -webkit-text-size-adjust: 100%;
}

html, body {
  height: 100%;
  overflow-x: hidden;
}

body {
  font-family: var(--font-family);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-normal);
  line-height: var(--line-height-normal);
  color: var(--text-primary);
  background: var(--bg-primary);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* ===================
 * 应用布局
 * =================== */
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
}

/* 背景装饰 - 使用蓝色渐变，避免紫色 */
.app-background {
  position: fixed;
  inset: 0;
  background:
    radial-gradient(ellipse 80% 50% at 20% 20%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
    radial-gradient(ellipse 60% 40% at 80% 80%, rgba(6, 182, 212, 0.06) 0%, transparent 50%),
    var(--bg-primary);
  z-index: -1;
  pointer-events: none;
}

.app-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: var(--spacing-md);
  gap: var(--spacing-md);
}

/* ===================
 * 主内容区域
 * =================== */
.main-content {
  flex: 1;
  display: flex;
  gap: var(--spacing-lg);
  align-items: flex-start;
  justify-content: center;
}

.sidebar {
  flex-shrink: 0;
}

.game-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* ===================
 * 页脚
 * =================== */
.app-footer {
  background: var(--bg-secondary);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-md) var(--spacing-lg);
  border: 1px solid var(--border-color);
  text-align: center;
}

.footer-text {
  font-size: var(--font-size-sm);
  color: var(--text-muted);
}

/* ===================
 * 响应式布局
 * =================== */
@media (max-width: 768px) {
  .main-content {
    flex-direction: column;
    align-items: center;
  }

  .sidebar {
    width: 100%;
    max-width: 450px;
  }
}

@media (max-width: 480px) {
  .app-container {
    padding: var(--spacing-sm);
  }
}
</style>
