import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import BaseModal from '../ui/BaseModal';

interface RulesScreenProps {
  visible: boolean;
  onClose: () => void;
}

const RulesScreen: React.FC<RulesScreenProps> = ({ visible, onClose }) => {
  return (
    <BaseModal
      visible={visible}
      onClose={onClose}
      title="Backgammon Rules"
      animationType="none"
      containerStyle={styles.modalContainer}
    >
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
    </BaseModal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    width: '90%',
    maxWidth: 500,
    maxHeight: '80%',
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
});

export default RulesScreen;
