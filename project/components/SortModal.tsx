import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Check, X } from 'lucide-react-native';
import { SortOption } from '@/types';

interface SortModalProps {
  visible: boolean;
  onClose: () => void;
  selectedSort: string;
  onSelectSort: (sort: string) => void;
}

const sortOptions: SortOption[] = [
  { label: 'Popularity', value: 'popularity' },
  { label: 'What\'s New', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-low' },
  { label: 'Price: High to Low', value: 'price-high' },
  { label: 'Customer Rating', value: 'rating' },
  { label: 'Better Discount', value: 'discount' },
];

export function SortModal({ visible, onClose, selectedSort, onSelectSort }: SortModalProps) {
  const handleSelect = (value: string) => {
    onSelectSort(value);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>SORT BY</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={20} color="#333" />
            </TouchableOpacity>
          </View>
          
          {sortOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={styles.option}
              onPress={() => handleSelect(option.value)}
            >
              <Text style={[
                styles.optionText,
                selectedSort === option.value && styles.selectedOptionText
              ]}>
                {option.label}
              </Text>
              {selectedSort === option.value && (
                <Check size={18} color="#E91E63" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#333',
    letterSpacing: 0.5,
  },
  closeButton: {
    padding: 4,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  optionText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#333',
  },
  selectedOptionText: {
    fontFamily: 'Inter-SemiBold',
    color: '#E91E63',
  },
});