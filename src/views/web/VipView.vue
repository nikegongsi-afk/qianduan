<template>
  <div class="app-container">
    <navcomponent></navcomponent>
    <!-- Top Navigation -->
    <!-- <nav class="top-nav">
      <div class="nav-content">
        <div class="nav-left">
          <a href="/" class="btn btn-back">
              <i class="bi bi-arrow-left me-1"></i>Back to Home
            </a>
        </div>
        <div class="nav-center d-none d-md-flex">
          <i class="bi bi-graph-up header-icon"></i>
          <h1 class="header-title">{{ homeTopTitle }}</h1>
        </div>
        <div class="nav-right">
          <button class="btn btn-login" :class="{ 'logged-in': isLoggedIn }" @click="handleLoginButtonClick">
            <i :class="isLoggedIn ? 'bi bi-person-check-fill' : 'bi bi-person-fill'" class="me-1"></i>
            {{ isLoggedIn ? username : 'Login' }}
          </button>
        </div>
      </div>
    </nav> -->

    <!-- Login Modal -->
    <div class="modal fade" id="loginModal" tabindex="-1" aria-labelledby="loginModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
          <h5 class="modal-title" id="loginModalLabel">User Login</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
          <div class="modal-body">
            <form @submit.prevent="handleLogin">
              <div class="mb-3">
                <label for="username" class="form-label">Username</label>
              <input type="text" class="form-control" id="username" v-model="loginUsername" placeholder="Enter your username">
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
              <input type="password" class="form-control" id="password" v-model="loginPassword" placeholder="Enter your password">
              </div>
              <button type="submit" class="btn btn-submit">Login</button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- VIP Hero -->
    <div class="vip-hero-banner">
      <div class="hero-content">
        <div class="hero-icon-large">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"></path>
          </svg>
        </div>
        <p class="hero-greeting">Welcome Back,</p>
        <h1 class="hero-title">{{ isLoggedIn ? username : 'Elite Trader' }}</h1>
        <p class="hero-description">Your VIP Trading Sanctuary Awaits</p>
        <div class="hero-level-badge" v-if="nowLevelInfo.currlevelname">
          <i class="bi bi-star-fill"></i>
          <span>{{ nowLevelInfo.currlevelname }}</span>
        </div>
      </div>
    </div>

    <div class="vip-content-area">
      <!-- Progress Section -->
      <div class="progress-section">
        <a href="/vipdashboard" class="progress-link" @click.prevent="handleProgressCardClick">
          <div class="progress-card" :class="{ clickable: isLoggedIn, unclickable: !isLoggedIn }">
            <div class="row align-items-center g-2">
              <div class="col-md-3">
                <div class="current-level">
                  <i class="bi bi-star-fill"></i>
                  <h4 class="level-label">Current Level</h4>
                  <p class="level-name">{{ nowLevelInfo.currlevelname }}</p>
                </div>
              </div>
              <div class="col-md-6">
                <div class="progress-bar-wrapper">
                  <div class="progress">
                    <div class="progress-bar" role="progressbar"
                      :style="{ width: progress + '%' }"
                      :aria-valuenow="dynamicTotalAsset"
                      aria-valuemin="0"
                      :aria-valuemax="currentTarget">
                      <span class="progress-percent">{{ progress }}%</span>
                    </div>
                  </div>
                  <div class="progress-labels d-flex justify-content-between">
                    <span>${{ formatNumber(dynamicTotalAsset) }} / ${{ formatNumber(nowLevelInfo.nextmoney) }}</span>
                    <span class="next-level-text">Next Level: {{ nowLevelInfo.nextname }}</span>
                  </div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="next-milestone">
                  <i class="bi bi-crown-fill"></i>
                  <h4 class="level-label">Next Level</h4>
                  <p class="level-name">{{ nowLevelInfo.nextname }}</p>
                </div>
              </div>
            </div>
          </div>
        </a>
      </div>

      <!-- Membership Cards Section -->
      <div class="membership-cards-container">
        <!-- Membership Cards -->
        <div v-for="(level, index) in vipList" :key="index" class="membership-card-wrapper">
          <div :class="['membership-card', getCardClass(level.name), 'text-center']">
            <span v-if="nowLevelInfo.currlevelname === level.name" class="vip-badge">Current Selection</span>
            <i class="bi bi-star-fill card-icon"></i>
            <h3 class="h3Height">{{ level.name }}</h3>
            <div class="card-requirement">>=${{ formatNumber(level.min_trading_volume) }}</div>
            <ul class="feature-list">              <li v-for="(benefit, i) in level.benefits" :key="i">
                <i class="bi bi-check-circle-fill"></i> {{ benefit }}
              </li>
            </ul>
         
            <div v-if="level.vip_price>0" class="upgrade-info">
              <div class="vip-price">
                <span class="price-value">
                  {{ formatNumber(level.vip_price || 0) }}
                  <span class="price-currency">USDT</span>
                </span>
              </div>
              <button class="btn-purchase" @click="openPaymentModal(level)">
                Purchase Now
              </button>
            </div>          
          </div>
        </div>
      </div>
      
      <!-- Membership Agreement Button -->
      <div class="text-center mt-4 mb-4">
        <button class="btn-community-primary" data-bs-toggle="modal" data-bs-target="#membershipAgreementModal">
          <i class="bi bi-file-text me-2"></i>View Membership Agreement
        </button>
      </div>
      
    </div>
    
    <!-- Membership Agreement Modal -->
    <div class="modal fade" id="membershipAgreementModal" tabindex="-1" aria-labelledby="membershipAgreementModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="membershipAgreementModalLabel">Membership Agreement</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="agreement-content">
              <div class="agreement-header-section">
                <h3 class="agreement-main-title">Membership Agreement</h3>
                <p class="agreement-description">
                  This platform is a paid service focused on providing members with professional investment strategies and market analysis. Members pay commissions based on actual profits. In the event of significant losses, the platform will compensate and share commissions according to the ratios shown in the membership level table.
                </p>
              </div>
              
              <div class="agreement-table-section">
                <h4 class="table-title">Membership Commission Mechanism</h4>
                <div class="table-responsive">
                  <table class="table table-striped table-dark">
                    <thead>
                      <tr>
                        <th>Membership Level</th>
                        <th>Fund Range</th>
                        <th>Monthly Profit Ratio</th>
                        <th>Commission Ratio</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(level, index) in vipList" :key="index">
                        <td><span class="badge bg-warning">{{level.name}}</span></td>
                        <td>>=${{ formatNumber(level.min_trading_volume) }}</td>
                        <td><span class="text-success">{{level.monthly_profit_ratio}}%</span></td>
                        <td><span class="text-info">{{level.commission_ratio}}%</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div class="agreement-table-section">
                <h4 class="table-title">Membership Compensation Mechanism</h4>
                <div class="table-responsive">
                  <table class="table table-striped table-dark">
                    <thead>
                      <tr>
                        <th>Membership Level</th>
                        <th>Fund Range</th>
                        <th>Risk Ratio</th>
                        <th>Compensation Ratio</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(level, index) in vipList" :key="index">
                        <td><span class="badge bg-warning">{{level.name}}</span></td>
                        <td>>=${{ formatNumber(level.min_trading_volume) }}</td>
                        <td><span class="text-danger">{{level.risk_ratio}}%</span></td>
                        <td><span class="text-success">{{level.compensation_ratio}}%</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div class="agreement-terms">
                <h4>Terms and Conditions</h4>
               
                <ul class="terms-list">
                  <li v-for="(term, index) in traderTerms" :key="index">
                    <i class="bi bi-check-circle text-success me-2"></i>{{ term }}
                  </li>
                  <!-- 如果没有交易员条款数据，显示默认条款 -->
                  <template v-if="traderTerms.length === 0">
                    <li><i class="bi bi-check-circle text-success me-2"></i>Membership fees are non-refundable once paid</li>
                    <li><i class="bi bi-check-circle text-success me-2"></i>Commission is calculated based on actual profits</li>
                    <li><i class="bi bi-check-circle text-success me-2"></i>Compensation is provided for losses exceeding risk thresholds</li>
                    <li><i class="bi bi-check-circle text-success me-2"></i>Platform reserves the right to modify terms with notice</li>
                    <li><i class="bi bi-check-circle text-success me-2"></i>All trading involves risk, past performance doesn't guarantee future results</li>
                  </template>
                </ul>
              </div>
              
            
            </div>
          </div>
          <div class="modal-footer justify-content-center">
            <button type="button" class="btn-community-primary" @click="joinCommunity">
              I already know
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Payment Modal -->
    <div class="modal fade" id="paymentModal" tabindex="-1" aria-labelledby="paymentModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title display-6 text-gold" id="paymentModalLabel">
              <i class="bi bi-crown me-2"></i>VIP Payment
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <!-- Payment QR Code Section -->
            <div class="payment-section mb-5 p-4 bg-gradient-radial" style="background: rgba(255, 215, 0, 0.05); border-radius: 20px; border: 1px solid rgba(255, 215, 0, 0.1);">
              <!-- Amount -->
              <div class="text-center mb-4">
                <h4 class="section-title" style="color: #ffd700; font-weight: 700; margin-bottom: 0.5rem;">
                  Amount
                </h4>
                <div class="payment-detail-item">
                  <span class="font-weight-bold text-gold" style="font-size: 1.8rem;">
                    {{ formatNumber(selectedVipLevel?.vip_price || 0) }}
                    <span style="font-size: 1rem;"> USDT</span>
                  </span>
                </div>
              </div>
              
              <!-- QR Code -->
              <div class="text-center">
                <h4 class="section-title mb-3" style="color: #ffd700; font-weight: 700;">
                  QR Code
                </h4>
                <div class="qr-code-container p-4" style="background: rgba(255, 255, 255, 0.05); border-radius: 15px; display: inline-block; max-width: 100%;">
                  <img 
                    v-if="paymentQrCode" 
                    :src="paymentQrCode" 
                    alt="Payment QR Code" 
                    class="payment-qr-code"
                  >
                  <div v-else class="qr-code-placeholder">
                    <i class="bi bi-qr-code display-1 text-gold"></i>
                    <p class="text-muted mt-2">Loading QR Code...</p>
                  </div>
                  
                </div>
              </div>
               <div class="qr-code-placeholder">
                    wallet:<i class="bi display-1 text-gold" style="font-size: 13px;">{{ paycode }}</i> <a @click="copypaycode" style="cursor: pointer;">copy</a>
                  </div>
            </div>

            <!-- Payment Proof Upload Section -->
            <div class="upload-section p-4 bg-gradient-radial" style="background: rgba(255, 215, 0, 0.05); border-radius: 20px; border: 1px solid rgba(255, 215, 0, 0.1);">
              <h4 class="section-title mb-4 text-center" style="color: #ffd700; font-weight: 700;">
                <i class="bi bi-upload me-2"></i>Upload Payment Proof
              </h4>
              
              <div class="upload-container text-center">
                <input 
                  type="file" 
                  id="paymentProof" 
                  ref="paymentProofUpload" 
                  class="payment-proof-input" 
                  accept="image/*" 
                  @change="handlePaymentProofUpload"
                >
                
                <div v-if="!paymentProofPreview" class="upload-placeholder">
                  <button 
                    type="button" 
                    class="btn-upload"
                    @click="triggerPaymentProofUpload"
                  >
                    <i class="bi bi-cloud-arrow-up-fill display-3 mb-3 text-gold"></i>
                    <h5 class="mb-2" style="font-weight: 600;">Click or Drag to Upload</h5>
                    <p class="text-muted mb-1">Upload your payment screenshot here</p>
                    <small class="text-muted">Supports JPG, PNG, GIF • Max 5MB</small>
                  </button>
                </div>
                
                <!-- Preview uploaded image -->
                <div v-else class="proof-preview-container mt-4">
                  <div class="proof-preview">
                    <img :src="paymentProofPreview" alt="Payment Proof Preview" class="preview-image">
                    <button 
                      type="button" 
                      class="btn-remove-preview"
                      @click="removePaymentProofPreview"
                    >
                      <i class="bi bi-x-lg"></i>
                    </button>
                  </div>
                  <div class="proof-preview-info mt-3">
                    <h6 class="mb-0" style="font-weight: 600;">Payment Proof Uploaded</h6>
                    <p class="text-muted text-sm mb-0">Click the <i class="bi bi-x"></i> button to replace the image</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer justify-content-center gap-3 py-4">
            <button type="button" class="btn-secondary" data-bs-dismiss="modal">
              <i class="bi bi-x-circle me-2"></i>Cancel
            </button>
            <button 
              type="button" 
              class="btn-community-primary" 
              @click="submitPayment"
              :disabled="!paymentProofPreview"
              style="min-width: 200px;"
            >
              <i v-if="!isSubmitting" class="bi bi-check-circle me-2"></i>
              <i v-else class="bi bi-hourglass-split me-2"></i>
              <span v-if="!isSubmitting">Submit Payment</span>
              <span v-else>Processing...</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Interactive Trading Quiz -->
    <div class="trading-quiz-arena" v-if="quizQuestions.length>0">
      <div class="quiz-container-interactive">
        <div class="quiz-dashboard">
          <div class="quiz-branding">
            <div class="brand-icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </div>
            <div class="brand-text">
              <h2>Trading Mastery Challenge</h2>
              <p>Prove Your Market Expertise</p>
            </div>
          </div>
          <div class="quiz-stats-row">
            <div class="quiz-stat">
              <span class="quiz-stat-value">
                {{ currentQuestionIndex + 1 }}<span class="quiz-stat-divider">/</span>{{ quizQuestions.length }}
              </span>
              <span class="quiz-stat-label">Questions</span>
            </div>
            <div class="quiz-stat">
              <span class="quiz-stat-value score">{{ score }}</span>
              <span class="quiz-stat-label">Score</span>
            </div>
            <div class="quiz-stat">
              <span class="quiz-stat-value accent">
                {{ currentQuestionIndex > 0 ? Math.round((score / currentQuestionIndex) * 100) : 0 }}%
              </span>
              <span class="quiz-stat-label">Accuracy</span>
            </div>
          </div>
        </div>

        <div class="question-arena" v-if="!quizCompleted">
          <div class="question-meta">
            <span class="question-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <circle cx="12" cy="12" r="6"></circle>
                <circle cx="12" cy="12" r="2"></circle>
              </svg>
              Financial Strategy
            </span>
          </div>

          <div class="question-card">
            <h3 class="main-question">{{ currentQuestion.question }}</h3>
          </div>

          <div class="answer-list">
            <div
              v-for="(option, index) in currentQuestion.options"
              :key="index"
              class="answer-option"
              :class="{
                selected: selectedAnswer === index,
                'correct-answer': showResult && index === currentQuestion.correctAnswer,
                'wrong-answer': showResult && selectedAnswer === index && index !== currentQuestion.correctAnswer,
                revealed: showResult
              }"
              @click="handleSelectAnswer(index)"
            >
              <span class="option-letter">{{ String.fromCharCode(65 + index) }}</span>
              <span class="option-text">{{ option }}</span>
              <span v-if="showResult && index === currentQuestion.correctAnswer" class="option-status correct">✓</span>
              <span v-else-if="showResult && selectedAnswer === index && index !== currentQuestion.correctAnswer" class="option-status wrong">✗</span>
            </div>
          </div>

          <div v-if="showResult" class="next-question-zone">
            <button @click="goToNextQuestion" class="next-question-btn">
              {{ currentQuestionIndex < quizQuestions.length - 1 ? 'Next Question' : 'View Results' }}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>
        </div>

        <!-- Victory Screen -->
        <div v-else class="victory-screen">
          <div class="victory-icon-wrap">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"></path>
            </svg>
          </div>
          <h2 class="victory-title">Challenge Complete</h2>
          <div class="final-stats">
            <div class="stat-card">
              <div class="stat-value">{{ score }}/{{ quizQuestions.length }}</div>
              <div class="stat-label">Correct</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">{{ Math.round((score / quizQuestions.length) * 100) }}%</div>
              <div class="stat-label">Accuracy</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">{{ getPerformanceRating() }}</div>
              <div class="stat-label">Rating</div>
            </div>
          </div>
          <div class="victory-message">
            <p v-if="score === quizQuestions.length">Perfect score! Outstanding market knowledge.</p>
            <p v-else-if="score >= quizQuestions.length * 0.8">Excellent performance! Strong trading fundamentals.</p>
            <p v-else-if="score >= quizQuestions.length * 0.6">Solid progress. Keep learning to level up.</p>
            <p v-else>Every expert started here. Practice makes perfect.</p>
          </div>
          <div class="victory-actions">
            <button @click="restartQuiz" class="action-button primary">New Challenge</button>
            <button @click="restartQuiz" class="action-button secondary">Change Topic</button>
          </div>
        </div>
      </div>

      <div v-if="showNotification" class="floating-notification" :class="notificationType">
        <div class="notification-bubble">
          <span class="bubble-text">{{ notificationMessage }}</span>
        </div>
      </div>
    </div>

     <!-- Redirect Message -->
    <div class="redirect-message" v-show="showContactPopup">
        <span class="text">Redirecting to WhatsApp Community</span><span class="dots"></span>
    </div>
    <!-- 合作单位 -->
    <PartnerOrganizations />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted,computed } from 'vue';
