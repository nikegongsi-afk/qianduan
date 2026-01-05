<template>
  <div class="app-container">
    <navcomponent></navcomponent>
    <!-- Navigation Bar
    <nav class="navbar navbar-expand-lg navbar-dark mb-3">
      <div class="container">
        <a class="navbar-brand" href="#">
          <i class="bi bi-graph-up me-2"></i>
          Expert Trader Profile
        </a>
        <div class="navbar-nav ms-auto">
          <a class="nav-link" href="#" style="color: #ffd700; font-weight: 600;">
            <i class="bi bi-robot me-1"></i>
            AI Tools
          </a>
          <a class="nav-link" href="/vip" style="color: #ffd700; font-weight: 600;">
            <i class="bi bi-crown me-1"></i>
            VIP Membership
          </a>
          <a class="nav-link" href="/login" style="color: #ffd700; font-weight: 600;">
            <i class="bi bi-box-arrow-in-right me-1"></i>
            Login
          </a>
          <a class="nav-link" href="/register" style="color: #ffd700; font-weight: 600;">
            <i class="bi bi-person-plus me-1"></i>
            Register
          </a>
        </div>
      </div>
    </nav> -->

    <!-- 移动端抖音风格布局 -->
    <div class="mobile-profile-hero" v-if="isMobile">
      <!-- 顶部背景区域 -->
      <div class="mobile-profile-header">
        <div class="mobile-profile-bg"></div>
        <div class="mobile-profile-content">
          <!-- 头像和基本信息 -->
          <div class="mobile-profile-top">
            <div class="mobile-avatar-wrapper" @click="openAvatarPreview">
              <img :src="trader_profiles.profile_image_url" alt="Avatar" class="mobile-avatar-img">
              <div class="avatar-badge">✓</div>
            </div>
            <div class="mobile-profile-basic">
              <h1 class="mobile-name-large">{{trader_profiles.trader_name}}</h1>
              <div class="mobile-id-row">
                <span class="mobile-id-text">ID: {{trader_profiles.id || 'trader'}}</span>
                <button class="copy-id-btn" @click="copyId">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
              </button>
            </div>
                </div>
                </div>
          
          <!-- 统计数据 -->
          <div class="mobile-stats-row">
            <div class="mobile-stat-item">
              <div class="stat-number-large" :class="{ 'positive': Total >= 0, 'negative': Total < 0 }">
                {{ Total>=0 ? '+':'' }}${{formatCurrency(Total)}}
                </div>
              <div class="stat-label-small">Total P&L</div>
              </div>
            <div class="mobile-stat-item">
              <div class="stat-number-large" :class="{ 'positive': Monthly >= 0, 'negative': Monthly < 0 }">
                {{ Monthly>=0 ? '+':'' }}${{formatCurrency(Monthly)}}
            </div>
              <div class="stat-label-small">Monthly P&L</div>
          </div>
            <div class="mobile-stat-item">
              <div class="stat-number-large">{{ Activecount }}</div>
              <div class="stat-label-small">Active</div>
              </div>
              </div>
          
          <!-- 简介 -->
          <div class="mobile-bio-section">
            <div class="mobile-bio-title">{{trader_profiles.professional_title}}</div>
            <div class="mobile-bio-text" v-if="trader_profiles.bio">{{trader_profiles.bio}}</div>
            </div>
          
          <!-- 操作按钮 -->
          <div class="mobile-action-buttons">
            <button class="mobile-follow-btn">
              <span>+ 关注</span>
            </button>
            <button class="mobile-message-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </button>
              </div>
              </div>
            </div>
              </div>

    <!-- 全新的网格布局系统 -->
    <div class="modern-home-layout">
      <!-- 左侧边栏 - 交易员资料（桌面端） -->
      <aside class="trader-sidebar" :class="{ 'mobile-hidden': isMobile }">
        <div class="trader-card">
          <div class="trader-avatar-wrapper" @click="openAvatarPreview">
            <img :src="trader_profiles.profile_image_url" alt="Avatar" class="trader-avatar">
            <div class="avatar-overlay">
              <button class="avatar-edit-btn" @click.stop="triggerAvatarUpload">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>
            </div>
              <input type="file" ref="avatarUpload" class="avatar-upload-input" accept="image/*" @change="handleAvatarUpload">
            </div>
          
          <div class="trader-info">
            <h2 class="trader-name">{{trader_profiles.trader_name}}</h2>
            <p class="trader-title">{{trader_profiles.professional_title}}</p>
            
            <div class="trader-metrics">
              <div class="metric-item">
                <div class="metric-icon" :style="{ background: Total >= 0 ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                  </svg>
                </div>
                <div class="metric-content">
                  <div class="metric-value" :class="{ 'positive': Total >= 0, 'negative': Total < 0 }">
                 {{ Total>=0 ? '+':'' }}${{formatCurrency(Total)}}
              </div>
                  <div class="metric-label">Total P&L</div>
                </div>
              </div>
              <div class="metric-item">
                <div class="metric-icon" :style="{ background: Monthly >= 0 ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  </svg>
            </div>
                <div class="metric-content">
                  <div class="metric-value" :class="{ 'positive': Monthly >= 0, 'negative': Monthly < 0 }">
                    {{ Monthly>=0 ? '+':'' }}${{formatCurrency(Monthly)}}
          </div>
                  <div class="metric-label">Monthly P&L</div>
              </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 快速统计卡片 -->
          <div class="quick-stats">
          <div class="stat-card">
            <div class="stat-icon-wrapper" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="8.5" cy="7" r="4"></circle>
                <path d="M20 8v6M23 11l-3 3-3-3"></path>
              </svg>
          </div>
            <div class="stat-info">
              <div class="stat-label">Active</div>
              <div class="stat-number">{{ Activecount }}</div>
            </div>
            </div>
          
          <div class="stat-card">
            <div class="stat-icon-wrapper" style="background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
            <div class="stat-info">
              <div class="stat-label">Years</div>
              <div class="stat-number">{{trader_profiles.years_of_experience}}</div>
          </div>
        </div>

          <div class="stat-card">
            <div class="stat-icon-wrapper" style="background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="20" x2="18" y2="10"></line>
                <line x1="12" y1="20" x2="12" y2="4"></line>
                <line x1="6" y1="20" x2="6" y2="14"></line>
              </svg>
          </div>
            <div class="stat-info">
              <div class="stat-label">Trades</div>
              <div class="stat-number">{{trader_profiles.total_trades}}</div>
        </div>
      </div>

          <div class="stat-card">
            <div class="stat-icon-wrapper" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polygon points="12 6 16 14 8 14"></polygon>
              </svg>
            </div>
            <div class="stat-info">
              <div class="stat-label">Win Rate</div>
              <div class="stat-number">{{trader_profiles.win_rate}}%</div>
          </div>
        </div>
      </div>

        <!-- 全新的快速操作栏 -->
        <div class="quick-actions">
          <a href="/leaderboard" class="action-button leaderboard-btn">
            <div class="action-icon-wrapper">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 9H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V11a2 2 0 0 0-2-2h-2"></path>
                <rect x="6" y="1" width="12" height="8" rx="2"></rect>
              </svg>
      </div>
            <div class="action-content">
              <div class="action-label">Leaderboard</div>
              <div class="action-subtitle">View Rankings</div>
            </div>
          </a>

          <a href="/vip" class="action-button vip-btn">
            <div class="action-icon-wrapper">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"></path>
              </svg>
              </div>
            <div class="action-content">
              <div class="action-label">VIP Center</div>
              <div class="action-value" id="vip-count">{{trader_profiles.members_count || 0}} Members</div>
              </div>
          </a>

          <button class="action-button likes-btn" id="like-badge" @click="handleLikeClick">
            <div class="action-icon-wrapper" id="like-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              </div>
            <div class="action-content">
              <div class="action-label">Likes</div>
              <div class="action-value" id="likes-count">{{ formatLikesCount(likesCount || trader_profiles.likes_count) }}</div>
            </div>
          </button>
        </div>
      </aside>

      <!-- 主内容区域 -->
      <main class="main-content">

        <!-- 交易策略标签页 -->
        <section class="strategy-section">
          <div class="section-header">
            <h2 class="section-title">
              <span class="title-icon">💡</span>
              Trading Strategy
            </h2>
            <div class="update-badge">
              <span class="badge-dot"></span>
              Updated: {{formatUSTime(strategy_info.updated_at)}}
              </div>
              </div>
              
          <div class="strategy-tabs">
            <button 
              v-for="(tab, index) in strategyTabs" 
              :key="index"
              class="tab-button"
              :class="{ active: activeTab === index }"
              @click="activeTab = index"
            >
              {{ tab.label }}
            </button>
              </div>

          <div class="strategy-content-wrapper">
            <!-- 市场分析标签页 -->
            <div v-show="activeTab === 0" class="strategy-panel">
              <div class="panel-header">
                <h3>Market Analysis</h3>
              </div>
              <div class="panel-body">
                <p class="analysis-text">{{strategy_info.market_analysis}}</p>
                <div class="media-container" v-if="strategy_info.analysis_path">
                  <audio v-if="strategy_info.stype==1" :src="strategy_info.analysis_path" controls class="media-player"></audio>
                  <video v-if="strategy_info.stype==2" :src="strategy_info.analysis_path" controls class="media-player"></video>
              </div>
              </div>
              </div>
              
            <!-- 交易重点标签页 -->
            <div v-show="activeTab === 1" class="strategy-panel">
              <div class="panel-header">
                <h3>Focus Areas</h3>
              </div>
              <div class="panel-body">
                <div class="focus-grid">
                  <div v-for="(value, index) in strategy_info.trading_focus" :key="index" class="focus-item">
                    <div class="focus-icon">{{ index + 1 }}</div>
                    <div class="focus-text">{{value}}</div>
              </div>
              </div>
              </div>
            </div>

            <!-- 风险警告标签页 -->
            <div v-show="activeTab === 2" class="strategy-panel">
              <div class="panel-header">
                <h3>Risk Warning</h3>
            </div>
              <div class="panel-body">
                <div class="warning-box">
                  <div class="warning-icon">⚠️</div>
                  <p class="warning-text">{{strategy_info.risk_warning}}</p>
                </div>
                <div class="media-container" v-if="strategy_info.warn_path">
                  <audio v-if="strategy_info.warntype==1" :src="strategy_info.warn_path" controls class="media-player"></audio>
                  <video v-if="strategy_info.warntype==2" :src="strategy_info.warn_path" controls class="media-player"></video>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 交易记录区域 - 全新的表格式布局 -->
        <section class="trades-section">
          <div class="section-header">
            <h2 class="section-title">
              <span class="title-icon">📈</span>
              Trading Records
            </h2>
            <div class="view-toggle">
              <button class="view-btn" :class="{ active: viewMode === 'grid' }" @click="viewMode = 'grid'">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
              </button>
              <button class="view-btn" :class="{ active: viewMode === 'table' }" @click="viewMode = 'table'">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="8" y1="6" x2="21" y2="6"></line>
                  <line x1="8" y1="12" x2="21" y2="12"></line>
                  <line x1="8" y1="18" x2="21" y2="18"></line>
                  <line x1="3" y1="6" x2="3.01" y2="6"></line>
                  <line x1="3" y1="12" x2="3.01" y2="12"></line>
                  <line x1="3" y1="18" x2="3.01" y2="18"></line>
                </svg>
              </button>
              </div>
          </div>

          <!-- 网格视图 -->
          <div v-if="viewMode === 'grid'" class="trades-grid">
            <div v-for="value in trades" :key="value.id || value.symbol" class="trade-card-modern">
              <div class="trade-card-header">
                <div class="trade-symbol-section">
                  <div class="symbol-badge">{{value.symbol || '-'}}</div>
                  <div class="market-tag" :class="getCountryClass(value.trade_market)">
                    {{(value.trade_market || '').toUpperCase()}}
              </div>
                </div>
                <div class="status-indicator" :class="getStatusClass(value.status, value.Ratio)">
                  <span class="status-dot"></span>
                  <span class="status-label">{{getStatusText(value.status, value.Ratio)}}</span>
                </div>
              </div>

              <div class="trade-image-wrapper" v-if="value.image_url" @click="openImageModal(value.symbol,value.image_url)">
                <img :src="value.image_url" alt="Chart" class="trade-image">
                <div class="image-overlay">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
              </div>
              </div>
               
              <div class="trade-details-grid">
                <div class="detail-cell">
                  <span class="detail-label">Entry</span>
                  <span class="detail-value">{{formatUSDate(value.entry_date)}}</span>
              </div>
                <div class="detail-cell">
                  <span class="detail-label">Entry Price</span>
                  <span class="detail-value">{{value.currency}}{{formatCurrency(value.entry_price)}}</span>
            </div>
                <div class="detail-cell" v-if="value.status == 'Active'">
                  <span class="detail-label">Current</span>
                  <span class="detail-value">{{value.currency}}{{formatCurrency(value.current_price)}}</span>
                </div>
                <div class="detail-cell" v-else>
                  <span class="detail-label">Exit</span>
                  <span class="detail-value">{{formatUSDate(value.exit_date)}}</span>
                </div>
                <div class="detail-cell" v-if="value.status == 'Active'">
                  <span class="detail-label">Qty</span>
                  <span class="detail-value">{{formatQuantity(value.size)}}</span>
                </div>
                <div class="detail-cell" v-else>
                  <span class="detail-label">Exit Price</span>
                  <span class="detail-value">{{value.currency}}{{formatCurrency(value.exit_price)}}</span>
          </div>
        </div>

              <div class="trade-performance">
                <div class="performance-row">
                  <div class="perf-item">
                    <span class="perf-label">Entry Amount</span>
                    <span class="perf-value">{{value.currency || ''}}{{formatCurrency((value.entry_price || 0) * (value.size || 0))}}</span>
              </div>
                  <div class="perf-item">
                    <span class="perf-label">Market Value</span>
                    <span class="perf-value">{{value.currency || ''}}{{formatCurrency(value.Market_Value || 0)}}</span>
                  </div>
                </div>
                <div class="performance-row highlight">
                  <div class="perf-item">
                    <span class="perf-label">P&L Ratio</span>
                    <span class="perf-value" :class="(value.Ratio || 0) > 0 ? 'profit' : 'loss'">
                      {{value.Ratio || 0}}%
                    </span>
                  </div>
                  <div class="perf-item">
                    <span class="perf-label">P&L Amount</span>
                    <span class="perf-value" :class="(value.Ratio || 0) > 0 ? 'profit' : 'loss'">
                      {{value.currency || ''}}{{formatCurrency(value.Amount || 0)}}
                    </span>
                  </div>
                </div>
            </div>
          </div>
        </div>

          <!-- 表格视图 -->
          <div v-if="viewMode === 'table'" class="trades-table-wrapper">
            <table class="trades-table">
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th>Market</th>
                  <th>Status</th>
                  <th>Entry Date</th>
                  <th>Entry Price</th>
                  <th v-if="trades.some(t => t.status === 'Active')">Current Price</th>
                  <th>Exit Date</th>
                  <th>P&L Ratio</th>
                  <th>P&L Amount</th>
                  <th>Chart</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="value in trades" :key="value.id || value.symbol" class="trade-row">
                  <td class="symbol-cell">
                    <strong>{{value.symbol || '-'}}</strong>
                  </td>
                  <td>
                    <span class="market-badge" :class="getCountryClass(value.trade_market)">
                      {{(value.trade_market || '').toUpperCase()}}
                    </span>
                  </td>
                  <td>
                    <span class="status-badge" :class="getStatusClass(value.status, value.Ratio)">
                      {{getStatusText(value.status, value.Ratio)}}
                    </span>
                  </td>
                  <td>{{formatUSDate(value.entry_date)}}</td>
                  <td>{{value.currency}}{{formatCurrency(value.entry_price)}}</td>
                  <td v-if="trades.some(t => t.status === 'Active')">
                    <span v-if="value.status == 'Active'">{{value.currency}}{{formatCurrency(value.current_price)}}</span>
                    <span v-else>-</span>
                  </td>
                  <td>{{value.exit_date ? formatUSDate(value.exit_date) : '-'}}</td>
                  <td>
                    <span class="pnl-ratio" :class="(value.Ratio || 0) > 0 ? 'profit' : 'loss'">
                      {{value.Ratio || 0}}%
                    </span>
                  </td>
                  <td>
                    <span class="pnl-amount" :class="(value.Ratio || 0) > 0 ? 'profit' : 'loss'">
                      {{value.currency || ''}}{{formatCurrency(value.Amount || 0)}}
                    </span>
                  </td>
                  <td>
                    <button v-if="value.image_url" @click="openImageModal(value.symbol,value.image_url)" class="chart-btn">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
      </div>
        </section>
      </main>
    </div>

    <!-- Floating Contact Button -->
    <div class="contact-btn" @click="toggleContactPopup">
      <i class="bi bi-people-fill"></i>
      Join Community
    </div>

     <!-- Redirect Message -->
    <div class="redirect-message" v-show="showContactPopup">
        <span class="text">Redirecting to WhatsApp Community</span><span class="dots"></span>
    </div>
    
    <!-- 移动端底部快速操作栏 -->
    <div class="mobile-bottom-actions" v-if="isMobile">
      <a href="/leaderboard" class="mobile-bottom-btn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M6 9H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V11a2 2 0 0 0-2-2h-2"></path>
          <rect x="6" y="1" width="12" height="8" rx="2"></rect>
        </svg>
        <span>Ranking</span>
      </a>
      
      <a href="/vip" class="mobile-bottom-btn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"></path>
        </svg>
        <span>VIP</span>
      </a>
      
      <button class="mobile-bottom-btn" id="mobile-like-btn" @click="handleLikeClick">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" :class="{ 'liked': isLiked }">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
        <span>Likes</span>
        <span class="mobile-like-count">{{ formatLikesCount(likesCount || trader_profiles.likes_count) }}</span>
      </button>
      
      <button class="mobile-bottom-btn" @click="toggleContactPopup">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
        </svg>
        <span>Community</span>
      </button>
    </div>
    <!-- Contact Popup
    <div class="contact-popup" v-show="showContactPopup">
      <h4><i class="bi bi-envelope"></i> Contact Information</h4>
      <div class="contact-item">
        <i class="bi bi-telegram"></i>
        <span>@traderjohn</span>
      </div>
      <div class="contact-item">
        <i class="bi bi-envelope"></i>
        <span>contact@traderjohn.com</span>
      </div>
      <div class="contact-item">
        <i class="bi bi-discord"></i>
        <span>TraderJohn#1234</span>
      </div>
    </div> -->

    <!-- Image Modal -->
    <div class="modal fade" id="imageModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ selectedTradeSymbol }}</h5>
            <button type="button" class="btn-close" @click="closeImageModal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <img :src="selectedTradeName" alt="Trade Chart" class="modal-image">
          </div>
        </div>
      </div>
    </div>

    <!-- Avatar Preview Modal -->
    <div class="modal fade avatar-preview-modal" id="avatarPreviewModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-md">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Profile Picture</h5>
            <button type="button" class="btn-close" @click="closeAvatarPreview" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <img :src="trader_profiles.profile_image_url" alt="Avatar Preview" class="avatar-preview-img">
          </div>
        </div>
      </div>
    </div>
     <!-- Avatar Preview Modal -->
    
    <!-- Welcome Popup Modal -->
    <div class="modal fade" id="welcomePopupModal" tabindex="-1" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content welcome-popup-modal">
                <div class="modal-body">
                  
                    <button type="button" class="btn-close btn-close-white" id="allow_close" data-bs-dismiss="modal" style="position: absolute;right: 20px; top: 20px;" v-if="announcementData && announcementData.allow_close_dialog===1"></button>
                    
                    <div class="welcome-content">
                        <h3 class="teacher-intro">{{trader_profiles.trader_name}} - {{trader_profiles.professional_title}}</h3>
                        <p class="welcome-description">
                            Dedicated to providing professional trading strategy analysis and real-time market guidance for investors
                        </p>
                        
                        <div class="performance-overview">
                            <div class="performance-stats">
                                <div class="stat-box">
                                    <div class="stat-icon"><i class="bi bi-trophy"></i></div>
                                    <div class="stat-info">
                                        <div class="stat-value" id="total-profit-display" style="font-size: 16px;" :class="{ 'profit-positive': Total >= 0, 'profit-negative': Total < 0 }">
                                            {{ Total>=0 ? '+':'' }}${{formatCurrency(Total)}}
                                        </div>
                                        <div class="stat-label">Total Profit</div>
                                    </div>
                                </div>
                                <div class="stat-box">
                                    <div class="stat-icon"><i class="bi bi-calendar-check"></i></div>
                                    <div class="stat-info">
                                        <div class="stat-value" id="monthly-profit-display" style="font-size: 16px;" :class="{ 'profit-positive': Monthly >= 0, 'profit-negative': Monthly < 0 }">
                                            {{ Monthly>=0 ? '+':'' }}${{formatCurrency(Monthly)}}
                                        </div>
                                        <div class="stat-label">Monthly Profit</div>
                                    </div>
                                </div>
                                <div class="stat-box">
                                    <div class="stat-icon"><i class="bi bi-graph-up"></i></div>
                                    <div class="stat-info">
                                        <div class="stat-value" id="active-trades-display" style="font-size: 16px;">
                                            {{ Activecount }}
                                        </div>
                                        <div class="stat-label">Active Trades</div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="announcement-info" id="announcement-section">
                                <div class="announcement-header">
                                    <i class="bi bi-megaphone-fill"></i>
                                    <span>Important Announcement</span>
                                </div>
                                <div class="announcement-content" id="announcement-content">
                                    <div style="margin-bottom: 0.5rem;">
                                        <div style="font-weight: 600; color: #ffd700; margin-bottom: 0.5rem; font-size: 1rem;">
                                            {{ announcementData?.title || '' }}
                                        </div>
                                        <div style="color: #e0e0e0; line-height: 1.6; font-size: 0.9rem;">
                                            {{ announcementData?.content || '' }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                        
                        <div class="community-highlight">
                            <div class="community-benefits">
                                <h4><i class="bi bi-people-fill"></i> Join Exclusive Trading Community</h4>
                                <ul class="benefits-list">
                                    <li><i class="bi bi-check-circle-fill"></i> Real-time Trading Signals</li>
                                    <li><i class="bi bi-check-circle-fill"></i> Professional Strategy Analysis</li>
                                    <li><i class="bi bi-check-circle-fill"></i> One-on-One Trading Guidance</li>
                                    <li><i class="bi bi-check-circle-fill"></i> Exclusive Market Analysis Reports</li>
                                </ul>
                            </div>
                        </div>
                        
                        <div class="welcome-cta">
                            <button class="btn-community-primary" @click="joinCommunity">
                                <i class="bi bi-people-fill"></i>
                                Join Exclusive Community Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- 合作单位 -->
    <PartnerOrganizations />
  </div>
</template>

<script lang="ts" setup>
import navcomponent from '../component/nav/nav.vue'
import PartnerOrganizations from '@/components/PartnerOrganizations.vue';
import moment from 'moment';
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { Modal } from 'bootstrap';
import{getIndexData,get_whatsapp_link,getannouncement,likeTrader} from '../../api/module/web/index'
import { useUserStore } from '@/store';
import { layer } from '@layui/layui-vue';
const trader_profiles=ref({});
const strategy_info=ref({
    "updated_at": "",
    "market_analysis": "",
    "trading_focus": [
    ],
    "risk_warning": "",
    "id": 0,
    "trader_uuid": "",
    "stype": 0,
    "analysis_path": "",
    "warntype": 0,
    "warn_path": ""
});
const trades=ref([]);
const Activecount=ref(0)
const Monthly=ref(0)
const Total=ref(0)
const userStore = useUserStore()
// State for contact popup
const showContactPopup = ref(false);
// State for image modal
const selectedTradeSymbol = ref('');
const selectedTradeName = ref('');
const selectedImageUrl = ref('');
const announcementData=ref({});
let imageModalInstance: Modal | null = null;
let avatarPreviewModalInstance: Modal | null = null;
// 点赞状态
const likesCount = ref(0);
const isLiked = ref(false);
const likeIcon = ref<HTMLElement | null>(null);
// 新的响应式变量
const activeTab = ref(0);
const viewMode = ref('grid');
const isMobile = ref(false);
const strategyTabs = [
  { label: 'Market Analysis', icon: '📊' },
  { label: 'Focus Areas', icon: '🎯' },
  { label: 'Risk Warning', icon: '⚠️' }
];

// 检测移动端
const checkMobile = () => {
  isMobile.value = window.innerWidth <= 968;
};

// 初始化加载数据
onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
  try{
  // 检查 indexData 是否已经是对象，如果是则直接使用，否则解析 JSON
  let indexdata;
  if (typeof userStore.indexData === 'string') {
    indexdata = JSON.parse(userStore.indexData || '{}');
  } else {
    indexdata = userStore.indexData || {};
  }
  trader_profiles.value=indexdata.trader_profiles;
    if(indexdata.strategy_info){
      strategy_info.value=indexdata.strategy_info;
    }
    
    // 对本地存储的数据也进行过滤和排序
    if(indexdata.trades && Array.isArray(indexdata.trades)) {
      // 调试：显示原始交易记录数量
      console.log(`📊 [本地存储] 原始交易记录数量: ${indexdata.trades.length}`);
      console.log(`📊 [本地存储] 交易记录详情:`, indexdata.trades.map((t: any) => ({
        symbol: t.symbol,
        status: t.status,
        entry_date: t.entry_date,
        exit_date: t.exit_date
      })));
      
      // 暂时移除时间限制，显示所有交易记录（仅过滤无效数据）
      const filteredTrades = indexdata.trades.filter((trade: any) => {
        // 只过滤掉没有entry_date的记录
        if (!trade.entry_date) {
          console.warn('⚠️ 发现无效交易记录（缺少entry_date）:', trade);
          return false;
        }
        return true;
      });
      
      // 调试：显示过滤后的交易记录数量
      console.log(`📊 [本地存储] 过滤后交易记录数量: ${filteredTrades.length} (过滤掉 ${indexdata.trades.length - filteredTrades.length} 条无效记录)`);
      
      const sortedTrades = filteredTrades.sort((a: any, b: any) => {
        // 首先按重点交易排序：重点交易在前
        // 处理 null/undefined 的情况
        const isImportantA = a.is_important === true || a.is_important === 1 || a.is_important === 'true' || a.is_featured === true || a.is_featured === 1;
        const isImportantB = b.is_important === true || b.is_important === 1 || b.is_important === 'true' || b.is_featured === true || b.is_featured === 1;
        
        if (isImportantA !== isImportantB) {
          return isImportantA ? -1 : 1; // 重点交易在前
        }
        
        // 然后按状态排序：Active在前，平仓在后
        const isActiveA = a.status === 'Active';
        const isActiveB = b.status === 'Active';
        
        if (isActiveA !== isActiveB) {
          return isActiveA ? -1 : 1; // Active在前
        }
        
        // 同状态内按时间排序
        if (isActiveA) {
          // 持仓的按买入时间排序（最新的在前）
          const dateA = new Date(a.entry_date);
          const dateB = new Date(b.entry_date);
          return dateB.getTime() - dateA.getTime();
        } else {
          // 平仓的按退出时间排序（最新的在前）
          const dateA = new Date(a.exit_date || a.entry_date);
          const dateB = new Date(b.exit_date || b.entry_date);
          return dateB.getTime() - dateA.getTime();
        }
      });
      
      // 调试信息：显示重点交易数量
      const importantTrades = sortedTrades.filter((t: any) => t.is_important === true || t.is_important === 1 || t.is_featured === true || t.is_featured === 1);
      if (importantTrades.length > 0) {
        console.log(`⭐ 重点交易记录数量: ${importantTrades.length}`, importantTrades.map((t: any) => ({ symbol: t.symbol, is_important: t.is_important })));
      }
      
      trades.value = sortedTrades;
      console.log(`✅ [本地存储] 最终trades.value数量: ${trades.value.length}`);
      console.log(`✅ [本地存储] 最终trades.value内容:`, trades.value.map((t: any) => t.symbol));
    } else {
      trades.value = indexdata.trades || [];
      console.log(`⚠️ [本地存储] 使用原始trades数据，数量: ${trades.value.length}`);
    }
   
    if(trades.value){
      Activecount.value=trades.value.filter((item:any)=>item.status=='Active').length
      console.log(`📈 Active交易数量: ${Activecount.value}`);
    } else {
      console.warn('⚠️ trades.value为空或undefined');
    }
    Monthly.value=indexdata.Monthly;
    Total.value=indexdata.Total;
  }
  catch(error)
  {
    console.log(error)
  }
  getindexdata()
  getannouncementdataData()

  
  // 初始化点赞数
  if (trader_profiles.value && trader_profiles.value.likes_count) {
    likesCount.value = trader_profiles.value.likes_count;
  }
  
  // 确保点赞数显示正确
  setTimeout(() => {
    updateLikeIcon();
  }, 100);
});

