<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { query } from "../api";
import { PLACES_QUERY } from "../graphql/queries";
import { CATEGORIES, FEATURED_CITIES, POPULAR_CITIES, type Place } from "../types";
import PlaceCard from "../components/PlaceCard.vue";

const city = ref("");
const searchInput = ref("");
const activeCategory = ref("all");
const places = ref<Place[]>([]);
const loading = ref(false);
const error = ref("");

const showSuggestions = ref(false);
const activeSuggestionIndex = ref(-1);

const suggestions = computed(() => {
  if (searchInput.value.length < 3) return [];
  const q = searchInput.value.toLowerCase();
  return POPULAR_CITIES.filter((c) => c.toLowerCase().includes(q)).slice(0, 6);
});

watch(searchInput, () => {
  showSuggestions.value = suggestions.value.length > 0;
  activeSuggestionIndex.value = -1;
});

function onKeyDown(e: KeyboardEvent) {
  if (!showSuggestions.value) return;
  if (e.key === "ArrowDown") {
    e.preventDefault();
    activeSuggestionIndex.value = Math.min(activeSuggestionIndex.value + 1, suggestions.value.length - 1);
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    activeSuggestionIndex.value = Math.max(activeSuggestionIndex.value - 1, -1);
  } else if (e.key === "Escape") {
    showSuggestions.value = false;
  }
}

function onBlur() {
  setTimeout(() => { showSuggestions.value = false; }, 150);
}

async function fetchPlaces(cityName: string, category?: string) {
  loading.value = true;
  error.value = "";
  try {
    const data = await query<{ places: Place[] }>(PLACES_QUERY, {
      city: cityName,
      category: !category || category === "all" ? undefined : category,
    });
    places.value = data.places;
  } catch {
    error.value = "Could not fetch places. Is the backend running?";
  } finally {
    loading.value = false;
  }
}

async function searchCity(name: string) {
  if (!name.trim()) { city.value = ""; return; }
  city.value = name.trim();
  activeCategory.value = "all";
  await fetchPlaces(city.value);
}

function selectSuggestion(name: string) {
  searchInput.value = name;
  showSuggestions.value = false;
  searchCity(name);
}

async function onSearch() {
  showSuggestions.value = false;
  if (activeSuggestionIndex.value >= 0) {
    selectSuggestion(suggestions.value[activeSuggestionIndex.value]);
    return;
  }
  await searchCity(searchInput.value);
}

async function applyCategory(cat: string) {
  activeCategory.value = cat;
  await fetchPlaces(city.value, cat);
}

function clearSearch() {
  city.value = "";
  searchInput.value = "";
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-3">
      <button @click="clearSearch" class="text-xl font-bold text-gray-900 hover:text-gray-600 transition-colors">
        BasicB
      </button>
      <span class="text-xs text-gray-400 font-mono">ranked by real reviews</span>
    </header>

    <main class="max-w-5xl mx-auto px-6 py-10">
      <div :class="['mb-10', city ? '' : 'text-center']">
        <template v-if="!city">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Find where everyone's going</h1>
          <p class="text-gray-500 mb-6">Ranked by review volume, not paid placement</p>
        </template>

        <form @submit.prevent="onSearch" :class="['flex gap-2', city ? 'max-w-md' : 'max-w-lg mx-auto']">
          <div class="relative flex-1">
            <input
              v-model="searchInput"
              type="text"
              placeholder="Enter a city..."
              :class="['w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-gray-400', city ? 'pr-8' : '']"
              @keydown="onKeyDown"
              @blur="onBlur"
              @focus="showSuggestions = suggestions.length > 0"
              autocomplete="off"
            />
            <button
              v-if="city"
              type="button"
              @click="clearSearch"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
              aria-label="Clear search"
            >
              ✕
            </button>

            <ul
              v-if="showSuggestions && suggestions.length"
              class="absolute top-full left-0 right-0 z-50 mt-1 rounded-lg border border-gray-200 bg-white shadow-lg overflow-hidden"
            >
              <li
                v-for="(s, i) in suggestions"
                :key="s"
                @mousedown.prevent="selectSuggestion(s)"
                :class="[
                  'px-4 py-2.5 text-sm cursor-pointer transition-colors',
                  i === activeSuggestionIndex ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50',
                ]"
              >
                {{ s }}
              </li>
            </ul>
          </div>

          <button
            type="submit"
            class="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-700 transition-colors shrink-0"
          >
            Search
          </button>
        </form>
      </div>

      <template v-if="!city">
        <p class="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">Popular Cities</p>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div
            v-for="fc in FEATURED_CITIES"
            :key="fc.name"
            @click="searchInput = fc.name; searchCity(fc.name)"
            class="relative rounded-xl overflow-hidden cursor-pointer group h-36"
          >
            <img :src="fc.imageUrl" :alt="fc.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <span class="absolute bottom-3 left-4 text-white font-semibold text-sm drop-shadow">{{ fc.name }}</span>
          </div>
        </div>
      </template>

      <template v-else>
        <div class="mb-6 flex gap-2 flex-wrap">
          <button
            v-for="cat in CATEGORIES"
            :key="cat.value"
            @click="applyCategory(cat.value)"
            :class="[
              'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
              activeCategory === cat.value
                ? 'bg-gray-900 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-400',
            ]"
          >
            {{ cat.label }}
          </button>
        </div>

        <div v-if="loading" class="text-center py-16 text-gray-400 text-sm">Loading...</div>
        <div v-else-if="error" class="text-center py-16 text-red-400 text-sm">{{ error }}</div>
        <div v-else-if="places.length === 0" class="text-center py-16 text-gray-400 text-sm">
          No results for "{{ city }}"
        </div>
        <template v-else>
          <p class="text-xs text-gray-400 font-mono mb-4">{{ places.length }} places · sorted by review count</p>
          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <PlaceCard v-for="place in places" :key="place.id" :place="place" />
          </div>
        </template>
      </template>
    </main>
  </div>
</template>
