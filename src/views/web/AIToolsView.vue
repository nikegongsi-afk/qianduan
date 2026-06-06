<template>
  <div class="ai-page-container">
    <navcomponent></navcomponent>

    <div class="ai-page-wrapper">
      <div class="ai-hero-banner">
        <div class="hero-content">
          <div class="hero-icon-large">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="10" rx="2"></rect>
              <circle cx="12" cy="5" r="2"></circle>
              <path d="M12 7v4"></path>
              <line x1="8" y1="16" x2="8.01" y2="16"></line>
              <line x1="16" y1="16" x2="16.01" y2="16"></line>
            </svg>
          </div>
          <h1 class="hero-title">AI Trading Tools</h1>
          <p class="hero-description">Advanced AI-powered stock analysis and selection tools</p>
        </div>
      </div>

      <div class="ai-content-area">
      <!-- AI Stock Picker -->
      <div class="ai-tool-card">
        <div class="tool-header">
          <div class="tool-icon">
            <i class="bi bi-stars"></i>
          </div>
          <div class="tool-title">
            <h3>AI Smart Stock Picker</h3>
            <p>Intelligent stock selection based on market data, technical analysis, and AI algorithms</p>
          </div>
          <a href="/ai-history" class="history-link">
            <i class="bi bi-clock-history"></i>
            AI History
          </a>
        </div>
        
        <div class="tool-content">
          <div class="input-section">
            <h4><i class="bi bi-sliders"></i> Selection Criteria</h4>
            
            <!-- Market Sector is now fixed as "All Sectors" - no selector needed -->
            
            <label class="form-label">Investment Style</label>
            <select class="form-select" v-model="stockPickerCriteria.style">
              <option value="Long-term investment">Long-term investment</option>
              <option value="Short-term trading">Short-term trading</option>
              <option value="Growth">Growth</option>
              <option value="Value">Value</option>
              <option value="Momentum">Momentum</option>
              <option value="Dividend">Dividend</option>
              <option value="Balanced">Balanced</option>
            </select>
            
            <label class="form-label">Risk Level</label>
            <select class="form-select" v-model="stockPickerCriteria.risk">
              <option value="Low">Low Risk</option>
              <option value="Medium">Medium Risk</option>
              <option value="High">High Risk</option>
            </select>
            
            <label class="form-label">Time Horizon</label>
            <select class="form-select" v-model="stockPickerCriteria.timeHorizon">
              <option value="Short-term (1-3 months)">Short-term (1-3 months)</option>
              <option value="Medium-term (3-12 months)">Medium-term (3-12 months)</option>
              <option value="Long-term (1-3 years)">Long-term (1-3 years)</option>
            </select>
            
            <label class="form-label">Investment Amount (USD)</label>
            <input type="number" class="form-control" v-model="stockPickerCriteria.investmentAmount" 
                   placeholder="Enter investment amount (e.g., 100000)" min="1000" step="1000">
            
            <label class="form-label">Investment Goal</label>
            <select class="form-select" v-model="stockPickerCriteria.investmentGoal">
              <option value="Capital Appreciation">Capital Appreciation</option>
              <option value="Income Generation">Income Generation</option>
              <option value="Capital Preservation">Capital Preservation</option>
              <option value="Speculation">Speculation</option>
              <option value="Diversification">Diversification</option>
            </select>
            
            <label class="form-label">Risk Tolerance</label>
            <div class="risk-tolerance-slider">
              <input type="range" class="form-range" v-model="stockPickerCriteria.riskTolerance" 
                     min="1" max="10" step="1" id="riskSlider">
              <div class="slider-labels">
                <span>Conservative (1)</span>
                <span>Moderate (5)</span>
                <span>Aggressive (10)</span>
              </div>
              <div class="current-value">Current: {{ stockPickerCriteria.riskTolerance }}/10</div>
            </div>
            
            <button class="btn btn-ai" @click="runStockPicker" :disabled="isStockPickerLoading">
              <i class="bi bi-magic"></i>
              Generate AI Recommendations
            </button>
            
            <!-- 整体投资策略区域 - 移动到左侧 -->
            <div v-if="overallStrategy && !isStockPickerLoading" class="investment-summary-section">
              <h4><i class="bi bi-clipboard-data"></i> Overall Investment Strategy</h4>
              <div class="strategy-content">
                <div class="strategy-item">
                  <h5>Position Allocation</h5>
                  <div class="allocation-content">
                    <div class="strategy-paragraph" v-html="formatStrategyText(overallStrategy.positionAllocation)"></div>
                  </div>
                </div>
                <div class="strategy-item">
                  <h5>Risk Management</h5>
                  <div class="risk-management-content">
                    <div class="strategy-paragraph" v-html="formatStrategyText(overallStrategy.riskManagement)"></div>
                  </div>
                </div>
                <div class="strategy-item">
                  <h5>Trading Strategy</h5>
                  <div class="trading-strategy-content">
                    <div class="strategy-paragraph" v-html="formatStrategyText(overallStrategy.tradingStrategy)"></div>
                  </div>
                </div>
              </div>
            </div>
           
          </div>
          
          <div class="results-section">
            <h4><i class="bi bi-trophy"></i> AI Recommendations</h4>
            <div id="stockPickerResults" v-if="!isStockPickerLoading">
              <div v-if="stockRecommendations.length === 0 && !stockPickerError" class="empty-state">
                <div class="empty-icon"><i class="bi bi-robot"></i></div>
                <p>Configure your criteria and click "Generate AI Recommendations" to get started</p>
              </div>
              <div v-if="stockPickerError" class="alert alert-danger">
                <i class="bi bi-exclamation-triangle"></i>
                Error generating recommendations: {{ stockPickerError }}
              </div>
             
              <div v-for="(stock, index) in stockRecommendations" :key="stock.symbol" 
                   class="stock-recommendation result-item" :style="{ animationDelay: `${index * 0.1}s` }">
                
                <!-- 股票基本信息 -->
                <div class="stock-header">
                  <div class="stock-symbol">{{ stock.symbol }}</div>
                  <div class="stock-price-info">
                    <span class="current-price">{{ formatPrice(stock.currentPrice) }}$</span>
                    <span class="price-change" :class="{ positive: stock.week52Change && stock.week52Change.includes('+'), negative: stock.week52Change && stock.week52Change.includes('-') }">
                      {{ stock.week52Change || 'N/A' }}
                    </span>
                  </div>
                </div>
                
                <div class="stock-name">{{ stock.companyName }}</div>
                <div class="stock-industry">{{ stock.industry }}</div>
                
                <!-- 基础指标 -->
                <div class="stock-metrics">
                  <div class="metric-item">
                    <span class="metric-label">Market Cap:</span>
                    <span class="metric-value">{{ stock.marketCap }}</span>
                  </div>
                  <div v-if="stock.peRatio > 0" class="metric-item">
                    <span class="metric-label">P/E Ratio:</span>
                    <span class="metric-value">{{ stock.peRatio.toFixed(1) }}</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-label">52W Change:</span>
                    <span class="metric-value" :class="{ positive: stock.week52Change && stock.week52Change.includes('+'), negative: stock.week52Change && stock.week52Change.includes('-') }">
                      {{ stock.week52Change || 'N/A' }}
                    </span>
                  </div>
                </div>

                <!-- 增强的6维度分析显示 -->
                <div v-if="stock.analysis && Object.keys(stock.analysis).length > 0" class="enhanced-analysis">
                  <div class="analysis-tabs">
                    <button v-for="(analysis, key) in stock.analysis" :key="key" 
                            class="analysis-tab" 
                            :class="{ active: activeTab[stock.symbol] === key }"
                            @click="setActiveTab(stock.symbol, key)">
                      <i :class="getAnalysisIcon(key)"></i>
                      {{ getAnalysisTitle(key) }}
                    </button>
                  </div>
                  
                  <div class="analysis-content">
                    <div v-for="(analysis, key) in stock.analysis" :key="key" 
                         v-show="activeTab[stock.symbol] === key"
                         class="analysis-panel">
                      <div class="analysis-header">
                        <h6>{{ getAnalysisTitle(key) }}</h6>
                        <span class="analysis-score" :class="`score-${getScoreLevel(analysis.score)}`">
                          {{ analysis.score }}/100
                        </span>
                      </div>
                      <div class="analysis-text" v-html="formatAnalysisContent(analysis.content)"></div>
                    </div>
                  </div>
                </div>
                
                <!-- 兼容旧数据结构：显示reason字段 -->
                <div v-else-if="stock.reason" class="basic-analysis">
                  <h6><i class="bi bi-robot"></i> AI Professional Analysis Report</h6>
                  <div class="analysis-text gpt-analysis" v-html="formatGPTAnalysis(stock.reason)"></div>
                </div>
                
                <!-- 兼容sections数据结构 -->
                <div v-else-if="stock.sections" class="sections-analysis">
                  <div v-for="(section, index) in stock.sections" :key="index" class="analysis-section">
                    <div class="analysis-header">
                      <h6>{{ section.title }}</h6>
                      <span class="analysis-score" :class="`score-${getScoreLevel(section.score)}`">
                        {{ section.score }}/100
                      </span>
                    </div>
                    <div class="analysis-text" v-html="formatAnalysisContent(section.content)"></div>
                  </div>
                </div>
                
                <!-- 投资建议 -->
                <div v-if="stock.investmentAdvice" class="investment-advice">
                  <h6><i class="bi bi-lightbulb"></i> Investment Advice</h6>
                  <div class="advice-grid">
                    <div class="advice-item">
                      <span class="advice-label">Action:</span>
                      <span class="advice-value action-buy">{{ stock.investmentAdvice.recommendedAction }}</span>
                    </div>
                    <div class="advice-item">
                      <span class="advice-label">Target Price:</span>
                      <span class="advice-value">{{ stock.investmentAdvice.targetPrice }}$</span>
                    </div>
                    <div class="advice-item">
                      <span class="advice-label">Stop Loss:</span>
                      <span class="advice-value">{{ stock.investmentAdvice.stopLoss }}$</span>
                    </div>
                    <div class="advice-item">
                      <span class="advice-label">Position:</span>
                      <span class="advice-value">{{ stock.investmentAdvice.suggestedPosition }}%</span>
                    </div>
                    <div class="advice-item">
                      <span class="advice-label">Holding Period:</span>
                      <span class="advice-value">{{ stock.investmentAdvice.holdingPeriod }}</span>
                    </div>
                  </div>
                </div>
                
                <!-- 风险评估 -->
                <div v-if="stock.riskAssessment" class="risk-assessment">
                  <h6><i class="bi bi-shield-exclamation"></i> Risk Assessment</h6>
                  <div class="risk-level">
                    <span class="risk-badge" :class="stock.riskAssessment.riskLevel.toLowerCase()">
                      {{ stock.riskAssessment.riskLevel }} Risk
                    </span>
                  </div>
                  <div class="risk-details">
                    <p><strong>Short-term:</strong> {{ stock.riskAssessment.shortTermRisks }}</p>
                    <p><strong>Long-term:</strong> {{ stock.riskAssessment.longTermRisks }}</p>
                  </div>
                </div>
                
                <!-- 公司基本面 -->
                <div v-if="stock.fundamentals" class="fundamentals-section">
                  <h6><i class="bi bi-building"></i> Company Fundamentals</h6>
                  <div class="fundamentals-content">
                    <p><strong>Main Business:</strong> {{ stock.fundamentals.mainBusiness }}</p>
                    <p><strong>Financial Performance:</strong> {{ stock.fundamentals.financialPerformance }}</p>
                    <p><strong>Competitive Advantages:</strong> {{ stock.fundamentals.competitiveAdvantages }}</p>
                  </div>
                </div>
                
                <div class="stock-footer">
                  <span class="sector-tag">
                    <i class="bi bi-tag"></i> {{ stock.sector }}
                  </span>
                  <span class="return-estimate" :class="{ positive: parseFloat(stock.expectedReturn) >= 0, negative: parseFloat(stock.expectedReturn) < 0 }">
                    <i class="bi bi-graph-up"></i> {{ stock.expectedReturn }}%
                  </span>
                  <span class="risk-level">
                    <i class="bi bi-shield"></i> {{ stock.riskLevel }}
                  </span>
                </div>
              </div>
            </div>
            <div class="loading-spinner" v-if="isStockPickerLoading">
              <div class="spinner-border" role="status">
                <span class="visually-hidden">Analyzing...</span>
              </div>
              <p class="loading-text">AI is analyzing market data...</p>
            </div>
            
          </div>
        </div>
      </div>

      <!-- AI Stock Diagnosis -->
      <div class="ai-tool-card">
        <div class="tool-header">
          <div class="tool-icon">
            <i class="bi bi-search"></i>
          </div>
          <div class="tool-title">
            <h3>AI Stock Diagnosis</h3>
            <p>Analyze your portfolio performance and get professional investment advice based on your holdings</p>
          </div>
        </div>
        
        <div class="tool-content">
          <div class="input-section">
            <h4><i class="bi bi-input-cursor"></i> Portfolio Stock Analysis</h4>
            
            <label class="form-label">Stock Symbol</label>
            <input type="text" class="form-control uppercase-input" v-model="portfolioData.symbol"
                   placeholder="Enter stock symbol (e.g., AAPL, TSLA)"
                   @input="formatStockSymbol" @keypress.enter="runPortfolioDiagnosis">
            
            <label class="form-label">Purchase Price</label>
            <input type="number" class="form-control" v-model="portfolioData.purchasePrice" 
                   placeholder="Enter purchase price (e.g., 150.50)" step="0.01" min="0">
            
            <label class="form-label">Purchase Date</label>
            <input type="date" class="form-control" v-model="portfolioData.purchaseDate" 
                   :max="new Date().toISOString().split('T')[0]" lang="en-US" 
                   data-lang="en" data-format="MM/DD/YYYY">
            
            <label class="form-label">Purchase Market</label>
            <select class="form-select" v-model="portfolioData.purchaseMarket">
              <option value="NASDAQ">NASDAQ</option>
              <option value="NYSE">NYSE (New York Stock Exchange)</option>
              <option value="AMEX">AMEX (American Stock Exchange)</option>
              <option value="OTC">OTC (Over-the-Counter)</option>
            </select>
            
            <label class="form-label">Analysis Type</label>
            <select class="form-select" v-model="portfolioData.analysisType">
              <option value="portfolio">Portfolio Analysis (Recommended)</option>
              <option value="comprehensive">Comprehensive Analysis</option>
              <option value="technical">Technical Analysis</option>
              <option value="fundamental">Fundamental Analysis</option>
              <option value="sentiment">Market Sentiment</option>
              <option value="risk">Risk Assessment</option>
            </select>
            
            <button class="btn btn-ai" @click="runPortfolioDiagnosis" :disabled="isDiagnosisLoading">
              <i class="bi bi-activity"></i>
              Run AI Diagnosis
            </button>
          </div>
          
          <div class="results-section">
            <h4><i class="bi bi-clipboard-data"></i> Diagnosis Report</h4>
            <div id="stockDiagnosisResults" v-if="!isDiagnosisLoading">
              <div v-if="!stockDiagnosis && !diagnosisError" class="empty-state">
                <div class="empty-icon"><i class="bi bi-search"></i></div>
                <p>Enter a stock symbol and click "Run AI Diagnosis" to analyze</p>
              </div>
              <div v-if="diagnosisError" class="alert alert-danger">
                <i class="bi bi-exclamation-triangle"></i>
                Portfolio diagnosis error: {{ diagnosisError }}
              </div>
              <div v-if="stockDiagnosis">
                <!-- Portfolio performance overview -->
                <div v-if="stockDiagnosis.portfolioPerformance" class="diagnosis-section result-item">
                  <div class="diagnosis-header">
                    <h5 class="diagnosis-title">
                      <i class="bi bi-briefcase"></i> {{ stockDiagnosis.symbol }} - Portfolio Performance
                    </h5>
                    <span class="badge" :class="`bg-${getScoreColor(stockDiagnosis.overallScore)}`">
                      {{ stockDiagnosis.overallScore }}/100
                    </span>
                  </div>
                  <div class="portfolio-metrics">
                    <div class="row">
                      <div class="col-md-6">
                        <div class="metric-card">
                          <div class="metric-label">Purchase Price</div>
                          <div class="metric-value">
                            {{ formatPrice(stockDiagnosis.portfolioPerformance.purchasePrice) }}$
                          </div>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="metric-card">
                          <div class="metric-label">Current Price</div>
                          <div class="metric-value">
                            {{ formatPrice(stockDiagnosis.portfolioPerformance.currentPrice) }}$
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="row mt-2">
                      <div class="col-md-6">
                        <div class="metric-card">
                          <div class="metric-label">Total Return</div>
                          <div class="metric-value" :class="{ 'text-success': stockDiagnosis.portfolioPerformance.totalReturn >= 0, 'text-danger': stockDiagnosis.portfolioPerformance.totalReturn < 0 }">
                            <i class="bi" :class="stockDiagnosis.portfolioPerformance.totalReturn >= 0 ? 'bi-arrow-up' : 'bi-arrow-down'"></i>
                            {{ stockDiagnosis.portfolioPerformance.totalReturn >= 0 ? '+' : '' }}
                            {{ formatPercent(stockDiagnosis.portfolioPerformance.totalReturn) }}
                          </div>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="metric-card">
                          <div class="metric-label">Holding Days</div>
                          <div class="metric-value">{{ stockDiagnosis.portfolioPerformance.holdingDays }} days</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="diagnosis-content mt-3 gpt-analysis" v-html="formatGPTAnalysis(stockDiagnosis.summary)"></div>
                </div>
                <!-- Stock analysis without portfolio performance -->
                <div v-else class="diagnosis-section result-item">
                  <div class="diagnosis-header">
                    <h5 class="diagnosis-title">{{ stockDiagnosis.symbol }} - Stock Analysis</h5>
                    <span class="badge" :class="`bg-${getScoreColor(stockDiagnosis.overallScore)}`">
                      {{ stockDiagnosis.overallScore }}/100
                    </span>
                  </div>
                  <div class="diagnosis-content gpt-analysis" v-html="formatGPTAnalysis(stockDiagnosis.summary)"></div>
                </div>
                
                <!-- GPT增强分析结果 -->
                <div v-if="stockDiagnosis.gptAnalysis" class="gpt-diagnosis-section result-item">
                  <div class="diagnosis-header">
                    <h6 class="diagnosis-title">
                      <i class="bi bi-robot"></i> AI Professional Diagnosis Analysis
                    </h6>
                    <span class="badge bg-info">GPT Enhanced</span>
                  </div>
                  <div class="diagnosis-content gpt-analysis" v-html="formatGPTAnalysis(stockDiagnosis.gptAnalysis)"></div>
                </div>
                
                <!-- Analysis sections -->
                <div v-if="stockDiagnosis.sections" v-for="(section, index) in stockDiagnosis.sections" 
                     :key="index" class="diagnosis-section result-item" 
                     :style="{ animationDelay: `${(index + 1) * 0.1}s` }">
                  <div class="diagnosis-header">
                    <h6 class="diagnosis-title">{{ section.title }}</h6>
                    <span class="badge" :class="`bg-${getScoreColor(section.score)}`">
                      {{ section.score }}/100
                    </span>
                  </div>
                  <div class="diagnosis-content gpt-analysis" v-html="formatGPTAnalysis(section.content)"></div>
                </div>
              </div>
            </div>
            <div class="loading-spinner" v-if="isDiagnosisLoading">
              <div class="spinner-border" role="status">
                <span class="visually-hidden">Diagnosing...</span>
              </div>
              <p class="loading-text">AI is performing deep analysis...</p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
    <PartnerOrganizations />
  </div>
