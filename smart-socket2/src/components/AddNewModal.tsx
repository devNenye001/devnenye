import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TouchableWithoutFeedback } from 'react-native';

interface AddNewModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectSocket: () => void;
  onSelectRoom: () => void;
}

export const AddNewModal: React.FC<AddNewModalProps> = ({
  visible,
  onClose,
  onSelectSocket,
  onSelectRoom,
}) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={styles.sheetContainer}>
              <View style={styles.dragBar} />
              <Text style={styles.title}>Add new</Text>

              <TouchableOpacity
                style={styles.actionButton}
                activeOpacity={0.8}
                onPress={() => {
                  onClose();
                  onSelectSocket();
                }}
              >
                <Text style={styles.actionButtonText}>Socket</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                activeOpacity={0.8}
                onPress={() => {
                  onClose();
                  onSelectRoom();
                }}
              >
                <Text style={styles.actionButtonText}>Room</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  sheetContainer: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: '#161B26',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#2D3748',
  },
  dragBar: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#334155',
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 24,
  },
  actionButton: {
    backgroundColor: '#1E2533',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#2A3446',
  },
  actionButtonText: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '600',
  },
});

