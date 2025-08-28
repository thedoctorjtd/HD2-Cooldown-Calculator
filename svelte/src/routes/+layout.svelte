<script lang="ts">
  import '../app.css';

  let { children } = $props();
</script>

<header class="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
  <div class="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
    <a href="/" class="font-semibold">HD2 Cooldown Calculator</a>
    <nav class="flex gap-4 text-sm">
      <a href="/stratagems" class="hover:underline">Stratagems</a>
      <a href="/rockets" class="hover:underline">Rockets</a>
    </nav>
  </div>
</header>

<main class="mx-auto max-w-5xl px-4 py-6">
  {@render children?.()}
</main>
