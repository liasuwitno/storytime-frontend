<template>
  <template v-if="typeForm === 'create'">
    <div>FORM CREATE</div>
  </template>

  <template v-else>
    <div>FORM UPDATE</div>
  </template>
</template>
<script setup>
defineProps({
  typeForm: String,
});
</script>