</template>

<script setup lang="ts">
import navcomponent from '../component/nav/nav.vue'
import PartnerOrganizations from '@/components/PartnerOrganizations.vue';
import { ref, onMounted } from 'vue';
import { getStockRecommendations, getPortfolioDiagnosis } from '../../api/module/web/ai';
import { useUserStore } from '@/store';
import { formatMarketCapRight } from '@/utils/formatNumber';

const userStore = useUserStore();
// Mock data for trader info
const traderInfo = ref({
  homeTopTitle: 'AI Trading Platform'
});

// Stock Picker related data
const stockPickerCriteria = ref({
  sector: '', // 保持为空字符串，表示所有行业，但不在UI上显示选择框
  style: 'Long-term investment',
  risk: 'Medium',
  timeHorizon: 'Medium-term (3-12 months)',
  investmentAmount: 100000,
  investmentGoal: 'Capital Appreciation',
  riskTolerance: 5
});
const stockRecommendations = ref<any[]>([]);
const isStockPickerLoading = ref(false);
const stockPickerError = ref('');
const investmentSummary = ref<string>('');
const overallStrategy = ref<any>(null);

// Stock Diagnosis related data
const portfolioData = ref({
  symbol: '',
  purchasePrice: '',
  purchaseDate: new Date().toISOString().split('T')[0], // 设置为当前日期
  purchaseMarket: 'NASDAQ',
  analysisType: 'portfolio'
});
const stockDiagnosis = ref<any>(null);
const isDiagnosisLoading = ref(false);
const diagnosisError = ref('');

