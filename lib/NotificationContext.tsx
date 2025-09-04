import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { COLORS, FONTS, styles } from '../app/costants';


type LevelUpNotification = {
    type: 'levelUp'
    level: number
    message: string
}

interface NotificationContextType {
  showLevelUpNotification: (newLevel: number) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notification, setNotification] = useState<LevelUpNotification | null>(null);

  const showLevelUpNotification = (newLevel: number): void => {
    setNotification({
      type: 'levelUp',
      level: newLevel,
      message: `Congratulations! You've reached level ${newLevel}!`
    });
  };

  const hideNotification = (): void => {
    setNotification(null);
  };

  return (
    <NotificationContext.Provider value={{ showLevelUpNotification }}>
      {children}
      
      {/* Global Level Up Modal */}
      <Modal
        visible={notification?.type === 'levelUp'}
        transparent={true}
        animationType="fade"
        onRequestClose={hideNotification}
      >
        <View style={modalStyles.modalBackground}>
          <View style={modalStyles.modalView}>
            <Text style={styles.headerText}> Level Up! </Text>
            <Text style={{ color: COLORS.BORDER, fontFamily: FONTS.BODY }}>{notification?.message}</Text>
            <Text style={{ color: COLORS.BORDER, fontFamily: FONTS.BODY }}>Level {notification?.level}</Text>
            <Pressable 
              style={styles.button} 
              onPress={hideNotification}
            >
              <Text style={{ fontFamily: FONTS.BODY }}>Continue</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </NotificationContext.Provider>
  );
};

const modalStyles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: COLORS.DARK_PURPLE,
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    minWidth: 280,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
