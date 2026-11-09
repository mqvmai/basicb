<script setup lang="ts">
import { useRouter } from "vue-router";
import type { Place } from "../types";
import { priceMap, formatReviews } from "../utils";

defineProps<{ place: Place }>();
const router = useRouter();
</script>

<template>
  <div
    @click="router.push(`/place/${place.id}`)"
    class="bg-white rounded-xl border border-gray-200 overflow-hidden cursor-pointer hover:-translate-y-0.5 hover:shadow-md transition-all group"
  >
    <div class="h-40 overflow-hidden bg-gray-100">
      <img :src="place.photoUrl" :alt="place.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
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
        <span class="text-xs text-gray-400 font-mono">{{ formatReviews(place.reviewCount) }} reviews</span>
      </div>
    </div>
  </div>
</template>