// 新增：分析标签页管理
const activeTab = ref<Record<string, string>>({});

// Helper methods
function formatPrice(price: number) {
  return typeof price === 'number' ? price.toFixed(2) : '0.00';
}

function formatPercent(percent: number) {
  return typeof percent === 'number' ? percent.toFixed(2) : '0.00';
}

const formatMarketCap = formatMarketCapRight;

function getScoreColor(score: number) {
  if (score >= 80) return 'success';
  if (score >= 60) return 'warning';
  return 'danger';
}

function getScoreLabel(score: number) {
  if (score >= 80) return 'Strong Buy';
  if (score >= 60) return 'Buy';
  if (score >= 40) return 'Hold';
  return 'Sell';
}

// 新增：分析相关方法
function setActiveTab(symbol: string, tabKey: string) {
  activeTab.value[symbol] = tabKey;
}

function getAnalysisIcon(key: string) {
  const icons: Record<string, string> = {
    'businessAnalysis': 'bi bi-building',
    'financialAnalysis': 'bi bi-graph-up',
    'technicalAnalysis': 'bi bi-bar-chart',
    'investmentAdvice': 'bi bi-lightbulb',
    'riskAssessment': 'bi bi-shield-exclamation',
    'positionAdvice': 'bi bi-pie-chart'
  };
  return icons[key] || 'bi bi-info-circle';
}