import { useRouter } from 'vue-router';
import { Modal } from 'bootstrap';
import navcomponent from '../component/nav/nav.vue'
import PartnerOrganizations from '@/components/PartnerOrganizations.vue';
import{ get_userinfo,get_membership_levels,updateUserLevel, get_random_questions,startquestions, createPaymentRecord } from '../../api/module/web/vip'
import { get_whatsapp_link,gettrader_profiles } from '../../api/module/web/index'
import { uploadImage } from '../../api/module/commone'
import { useUserStore } from '@/store';
const userStore = useUserStore()
const router = useRouter();

// Contact popup state (same as HomeView.vue)
const showContactPopup = ref(false);

// Toggle contact popup function (same as HomeView.vue)
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

// Payment Modal state
const selectedVipLevel = ref(null);
const paymentQrCode = ref('');
const paycode = ref('');
const paymentProofPreview = ref('');
const isSubmitting = ref(false);
const isUploading = ref(false); // Upload status flag
const paymentProofUpload = ref(null);
const traderProfiles=ref({})
let paymentModalInstance = null;
let uploadedImageUrl = ref(''); // Store the uploaded image URL

// Open payment modal
const openPaymentModal = (level) => {
  selectedVipLevel.value = level;
  isSubmitting.value = false;
  paymentProofPreview.value = '';
  
  // Get payment QR code
  getPaymentQrCode();
  
  // Show modal
  if (!paymentModalInstance) {
    const modalElement = document.getElementById('paymentModal');
    if (modalElement) {
      paymentModalInstance = new Modal(modalElement);
    }
  }
  paymentModalInstance?.show();
};