// 复制ID
const copyId = () => {
  const id = trader_profiles.value?.id || 'trader';
  if (navigator.clipboard) {
    navigator.clipboard.writeText(id.toString()).then(() => {
      if (window.layer) {
        window.layer.msg('ID已复制', { icon: 1, time: 1000 });
      }
    }).catch(() => {
      if (window.layer) {
        window.layer.msg('复制失败', { icon: 2, time: 1000 });
      }
    });
  }
};

// 清理事件监听
onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
});

// 处理点赞点击事件
const handleLikeClick = async () => {
  try {
    try{
        let histaryday = new Date();
        histaryday.setDate(histaryday.getDate() - 1);
        console.log(histaryday.toISOString().slice(0, 10))
        localStorage.removeItem(`traderlikes_${histaryday.toISOString().slice(0, 10)}`)
    }
    catch(error){
      
    }
     const today = new Date().toISOString().slice(0, 10);
 
    const likeKey = `traderlikes_${today}`;
    
      if (localStorage.getItem(likeKey)) {
         layer.msg("Today and past, please come back tomorrow. Thank you for your support!", { icon : 6, time: 1000})
       
        return;
      }
   
    if (!trader_profiles.value || !trader_profiles.value.id) {
      console.error('Trader ID not found');
      return;
    }
    
    const response = await likeTrader({
      id: trader_profiles.value.id
    });
    
    if (response.success) {
      localStorage.setItem(likeKey, '1');
      isLiked.value = response.isLiked;
       layer.msg("Liked successfully, thank you!", { icon : 6, time: 1000})
      // 更新点赞数
      if (isLiked.value) {
        likesCount.value++;
      } else {
        likesCount.value--;
      }
      
      // 更新显示的点赞数
      if (trader_profiles.value) {
        trader_profiles.value.likes_count = likesCount.value;
      }
      
      // 更新UI显示
      updateLikeIcon();
    } else {
      console.error('Like operation failed:', response.message);
    }
  } catch (error) {
    console.error('Error during like operation:', error);
  }
};

