import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import BaseModal from '../ui/BaseModal';

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
    <BaseModal
      visible={visible}
      onClose={onClose}
      title="Frequently Asked Questions"
      animationType="none"
      containerStyle={styles.modalContainer}
    >
      <ScrollView style={styles.scrollView}>
        {faqs.map((faq, index) => (
          <View key={index} style={styles.faqItem}>
            <Text style={styles.question}>{faq.q}</Text>
            <Text style={styles.answer}>{faq.a}</Text>
          </View>
        ))}
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
});

export default FAQScreen;
