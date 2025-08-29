<script lang="ts">
  import ErrorPage from '$lib/components/ErrorPage.svelte';
  const code = 404;
  const detail = 'The page you requested could not be located.';
</script>

<ErrorPage {code} {detail} />

