import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'core/theme/app_theme.dart';
import 'core/constants/app_constants.dart';
import 'providers/socket_provider.dart';
import 'providers/alert_provider.dart';
import 'providers/ai_analytics_provider.dart';
import 'services/storage_service.dart';
import 'screens/splash_screen.dart';

class SmartSocketApp extends StatelessWidget {
  final StorageService storageService;

  const SmartSocketApp({
    super.key,
    required this.storageService,
  });

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider<AlertProvider>(
          create: (_) {
            final alertProv = AlertProvider();
            alertProv.init(storageService);
            return alertProv;
          },
        ),
        ChangeNotifierProvider<AiAnalyticsProvider>(
          create: (_) {
            final aiProv = AiAnalyticsProvider();
            aiProv.init(storageService);
            return aiProv;
          },
        ),
        ChangeNotifierProxyProvider2<AlertProvider, AiAnalyticsProvider, SocketProvider>(
          create: (ctx) {
            final socketProv = SocketProvider();
            socketProv.init(storageService, ctx.read<AlertProvider>());
            return socketProv;
          },
          update: (ctx, alertProv, aiProv, socketProv) {
            if (socketProv != null) {
              // Update prediction whenever fresh metrics are processed
              aiProv.updateWithMetrics(socketProv.metrics);
            }
            return socketProv!;
          },
        ),
      ],
      child: MaterialApp(
        title: AppConstants.appName,
        debugShowCheckedModeBanner: false,
        theme: AppTheme.darkTheme,
        home: const SplashScreen(),
      ),
    );
  }
}

