<script setup lang="ts">
import { computed, onMounted, ref, toRaw, type Ref } from 'vue'
import type { Character } from './type'
import { ElDialog, ElMessageBox, ElTabs, ElTabPane, ElSelect, ElOption } from 'element-plus'
import { db } from '@/db'
import { useObservable } from '@vueuse/rxjs'
import { liveQuery } from 'dexie'
// 基础数据
const baseData = {
  lordEquipment: [
    { level: '良好', cost: 2.22 },
    { level: '良好(1星)', cost: 7.99 },
    { level: '稀有', cost: 18.35 },
    { level: '稀有(1星)', cost: 32.56 },
    { level: '稀有(2星)', cost: 49.66 },
    { level: '稀有(3星)', cost: 68.66 },
    { level: '史诗', cost: 91.46 },
    { level: '史诗(1星)', cost: 118.06 },
    { level: '史诗(2星)', cost: 142.88 },
    { level: '史诗(3星)', cost: 173.72 },
    { level: '史诗T1', cost: 210.95 },
    { level: '史诗T1(1星)', cost: 253.83 },
    { level: '史诗T1 (2星)', cost: 305.37 },
    { level: '史诗T1 (3星)', cost: 366.31 },
    { level: '传说', cost: 414.07 },
    { level: '传说(1星)', cost: 463.31 },
    { level: '传说(2星)', cost: 517.41 },
    { level: '传说(3星)', cost: 572.99 },
    { level: '传说T1', cost: 631.53 },
    { level: '传说T1(1星)', cost: 696.83 },
    { level: '传说T1(2星)', cost: 765.09 },
    { level: '传说T1 (3星)', cost: 837.05 },
    { level: '传说T2', cost: 912.71 },
    { level: '传说T2(1星)', cost: 1004.85 },
    { level: '传说T2(2星)', cost: 1102.59 },
    { level: '传说T2(3星)', cost: 1207.41 },
    { level: '神话', cost: 1353.93 },
    { level: '神话(1星)', cost: 1506.05 },
    { level: '神话(2星)', cost: 1663.77 },
    { level: '神话(3星)', cost: 1827.09 },
    { level: '神话T1', cost: 2019.13 },
    { level: '神话T1(1星)', cost: 2216.77 },
    { level: '神话T1 (2星)', cost: 2420.01 },
    { level: '神话T1(3星)', cost: 2628.85 },
    { level: '神话T2', cost: 2866.41 },
    { level: '神话T2(1星)', cost: 3109.57 },
    { level: '神话T2 (2星)', cost: 3358.33 },
    { level: '神话T2 (3星)', cost: 3612.69 },
    { level: '神话T3', cost: 3895.77 },
    { level: '神话T3(1星)', cost: 4185.93 },
    { level: '神话T3(2星)', cost: 4483.17 },
    { level: '神话T3(3星)', cost: 4789.39 },
    { level: '极光T4', cost: 5236.19 },
    { level: '极光T4（1星）', cost: 5718.39 },
    { level: '极光T4（2星）', cost: 6235.99 },
    { level: '极光T4（3星）', cost: 6788.99 },
  ],
  gems: [
    { level: 1, cost: 3.8 },
    { level: 2, cost: 24.7 },
    { level: 3, cost: 62.7 },
    { level: 4, cost: 131.1 },
    { level: 5, cost: 245.1 },
    { level: 6, cost: 404.7 },
    { level: 7, cost: 609.9 },
    { level: 8, cost: 837.9 },
    { level: 9, cost: 1103.9 },
    { level: 10, cost: 1423.1 },
    { level: 11, cost: 1795.5 },
    { level: 12, cost: 2390.9 },
    { level: 13, cost: 3190.3 },
    { level: 14, cost: 4220.3 },
    { level: 15, cost: 5590.3 },
    { level: 16, cost: 7406.3 },
  ],
  heroEquipment: [
    { level: '红0', cost: 425.14 },
    { level: '红19', cost: 730.51 },
    { level: '红20', cost: 1555.31 },
    { level: '红39', cost: 1990.6 },
    { level: '红40', cost: 3140.2 },
    { level: '红59', cost: 3680.18 },
    { level: '红60', cost: 5154.58 },
    { level: '红79', cost: 5859.86 },
    { level: '红80', cost: 8159.06 },
    { level: '红99', cost: 9084.74 },
    { level: '红100', cost: 11708.74 },
  ],
  mastery: [
    { level: 1, cost: 10 },
    { level: 2, cost: 30 },
    { level: 3, cost: 60 },
    { level: 4, cost: 100 },
    { level: 5, cost: 150 },
    { level: 6, cost: 210 },
    { level: 7, cost: 280 },
    { level: 8, cost: 360 },
    { level: 9, cost: 450 },
    { level: 10, cost: 550 },
    { level: 11, cost: 760 },
    { level: 12, cost: 1080 },
    { level: 13, cost: 1510 },
    { level: 14, cost: 2050 },
    { level: 15, cost: 2700 },
    { level: 16, cost: 3460 },
    { level: 17, cost: 4330 },
    { level: 18, cost: 5310 },
    { level: 19, cost: 6400 },
    { level: 20, cost: 7600 },
  ],
}

