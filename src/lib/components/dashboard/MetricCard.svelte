<script lang="ts">
    export let title: string;
    export let value: number;
    export let change: string;
    export let color: string;
  </script>
  
  <div class={`p-4 rounded-2xl shadow ${color}`}>
    <h2 class="text-sm text-gray-700">{title}</h2>
    <p class="text-2xl font-bold">{value}</p>
    <p class="text-xs text-gray-600">Change: {change}</p>
  </div>
  