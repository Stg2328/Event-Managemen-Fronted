<template>
  <div class="flex justify-center items-center min-h-screen">
    <div class="text-center">
      <h1 class="text-4xl font-bold text-red-500">404</h1>
      <p class="text-xl">Page Not Found</p>
      <router-link to="/" class="text-blue-500 underline">Go to Home</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "NoPageFound"
};
</script>

<style scoped>
/* Add any custom styles if necessary */
</style>
