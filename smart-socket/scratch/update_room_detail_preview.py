import base64

with open('assets/images/bedroom_photo.png', 'rb') as f:
    b64_bedroom = base64.b64encode(f.read()).decode('utf-8')
with open('assets/images/kitchen_photo.png', 'rb') as f:
    b64_kitchen = base64.b64encode(f.read()).decode('utf-8')
with open('assets/images/living_photo.png', 'rb') as f:
    b64_living = base64.b64encode(f.read()).decode('utf-8')

html_content = f"""<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Smart Socket - Room Details & Swipe-to-Action</title>
  <script src="https://www.gstatic.com/antigravity/web/dev/tailwindcss.min.js"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    body {{
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    }}
    .phone-frame {{
      width: 350px;
      height: 740px;
      border-radius: 44px;
      box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 0 10px #1E2024, 0 0 0 12px #2A2D33;
      overflow: hidden;
      position: relative;
      background-color: #121214;
      flex-shrink: 0;
    }}
    .floating-nav {{
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.6);
    }}
    ::-webkit-scrollbar {{
      width: 5px;
      height: 5px;
    }}
    ::-webkit-scrollbar-thumb {{
      background: #2A2B32;
      border-radius: 4px;
    }}
  </style>
</head>
<body class="bg-[#080a0f] text-white p-6 min-h-screen flex flex-col items-center">
  
  <div class="mb-8 text-center max-w-2xl">
    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1e293b] border border-[#334155] text-xs text-[#94a3b8] mb-2">
      <span class="w-2 h-2 rounded-full bg-[#33BD6F]"></span>
      Room Details & Swipe-to-Reveal Actions • Exact Pixel Implementation
    </div>
    <h1 class="text-3xl font-extrabold text-white tracking-tight">Room Detail & Socket Controls</h1>
    <p class="text-[#8E95A5] text-sm mt-1">Comparing Rooms Screen (iPhone 16 - 20), Edit Socket (iPhone 16 - 19), and Room Detail with Swiped Actions (iPhone 16 - 15).</p>
  </div>

  <!-- Horizontal Scrollable Gallery of Phone Screens -->
  <div class="flex items-start justify-center gap-10 overflow-x-auto pb-10 w-full max-w-[1900px] px-4">

    <!-- ==================== 1. ROOMS LIST (iPhone 16 - 20) ==================== -->
    <div class="flex flex-col items-center">
      <span class="text-xs font-semibold text-[#8E95A5] uppercase tracking-wider mb-3">iPhone 16 - 20: Rooms View</span>
      <div class="phone-frame flex flex-col select-none">
        
        <!-- Blue Header -->
        <div class="bg-[#3B82F6] px-6 pt-3 pb-10 flex justify-between items-center text-white relative z-10">
          <div class="w-6"></div>
          <h2 class="text-base font-semibold tracking-tight">Rooms(3)</h2>
          <button class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-white transition">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>
          </button>
        </div>

        <!-- Dark Body Sheet -->
        <div class="bg-[#121214] rounded-t-[32px] -mt-5 pt-5 px-5 flex-1 overflow-y-auto pb-24 relative z-0 space-y-4">
          
          <!-- Room 1: Bedroom -->
          <div class="h-[175px] rounded-[24px] overflow-hidden relative shadow-lg cursor-pointer">
            <img src="data:image/png;base64,{b64_bedroom}" class="w-full h-full object-cover" alt="Bedroom">
            <div class="absolute bottom-0 left-0 right-0 h-[70px] bg-[#20293D]/95 px-4 flex items-center justify-between">
              <div>
                <h4 class="text-white font-bold text-sm">Bedroom</h4>
                <span class="text-[#8E95A5] text-[11px] font-medium block mt-0.5">4 active sockets</span>
              </div>
              <div class="w-[1px] h-9 bg-[#2D374D]"></div>
              <div>
                <span class="text-[#8E95A5] text-[11px] font-medium block">Current usage</span>
                <span class="text-[#3B82F6] font-bold text-[15px] block mt-0.5">46,2Kw</span>
              </div>
            </div>
          </div>

          <!-- Room 2: Kitchen -->
          <div class="h-[175px] rounded-[24px] overflow-hidden relative shadow-lg cursor-pointer">
            <img src="data:image/png;base64,{b64_kitchen}" class="w-full h-full object-cover" alt="Kitchen">
            <div class="absolute bottom-0 left-0 right-0 h-[70px] bg-[#20293D]/95 px-4 flex items-center justify-between">
              <div>
                <h4 class="text-white font-bold text-sm">Kitchen</h4>
                <span class="text-[#8E95A5] text-[11px] font-medium block mt-0.5">3 active sockets</span>
              </div>
              <div class="w-[1px] h-9 bg-[#2D374D]"></div>
              <div>
                <span class="text-[#8E95A5] text-[11px] font-medium block">Current usage</span>
                <span class="text-[#3B82F6] font-bold text-[15px] block mt-0.5">13,8Kw</span>
              </div>
            </div>
          </div>

          <!-- Room 3: Living Room -->
          <div class="h-[175px] rounded-[24px] overflow-hidden relative shadow-lg cursor-pointer">
            <img src="data:image/png;base64,{b64_living}" class="w-full h-full object-cover" alt="Living Room">
            <div class="absolute bottom-0 left-0 right-0 h-[70px] bg-[#20293D]/95 px-4 flex items-center justify-between">
              <div>
                <h4 class="text-white font-bold text-sm">Sitting Room</h4>
                <span class="text-[#8E95A5] text-[11px] font-medium block mt-0.5">5 active sockets</span>
              </div>
              <div class="w-[1px] h-9 bg-[#2D374D]"></div>
              <div>
                <span class="text-[#8E95A5] text-[11px] font-medium block">Current usage</span>
                <span class="text-[#3B82F6] font-bold text-[15px] block mt-0.5">76,2Kw</span>
              </div>
            </div>
          </div>

        </div>

        <!-- Floating Bottom Navigation Bar (Tab 2 Active) -->
        <div class="absolute bottom-5 left-7 right-7 bg-[#25262B] h-[64px] rounded-full flex items-center justify-around px-2 floating-nav z-30">
          <div class="w-10 h-10 flex items-center justify-center text-[#8E95A5] hover:text-white cursor-pointer">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"/></svg>
          </div>
          <div class="w-12 h-12 rounded-full bg-[#1476FF] flex items-center justify-center text-white shadow-[0_4px_12px_rgba(20,118,255,0.4)] cursor-pointer">
            <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M3 3h8v8H3zm10 0h8v8h-8zM3 13h8v8H3zm10 0h8v8h-8z"/></svg>
          </div>
          <div class="w-10 h-10 flex items-center justify-center text-[#8E95A5] hover:text-white cursor-pointer">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"/></svg>
          </div>
          <div class="w-10 h-10 flex items-center justify-center text-[#8E95A5] hover:text-white cursor-pointer">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z\"/><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M15 12a3 3 0 11-6 0 3 3 0 016 0z\"/></svg>
          </div>
        </div>

      </div>
    </div>


    <!-- ==================== 2. EDIT SOCKET (iPhone 16 - 19) ==================== -->
    <div class="flex flex-col items-center">
      <span class="text-xs font-semibold text-[#8E95A5] uppercase tracking-wider mb-3">iPhone 16 - 19: Edit Socket 1</span>
      <div class="phone-frame flex flex-col select-none justify-between p-5 bg-[#121214] overflow-y-auto">
        
        <div>
          <!-- Top Bar -->
          <div class="flex justify-between items-center mb-6 pt-1">
            <button class="text-white hover:text-white/80">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"/></svg>
            </button>
            <h3 class="text-white font-bold text-base">Edit</h3>
            <button class="text-white font-bold text-sm hover:text-white/80">Done</button>
          </div>

          <!-- Section 1: Socket 1 + Switch -->
          <div class="flex justify-between items-center mb-6">
            <span class="text-white font-bold text-base">Socket 1</span>
            <div onclick="toggleUiSwitch(this)" class="w-11 h-6 bg-[#1B2232] border border-[#2C4370] rounded-full p-0.5 flex items-center justify-end cursor-pointer transition-all">
              <div class="w-5 h-5 rounded-full bg-[#307FFE] shadow-[0_0_8px_#307FFE]"></div>
            </div>
          </div>

          <!-- Section 2: Enter socket name -->
          <div class="mb-5">
            <label class="text-xs text-[#8E95A5] font-medium block mb-1.5">Enter socket name</label>
            <div class="bg-[#182334] border border-[#263750] rounded-xl px-4 py-3 text-white text-sm">
              socket 1
            </div>
          </div>

          <!-- Section 3: Enter room name -->
          <div class="mb-6">
            <label class="text-xs text-[#8E95A5] font-medium block mb-1.5">Enter room name</label>
            <div class="bg-[#182334] border border-[#263750] rounded-xl px-4 py-3 text-white text-sm flex items-center justify-between cursor-pointer">
              <span>Bedrrom</span>
              <svg class="w-4 h-4 text-[#8E95A5]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"/></svg>
            </div>
          </div>

          <!-- Section 4: Schedule Card -->
          <div class="bg-[#1E1E22] border border-[#2A2B33] rounded-[20px] p-4 shadow-lg">
            <div class="flex justify-between items-center mb-3">
              <span class="text-white font-bold text-sm">Schedule</span>
              <div onclick="toggleUiSwitch(this)" class="w-11 h-6 bg-[#1B2232] border border-[#2C4370] rounded-full p-0.5 flex items-center justify-end cursor-pointer transition-all">
                <div class="w-5 h-5 rounded-full bg-[#307FFE] shadow-[0_0_8px_#307FFE]"></div>
              </div>
            </div>
            
            <div class="w-full h-[1px] bg-[#2E323B] my-3"></div>

            <!-- Date pills -->
            <div class="grid grid-cols-3 gap-2 my-3">
              <div class="h-9 rounded-full bg-[#212530] border border-[#333B4D] flex items-center justify-center gap-1 text-xs text-white font-medium">
                <span>2025</span>
                <svg class="w-3 h-3 text-[#8E95A5]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"/></svg>
              </div>
              <div class="h-9 rounded-full bg-[#212530] border border-[#333B4D] flex items-center justify-center gap-1 text-xs text-white font-medium">
                <span>Sept</span>
                <svg class="w-3 h-3 text-[#8E95A5]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"/></svg>
              </div>
              <div class="h-9 rounded-full bg-[#212530] border border-[#333B4D] flex items-center justify-center gap-1 text-xs text-white font-medium">
                <span>7</span>
                <svg class="w-3 h-3 text-[#8E95A5]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"/></svg>
              </div>
            </div>

            <!-- On Time / Off Time -->
            <div class="flex items-center justify-between pt-2">
              <div class="flex-1">
                <span class="text-[11px] text-[#8E95A5] font-medium block">On Time</span>
                <span class="text-white font-bold text-sm block mt-0.5">08:00 AM</span>
              </div>
              <div class="w-[1px] h-8 bg-[#2E323B] mx-3"></div>
              <div class="flex-1">
                <span class="text-[11px] text-[#8E95A5] font-medium block">Off Time</span>
                <span class="text-white font-bold text-sm block mt-0.5">13:00 PM</span>
              </div>
            </div>
          </div>

        </div>

        <!-- Bottom Home Indicator -->
        <div class="flex justify-center pt-4">
          <div class="w-32 h-1 bg-white/30 rounded-full"></div>
        </div>

      </div>
    </div>


    <!-- ==================== 3. ROOM DETAIL WITH SWIPED ACTIONS (iPhone 16 - 15) ==================== -->
    <div class="flex flex-col items-center">
      <span class="text-xs font-semibold text-[#8E95A5] uppercase tracking-wider mb-3">iPhone 16 - 15: Bedroom Details & Swiped Row</span>
      <div class="phone-frame flex flex-col select-none relative">
        
        <!-- Hero Photographic Header -->
        <div class="h-[210px] w-full relative">
          <img src="data:image/png;base64,{b64_bedroom}" class="w-full h-full object-cover" alt="Bedroom Header">
          <div class="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-[#121214]"></div>
          
          <div class="absolute top-4 left-5 right-5 flex justify-between items-center text-white">
            <button class="w-8 h-8 flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"/></svg>
            </button>
            <h3 class="text-white font-bold text-base">Bedroom</h3>
            <div class="w-8"></div>
          </div>
        </div>

        <!-- Content Area -->
        <div class="bg-[#121214] -mt-10 px-5 flex-1 overflow-y-auto pb-24 relative z-10">
          
          <!-- Floating Energy Usage Card for Bedroom -->
          <div class="bg-[#1E1E22] border border-[#2A2B33] rounded-[22px] p-4 shadow-xl mb-6">
            <h3 class="text-center text-white text-[14px] font-semibold mb-3">Energy Usage</h3>
            <div class="flex items-center justify-between">
              <div class="flex-1 text-center">
                <span class="text-[#8E95A5] text-[12px] font-medium block">Active sockets</span>
                <span class="text-[#33BD6F] text-[26px] font-bold leading-tight mt-0.5 block">4</span>
              </div>
              <div class="w-[1px] h-10 bg-[#2E323B]"></div>
              <div class="flex-1 text-center">
                <span class="text-[#8E95A5] text-[12px] font-medium block">Today</span>
                <div class="text-[#4679EC] font-bold leading-tight mt-0.5 flex items-baseline justify-center">
                  <span class="text-[26px]">48,2</span>
                  <span class="text-[13px] ml-0.5 font-semibold">Kw</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Sockets Section Title -->
          <div class="flex justify-between items-center mb-3">
            <h4 class="text-white font-bold text-base tracking-tight">Sockets(4)</h4>
            <button class="text-white/80 hover:text-white">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>
            </button>
          </div>

          <!-- Socket Rows -->
          <div class="space-y-3">
            
            <!-- Row 1: Socket 1 -->
            <div class="bg-[#1F1F24] border border-[#28282E] rounded-2xl h-[58px] px-4 flex items-center justify-between shadow-sm">
              <span class="text-white font-semibold text-sm">Socket 1</span>
              <div onclick="toggleUiSwitch(this)" class="w-10 h-5 bg-[#1B2232] border border-[#2C4370] rounded-full p-0.5 flex items-center justify-end cursor-pointer">
                <div class="w-4 h-4 rounded-full bg-[#307FFE]"></div>
              </div>
            </div>

            <!-- Row 2: Socket 2 -->
            <div class="bg-[#1F1F24] border border-[#28282E] rounded-2xl h-[58px] px-4 flex items-center justify-between shadow-sm">
              <span class="text-white font-semibold text-sm">Socket 2</span>
              <div onclick="toggleUiSwitch(this)" class="w-10 h-5 bg-[#1B2232] border border-[#2C4370] rounded-full p-0.5 flex items-center justify-end cursor-pointer">
                <div class="w-4 h-4 rounded-full bg-[#307FFE]"></div>
              </div>
            </div>

            <!-- Row 3: SWIPED REVEALING EDIT & DELETE BUTTONS -->
            <div class="relative h-[58px] rounded-2xl overflow-hidden shadow-sm">
              <!-- Revealed Actions Background -->
              <div class="absolute inset-0 flex justify-end">
                <!-- Orange Edit Button -->
                <button class="w-[70px] h-full bg-[#E65100] flex flex-col items-center justify-center text-white hover:bg-[#d84800] transition">
                  <svg class="w-4 h-4 mb-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"/></svg>
                  <span class="text-[10px] font-bold">Edit</span>
                </button>
                <!-- Red Delete Button -->
                <button class="w-[70px] h-full bg-[#DC2626] flex flex-col items-center justify-center text-white hover:bg-[#c52020] transition rounded-r-2xl">
                  <svg class="w-4 h-4 mb-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/></svg>
                  <span class="text-[10px] font-bold">Delete</span>
                </button>
              </div>

              <!-- Swiped Left Forefront Tile -->
              <div class="absolute inset-y-0 left-0 right-[140px] bg-[#1F1F24] border border-[#28282E] rounded-l-2xl px-4 flex items-center justify-between">
                <span class="text-white font-semibold text-sm">Socket 3</span>
                <div onclick="toggleUiSwitch(this)" class="w-10 h-5 bg-[#1B2232] border border-[#2C4370] rounded-full p-0.5 flex items-center justify-end cursor-pointer">
                  <div class="w-4 h-4 rounded-full bg-[#307FFE]"></div>
                </div>
              </div>
            </div>

            <!-- Row 4: Socket 4 -->
            <div class="bg-[#1F1F24] border border-[#28282E] rounded-2xl h-[58px] px-4 flex items-center justify-between shadow-sm">
              <span class="text-white font-semibold text-sm">Socket 4</span>
              <div onclick="toggleUiSwitch(this)" class="w-10 h-5 bg-[#1B2232] border border-[#2C4370] rounded-full p-0.5 flex items-center justify-end cursor-pointer">
                <div class="w-4 h-4 rounded-full bg-[#307FFE]"></div>
              </div>
            </div>

          </div>

        </div>

        <!-- Floating Bottom Nav (Tab 2 Active) -->
        <div class="absolute bottom-5 left-7 right-7 bg-[#25262B] h-[64px] rounded-full flex items-center justify-around px-2 floating-nav z-30">
          <div class="w-10 h-10 flex items-center justify-center text-[#8E95A5]">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"/></svg>
          </div>
          <div class="w-12 h-12 rounded-full bg-[#1476FF] flex items-center justify-center text-white shadow-[0_4px_12px_rgba(20,118,255,0.4)]">
            <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M3 3h8v8H3zm10 0h8v8h-8zM3 13h8v8H3zm10 0h8v8h-8z"/></svg>
          </div>
          <div class="w-10 h-10 flex items-center justify-center text-[#8E95A5]">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"/></svg>
          </div>
          <div class="w-10 h-10 flex items-center justify-center text-[#8E95A5]">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z\"/><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M15 12a3 3 0 11-6 0 3 3 0 016 0z\"/></svg>
          </div>
        </div>

      </div>
    </div>

  </div>

  <script>
    function toggleUiSwitch(el) {{
      const knob = el.firstElementChild;
      const isCurrentlyOn = el.classList.contains('justify-end');
      if (isCurrentlyOn) {{
        el.classList.remove('justify-end', 'bg-[#1B2232]', 'border-[#2C4370]');
        el.classList.add('justify-start', 'bg-[#18191E]', 'border-[#2A2B33]');
        knob.classList.remove('bg-[#307FFE]', 'shadow-[0_0_8px_#307FFE]');
        knob.classList.add('bg-[#555964]');
      }} else {{
        el.classList.remove('justify-start', 'bg-[#18191E]', 'border-[#2A2B33]');
        el.classList.add('justify-end', 'bg-[#1B2232]', 'border-[#2C4370]');
        knob.classList.remove('bg-[#555964]');
        knob.classList.add('bg-[#307FFE]', 'shadow-[0_0_8px_#307FFE]');
      }}
    }}
  </script>

</body>
</html>
"""

out_path = r'C:/Users/USER/.gemini/antigravity/brain/e6c19b09-c8f3-4468-9b2c-11e4eb33e3fd/ui_preview.html'
with open(out_path, 'w', encoding='utf-8') as f:
    f.write(html_content)
print('UI Preview updated with Room Detail & Swipe-to-action!')

