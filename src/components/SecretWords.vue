<template>
  <div id="statistics" class="p-6 relative">
    <!-- Sparkle overlay -->
    <canvas ref="sparkleCanvas" class="sparkle-canvas"></canvas>
    <!-- Metallic sheen overlay -->
    <canvas ref="sheenCanvas" class="sheen-canvas"></canvas>

    <!-- Tabs -->
    <div class="tabs">
      <button
        v-for="(tab, i) in tabs"
        :key="tab"
        class="tab-btn"
        :class="{ active: activeIndex === i }"
        @click="activeIndex = i"
      >
        {{ tab }}
      </button>
    </div>

    <!-- Clouds -->
    <div class="clouds" :class="{ grid: showAll }">
      <div
        v-for="(opt, i) in options"
        :key="i"
        class="content"
        v-show="showAll || activeIndex === i"
      >
        <!-- stable, warning-free array template ref -->
        <div class="chart" ref="chartEls"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, onBeforeUpdate, ref, watch, nextTick } from 'vue'
import * as echarts from 'echarts'
// @ts-ignore
import 'echarts-wordcloud'
import { getWords } from '@/db'

interface Word { text: string; weight: number; color?: string }
interface EData { name: string; value: number; textStyle?: { color?: string; shadowColor?: string; shadowBlur?: number } }

const tabs = ['Artwork 1', 'Artwork 2', 'Artwork 3', 'Artwork 4', 'Artwork 5']
const activeIndex = ref(0)
const showAll = ref(false)
const toggleShowAll = () => { showAll.value = !showAll.value }

const shapes: Array<'circle' | 'cardioid' | 'diamond' | 'triangle' | 'star'> = [
  'circle', 'cardioid', 'diamond', 'triangle', 'star'
]

const metallic = ['#fff4c2', '#ffe28a', '#ffd24a', '#f3c221', '#d1ad3d', '#a17a13', '#6b5210']

const artworks = ref<Word[][]>([[], [], [], [], []])
const options = ref<any[]>([])
const chartEls = ref<HTMLDivElement[]>([])           // <- array template ref target
const charts = ref<echarts.EChartsType[]>([])
const maskCanvas = document.createElement('canvas')
let maskCtx: CanvasRenderingContext2D | null = null

// Reset array template refs before each update so Vue repopulates them with current nodes
onBeforeUpdate(() => {
  chartEls.value = []
})

function setCanvasSize(cvs: HTMLCanvasElement) {
  const dpr = window.devicePixelRatio || 1
  const { clientWidth, clientHeight } = cvs
  cvs.width = Math.max(1, Math.floor(clientWidth * dpr))
  cvs.height = Math.max(1, Math.floor(clientHeight * dpr))
  const ctx = cvs.getContext('2d')
  if (ctx) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0) // draw in CSS pixels
  }
  return ctx
}

function computeWords(words: string[]): Word[] {
  const map = new Map<string, number>()
  for (const w of words) map.set(w, (map.get(w) || 0) + 1)
  const arr: Word[] = Array.from(map.entries()).map(([text, weight]) => ({ text, weight }))
  arr.sort((a, b) => b.weight - a.weight)
  const n = Math.max(1, arr.length - 1)
  arr.forEach((w, idx) => {
    const ci = Math.floor((idx / n) * (metallic.length - 1))
    w.color = metallic[ci]
  })
  return arr
}

async function rebuildMask() {
  const container = document.getElementById('statistics') as HTMLDivElement | null
  const sheenCvs = sheenCanvas.value
  if (!container || !sheenCvs) return

  // Match mask canvas to sheen canvas CSS size + DPR
  maskCanvas.style.width = `${sheenCvs.clientWidth}px`
  maskCanvas.style.height = `${sheenCvs.clientHeight}px`
  maskCtx = setCanvasSize(maskCanvas)

  if (!maskCtx) return
  maskCtx.clearRect(0, 0, sheenCvs.clientWidth, sheenCvs.clientHeight)

  const containerRect = container.getBoundingClientRect()

  // Draw visible charts into mask
  await Promise.all(
    charts.value.map(async (chart, i) => {
      const el = chartEls.value[i]
      if (!chart || !el) return

      const isVisible = showAll.value || activeIndex.value === i
      if (!isVisible) return

      const rect = el.getBoundingClientRect()
      const x = rect.left - containerRect.left
      const y = rect.top - containerRect.top
      const w = el.clientWidth
      const h = el.clientHeight

      const url = chart.getDataURL({ pixelRatio: 1, backgroundColor: 'rgba(0,0,0,0)' })
      await new Promise<void>((resolve) => {
        const img = new Image()
        img.onload = () => {
          maskCtx!.drawImage(img, x, y, w, h)
          resolve()
        }
        img.src = url
      })
    })
  )
}

