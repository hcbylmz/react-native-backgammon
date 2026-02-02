import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, Modal, Pressable } from 'react-native';

interface BaseModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  animationType?: 'slide' | 'none';
  headerStyle?: object;
  headerBackgroundColor?: string;
  containerStyle?: object;
  titleStyle?: object;
}

const BaseModal: React.FC<BaseModalProps> = ({
  visible,
  onClose,
  title,
  children,
  animationType = 'none',
  headerStyle,
  headerBackgroundColor,
  containerStyle,
  titleStyle,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType={animationType}
      onRequestClose={onClose}
      presentationStyle="overFullScreen"
      supportedOrientations={['landscape-left', 'landscape-right']}
    >
      <View style={styles.overlayContainer}>
        <View style={styles.overlay} />
        <View style={[styles.modalContainer, containerStyle]}>
          <View style={[styles.header, headerStyle, headerBackgroundColor && { backgroundColor: headerBackgroundColor }]}>
            <Text style={[styles.title, titleStyle]}>{title}</Text>
            <Pressable
              style={styles.closeButton}
              onPress={onClose}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </Pressable>
          </View>
          {children}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlayContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContainer: {
    backgroundColor: '#D2B48C',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxWidth: 600,
    maxHeight: '85%',
    borderWidth: 3,
    borderColor: '#8B4513',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#8B4513',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B4513',
    flex: 1,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#8B4513',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 20,
  },
});

export default BaseModal;