// Get payment QR code from traderProfiles
const getPaymentQrCode = () => {
  console.log(traderProfiles.value)
  // Use the pay_qr_code_img from the loaded traderProfiles
  paymentQrCode.value = traderProfiles.value.pay_qr_code_img || '';
  paycode.value = traderProfiles.value.paycode || '';
};

// Trigger payment proof upload
const triggerPaymentProofUpload = () => {
  paymentProofUpload.value?.click();
};

// Handle payment proof upload
const handlePaymentProofUpload = async (event) => {
  const file = event.target.files[0];
  if (file) {
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }
    
    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      paymentProofPreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
    
    // Set uploading state
    isUploading.value = true;
    
    try {
      // Create FormData object
      const formData = new FormData();
      formData.append('file', file);
      
      // Call uploadImage API to upload image
      const response = await uploadImage(formData);
      
      // Store the uploaded image URL
      uploadedImageUrl.value = response.data.url;
      console.log('Payment proof uploaded successfully:', uploadedImageUrl.value);
    } catch (error) {
      console.error('Failed to upload payment proof:', error);
      alert('Failed to upload payment proof. Please try again later.');
      // Clear preview if upload fails
      removePaymentProofPreview();
    } finally {
      // Reset upload state
      isUploading.value = false;
      // Clear input to allow selecting the same file again
      event.target.value = '';
    }
  }
};