// 初始角色数据
// const initialCharacters = [
//   {
//     id: 1,
//     name: '48800',
//     commanderLevel: '陨石',
//     shieldLife: 1757.3,
//     arrowPenetration: 1609.9,
//     spearPenetration: 1430,
//     ticketCount: 20,
//     askingPrice: 50000,
//     t11Progress: 3,
//     fireCrystalProgress: 8,
//     targetCostPerformance: 0.78,
//     lordEquipment: [
//       { level: '神话T2', gem1: 11, gem2: 11, gem3: 11 },
//       { level: '神话T2', gem1: 11, gem2: 11, gem3: 11 },
//       { level: '极光T4', gem1: 16, gem2: 16, gem3: 16 },
//       { level: '神话T3', gem1: 14, gem2: 14, gem3: 14 },
//       { level: '神话T2 (3星)', gem1: 16, gem2: 13, gem3: 12 },
//       { level: '神话T2', gem1: 12, gem2: 12, gem3: 12 },
//     ],
//     heroEquipment: [
//       { level: '红100', mastery: 20 },
//       { level: '红100', mastery: 20 },
//       { level: '红100', mastery: 20 },
//       { level: '红100', mastery: 20 },
//       { level: '红100', mastery: 20 },
//       { level: '红100', mastery: 20 },
//       { level: '红100', mastery: 19 },
//       { level: '红100', mastery: 19 },
//       { level: '红100', mastery: 18 },
//       { level: '红100', mastery: 18 },
//       { level: '红100', mastery: 17 },
//       { level: '红100', mastery: 17 },
//     ],
//   },
//   {
//     id: 2,
//     name: '5w地球',
//     commanderLevel: '地球',
//     shieldLife: 1655.2,
//     arrowPenetration: 1523.9,
//     spearPenetration: 1454.9,
//     ticketCount: 5,
//     askingPrice: 35000,
//     t11Progress: 3,
//     fireCrystalProgress: 8,
//     targetCostPerformance: 0.8,
//     lordEquipment: [
//       { level: '神话T2', gem1: 13, gem2: 8, gem3: 8 },
//       { level: '神话T2', gem1: 8, gem2: 8, gem3: 8 },
//       { level: '极光T4', gem1: 16, gem2: 16, gem3: 14 },
//       { level: '神话T3', gem1: 12, gem2: 12, gem3: 12 },
//       { level: '神话T2 (3星)', gem1: 14, gem2: 14, gem3: 13 },
//       { level: '神话T2', gem1: 13, gem2: 13, gem3: 13 },
//     ],
//     heroEquipment: [
//       { level: '红100', mastery: 20 },
//       { level: '红100', mastery: 20 },
//       { level: '红100', mastery: 20 },
//       { level: '红100', mastery: 20 },
//       { level: '红100', mastery: 20 },
//       { level: '红100', mastery: 18 },
//       { level: '红100', mastery: 16 },
//       { level: '红100', mastery: 15 },
//       { level: '红100', mastery: 15 },
//       { level: '红100', mastery: 15 },
//       { level: '红100', mastery: 15 },
//       { level: '红100', mastery: 15 },
//       { level: '红39', mastery: 11 },
//       { level: '红39', mastery: 11 },
//       { level: '红39', mastery: 11 },
//       { level: '红39', mastery: 11 },
//       { level: '红39', mastery: 11 },
//       { level: '红19', mastery: 11 },
//       { level: '红19', mastery: 11 },
//       { level: '红19', mastery: 10 },
//     ],
//   },
// ]
const characters = useObservable<Character[]>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  liveQuery(async () => await db.character.toArray()) as any,
)
const currentCharacterId: Ref<Character['id']> = ref(characters?.value?.[0]?.id || 0)
const showAddCharacterModal = ref(false)
const newCharacter = ref({
  name: '',
  commanderLevel: 1,
  targetCostPerformance: 0.8,
})