function toEchartsData(w: Word[]): EData[] {
  return w.map((x) => ({
    name: x.text,
    value: x.weight,
    textStyle: {
      color: x.color || metallic[0],
      shadowColor: '#ffffff66',
      shadowBlur: 8,
    },
  }))
}

function buildOption(idx: number, data: EData[]) {
  return {
    backgroundColor: '#111',
    tooltip: { show: true },
    series: [
      {
        type: 'wordCloud',
        shape: shapes[idx],
        left: 'center',
        top: 'center',
        width: '95%',
        height: '95%',
        gridSize: 2,
        sizeRange: [18, 110],
        rotationRange: [-30, 30],
        rotationStep: 15,
        drawOutOfBound: true,
        keepAspect: false,
        layoutAnimation: true,
        textStyle: {
          fontFamily: 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Inter, Helvetica, Arial',
          fontWeight: 700,
          textBorderWidth: 1,
          textBorderColor: '#00000099',
          emphasis: {
            shadowBlur: 22,
            shadowColor: '#ffffffcc',
            textBorderWidth: 2,
            textBorderColor: '#000000cc',
          },
        },
        data,
      },
    ],
  }
}

function ensureCharts() {
  for (let i = 0; i < options.value.length; i++) {
    const el = chartEls.value[i]
    if (el && !charts.value[i]) {
      charts.value[i] = echarts.init(el)
    }
  }
}

function renderAll() {
  ensureCharts()
  for (let i = 0; i < options.value.length; i++) {
    if (charts.value[i] && options.value[i]) {
      charts.value[i].setOption(options.value[i])
      charts.value[i].resize()
    }
  }
  rebuildMask()
}

async function loadAll() {
  const names = ['artwork1', 'artwork2', 'artwork3', 'artwork4', 'artwork5']
  for (let i = 0; i < names.length; i++) {
    const res = await getWords(names[i])
    const raw: string[] = res?.words || []
    const computed = computeWords(raw)
    artworks.value[i] = computed
  }
  options.value = artworks.value.map((w, i) => buildOption(i, toEchartsData(w)))
  await nextTick() // allow DOM with refs to render
  renderAll()
}

// Sparkle animation
const sparkleCanvas = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null
let sparkles: any[] = []

function createSparkles(count = 60) {
  const canvas = sparkleCanvas.value
  if (!canvas) return
  const { width, height } = canvas
  sparkles = Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    r: Math.random() * 1.2 + 0.3,
    a: Math.random() * Math.PI * 2,
    speed: Math.random() * 0.02 + 0.005,
  }))
}

function animateSparkles() {
  const canvas = sparkleCanvas.value
  if (!canvas || !ctx) return
  const { width, height } = canvas
  ctx.clearRect(0, 0, width, height)
  ctx.globalCompositeOperation = 'lighter'
  for (const s of sparkles) {
    s.a += s.speed
    const brightness = 0.6 + 0.4 * Math.sin(s.a * 10)
    ctx.beginPath()
    const grad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 3)
    grad.addColorStop(0, `rgba(211,175,55,${brightness})`)
    grad.addColorStop(1, 'rgba(211,175,55,0)')
    ctx.fillStyle = grad
    ctx.arc(s.x, s.y, s.r * 3, 0, 2 * Math.PI)
    ctx.fill()
  }
  requestAnimationFrame(animateSparkles)
}

// Metallic sheen animation
const sheenCanvas = ref<HTMLCanvasElement | null>(null)
let sheenCtx: CanvasRenderingContext2D | null = null
let sheenOffset = 0

