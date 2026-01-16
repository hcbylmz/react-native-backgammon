import React from 'react';
import { View, Text, StyleSheet, Modal, ScrollView, Pressable } from 'react-native';

interface FAQScreenProps {
  visible: boolean;
  onClose: () => void;
}

const FAQScreen: React.FC<FAQScreenProps> = ({ visible, onClose }) => {
  const faqs = [
    {
      q: 'What is a forced move?',
      a: 'When both dice can be played but only the larger die can be played legally, you must use the larger die.',
    },
    {
      q: 'Can I pass my turn?',
      a: 'No, you must make a move if one is available. If no legal moves exist, your turn passes automatically.',
    },
    {
      q: 'What is the doubling cube?',
      a: 'The doubling cube allows players to double the stakes. The opponent can accept (cube doubles) or reject (doubler wins).',
    },
    {
      q: 'How do I bear off?',
      a: 'Once all checkers are in your home board, tap a checker and then tap the bearing off area to remove it.',
    },
  ];

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
          <Text style={styles.title}>Frequently Asked Questions</Text>
          
          <ScrollView style={styles.scrollView}>
            {faqs.map((faq, index) => (
              <View key={index} style={styles.faqItem}>
                <Text style={styles.question}>{faq.q}</Text>
                <Text style={styles.answer}>{faq.a}</Text>
              </View>
            ))}
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
  faqItem: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#8B4513',
  },
  question: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#654321',
    marginBottom: 8,
  },
  answer: {
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

export default FAQScreen;
