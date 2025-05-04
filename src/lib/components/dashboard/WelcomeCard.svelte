<script lang="ts">
    export let userName: string = "User";
    export let unreadAlerts: number = 0;
    export let date: string = new Date().toLocaleDateString("en-GB");
  </script>
  
  <!-- linear-gradient(to bottom, #f9fafb, #f9fafb, #e0f2fe, #f0e3fd); bg-sky-100 -->
  <div class="flex flex-col md:flex-row justify-between items-start md:items-center p-6 rounded-2xl shadow-sm" style="background-image: linear-gradient(to right, #BFDBFE, #C7D2FE, #DDD6FE, #E9D5FF);">
    <div>
      <h2 class="text-2xl font-semibold">Welcome {userName}</h2>
      <p class="text-sm text-gray-600">
        Have a productive day! You have 
        <a href="#" class="text-indigo-600 underline">{unreadAlerts} unread alerts</a>!
      </p>
    </div>
    <div class="mt-4 md:mt-0">
      <button class="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow text-sm font-medium">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
          <path d="M6 2a1 1 0 012 0v1h4V2a1 1 0 112 0v1h1a2 2 0 012 2v1H3V5a2 2 0 012-2h1V2zM3 8h14v9a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 100 2h4a1 1 0 100-2H8z"/>
        </svg>
        Today ({date})
      </button>
    </div>
  </div>
  