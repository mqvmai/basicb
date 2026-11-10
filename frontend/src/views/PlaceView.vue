<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { query } from "../api";
import { PLACE_QUERY } from "../graphql/queries";
import type { Place } from "../types";
import { priceMap, formatReviews } from "../utils";
import "leaflet/dist/leaflet.css";

const route = useRoute();
const router = useRouter();

const place = ref<Place | null>(null);
const loading = ref(true);

onMounted(async () => {
  try {
    const data = await query<{ place: Place }>(PLACE_QUERY, { id: route.params.id });
    place.value = data.place;
    if (data.place) initMap(data.place);
  } finally {
    loading.value = false;
  }
});

let mapInstance: import("leaflet").Map | null = null;

async function initMap(p: Place) {
  const L = (await import("leaflet")).default;

  // Leaflet's default marker icons reference files that Vite doesn't bundle
  delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  });

  mapInstance = L.map("map").setView([p.lat, p.lng], 15);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(mapInstance);
  L.marker([p.lat, p.lng]).addTo(mapInstance).bindPopup(p.name).openPopup();
}

onUnmounted(() => mapInstance?.remove());
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-gray-900 px-6 py-4 flex items-center gap-4 sticky top-0 z-40">
      <button @click="router.back()" class="text-sm text-gray-400 hover:text-white transition-colors">← Back</button>
      <span class="font-bold text-white text-lg tracking-tight">BasicB</span>
      <span v-if="place" class="text-gray-500 text-sm font-mono truncate">/ {{ place.name }}</span>
    </header>

    <div v-if="loading" class="text-center py-16 text-gray-400 text-sm">Loading...</div>

    <main v-else-if="place" class="max-w-3xl mx-auto px-6 py-10">
      <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <img :src="place.photoUrl" :alt="place.name" class="w-full h-56 object-cover" />

        <div class="p-6">
          <div class="flex items-start justify-between gap-4 mb-1">
            <h1 class="text-2xl font-bold text-gray-900">{{ place.name }}</h1>
            <span v-if="place.priceLevel" class="text-sm text-gray-400 mt-1 shrink-0">{{ priceMap[place.priceLevel] }}</span>
          </div>

          <p class="text-sm text-gray-400 capitalize mb-5">{{ place.category }}</p>

          <div class="flex items-center gap-6 mb-5">
            <div class="text-center">
              <p class="text-2xl font-bold text-gray-900">{{ place.rating }}</p>
              <p class="text-xs text-gray-400">rating</p>
            </div>
            <div class="h-8 w-px bg-gray-100" />
            <div class="text-center">
              <p class="text-2xl font-bold text-gray-900">{{ formatReviews(place.reviewCount) }}</p>
              <p class="text-xs text-gray-400">reviews</p>
            </div>
          </div>

          <p class="text-sm text-gray-500 mb-6">📍 {{ place.address }}</p>

          <div id="map" class="rounded-lg overflow-hidden" style="height: 300px;" />
        </div>
      </div>
    </main>

    <div v-else class="text-center py-16 text-gray-400 text-sm">Place not found.</div>
  </div>
</template>
