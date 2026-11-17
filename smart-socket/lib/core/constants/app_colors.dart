import 'package:flutter/material.dart';

class AppColors {
  // Brand & Backgrounds (Exact sampled colors from UI)
  static const Color headerBlue = Color(0xFF3B82F6);       // Vibrant Royal Blue
  static const Color background = Color(0xFF121214);       // Deep Charcoal/Obsidian background
  static const Color surface = Color(0xFF1E1E22);          // Card surface (#1E1E1E - #1E1E22)
  static const Color surfaceLight = Color(0xFF28282E);     // Dark borders & sub-elements
  static const Color card = Color(0xFF1F1F23);
  static const Color cardSocket = Color(0xFF1F1F22);        // Socket 2x2 grid card background

  // Floating Navigation Bar
  static const Color navBarBg = Color(0xFF25262B);         // Floating pill background
  static const Color navActiveBlue = Color(0xFF1476FF);     // Active blue circular bubble
  static const Color navInactive = Color(0xFF8E95A5);       // Inactive navigation icon

  // Accents & Metric Colors
  static const Color primary = Color(0xFF3B82F6);          // Primary Royal Blue
  static const Color primaryGlow = Color(0x333B82F6);
  static const Color secondary = Color(0xFF6366F1);
  static const Color activeGreen = Color(0xFF33BD6F);       // Active sockets green ("17")
  static const Color energyBlue = Color(0xFF4679EC);        // Energy usage blue ("76,2Kw")

  // Filter Chips
  static const Color chipActiveBg = Color(0xFF347BFF);     // Selected room chip
  static const Color chipInactiveBg = Color(0xFF212124);   // Unselected room chip
  static const Color chipInactiveText = Color(0xFF9E9E9E); // Unselected chip text

  // Switches
  static const Color switchThumbActive = Color(0xFF307FFE);
  static const Color switchTrackActive = Color(0xFF1E2638);
  static const Color switchThumbInactive = Color(0xFF555964);
  static const Color switchTrackInactive = Color(0xFF181A1F);

  // Room Card Overlay
  static const Color roomCardOverlay = Color(0xE820293D);   // Translucent dark blue-slate overlay
  static const Color roomCardDivider = Color(0xFF2D374D);   // Divider in room card overlay

  // Power & Safety Statuses (Maintained for Telemetry, Alerts & AI engine)
  static const Color safeGreen = Color(0xFF33BD6F);
  static const Color safeGreenGlow = Color(0x3333BD6F);
  static const Color warningAmber = Color(0xFFF59E0B);
  static const Color warningAmberGlow = Color(0x33F59E0B);
  static const Color dangerRed = Color(0xFFEF4444);
  static const Color dangerRedGlow = Color(0x33EF4444);

  // PZEM-004T Specific Metrics
  static const Color voltage = Color(0xFF38BDF8);
  static const Color current = Color(0xFFF43F5E);
  static const Color power = Color(0xFF33BD6F);
  static const Color energy = Color(0xFFA855F7);
  static const Color powerFactor = Color(0xFFFBBF24);

  // Text & Neutrals
  static const Color textPrimary = Color(0xFFFFFFFF);
  static const Color textSecondary = Color(0xFF8E95A5);
  static const Color textMuted = Color(0xFF64748B);
  static const Color divider = Color(0xFF2E323B);
}
