import 'package:intl/intl.dart';

class Formatters {
  static final DateFormat _timeFormat = DateFormat('HH:mm:ss');
  static final DateFormat _dateTimeFormat = DateFormat('MMM dd, yyyy HH:mm');
  static final NumberFormat _powerFormat = NumberFormat('#,##0.0', 'en_US');
  static final NumberFormat _currencyFormat = NumberFormat.currency(symbol: '\$', decimalDigits: 2);

  static String formatTime(DateTime time) => _timeFormat.format(time);
  
  static String formatDateTime(DateTime dateTime) => _dateTimeFormat.format(dateTime);

  static String formatWatts(double watts) {
    if (watts >= 1000) {
      return '${(watts / 1000).toStringAsFixed(2)} kW';
    }
    return '${_powerFormat.format(watts)} W';
  }

  static String formatEnergy(double kwh) {
    return '${kwh.toStringAsFixed(3)} kWh';
  }

  static String formatVoltage(double volts) {
    return '${volts.toStringAsFixed(1)} V';
  }

  static String formatCurrent(double amps) {
    return '${amps.toStringAsFixed(2)} A';
  }

  static String formatCurrency(double amount) {
    return _currencyFormat.format(amount);
  }
}