const levelOptions = [
  {
    label: '陨石',
    value: 1,
  },
  {
    label: '地球',
    value: 2,
  },
]
const t11ProgressOptions = [
  {
    label: '3个',
    value: 3,
  },
  {
    label: '2个',
    value: 2,
  },
  {
    label: '1个',
    value: 1,
  },
]
const fireCrystalProgressOptions = [
  {
    label: '8',
    value: 3,
  },
  {
    label: '7',
    value: 2,
  },
  {
    label: '6',
    value: 1,
  },
  {
    label: '5',
    value: 0,
  },
]
// 计算当前选中的角色
const currentCharacter = computed(() => {
  console.log(characters.value)
  return (
    characters.value?.find((char) => char.id === currentCharacterId.value) ||
    ({
      id: -1,
      commanderLevel: 0,
      shieldLife: 0,
      arrowPenetration: 0,
      spearPenetration: 0,
      ticketCount: 0,
      askingPrice: 0,
      t11Progress: 0,
      fireCrystalProgress: 0,
      targetCostPerformance: 1,
      name: '',
      lordEquipment: [],
      heroEquipment: [],
    } as Character)
  )
})
// 保存角色数据
const saveCharacterData = async () => {
  // 在实际应用中，这里可以发送数据到服务器或保存到本地存储
  // db.

  // const res = await db.character.add(newCharacter)
  // console.log('🚀 ~ saveCharacterData ~ res:', currentCharacter)
  const data = {
    ...toRaw(currentCharacter.value),
    costs,
  }
  await db.character
    .where('id')
    .equals(currentCharacterId.value)
    .modify({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...(data as any),
    })
}

// 删除当前角色
const deleteCurrentCharacter = () => {
  if (characters.value && characters.value.length <= 1) {
    alert('至少需要保留一个角色')
    return
  }

  if (!confirm(`确定要删除角色 "${currentCharacter.value.name}" 吗？此操作无法撤销。`)) {
    return
  }
  db.character.delete(currentCharacterId.value)

  // const index = characters.value?.findIndex((char) => char.id === currentCharacterId.value) || -1
  // if (index > -1) {
  //   characters.value?.splice(index, 1)
  //   currentCharacterId.value = characters?.value?.[0]?.id || 0
  // }
}
// 初始化图表
onMounted(() => {})

// 获取领主装备成本
const getLordEquipmentCost = (level: string) => {
  const item = baseData.lordEquipment.find((item) => item.level === level)
  return item ? item.cost : 0
}
// 获取宝石成本
const getGemCost = (gems: number[]) => {
  let total = 0
  gems.forEach((gemLevel) => {
    const gem = baseData.gems.find((item) => item.level === gemLevel)
    total += gem ? gem.cost : 0
  })
  return total
}
// 获取英雄装备成本
const getHeroEquipmentCost = (level: string) => {
  const item = baseData.heroEquipment.find((item) => item.level === level)
  return item ? item.cost : 0
}
// 保存新角色
const saveNewCharacter = async () => {
  if (!newCharacter.value.name.trim()) {
    ElMessageBox.alert('请输入角色名称')
    return
  }

  // 检查角色名称是否已存在
  if (characters.value?.some((char) => char.name === newCharacter.value.name)) {
    ElMessageBox.alert('角色名称已存在，请使用不同的名称')
    return
  }

  // 创建新角色
  const _newCharacter = {
    id: Date.now().valueOf(),
    name: newCharacter.value.name,
    commanderLevel: newCharacter.value.commanderLevel,
    shieldLife: 0,
    arrowPenetration: 0,
    spearPenetration: 0,
    ticketCount: 0,
    askingPrice: 0,
    t11Progress: 0,
    fireCrystalProgress: 0,
    targetCostPerformance: newCharacter.value.targetCostPerformance,
    lordEquipment: [],
    heroEquipment: [],
  }

  characters.value?.push(_newCharacter)
  currentCharacterId.value = _newCharacter.id
  await db.character.add(_newCharacter)

  // 重置表单并关闭模态框

  newCharacter.value = {
    name: '',
    commanderLevel: 1,
    targetCostPerformance: 0.8,
  }
  console.log('🚀 ~ saveNewCharacter ~ newCharacter:', newCharacter)
  showAddCharacterModal.value = false
}