// Remove payment proof preview
const removePaymentProofPreview = () => {
  paymentProofPreview.value = '';
  uploadedImageUrl.value = ''; // Clear the uploaded image URL
  if (paymentProofUpload.value) {
    paymentProofUpload.value.value = '';
  }
};

// Submit payment
const submitPayment = async () => {
  if (!paymentProofPreview.value) {
    alert('Please upload payment proof first');
    return;
  }
  
  if (!uploadedImageUrl.value) {
    alert('Please wait for the payment proof to upload successfully');
    return;
  }
  
  isSubmitting.value = true;
  
  try {
    // Create payment record data
    const paymentData = {
      vip_level_id: selectedVipLevel.value.id,
      vip_level_name: selectedVipLevel.value.name,
      amount: selectedVipLevel.value.vip_price,
      payment_screenshot: uploadedImageUrl.value,
      trader_uuid: traderProfiles.value.trader_uuid || '' // 添加trader_uuid字段
    };
    
    // Call API to create payment record
    const response = await createPaymentRecord(paymentData);
    
    if (response.success) {
      console.log('Payment record created successfully:', paymentData);
      alert('Payment submitted successfully! We will review your payment and upgrade your VIP level within 24 hours.');
      
      // Close modal
      paymentModalInstance?.hide();
      
      // Reset form
      removePaymentProofPreview();
      selectedVipLevel.value = null;
      paymentQrCode.value = '';
    } else {
      throw new Error(response.message || 'Failed to create payment record');
    }
  } catch (error) {
    console.error('Failed to submit payment:', error);
    alert('Failed to submit payment. Please try again later.');
  } finally {
    isSubmitting.value = false;
  }
};

// Function to handle joining community (same as HomeView.vue)
const joinCommunity = () => {
  // Close membership agreement modal
  const modalElement = document.getElementById('membershipAgreementModal');
  if (modalElement) {
    const modal = Modal.getInstance(modalElement) || new Modal(modalElement);
    modal.hide();
  }
  
  
};
const userinfo=ref({})
const membership_levels=ref([])
const traderTerms=ref<string[]>([])
// Page data
const homeTopTitle = ref('RenderZaice Trading Platform');
const membershipLevel = ref('Regular Member');
const isLoggedIn = ref(false);
const username = ref('');
const loginUsername = ref('');
const loginPassword = ref('');
const current_level=ref(0)
// 模拟数据
const nowLevelInfo = ref({
  current_level:-1,
  currlevelname: 'Regular Member',
  next_level: -1,
  nextmoney: 50000,
  nextname: 'Gold Member'
});

const dynamicTotalAsset = ref(0);
const currentTarget = ref(1000000);
const progress = ref(Math.round((dynamicTotalAsset.value / nowLevelInfo.value.nextmoney) * 100 * 10) / 10);

const vipList = ref([]);

// 根据会员等级获取标题
const getTitleByLevel = (level: string) => {
  const titleMap: Record<string, string> = {
    'Regular Member': 'Esteemed VIP Member',
    'Gold Member': 'Honorable Gold Member',
    'Diamond Member': 'Distinguished Diamond Member',
    'Supreme Black Card': 'Supreme Black Card Member'
  };
  return titleMap[level] || 'VIP Membership Area';
};

// 获取卡片样式类
const getCardClass = (level: string) => {
  const classMap: Record<string, string> = {
    '黄金会员': 'premium',
    '钻石会员': 'diamond',
    '至尊黑卡': 'supreme'
  };
  return classMap[level] || '';
};

// 格式化数字
const formatNumber = (num: number) => {
  return num.toLocaleString('en-US');
};

// 加载交易员条款数据
const loadTraderTerms = async () => {
  try {
    const response = await gettrader_profiles();
   
    if (response.success && response.data) {
      // 获取第一个交易员档案的terms数据
      const traderProfile = response.data.trader_profiles;
      // 保存完整的交易员档案数据
      traderProfiles.value = traderProfile;
      
      if (traderProfile.terms) {
        // 将terms字符串按行分割成数组
        traderTerms.value = traderProfile.terms.split('\n').filter(term => term.trim() !== '');
      }
    }
  } catch (error) {
    console.error('加载交易员条款失败:', error);
  }
};

// 处理登录按钮点击
const handleLoginButtonClick = () => {
  if (isLoggedIn.value) {
    handleLogout();
  } else {
     router.push('/userlogin');
    // // 显示登录模态框
    // const loginModal = new (window as any).bootstrap.Modal(document.getElementById('loginModal'));
    // loginModal.show();
  }
};

// 处理登录表单提交
const handleLogin = async () => {
  if (!loginUsername.value.trim() || !loginPassword.value.trim()) {
    alert('Please enter username and password');
    return;
  }
  
  try {
    // 模拟登录成功
    isLoggedIn.value = true;
    username.value = loginUsername.value;
    
    // 关闭模态框
    const loginModal = new (window as any).bootstrap.Modal(document.getElementById('loginModal'));
    loginModal.hide();
    
    // 清空表单
    loginUsername.value = '';
    loginPassword.value = '';
    
    alert('Login successful!');
    // 更新UI
    updateUIForLoggedInUser();
  } catch (error) {
    console.error('登录错误:', error);
    alert('Login failed, please try again');
  }
};

// 处理登出
const handleLogout = async () => {
  try {
    // 模拟登出成功
    isLoggedIn.value = false;
    username.value = '';
    alert('Logout successful!');
    // 刷新页面
    window.location.reload();
  } catch (error) {
    console.error('登出错误:', error);
    alert('Logout failed, please try again');
  }
};

