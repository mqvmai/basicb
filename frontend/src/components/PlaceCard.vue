<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import type { Place } from "../types";
import { priceMap, formatReviews } from "../utils";

const props = defineProps<{ place: Place }>();
const router = useRouter();

const tier = computed(() => {
  if (props.place.reviewCount >= 50_000) return "iconic";
  if (props.place.reviewCount >= 10_000) return "popular";
  return null;
});
</script>

<template>
  <div
    @click="router.push(`/place/${place.id}`)"
    :class="[
      'bg-white rounded-xl overflow-hidden cursor-pointer hover:-translate-y-0.5 hover:shadow-md transition-all group border',
      tier === 'iconic'  ? 'border-amber-400 ring-2 ring-amber-300/50 shadow-sm shadow-amber-100' :
      tier === 'popular' ? 'border-amber-200 ring-1 ring-amber-200/60' :
      'border-gray-200'
    ]"
  >
    <div class="h-40 overflow-hidden bg-gray-100 relative">
      <img :src="place.photoUrl" :alt="place.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
      <span
        v-if="tier"
        class="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full"
        :class="tier === 'iconic' ? 'bg-amber-400 text-amber-900' : 'bg-amber-100 text-amber-700'"
      >
        {{ tier === 'iconic' ? '👑 Iconic' : '🔥 Popular' }}
      </span>
    </div>
    <div class="p-4">
      <div class="flex items-start justify-between gap-2 mb-1">
        <h3 class="font-semibold text-gray-900 text-sm leading-tight">{{ place.name }}</h3>
        <span v-if="place.priceLevel" class="text-xs text-gray-400 shrink-0">{{ priceMap[place.priceLevel] }}</span>
      </div>
      <p class="text-xs text-gray-400 capitalize mb-3">{{ place.category }}</p>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-1">
          <span class="text-xs font-semibold text-gray-700">{{ place.rating }}</span>
          <span class="text-yellow-400 text-xs">★</span>
        </div>
        <span
          class="text-xs font-mono"
          :class="tier ? 'text-amber-500 font-semibold' : 'text-gray-400'"
        >
          {{ formatReviews(place.reviewCount) }} reviews
        </span>
      </div>
    </div>
  </div>
</template>