// 更新点赞图标样式
const updateLikeIcon = () => {
  const likeButton = document.getElementById('like-badge');
  if (likeButton) {
    if (isLiked.value) {
      likeButton.classList.add('active');
    } else {
      likeButton.classList.remove('active');
    }
  }
  
  // 更新点赞数显示 - 优先使用响应式变量
  const likesCountElement = document.getElementById('likes-count');
  if (likesCountElement) {
    // 使用响应式的 likesCount 作为主要数据源
    const count = likesCount.value || trader_profiles.value?.likes_count || 0;
    likesCountElement.textContent = formatLikesCount(count);
  }
};
// Refs
const avatarUpload = ref<HTMLInputElement>();

// Toggle contact popup
const toggleContactPopup = async () => {
  showContactPopup.value = !showContactPopup.value;

  const response=await get_whatsapp_link();
    if(response.success)
    {
      window.location.href = response.data;
      setTimeout(() => {
                        showContactPopup.value = !showContactPopup.value;
      }, 3000);
    }
    else
    {
      showContactPopup.value = !showContactPopup.value;
    }
};

// Open image modal
const openImageModal = (symbol: string, name: string) => {
  selectedTradeSymbol.value = symbol;
  selectedTradeName.value = name;
  selectedImageUrl.value = `https://via.placeholder.com/800x600?text=${symbol}+Detailed+Chart`;
  
  if (!imageModalInstance) {
    const modalElement = document.getElementById('imageModal');
    if (modalElement) {
      imageModalInstance = new Modal(modalElement);
    }
  }
  
  imageModalInstance?.show();
};

