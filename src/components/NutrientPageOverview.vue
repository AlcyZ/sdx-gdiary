<template>
  <ICard class="w-full max-w-2xl">
    <ICardTitle class="text-2xl font-bold">
      Nutrients
    </ICardTitle>

    <div class="my-8 py-4">
      <h2 class="text-lg font-semibold">
        Dünger
      </h2>

      <div class="join join-vertical w-full">
        <ICollapse
          v-for="(fertilizerList, manufacturer) in fertilizersGroup"
          :key="manufacturer"
          name="manufacturer"
          class="border border-base-200 join-item"
          arrow
        >
          <ICollapseTitle>
            {{ manufacturer }}
          </ICollapseTitle>
          <ICollapseContent>
            <div
              v-for="(fertilizer, i) in fertilizerList"
              :key="i"
              class="flex justify-between items-center"
              :class="{'border-t border-t-base-200': i === 0}"
            >
              <div>
                {{ fertilizer.name }}
              </div>

              <div>
                <IBtn square ghost>
                  <IconEdit />
                </IBtn>
                <IBtn square ghost variant="error">
                  <IconDelete />
                </IBtn>
              </div>
            </div>
          </ICollapseContent>
        </ICollapse>
      </div>
    </div>

    <button class="btn btn-neutral" @click="$emit('back')">
      Back
    </button>
  </ICard>
</template>

<script lang="ts" setup>
import type { Fertilizer } from '../modules/nutrients/types'
import {
  Trash as IconDelete,
  Edit as IconEdit,
} from 'lucide-vue-next'
import { computed } from 'vue'
import IBtn from './IBtn.vue'
import ICard from './ICard.vue'
import ICardTitle from './ICardTitle.vue'
import ICollapse from './ICollapse.vue'
import ICollapseContent from './ICollapseContent.vue'
import ICollapseTitle from './ICollapseTitle.vue'
import IList from './IList.vue'
import IListRow from './IListRow.vue'

interface Props {
  fertilizers: Array<Fertilizer>
}
interface Emits {
  back: []
}

const { fertilizers } = defineProps<Props>()
defineEmits<Emits>()

const fertilizersGroup = computed(() => {
  const unknown = 'unknown'

  const data: Record<string, Array<Fertilizer>> = {}

  for (const fertilizer of fertilizers) {
    const manufacturer = fertilizer.manufacturer || unknown

    if (!(manufacturer in data)) {
      data[manufacturer] = []
    }

    data[manufacturer]?.push(fertilizer)
  }

  return data
})
</script>
