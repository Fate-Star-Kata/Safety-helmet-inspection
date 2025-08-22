<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Motion } from 'motion-v'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Camera,
  Warning,
  Refresh,
  Check,
  Plus,
  Delete
} from '@element-plus/icons-vue'

// 数据接口定义
interface DetectionSettings {
  confidence_threshold: number
  detection_interval: number
  image_quality: 'low' | 'medium' | 'high'
  save_detection_images: boolean
  max_detection_distance: number
  helmet_colors: string[]
  working_hours: {
    start: string
    end: string
  }
  weekend_detection: boolean
}

interface AlertRule {
  id: string
  name: string
  type: 'no_helmet' | 'improper_helmet' | 'multiple_violations'
  severity: 'low' | 'medium' | 'high' | 'critical'
  conditions: {
    min_confidence: number
    max_response_time: number
    repeat_count: number
  }
  actions: {
    email_notification: boolean
    sms_notification: boolean
    sound_alarm: boolean
    auto_record: boolean
  }
  enabled: boolean
}



// 动画配置
const pageVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: 'easeOut' }
}

const cardVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5, ease: 'easeOut' }
}

// 响应式数据
const loading = ref(false)
const activeTab = ref('detection')
const saving = ref(false)

// 检测设置
const detectionSettings = reactive<DetectionSettings>({
  confidence_threshold: 85,
  detection_interval: 2,
  image_quality: 'high',
  save_detection_images: true,
  max_detection_distance: 50,
  helmet_colors: ['#FF0000', '#FFFF00', '#0000FF', '#FFFFFF'],
  working_hours: {
    start: '08:00',
    end: '18:00'
  },
  weekend_detection: false
})

// 警告规则
const alertRules = ref<AlertRule[]>([
  {
    id: 'rule_001',
    name: '未佩戴安全帽-高危',
    type: 'no_helmet',
    severity: 'critical',
    conditions: {
      min_confidence: 90,
      max_response_time: 30,
      repeat_count: 1
    },
    actions: {
      email_notification: true,
      sms_notification: true,
      sound_alarm: true,
      auto_record: true
    },
    enabled: true
  },
  {
    id: 'rule_002',
    name: '佩戴不规范-中危',
    type: 'improper_helmet',
    severity: 'medium',
    conditions: {
      min_confidence: 80,
      max_response_time: 60,
      repeat_count: 2
    },
    actions: {
      email_notification: true,
      sms_notification: false,
      sound_alarm: false,
      auto_record: true
    },
    enabled: true
  }
])



// 选项数据
const imageQualityOptions = [
  { label: '低质量', value: 'low' },
  { label: '中等质量', value: 'medium' },
  { label: '高质量', value: 'high' }
]

const alertTypeOptions = [
  { label: '未佩戴安全帽', value: 'no_helmet' },
  { label: '佩戴不规范', value: 'improper_helmet' },
  { label: '多项违规', value: 'multiple_violations' }
]

const severityOptions = [
  { label: '低', value: 'low' },
  { label: '中', value: 'medium' },
  { label: '高', value: 'high' },
  { label: '严重', value: 'critical' }
]



// 新增规则表单
const newRuleForm = reactive<Partial<AlertRule>>({
  name: '',
  type: 'no_helmet',
  severity: 'medium',
  conditions: {
    min_confidence: 80,
    max_response_time: 60,
    repeat_count: 1
  },
  actions: {
    email_notification: true,
    sms_notification: false,
    sound_alarm: false,
    auto_record: true
  },
  enabled: true
})

const showAddRuleDialog = ref(false)

// 方法
const getSeverityColor = (severity: string) => {
  const colorMap: Record<string, string> = {
    low: 'info',
    medium: 'warning',
    high: 'danger',
    critical: 'danger'
  }
  return colorMap[severity] || 'info'
}

const getSeverityText = (severity: string) => {
  const textMap: Record<string, string> = {
    low: '低',
    medium: '中',
    high: '高',
    critical: '严重'
  }
  return textMap[severity] || severity
}