// Close image modal
const closeImageModal = () => {
  imageModalInstance?.hide();
};

// Open avatar preview
const openAvatarPreview = () => {
  if (!avatarPreviewModalInstance) {
    const modalElement = document.getElementById('avatarPreviewModal');
    if (modalElement) {
      avatarPreviewModalInstance = new Modal(modalElement);
    }
  }
  
  avatarPreviewModalInstance?.show();
};

// Close avatar preview
const closeAvatarPreview = () => {
  avatarPreviewModalInstance?.hide();
};

// Trigger avatar upload
const triggerAvatarUpload = () => {
  avatarUpload.value?.click();
};

// Handle avatar upload
const handleAvatarUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (!file) return;
  
  // Check file type and size
  if (!file.type.startsWith('image/')) {
    alert('请上传图片文件');
    return;
  }
  
  if (file.size > 5 * 1024 * 1024) {
    alert('图片大小不能超过5MB');
    return;
  }
  
  // In a real application, you would upload the file here
  alert('Avatar upload functionality would be implemented here');
};
const getindexdata= async()=>{
  try {
    const res=await getIndexData();
    console.log(`🔍 [API] 完整API响应:`, res);
    console.log(`🔍 [API] res.success:`, res.success);
    console.log(`🔍 [API] res.data:`, res.data);
    
    if(res.success && res.data){
      userStore.indexData=JSON.stringify(res.data);
      trader_profiles.value=res.data.trader_profiles;
       if(res.data.strategy_info){
      strategy_info.value=res.data.strategy_info;
       }
      
      // 调试：显示原始交易记录数量
      console.log(`📊 [API] 原始交易记录数量: ${res.data.trades?.length || 0}`);
      console.log(`📊 [API] res.data.trades 类型:`, Array.isArray(res.data.trades) ? 'Array' : typeof res.data.trades);
      console.log(`📊 [API] res.data 所有键:`, Object.keys(res.data));
      
      if (res.data.trades && Array.isArray(res.data.trades)) {
        console.log(`📊 [API] 交易记录详情（前10条）:`, res.data.trades.slice(0, 10).map((t: any) => ({
          symbol: t.symbol,
          status: t.status,
          entry_date: t.entry_date,
          exit_date: t.exit_date,
          id: t.id
        })));
      } else {
        console.warn(`⚠️ [API] res.data.trades 不是数组:`, res.data.trades);
      }
    
    // 暂时移除时间限制，显示所有交易记录（仅过滤无效数据）
    const filteredTrades = (res.data.trades || []).filter((trade: any) => {
      // 只过滤掉没有entry_date的记录
      if (!trade.entry_date) {
        console.warn('⚠️ 发现无效交易记录（缺少entry_date）:', trade);
        return false;
      }
      return true;
    });
    
    // 调试：显示过滤后的交易记录数量
    console.log(`📊 [API] 过滤后交易记录数量: ${filteredTrades.length} (过滤掉 ${(res.data.trades?.length || 0) - filteredTrades.length} 条无效记录)`);
    
    // 复杂排序：首先按重点交易，然后按状态，最后按时间
    const sortedTrades = filteredTrades.sort((a: any, b: any) => {
      // 首先按重点交易排序：重点交易在前
      // 处理 null/undefined 的情况
      const isImportantA = a.is_important === true || a.is_important === 1 || a.is_important === 'true' || a.is_featured === true || a.is_featured === 1;
      const isImportantB = b.is_important === true || b.is_important === 1 || b.is_important === 'true' || b.is_featured === true || b.is_featured === 1;
      
      if (isImportantA !== isImportantB) {
        return isImportantA ? -1 : 1; // 重点交易在前
      }
      
      // 然后按状态排序：Active在前，平仓在后
      const isActiveA = a.status === 'Active';
      const isActiveB = b.status === 'Active';
      
      if (isActiveA !== isActiveB) {
        return isActiveA ? -1 : 1; // Active在前
      }
      
      // 同状态内按时间排序
      if (isActiveA) {
        // 持仓的按买入时间排序（最新的在前）
        const dateA = new Date(a.entry_date);
        const dateB = new Date(b.entry_date);
        return dateB.getTime() - dateA.getTime();
      } else {
        // 平仓的按退出时间排序（最新的在前）
        const dateA = new Date(a.exit_date || a.entry_date);
        const dateB = new Date(b.exit_date || b.entry_date);
        return dateB.getTime() - dateA.getTime();
      }
    });
    
    // 调试信息：显示重点交易数量
    const importantTrades = sortedTrades.filter((t: any) => t.is_important === true || t.is_important === 1 || t.is_featured === true || t.is_featured === 1);
    if (importantTrades.length > 0) {
      console.log(`⭐ 重点交易记录数量: ${importantTrades.length}`, importantTrades.map((t: any) => ({ symbol: t.symbol, is_important: t.is_important })));
    }
    
    trades.value = sortedTrades;
    console.log(`✅ [API] 最终trades.value数量: ${trades.value.length}`);
    console.log(`✅ [API] 最终trades.value内容:`, trades.value.map((t: any) => t.symbol));
    
    Activecount.value=trades.value.filter((item:any)=>item.status=='Active').length
    console.log(`📈 Active交易数量: ${Activecount.value}`);
    
    Monthly.value=res.data.Monthly;
    Total.value=res.data.Total;
    
    // 更新点赞数
    if (res.data.trader_profiles && res.data.trader_profiles.likes_count !== undefined) {
      likesCount.value = res.data.trader_profiles.likes_count;
      if (trader_profiles.value) {
        trader_profiles.value.likes_count = res.data.trader_profiles.likes_count;
      }
      // 延迟更新UI，确保DOM已渲染
      setTimeout(() => {
        updateLikeIcon();
      }, 100);
    }
   
    } else {
      console.warn(`⚠️ [API] API返回失败或数据为空:`, {
        success: res.success,
        hasData: !!res.data,
        dataKeys: res.data ? Object.keys(res.data) : []
      });
    }
  } catch (error) {
    console.error(`❌ [API] 获取数据异常:`, error);
  }
};
const getannouncementdataData= async()=>{
  try {
    const res=await getannouncement();
    if(res.success && res.announcement){
      announcementData.value=res.announcement;
      // Show welcome modal when component mounts
      const delaySeconds = announcementData.value?.delay_seconds || 0;
      if (delaySeconds > 0) {
        setTimeout(() => {
            openWelcomeModal();
        }, delaySeconds * 1000);
      }
    }
  } catch (error) {
    console.error('获取公告数据失败:', error);
    // 设置默认值避免后续错误
    announcementData.value = announcementData.value || {};
  }
}
// // Set up event listeners when component mounts
// onMounted(() => {
//   getindexdata()
//   // // Close contact popup when clicking outside
//   // document.addEventListener('click', (e) => {
//   //   const target = e.target as HTMLElement;
//   //   if (!target.closest('.contact-btn') && !target.closest('.contact-popup') && showContactPopup.value) {
//   //     showContactPopup.value = false;
//   //   }
//   // });
// });

// Welcome Modal functionality
let welcomeModalInstance: Modal | null = null;

// Function to open welcome modal
const openWelcomeModal = () => {
  if (!welcomeModalInstance) {
    const modalElement = document.getElementById('welcomePopupModal');
    if (modalElement) {
      welcomeModalInstance = new Modal(modalElement, {
        backdrop: 'static',
        keyboard: false
      });
    }
  }
  
  welcomeModalInstance?.show();
};

// Function to close welcome modal
const closeWelcomeModal = () => {
  welcomeModalInstance?.hide();
};

// Function to handle joining community
const joinCommunity = () => {
  // Close welcome popup
  closeWelcomeModal();
  
  // Trigger contact button click event after a delay
  setTimeout(() => {
    toggleContactPopup();
  }, 300);
};

// 获取国家标识的样式类
const getCountryClass = (market: string) => {
  if (!market) return 'country-default';
  const marketUpper = market.toUpperCase();
  switch(marketUpper) {
    case 'USA':
    case 'NASDAQ':
    case 'NYSE':
      return 'country-usa';
    case 'UK':
    case 'LSE':
      return 'country-uk';
    case 'CN':
    case 'SSE':
    case 'SZSE':
      return 'country-cn';
    default:
      return 'country-default';
  }
};

// 获取国家旗帜emoji（简化版，返回空字符串）
const getCountryFlag = (market: string) => {
  return ''; // 不显示旗帜图标
};

// 获取状态样式类
const getStatusClass = (status: string, ratio: number) => {
  if (!status) return 'status-default';
  if (status.toLowerCase() === 'active') {
    return 'status-active';
  } else {
    // 对于所有非Active状态，根据盈亏情况判断是止盈还是止损
    if (ratio > 0) {
      return 'status-take-profit';
    } else {
      return 'status-stop-loss';
    }
  }
};

// 获取状态图标（简化版，返回空字符串）
const getStatusIcon = (status: string) => {
  return ''; // 不显示状态图标
};

// 获取状态文本（根据盈亏情况显示止盈/止损）
const getStatusText = (status: string, ratio: number) => {
  if (!status) return 'Unknown';
  if (status.toLowerCase() === 'active') {
    return 'Active';
  } else {
    // 对于所有非Active状态，根据盈亏情况判断是止盈还是止损
    if (ratio > 0) {
      return 'Take Profit';
    } else {
      return 'Stop Loss';
    }
  }
};

