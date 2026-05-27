<template>
  <lay-container :fluid="true" class="visit-map-page">
    <lay-row :space="10">
      <lay-col :md="6" :sm="12" :xs="24">
        <lay-card class="stat-card">
          <template #title>总访问次数</template>
          <div class="stat-value">{{ summary.totalVisits || 0 }}</div>
          <div class="stat-sub">最近 {{ selectedDays }} 天</div>
        </lay-card>
      </lay-col>
      <lay-col :md="6" :sm="12" :xs="24">
        <lay-card class="stat-card">
          <template #title>独立 IP</template>
          <div class="stat-value">{{ summary.uniqueIps || 0 }}</div>
          <div class="stat-sub">不同访客 IP</div>
        </lay-card>
      </lay-col>
      <lay-col :md="6" :sm="12" :xs="24">
        <lay-card class="stat-card">
          <template #title>覆盖国家</template>
          <div class="stat-value">{{ summary.uniqueCountries || 0 }}</div>
          <div class="stat-sub">有定位信息的国家</div>
        </lay-card>
      </lay-col>
      <lay-col :md="6" :sm="12" :xs="24">
        <lay-card class="stat-card">
          <template #title>访问城市</template>
          <div class="stat-value">{{ summary.cities?.length || 0 }}</div>
          <div class="stat-sub">地图上的城市点</div>
        </lay-card>
      </lay-col>
    </lay-row>

    <lay-card style="margin-top: 10px">
      <template #title>
        <div class="toolbar">
          <span>全球访问地图</span>
          <div class="toolbar-actions">
            <lay-select v-model="selectedDays" size="sm" style="width: 120px" @change="loadData">
              <lay-select-option :value="1" label="最近1天" />
              <lay-select-option :value="7" label="最近7天" />
              <lay-select-option :value="30" label="最近30天" />
              <lay-select-option :value="90" label="最近90天" />
            </lay-select>
            <lay-button size="sm" type="primary" @click="loadData">刷新</lay-button>
          </div>
        </div>
      </template>
      <div ref="mapChartRef" class="map-chart"></div>
    </lay-card>

    <lay-card style="margin-top: 10px">
      <template #title>最近访问记录</template>
      <lay-table
        :height="420"
        :columns="columns"
        :loading="loading"
        :data-source="tableData"
        :page="page"
        @change="handlePageChange"
      />
    </lay-card>
  </lay-container>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref, nextTick } from 'vue';
import { layer } from '@layui/layui-vue';
import * as echarts from 'echarts';
import {
  getPageVisits,
  getVisitMapSummary,
  type PageVisit,
  type VisitMapSummary,
} from '../../../api/module/pageVisits';

const loading = ref(false);
const selectedDays = ref(7);
const summary = ref<VisitMapSummary>({
  totalVisits: 0,
  uniqueIps: 0,
  uniqueCountries: 0,
  cities: [],
  recent: [],
});
const tableData = ref<PageVisit[]>([]);
const mapChartRef = ref<HTMLDivElement>();
let mapChart: echarts.ECharts | null = null;
let worldMapRegistered = false;

const page = reactive({ current: 1, limit: 10, total: 0 });

const columns = ref([
  { title: 'IP 地址', width: '140px', key: 'ip_address' },
  { title: '国家', width: '80px', key: 'country' },
  { title: '城市', width: '120px', key: 'city' },
  { title: '访问页面', width: '160px', key: 'path' },
  { title: '访问时间', width: '180px', key: 'visited_at' },
]);

const ensureWorldMap = async () => {
  if (worldMapRegistered) return;
  const response = await fetch('https://echarts.apache.org/examples/data/asset/geo/world.json');
  const worldJson = await response.json();
  echarts.registerMap('world', worldJson);
  worldMapRegistered = true;
};

const renderMap = async () => {
  await nextTick();
  if (!mapChartRef.value) return;
  await ensureWorldMap();

  if (!mapChart) {
    mapChart = echarts.init(mapChartRef.value);
  }

  const scatterData = (summary.value.cities || []).map((item) => ({
    name: `${item.city}, ${item.country}`,
    value: [item.longitude, item.latitude, item.count],
    city: item.city,
    country: item.country,
    count: item.count,
  }));

  mapChart.setOption({
    backgroundColor: '#0b1220',
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        const data = params.data || {};
        return [
          `<strong>${data.city || data.name || 'Unknown'}</strong>`,
          `国家/地区: ${data.country || '-'}`,
          `访问次数: ${data.count || data.value?.[2] || 0}`,
        ].join('<br/>');
      },
    },
    geo: {
      map: 'world',
      roam: true,
      zoom: 1.2,
      label: { show: false },
      itemStyle: {
        areaColor: '#1a2332',
        borderColor: '#334155',
      },
      emphasis: {
        itemStyle: { areaColor: '#243044' },
      },
    },
    series: [
      {
        name: '访问城市',
        type: 'scatter',
        coordinateSystem: 'geo',
        data: scatterData,
        symbolSize: (val: number[]) => Math.max(10, Math.min(36, (val[2] || 1) * 4)),
        itemStyle: {
          color: '#38bdf8',
          shadowBlur: 12,
          shadowColor: 'rgba(56, 189, 248, 0.45)',
        },
        emphasis: {
          itemStyle: { color: '#fbbf24' },
        },
      },
    ],
  });
};

const loadTable = async () => {
  const offset = (page.current - 1) * page.limit;
  const res = await getPageVisits({
    offset,
    limit: page.limit,
    days: selectedDays.value,
  });
  if (res.success) {
    tableData.value = res.data || [];
    page.total = res.total || 0;
  }
};

const loadData = async () => {
  loading.value = true;
  try {
    const res = await getVisitMapSummary(selectedDays.value);
    if (res.success) {
      summary.value = res.data;
      await renderMap();
      await loadTable();
    } else {
      layer.msg(res.message || '加载访问地图失败', { icon: 2 });
    }
  } catch (error) {
    console.error(error);
    layer.msg('加载访问地图失败', { icon: 2 });
  } finally {
    loading.value = false;
  }
};

const handlePageChange = ({ current }: { current: number }) => {
  page.current = current;
  loadTable();
};

const handleResize = () => {
  mapChart?.resize();
};

onMounted(async () => {
  await loadData();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  mapChart?.dispose();
  mapChart = null;
});
</script>

<style scoped>
.visit-map-page {
  padding-bottom: 16px;
}

.stat-card {
  min-height: 120px;
}

.stat-value {
  font-size: 34px;
  font-weight: 700;
  color: #111827;
  margin-top: 8px;
}

.stat-sub {
  margin-top: 8px;
  color: #6b7280;
  font-size: 13px;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.toolbar-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.map-chart {
  width: 100%;
  height: 520px;
  border-radius: 12px;
  overflow: hidden;
}
</style>