function getAnalysisTitle(key: string) {
  const titles: Record<string, string> = {
    'businessAnalysis': 'Business Analysis',
    'financialAnalysis': 'Financial Performance',
    'technicalAnalysis': 'Technical Analysis',
    'investmentAdvice': 'Investment Advice',
    'riskAssessment': 'Risk Assessment',
    'positionAdvice': 'Position Analysis'
  };
  return titles[key] || key;
}

function getScoreLevel(score: number) {
  if (score >= 80) return 'excellent';
  if (score >= 60) return 'good';
  if (score >= 40) return 'fair';
  return 'poor';
}

function formatAnalysisContent(content: string) {
  if (!content) return '';
  
  // 格式化内容，支持换行和重点标记
  return content
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>');
}

// 新增：格式化策略文本为段落
function formatStrategyText(content: string) {
  if (!content) return '';
  
  // 将策略内容按段落分割并格式化
  const paragraphs = content.split('\n').filter(p => p.trim());
  
  return paragraphs.map(paragraph => {
    const trimmed = paragraph.trim();
    
    // 检查是否是标题（包含冒号且较短）
    if (trimmed.includes(':') && trimmed.length < 100) {
      const parts = trimmed.split(':');
      if (parts.length === 2) {
        return `<div class="strategy-title"><strong>${parts[0]}:</strong> ${parts[1].trim()}</div>`;
      }
    }
    // 检查是否是列表项（以-开头）
    else if (trimmed.startsWith('-')) {
      return `<div class="strategy-list-item">${trimmed.replace(/^-\s*/, '')}</div>`;
    }
    // 检查是否是粗体标题（**包围）
    else if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
      return `<div class="strategy-title"><strong>${trimmed.replace(/\*\*/g, '')}</strong></div>`;
    }
    // 检查是否包含粗体文本
    else if (trimmed.includes('**')) {
      return `<div class="strategy-paragraph-text">${trimmed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</div>`;
    }
    // 普通段落
    else {
      return `<div class="strategy-paragraph-text">${trimmed}</div>`;
    }
  }).join('');
}