// 格式化日期为美国时间格式
const formatUSDate = (dateString: string) => {
  if (!dateString) return '';
  
  try {
    // 确保正确解析UTC时间字符串
    let date: Date;
    
    // 如果时间字符串没有时区信息，假设它是UTC时间
    if (dateString.includes('T') && !dateString.includes('Z') && !dateString.includes('+') && !dateString.includes('-', 10)) {
      // 添加Z表示UTC时间
      date = new Date(dateString + 'Z');
    } else {
      date = new Date(dateString);
    }
    
    // 验证日期是否有效
    if (isNaN(date.getTime())) {
      console.error('无效的时间字符串:', dateString);
      return dateString;
    }
    
    return date.toLocaleDateString('en-US', {
      timeZone: 'America/New_York',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    console.error('日期转换错误:', error, '原始时间:', dateString);
    return dateString; // 如果解析失败，返回原始字符串
  }
};

// 格式化时间，转换为美国当地时间
const formatUSTime = (dateString: string) => {
  if (!dateString) return '';
  
  try {
    // 确保正确解析UTC时间字符串
    let date: Date;
    
    // 如果时间字符串没有时区信息，假设它是UTC时间
    if (dateString.includes('T') && !dateString.includes('Z') && !dateString.includes('+') && !dateString.includes('-', 10)) {
      // 添加Z表示UTC时间
      date = new Date(dateString + 'Z');
    } else {
      date = new Date(dateString);
    }
    
    // 验证日期是否有效
    if (isNaN(date.getTime())) {
      console.error('无效的时间字符串:', dateString);
      return dateString;
    }
    
    // 转换为美国东部时间 (EST/EDT)
    const usTime = date.toLocaleString('en-US', {
      timeZone: 'America/New_York',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    
    // 添加时区标识
    const timeZone = date.toLocaleString('en-US', {
      timeZone: 'America/New_York',
      timeZoneName: 'short'
    }).split(' ').pop();
    
    return `${usTime} ${timeZone}`;
  } catch (error) {
    console.error('时间转换错误:', error, '原始时间:', dateString);
    // 如果解析失败，返回原始字符串
    return dateString;
  }
};

// 格式化货币金额，添加千位分隔符
const formatCurrency = (amount: number | string) => {
  if (!amount && amount !== 0) return '0';
  
  // 转换为数字
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  // 添加千位分隔符
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

// 格式化数量，添加千位分隔符
const formatQuantity = (quantity: number | string) => {
  if (!quantity && quantity !== 0) return '0';
  
  // 转换为数字
  const num = typeof quantity === 'string' ? parseFloat(quantity) : quantity;
  
  // 添加千位分隔符，不显示小数位
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
};

// 格式化点赞数
const formatLikesCount = (count: number | string | undefined) => {
  if (!count && count !== 0) return '0K';
  
  // 转换为数字
  const num = typeof count === 'string' ? parseFloat(count) : count;
  
  if (isNaN(num)) return '0K';
  
  // 如果大于1000，显示为K格式
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  
  // 否则直接显示数字
  return num.toString();
};


</script>

<style scoped>

:root {
  --primary-color: #667eea;
  --primary-dark: #764ba2;
  --secondary-color: #fa709a;
  --accent-color: #00f2fe;
  --success-color: #10b981;
  --danger-color: #ef4444;
  --warning-color: #f59e0b;
  --text-color: #ffffff;
  --border-color: rgba(255, 255, 255, 0.1);
  --gold-color: #f093fb;
}

.app-container {
  background: var(--bg-primary);
  min-height: 100vh;
  width: 100%;
  position: relative;
}

/* 全新的网格布局系统 */
.modern-home-layout {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: var(--spacing-xl);
  max-width: 1600px;
  margin: 0 auto;
  padding: var(--spacing-xl) var(--spacing-md);
  min-height: calc(100vh - 80px);
  width: 100%;
  box-sizing: border-box;
}

/* 左侧边栏 - 交易员资料 */
.trader-sidebar {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  position: sticky;
  top: 100px;
  height: fit-content;
}

.trader-card {
  background: var(--bg-glass);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-lg);
}

.trader-avatar-wrapper {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto var(--spacing-lg);
  cursor: pointer;
}

.trader-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid transparent;
  background: var(--primary-gradient);
  padding: 3px;
  box-sizing: border-box;
}

.avatar-overlay {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity var(--transition-base);
}

.trader-avatar-wrapper:hover .avatar-overlay {
  opacity: 1;
}

.avatar-edit-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--primary-gradient);
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
}

.avatar-edit-btn svg {
  width: 100%;
  height: 100%;
}

.trader-info {
  text-align: center;
}

.trader-name {
  font-size: 24px;
  font-weight: 700;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: var(--spacing-sm);
}

.trader-title {
  color: var(--text-secondary);
  font-size: 14px;
  margin-bottom: var(--spacing-lg);
}

.trader-metrics {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.metric-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: rgba(255, 255, 255, 0.03);
  border-radius: var(--border-radius-sm);
}

.metric-icon {
  font-size: 24px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--primary-gradient);
  border-radius: 10px;
  color: white;
  flex-shrink: 0;
}

.metric-icon svg {
  width: 20px;
  height: 20px;
  stroke-width: 2.5;
}

.metric-content {
  flex: 1;
}

.metric-value {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
}

.metric-value.positive {
  color: var(--color-success);
}

.metric-value.negative {
  color: var(--color-danger);
}

.metric-label {
  font-size: 12px;
  color: var(--text-muted);
}

/* 快速统计卡片 */
.quick-stats {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.stat-card {
  background: var(--bg-glass);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: var(--spacing-lg);
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  transition: all var(--transition-base);
}

.stat-card:hover {
  transform: translateX(4px);
  border-color: rgba(102, 126, 234, 0.3);
}

.stat-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.stat-icon-wrapper svg {
  width: 24px;
  height: 24px;
}

.stat-info {
  flex: 1;
}

.stat-label {
  font-size: 12px;
  color: var(--text-muted);
  margin-bottom: 4px;
}

.stat-number {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
}

.stat-number.positive {
  color: var(--color-success);
}

.stat-number.negative {
  color: var(--color-danger);
}

/* 主内容区域 */
.main-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
  width: 100%;
  min-width: 0;
  overflow: visible;
}

/* 策略区域 */
.strategy-section {
  background: var(--bg-glass);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-md);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
}

.section-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: 24px;
  font-weight: 700;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.title-icon {
  font-size: 28px;
}

.update-badge {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: 6px 12px;
  background: rgba(102, 126, 234, 0.1);
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: 20px;
  font-size: 12px;
  color: var(--text-secondary);
}

.badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-primary);
  animation: pulse 2s ease-in-out infinite;
}

.strategy-tabs {
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
  border-bottom: 1px solid var(--border-color);
}

.tab-button {
  padding: 12px 24px;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-base);
  position: relative;
  bottom: -1px;
}

.tab-button:hover {
  color: var(--text-primary);
}

.tab-button.active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}

.strategy-panel {
  animation: fadeIn 0.3s ease;
}

.panel-header h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: var(--spacing-md);
  color: var(--text-primary);
}

.panel-body {
  color: var(--text-secondary);
  line-height: 1.8;
}

.analysis-text {
  margin-bottom: var(--spacing-lg);
}

.media-container {
  margin-top: var(--spacing-lg);
}

.media-player {
  width: 100%;
  border-radius: var(--border-radius-sm);
  background: rgba(0, 0, 0, 0.2);
}

.focus-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);
}

.focus-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: rgba(102, 126, 234, 0.1);
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: var(--border-radius-sm);
}

.focus-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--primary-gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  flex-shrink: 0;
}

.focus-text {
  flex: 1;
}

.warning-box {
  display: flex;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: var(--border-radius-sm);
  margin-bottom: var(--spacing-lg);
}

.warning-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.warning-text {
  flex: 1;
  color: var(--text-primary);
}

/* 交易记录区域 */
.trades-section {
  background: var(--bg-glass);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-md);
}

.view-toggle {
  display: flex;
  gap: var(--spacing-xs);
  background: rgba(255, 255, 255, 0.05);
  padding: 4px;
  border-radius: 8px;
}

.view-btn {
  padding: 8px 12px;
  background: transparent;
  border: none;
  border-radius: 6px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-base);
  display: flex;
  align-items: center;
  justify-content: center;
}

.view-btn svg {
  width: 18px;
  height: 18px;
}

.view-btn:hover {
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.1);
}

.view-btn.active {
  background: var(--primary-gradient);
  color: white;
}

/* 网格视图 */
.trades-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--spacing-lg);
  margin-top: var(--spacing-lg);
}

.trade-card-modern {
  background: var(--bg-glass);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: var(--spacing-lg);
  transition: all var(--transition-base);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.trade-card-modern:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: rgba(102, 126, 234, 0.3);
}

.trade-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.trade-symbol-section {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.symbol-badge {
  font-size: 20px;
  font-weight: 700;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.market-tag {
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  background: rgba(102, 126, 234, 0.1);
  color: var(--color-primary);
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-indicator.status-active {
  background: rgba(16, 185, 129, 0.1);
  color: var(--color-success);
}

.status-indicator.status-active .status-dot {
  background: var(--color-success);
}

.status-indicator.status-take-profit {
  background: rgba(16, 185, 129, 0.1);
  color: var(--color-success);
}

.status-indicator.status-take-profit .status-dot {
  background: var(--color-success);
}

.status-indicator.status-stop-loss {
  background: rgba(239, 68, 68, 0.1);
  color: var(--color-danger);
}

.status-indicator.status-stop-loss .status-dot {
  background: var(--color-danger);
}

.trade-image-wrapper {
  position: relative;
  width: 100%;
  height: 180px;
  border-radius: var(--border-radius-sm);
  overflow: hidden;
  cursor: pointer;
}

.trade-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity var(--transition-base);
  color: white;
}

.trade-image-wrapper:hover .image-overlay {
  opacity: 1;
}

.image-overlay svg {
  width: 40px;
  height: 40px;
}

.trade-details-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-sm);
}

.detail-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-label {
  font-size: 11px;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-value {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.trade-performance {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--border-color);
}

.performance-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
}

.performance-row.highlight {
  padding: var(--spacing-sm);
  background: rgba(102, 126, 234, 0.05);
  border-radius: var(--border-radius-sm);
}

.perf-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.perf-label {
  font-size: 11px;
  color: var(--text-muted);
  text-transform: uppercase;
}

.perf-value {
  font-size: 16px;
  font-weight: 700;
}

.perf-value.profit {
  color: var(--color-success);
}

.perf-value.loss {
  color: var(--color-danger);
}

/* 表格视图 */
.trades-table-wrapper {
  margin-top: var(--spacing-lg);
  overflow-x: auto;
}

.trades-table {
  width: 100%;
  border-collapse: collapse;
  background: transparent;
}

.trades-table thead {
  background: rgba(102, 126, 234, 0.1);
}

.trades-table th {
  padding: 12px 16px;
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid var(--border-color);
}

.trades-table td {
  padding: 16px;
  border-bottom: 1px solid var(--border-color);
  color: var(--text-primary);
  font-size: 14px;
}

.trade-row:hover {
  background: rgba(102, 126, 234, 0.05);
}

.symbol-cell {
  font-weight: 700;
}

.market-badge {
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  background: rgba(102, 126, 234, 0.1);
  color: var(--color-primary);
}

.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 500;
}

.status-badge.status-active {
  background: rgba(16, 185, 129, 0.1);
  color: var(--color-success);
}

.status-badge.status-take-profit {
  background: rgba(16, 185, 129, 0.1);
  color: var(--color-success);
}