function animateSheen() {
  const canvas = sheenCanvas.value
  if (!canvas || !sheenCtx) return
  const { width, height } = canvas

  sheenCtx.setTransform(1, 0, 0, 1, 0, 0)
  sheenCtx.clearRect(0, 0, width, height)

  // moving sheens
  sheenCtx.globalCompositeOperation = 'source-over'
  sheenCtx.globalAlpha = 1

  sheenOffset += 0.3
  const x = (sheenOffset % (width + 400)) - 200

  const gradient = sheenCtx.createLinearGradient(x - 150, 0, x + 150, 0)
  gradient.addColorStop(0, 'rgba(255,255,255,0)')
  gradient.addColorStop(0.3, 'rgba(255,255,255,0)')
  gradient.addColorStop(0.5, 'rgba(255,244,194,0.15)')
  gradient.addColorStop(0.7, 'rgba(255,255,255,0)')
  gradient.addColorStop(1, 'rgba(255,255,255,0)')
  sheenCtx.fillStyle = gradient
  sheenCtx.fillRect(x - 150, 0, 300, height)

  const x2 = ((sheenOffset * 0.6) % (width + 300)) - 150
  const gradient2 = sheenCtx.createLinearGradient(x2 - 100, 0, x2 + 100, 0)
  gradient2.addColorStop(0, 'rgba(255,255,255,0)')
  gradient2.addColorStop(0.4, 'rgba(255,226,138,0.08)')
  gradient2.addColorStop(0.6, 'rgba(255,226,138,0.08)')
  gradient2.addColorStop(1, 'rgba(255,255,255,0)')
  sheenCtx.fillStyle = gradient2
  sheenCtx.fillRect(x2 - 100, 0, 200, height)

  // clip sheen to word shapes using mask
  if (maskCanvas && maskCtx) {
    sheenCtx.globalCompositeOperation = 'destination-in'
    sheenCtx.drawImage(maskCanvas, 0, 0)
  }

  requestAnimationFrame(animateSheen)
}

onMounted(async () => {
  await loadAll()

  const onResize = () => {
    renderAll()

    if (sparkleCanvas.value) setCanvasSize(sparkleCanvas.value)
    if (sheenCanvas.value) {
      sheenCtx = setCanvasSize(sheenCanvas.value)
    }

    rebuildMask()
  }

  window.addEventListener('resize', onResize)

  // Sparkles
  if (sparkleCanvas.value) {
    ctx = sparkleCanvas.value.getContext('2d')
    setCanvasSize(sparkleCanvas.value)
    createSparkles()
    animateSparkles()
  }

  // Sheen
  if (sheenCanvas.value) {
    sheenCtx = setCanvasSize(sheenCanvas.value)
    await rebuildMask()
    animateSheen()
  }
})

watch([activeIndex, showAll], async () => {
  await nextTick()
  renderAll()
  await rebuildMask()
})

onBeforeUnmount(() => {
  // dispose echarts instances
  charts.value.forEach((c) => { try { c?.dispose() } catch {} })
})
</script>

<style scoped>
#statistics {
  background-color: #000;
  color: #eee;
  border-radius: 20px;
  position: relative;
  overflow: hidden;
}

.sparkle-canvas {
  position: absolute;
  top: 55%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20%;
  height: 15%;
  pointer-events: none;
  z-index: 5;
  mix-blend-mode: screen;
}

.sheen-canvas {
  position: absolute;
  top: 55%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50%;
  height: 50%;
  pointer-events: none;
  z-index: 6;
  /* mix-blend-mode: screen; */
}

.tabs {
  display: flex;
  gap: 8px;
  align-items: center;
  background: #0b0b0b;
  padding: 12px;
  border-radius: 14px;
  margin-bottom: 12px;
  z-index: 10;
  position: relative;
}

.tab-btn {
  appearance: none;
  border: 0;
  padding: 10px 14px;
  border-radius: 12px;
  background: #1a1a1a;
  color: #bbb;
  cursor: pointer;
  transition: all 120ms ease;
  box-shadow: inset 0 0 0 1px #2a2a2a;
}
.tab-btn:hover { transform: translateY(-1px); color: #fff; }
.tab-btn.active { background: #2a2a2a; color: #ffd700; box-shadow: inset 0 0 0 1px #ffd70055; }

.clouds {
  display: block;
}
.clouds.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}

.content {
  display: block;
  height: 58vh;
  background: radial-gradient(1200px 600px at 10% -20%, #1b1b1b, #0f0f0f 60%, #0b0b0b 100%);
  margin: 20px auto;
  border-radius: 20px;
  width: 100%;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5), inset 0 1px 0 #2a2a2a;
  position: relative;
  overflow: hidden;
}

.chart {
  width: 100%;
  height: 100%;
  border-radius: 16px;
  box-shadow: inset 0 1px 0 #ffffff15, inset 0 -1px 0 #00000055;
}
</style>