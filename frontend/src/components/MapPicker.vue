<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const emit = defineEmits<{ (e: "city-selected", city: string): void }>();

const mapEl = ref<HTMLDivElement>();
const hint = ref("Click anywhere on the map");
const busy = ref(false);
let map: L.Map | null = null;
let marker: L.Marker | null = null;

L.Icon.Default.mergeOptions({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

async function reverseGeocode(lat: number, lng: number): Promise<string | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&zoom=10`,
      { headers: { "Accept-Language": "en" } }
    );
    const data = await res.json();
    return data.address?.city ?? data.address?.town ?? data.address?.municipality ?? data.address?.village ?? null;
  } catch {
    return null;
  }
}

async function pick(lat: number, lng: number) {
  busy.value = true;
  hint.value = "Finding city...";
  if (marker) marker.remove();
  marker = L.marker([lat, lng]).addTo(map!);

  const city = await reverseGeocode(lat, lng);
  busy.value = false;

  if (city) {
    hint.value = `Loading ${city}...`;
    emit("city-selected", city);
  } else {
    hint.value = "No city found here — try somewhere else.";
  }
}

onMounted(() => {
  if (!mapEl.value) return;
  map = L.map(mapEl.value).setView([20, 0], 2);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
  }).addTo(map);
  map.on("click", (e) => pick(e.latlng.lat, e.latlng.lng));
});

onUnmounted(() => { map?.remove(); map = null; });

function useMyLocation() {
  if (!navigator.geolocation) { hint.value = "Geolocation not supported."; return; }
  busy.value = true;
  hint.value = "Getting your location...";
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      map?.setView([latitude, longitude], 11);
      pick(latitude, longitude);
    },
    () => { busy.value = false; hint.value = "Location access denied."; }
  );
}
</script>

<template>
  <div class="relative">
    <div ref="mapEl" class="w-full rounded-xl overflow-hidden border border-gray-200" style="height: 420px;" />
    <div class="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-[1000] pointer-events-none">
      <button
        @click="useMyLocation"
        class="pointer-events-auto bg-white border border-gray-200 shadow-md rounded-full px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-1.5"
      >
        📍 Use my location
      </button>
      <span
        v-if="busy || hint !== 'Click anywhere on the map'"
        class="pointer-events-none bg-gray-900/80 text-white rounded-full px-3 py-2 text-xs"
      >
        {{ hint }}
      </span>
    </div>
  </div>
</template>