.status-badge.status-stop-loss {
  background: rgba(239, 68, 68, 0.1);
  color: var(--color-danger);
}

.pnl-ratio,
.pnl-amount {
  font-weight: 700;
}

.pnl-ratio.profit,
.pnl-amount.profit {
  color: var(--color-success);
}

.pnl-ratio.loss,
.pnl-amount.loss {
  color: var(--color-danger);
}

.chart-btn {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background: rgba(102, 126, 234, 0.1);
  border: 1px solid rgba(102, 126, 234, 0.2);
  color: var(--color-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-base);
}

.chart-btn:hover {
  background: rgba(102, 126, 234, 0.2);
  transform: scale(1.1);
}

.chart-btn svg {
  width: 16px;
  height: 16px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .modern-home-layout {
    grid-template-columns: 280px 1fr;
    gap: var(--spacing-lg);
  }
}

@media (max-width: 968px) {
  /* 显示移动端抖音风格布局 */
  .mobile-profile-hero {
    display: block !important;
    width: 100%;
  }
  
  /* 确保移动端布局正确 */
  .app-container {
    padding: 0;
  }
  
  .modern-home-layout {
    padding: 0;
    grid-template-columns: 1fr;
  }
  
  /* 桌面端确保主内容显示 */
  .trader-sidebar.mobile-hidden {
    display: none;
  }
  
  .main-content {
    width: 100%;
    padding: var(--spacing-md);
  }
  
  .mobile-profile-header {
    position: relative;
    background: var(--bg-primary);
    overflow: hidden;
  }
  
  .mobile-profile-bg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 200px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
    opacity: 0.3;
    z-index: 0;
  }
  
  .mobile-profile-content {
    position: relative;
    z-index: 1;
    padding: var(--spacing-lg);
    padding-top: var(--spacing-xl);
    background: linear-gradient(to bottom, transparent 0%, var(--bg-primary) 40%);
  }
  
  .mobile-profile-top {
    display: flex;
    align-items: flex-start;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-lg);
  }
  
  .mobile-avatar-wrapper {
    position: relative;
    width: 80px;
    height: 80px;
    flex-shrink: 0;
    cursor: pointer;
  }
  
  .mobile-avatar-img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 3px solid white;
    object-fit: cover;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
  
  .avatar-badge {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: var(--color-primary);
    border: 2px solid white;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 12px;
    font-weight: 700;
  }
  
  .mobile-profile-basic {
    flex: 1;
    min-width: 0;
    padding-top: var(--spacing-xs);
  }
  
  .mobile-name-large {
    font-size: 22px;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0 0 var(--spacing-xs) 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .mobile-id-row {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
  }
  
  .mobile-id-text {
    font-size: 13px;
    color: var(--text-muted);
  }
  
  .copy-id-btn {
    width: 20px;
    height: 20px;
    padding: 0;
    background: transparent;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .copy-id-btn svg {
    width: 14px;
    height: 14px;
  }
  
  /* 统计数据行 */
  .mobile-stats-row {
    display: flex;
    justify-content: space-around;
    padding: var(--spacing-lg) 0;
    margin-bottom: var(--spacing-lg);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .mobile-stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    flex: 1;
  }
  
  .stat-number-large {
    font-size: 18px;
    font-weight: 700;
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
  }
  
  .stat-number-large.positive {
    color: var(--color-success);
  }
  
  .stat-number-large.negative {
    color: var(--color-danger);
  }
  
  .stat-label-small {
    font-size: 12px;
    color: var(--text-muted);
  }
  
  /* 简介区域 */
  .mobile-bio-section {
    margin-bottom: var(--spacing-lg);
  }
  
  .mobile-bio-title {
    font-size: 15px;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: var(--spacing-sm);
  }
  
  .mobile-bio-text {
    font-size: 14px;
    color: var(--text-secondary);
    line-height: 1.6;
  }
  
  /* 操作按钮 */
  .mobile-action-buttons {
    display: flex;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-md);
  }
  
  .mobile-follow-btn {
    flex: 1;
    padding: var(--spacing-md);
    background: var(--color-primary);
    border: none;
    border-radius: var(--border-radius);
    color: white;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all var(--transition-base);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }
  
  .mobile-follow-btn:active {
    transform: scale(0.98);
    opacity: 0.9;
  }
  
  .mobile-message-btn {
    width: 48px;
    height: 48px;
    padding: 0;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: var(--border-radius);
    color: var(--text-primary);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all var(--transition-base);
  }
  
  .mobile-message-btn svg {
    width: 20px;
    height: 20px;
  }
  
  .mobile-message-btn:active {
    transform: scale(0.95);
    background: rgba(255, 255, 255, 0.15);
  }
  
  .modern-home-layout {
    grid-template-columns: 1fr;
    padding: 0;
    gap: 0;
  }
  
  /* 隐藏侧边栏 */
  .trader-sidebar {
    display: none;
  }
  
  .main-content {
    padding: var(--spacing-md);
    padding-bottom: 100px;
  }
  
  /* 交易策略更突出 */
  .strategy-section.mobile-strategy-prominent {
    margin-top: var(--spacing-lg);
    padding: var(--spacing-lg);
    background: var(--bg-glass);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-lg);
  }
  
  .strategy-section.mobile-strategy-prominent .section-title {
    font-size: 22px;
    margin-bottom: var(--spacing-md);
  }
  
  .strategy-section.mobile-strategy-prominent .section-header {
    margin-bottom: var(--spacing-lg);
  }
  
  .trades-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
  
  .trades-section {
    padding: var(--spacing-md);
    margin-top: var(--spacing-lg);
  }
  
  .section-title {
    font-size: 20px;
  }
}

/* 移动端底部快速操作栏 */
.mobile-bottom-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: none;
  background: var(--bg-primary);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-top: 1px solid var(--border-color);
  padding: var(--spacing-sm) var(--spacing-xs);
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.3);
  z-index: 998;
  gap: var(--spacing-xs);
}

.mobile-bottom-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: var(--spacing-xs);
  background: transparent;
  border: none;
  border-radius: var(--border-radius-sm);
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 11px;
  font-weight: 500;
  transition: all var(--transition-base);
  cursor: pointer;
  position: relative;
}

.mobile-bottom-btn svg {
  width: 22px;
  height: 22px;
  stroke-width: 2;
  transition: all var(--transition-base);
}

.mobile-bottom-btn:hover,
.mobile-bottom-btn:active {
  color: var(--color-primary);
  background: rgba(102, 126, 234, 0.1);
}

.mobile-bottom-btn svg.liked {
  fill: var(--color-danger);
  stroke: var(--color-danger);
}

.mobile-like-count {
  font-size: 10px;
  color: var(--text-muted);
  margin-top: -2px;
}

@media (max-width: 968px) {
  .mobile-bottom-actions {
    display: flex;
  }
  
  /* 移动端策略部分更突出 */
  .strategy-section.mobile-strategy-prominent {
    background: var(--bg-glass);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 2px solid var(--border-color);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    margin-top: var(--spacing-lg);
  }
  
  .strategy-section.mobile-strategy-prominent .section-title {
    font-size: 24px;
    font-weight: 800;
  }
  
  .strategy-section.mobile-strategy-prominent .tab-button {
    font-size: 15px;
    padding: 14px 20px;
  }
  
  .strategy-section.mobile-strategy-prominent .panel-body {
    font-size: 15px;
    line-height: 1.8;
  }
}

@media (max-width: 640px) {
  .modern-home-layout {
    padding: var(--spacing-sm);
    gap: var(--spacing-md);
  }
  
  .trader-sidebar {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }
  
  .trader-card {
    padding: var(--spacing-lg);
  }
  
  .trader-avatar-wrapper {
    width: 100px;
    height: 100px;
    margin-bottom: var(--spacing-md);
  }
  
  .trader-name {
    font-size: 20px;
  }
  
  .trader-title {
    font-size: 13px;
  }
  
  .trader-metrics {
    gap: var(--spacing-sm);
  }
  
  .metric-item {
    padding: var(--spacing-sm);
  }
  
  .metric-icon {
    width: 36px;
    height: 36px;
    font-size: 20px;
  }
  
  .metric-icon svg {
    width: 18px;
    height: 18px;
  }
  
  .metric-value {
    font-size: 16px;
  }
  
  .quick-stats {
    grid-template-columns: 1fr;
    gap: var(--spacing-sm);
  }
  
  .stat-card {
    padding: var(--spacing-md);
  }
  
  .stat-icon-wrapper {
    width: 40px;
    height: 40px;
  }
  
  .stat-icon-wrapper svg {
    width: 20px;
    height: 20px;
  }
  
  .stat-number {
    font-size: 18px;
  }
  
  .quick-actions {
    grid-template-columns: 1fr;
    gap: var(--spacing-sm);
  }
  
  .action-button {
    padding: var(--spacing-md);
  }
  
  .action-icon-wrapper {
    width: 40px;
    height: 40px;
  }
  
  .action-icon-wrapper svg {
    width: 20px;
    height: 20px;
  }
  
  .strategy-section,
  .trades-section {
    padding: var(--spacing-md);
    border-radius: var(--border-radius);
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-md);
  }
  
  .section-title {
    font-size: 18px;
  }
  
  .title-icon {
    font-size: 22px;
  }
  
  .update-badge {
    font-size: 11px;
    padding: 4px 10px;
  }
  
  .strategy-tabs {
    gap: var(--spacing-xs);
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }
  
  .strategy-tabs::-webkit-scrollbar {
    display: none;
  }
  
  .tab-button {
    padding: 10px 16px;
    font-size: 13px;
    white-space: nowrap;
  }
  
  .panel-header h3 {
    font-size: 16px;
  }
  
  .focus-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-sm);
  }
  
  .focus-item {
    padding: var(--spacing-sm);
  }
  
  .focus-icon {
    width: 28px;
    height: 28px;
    font-size: 14px;
  }
  
  .warning-box {
    padding: var(--spacing-md);
    flex-direction: column;
    text-align: center;
  }
  
  .trades-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }
  
  .trade-card-modern {
    padding: var(--spacing-md);
  }
  
  .trade-card-header {
    flex-wrap: wrap;
    gap: var(--spacing-sm);
  }
  
  .symbol-badge {
    font-size: 18px;
  }
  
  .trade-image-wrapper {
    height: 160px;
  }
  
  .trade-details-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-xs);
  }
  
  .detail-cell {
    padding: var(--spacing-xs) 0;
  }
  
  .detail-label {
    font-size: 10px;
  }
  
  .detail-value {
    font-size: 13px;
  }
  
  .performance-row {
    grid-template-columns: 1fr;
    gap: var(--spacing-sm);
  }
  
  .perf-value {
    font-size: 14px;
  }
  
  .trades-table-wrapper {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  
  .trades-table {
    min-width: 800px;
  }
  
  .trades-table th,
  .trades-table td {
    padding: 10px 8px;
    font-size: 12px;
  }
  
  .trades-table th {
    font-size: 10px;
  }
}