// 处理进度卡片点击
const handleProgressCardClick = () => {
  if (isLoggedIn.value) {
      if(userStore.userInfo.signing)
      {
        router.push('/vipdashboard');
      }
      else
      {
         const modalElement = document.getElementById('membershipAgreementModal');
       const modal = Modal.getInstance(modalElement) || new Modal(modalElement);
      modal.show();
      }
  } else {
    alert('Please login first');
    const loginModal = new (window as any).bootstrap.Modal(document.getElementById('loginModal'));
    loginModal.show();
  }
};
// 初始化
onMounted(() => {
  // 模拟检查登录状态
  // 实际项目中应该通过API检查登录状态
  get_info()
 
});
const get_info=async()=>{
  if(userStore.token){
    await getUserInfo()
  }
  await get_membership_levels_list()
   get_current_level()
   fetchQuizQuestions()
   loadTraderTerms()
}
const getUserInfo=async()=>{
  try{
  const res=await get_userinfo()
  if(res.success)
  {
    userinfo.value=res.data
    username.value=res.data.username
    isLoggedIn.value=true
    dynamicTotalAsset.value = userinfo.value.initial_asset+userinfo.value.utotle_profit;
    nowLevelInfo.value.nextmoney=1000000
    progress.value = Math.round((dynamicTotalAsset.value / nowLevelInfo.value.nextmoney) * 100 * 10) / 10;
  }
}
catch(err){
  console.log(err)
}
 
  
}
const get_membership_levels_list=async()=>{
  const res=await get_membership_levels()
  if(res.success)
  {
    vipList.value=res.data
    vipList.value.forEach(item => {
      item.benefits=item.benefits.split(',')
    });
     userStore.vipList=vipList.value
  }
}
const get_current_level=async()=>{
  vipList.value.forEach(item => {
    if(item.min_trading_volume<=dynamicTotalAsset.value)
    {
      nowLevelInfo.value.current_level=item.level
      nowLevelInfo.value.currlevelname=item.name
    }
  });

  vipList.value.forEach(item => {
    if(nowLevelInfo.value.next_level==-1 && item.level>nowLevelInfo.value.current_level)
    {
      nowLevelInfo.value.next_level=item.level
      nowLevelInfo.value.nextmoney=item.min_trading_volume
      nowLevelInfo.value.nextname=item.name
    }
  });
  if(userStore.token){
  await updateUserLevel({levelname:nowLevelInfo.value.currlevelname})
  }

}

// Quiz Functionality
// Question data
const quizQuestions = ref([]);

// 响应式变量
const currentQuestionIndex = ref(0);
const selectedAnswer = ref<number | null>(null);
const showResult = ref(false);
const isAnswerCorrect = ref(false);
const quizCompleted = ref(false);
const score = ref(0);
const isLoading = ref(false);
const isFireworkActive = ref(false);
const answersHistory = ref<boolean[]>([]);
const showNotification = ref(false);
const notificationType = ref('success');
const notificationMessage = ref('');
let fireworkInterval: number | null = null;
const startQuestion=ref(false)
// Function to fetch quiz questions from API
const fetchQuizQuestions = async () => {
  try {
    startQuestion.value=false;
    isLoading.value = true;
    const response = await get_random_questions();
    if (response.success && response.data && response.data.length > 0) {
      // Format the questions to match the expected structure
      quizQuestions.value = response.data;
    } else {
      // Fallback to default questions if API fails
      console.warn('Failed to fetch questions from API, using default questions');
      quizQuestions.value = [
       
      ];
    }
  } catch (error) {
    console.error('Error fetching quiz questions:', error);
    // Set default questions in case of error
    quizQuestions.value = [
     
    ];
  } finally {
    isLoading.value = false;
  }
};

// 获取当前题目
const currentQuestion = computed(() => {
  console.log(quizQuestions.value)
  return quizQuestions.value[currentQuestionIndex.value];
});

// 处理选择答案
const handleSelectAnswer = (index: number) => {
  if (selectedAnswer.value !== null || showResult.value) return;
  
  selectedAnswer.value = index;
  isAnswerCorrect.value = index === currentQuestion.value.correctAnswer;
  
  // 记录答题历史
  answersHistory.value[currentQuestionIndex.value] = isAnswerCorrect.value;
  
  // 如果回答正确，增加分数
  if (isAnswerCorrect.value) {
    score.value++;
  }
  console.log(startQuestion.value)
  //todo 处理用户扣分
    if(!startQuestion.value){
    startquestions({stype:'start'}).then(res=>{
      if(res.success)
      {
      
      }
    })
  }
  startQuestion.value=true;

  //判断是否以及答题完成 完成后进行加分
  if(currentQuestionIndex.value==quizQuestions.value.length-1)
  {
    //todo 处理用户加分
    if(score.value/quizQuestions.value.length>=0.6)
    {
      startquestions({stype:'end'}).then(res=>{
      if(res.success)
      {
      
      }
      })
    }
  }
  // 显示通知
  showAnswerNotification();
  
  // 显示结果
  setTimeout(() => {
    showResult.value = true;
    
   
  }, 300);
};

// 显示答题通知
const showAnswerNotification = () => {
  if (isAnswerCorrect.value) {
    notificationType.value = 'success';
    const successMessages = [
      '🎉 Correct! +1 Point',
      '✨ Great! Keep it up!',
      '🏆 Perfect! Well done!',
      '💰 Excellent! You\'re learning!',
      '🚀 Amazing! Next question!'
    ];
    notificationMessage.value = successMessages[Math.floor(Math.random() * successMessages.length)];
  } else {
    notificationType.value = 'error';
    const encouragementMessages = [
      '📚 Not quite! Keep learning!',
      '💪 Try again! You can do it!',
      '🎯 Close! Study more!',
      '📈 Learning opportunity!',
      '🌟 Keep practicing!'
    ];
    notificationMessage.value = encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)];
  }
  
  showNotification.value = true;
  setTimeout(() => {
    showNotification.value = false;
  }, 2500);
};

// 获取表现评级
const getPerformanceRating = () => {
  const percentage = (score.value / quizQuestions.value.length) * 100;
  if (percentage === 100) return 'Master';
  if (percentage >= 80) return 'Expert';
  if (percentage >= 60) return 'Advanced';
  if (percentage >= 40) return 'Intermediate';
  return 'Beginner';
};

// 播放悬停音效（模拟）
const playHoverSound = () => {
  // 这里可以添加实际的音效播放逻辑
  console.log('Hover sound effect');
};

// 播放点击音效（模拟）
const playClickSound = () => {
  // 这里可以添加实际的音效播放逻辑
  console.log('Click sound effect');
};

// 格式化货币显示
const formatCurrency = (amount) => {
  if (amount >= 1000000) {
    return (amount / 1000000).toFixed(1) + 'M';
  } else if (amount >= 1000) {
    return (amount / 1000).toFixed(1) + 'K';
  }
  return amount.toLocaleString();
};

// 进入下一题
const goToNextQuestion = () => {
  // 停止烟花效果
  isFireworkActive.value = false;
  if (fireworkInterval) {
    clearInterval(fireworkInterval);
    fireworkInterval = null;
  }
  
  // 清除烟花容器中的所有粒子
  const fireworkContainer = document.getElementById('firework-container');
  if (fireworkContainer) {
    while (fireworkContainer.firstChild) {
      fireworkContainer.removeChild(fireworkContainer.firstChild);
    }
  }
  
  showResult.value = false;
  selectedAnswer.value = null;
  currentQuestionIndex.value++;
  
  // 检查是否完成所有题目
  if (currentQuestionIndex.value >= quizQuestions.value.length) {
    quizCompleted.value = true;
  }
};

// 复制钱包地址
const copypaycode = () => {
  if (paycode.value) {
    navigator.clipboard.writeText(paycode.value).then(() => {
      showNotification.value = true;
      notificationType.value = 'success';
      notificationMessage.value = 'Paycode copied to clipboard!';
      setTimeout(() => {
        showNotification.value = false;
      }, 2000);
    }).catch(err => {
      showNotification.value = true;
      notificationType.value = 'error';
      notificationMessage.value = 'Failed to copy paycode!';
      setTimeout(() => {
        showNotification.value = false;
      }, 2000);
    });
  }
};