const getTypeText = (type: string) => {
  const textMap: Record<string, string> = {
    no_helmet: '未佩戴安全帽',
    improper_helmet: '佩戴不规范',
    multiple_violations: '多项违规'
  }
  return textMap[type] || type
}

const handleSaveSettings = async () => {
  saving.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1500))

    // 根据当前标签页保存对应设置
    switch (activeTab.value) {
      case 'detection':
        // 保存检测设置
        break
      case 'alerts':
        // 保存警告规则
        break
    }

    ElMessage.success('设置保存成功')
  } catch (error) {
    ElMessage.error('设置保存失败')
  } finally {
    saving.value = false
  }
}

const handleResetSettings = async () => {
  try {
    await ElMessageBox.confirm('确定要重置当前设置吗？此操作不可恢复。', '重置设置', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    // 重置设置到默认值
    ElMessage.success('设置已重置')
  } catch (error) {
    // 用户取消
  }
}



const handleAddRule = () => {
  showAddRuleDialog.value = true
}

const handleSaveRule = () => {
  if (!newRuleForm.name) {
    ElMessage.warning('请输入规则名称')
    return
  }

  const rule: AlertRule = {
    id: `rule_${Date.now()}`,
    name: newRuleForm.name!,
    type: newRuleForm.type!,
    severity: newRuleForm.severity!,
    conditions: { ...newRuleForm.conditions! },
    actions: { ...newRuleForm.actions! },
    enabled: newRuleForm.enabled!
  }

  alertRules.value.push(rule)
  showAddRuleDialog.value = false

  // 重置表单
  Object.assign(newRuleForm, {
    name: '',
    type: 'no_helmet',
    severity: 'medium',
    conditions: {
      min_confidence: 80,
      max_response_time: 60,
      repeat_count: 1
    },
    actions: {
      email_notification: true,
      sms_notification: false,
      sound_alarm: false,
      auto_record: true
    },
    enabled: true
  })

  ElMessage.success('规则添加成功')
}

const handleDeleteRule = async (rule: AlertRule) => {
  try {
    await ElMessageBox.confirm(`确定要删除规则"${rule.name}"吗？`, '删除规则', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const index = alertRules.value.findIndex(r => r.id === rule.id)
    if (index > -1) {
      alertRules.value.splice(index, 1)
      ElMessage.success('规则删除成功')
    }
  } catch (error) {
    // 用户取消
  }
}

const handleToggleRule = (rule: AlertRule) => {
  rule.enabled = !rule.enabled
  ElMessage.success(`规则已${rule.enabled ? '启用' : '禁用'}`)
}



// 生命周期
onMounted(() => {
  // 初始化数据
})
</script>

<template>
  <Motion :initial="pageVariants.initial" :animate="pageVariants.animate" :transition="pageVariants.transition as any"
    class="settings-page">
    <div class="settings-container">
      <!-- 页面头部 -->
      <Motion :initial="{ opacity: 0, y: -20 }" :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.5, delay: 0.1 }">
        <div class="page-header">
          <div class="header-left">
            <h2 class="page-title">系统设置</h2>
            <p class="page-subtitle">安全帽检测系统参数配置与管理</p>
          </div>
          <div class="header-right">
            <el-space>
              <Motion :whileHover="{ scale: 1.05 }" :whileTap="{ scale: 0.95 }">
                <el-button @click="handleResetSettings">
                  <el-icon>
                    <Refresh />
                  </el-icon>
                  重置设置
                </el-button>
              </Motion>
              <Motion :whileHover="{ scale: 1.05 }" :whileTap="{ scale: 0.95 }">
                <el-button type="primary" @click="handleSaveSettings" :loading="saving">
                  <el-icon>
                    <Check />
                  </el-icon>
                  保存设置
                </el-button>
              </Motion>
            </el-space>
          </div>
        </div>
      </Motion>

      <!-- 设置标签页 -->
      <Motion :initial="{ opacity: 0, y: 20 }" :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.6, delay: 0.2 }">
        <el-card class="settings-card" shadow="hover">
          <el-tabs v-model="activeTab" class="settings-tabs">
            <!-- 检测设置 -->
            <el-tab-pane label="检测设置" name="detection">
              <template #label>
                <span class="tab-label">
                  <el-icon>
                    <Camera />
                  </el-icon>
                  检测设置
                </span>
              </template>

              <Motion v-bind="cardVariants" :transition="{ ...cardVariants.transition, delay: 0.1 } as any">
                <div class="settings-section">
                  <h3 class="section-title">基础检测参数</h3>

                  <el-form :model="detectionSettings" label-width="140px" class="settings-form">
                    <el-row :gutter="24">
                      <el-col :xs="24" :sm="12" :md="8">
                        <el-form-item label="置信度阈值">
                          <el-slider v-model="detectionSettings.confidence_threshold" :min="50" :max="100" :step="5"
                            show-input :format-tooltip="(val: number) => `${val}%`" />
                        </el-form-item>
                      </el-col>

                      <el-col :xs="24" :sm="12" :md="8">
                        <el-form-item label="检测间隔">
                          <el-input-number v-model="detectionSettings.detection_interval" :min="1" :max="60" :step="1"
                            controls-position="right" />
                          <span class="input-suffix">秒</span>
                        </el-form-item>
                      </el-col>

                      <el-col :xs="24" :sm="12" :md="8">
                        <el-form-item label="图像质量">
                          <el-select v-model="detectionSettings.image_quality" placeholder="选择图像质量">
                            <el-option v-for="option in imageQualityOptions" :key="option.value" :label="option.label"
                              :value="option.value" />
                          </el-select>
                        </el-form-item>
                      </el-col>

                      <el-col :xs="24" :sm="12" :md="8">
                        <el-form-item label="最大检测距离">
                          <el-input-number v-model="detectionSettings.max_detection_distance" :min="10" :max="200"
                            :step="5" controls-position="right" />
                          <span class="input-suffix">米</span>
                        </el-form-item>
                      </el-col>

                      <el-col :xs="24" :sm="12" :md="8">
                        <el-form-item label="工作时间">
                          <el-time-picker v-model="detectionSettings.working_hours.start" placeholder="开始时间"
                            format="HH:mm" value-format="HH:mm" />
                          <span style="margin: 0 8px;">至</span>
                          <el-time-picker v-model="detectionSettings.working_hours.end" placeholder="结束时间"
                            format="HH:mm" value-format="HH:mm" />
                        </el-form-item>
                      </el-col>
                    </el-row>

                    <el-row :gutter="24">
                      <el-col :xs="24" :sm="12">
                        <el-form-item label="保存检测图像">
                          <el-switch v-model="detectionSettings.save_detection_images" />
                        </el-form-item>
                      </el-col>

                      <el-col :xs="24" :sm="12">
                        <el-form-item label="周末检测">
                          <el-switch v-model="detectionSettings.weekend_detection" />
                        </el-form-item>
                      </el-col>
                    </el-row>

                    <el-form-item label="安全帽颜色">
                      <div class="color-picker-group">
                        <el-color-picker v-for="(color, index) in detectionSettings.helmet_colors" :key="index"
                          v-model="detectionSettings.helmet_colors[index]" show-alpha
                          :predefine="['#FF0000', '#FFFF00', '#0000FF', '#FFFFFF', '#00FF00', '#FFA500']" />
                      </div>
                    </el-form-item>
                  </el-form>
                </div>
              </Motion>
            </el-tab-pane>

            <!-- 警告规则 -->
            <el-tab-pane label="警告规则" name="alerts">
              <template #label>
                <span class="tab-label">
                  <el-icon>
                    <Warning />
                  </el-icon>
                  警告规则
                </span>
              </template>

              <Motion v-bind="cardVariants" :transition="{ ...cardVariants.transition, delay: 0.1 } as any">
                <div class="settings-section">
                  <div class="section-header">
                    <h3 class="section-title">警告规则配置</h3>
                    <Motion :whileHover="{ scale: 1.05 }" :whileTap="{ scale: 0.95 }">
                      <el-button type="primary" @click="handleAddRule">
                        <el-icon>
                          <Plus />
                        </el-icon>
                        添加规则
                      </el-button>
                    </Motion>
                  </div>

                  <div class="rules-list">
                    <Motion v-for="(rule, index) in alertRules" :key="rule.id" :initial="{ opacity: 0, x: -20 }"
                      :animate="{ opacity: 1, x: 0 }" :transition="{ duration: 0.3, delay: index * 0.1 } as any">
                      <el-card class="rule-card" shadow="hover">
                        <div class="rule-header">
                          <div class="rule-info">
                            <h4 class="rule-name">{{ rule.name }}</h4>
                            <div class="rule-meta">
                              <el-tag :type="getSeverityColor(rule.severity)" size="small">
                                {{ getSeverityText(rule.severity) }}
                              </el-tag>
                              <el-tag type="info" size="small">{{ getTypeText(rule.type) }}</el-tag>
                            </div>
                          </div>
                          <div class="rule-actions">
                            <el-space>
                              <el-switch v-model="rule.enabled" @change="handleToggleRule(rule)" active-text="启用"
                                inactive-text="禁用" />
                              <Motion :whileHover="{ scale: 1.1 }" :whileTap="{ scale: 0.9 }">
                                <el-button type="danger" size="small" @click="handleDeleteRule(rule)">
                                  <el-icon>
                                    <Delete />
                                  </el-icon>
                                </el-button>
                              </Motion>
                            </el-space>
                          </div>
                        </div>

                        <div class="rule-details">
                          <el-row :gutter="16">
                            <el-col :xs="24" :sm="8">
                              <div class="detail-item">
                                <span class="detail-label">最低置信度:</span>
                                <span class="detail-value">{{ rule.conditions.min_confidence }}%</span>
                              </div>
                            </el-col>
                            <el-col :xs="24" :sm="8">
                              <div class="detail-item">
                                <span class="detail-label">响应时间:</span>
                                <span class="detail-value">{{ rule.conditions.max_response_time }}秒</span>
                              </div>
                            </el-col>
                            <el-col :xs="24" :sm="8">
                              <div class="detail-item">
                                <span class="detail-label">重复次数:</span>
                                <span class="detail-value">{{ rule.conditions.repeat_count }}次</span>
                              </div>
                            </el-col>
                          </el-row>

                          <div class="rule-actions-list">
                            <span class="actions-label">触发动作:</span>
                            <el-space wrap>
                              <el-tag v-if="rule.actions.email_notification" type="success" size="small">
                                邮件通知
                              </el-tag>
                              <el-tag v-if="rule.actions.sms_notification" type="warning" size="small">
                                短信通知
                              </el-tag>
                              <el-tag v-if="rule.actions.sound_alarm" type="danger" size="small">
                                声音报警
                              </el-tag>
                              <el-tag v-if="rule.actions.auto_record" type="info" size="small">
                                自动录制
                              </el-tag>
                            </el-space>
                          </div>
                        </div>
                      </el-card>
                    </Motion>
                  </div>
                </div>
              </Motion>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </Motion>
    </div>

    <!-- 添加规则对话框 -->
    <el-dialog v-model="showAddRuleDialog" title="添加警告规则" width="600px">
      <el-form :model="newRuleForm" label-width="120px">
        <el-form-item label="规则名称" required>
          <el-input v-model="newRuleForm.name" placeholder="请输入规则名称" />
        </el-form-item>

        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="警告类型">
              <el-select v-model="newRuleForm.type" placeholder="选择类型">
                <el-option v-for="type in alertTypeOptions" :key="type.value" :label="type.label" :value="type.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="严重程度">
              <el-select v-model="newRuleForm.severity" placeholder="选择严重程度">
                <el-option v-for="severity in severityOptions" :key="severity.value" :label="severity.label"
                  :value="severity.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="触发条件">
          <el-row :gutter="16">
            <el-col :span="8">
              <el-input-number v-model="newRuleForm.conditions!.min_confidence" :min="50" :max="100"
                controls-position="right" />
              <span class="input-suffix">% 置信度</span>
            </el-col>
            <el-col :span="8">
              <el-input-number v-model="newRuleForm.conditions!.max_response_time" :min="10" :max="300"
                controls-position="right" />
              <span class="input-suffix">秒 响应时间</span>
            </el-col>
            <el-col :span="8">
              <el-input-number v-model="newRuleForm.conditions!.repeat_count" :min="1" :max="10"
                controls-position="right" />
              <span class="input-suffix">次 重复</span>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item label="触发动作">
          <el-checkbox-group v-model="newRuleForm.actions">
            <el-checkbox label="email_notification">邮件通知</el-checkbox>
            <el-checkbox label="sms_notification">短信通知</el-checkbox>
            <el-checkbox label="sound_alarm">声音报警</el-checkbox>
            <el-checkbox label="auto_record">自动录制</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="启用规则">
          <el-switch v-model="newRuleForm.enabled" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-space>
          <el-button @click="showAddRuleDialog = false">取消</el-button>
          <el-button type="primary" @click="handleSaveRule">保存</el-button>
        </el-space>
      </template>
    </el-dialog>
  </Motion>