body {
  color: #ffffff;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}



.card {
  background: var(--bg-glass);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-md);
  transition: all var(--transition-base);
  margin-bottom: var(--spacing-md);
  overflow: hidden;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: rgba(102, 126, 234, 0.3);
  background: var(--bg-glass-hover);
}

.trade-screenshot {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-bottom: 1px solid #2a2a3a;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.trade-screenshot:hover {
  opacity: 0.9;
}

.stock-info {
  padding: 1rem;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid rgba(255, 215, 0, 0.1);
}

.stock-center {
  flex: 1;
  text-align: center;
}

.stock-symbol {
  font-size: 1.4rem;
  font-weight: 700;
  background: var(--primary-gradient);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 0.5px;
  animation: subtleGlow 4s ease-in-out infinite;
}

@keyframes subtleGlow {
  0%, 100% { 
    background-position: 0% 50%;
    filter: brightness(1);
  }
  50% { 
    background-position: 100% 50%;
    filter: brightness(1.1);
  }
}

.stock-name {
  font-size: 0.85rem;
  color: #a0a0a0;
}

/* 国家标识样式 */
.country-badge-container {
  display: flex;
  align-items: center;
}

.country-badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  border: none;
  text-align: center;
  min-width: 50px;
}

.country-flag {
  display: none; /* 隐藏旗帜图标 */
}

.country-text {
  font-weight: 600;
  letter-spacing: 0.5px;
}

/* 简洁的国家标识样式 */
.country-usa {
  background: #28a745;
  border-color: #28a745;
  color: white;
  box-shadow: 0 2px 8px rgba(40, 167, 69, 0.3);
}

.country-uk {
  background: #007bff;
  border-color: #007bff;
  color: white;
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.3);
}

.country-cn {
  background: #dc3545;
  border-color: #dc3545;
  color: white;
  box-shadow: 0 2px 8px rgba(220, 53, 69, 0.3);
}

.country-default {
  background: #6c757d;
  border-color: #6c757d;
  color: white;
  box-shadow: 0 2px 8px rgba(108, 117, 125, 0.3);
}

/* 状态标识样式 */
.status-badge-container {
  display: flex;
  align-items: center;
}

.status-badge-enhanced {
  display: inline-block;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  border: 2px solid;
  background: transparent;
  text-align: center;
  min-width: 70px;
}

.status-icon {
  display: none; /* 隐藏状态图标 */
}

.status-text {
  font-weight: 600;
}

/* 简洁的Active状态样式 */
.status-active {
  background: transparent;
  border-color: #28a745;
  color: #28a745;
  box-shadow: 0 2px 8px rgba(40, 167, 69, 0.2);
}

/* 止盈状态样式 */
.status-take-profit {
  background: transparent;
  border-color: #01b622;
  color: #01b622;
  box-shadow: 0 2px 8px rgba(1, 182, 34, 0.2);
}

/* 止损状态样式 */
.status-stop-loss {
  background: transparent;
  border-color: #e74c3c;
  color: #e74c3c;
  box-shadow: 0 2px 8px rgba(231, 76, 60, 0.2);
}

.status-closed {
  background: linear-gradient(135deg, #888888 0%, #555555 100%);
  border-color: #888888;
  color: white;
}

.status-pending {
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  border-color: #FFD700;
  color: #000;
}

.status-cancelled {
  background: linear-gradient(135deg, #FF4444 0%, #CC0000 100%);
  border-color: #FF4444;
  color: white;
}

.status-default {
  background: linear-gradient(135deg, #666666 0%, #444444 100%);
  border-color: #666666;
  color: white;
}

.status-badge {
  padding: 0.4rem 0.8rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
  border: 1px solid;
}

.secondary-info {
  padding: 1rem;
  background: linear-gradient(90deg, #16213e 0%, #1a1a2e 100%);
  border-bottom: 1px solid #2a2a3a;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.secondary-info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.secondary-info-label {
  font-size: 0.75rem;
  color: #a0a0a0;
}

.secondary-info-value {
  font-size: 0.9rem;
  color: #ffd700;
}

.main-stats {
  padding: 1rem;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  background: #1a1a2e;
}

.main-stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 0.75rem;
  background: rgba(255,215,0,0.03);
  border: 1px solid #2a2a3a;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.main-stat-item:hover {
  border-color: #ffd700;
  background: rgba(255,215,0,0.05);
}

.main-stat-label {
  font-size: 0.8rem;
  color: #a0a0a0;
  margin-bottom: 0.4rem;
  font-weight: 500;
}

.main-stat-value {
  font-size: 1.25rem;
  font-weight: 800;
  color: #ffd700;
  line-height: 1.2;
}

.profit-positive {
  color: #01b622;
  position: relative;
}

.profit-negative {
  color: #e74c3c;
  position: relative;
}


.bg-success {
  background: rgba(46, 204, 113, 0.1) !important;
  border-color: #020202 !important;
  color: #d0cece !important;
}

.bg-danger {
  background: rgba(231, 76, 60, 0.1) !important;
  border-color: #e74c3c !important;
  color: #e74c3c !important;
}

.bg-info {
  background: rgba(67, 97, 238, 0.1) !important;
  border-color: #4361ee !important;
  color: #4361ee !important;
}

.modal-content {
  background-color: #1a1a2e;
  border: 1px solid #2a2a3a;
}

/* Add Image Modal z-index settings */
.modal {
  z-index: 9999 !important;
}

.modal-backdrop {
  z-index: 1040;
}

.modal-header {
  border-bottom: 1px solid #2a2a3a;
}

/* Welcome Popup Modal Styles */
#welcomePopupModal.show .modal-dialog {
  animation: welcomeScaleIn 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

@keyframes welcomeScaleIn {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.3);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

/* New popup content styles */
.welcome-popup-modal {
  background: linear-gradient(135deg, rgba(26,31,46,0.98) 0%, rgba(22,33,62,0.98) 100%);
  border: 1px solid rgba(255,215,0,0.3);
  border-radius: 24px;
  box-shadow: 0 10px 50px rgba(255,215,0,0.15);
  overflow: hidden;
}

.welcome-content {
  padding: 2rem;
  text-align: center;
}

.teacher-intro {
  font-size: 1.75rem;
  font-weight: 700;
  color: #ffd700;
  margin-bottom: 1rem;
  line-height: 1.3;
}

.welcome-description {
  font-size: 1.1rem;
  color: #e0e0e0;
  margin-bottom: 2rem;
  line-height: 1.6;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.performance-overview {
  margin: 2rem 0;
  padding: 2rem;
  background: linear-gradient(135deg, rgba(255,215,0,0.08) 0%, rgba(255,215,0,0.03) 100%);
  border-radius: 20px;
  border: 1px solid rgba(255,215,0,0.2);
  position: relative;
  overflow: hidden;
}

.performance-overview::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent 0%, #ffd700 50%, transparent 100%);
}

.performance-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-box {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem 1.2rem;
  background: linear-gradient(145deg, rgba(26,31,46,0.8) 0%, rgba(38,42,63,0.6) 100%);
  border: 1px solid rgba(255,215,0,0.1);
  border-radius: 12px;
  transition: all 0.3s ease;
  min-width: 0;
  flex: 1;
}

.stat-box:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255,215,0,0.1);
  border-color: rgba(255,215,0,0.3);
}

.stat-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,215,0,0.1);
  border-radius: 50%;
  color: #ffd700;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.stat-info {
  text-align: left;
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 800;
  color: #ffd700;
  line-height: 1.2;
  word-break: break-all;
  overflow-wrap: break-word;
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.stat-value.profit-positive {
  color: #01b622 !important;
}

.stat-value.profit-negative {
  color: #e74c3c !important;
}

.stat-label {
  font-size: 0.9rem;
  color: #a0a0a0;
  margin-top: 0.25rem;
}

.announcement-info {
  background: rgba(255,215,0,0.05);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(255,215,0,0.1);
}

.announcement-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  color: #ffd700;
  font-weight: 600;
  font-size: 1.1rem;
}

.announcement-content {
  color: #e0e0e0;
  line-height: 1.6;
  font-size: 1rem;
}

.community-highlight {
  margin: 2rem 0;
}

.community-benefits {
  background: linear-gradient(135deg, rgba(255,215,0,0.05) 0%, rgba(255,215,0,0.02) 100%);
  border-radius: 16px;
  padding: 1.75rem;
  border: 1px solid rgba(255,215,0,0.1);
}

.community-benefits h4 {
  color: #ffd700;
  margin-bottom: 1.25rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
}

.benefits-list {
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
  max-width: 800px;
  margin: 0 auto;
}

.benefits-list li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #e0e0e0;
  font-size: 1rem;
  line-height: 1.4;
}

.benefits-list li i {
  color: #01b622;
  flex-shrink: 0;
}

.welcome-cta {
  margin-top: 2.5rem;
}

.btn-community-primary {
  background: linear-gradient(135deg, #ffd700 0%, #ffb300 100%);
  color: #1a1a2e;
  border: none;
  border-radius: 30px;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  box-shadow: 0 4px 20px rgba(255,215,0,0.3);
}

.btn-community-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(255,215,0,0.4);
  background: linear-gradient(135deg, #ffed4e 0%, #ffc107 100%);
}

.btn-community-primary:active {
  transform: translateY(0);
}

/* Responsive adjustments for welcome modal */
@media (max-width: 768px) {
  .welcome-content {
    padding: 1.5rem;
  }
  
  .teacher-intro {
    font-size: 1.5rem;
  }
  
  .performance-stats {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .benefits-list {
    grid-template-columns: 1fr;
  }
  
  .btn-community-primary {
    font-size: 1rem;
    padding: 0.875rem 1.75rem;
  }
}

.modal-body {
  padding: 0;
}

.modal-footer {
  border-top: 1px solid #2a2a3a;
}

.modal-title {
  color: #ffd700;
}

.btn-close {
  filter: invert(1) grayscale(100%) brightness(200%);
}

.modal-image {
  width: 100%;
  height: auto;
  max-height: 80vh;
  object-fit: contain;
}

/* Profile Area Styles */
.profile-section {
  margin-top: 2rem;
}

.profile-header {
  background: #16213e;
  border: 1px solid #2a2a3a;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
}

.profile-header::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(255,215,0,0.1) 0%, rgba(255,215,0,0) 70%);
  z-index: 0;
}

.profile-main {
  display: flex;
  align-items: center;
  gap: 2.5rem;
  position: relative;
  z-index: 1;
}