// // 获取专精成本
// const getMasteryCost = (level: number) => {
//   const item = baseData.mastery.find((item) => item.level === level)
//   return item ? item.cost : 0
// }

const getTicketCost = (ticketCount: number) => {
  if (!ticketCount || typeof ticketCount !== 'number' || ticketCount < 5) {
    return 5738
  }
  if (ticketCount === 5 || ticketCount < 10) {
    return 5090
  }
  if (ticketCount === 10 || ticketCount < 15) {
    return 4442
  }
  if (ticketCount === 15 || ticketCount < 20) {
    return 3794
  }
  if (ticketCount === 20 || ticketCount < 25) {
    return 3146
  }
  if (ticketCount === 25 || ticketCount < 30) {
    return 2498
  }
  if (ticketCount === 30 || ticketCount < 35) {
    return 1850
  }
  if (ticketCount === 35 || ticketCount < 40) {
    return 1202
  }
  if (ticketCount === 40 || ticketCount < 44) {
    return 554
  }
  if (ticketCount === 44 || ticketCount < 47) {
    return 226
  }
  if (ticketCount === 47 || ticketCount < 49) {
    return 98
  }
  if (ticketCount === 49 || ticketCount < 50) {
    return 30
  }
  return 0
}

// 计算各项成本
const costs = computed(() => {
  // 计算领主装备总成本
  let lordEquipmentCost = 0
  let gemCost = 0
  currentCharacter.value.lordEquipment.forEach((item) => {
    const equipmentCost = getLordEquipmentCost(item.level)
    const gemItemCost = getGemCost([item.gem1, item.gem2, item.gem3])
    lordEquipmentCost += equipmentCost
    gemCost += gemItemCost
  })

  // 计算英雄装备总成本
  let heroEquipmentCost = 0
  currentCharacter.value.heroEquipment.forEach((item) => {
    heroEquipmentCost += getHeroEquipmentCost(item.level)
  })

  // 计算机票成本（简化计算）
  const ticketCost = getTicketCost(currentCharacter.value.ticketCount)

  // 计算合计成本（根据Excel公式）
  const t11UnitValue = 2000
  const totalCost =
    lordEquipmentCost +
    heroEquipmentCost +
    gemCost +
    (currentCharacter.value.t11Progress ? t11UnitValue * currentCharacter.value.t11Progress : 0)

  // 计算总成本
  const overallCost = ticketCost + currentCharacter.value.askingPrice

  // 计算性价比
  const costPerformance = overallCost > 0 ? totalCost / 10 / overallCost : 0

  // 计算目标性价比价格
  const targetCostPerformancePrice =
    currentCharacter.value.targetCostPerformance > 0
      ? (totalCost + ticketCost) / 10 / currentCharacter.value.targetCostPerformance
      : 0

  // 计算需要砍多少
  const priceReduction = currentCharacter.value.askingPrice - targetCostPerformancePrice

  return {
    lordEquipment: lordEquipmentCost,
    gem: gemCost,
    heroEquipment: heroEquipmentCost,
    ticket: ticketCost,
    total: totalCost,
    overall: overallCost,
    performance: costPerformance,
    targetPrice: targetCostPerformancePrice,
    priceReduction: priceReduction,
  }
})
// 添加领主装备
const addLordEquipment = () => {
  if (currentCharacter.value.id === -1) {
    ElMessageBox.alert('请选择角色')
    return
  }
  // if ()
  currentCharacter.value.lordEquipment.push({
    level: '神话T2',
    gem1: 11,
    gem2: 11,
    gem3: 11,
  })
}
const addHeroEquipment = () => {
  if (currentCharacter.value.id === -1) {
    ElMessageBox.alert('请选择角色')
    return
  }
  currentCharacter.value.heroEquipment.push({
    level: '红100',
    mastery: 20,
  })
}
// 删除英雄装备
const removeHeroEquipment = (index: number) => {
  currentCharacter.value.heroEquipment.splice(index, 1)
}
// 删除领主装备
const removeLordEquipment = (index: number) => {
  currentCharacter.value.lordEquipment.splice(index, 1)
}
// 获取专精成本
const getMasteryCost = (level: number) => {
  const item = baseData.mastery.find((item) => item.level === level)
  return item ? item.cost : 0
}
const activeTab = ref('result')
// 监听成本变化，更新图表
// watch(
//   costs,
//   (newCosts) => {
//     if (costChart.value) {
//       // costChart.value.data.datasets[0].data = [
//       //   newCosts.lordEquipment,
//       //   newCosts.gem,
//       //   newCosts.heroEquipment,
//       //   newCosts.ticket,
//       // ]
//       // costChart.value.update()
//     }
//   },
//   { deep: true, immediate: true },
// )
// import TheWelcome from '../components/TheWelcome.vue'
</script>

