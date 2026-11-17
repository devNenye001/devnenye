# Python script to build the complete, pixel-accurate web app into public/index.html
import os

html_content = r'''<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>VoltPass • Smart Socket App Preview</title>
  <script src="https://www.gstatic.com/antigravity/web/dev/tailwindcss.min.js"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    * {
      box-sizing: border-box;
      user-select: none;
      -webkit-user-select: none;
    }
    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background-color: #0B0E14;
      color: #FFFFFF;
      overflow-x: hidden;
    }
    
    /* iPhone 16 Frame Realistic Styling */
    .iphone-16 {
      width: 375px;
      height: 790px;
      border-radius: 46px;
      background-color: #121214;
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      box-shadow: 
        0 25px 65px -12px rgba(0, 0, 0, 0.85),
        0 0 0 10px #1E222B,
        0 0 0 12px #2E3340;
      flex-shrink: 0;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    /* Dynamic Island pill */
    .dynamic-island {
      position: absolute;
      top: 11px;
      left: 50%;
      transform: translateX(-50%);
      width: 105px;
      height: 28px;
      background-color: #000000;
      border-radius: 20px;
      z-index: 50;
      pointer-events: none;
    }

    /* iPhone Bottom Home Indicator */
    .home-indicator {
      width: 135px;
      height: 4px;
      background-color: rgba(255, 255, 255, 0.45);
      border-radius: 999px;
      margin: 8px auto 6px auto;
      flex-shrink: 0;
    }

    /* Custom Toggle Switch */
    .custom-switch {
      width: 48px;
      height: 28px;
      border-radius: 999px;
      background-color: #272A30;
      position: relative;
      cursor: pointer;
      transition: background-color 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      display: inline-flex;
      align-items: center;
      padding: 3px;
      flex-shrink: 0;
    }
    .custom-switch.active {
      background-color: #3B82F6;
    }
    .custom-switch .knob {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background-color: #FFFFFF;
      box-shadow: 0 2px 5px rgba(0,0,0,0.3);
      transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      transform: translateX(0);
    }
    .custom-switch.active .knob {
      transform: translateX(20px);
    }

    /* Floating Bottom Nav Bar */
    .floating-nav {
      background: #181A20;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 999px;
      box-shadow: 0 16px 36px rgba(0, 0, 0, 0.6);
      padding: 6px 14px;
    }

    /* Scrollbar styling */
    ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    ::-webkit-scrollbar-track {
      background: #0B0E14;
    }
    ::-webkit-scrollbar-thumb {
      background: #252A36;
      border-radius: 4px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #3B82F6;
    }

    /* Pulse animation for radar */
    @keyframes ping-slow {
      0% { transform: scale(0.9); opacity: 0.8; }
      50% { transform: scale(1.15); opacity: 0.3; }
      100% { transform: scale(0.9); opacity: 0.8; }
    }
    .radar-pulse {
      animation: ping-slow 2.4s infinite ease-in-out;
    }
  </style>
</head>
<body class="min-h-screen flex flex-col">

  <!-- ==================== TOP GLOBAL TOOLBAR ==================== -->
  <header class="bg-[#121620] border-b border-[#202738] px-6 py-3.5 sticky top-0 z-50 flex items-center justify-between flex-wrap gap-4 shadow-lg">
    <div class="flex items-center gap-3">
      <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#3B82F6] to-[#60A5FA] flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)]">
        <svg class="w-5 h-5 text-white fill-current" viewBox="0 0 24 24"><path d="M7 2v11h3v9l7-12h-4l4-8z"/></svg>
      </div>
      <div>
        <h1 class="text-base font-extrabold tracking-tight text-white flex items-center gap-2">
          VoltPass • Smart Socket
          <span class="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/30">Live Local Server</span>
        </h1>
        <p class="text-xs text-[#8E95A5]">Interactive Device Simulator & Pixel-Accurate UI Showcase</p>
      </div>
    </div>

    <!-- Mode Selector & Screen Dropdown -->
    <div class="flex items-center gap-3 flex-wrap">
      <!-- Mode Tabs -->
      <div class="bg-[#19202F] p-1 rounded-xl border border-[#273248] flex items-center text-xs font-semibold">
        <button id="btn-mode-interactive" onclick="switchViewMode('interactive')" class="px-3.5 py-1.5 rounded-lg bg-[#3B82F6] text-white shadow transition">
          📱 Device Simulator
        </button>
        <button id="btn-mode-gallery" onclick="switchViewMode('gallery')" class="px-3.5 py-1.5 rounded-lg text-[#94A3B8] hover:text-white transition">
          🖼️ All Screens Gallery
        </button>
      </div>

      <!-- Quick Screen Jump Dropdown -->
      <div class="flex items-center gap-2 bg-[#19202F] border border-[#273248] rounded-xl px-3 py-1.5">
        <span class="text-xs text-[#8E95A5] font-medium">Jump to:</span>
        <select id="screen-select" onchange="jumpToScreen(this.value)" class="bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer">
          <option value="splash" class="bg-[#19202F]">iPhone 16 - 1: Splash Screen</option>
          <option value="onboarding" class="bg-[#19202F]">iPhone 16 - 2: Onboarding (Slide)</option>
          <option value="login" class="bg-[#19202F]">iPhone 16 - 4: VoltPass Login</option>
          <option value="home" class="bg-[#19202F]" selected>iPhone 16 - 8: Home Sockets Grid</option>
          <option value="rooms" class="bg-[#19202F]">iPhone 16 - 20: Rooms Screen</option>
          <option value="room_detail" class="bg-[#19202F]">iPhone 16 - 15: Bedroom Detail (Swiped)</option>
          <option value="edit_socket" class="bg-[#19202F]">iPhone 16 - 18/19: Edit Socket</option>
          <option value="add_new_modal" class="bg-[#19202F]">Frame 65: Add New Modal</option>
          <option value="add_socket_scan" class="bg-[#19202F]">iPhone 16 - 10: Scan Searching</option>
          <option value="add_socket_discovered" class="bg-[#19202F]">iPhone 16 - 11: Discovered Devices</option>
          <option value="add_socket_selected" class="bg-[#19202F]">iPhone 16 - 12: Device Selected</option>
          <option value="configure_socket" class="bg-[#19202F]">iPhone 16 - 13: Configure Socket</option>
          <option value="add_room" class="bg-[#19202F]">iPhone 16 - 9: Add Room</option>
          <option value="socket_success" class="bg-[#19202F]">iPhone 16 - 21: Success Screen</option>
        </select>
      </div>

      <!-- Reset State Button -->
      <button onclick="resetAppState()" class="text-xs font-semibold px-3 py-2 rounded-xl bg-[#202738] hover:bg-[#2A344C] text-[#CBD5E1] border border-[#2F3A52] transition flex items-center gap-1.5" title="Reset all socket toggles and inputs">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"/></svg>
        Reset State
      </button>
    </div>
  </header>

  <!-- ==================== MAIN CONTENT AREA ==================== -->
  <main class="flex-1 flex flex-col items-center justify-center p-6">
    
    <!-- MODE 1: INTERACTIVE SIMULATOR -->
    <div id="interactive-view" class="flex flex-col items-center">
      <div class="mb-4 text-center">
        <span id="active-screen-badge" class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#182334] text-[#60A5FA] border border-[#263750] text-xs font-semibold">
          Current: iPhone 16 - 8 (Home Dashboard)
        </span>
      </div>

      <!-- The Phone Bezel Container -->
      <div class="iphone-16 select-none" id="phone-container">
        <!-- Dynamic Island -->
        <div class="dynamic-island"></div>

        <!-- Phone Screen Content (swapped dynamically) -->
        <div id="screen-mount" class="w-full h-full flex flex-col relative overflow-hidden">
          <!-- Screen content injected here by JavaScript -->
        </div>
      </div>
    </div>

    <!-- MODE 2: ALL SCREENS GALLERY (FIGMA VIEW) -->
    <div id="gallery-view" class="hidden w-full flex flex-col items-center">
      <div class="mb-6 text-center">
        <h2 class="text-xl font-bold text-white">All 14 Figma Screen Mockups • Side-by-Side</h2>
        <p class="text-xs text-[#8E95A5] mt-1">Scroll horizontally to inspect each screen in exact iPhone 16 resolution.</p>
      </div>

      <div class="flex items-start gap-8 overflow-x-auto w-full pb-10 px-6 max-w-[99vw]">
        
        <!-- Screen 1: Splash -->
        <div class="flex flex-col items-center">
          <span class="text-xs font-bold text-[#8E95A5] mb-2">iPhone 16 - 1: Splash</span>
          <div class="iphone-16 scale-90 -my-6" id="gallery-splash"></div>
        </div>

        <!-- Screen 2: Onboarding -->
        <div class="flex flex-col items-center">
          <span class="text-xs font-bold text-[#8E95A5] mb-2">iPhone 16 - 2: Onboarding</span>
          <div class="iphone-16 scale-90 -my-6" id="gallery-onboarding"></div>
        </div>

        <!-- Screen 3: Login -->
        <div class="flex flex-col items-center">
          <span class="text-xs font-bold text-[#8E95A5] mb-2">iPhone 16 - 4: Login</span>
          <div class="iphone-16 scale-90 -my-6" id="gallery-login"></div>
        </div>

        <!-- Screen 4: Home -->
        <div class="flex flex-col items-center">
          <span class="text-xs font-bold text-[#8E95A5] mb-2">iPhone 16 - 8: Home</span>
          <div class="iphone-16 scale-90 -my-6" id="gallery-home"></div>
        </div>

        <!-- Screen 5: Rooms -->
        <div class="flex flex-col items-center">
          <span class="text-xs font-bold text-[#8E95A5] mb-2">iPhone 16 - 20: Rooms</span>
          <div class="iphone-16 scale-90 -my-6" id="gallery-rooms"></div>
        </div>

        <!-- Screen 6: Room Detail (Swiped) -->
        <div class="flex flex-col items-center">
          <span class="text-xs font-bold text-[#8E95A5] mb-2">iPhone 16 - 15: Bedroom Detail</span>
          <div class="iphone-16 scale-90 -my-6" id="gallery-room_detail"></div>
        </div>

        <!-- Screen 7: Edit Socket -->
        <div class="flex flex-col items-center">
          <span class="text-xs font-bold text-[#8E95A5] mb-2">iPhone 16 - 18 / 19: Edit Socket</span>
          <div class="iphone-16 scale-90 -my-6" id="gallery-edit_socket"></div>
        </div>

        <!-- Screen 8: Add New Modal -->
        <div class="flex flex-col items-center">
          <span class="text-xs font-bold text-[#8E95A5] mb-2">Frame 65: Add New Modal</span>
          <div class="iphone-16 scale-90 -my-6" id="gallery-add_new_modal"></div>
        </div>

        <!-- Screen 9: Add Socket Scan -->
        <div class="flex flex-col items-center">
          <span class="text-xs font-bold text-[#8E95A5] mb-2">iPhone 16 - 10: Searching</span>
          <div class="iphone-16 scale-90 -my-6" id="gallery-add_socket_scan"></div>
        </div>

        <!-- Screen 10: Add Socket Discovered -->
        <div class="flex flex-col items-center">
          <span class="text-xs font-bold text-[#8E95A5] mb-2">iPhone 16 - 11: Discovered</span>
          <div class="iphone-16 scale-90 -my-6" id="gallery-add_socket_discovered"></div>
        </div>

        <!-- Screen 11: Add Socket Selected -->
        <div class="flex flex-col items-center">
          <span class="text-xs font-bold text-[#8E95A5] mb-2">iPhone 16 - 12: Ready to Connect</span>
          <div class="iphone-16 scale-90 -my-6" id="gallery-add_socket_selected"></div>
        </div>

        <!-- Screen 12: Configure Socket -->
        <div class="flex flex-col items-center">
          <span class="text-xs font-bold text-[#8E95A5] mb-2">iPhone 16 - 13: Setup Details</span>
          <div class="iphone-16 scale-90 -my-6" id="gallery-configure_socket"></div>
        </div>

        <!-- Screen 13: Add Room -->
        <div class="flex flex-col items-center">
          <span class="text-xs font-bold text-[#8E95A5] mb-2">iPhone 16 - 9: Add Room</span>
          <div class="iphone-16 scale-90 -my-6" id="gallery-add_room"></div>
        </div>

        <!-- Screen 14: Socket Success -->
        <div class="flex flex-col items-center">
          <span class="text-xs font-bold text-[#8E95A5] mb-2">iPhone 16 - 21: Success</span>
          <div class="iphone-16 scale-90 -my-6" id="gallery-socket_success"></div>
        </div>

      </div>
    </div>

  </main>

  <!-- ==================== LOGIC & TEMPLATES JAVASCRIPT ==================== -->
  <script>
    // Global Application State
    const AppState = {
      currentScreen: 'home',
      activeTab: 0, // 0: Home, 1: Rooms, 2: Telemetry, 3: Settings
      selectedRoomFilter: 'bedroom',
      sockets: [
        { id: 'socket_1', name: 'Socket 1', roomId: 'bedroom', isOn: true, isScheduleEnabled: true, year: 2025, month: 'Sept', day: 7, onTime: '08:00 AM', offTime: '13:00 PM' },
        { id: 'socket_2', name: 'Socket 2', roomId: 'bedroom', isOn: true, isScheduleEnabled: true, year: 2025, month: 'Sept', day: 7, onTime: '08:00 AM', offTime: '13:00 PM' },
        { id: 'socket_3', name: 'Socket 3', roomId: 'bedroom', isOn: false, isScheduleEnabled: true, year: 2025, month: 'Sept', day: 7, onTime: '08:00 AM', offTime: '13:00 PM', swiped: false },
        { id: 'socket_4', name: 'Socket 4', roomId: 'bedroom', isOn: true, isScheduleEnabled: true, year: 2025, month: 'Sept', day: 7, onTime: '08:00 AM', offTime: '13:00 PM' },
        { id: 'socket_k1', name: 'Kitchen Socket 1', roomId: 'kitchen', isOn: true },
        { id: 'socket_k2', name: 'Kitchen Socket 2', roomId: 'kitchen', isOn: false },
        { id: 'socket_k3', name: 'Kitchen Socket 3', roomId: 'kitchen', isOn: true },
        { id: 'socket_l1', name: 'Living Socket 1', roomId: 'living', isOn: true },
        { id: 'socket_l2', name: 'Living Socket 2', roomId: 'living', isOn: true },
        { id: 'socket_l3', name: 'Living Socket 3', roomId: 'living', isOn: true },
        { id: 'socket_l4', name: 'Living Socket 4', roomId: 'living', isOn: true },
        { id: 'socket_l5', name: 'Living Socket 5', roomId: 'living', isOn: true },
      ],
      rooms: [
        { id: 'bedroom', name: 'Bedroom', image: '/assets/images/bedroom_photo.png', usageKw: 46.2 },
        { id: 'kitchen', name: 'Kitchen', image: '/assets/images/kitchen_photo.png', usageKw: 13.8 },
        { id: 'living', name: 'Living Room', image: '/assets/images/living_photo.png', usageKw: 76.2 },
      ],
      discoveredSockets: ['Socket MXH-76809', 'Socket MXH-45236'],
      selectedDiscoveredSocket: 'Socket MXH-76809',
      editingSocketId: 'socket_1',
      totalActiveCount: 17,
    };

    function recalculateActiveCount() {
      const activeInBedroom = AppState.sockets.filter(s => s.roomId === 'bedroom' && s.isOn).length;
      AppState.totalActiveCount = 13 + activeInBedroom; // baseline for demo realism
    }

    // Common Status Bar
    function renderStatusBar(isDarkText = false) {
      const textColor = isDarkText ? 'text-black' : 'text-white';
      return `
        <div class="flex justify-between items-center px-6 pt-3 pb-2 text-xs font-semibold ${textColor} select-none z-40">
          <span>9:41</span>
          <div class="flex items-center gap-1.5">
            <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L4.35 18.25c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l.64-.64C7.93 20.26 9.88 21 12 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm0 16c-3.87 0-7-3.13-7-7 0-1.66.58-3.18 1.55-4.39l9.84 9.84C15.18 18.42 13.66 19 12 19zm5.45-2.61L7.61 6.55C8.82 5.58 10.34 5 12 5c3.87 0 7 3.13 7 7 0 1.66-.58 3.18-1.55 4.39z"/></svg>
            <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 4C7.31 4 3.07 5.9 0 8.98L12 21 24 8.98C20.93 5.9 16.69 4 12 4z"/></svg>
            <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M17 4h-3V2h-4v2H7v18h10V4z"/></svg>
          </div>
        </div>
      `;
    }

    // Common Floating Bottom Navigation Bar
    function renderFloatingNav(activeIndex = 0) {
      return `
        <div class="absolute bottom-5 left-0 right-0 flex justify-center z-40 px-6 pointer-events-auto">
          <div class="floating-nav flex items-center gap-7">
            <!-- Tab 0: Home -->
            <button onclick="navigateTab(0)" class="relative flex items-center justify-center p-2 text-white transition">
              ${activeIndex === 0 ? `
                <div class="w-10 h-10 rounded-full bg-[#3B82F6] flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                  <svg class="w-5 h-5 text-white fill-current" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
                </div>
              ` : `
                <svg class="w-5 h-5 text-[#8E95A5] hover:text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"/></svg>
              `}
            </button>

            <!-- Tab 1: Rooms -->
            <button onclick="navigateTab(1)" class="relative flex items-center justify-center p-2 text-white transition">
              ${activeIndex === 1 ? `
                <div class="w-10 h-10 rounded-full bg-[#3B82F6] flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                  <svg class="w-5 h-5 text-white fill-current" viewBox="0 0 24 24"><path d="M4 4h7v7H4zm0 9h7v7H4zm9-9h7v7h-7zm0 9h7v7h-7z"/></svg>
                </div>
              ` : `
                <svg class="w-5 h-5 text-[#8E95A5] hover:text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"/></svg>
              `}
            </button>

            <!-- Tab 2: Telemetry -->
            <button onclick="navigateTab(2)" class="relative flex items-center justify-center p-2 text-white transition">
              <svg class="w-5 h-5 text-[#8E95A5] hover:text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"/></svg>
            </button>

            <!-- Tab 3: Settings -->
            <button onclick="navigateTab(3)" class="relative flex items-center justify-center p-2 text-white transition">
              <svg class="w-5 h-5 text-[#8E95A5] hover:text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            </button>
          </div>
        </div>
      `;
    }

    // ==================== SCREEN RENDERING FUNCTIONS ====================

    // 1. Splash Screen (iPhone 16 - 1)
    function renderSplashScreen() {
      return `
        <div class="flex-1 flex flex-col justify-between bg-gradient-to-b from-[#0F172A] to-[#0A0D14] p-6 text-white cursor-pointer" onclick="jumpToScreen('onboarding')">
          ${renderStatusBar()}
          <div class="my-auto flex flex-col items-center">
            <div class="flex items-center gap-2">
              <svg class="w-8 h-8 text-[#F97316] fill-current animate-pulse" viewBox="0 0 24 24"><path d="M7 2v11h3v9l7-12h-4l4-8z"/></svg>
              <span class="text-3xl font-extrabold tracking-tight">VoltPass</span>
            </div>
            <p class="text-xs text-[#64748B] mt-2">Tap anywhere to continue</p>
          </div>
          <div class="home-indicator"></div>
        </div>
      `;
    }

    // 2. Onboarding Screen (iPhone 16 - 2)
    function renderOnboardingScreen() {
      return `
        <div class="flex-1 flex flex-col relative text-white bg-black">
          <!-- Background Image -->
          <img src="/assets/images/onboarding_bg.png" class="absolute inset-0 w-full h-full object-cover opacity-85" alt="Interior Architecture" onerror="this.src='/assets/images/bedroom_photo.png'">
          <div class="absolute inset-0 bg-gradient-to-b from-black/50 via-black/10 to-black/80"></div>

          ${renderStatusBar()}

          <div class="relative z-10 flex-1 flex flex-col justify-between p-6">
            <div class="pt-10">
              <h2 class="text-3xl font-extrabold leading-tight tracking-tight text-white drop-shadow-md">
                Experience the<br>
                Future of smart<br>
                living.
              </h2>
            </div>

            <div class="pb-2">
              <!-- Slide to get started capsule -->
              <div id="slider-track" class="w-full h-14 bg-[#1E293B]/70 backdrop-blur-md border border-[#334155]/60 rounded-full flex items-center p-1.5 relative overflow-hidden cursor-pointer" onclick="jumpToScreen('login')">
                <div id="slider-knob" class="w-11 h-11 rounded-full bg-[#3B82F6] flex items-center justify-center text-white shadow-lg transition-transform">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"/></svg>
                </div>
                <span class="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white/90 pointer-events-none">
                  Slide to get started
                </span>
                <div class="ml-auto w-11 h-11 rounded-full bg-[#18202F] flex items-center justify-center text-white/70">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>
                </div>
              </div>
              <div class="home-indicator"></div>
            </div>
          </div>
        </div>
      `;
    }

    // 3. Login Screen (iPhone 16 - 4)
    function renderLoginScreen() {
      return `
        <div class="flex-1 flex flex-col justify-between bg-[#121214] p-6 text-white">
          <div>
            ${renderStatusBar()}
            <div class="pt-6 pb-8 flex justify-center items-center gap-2">
              <svg class="w-7 h-7 text-[#F97316] fill-current" viewBox="0 0 24 24"><path d="M7 2v11h3v9l7-12h-4l4-8z"/></svg>
              <span class="text-2xl font-extrabold tracking-tight">VoltPass</span>
            </div>

            <!-- Email Field -->
            <div class="mb-4">
              <label class="text-xs text-[#8E95A5] font-medium block mb-1.5">Email</label>
              <div class="bg-[#131B2A] border border-[#1E293B] rounded-xl px-4 py-3 text-sm text-white">
                Emma@gmail.com
              </div>
            </div>

            <!-- Password Field -->
            <div class="mb-6">
              <label class="text-xs text-[#8E95A5] font-medium block mb-1.5">Password</label>
              <div class="bg-[#131B2A] border border-[#1E293B] rounded-xl px-4 py-3 text-sm text-white flex justify-between items-center">
                <span class="tracking-widest">••••••••••••</span>
                <svg class="w-4 h-4 text-[#64748B] cursor-pointer" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              </div>
            </div>

            <!-- Login Button -->
            <button onclick="jumpToScreen('home')" class="w-full h-12 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-white font-bold text-sm shadow-[0_4px_16px_rgba(59,130,246,0.4)] transition mb-3">
              Login
            </button>

            <!-- Sign Up Button -->
            <button onclick="jumpToScreen('home')" class="w-full h-12 rounded-xl bg-[#131A26] border border-[#2C4370] text-[#3B82F6] font-semibold text-sm transition mb-6">
              Sign up
            </button>

            <div class="text-center text-xs text-[#64748B] mb-5">Or</div>

            <!-- Social Logins -->
            <div class="space-y-3">
              <button onclick="jumpToScreen('home')" class="w-full h-11 rounded-xl bg-[#131A26] border border-[#2C4370] text-white font-medium text-xs flex items-center justify-center gap-2.5">
                <svg class="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/><path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.27 21.36 7.34 24 12 24z"/><path fill="#FBBC05" d="M5.28 14.27a7.17 7.17 0 010-4.54V6.58H1.25a11.96 11.96 0 000 10.84l4.03-3.15z"/><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.27 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/></svg>
                Sign in with Google
              </button>

              <button onclick="jumpToScreen('home')" class="w-full h-11 rounded-xl bg-[#131A26] border border-[#2C4370] text-white font-medium text-xs flex items-center justify-center gap-2.5">
                <svg class="w-4 h-4 fill-current text-white" viewBox="0 0 170 170"><path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.05-7.66-7.85-11.92-14.41-6.1-9.35-10.82-19.8-14.16-31.35-3.34-11.55-5.01-22.38-5.01-32.48 0-13.48 3.51-24.84 10.53-34.08 7.02-9.24 16.03-13.98 27.03-14.22 5.01 0 10.35 1.27 16.03 3.81 5.68 2.54 9.61 3.86 11.78 3.97 1.63 0 5.66-1.38 12.09-4.13 6.43-2.75 12.03-3.92 16.82-3.5 12.51.87 22.42 5.66 29.74 14.37-10.88 6.64-16.21 15.68-15.99 27.12.22 8.92 3.63 16.36 10.23 22.33 6.6 5.97 14.44 9.47 23.52 10.5-2.28 6.86-5.05 13.72-8.31 20.58zM119.22 33.15c0-7.39 2.66-14.47 7.98-21.24 5.32-6.77 11.97-11.13 19.95-13.08.43 1.09.65 2.23.65 3.42 0 7.39-2.77 14.63-8.31 21.72-5.54 7.09-12.29 11.47-20.27 13.14-.43-1.09-.65-2.23-.65-3.42z"/></svg>
                Sign in with apple
              </button>
            </div>
          </div>

          <div class="home-indicator"></div>
        </div>
      `;
    }

    // 4. Home Screen (iPhone 16 - 8)
    function renderHomeScreen() {
      recalculateActiveCount();
      const bedroomSockets = AppState.sockets.filter(s => s.roomId === 'bedroom');

      return `
        <div class="flex-1 flex flex-col relative bg-[#121214] text-white overflow-hidden">
          <!-- Blue Header Top -->
          <div class="bg-[#3B82F6] px-5 pt-3 pb-14 text-white relative">
            ${renderStatusBar()}
            <div class="flex justify-between items-center mt-2 px-1">
              <div class="w-6"></div>
              <h2 class="font-bold text-base tracking-tight">Hello, Emma</h2>
              <button onclick="openAddNewModal()" class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>
              </button>
            </div>
          </div>

          <!-- Overlapping Energy Usage Card -->
          <div class="px-5 -mt-10 relative z-20">
            <div class="bg-[#181A20] border border-[#272A32] rounded-3xl p-5 shadow-2xl">
              <h3 class="text-xs font-bold text-white text-center mb-3">Energy Usage</h3>
              <div class="flex items-center justify-around">
                <div class="text-center flex-1">
                  <div class="text-xs text-[#8E95A5] mb-1 font-medium">Active sockets</div>
                  <div class="text-2xl font-extrabold text-[#22C55E]" id="active-sockets-counter">${AppState.totalActiveCount}</div>
                </div>
                <div class="w-[1px] h-9 bg-[#2A2D36]"></div>
                <div class="text-center flex-1">
                  <div class="text-xs text-[#8E95A5] mb-1 font-medium">Today</div>
                  <div class="text-2xl font-extrabold text-[#3B82F6]">76,2<span class="text-sm font-bold">Kw</span></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Room Filter Pills -->
          <div class="flex items-center gap-2 px-5 mt-4 overflow-x-auto py-1">
            <button onclick="setRoomFilter('bedroom')" class="px-4 py-2 rounded-full text-xs font-semibold ${AppState.selectedRoomFilter === 'bedroom' ? 'bg-[#3B82F6] text-white shadow-md' : 'bg-[#181A20] text-[#8E95A5]'} transition">Bedroom</button>
            <button onclick="setRoomFilter('living')" class="px-4 py-2 rounded-full text-xs font-semibold ${AppState.selectedRoomFilter === 'living' ? 'bg-[#3B82F6] text-white shadow-md' : 'bg-[#181A20] text-[#8E95A5]'} transition">Living Room</button>
            <button onclick="setRoomFilter('kitchen')" class="px-4 py-2 rounded-full text-xs font-semibold ${AppState.selectedRoomFilter === 'kitchen' ? 'bg-[#3B82F6] text-white shadow-md' : 'bg-[#181A20] text-[#8E95A5]'} transition">Kitchen</button>
          </div>

          <!-- Sockets(4) Grid Section -->
          <div class="flex-1 px-5 mt-3 overflow-y-auto pb-24">
            <div class="flex justify-between items-center mb-3">
              <span class="font-bold text-base text-white">Sockets(${bedroomSockets.length})</span>
              <button onclick="openAddNewModal()" class="text-white hover:text-[#3B82F6]">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>
              </button>
            </div>

            <!-- 2x2 Socket Cards -->
            <div class="grid grid-cols-2 gap-3.5">
              ${bedroomSockets.map(socket => `
                <div class="bg-[#181A20] border border-[#272A32] rounded-2xl p-3.5 flex flex-col justify-between h-32 relative">
                  <div class="flex justify-between items-center">
                    <!-- Wall Socket Outlet Icon -->
                    <div class="w-7 h-7 rounded-lg bg-[#20242D] border border-[#2B313E] flex items-center justify-center">
                      <div class="flex gap-1">
                        <div class="w-0.5 h-2.5 bg-[#8E95A5] rounded-full"></div>
                        <div class="w-0.5 h-2.5 bg-[#8E95A5] rounded-full"></div>
                      </div>
                    </div>
                    <!-- Edit Pencil Icon -->
                    <button onclick="openEditSocket('${socket.id}')" class="text-[#8E95A5] hover:text-white">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"/></svg>
                    </button>
                  </div>

                  <div class="flex justify-between items-end mt-auto">
                    <span class="text-sm font-bold text-white">${socket.name}</span>
                    <div class="custom-switch ${socket.isOn ? 'active' : ''}" onclick="toggleSocket('${socket.id}')">
                      <div class="knob"></div>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          ${renderFloatingNav(0)}
        </div>
      `;
    }

    // 5. Rooms Screen (iPhone 16 - 20)
    function renderRoomsScreen() {
      return `
        <div class="flex-1 flex flex-col relative bg-[#121214] text-white overflow-hidden">
          <!-- Blue Header -->
          <div class="bg-[#3B82F6] px-5 pt-3 pb-8 text-white">
            ${renderStatusBar()}
            <div class="flex justify-between items-center mt-2 px-1">
              <div class="w-6"></div>
              <h2 class="font-bold text-base tracking-tight">Rooms(3)</h2>
              <button onclick="openAddNewModal()" class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>
              </button>
            </div>
          </div>

          <!-- Dark Curved Sheet with Rooms List -->
          <div class="bg-[#121214] rounded-t-[32px] -mt-4 pt-5 px-5 flex-1 overflow-y-auto pb-24 space-y-4">
            
            <!-- Room 1: Bedroom -->
            <div onclick="jumpToScreen('room_detail')" class="rounded-3xl overflow-hidden bg-[#181A20] border border-[#272A32] cursor-pointer hover:border-[#3B82F6]/50 transition group">
              <div class="h-28 overflow-hidden relative">
                <img src="/assets/images/bedroom_photo.png" class="w-full h-full object-cover group-hover:scale-105 transition duration-300" alt="Bedroom">
                <div class="absolute inset-0 bg-black/20"></div>
              </div>
              <div class="p-4 bg-[#181E29] border-t border-[#252D3D] flex justify-between items-center">
                <div>
                  <h4 class="font-bold text-sm text-white">Bedroom</h4>
                  <p class="text-xs text-[#8E95A5] mt-0.5">4 active sockets</p>
                </div>
                <div class="text-right">
                  <span class="text-[11px] text-[#8E95A5] block">Current usage</span>
                  <span class="text-sm font-extrabold text-[#3B82F6]">46,2Kw</span>
                </div>
              </div>
            </div>

            <!-- Room 2: Kitchen -->
            <div onclick="jumpToScreen('room_detail')" class="rounded-3xl overflow-hidden bg-[#181A20] border border-[#272A32] cursor-pointer hover:border-[#3B82F6]/50 transition group">
              <div class="h-28 overflow-hidden relative">
                <img src="/assets/images/kitchen_photo.png" class="w-full h-full object-cover group-hover:scale-105 transition duration-300" alt="Kitchen">
                <div class="absolute inset-0 bg-black/20"></div>
              </div>
              <div class="p-4 bg-[#181E29] border-t border-[#252D3D] flex justify-between items-center">
                <div>
                  <h4 class="font-bold text-sm text-white">Kitchen</h4>
                  <p class="text-xs text-[#8E95A5] mt-0.5">3 active sockets</p>
                </div>
                <div class="text-right">
                  <span class="text-[11px] text-[#8E95A5] block">Current usage</span>
                  <span class="text-sm font-extrabold text-[#3B82F6]">13,8Kw</span>
                </div>
              </div>
            </div>

            <!-- Room 3: Living Room -->
            <div onclick="jumpToScreen('room_detail')" class="rounded-3xl overflow-hidden bg-[#181A20] border border-[#272A32] cursor-pointer hover:border-[#3B82F6]/50 transition group">
              <div class="h-28 overflow-hidden relative">
                <img src="/assets/images/living_photo.png" class="w-full h-full object-cover group-hover:scale-105 transition duration-300" alt="Living Room">
                <div class="absolute inset-0 bg-black/20"></div>
              </div>
              <div class="p-4 bg-[#181E29] border-t border-[#252D3D] flex justify-between items-center">
                <div>
                  <h4 class="font-bold text-sm text-white">Living Room</h4>
                  <p class="text-xs text-[#8E95A5] mt-0.5">5 active sockets</p>
                </div>
                <div class="text-right">
                  <span class="text-[11px] text-[#8E95A5] block">Current usage</span>
                  <span class="text-sm font-extrabold text-[#3B82F6]">76,2Kw</span>
                </div>
              </div>
            </div>

          </div>

          ${renderFloatingNav(1)}
        </div>
      `;
    }

    // 6. Room Detail Screen (iPhone 16 - 15) with Swiped Socket 3
    function renderRoomDetailScreen() {
      const bedroomSockets = AppState.sockets.filter(s => s.roomId === 'bedroom');

      return `
        <div class="flex-1 flex flex-col relative bg-[#121214] text-white overflow-hidden">
          
          <!-- Hero Photographic Header -->
          <div class="relative h-44 overflow-hidden flex-shrink-0">
            <img src="/assets/images/bedroom_photo.png" class="w-full h-full object-cover" alt="Bedroom Header">
            <div class="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/80"></div>
            
            <div class="absolute inset-0 flex flex-col">
              ${renderStatusBar()}
              <div class="flex justify-between items-center px-5 mt-1">
                <button onclick="jumpToScreen('rooms')" class="text-white hover:text-white/80 p-1">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"/></svg>
                </button>
                <h2 class="font-bold text-base text-white">Bedroom</h2>
                <div class="w-6"></div>
              </div>
            </div>
          </div>

          <!-- Overlapping Body -->
          <div class="bg-[#121214] rounded-t-[32px] -mt-6 pt-4 px-5 flex-1 overflow-y-auto pb-24 z-20">
            
            <!-- Energy Usage Card -->
            <div class="bg-[#181A20] border border-[#272A32] rounded-3xl p-5 shadow-2xl mb-5">
              <h3 class="text-xs font-bold text-white text-center mb-3">Energy Usage</h3>
              <div class="flex items-center justify-around">
                <div class="text-center flex-1">
                  <div class="text-xs text-[#8E95A5] mb-1 font-medium">Active sockets</div>
                  <div class="text-2xl font-extrabold text-[#22C55E]">4</div>
                </div>
                <div class="w-[1px] h-9 bg-[#2A2D36]"></div>
                <div class="text-center flex-1">
                  <div class="text-xs text-[#8E95A5] mb-1 font-medium">Today</div>
                  <div class="text-2xl font-extrabold text-[#3B82F6]">48,2<span class="text-sm font-bold">Kw</span></div>
                </div>
              </div>
            </div>

            <!-- Sockets(4) Header -->
            <div class="flex justify-between items-center mb-3">
              <span class="font-bold text-base text-white">Sockets(4)</span>
              <button onclick="openAddNewModal()" class="text-white hover:text-[#3B82F6]">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>
              </button>
            </div>

            <!-- Vertical List of Sockets -->
            <div class="space-y-3">
              <!-- Socket 1 -->
              <div class="h-14 bg-[#181A20] border border-[#272A32] rounded-2xl px-4 flex items-center justify-between">
                <span class="text-sm font-bold text-white">Socket 1</span>
                <div class="custom-switch active" onclick="toggleSocket('socket_1')">
                  <div class="knob"></div>
                </div>
              </div>

              <!-- Socket 2 -->
              <div class="h-14 bg-[#181A20] border border-[#272A32] rounded-2xl px-4 flex items-center justify-between">
                <span class="text-sm font-bold text-white">Socket 2</span>
                <div class="custom-switch active" onclick="toggleSocket('socket_2')">
                  <div class="knob"></div>
                </div>
              </div>

              <!-- Socket 3: SWIPED TO REVEAL ACTIONS (Exact iPhone 16 - 15 Mockup) -->
              <div class="h-14 rounded-2xl overflow-hidden relative flex bg-[#181A20] border border-[#272A32]">
                <!-- Partial Socket Body Swiped Left -->
                <div class="flex-1 flex items-center justify-between px-4 bg-[#181A20]">
                  <span class="text-sm font-bold text-white">Socket 3</span>
                  <div class="custom-switch active mr-2" onclick="toggleSocket('socket_3')">
                    <div class="knob"></div>
                  </div>
                </div>

                <!-- Revealed Actions: Orange Edit & Red Delete -->
                <div class="flex h-full">
                  <!-- Orange Edit Button -->
                  <button onclick="openEditSocket('socket_3')" class="w-16 bg-[#E65100] hover:bg-[#F57C00] text-white flex flex-col items-center justify-center transition">
                    <svg class="w-4 h-4 mb-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"/></svg>
                    <span class="text-[10px] font-bold">Edit</span>
                  </button>

                  <!-- Red Delete Button -->
                  <button onclick="deleteSocket('socket_3')" class="w-16 bg-[#DC2626] hover:bg-[#EF4444] text-white flex flex-col items-center justify-center transition">
                    <svg class="w-4 h-4 mb-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/></svg>
                    <span class="text-[10px] font-bold">Delete</span>
                  </button>
                </div>
              </div>

              <!-- Socket 4 -->
              <div class="h-14 bg-[#181A20] border border-[#272A32] rounded-2xl px-4 flex items-center justify-between">
                <span class="text-sm font-bold text-white">Socket 4</span>
                <div class="custom-switch active" onclick="toggleSocket('socket_4')">
                  <div class="knob"></div>
                </div>
              </div>
            </div>

          </div>

          ${renderFloatingNav(1)}
        </div>
      `;
    }

    // 7. Edit Socket Screen (iPhone 16 - 18 & 19)
    function renderEditSocketScreen() {
      const socket = AppState.sockets.find(s => s.id === AppState.editingSocketId) || AppState.sockets[0];

      return `
        <div class="flex-1 flex flex-col justify-between bg-[#121214] p-5 text-white overflow-y-auto">
          <div>
            ${renderStatusBar()}

            <!-- Top Edit Bar -->
            <div class="flex justify-between items-center pt-2 pb-6">
              <button onclick="jumpToScreen('home')" class="text-white hover:text-white/80 p-1">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"/></svg>
              </button>
              <h2 class="font-bold text-base text-white">Edit</h2>
              <button onclick="jumpToScreen('home')" class="text-[#3B82F6] hover:text-[#60A5FA] font-bold text-sm">Done</button>
            </div>

            <!-- Socket Header Row with Switch -->
            <div class="flex justify-between items-center py-2 mb-4">
              <span class="text-lg font-bold text-white">${socket.name}</span>
              <div class="custom-switch active" onclick="this.classList.toggle('active')">
                <div class="knob"></div>
              </div>
            </div>

            <!-- Socket Name Input -->
            <div class="mb-4">
              <label class="text-xs text-[#8E95A5] font-medium block mb-1.5">Enter socket name</label>
              <input type="text" value="${socket.name}" class="w-full bg-[#182334] border border-[#263750] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#3B82F6]">
            </div>

            <!-- Room Dropdown -->
            <div class="mb-6">
              <label class="text-xs text-[#8E95A5] font-medium block mb-1.5">Enter room name</label>
              <div class="bg-[#182334] border border-[#263750] rounded-xl px-4 py-3 text-sm text-white flex justify-between items-center cursor-pointer">
                <span>Bedroom</span>
                <svg class="w-4 h-4 text-[#8E95A5]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"/></svg>
              </div>
            </div>

            <!-- Schedule Card -->
            <div class="bg-[#181A20] border border-[#272A32] rounded-3xl p-5 mb-4">
              <div class="flex justify-between items-center mb-4">
                <span class="font-bold text-base text-white">Schedule</span>
                <div class="custom-switch active" onclick="this.classList.toggle('active')">
                  <div class="knob"></div>
                </div>
              </div>
              <div class="h-[1px] bg-[#2A2D36] mb-4"></div>

              <!-- Date Picker Pills -->
              <div class="grid grid-cols-3 gap-2 mb-5">
                <div class="bg-[#182334] border border-[#263750] rounded-xl py-2 px-3 flex justify-between items-center text-xs font-semibold text-white">
                  <span>2025</span>
                  <svg class="w-3.5 h-3.5 text-[#8E95A5]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"/></svg>
                </div>
                <div class="bg-[#182334] border border-[#263750] rounded-xl py-2 px-3 flex justify-between items-center text-xs font-semibold text-white">
                  <span>Sept</span>
                  <svg class="w-3.5 h-3.5 text-[#8E95A5]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"/></svg>
                </div>
                <div class="bg-[#182334] border border-[#263750] rounded-xl py-2 px-3 flex justify-between items-center text-xs font-semibold text-white">
                  <span>7</span>
                  <svg class="w-3.5 h-3.5 text-[#8E95A5]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"/></svg>
                </div>
              </div>

              <!-- Time Row -->
              <div class="flex justify-between items-center">
                <div>
                  <div class="text-[11px] text-[#8E95A5] mb-1 font-medium">On Time</div>
                  <div class="text-sm font-bold text-white">08:00 AM</div>
                </div>
                <div>
                  <div class="text-[11px] text-[#8E95A5] mb-1 font-medium text-right">Off Time</div>
                  <div class="text-sm font-bold text-white">13:00 PM</div>
                </div>
              </div>
            </div>
          </div>

          <div class="home-indicator"></div>
        </div>
      `;
    }

    // 8. Add New Bottom Sheet Modal (Frame 65)
    function renderAddNewModal() {
      return `
        <div class="flex-1 flex flex-col justify-end bg-black/75 text-white p-4 relative backdrop-blur-sm" onclick="jumpToScreen('home')">
          <div class="bg-[#1E1E22] border border-[#2E313A] rounded-[32px] p-6 shadow-2xl space-y-4" onclick="event.stopPropagation()">
            <div class="w-10 h-1 bg-[#3A3D47] rounded-full mx-auto mb-2"></div>
            <h3 class="font-bold text-base text-center text-white mb-4">Add new</h3>

            <button onclick="jumpToScreen('add_socket_scan')" class="w-full h-13 py-3.5 rounded-2xl bg-[#182334] hover:bg-[#1E2E46] border border-[#263750] font-bold text-sm text-white transition flex items-center justify-center">
              Socket
            </button>

            <button onclick="jumpToScreen('add_room')" class="w-full h-13 py-3.5 rounded-2xl bg-[#182334] hover:bg-[#1E2E46] border border-[#263750] font-bold text-sm text-white transition flex items-center justify-center">
              Room
            </button>
          </div>
        </div>
      `;
    }

    // 9. Add Socket - Searching (iPhone 16 - 10)
    function renderAddSocketScan() {
      return `
        <div class="flex-1 flex flex-col bg-[#121214] text-white">
          <div class="bg-[#3B82F6] px-5 pt-3 pb-12 text-white">
            ${renderStatusBar()}
            <div class="flex items-center justify-between mt-2">
              <button onclick="jumpToScreen('home')" class="text-white hover:text-white/80">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"/></svg>
              </button>
              <h3 class="text-white font-bold text-base">Add Socket</h3>
              <div class="w-5"></div>
            </div>
          </div>

          <div class="bg-[#121214] rounded-t-[32px] -mt-6 pt-10 px-6 flex-1 flex flex-col justify-between pb-6">
            <div class="flex flex-col items-center">
              <!-- Radar Scan Graphic -->
              <div class="w-28 h-28 rounded-3xl bg-[#161E2C] border border-[#24344B] flex items-center justify-center mb-8 radar-pulse">
                <div class="relative w-14 h-14">
                  <div class="w-8 h-12 rounded-lg border-2 border-[#4A6894] flex flex-col items-center justify-center gap-1">
                    <div class="w-1 h-3 bg-[#4A6894] rounded-sm"></div>
                    <div class="w-1.5 h-1.5 rounded-full bg-[#4A6894]"></div>
                  </div>
                  <svg class="w-8 h-8 text-[#4A6894] absolute -top-1 -right-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0"/></svg>
                </div>
              </div>

              <p class="text-sm font-medium text-[#8E95A5] mb-6">Searching for a new socket.....</p>
              
              <div class="w-7 h-7 border-2 border-white/20 border-t-white rounded-full animate-spin mb-6"></div>

              <button onclick="jumpToScreen('add_socket_discovered')" class="text-xs text-[#3B82F6] hover:underline mb-4 font-semibold">
                (Click here to simulate device found)
              </button>

              <button onclick="jumpToScreen('home')" class="text-sm font-semibold text-[#8E95A5] hover:text-white">Cancel</button>
            </div>

            <div class="home-indicator"></div>
          </div>
        </div>
      `;
    }

    // 10. Add Socket - Discovered Devices (iPhone 16 - 11)
    function renderAddSocketDiscovered() {
      return `
        <div class="flex-1 flex flex-col bg-[#121214] text-white">
          <div class="bg-[#3B82F6] px-5 pt-3 pb-12 text-white">
            ${renderStatusBar()}
            <div class="flex items-center justify-between mt-2">
              <button onclick="jumpToScreen('add_socket_scan')" class="text-white hover:text-white/80">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"/></svg>
              </button>
              <h3 class="text-white font-bold text-base">Add Socket</h3>
              <div class="w-5"></div>
            </div>
          </div>

          <div class="bg-[#121214] rounded-t-[32px] -mt-6 pt-6 px-6 flex-1 flex flex-col justify-between pb-6">
            <div>
              <div class="w-24 h-24 rounded-3xl bg-[#161E2C] border border-[#24344B] flex items-center justify-center mx-auto mb-6">
                <div class="w-8 h-12 rounded-lg border-2 border-[#4A6894] flex flex-col items-center justify-center gap-1">
                  <div class="w-1 h-3 bg-[#4A6894] rounded-sm"></div>
                  <div class="w-1.5 h-1.5 rounded-full bg-[#4A6894]"></div>
                </div>
              </div>

              <label class="text-xs text-[#8E95A5] font-medium block mb-2">Select socket</label>
              
              <div class="bg-[#182334] border border-[#263750] rounded-2xl overflow-hidden mb-6">
                <div onclick="jumpToScreen('add_socket_selected')" class="px-4 py-3.5 text-sm font-semibold text-white hover:bg-[#202E44] cursor-pointer flex justify-between items-center">
                  <span>Socket MXH-76809</span>
                </div>
                <div class="h-[1px] bg-[#263750] mx-4"></div>
                <div class="px-4 py-3.5 text-sm font-semibold text-white hover:bg-[#202E44] cursor-pointer flex justify-between items-center">
                  <span>Socket MXH-45236</span>
                </div>
              </div>
            </div>

            <div>
              <button class="w-full h-12 rounded-xl bg-[#172335] text-[#5A6E8C] font-bold text-sm mb-4 cursor-not-allowed">
                Connect
              </button>
              <div class="home-indicator"></div>
            </div>
          </div>
        </div>
      `;
    }

    // 11. Add Socket - Device Selected (iPhone 16 - 12)
    function renderAddSocketSelected() {
      return `
        <div class="flex-1 flex flex-col bg-[#121214] text-white">
          <div class="bg-[#3B82F6] px-5 pt-3 pb-12 text-white">
            ${renderStatusBar()}
            <div class="flex items-center justify-between mt-2">
              <button onclick="jumpToScreen('add_socket_discovered')" class="text-white hover:text-white/80">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"/></svg>
              </button>
              <h3 class="text-white font-bold text-base">Add Socket</h3>
              <div class="w-5"></div>
            </div>
          </div>

          <div class="bg-[#121214] rounded-t-[32px] -mt-6 pt-6 px-6 flex-1 flex flex-col justify-between pb-6">
            <div>
              <div class="w-24 h-24 rounded-3xl bg-[#161E2C] border border-[#24344B] flex items-center justify-center mx-auto mb-6">
                <div class="w-8 h-12 rounded-lg border-2 border-[#4A6894] flex flex-col items-center justify-center gap-1">
                  <div class="w-1 h-3 bg-[#4A6894] rounded-sm"></div>
                  <div class="w-1.5 h-1.5 rounded-full bg-[#4A6894]"></div>
                </div>
              </div>

              <label class="text-xs text-[#8E95A5] font-medium block mb-2">Select socket</label>
              
              <div class="bg-[#182334] border border-[#263750] rounded-2xl overflow-hidden mb-6">
                <!-- Selected row with Checkmark -->
                <div class="px-4 py-3.5 text-sm font-semibold text-white bg-[#1e2e46]/50 flex justify-between items-center">
                  <span>Socket MXH-76809</span>
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>
                </div>
                <div class="h-[1px] bg-[#263750] mx-4"></div>
                <div class="px-4 py-3.5 text-sm font-semibold text-white flex justify-between items-center">
                  <span>Socket MXH-45236</span>
                </div>
              </div>
            </div>

            <div>
              <button onclick="jumpToScreen('configure_socket')" class="w-full h-12 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-white font-bold text-sm shadow-[0_4px_16px_rgba(59,130,246,0.4)] transition mb-4">
                Connect
              </button>
              <div class="home-indicator"></div>
            </div>
          </div>
        </div>
      `;
    }

    // 12. Configure Socket Screen (iPhone 16 - 13)
    function renderConfigureSocketScreen() {
      return `
        <div class="flex-1 flex flex-col bg-[#121214] text-white">
          <div class="bg-[#3B82F6] px-5 pt-3 pb-12 text-white">
            ${renderStatusBar()}
            <div class="flex items-center justify-between mt-2">
              <button onclick="jumpToScreen('add_socket_selected')" class="text-white hover:text-white/80">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"/></svg>
              </button>
              <h3 class="text-white font-bold text-base">Add Room</h3>
              <button onclick="jumpToScreen('socket_success')" class="text-white font-bold text-sm">Done</button>
            </div>
          </div>

          <div class="bg-[#121214] rounded-t-[32px] -mt-6 pt-6 px-6 flex-1 flex flex-col justify-between pb-6">
            <div>
              <!-- Add Picture Container -->
              <div class="flex justify-center mb-6 mt-2">
                <div class="w-36 h-36 rounded-3xl bg-[#182334]/50 border border-[#2C3E5A] flex flex-col items-center justify-center cursor-pointer shadow-lg hover:border-[#3B82F6] transition">
                  <svg class="w-9 h-9 text-[#3B82F6] mb-1.5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"/></svg>
                  <span class="text-[#3B82F6] font-semibold text-xs">Add picture</span>
                </div>
              </div>

              <!-- Enter Socket Name -->
              <div class="mb-4">
                <label class="text-xs text-[#8E95A5] font-medium block mb-1.5">Enter socket name</label>
                <input type="text" value="Socket MXH-76809" class="w-full bg-[#182334] border border-[#263750] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#3B82F6]">
              </div>

              <!-- Enter Room Name -->
              <div>
                <label class="text-xs text-[#8E95A5] font-medium block mb-1.5">Enter room name</label>
                <div class="bg-[#182334] border border-[#263750] rounded-xl px-4 py-3 text-sm text-white flex justify-between items-center cursor-pointer">
                  <span>Kitchen</span>
                  <svg class="w-4 h-4 text-[#8E95A5]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"/></svg>
                </div>
              </div>
            </div>

            <div class="home-indicator"></div>
          </div>
        </div>
      `;
    }

    // 13. Add Room Screen (iPhone 16 - 9)
    function renderAddRoomScreen() {
      return `
        <div class="flex-1 flex flex-col bg-[#121214] text-white">
          <div class="bg-[#3B82F6] px-5 pt-3 pb-12 text-white">
            ${renderStatusBar()}
            <div class="flex items-center justify-between mt-2">
              <button onclick="jumpToScreen('home')" class="text-white hover:text-white/80">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"/></svg>
              </button>
              <h3 class="text-white font-bold text-base">Add Room</h3>
              <button onclick="jumpToScreen('rooms')" class="text-white font-bold text-sm">Done</button>
            </div>
          </div>

          <div class="bg-[#121214] rounded-t-[32px] -mt-6 pt-6 px-6 flex-1 flex flex-col justify-between pb-6">
            <div>
              <!-- Picture Placeholder Box -->
              <div class="flex justify-center mb-6 mt-4">
                <div class="w-40 h-40 rounded-3xl bg-[#182334]/50 border border-[#2C3E5A] flex flex-col items-center justify-center cursor-pointer shadow-lg hover:border-[#3B82F6] transition">
                  <svg class="w-10 h-10 text-[#3B82F6] mb-1.5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"/></svg>
                  <span class="text-[#3B82F6] font-semibold text-xs">Add picture</span>
                </div>
              </div>

              <!-- Enter Room Name Input -->
              <div>
                <label class="text-xs text-[#8E95A5] font-medium block mb-1.5">Enter room name</label>
                <input type="text" placeholder="Enter" class="w-full bg-[#182334] border border-[#263750] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#3B82F6]">
              </div>
            </div>

            <div class="home-indicator"></div>
          </div>
        </div>
      `;
    }

    // 14. Congratulations Success Screen (iPhone 16 - 21)
    function renderSocketSuccessScreen() {
      return `
        <div class="flex-1 flex flex-col justify-between bg-[#121214] p-6 text-white">
          ${renderStatusBar()}

          <div class="my-auto flex flex-col items-center">
            <!-- Glowing Green Halo Badge -->
            <div class="w-32 h-32 rounded-full bg-[#1E5836]/70 border-2 border-[#2C7D4F] flex items-center justify-center shadow-[0_0_40px_rgba(34,197,94,0.35)] mb-8">
              <div class="w-20 h-20 rounded-full bg-[#22C55E] flex items-center justify-center shadow-lg">
                <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>
              </div>
            </div>

            <!-- Message -->
            <p class="text-center text-sm font-medium text-[#E2E8F0] leading-relaxed max-w-[240px]">
              Congratulations!! you have<br>
              successfully added a new<br>
              socket.
            </p>
          </div>

          <div>
            <button onclick="jumpToScreen('home')" class="w-full h-12 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-white font-bold text-sm shadow-[0_4px_16px_rgba(59,130,246,0.4)] transition mb-4">
              Proceed
            </button>
            <div class="home-indicator"></div>
          </div>
        </div>
      `;
    }

    // ==================== INTERACTION HANDLERS ====================

    function renderScreen(screenId) {
      switch (screenId) {
        case 'splash': return renderSplashScreen();
        case 'onboarding': return renderOnboardingScreen();
        case 'login': return renderLoginScreen();
        case 'home': return renderHomeScreen();
        case 'rooms': return renderRoomsScreen();
        case 'room_detail': return renderRoomDetailScreen();
        case 'edit_socket': return renderEditSocketScreen();
        case 'add_new_modal': return renderAddNewModal();
        case 'add_socket_scan': return renderAddSocketScan();
        case 'add_socket_discovered': return renderAddSocketDiscovered();
        case 'add_socket_selected': return renderAddSocketSelected();
        case 'configure_socket': return renderConfigureSocketScreen();
        case 'add_room': return renderAddRoomScreen();
        case 'socket_success': return renderSocketSuccessScreen();
        default: return renderHomeScreen();
      }
    }

    function updateActiveScreen() {
      const mount = document.getElementById('screen-mount');
      if (mount) {
        mount.innerHTML = renderScreen(AppState.currentScreen);
      }
      
      const badge = document.getElementById('active-screen-badge');
      if (badge) {
        badge.innerText = `Current Screen: ${AppState.currentScreen.toUpperCase().replace('_', ' ')}`;
      }

      const select = document.getElementById('screen-select');
      if (select && select.value !== AppState.currentScreen) {
        select.value = AppState.currentScreen;
      }
    }

    function jumpToScreen(screenId) {
      AppState.currentScreen = screenId;
      updateActiveScreen();
    }

    function navigateTab(tabIndex) {
      AppState.activeTab = tabIndex;
      if (tabIndex === 0) {
        jumpToScreen('home');
      } else if (tabIndex === 1) {
        jumpToScreen('rooms');
      } else if (tabIndex === 2) {
        alert('Live IoT Telemetry: Power, Current, TinyML inference active.');
      } else if (tabIndex === 3) {
        alert('Device Settings: ESP32 MQTT broker connected.');
      }
    }

    function toggleSocket(socketId) {
      const socket = AppState.sockets.find(s => s.id === socketId);
      if (socket) {
        socket.isOn = !socket.isOn;
        updateActiveScreen();
      }
    }

    function setRoomFilter(roomId) {
      AppState.selectedRoomFilter = roomId;
      updateActiveScreen();
    }

    function openEditSocket(socketId) {
      AppState.editingSocketId = socketId;
      jumpToScreen('edit_socket');
    }

    function deleteSocket(socketId) {
      const index = AppState.sockets.findIndex(s => s.id === socketId);
      if (index !== -1) {
        const deletedName = AppState.sockets[index].name;
        AppState.sockets.splice(index, 1);
        alert(`${deletedName} was deleted.`);
        updateActiveScreen();
      }
    }

    function openAddNewModal() {
      jumpToScreen('add_new_modal');
    }

    function resetAppState() {
      AppState.sockets = [
        { id: 'socket_1', name: 'Socket 1', roomId: 'bedroom', isOn: true },
        { id: 'socket_2', name: 'Socket 2', roomId: 'bedroom', isOn: true },
        { id: 'socket_3', name: 'Socket 3', roomId: 'bedroom', isOn: true, swiped: false },
        { id: 'socket_4', name: 'Socket 4', roomId: 'bedroom', isOn: true },
      ];
      AppState.selectedRoomFilter = 'bedroom';
      AppState.currentScreen = 'home';
      updateActiveScreen();
    }

    function switchViewMode(mode) {
      const interactiveView = document.getElementById('interactive-view');
      const galleryView = document.getElementById('gallery-view');
      const btnInteractive = document.getElementById('btn-mode-interactive');
      const btnGallery = document.getElementById('btn-mode-gallery');

      if (mode === 'gallery') {
        interactiveView.classList.add('hidden');
        galleryView.classList.remove('hidden');
        btnGallery.classList.add('bg-[#3B82F6]', 'text-white', 'shadow');
        btnGallery.classList.remove('text-[#94A3B8]');
        btnInteractive.classList.remove('bg-[#3B82F6]', 'text-white', 'shadow');
        btnInteractive.classList.add('text-[#94A3B8]');

        // Populate Gallery Screen Containers
        const galleryScreens = [
          'splash', 'onboarding', 'login', 'home', 'rooms', 'room_detail',
          'edit_socket', 'add_new_modal', 'add_socket_scan', 'add_socket_discovered',
          'add_socket_selected', 'configure_socket', 'add_room', 'socket_success'
        ];
        galleryScreens.forEach(id => {
          const el = document.getElementById(`gallery-${id}`);
          if (el) {
            el.innerHTML = `
              <div class="dynamic-island"></div>
              <div class="w-full h-full flex flex-col relative overflow-hidden">
                ${renderScreen(id)}
              </div>
            `;
          }
        });
      } else {
        galleryView.classList.add('hidden');
        interactiveView.classList.remove('hidden');
        btnInteractive.classList.add('bg-[#3B82F6]', 'text-white', 'shadow');
        btnInteractive.classList.remove('text-[#94A3B8]');
        btnGallery.classList.remove('bg-[#3B82F6]', 'text-white', 'shadow');
        btnGallery.classList.add('text-[#94A3B8]');
      }
    }

    // Initialize Simulator on Load
    window.addEventListener('DOMContentLoaded', () => {
      updateActiveScreen();
    });
  </script>
</body>
</html>
'''

with open('public/index.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

print("Successfully generated public/index.html with all 14 screens and interactive features!")

