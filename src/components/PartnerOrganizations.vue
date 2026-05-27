<template>
  <div v-if="organizations.length > 0" class="partner-organizations-footer">
    <div class="partner-section">
      <h3 class="partner-title">{{ sectionTitle }}</h3>
      <div class="partner-list">
        <div 
          v-for="org in organizations" 
          :key="org.id" 
          class="partner-card"
          @click="handleClick(org)"
        >
          <div class="partner-logo">
            <img 
              v-if="org.logo_url" 
              :src="org.logo_url" 
              :alt="org.name"
              @error="handleImageError"
            />
            <div v-else class="partner-logo-placeholder">
              <i class="bi bi-building"></i>
            </div>
          </div>
          <div class="partner-name">{{ org.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getPartnerOrganizations, type PartnerOrganization } from '../api/module/partnerOrganizations';

const organizations = ref<PartnerOrganization[]>([]);
const loading = ref(false);
const sectionTitle = ref('');

// 加载合作单位列表
const loadOrganizations = async () => {
  try {
    loading.value = true;
    const response = await getPartnerOrganizations();
    if (response.success && response.data) {
      organizations.value = response.data;
      // 获取标题（优先使用返回的标题）
      if (response.section_title && response.section_title.trim() !== '') {
        sectionTitle.value = response.section_title;
      }
    }
  } catch (error) {
    console.error('加载合作单位失败:', error);
  } finally {
    loading.value = false;
  }
};

// 处理点击事件
const handleClick = (org: PartnerOrganization) => {
  if (org.website_url) {
    window.open(org.website_url, '_blank');
  }
};

// 处理图片加载错误
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  img.style.display = 'none';
  const placeholder = img.nextElementSibling as HTMLElement;
  if (placeholder) {
    placeholder.style.display = 'flex';
  }
};

onMounted(() => {
  loadOrganizations();
});
</script>

<style scoped>
.partner-organizations-footer {
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
  padding: 40px 20px;
  margin-top: 40px;
  padding-bottom: calc(40px + env(safe-area-inset-bottom, 0px));
}

.partner-section {
  max-width: 1400px;
  margin: 0 auto;
}

.partner-title {
  font-size: 1.35rem;
  font-weight: 700;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-align: center;
  margin-bottom: 24px;
}

.partner-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 16px;
  align-items: stretch;
}

.partner-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px 12px;
  background: var(--bg-glass);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: all var(--transition-base);
  min-width: 0;
}

.partner-card:hover {
  transform: translateY(-3px);
  border-color: rgba(102, 126, 234, 0.4);
  box-shadow: var(--shadow-glow);
}

.partner-logo {
  width: 64px;
  height: 64px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--border-radius-sm);
  background: rgba(255, 255, 255, 0.05);
  overflow: hidden;
}

.partner-logo img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 8px;
}

.partner-logo-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
  font-size: 1.75rem;
}

.partner-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-align: center;
  word-break: break-word;
  line-height: 1.4;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .partner-organizations-footer {
    padding: 28px 16px;
    margin-top: 24px;
    padding-bottom: calc(88px + env(safe-area-inset-bottom, 0px));
  }

  .partner-title {
    font-size: 1.15rem;
    margin-bottom: 20px;
  }

  .partner-list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }

  .partner-card {
    padding: 14px 10px;
  }

  .partner-logo {
    width: 52px;
    height: 52px;
    margin-bottom: 8px;
  }

  .partner-name {
    font-size: 0.8125rem;
  }
}

@media (max-width: 480px) {
  .partner-list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }

  .partner-card {
    padding: 12px 8px;
  }

  .partner-logo {
    width: 44px;
    height: 44px;
  }

  .partner-name {
    font-size: 0.75rem;
  }
}
</style>

