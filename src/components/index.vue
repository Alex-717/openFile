
<template>
  <div class="container">
    <el-row style="height: 100%;"> 
      <el-col class="left-container" :span="6">
        <el-row v-if="isShowOpenBtn" style="padding-top: 20px;" justify="center" align="middle">
          <el-col :span="20">
            <el-button style="width: 100%;" type="primary" @click="showDir">打开文件夹</el-button>
          </el-col>
        </el-row>
        <el-tree
          v-else
          style="background: transparent;color: rgba(255, 255, 255, 0.7);font-size: 13px;"
          :data="dirData"
          :props="dirProps"
          @node-click="handleNodeClick"
        />
      </el-col>
      <el-col class="right-container" :span="18">
        <div class="code-wrap" v-if="codeHtml">
          <highlightjs autodetect :code="codeHtml" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isShowOpenBtn = ref(true)
const dirData = ref<Tree[]>([])
const codeHtml = ref('')
const dirProps = {
  children: 'children',
  label: 'label'
}

interface Tree {
  label: string
  value?: File,
  isFile: number,
  children?: Tree[]
}

async function showDir () {
  try {
    const handle = await (window as any).showDirectoryPicker()
    dirData.value = await getDir(handle)
    isShowOpenBtn.value = false
  } catch(err){}
}

async function getDir (handle: any) {
  const result: Tree[] = []
  for await (const value of handle.values()) {
    if (value.kind === 'file') {
      result.push({
        label: value.name,
        isFile: 1,
        value: await value.getFile()
      })
    } else {
      result.push({
        label: value.name,
        isFile: 0,
        children: await getDir(value)
      })      
    }
  }
  result.sort((a, b) => a.isFile - b.isFile)
  return result
}

function handleNodeClick (data: Tree) {
  console.log('data', data)
  if (!data.isFile) return
  const reader = new FileReader()
  
  reader.addEventListener("load", () => {
    console.log('load', reader.result)
    codeHtml.value = reader.result as string
  }, false)

  reader.readAsText(data.value!);
}

</script>

<style scoped lang="scss">
.container {
  width: 100vw;
  height: 100vh;
  box-sizing: border-box;
}
.left-container{
  background-color: #1e1f1c;
   :deep(.el-tree-node__content:hover) {
    background-color: #75715e;
  }
}
.right-container{
  background-color: #272822;
  :deep(.hljs) {
    color: #84aed9;
    background: #272822;
    height: 100%;
    overflow-x: inherit;
  }
}

.code-wrap{
  padding: 10px;
  font-size: 14px;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
}
</style>
