<script lang="ts">
    export let title: string;
    export let value: number;
    export let change: string;
    export let color: string; // ejemplo: "bg-blue-200"
    export let textColor: string = "text-black";
    export let route: string; // ejemplo: "/incidents"
  </script>
  
  <a
  href={route}
  class={`flex justify-between items-start transition transform hover:scale-105 hover:shadow-xl 
    p-4 rounded-2xl shadow-md no-underline 
    border border-white/20 ${color} ${textColor}`}
  style="background-image: repeating-linear-gradient(45deg, rgba(255,255,255,0.2) 0 4px, transparent 4px 16px);"
>

  <div>
    <h2 class="text-sm font-semibold opacity-70">{title}</h2>
    <p class="text-3xl font-bold">{value}</p>
    <p class="text-xs opacity-60">Change: {change}</p>
  </div>


  <div class="flex items-center gap-1 text-sm font-medium opacity-70 mt-1">
    <span>Details</span>
    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
    </svg>
  </div>
</a>




  