.profile-avatar {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #ffd700;
  position: relative;
  box-shadow: 0 0 20px rgba(255,215,0,0.2);
  cursor: pointer;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.online-status {
  position: absolute;
  bottom: 10px;
  right: 10px;
  width: 20px;
  height: 20px;
  background: #020202;
  border: 3px solid #16213e;
  border-radius: 50%;
}

.profile-details {
  flex: 1;
}

.profile-name {
  font-size: 2.5rem;
  font-weight: 700;
  color: #ffd700;
  margin-bottom: 0.5rem;
  text-shadow: 0 0 10px rgba(255,215,0,0.2);
}

.profile-title {
  font-size: 1.1rem;
  color: #a0a0a0;
  margin-bottom: 1.5rem;
}

.profile-stats {
  display: flex;
  gap: 2rem;
}

.profile-stats .stat-item {
  flex: 1 1 0;
  min-width: 120px;
  max-width: 200px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255,215,0,0.05);
  padding: 0.75rem 1.25rem;
  border-radius: 12px;
  border: 1px solid #2a2a3a;
}

.profile-stats .stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffd700;
}

.profile-stats .stat-label {
  font-size: 0.9rem;
  color: #a0a0a0;
}

.profile-performance {
  display: flex;
  gap: 1.5rem;
  margin-top: 2rem;
}

.performance-card {
  flex: 1;
  background: rgba(255,215,0,0.03);
  border: 1px solid #2a2a3a;
  border-radius: 12px;
  padding: 1.25rem;
  transition: all 0.3s ease;
}

.performance-card:hover {
  transform: translateY(-3px);
  border-color: #ffd700;
  background: rgba(255,215,0,0.05);
}

.performance-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #a0a0a0;
  margin-bottom: 0.75rem;
}

.performance-header i {
  font-size: 1.25rem;
  color: #ffd700;
}

.performance-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: #ffd700;
}

.performance-value.profit-positive {
  color: #01b622 !important;
}

.performance-value.profit-negative {
  color: #e74c3c !important;
}

.performance-value.positive {
  color: #020202;
}

/* Trading Strategy Update Area Styles */
.strategy-update {
  background: #16213e;
  border: 1px solid #2a2a3a;
  border-radius: 16px;
  padding: 2rem;
}

.strategy-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #2a2a3a;
}

.strategy-header h3 {
  font-size: 1.5rem;
  color: #ffd700;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.strategy-header h3 i {
  color: #ffd700;
}

.update-time {
  color: #a0a0a0;
  font-size: 0.9rem;
}

.strategy-content {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 2rem;
}

.strategy-content h4 {
  color: #ffd700;
  font-size: 1.1rem;
  margin-bottom: 1rem;
}

.strategy-content p {
  color: #a0a0a0;
  line-height: 1.6;
  margin: 0;
}

.trading-focus {
  background: rgba(255, 215, 0, 0.05);
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
}

.trading-focus h4 {
  color: #ffd700;
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.trading-focus h4::before {
  content: "🎯";
  font-size: 1rem;
}

.trading-focus ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.trading-focus li {
  color: #e0e0e0;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(255, 215, 0, 0.1);
  line-height: 1.6;
  position: relative;
  padding-left: 1.5rem;
  font-weight: 600;
  font-size: 1rem;
}

.trading-focus li::before {
  content: "▶";
  color: #ffd700;
  position: absolute;
  left: 0;
  top: 0.75rem;
  font-size: 0.8rem;
}

.trading-focus li:last-child {
  border-bottom: none;
}

.risk-warning {
  background: rgba(231, 76, 60, 0.05);
  border: 1px solid #e74c3c;
  border-radius: 12px;
  padding: 1.25rem;
}

.risk-warning h4 {
  color: #e74c3c;
}

/* Trade Record Separator Styles */
.trade-separator {
  margin: 2rem 0;
}

.trade-separator h3 {
  font-size: 1.2rem;
  color: #ffd700;
  margin: 0 0 0.8rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.trade-separator h3 i {
  color: #ffd700;
  font-size: 1.1rem;
}

.trade-separator .divider-line {
  width: 100%;
  height: 2px;
  background: #2a2a3a;
}

/* Contact Button Styles */
.contact-btn {
  position: fixed;
  right: 30px;
  bottom: 30px;
  background: #ffd700;
  color: #1a1a2e;
  padding: 15px 25px;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  z-index: 1000;
  transition: all 0.3s ease;
}

.contact-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.3);
}

.contact-btn i {
  font-size: 1.2rem;
}

.contact-popup {
  position: fixed;
  right: 30px;
  bottom: 90px;
  background: #16213e;
  border: 1px solid #ffd700;
  border-radius: 15px;
  padding: 20px;
  width: 300px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
  z-index: 1000;
  animation: slideUp 0.3s ease;
}
/* 全新的快速操作栏 */
.quick-actions {
            display: flex;
            flex-direction: column;
  gap: var(--spacing-md);
  margin-top: var(--spacing-lg);
        }

.action-button {
            display: flex;
            align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--bg-glass);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  text-decoration: none;
  color: var(--text-primary);
  transition: all var(--transition-base);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.action-button::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--primary-gradient);
  opacity: 0;
  transition: opacity var(--transition-base);
  z-index: 0;
}

.action-button:hover {
  transform: translateX(4px);
  border-color: rgba(102, 126, 234, 0.5);
  box-shadow: var(--shadow-md);
}

.action-button:hover::before {
  opacity: 0.1;
}

.action-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
  transition: all var(--transition-base);
}

.action-button:hover .action-icon-wrapper {
  transform: scale(1.1) rotate(5deg);
}

.action-icon-wrapper svg {
  width: 24px;
  height: 24px;
  stroke-width: 2.5;
}

.leaderboard-btn .action-icon-wrapper {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
}

.vip-btn .action-icon-wrapper {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  color: white;
}

.likes-btn .action-icon-wrapper {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
}

.likes-btn.active .action-icon-wrapper {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  animation: heartBeat 0.6s ease;
}

@keyframes heartBeat {
  0%, 100% { transform: scale(1); }
  25% { transform: scale(1.2); }
  50% { transform: scale(1); }
  75% { transform: scale(1.1); }
}

.action-content {
  flex: 1;
  position: relative;
  z-index: 1;
}

.action-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.action-subtitle {
  font-size: 12px;
  color: var(--text-muted);
}

.action-value {
  font-size: 13px;
  font-weight: 600;
  background: var(--primary-gradient);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
  background-clip: text;
        }
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.contact-popup h4 {
  color: #ffd700;
  margin: 0 0 15px 0;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid #2a2a3a;
  color: #ffffff;
}

.contact-item:last-child {
  border-bottom: none;
}

.contact-item i {
  color: #ffd700;
  font-size: 1.2rem;
  width: 24px;
  text-align: center;
}

 .redirect-message {
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            background: #1a1a2e;
            padding: 15px 30px;
            border-radius: 8px;
            color: #fff;
            font-size: 1rem;
            font-weight: 500;
            z-index: 10000;
            white-space: nowrap;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            -webkit-transform: translateX(-50%);
            -webkit-backface-visibility: hidden;
            backface-visibility: hidden;
            will-change: transform, opacity;
        }

        .redirect-message::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, #ffd700 0%, #4361ee 100%);
            animation: progressBar 3s linear forwards;
            -webkit-animation: progressBar 3s linear forwards;
            opacity: 0.15;
        }

        .redirect-message .text {
            background: linear-gradient(90deg, #ffd700 0%, #4361ee 100%);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            animation: textGradient 3s linear forwards;
            -webkit-animation: textGradient 3s linear forwards;
        }

        .redirect-message .dots {
            display: inline-block;
            width: 24px;
        }

        .redirect-message .dots::after {
            content: '';
            animation: dots 1s infinite;
            -webkit-animation: dots 1s infinite;
        }
/* Avatar Upload and Preview Styles */
.avatar-upload {
  position: absolute;
  bottom: 0;
  right: 0;
  background: #ffd700;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.avatar-upload:hover {
  transform: scale(1.1);
}

.avatar-upload-input {
  display: none;
}

/* Avatar Preview Modal Styles */
.avatar-preview-modal .modal-content {
  background: #1a1a2e;
  border: 1px solid #ffd700;
}

.avatar-preview-img {
  width: 100%;
  height: auto;
  border-radius: 8px;
}

/* Add glow animation at the end of style area */
.glow-bulb {
  color: #ffd700;
  filter: drop-shadow(0 0 8px #ffd700) drop-shadow(0 0 16px #fff200);
  animation: bulb-glow 1.2s infinite alternate;
  transition: color 0.3s;
}

@keyframes bulb-glow {
  0% {
    filter: drop-shadow(0 0 4px #ffd700) drop-shadow(0 0 8px #fff200);
    color: #ffd700;
  }
  50% {
    filter: drop-shadow(0 0 16px #fff200) drop-shadow(0 0 32px #fffbe0);
    color: #fffbe0;
  }
  100% {
    filter: drop-shadow(0 0 4px #ffd700) drop-shadow(0 0 8px #fff200);
    color: #ffd700;
  }
}

 /* Mobile responsiveness */
 @media (max-width: 768px) {
   .profile-main {
     flex-direction: column;
     text-align: center;
     gap: 1.5rem;
   }

   .profile-stats {
     justify-content: center;
   }

   .profile-performance {
     flex-direction: column;
   }

   .strategy-content {
     grid-template-columns: 1fr;
   }

   .strategy-header {
     flex-direction: column;
     align-items: flex-start;
     gap: 0.5rem;
   }

   .strategy-header h3 {
     font-size: 1.3rem;
     margin-bottom: 0.3rem;
   }

   .update-time {
     margin-left: 2rem;
     font-size: 0.85rem;
   }

   .profile-avatar {
     width: 120px;
     height: 120px;
   }

   .profile-name {
     font-size: 2rem;
   }

   .contact-popup {
     width: calc(100% - 60px);
     right: 15px;
     bottom: 90px;
   }
 }

 /* 超小屏幕优化 */
 @media (max-width: 480px) {
   .modal-dialog {
     margin: 0.25rem;
     max-width: calc(100% - 0.5rem);
   }

   .modal-header {
     padding: 0.75rem;
   }

   .modal-body {
     padding: 0.75rem;
   }

   .modal-header .modal-title {
     font-size: 1rem;
   }
 }

 @keyframes progressBar {
     0% {
         transform: translateX(-100%);
     }
     100% {
         transform: translateX(0);
     }
 }

 @keyframes textGradient {
     0% {
         opacity: 0.7;
         background-position: 0 0;
     }
     50% {
         opacity: 1;
         background-position: 100% 0;
     }
     100% {
         opacity: 0.7;
         background-position: 200% 0;
     }
 }

 @keyframes dots {
     0% { content: '.'; }
     33% { content: '..'; }
     66% { content: '...'; }
     100% { content: ''; }
 }
</style>