</template>

<style scoped>
.settings-page {
  width: 100%;
  min-height: 100vh;
}

.settings-container {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

/* 页面头部 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 20px 0;
}

.header-left .page-title {
  font-size: 28px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 8px 0;
}

.header-left .page-subtitle {
  font-size: 14px;
  color: #909399;
  margin: 0;
}

/* 设置卡片 */
.settings-card {
  border-radius: 12px;
  border: none;
}

.settings-tabs {
  --el-tabs-header-height: 60px;
}

.tab-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
}

/* 设置区域 */
.settings-section {
  padding: 24px 0;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 24px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid #f0f2f5;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.subsection {
  margin-bottom: 32px;
  padding: 20px;
  background: #fafbfc;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
}

.subsection-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 16px 0;
}

.settings-form {
  margin-top: 16px;
}

.input-suffix {
  margin-left: 8px;
  color: #909399;
  font-size: 12px;
}

.color-picker-group {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

/* 规则列表 */
.rules-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.rule-card {
  border-radius: 8px;
  border: 1px solid #e4e7ed;
  transition: all 0.3s ease;
}

.rule-card:hover {
  border-color: #409eff;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.15);
}

.rule-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.rule-info {
  flex: 1;
}

.rule-name {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 8px 0;
}

.rule-meta {
  display: flex;
  gap: 8px;
}

.rule-actions {
  display: flex;
  align-items: center;
}

.rule-details {
  padding-top: 16px;
  border-top: 1px solid #f0f2f5;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.detail-label {
  font-size: 12px;
  color: #909399;
}

.detail-value {
  font-size: 12px;
  font-weight: 500;
  color: #303133;
}

.rule-actions-list {
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.actions-label {
  font-size: 12px;
  color: #909399;
  margin-right: 8px;
}

/* 通知设置 */
.notification-section {
  margin-bottom: 32px;
  padding: 24px;
  background: #fafbfc;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
}

.notification-form {
  margin-top: 16px;
}

.recipients-list,
.phone-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.recipient-item,
.phone-item {
  display: flex;
  gap: 8px;
  align-items: center;
}

.recipient-item .el-input,
.phone-item .el-input {
  flex: 1;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .settings-container {
    padding: 16px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .rule-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .rule-actions {
    width: 100%;
    justify-content: space-between;
  }

  .color-picker-group {
    justify-content: center;
  }
}
</style>