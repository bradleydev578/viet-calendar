/**
 * SettingsScreen
 * App settings and preferences
 */

import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { trackScreenView, trackViewSettings } from '../../services/analytics';
import { SettingToggle } from './SettingToggle';
import { SettingLink } from './SettingLink';
import { InfoModal, type InfoModalType } from './InfoModal';
import { styles } from './styles';

const APP_VERSION = '0.0.1';

export function SettingsScreen() {
  const { settings, loadSettings, toggleLunarDates, toggleHolidays } = useSettingsStore();
  const [infoModalType, setInfoModalType] = useState<InfoModalType>(null);

  // Load settings on mount
  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  // Track screen view on mount
  useEffect(() => {
    trackScreenView('SettingsScreen');
    trackViewSettings();
  }, []);

  const handleAbout = () => {
    Alert.alert(
      'Về ứng dụng',
      'Lịch Việt Vạn Sự An Lành\nỨng dụng lịch vạn niên Việt Nam với phong thủy và ngày tốt xấu.\n\nPhiên bản: ' +
        APP_VERSION,
      [{ text: 'Đóng' }]
    );
  };

  const openInfoModal = (type: InfoModalType) => {
    setInfoModalType(type);
  };

  const closeInfoModal = () => {
    setInfoModalType(null);
  };

  const handleFeedback = () => {
    Alert.alert('Góp ý', 'Vui lòng gửi góp ý về ứng dụng qua email:\nbradley.dev578@gmail.com', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Mở Email',
        onPress: () => Linking.openURL('mailto:bradley.dev578@gmail.com'),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scrollView}>
        {/* Display Section */}
        <Text style={styles.sectionTitle}>Hiển thị</Text>
        <View style={styles.section}>
          <SettingToggle
            label="Hiển thị âm lịch"
            description="Hiển thị ngày âm lịch trên lịch"
            value={settings.showLunarDates}
            onValueChange={toggleLunarDates}
            iconName="calendar-month"
            iconColor="#2196F3"
          />
          <SettingToggle
            label="Hiển thị ngày lễ"
            description="Đánh dấu ngày lễ trên lịch"
            value={settings.showHolidays}
            onValueChange={toggleHolidays}
            iconName="party-popper"
            iconColor="#F44336"
            isLast
          />
        </View>

        {/* App Info Section */}
        <Text style={styles.sectionTitle}>Thông tin ứng dụng</Text>
        <View style={styles.section}>
          <SettingLink
            label="Phiên bản"
            value={APP_VERSION}
            onPress={handleAbout}
            iconName="information-outline"
            iconColor="#4CAF50"
            isLast
          />
        </View>

        {/* Help Section */}
        <Text style={styles.sectionTitle}>Giải thích ký hiệu</Text>
        <View style={styles.section}>
          <SettingLink
            label="28 Sao là gì?"
            description="28 chòm sao trong phong thủy"
            onPress={() => openInfoModal('28sao')}
            iconName="star-outline"
            iconColor="#FFD700"
          />
          <SettingLink
            label="12 Trực là gì?"
            description="12 vị trí của ngày"
            onPress={() => openInfoModal('12truc')}
            iconName="zodiac-sagittarius"
            iconColor="#FF9800"
          />
          <SettingLink
            label="Hoàng đạo giờ"
            description="Các giờ tốt trong ngày"
            onPress={() => openInfoModal('hoangdaogio')}
            iconName="clock-outline"
            iconColor="#9C27B0"
          />
          <SettingLink
            label="Đánh giá chất lượng"
            description="Cách tính điểm ngày (0-100)"
            onPress={() => openInfoModal('danhgia')}
            iconName="chart-line"
            iconColor="#00BCD4"
          />
          <SettingLink
            label="Góp ý"
            description="Gửi phản hồi cho chúng tôi"
            onPress={handleFeedback}
            iconName="email-outline"
            iconColor="#3F51B5"
            isLast
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Lịch Việt Vạn Sự An Lành{'\n'}
            © 2026 - Made with ❤️ in Vietnam
          </Text>
        </View>
      </ScrollView>

      {/* Info Modal */}
      <InfoModal
        visible={infoModalType !== null}
        type={infoModalType}
        onClose={closeInfoModal}
      />
    </SafeAreaView>
  );
}