// 重新开始答题
const restartQuiz = () => {
  startQuestion.value=false;
  // 停止烟花效果
  isFireworkActive.value = false;
  if (fireworkInterval) {
    clearInterval(fireworkInterval);
    fireworkInterval = null;
  }
  
  // 清除烟花容器中的所有粒子
  const fireworkContainer = document.getElementById('firework-container');
  if (fireworkContainer) {
    while (fireworkContainer.firstChild) {
      fireworkContainer.removeChild(fireworkContainer.firstChild);
    }
  }
  
  // 重置所有状态
  fetchQuizQuestions();
  currentQuestionIndex.value = 0;
  selectedAnswer.value = null;
  showResult.value = false;
  isAnswerCorrect.value = false;
  quizCompleted.value = false;
  score.value = 0;
  answersHistory.value = [];
  showNotification.value = false;
  startQuestion.value=false;
};

// 创建烟花效果
const createFirework = () => {
 // 获取烟花容器
  let fireworkContainer = document.getElementById('firework-container');
  if (!fireworkContainer) {
    fireworkContainer = document.createElement('div');
    fireworkContainer.id = 'firework-container';
    fireworkContainer.className = 'firework-container';
    document.body.appendChild(fireworkContainer);
  }
  
  // 创建烟花粒子
  const particleCount = 180; // 增加粒子数量，提高粒度
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    
    // 随机颜色
    const colors = ['#ffd700', '#ffb300', '#ffe066', '#ffcc00', '#ffed4e'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    // 设置粒子样式
    particle.style.position = 'absolute';
    particle.style.width = `${Math.random() * 4 + 2}px`; // 增加粒子大小
    particle.style.height = `${Math.random() * 4 + 2}px`; // 增加粒子大小
    particle.style.backgroundColor = color;
    particle.style.borderRadius = '50%';
    particle.style.left = '50%';
    particle.style.top = '50%';
    particle.style.opacity = '1';
    particle.style.pointerEvents = 'none';
    particle.style.boxShadow = `0 0 15px ${color}, 0 0 30px ${color}40`; // 增加发光效果
    
    // 随机速度和角度
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 12 + 5; // 增加速度范围，使烟花更分散
    let vx = Math.cos(angle) * speed;
    let vy = Math.sin(angle) * speed;
    
    fireworkContainer.appendChild(particle);
    
    // 动画粒子
    let x = 0;
    let y = 0;
    let alpha = 1;
    const friction = 0.97;
    const gravity = 0.05;
    
    const animateParticle = () => {
      x += vx;
      y += vy;
      vy += gravity;
      vx *= friction;
      vy *= friction;
      alpha -= 0.02;
      
      particle.style.transform = `translate(${x}px, ${y}px)`;
      particle.style.opacity = alpha.toString();
      
      if (alpha > 0) {
        requestAnimationFrame(animateParticle);
      } else {
        if (particle.parentNode === fireworkContainer) {
          fireworkContainer.removeChild(particle);
        }
      }
    };
    
    animateParticle();
  }
  
  // 当烟花效果不活跃时才清理容器
  setTimeout(() => {
    if (!isFireworkActive.value && fireworkContainer && document.body.contains(fireworkContainer)) {
      // 移除所有子元素
      while (fireworkContainer.firstChild) {
        fireworkContainer.removeChild(fireworkContainer.firstChild);
      }
    }
  }, 5000);
};

</script>

<style scoped>
.app-container {
  min-height: 100vh;
  background: var(--bg-primary);
  color: var(--text-primary);
}

/* Hero */
.vip-hero-banner {
  position: relative;
  padding: 72px 40px 64px;
  background: var(--primary-gradient);
  overflow: hidden;
}

.vip-hero-banner::before {
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
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.hero-icon-large {
  width: 88px;
  height: 88px;
  margin: 0 auto 20px;
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
  fill: rgba(255, 255, 255, 0.9);
  stroke: white;
}

.hero-greeting {
  margin: 0 0 8px;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.85);
}

.hero-title {
  margin: 0 0 12px;
  font-size: 44px;
  font-weight: 900;
  color: white;
  letter-spacing: -0.5px;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.hero-description {
  margin: 0 0 24px;
  font-size: 17px;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
}

.hero-level-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 999px;
  background: rgba(255, 215, 0, 0.18);
  border: 1px solid rgba(255, 215, 0, 0.35);
  color: #fde68a;
  font-weight: 600;
  font-size: 0.9rem;
}

.hero-level-badge i {
  color: #fbbf24;
}

/* Main content */
.vip-content-area {
  max-width: 1280px;
  margin: 0 auto;
  padding: 40px 24px 80px;
}

.progress-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.progress-section {
  margin-bottom: 32px;
}

.progress-card {
  padding: 24px;
  background: var(--bg-glass);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  transition: all var(--transition-base);
}

.progress-card.clickable {
  cursor: pointer;
}

.progress-card.clickable:hover {
  border-color: rgba(102, 126, 234, 0.45);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg), var(--shadow-glow);
}

.progress-card.unclickable {
  opacity: 0.75;
  cursor: not-allowed;
}

.current-level,
.next-milestone {
  text-align: center;
  padding: 8px;
}

.current-level i,
.next-milestone i {
  font-size: 1.5rem;
  margin-bottom: 8px;
  color: #fbbf24;
  display: block;
}

.level-label {
  margin: 0 0 6px;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.level-name {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
}

.progress {
  height: 12px !important;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 999px;
  overflow: hidden;
  margin: 8px 0;
}

.progress-bar {
  background: var(--primary-gradient);
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
}

.progress-percent {
  font-size: 0.65rem;
  font-weight: 700;
  color: white;
}

.progress-labels {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-top: 10px;
}

.next-level-text {
  color: var(--color-primary);
  font-weight: 600;
}

/* Membership cards */
.membership-cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.membership-card-wrapper {
  min-width: 0;
}

.membership-card {
  background: var(--bg-glass);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  padding: 28px 22px;
  height: 100%;
  position: relative;
  transition: all var(--transition-base);
  box-shadow: var(--shadow-md);
}

.membership-card:hover {
  transform: translateY(-4px);
  border-color: rgba(102, 126, 234, 0.35);
  box-shadow: var(--shadow-lg);
}

.membership-card.premium {
  border-color: rgba(251, 191, 36, 0.25);
}

.membership-card.diamond {
  border-color: rgba(165, 180, 252, 0.25);
}

.membership-card.supreme {
  background: linear-gradient(145deg, rgba(10, 14, 39, 0.95) 0%, rgba(26, 31, 58, 0.95) 100%);
  border-color: rgba(255, 215, 0, 0.2);
}

.vip-badge {
  position: absolute;
  top: 14px;
  right: 14px;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 700;
  background: rgba(102, 126, 234, 0.2);
  border: 1px solid rgba(102, 126, 234, 0.35);
  color: #a5b4fc;
}

.card-icon {
  font-size: 2rem;
  color: #fbbf24;
  margin-bottom: 16px;
  display: block;
}

.membership-card h3,
.h3Height {
  font-size: 1.35rem;
  margin-bottom: 12px;
  color: var(--text-primary);
  font-weight: 700;
}

.card-requirement {
  color: #fbbf24;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 12px 0 16px;
  padding: 12px 0;
  border-top: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 0 0 16px;
  text-align: left;
}

.feature-list li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 10px;
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.45;
}