function formatStockSymbol(event: Event) {
  const input = event.target as HTMLInputElement;
  input.value = input.value.toUpperCase();
  portfolioData.value.symbol = input.value;
}

// 格式化GPT分析内容
function formatGPTAnalysis(content: string): string {
  if (!content) return '';
  
  // 将内容按段落分割，支持多种分隔符
  const paragraphs = content.split(/\n+|\r\n+/).filter(p => p.trim());
  
  return paragraphs.map(paragraph => {
    const trimmed = paragraph.trim();
    
    // 检查是否是数字列表（以数字和点开头）
    if (/^\d+\./.test(trimmed)) {
      // 提取数字和内容
      const match = trimmed.match(/^(\d+)\.\s*(.*)$/);
      if (match) {
        const number = match[1];
        const content = match[2];
        return `<div class="gpt-numbered-item">
          <span class="number">${number}.</span>
          <span class="content">${content}</span>
        </div>`;
      }
      return `<div class="gpt-numbered-item">${trimmed}</div>`;
    }
    // 检查是否是标题（包含冒号且较短）
    else if (trimmed.includes(':') && trimmed.length < 100) {
      const parts = trimmed.split(':');
      if (parts.length === 2) {
        return `<div class="gpt-title"><strong>${parts[0]}:</strong> ${parts[1].trim()}</div>`;
      }
    }
    // 检查是否是列表项（以-开头）
    else if (trimmed.startsWith('-')) {
      return `<div class="gpt-list-item">${trimmed.replace(/^-\s*/, '')}</div>`;
    }
    // 检查是否是粗体标题（**包围）
    else if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
      return `<div class="gpt-title"><strong>${trimmed.replace(/\*\*/g, '')}</strong></div>`;
    }
    // 检查是否包含粗体文本
    else if (trimmed.includes('**')) {
      return `<div class="gpt-paragraph">${trimmed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</div>`;
    }
    // 普通段落
    else {
      return `<div class="gpt-paragraph">${trimmed}</div>`;
    }
  }).join('');
}

// 强制设置日期选择器为英文显示
function setDatePickerLocale() {
  const dateInputs = document.querySelectorAll('input[type="date"]');
  dateInputs.forEach(input => {
    // 设置语言属性
    input.setAttribute('lang', 'en-US');
    input.setAttribute('data-lang', 'en');
    
    // 强制设置语言环境
    if (input.style) {
      input.style.setProperty('-webkit-locale', 'en-US');
      input.style.setProperty('locale', 'en-US');
    }
    
    // 尝试强制设置浏览器语言环境
    try {
      // 创建新的日期对象来测试语言环境
      const testDate = new Date();
      const options = { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        locale: 'en-US'
      };
      testDate.toLocaleDateString('en-US', options);
    } catch (e) {
      console.log('Language setting not fully supported');
    }
  });
}

// 在组件挂载后设置
onMounted(() => {
  setDatePickerLocale();
  // 监听DOM变化，确保新添加的日期选择器也被设置
  const observer = new MutationObserver(() => {
    setDatePickerLocale();
  });
  observer.observe(document.body, { childList: true, subtree: true });
});