<template>
  <div class="row">
    <!-- 角色选择与基础信息 -->
    <div class="col-md-4">
      <div class="card">
        <div class="card-header"><i class="fas fa-user me-2"></i>角色选择与基础信息</div>
        <div class="card-body">
          <div class="mb-3">
            <label for="characterSelect" class="form-label">选择角色</label>
            <div class="input-group">
              <el-select v-model="currentCharacterId" filterable placeholder="Select">
                <el-option
                  v-for="item in characters"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
              <!-- <select class="form-select" id="characterSelect" v-model="currentCharacterId">
                <option v-for="character in characters" :key="character.id" :value="character.id">
                  {{ character.name }}
                </option>
              </select> -->
              <button
                class="btn btn-primary add-btn"
                type="button"
                @click="showAddCharacterModal = true"
              >
                <i class="fas fa-plus me-1"></i>添加
              </button>
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label">统帅等级</label>
            <div class="input-group">
              <el-select
                v-model.number="currentCharacter.commanderLevel"
                filterable
                placeholder="Select"
                style="width: 240px"
              >
                <el-option
                  v-for="item in levelOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
          </div>

          <div class="row">
            <div class="col-md-6">
              <div class="mb-3">
                <label class="form-label">盾生</label>
                <input
                  type="number"
                  class="form-control"
                  v-model.number="currentCharacter.shieldLife"
                />
              </div>
            </div>
            <div class="col-md-6">
              <div class="mb-3">
                <label class="form-label">射穿</label>
                <input
                  type="number"
                  class="form-control"
                  v-model.number="currentCharacter.arrowPenetration"
                />
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-6">
              <div class="mb-3">
                <label class="form-label">矛穿</label>
                <input
                  type="number"
                  class="form-control"
                  v-model.number="currentCharacter.spearPenetration"
                />
              </div>
            </div>
            <div class="col-md-6">
              <div class="mb-3">
                <label class="form-label">机票数量</label>
                <input
                  type="number"
                  class="form-control"
                  v-model.number="currentCharacter.ticketCount"
                />
              </div>
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label">要价</label>
            <input
              type="number"
              class="form-control"
              v-model.number="currentCharacter.askingPrice"
            />
          </div>

          <div class="row">
            <div class="col-md-6">
              <div class="mb-3">
                <label class="form-label">T11进度</label>
                <el-select
                  v-model.number="currentCharacter.t11Progress"
                  filterable
                  placeholder="Select"
                >
                  <el-option
                    v-for="item in t11ProgressOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </div>
            </div>
            <div class="col-md-6">
              <div class="mb-3">
                <label class="form-label">火晶进度</label>
                <el-select
                  v-model.number="currentCharacter.fireCrystalProgress"
                  filterable
                  placeholder="Select"
                >
                  <el-option
                    v-for="item in fireCrystalProgressOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </div>
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label">目标性价比</label>
            <input
              type="number"
              class="form-control"
              v-model.number="currentCharacter.targetCostPerformance"
              step="0.01"
            />
          </div>

          <div class="d-grid gap-2">
            <button class="btn btn-primary" @click="saveCharacterData">
              <i class="fas fa-save me-1"></i>保存角色设置
            </button>
            <button
              class="btn btn-outline-danger"
              @click="deleteCurrentCharacter"
              :disabled="!characters || characters.length <= 1"
            >
              <i class="fas fa-trash me-1"></i>删除当前角色
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 成本与计算结果 -->
    <div class="col-md-8">
      <div class="card">
        <div class="card-header"><i class="fas fa-calculator me-2"></i>成本与计算结果</div>
        <div class="card-body">
          <el-tabs class="demo-tabs" v-model="activeTab">
            <el-tab-pane label="计算结果" name="result">
              <div class="row">
                <div class="col-md-3">
                  <div class="result-box">
                    <h6>领主装备成本</h6>
                    <h4>{{ costs.lordEquipment.toFixed(2) }}</h4>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="result-box">
                    <h6>宝石成本</h6>
                    <h4>{{ costs.gem.toFixed(2) }}</h4>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="result-box">
                    <h6>英雄装备成本</h6>
                    <h4>{{ costs.heroEquipment.toFixed(2) }}</h4>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="result-box">
                    <h6>机票成本</h6>
                    <h4>{{ costs.ticket.toFixed(2) }}</h4>
                  </div>
                </div>
              </div>

              <div class="row mt-3">
                <div class="col-md-4">
                  <div class="highlight">
                    <h6>合计成本</h6>
                    <h4>{{ costs.total.toFixed(2) }}</h4>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="highlight">
                    <h6>总成本</h6>
                    <h4>{{ costs.overall.toFixed(2) }}</h4>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="highlight">
                    <h6>性价比</h6>
                    <h4>{{ costs.performance.toFixed(4) }}</h4>
                  </div>
                </div>
              </div>

              <div class="row mt-3">
                <div class="col-md-6">
                  <div class="highlight">
                    <h6>目标性价比价格</h6>
                    <h4>{{ costs.targetPrice.toFixed(2) }}</h4>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="highlight">
                    <h6>需要砍价金额</h6>
                    <h4>{{ costs.priceReduction.toFixed(2) }}</h4>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="领主装备设置" name="lordEquipment">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h5 class="section-title"></h5>
                <button
                  class="btn btn-primary btn-sm"
                  :disabled="currentCharacter.lordEquipment.length > 5"
                  @click="addLordEquipment"
                >
                  <i class="fas fa-plus me-1"></i>添加装备
                </button>
              </div>
              <div class="table-responsive">
                <table class="table table-striped table-hover">
                  <thead>
                    <tr>
                      <th>装备等级</th>
                      <th>1号宝石</th>
                      <th>2号宝石</th>
                      <th>3号宝石</th>
                      <th>装备成本</th>
                      <th>宝石成本</th>
                      <th>合计</th>
                      <th>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(item, index) in currentCharacter.lordEquipment"
                      :key="index"
                      class="equipment-row"
                    >
                      <td>
                        <el-select
                          style="width: 110px"
                          v-model.number="item.level"
                          filterable
                          placeholder="Select"
                        >
                          <el-option
                            v-for="item in baseData.lordEquipment"
                            :key="item.level"
                            :label="item.level"
                            :value="item.level"
                          />
                        </el-select>
                      </td>
                      <td>
                        <el-select
                          style="width: 80px"
                          v-model.number="item.gem1"
                          filterable
                          placeholder="Select"
                        >
                          <el-option
                            v-for="item in baseData.gems"
                            :key="item.level"
                            :label="item.level"
                            :value="item.level"
                          />
                        </el-select>
                      </td>
                      <td>
                        <el-select
                          style="width: 80px"
                          v-model.number="item.gem2"
                          filterable
                          placeholder="Select"
                        >
                          <el-option
                            v-for="item in baseData.gems"
                            :key="item.level"
                            :label="item.level"
                            :value="item.level"
                          />
                        </el-select>
                      </td>
                      <td>
                        <el-select
                          style="width: 80px"
                          v-model.number="item.gem3"
                          filterable
                          placeholder="Select"
                        >
                          <el-option
                            v-for="item in baseData.gems"
                            :key="item.level"
                            :label="item.level"
                            :value="item.level"
                          />
                        </el-select>
                      </td>
                      <td>
                        {{ getLordEquipmentCost(item.level).toFixed(2) }}
                      </td>
                      <td>
                        {{ getGemCost([item.gem1, item.gem2, item.gem3]).toFixed(2) }}
                      </td>
                      <td>
                        {{
                          (
                            getLordEquipmentCost(item.level) +
                            getGemCost([item.gem1, item.gem2, item.gem3])
                          ).toFixed(2)
                        }}
                      </td>
                      <td>
                        <button class="btn btn-danger btn-sm" @click="removeLordEquipment(index)">
                          <i class="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </el-tab-pane>
            <el-tab-pane label="英雄装备设置" name="heroEquipment">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h5 class="section-title"></h5>
                <button class="btn btn-primary btn-sm" @click="addHeroEquipment">
                  <i class="fas fa-plus me-1"></i>添加装备
                </button>
              </div>
              <div class="table-responsive">
                <table class="table table-striped table-hover">
                  <thead>
                    <tr>
                      <th>装备等级</th>
                      <th>专精等级</th>
                      <th>装备成本</th>
                      <th>专精成本</th>
                      <th>合计</th>
                      <th>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(item, index) in currentCharacter.heroEquipment"
                      :key="index"
                      class="equipment-row"
                    >
                      <td>
                        <el-select
                          style="width: 100px"
                          v-model.number="item.level"
                          filterable
                          placeholder="Select"
                        >
                          <el-option
                            v-for="item in baseData.heroEquipment"
                            :key="item.level"
                            :label="item.level"
                            :value="item.level"
                          />
                        </el-select>
                        <!-- <select class="form-select form-select-sm" v-model="item.level">
                          <option
                            v-for="hero in baseData.heroEquipment"
                            :key="hero.level"
                            :value="hero.level"
                          >
                            {{ hero.level }}
                          </option>
                        </select> -->
                      </td>
                      <td>
                        <el-select
                          style="width: 80px"
                          v-model.number="item.mastery"
                          filterable
                          placeholder="Select"
                        >
                          <el-option
                            v-for="item in baseData.mastery"
                            :key="item.level"
                            :label="item.level"
                            :value="item.level"
                          />
                        </el-select>
                        <!-- <select class="form-select form-select-sm" v-model.number="item.mastery">
                          <option
                            v-for="mastery in baseData.mastery"
                            :key="mastery.level"
                            :value="mastery.level"
                          >
                            {{ mastery.level }}
                          </option>
                        </select> -->
                      </td>
                      <td>
                        {{ getHeroEquipmentCost(item.level).toFixed(2) }}
                      </td>
                      <td>
                        {{ getMasteryCost(item.mastery).toFixed(2) }}
                      </td>
                      <td>
                        {{
                          (getHeroEquipmentCost(item.level) + getMasteryCost(item.mastery)).toFixed(
                            2,
                          )
                        }}
                      </td>
                      <td>
                        <button class="btn btn-danger btn-sm" @click="removeHeroEquipment(index)">
                          <i class="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </el-tab-pane>
            <!-- <el-tab-pane label="Role" name="third">Role</el-tab-pane> -->
            <!-- <el-tab-pane label="Task" name="fourth">Task</el-tab-pane> -->
          </el-tabs>
        </div>
      </div>
    </div>
    <div class="col-md-8">
      <div class="card">
        <el-table :data="characters" border style="width: 100%">
          <el-table-column prop="date" label="Date" width="180" />
          <el-table-column prop="name" label="Name" width="180" />
          <el-table-column prop="address" label="Address" />
        </el-table>
      </div>
    </div>
    <el-dialog v-model="showAddCharacterModal" on title="添加新角色">
      <div class="modal-body">
        <form id="addCharacterForm">
          <div class="mb-3">
            <label for="newCharacterName" class="form-label">角色名称</label>
            <input
              type="text"
              class="form-control"
              id="newCharacterName"
              v-model="newCharacter.name"
              required
            />
          </div>
          <div class="mb-3">
            <label for="newCommanderLevel" class="form-label">统帅等级</label>
            <select class="form-select" id="characterSelect" v-model="newCharacter.commanderLevel">
              <option v-for="level in levelOptions" :key="level.value" :value="level.value">
                {{ level.label }}
              </option>
            </select>
          </div>
          <div class="mb-3">
            <label for="newTargetCostPerformance" class="form-label">目标性价比</label>
            <input
              type="number"
              step="0.01"
              class="form-control"
              id="newTargetCostPerformance"
              v-model.number="newCharacter.targetCostPerformance"
            />
          </div>
        </form>
      </div>
      <template #footer>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
            @click="showAddCharacterModal = false"
          >
            取消
          </button>
          <button type="button" class="btn btn-primary ms-4" @click="saveNewCharacter">保存</button>
        </div>
      </template>
      <!-- <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
              @click="showAddCharacterModal = false"
            >
              取消
            </button>
            <button type="button" class="btn btn-primary" @click="saveNewCharacter">保存</button>
          </div>
        </div>
      </div> -->
    </el-dialog>
  </div>
</template>
