import React from 'react';
import { View, Text, StyleSheet, Modal, ScrollView, Pressable } from 'react-native';

interface RulesScreenProps {
  visible: boolean;
  onClose: () => void;
}

const RulesScreen: React.FC<RulesScreenProps> = ({ visible, onClose }) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
      presentationStyle="overFullScreen"
      supportedOrientations={['landscape-left', 'landscape-right']}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Backgammon Rules</Text>
          
          <ScrollView style={styles.scrollView}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Objective</Text>
              <Text style={styles.text}>
                Move all your checkers around the board and bear them off. The first player to bear off all 15 checkers wins.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Setup</Text>
              <Text style={styles.text}>
                Each player starts with 15 checkers placed on specific points. White moves clockwise, Black moves counter-clockwise.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Moving</Text>
              <Text style={styles.text}>
                Roll two dice and move your checkers the number of points shown. You can move one checker the total of both dice, or two checkers separately.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Hitting</Text>
              <Text style={styles.text}>
                If you land on a point with a single opponent checker (blot), that checker is hit and sent to the bar.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Bearing Off</Text>
              <Text style={styles.text}>
                Once all your checkers are in your home board, you can start bearing them off. You must bear off if possible.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Scoring</Text>
              <Text style={styles.text}>
                Normal win: 1 point. Gammon (opponent hasn't borne off any): 2 points. Backgammon (opponent has checkers in your home or on bar): 3 points.
              </Text>
            </View>
          </ScrollView>

          <Pressable
            style={styles.closeButton}
            onPress={onClose}
          >
            <Text style={styles.buttonText}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#D2B48C',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxWidth: 500,
    maxHeight: '80%',
    borderWidth: 3,
    borderColor: '#8B4513',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 20,
    textAlign: 'center',
  },
  scrollView: {
    maxHeight: 400,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#654321',
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    color: '#654321',
    lineHeight: 20,
  },
  closeButton: {
    backgroundColor: '#8B4513',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RulesScreen;