// API Functions
async function checkLoginStatus() {
  try {
    const response = await fetch('/api/checklogin', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.error('Error checking login status:', error);
  }
  return { success: false };
}

async function runStockPicker() {
  try{
        let histaryday = new Date();
        histaryday.setDate(histaryday.getDate() - 1);
        console.log(histaryday.toISOString().slice(0, 10))
        localStorage.removeItem(`runStockPicker_${histaryday.toISOString().slice(0, 10)}`)
    }
    catch(error){
      
    }
  const today = new Date().toISOString().slice(0, 10);
  const likeKey = `runStockPicker_${today}`;
  
  // Clear previous results and errors
  stockRecommendations.value = [];
  stockPickerError.value = '';
  isStockPickerLoading.value = true;
  
  try {
    // Check login status
   
    if (!userStore.token) {
      if (localStorage.getItem(likeKey)) {
        stockPickerError.value = 'You have already used it once today. If you want to continue using it, please log in!';
        return;
      }
    }
    
    const data = await getStockRecommendations(stockPickerCriteria.value);
    console.log('AI选股返回数据:', data);
    if (!data.success) {
      stockPickerError.value=data.error || 'Server returned error status';
      return;
      // throw new Error(data.error || 'Server returned error status');
    }
    
    stockRecommendations.value = data.recommendations || [];
    investmentSummary.value = data.investmentSummary || '';
    overallStrategy.value = data.overallStrategy || null;
    
    // 调试：打印返回的数据结构
    
    console.log('推荐股票数据:', stockRecommendations.value);
    console.log('投资摘要:', investmentSummary.value);
    console.log('整体策略:', overallStrategy.value);
    
    // 为每个股票设置默认激活的分析标签页
    stockRecommendations.value.forEach((stock: any) => {
      console.log('股票数据:', stock.symbol, stock);
      
      // 检查各种可能的数据结构
      if (stock.analysis && Object.keys(stock.analysis).length > 0) {
        const firstKey = Object.keys(stock.analysis)[0];
        activeTab.value[stock.symbol] = firstKey;
        console.log('设置分析标签页:', stock.symbol, firstKey);
      } else if (stock.sections) {
        // 兼容旧的数据结构
        console.log('使用sections数据结构');
      } else if (stock.reason) {
        // 显示reason字段作为基础分析
        console.log('使用reason字段:', stock.reason);
      }
    });
    
    localStorage.setItem('runStock', JSON.stringify(stockRecommendations.value));
    
  } catch (error) {
    console.error('Error in runStockPicker:', error);
    stockPickerError.value = error instanceof Error ? error.message : 'Unknown error';
  } finally {
    isStockPickerLoading.value = false;
    localStorage.setItem(likeKey, '1');
  }
}

async function runPortfolioDiagnosis() {
  const today = new Date().toISOString().slice(0, 10);
  const likeKey = `runPortfolioDiagnosis_${today}`;
  
  // Validate required fields
  if (!portfolioData.value.symbol.trim()) {
    alert('Please enter a stock symbol');
    return;
  }
  
  if (!portfolioData.value.purchasePrice || !portfolioData.value.purchaseDate) {
    alert('Please fill in purchase price and date for more accurate portfolio analysis');
  }
  
  // Clear previous results and errors
  stockDiagnosis.value = null;
  diagnosisError.value = '';
  isDiagnosisLoading.value = true;
  
  try {
    // Check login status
    const loginStatus = await checkLoginStatus();
    if (loginStatus.success && !loginStatus.userlogin) {
      if (localStorage.getItem(likeKey)) {
        diagnosisError.value = 'You have already used it once today. If you want to continue using it, please log in!';
        return;
      }
    }
    
    const requestData = {
      ...portfolioData.value,
      purchasePrice: portfolioData.value.purchasePrice ? parseFloat(portfolioData.value.purchasePrice) : null,
    };
    
    const data = await getPortfolioDiagnosis(requestData);
    
    if (!data.success) {
      diagnosisError.value=data.error || 'Server returned error status';
      return;
    }
    
    stockDiagnosis.value = data.diagnosis || null;
    
  } catch (error) {
    console.error('Error in runPortfolioDiagnosis:', error);
    diagnosisError.value = error instanceof Error ? error.message : 'Unknown error';
  } finally {
    isDiagnosisLoading.value = false;
    localStorage.setItem(likeKey, '1');
  }
}

async function testAPI() {
  console.log('Testing AI Stock Picker API...');
  try {
    const response = await fetch('/api/ai/stock-picker', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sector: 'technology',
        style: 'growth',
        risk: 'medium',
        timeHorizon: 'medium'
      })
    });
    
    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Full API response:', data);
    
    if (data.recommendations && data.recommendations.length > 0) {
      alert(`API test successful! Got ${data.recommendations.length} recommendations`);
    } else {
      alert('API response successful but no recommendations found');
    }
  } catch (error) {
    console.error('API test failed:', error);
    alert(`API test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Load saved results on mount
onMounted(() => {
  try {
    const savedResults = localStorage.getItem('runStock');
    if (savedResults) {
      stockRecommendations.value = JSON.parse(savedResults);
    }
  } catch (error) {
    console.error('Error loading saved results:', error);
  }
});
</script>

<style scoped>
.ai-page-container {
  min-height: 100vh;
  background: var(--bg-primary);
  width: 100%;
}

.ai-page-wrapper {
  width: 100%;
}

/* Hero */
.ai-hero-banner {
  position: relative;
  padding: 72px 40px;
  background: var(--primary-gradient);
  overflow: hidden;
}

.ai-hero-banner::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.12) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.08) 0%, transparent 50%);
  pointer-events: none;
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 900px;
  margin: 0 auto;
  text-align: center;
}

.hero-icon-large {
  width: 88px;
  height: 88px;
  margin: 0 auto 24px;
  background: rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.25);
}

.hero-icon-large svg {
  width: 44px;
  height: 44px;
}

.hero-title {
  font-size: 48px;
  font-weight: 900;
  color: white;
  margin: 0 0 16px;
  letter-spacing: -0.5px;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.hero-description {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.92);
  margin: 0;
  line-height: 1.6;
}

/* Content */
.ai-content-area {
  max-width: 1400px;
  margin: 0 auto;
  padding: 48px 40px 80px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.ai-tool-card {
  background: var(--bg-glass);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  padding: 32px;
  box-shadow: var(--shadow-md);
  transition: border-color var(--transition-base), box-shadow var(--transition-base);
}

.ai-tool-card:hover {
  border-color: rgba(102, 126, 234, 0.35);
  box-shadow: var(--shadow-lg);
}

.tool-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding-bottom: 24px;
  margin-bottom: 8px;
  border-bottom: 1px solid var(--border-color);
  flex-wrap: wrap;
}

.tool-icon {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: var(--primary-gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.35rem;
  flex-shrink: 0;
  box-shadow: var(--shadow-glow);
}

.tool-title {
  flex: 1;
  min-width: 200px;
}

.tool-title h3 {
  margin: 0 0 6px;
  font-size: 1.5rem;
  font-weight: 700;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.tool-title p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

.history-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border-radius: 999px;
  background: rgba(102, 126, 234, 0.12);
  border: 1px solid rgba(102, 126, 234, 0.28);
  color: var(--text-primary);
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all var(--transition-base);
  white-space: nowrap;
}

.history-link:hover {
  background: rgba(102, 126, 234, 0.22);
  border-color: rgba(102, 126, 234, 0.45);
  color: white;
  transform: translateY(-1px);
}

.tool-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-top: 16px;
}

.input-section,
.results-section {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: 24px;
}

.input-section h4,
.results-section h4 {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 20px;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.input-section h4 i,
.results-section h4 i {
  color: var(--color-primary);
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

.form-control,
.form-select {
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  border-radius: var(--border-radius-sm);
  padding: 12px 14px;
  margin-bottom: 16px;
  font-size: 0.95rem;
  transition: all var(--transition-base);
}

.form-control:focus,
.form-select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
  background: rgba(102, 126, 234, 0.06);
}

.form-select option {
  background: #1a1f3a;
  color: white;
}

.form-range {
  width: 100%;
  accent-color: var(--color-primary);
}

.risk-tolerance-slider {
  margin-bottom: 20px;
}

.slider-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  font-size: 0.75rem;
  color: var(--text-muted);
}

.current-value {
  text-align: center;
  margin-top: 10px;
  font-weight: 600;
  color: var(--color-primary);
  font-size: 0.9rem;
}

.btn-ai {
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 24px;
  border: none;
  border-radius: var(--border-radius);
  background: var(--primary-gradient);
  color: white;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-base);
  box-shadow: var(--shadow-glow);
}

.btn-ai:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(102, 126, 234, 0.45);
}

.btn-ai:disabled {
  opacity: 0.55;
  cursor: not-allowed;
  transform: none;
}

.results-section {
  min-height: 280px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  text-align: center;
}

.empty-icon {
  width: 72px;
  height: 72px;
  border-radius: 20px;
  background: rgba(102, 126, 234, 0.1);
  border: 1px solid rgba(102, 126, 234, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  font-size: 2rem;
  color: var(--color-primary);
}

.empty-state p {
  margin: 0;
  color: var(--text-muted);
  line-height: 1.6;
  max-width: 320px;
}

.loading-spinner {
  text-align: center;
  padding: 48px 24px;
  color: var(--text-secondary);
}

.spinner-border {
  color: var(--color-primary);
  width: 2.5rem;
  height: 2.5rem;
}

.alert-danger {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #fca5a5;
  border-radius: var(--border-radius-sm);
  padding: 14px 16px;
  margin-bottom: 16px;
}

/* Stock cards */
.stock-recommendation {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: 20px;
  margin-bottom: 16px;
  transition: all var(--transition-base);
}

.stock-recommendation:hover {
  border-color: rgba(102, 126, 234, 0.35);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.stock-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 8px;
}

.stock-symbol {
  font-size: 1.35rem;
  font-weight: 800;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stock-name {
  font-size: 0.95rem;
  color: var(--text-primary);
  font-weight: 500;
  margin-bottom: 4px;
}

.stock-industry {
  color: var(--text-muted);
  font-size: 0.85rem;
  margin-bottom: 12px;
}

.stock-price-info {
  text-align: right;
}

.current-price {
  display: block;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
}

.price-change {
  display: inline-block;
  margin-top: 4px;
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
}

.price-change.positive,
.metric-value.positive,
.return-estimate.positive {
  background: rgba(16, 185, 129, 0.15);
  color: var(--color-success);
}

.price-change.negative,
.metric-value.negative,
.return-estimate.negative {
  background: rgba(239, 68, 68, 0.15);
  color: var(--color-danger);
}

.stock-metrics {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 12px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: var(--border-radius-sm);
  margin-bottom: 12px;
}

.stock-metrics .metric-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 90px;
}

.stock-metrics .metric-label {
  font-size: 0.7rem;
  color: var(--text-muted);
  text-transform: uppercase;
}

.stock-metrics .metric-value {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
}

.stock-footer {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--border-color);
}

.sector-tag,
.return-estimate,
.risk-level {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.8rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
}

.sector-tag {
  color: var(--color-primary);
}

/* Analysis tabs */
.enhanced-analysis {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
}

.analysis-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.analysis-tab {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.8rem;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all var(--transition-base);
}

.analysis-tab:hover {
  border-color: rgba(102, 126, 234, 0.4);
  color: var(--text-primary);
}

.analysis-tab.active {
  background: rgba(102, 126, 234, 0.2);
  border-color: var(--color-primary);
  color: white;
}

.analysis-panel {
  background: rgba(0, 0, 0, 0.2);
  border-radius: var(--border-radius-sm);
  padding: 16px;
  border: 1px solid var(--border-color);
}

.analysis-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border-color);
}

.analysis-header h6 {
  margin: 0;
  color: var(--text-primary);
  font-weight: 600;
}

.analysis-score {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
}

.score-excellent { background: rgba(16, 185, 129, 0.2); color: var(--color-success); }
.score-good { background: rgba(102, 126, 234, 0.2); color: #a5b4fc; }
.score-fair { background: rgba(245, 158, 11, 0.2); color: #fbbf24; }
.score-poor { background: rgba(239, 68, 68, 0.2); color: #f87171; }

.analysis-text {
  color: var(--text-secondary);
  line-height: 1.7;
  font-size: 0.9rem;
}

/* Sub-sections */
.investment-advice,
.risk-assessment,
.fundamentals-section,
.basic-analysis,
.sections-analysis .analysis-section {
  margin-top: 14px;
  padding: 16px;
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--border-color);
  background: rgba(255, 255, 255, 0.03);
}

.investment-advice h6,
.risk-assessment h6,
.fundamentals-section h6,
.basic-analysis h6 {
  color: var(--text-primary);
  margin-bottom: 12px;
  font-weight: 600;
}

.advice-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 10px;
}

.advice-label {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.advice-value {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
}

.action-buy {
  color: var(--color-success) !important;
}

.risk-badge {
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
}

.risk-badge.low { background: rgba(16, 185, 129, 0.2); color: var(--color-success); }
.risk-badge.medium { background: rgba(245, 158, 11, 0.2); color: #fbbf24; }
.risk-badge.high { background: rgba(239, 68, 68, 0.2); color: #f87171; }

.risk-details p,
.fundamentals-content p {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 8px;
  font-size: 0.9rem;
}

.risk-details strong,
.fundamentals-content strong {
  color: var(--text-primary);
}

/* Strategy block */
.investment-summary-section {
  margin-top: 24px;
  padding: 20px;
  background: rgba(102, 126, 234, 0.08);
  border: 1px solid rgba(102, 126, 234, 0.22);
  border-radius: var(--border-radius);
}

.investment-summary-section h4 {
  color: var(--text-primary);
  margin-bottom: 16px;
  font-size: 1rem;
}

.strategy-content {
  display: grid;
  gap: 12px;
}

.strategy-item {
  padding: 14px;
  background: rgba(255, 255, 255, 0.04);
  border-radius: var(--border-radius-sm);
  border-left: 3px solid var(--color-primary);
}

.strategy-item h5 {
  color: var(--color-primary);
  margin-bottom: 8px;
  font-size: 0.9rem;
}

.strategy-paragraph :deep(.strategy-title) {
  margin-bottom: 8px;
  padding: 10px 12px;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 8px;
  color: var(--text-primary);
  font-weight: 600;
}

.strategy-paragraph :deep(.strategy-list-item) {
  margin-bottom: 6px;
  padding: 6px 6px 6px 20px;
  color: var(--text-secondary);
  position: relative;
  font-size: 0.9rem;
}

.strategy-paragraph :deep(.strategy-list-item::before) {
  content: "▸";
  position: absolute;
  left: 4px;
  color: var(--color-primary);
}

.strategy-paragraph :deep(.strategy-paragraph-text) {
  margin-bottom: 8px;
  color: var(--text-secondary);
  line-height: 1.6;
  font-size: 0.9rem;
}

/* Diagnosis */
.diagnosis-section,
.gpt-diagnosis-section {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: 20px;
  margin-bottom: 16px;
}

.diagnosis-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-color);
  flex-wrap: wrap;
}

.diagnosis-title {
  color: var(--text-primary) !important;
  font-weight: 700;
  margin: 0;
}

.diagnosis-content {
  color: var(--text-secondary);
  line-height: 1.7;
}

.metric-card {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  padding: 14px;
  text-align: center;
  margin-bottom: 8px;
}

.metric-card .metric-label {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-bottom: 6px;
}

.metric-card .metric-value {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
}

.text-success { color: var(--color-success) !important; }
.text-danger { color: var(--color-danger) !important; }

.badge {
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
}

.bg-success { background: rgba(16, 185, 129, 0.25) !important; color: var(--color-success) !important; }
.bg-warning { background: rgba(245, 158, 11, 0.25) !important; color: #fbbf24 !important; }
.bg-danger { background: rgba(239, 68, 68, 0.25) !important; color: #f87171 !important; }
.bg-info { background: rgba(102, 126, 234, 0.25) !important; color: #a5b4fc !important; }

.gpt-analysis {
  background: rgba(102, 126, 234, 0.06);
  border-radius: var(--border-radius-sm);
  padding: 14px;
  border-left: 3px solid var(--color-primary);
}

.gpt-title {
  margin-bottom: 10px;
  padding: 10px 12px;
  background: rgba(102, 126, 234, 0.12);
  border-radius: 8px;
  color: var(--text-primary);
  font-weight: 600;
}

.gpt-title strong { color: var(--color-primary); }

.gpt-paragraph,
.gpt-list-item,
.gpt-numbered-item {
  margin-bottom: 8px;
  color: var(--text-secondary);
  line-height: 1.7;
  font-size: 0.9rem;
}

.gpt-list-item {
  padding-left: 16px;
  position: relative;
}

.gpt-list-item::before {
  content: "•";
  position: absolute;
  left: 0;
  color: var(--color-primary);
}

.gpt-numbered-item .number {
  color: var(--color-primary);
  font-weight: 700;
  margin-right: 6px;
}

.result-item {
  opacity: 0;
  transform: translateY(12px);
  animation: slideIn 0.45s ease forwards;
}

@keyframes slideIn {
  to { opacity: 1; transform: translateY(0); }
}

input[type="date"] {
  color-scheme: dark;
}

input[type="date"]::-webkit-calendar-picker-indicator {
  filter: invert(1);
  cursor: pointer;
}

.loading-text {
  margin-top: 1rem;
  color: var(--text-secondary);
}

.uppercase-input {
  text-transform: uppercase;
}

@media (max-width: 992px) {
  .tool-content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .ai-hero-banner {
    padding: 48px 20px 36px;
  }

  .hero-title {
    font-size: clamp(1.5rem, 6vw, 2rem);
  }

  .hero-description {
    font-size: 15px;
  }

  .ai-content-area {
    padding: 24px 16px 48px;
  }

  .ai-tool-card {
    padding: 20px 16px;
  }

  .tool-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .history-link {
    width: 100%;
    justify-content: center;
    min-height: 44px;
  }

  .stock-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .stock-price-info {
    text-align: left;
  }

  .btn-ai {
    width: 100%;
    min-height: 48px;
    justify-content: center;
  }

  .stock-recommendation,
  .result-item {
    padding: 16px;
  }

  .input-section,
  .results-section {
    padding: 16px;
  }
}

@media (max-width: 480px) {
  .ai-hero-banner {
    padding: 40px 16px 28px;
  }

  .ai-content-area {
    padding: 20px 12px 40px;
  }

  .ai-tool-card {
    padding: 16px 12px;
    border-radius: var(--border-radius);
  }

  .tool-title h3 {
    font-size: 1.1rem;
  }

  .stock-recommendation {
    padding: 14px;
  }

  .stock-symbol {
    font-size: 1.25rem;
  }
}
</style>
