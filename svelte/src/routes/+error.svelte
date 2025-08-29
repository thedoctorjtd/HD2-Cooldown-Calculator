<script lang="ts">
  import ErrorPage from '$lib/components/ErrorPage.svelte';
  export let status: number = 404;
  export let error: unknown;
  const detail = (error as any)?.message || 'Unexpected error.';
</script>

<ErrorPage code={status} detail={detail} />