.feature-list li i {
  color: var(--color-success);
  flex-shrink: 0;
  margin-top: 2px;
}

.upgrade-info {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid var(--border-color);
}

.vip-price {
  margin-bottom: 16px;
  padding: 14px;
  background: rgba(102, 126, 234, 0.08);
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: var(--border-radius);
  text-align: center;
}

.price-value {
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--text-primary);
}

.price-currency {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin-left: 4px;
}

.btn-purchase {
  width: 100%;
  padding: 12px 20px;
  border: none;
  border-radius: var(--border-radius);
  background: var(--primary-gradient);
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-base);
  box-shadow: var(--shadow-glow);
}

.btn-purchase:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(102, 126, 234, 0.45);
}

.btn-community-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 28px;
  border: none;
  border-radius: var(--border-radius);
  background: var(--primary-gradient);
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-base);
  box-shadow: var(--shadow-glow);
}

.btn-community-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(102, 126, 234, 0.45);
}

.btn-community-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.btn-secondary {
  padding: 12px 24px;
  border-radius: var(--border-radius);
  border: 1px solid var(--border-color);
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-secondary);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-base);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
}

.text-gold {
  color: #fbbf24 !important;
}

/* Modals */
.modal-content {
  background: rgba(26, 31, 58, 0.96);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  color: var(--text-primary);
}

.modal-header {
  border-bottom: 1px solid var(--border-color);
  padding: 20px 24px;
}

.modal-title {
  color: var(--text-primary);
  font-weight: 700;
}

.modal-body {
  padding: 24px;
}

.modal-footer {
  border-top: 1px solid var(--border-color);
  padding: 16px 24px;
}

.modal-header .btn-close {
  filter: invert(1);
  opacity: 0.7;
}

.form-control {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  border-radius: var(--border-radius-sm);
  padding: 12px 14px;
}

.form-control:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
  background: rgba(102, 126, 234, 0.06);
  color: var(--text-primary);
}

.form-label {
  color: var(--text-secondary);
  font-size: 0.85rem;
  font-weight: 600;
}

.btn-submit {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: var(--border-radius);
  background: var(--primary-gradient);
  color: white;
  font-weight: 600;
}

.payment-qr-code {
  max-width: 220px;
  width: 100%;
  border-radius: var(--border-radius-sm);
}

.preview-image {
  max-width: 100%;
  max-height: 280px;
  border-radius: var(--border-radius-sm);
}

.proof-preview {
  position: relative;
  display: inline-block;
}

.btn-remove-preview {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: rgba(239, 68, 68, 0.9);
  color: white;
  cursor: pointer;
}

.payment-proof-input {
  display: none;
}

.btn-upload {
  width: 100%;
  padding: 24px;
  border: 2px dashed rgba(102, 126, 234, 0.35);
  border-radius: var(--border-radius);
  background: rgba(102, 126, 234, 0.06);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-base);
}

.btn-upload:hover {
  border-color: var(--color-primary);
  background: rgba(102, 126, 234, 0.12);
}

.agreement-content {
  max-height: 70vh;
  overflow-y: auto;
}

.agreement-main-title {
  font-size: 1.5rem;
  font-weight: 800;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 12px;
}

.agreement-description {
  color: var(--text-secondary);
  line-height: 1.7;
}

.agreement-table-section {
  margin: 24px 0;
}

.table-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.agreement-table-section .table {
  color: var(--text-secondary);
  border-color: var(--border-color);
}

.agreement-table-section .table thead th {
  background: rgba(102, 126, 234, 0.12);
  color: var(--text-primary);
  border-color: var(--border-color);
}

.agreement-terms h4 {
  color: var(--text-primary);
  margin-bottom: 12px;
}

.terms-list {
  list-style: none;
  padding: 0;
}

.terms-list li {
  margin-bottom: 10px;
  color: var(--text-secondary);
  line-height: 1.5;
}

.redirect-message {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(26, 31, 58, 0.95);
  padding: 14px 28px;
  border-radius: var(--border-radius);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  font-size: 0.95rem;
  z-index: 10000;
  box-shadow: var(--shadow-lg);
}

.redirect-message .text {
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

@media (max-width: 768px) {
  .vip-hero-banner {
    padding: 48px 20px 36px;
  }

  .hero-title {
    font-size: clamp(1.5rem, 6vw, 2rem);
  }

  .hero-description {
    font-size: 15px;
  }

  .vip-content-area {
    padding: 24px 16px 48px;
  }

  .progress-card {
    padding: 18px 14px;
  }

  .progress-card .row {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }

  .progress-labels {
    flex-wrap: wrap;
    gap: 8px;
    font-size: 0.8125rem;
  }

  .next-level-text {
    font-size: 0.75rem;
  }

  .membership-cards-container {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .membership-card {
    padding: 20px 16px;
  }

  .btn-community-primary {
    width: 100%;
    min-height: 48px;
  }

  .btn-purchase {
    width: 100%;
    min-height: 48px;
  }

  .modal-body {
    padding: 16px;
  }

  .modal-footer {
    flex-wrap: wrap;
    gap: 10px;
  }
}

@media (max-width: 480px) {
  .vip-hero-banner {
    padding: 40px 16px 28px;
  }

  .vip-content-area {
    padding: 20px 12px 40px;
  }

  .progress-card {
    padding: 14px 12px;
  }

  .membership-card {
    padding: 16px 14px;
  }

  .price-value {
    font-size: 1.5rem;
  }

  .feature-list li {
    font-size: 0.875rem;
  }
}


/* Quiz Section */
.trading-quiz-arena {
  max-width: 900px;
  margin: 48px auto 80px;
  padding: 0 24px;
}

.quiz-container-interactive {
  background: var(--bg-glass);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  padding: 32px;
  box-shadow: var(--shadow-lg);
}

.quiz-dashboard {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
  padding-bottom: 24px;
  margin-bottom: 28px;
  border-bottom: 1px solid var(--border-color);
}

.quiz-branding {
  display: flex;
  align-items: center;
  gap: 16px;
  min-width: 0;
}

.brand-icon-wrap {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: var(--primary-gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
  box-shadow: var(--shadow-glow);
}

.brand-icon-wrap svg {
  width: 26px;
  height: 26px;
}

.brand-text h2 {
  margin: 0 0 4px;
  font-size: 1.25rem;
  font-weight: 700;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.brand-text p {
  margin: 0;
  font-size: 0.875rem;
  color: var(--text-muted);
}

.quiz-stats-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.quiz-stat {
  min-width: 88px;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  text-align: center;
}

.quiz-stat-value {
  display: block;
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1.2;
}

.quiz-stat-value.score {
  color: var(--color-success);
}

.quiz-stat-value.accent {
  color: var(--color-primary);
}

.quiz-stat-divider {
  margin: 0 2px;
  color: var(--text-muted);
  font-weight: 600;
}

.quiz-stat-label {
  display: block;
  margin-top: 4px;
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.question-meta {
  margin-bottom: 16px;
}

.question-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(102, 126, 234, 0.12);
  border: 1px solid rgba(102, 126, 234, 0.24);
  color: var(--color-primary);
  font-size: 0.8rem;
  font-weight: 600;
}

.question-badge svg {
  width: 14px;
  height: 14px;
}

.question-card {
  padding: 24px;
  margin-bottom: 24px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  border-left: 4px solid var(--color-primary);
}

.main-question {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.6;
}

.answer-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.answer-option {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  padding: 16px 18px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: all var(--transition-base);
  text-align: left;
}

.answer-option:hover:not(.revealed) {
  border-color: rgba(102, 126, 234, 0.4);
  background: rgba(102, 126, 234, 0.08);
  transform: translateX(4px);
}

.option-letter {
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: rgba(102, 126, 234, 0.15);
  border: 1px solid rgba(102, 126, 234, 0.25);
  color: var(--color-primary);
  font-weight: 800;
  font-size: 0.95rem;
}

.option-text {
  flex: 1;
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--text-primary);
  line-height: 1.45;
}

.option-status {
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-weight: 800;
  font-size: 0.85rem;
}

.option-status.correct {
  background: rgba(16, 185, 129, 0.2);
  color: var(--color-success);
}

.option-status.wrong {
  background: rgba(239, 68, 68, 0.2);
  color: var(--color-danger);
}

.answer-option.selected {
  border-color: var(--color-primary);
  background: rgba(102, 126, 234, 0.12);
}

.answer-option.selected .option-letter {
  background: var(--primary-gradient);
  color: white;
  border-color: transparent;
}

.answer-option.correct-answer {
  border-color: var(--color-success);
  background: rgba(16, 185, 129, 0.1);
}

.answer-option.correct-answer .option-letter {
  background: rgba(16, 185, 129, 0.25);
  color: var(--color-success);
  border-color: rgba(16, 185, 129, 0.35);
}

.answer-option.wrong-answer {
  border-color: var(--color-danger);
  background: rgba(239, 68, 68, 0.1);
}

.answer-option.wrong-answer .option-letter {
  background: rgba(239, 68, 68, 0.2);
  color: var(--color-danger);
  border-color: rgba(239, 68, 68, 0.35);
}

.next-question-zone {
  margin-top: 28px;
  text-align: center;
}

.next-question-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 28px;
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

.next-question-btn svg {
  width: 18px;
  height: 18px;
}

.next-question-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(102, 126, 234, 0.45);
}

.victory-screen {
  text-align: center;
  padding: 32px 16px 16px;
}

.victory-icon-wrap {
  width: 72px;
  height: 72px;
  margin: 0 auto 20px;
  border-radius: 20px;
  background: var(--primary-gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: var(--shadow-glow);
}

.victory-icon-wrap svg {
  width: 36px;
  height: 36px;
  fill: rgba(255, 255, 255, 0.9);
  stroke: white;
}

.victory-title {
  margin: 0 0 28px;
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--text-primary);
}

.final-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 24px;
}

.stat-card {
  padding: 18px 12px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
}

.stat-card .stat-value {
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 6px;
}

.stat-card .stat-label {
  font-size: 0.75rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

.victory-message {
  margin-bottom: 28px;
  padding: 16px 20px;
  background: rgba(102, 126, 234, 0.08);
  border: 1px solid rgba(102, 126, 234, 0.18);
  border-radius: var(--border-radius);
}

.victory-message p {
  margin: 0;
  color: var(--text-secondary);
  line-height: 1.6;
}

.victory-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.action-button {
  padding: 12px 24px;
  border-radius: var(--border-radius);
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all var(--transition-base);
  border: none;
}

.action-button.primary {
  background: var(--primary-gradient);
  color: white;
  box-shadow: var(--shadow-glow);
}

.action-button.primary:hover {
  transform: translateY(-2px);
}

.action-button.secondary {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
}

.action-button.secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
}

.floating-notification {
  position: fixed;
  top: 100px;
  right: 24px;
  z-index: 9999;
  animation: quizNotifyIn 0.35s ease;
}

@keyframes quizNotifyIn {
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
}

.notification-bubble {
  padding: 14px 18px;
  background: rgba(26, 31, 58, 0.96);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-lg);
  backdrop-filter: blur(12px);
}

.floating-notification.success .notification-bubble {
  border-color: rgba(16, 185, 129, 0.4);
}

.floating-notification.error .notification-bubble {
  border-color: rgba(239, 68, 68, 0.4);
}

.bubble-text {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
}

@media (max-width: 768px) {
  .trading-quiz-arena {
    padding: 0 16px;
    margin: 32px auto 48px;
  }

  .quiz-container-interactive {
    padding: 20px 16px;
  }

  .quiz-dashboard {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }

  .quiz-stats-row {
    justify-content: space-between;
    width: 100%;
  }

  .quiz-stat {
    flex: 1;
    min-width: 0;
    padding: 10px 8px;
  }

  .main-question {
    font-size: 1.05rem;
    line-height: 1.5;
  }

  .answer-option:hover:not(.revealed) {
    transform: none;
  }

  .answer-option {
    padding: 14px 12px;
    min-height: 48px;
  }

  .option-letter {
    width: 32px;
    height: 32px;
    font-size: 0.875rem;
  }

  .final-stats {
    grid-template-columns: 1fr;
  }

  .victory-actions {
    flex-direction: column;
  }

  .action-button {
    width: 100%;
    min-height: 48px;
  }
}

@media (max-width: 480px) {
  .trading-quiz-arena {
    padding: 0 12px;
    margin: 24px auto 40px;
  }

  .quiz-container-interactive {
    padding: 16px 12px;
    border-radius: var(--border-radius);
  }

  .brand-text h2 {
    font-size: 1.05rem;
  }

  .quiz-stat-value {
    font-size: 1rem;
  }

  .option-text {
    font-size: 0.875rem;
  }
}
</style>
