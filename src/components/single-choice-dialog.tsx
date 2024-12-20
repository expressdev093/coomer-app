import React, {useState} from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Button,
  ScrollView,
} from 'react-native';

type SingleChoiceDialogProps = {
  options: string[]; // Accepts an array of string options
  onSelect: (selectedOption: string) => void; // Callback function to return selected option
  isOpen: boolean; // Controls whether the modal is open or not
  onClose: () => void; // Callback function to close the modal
};

const SingleChoiceDialog: React.FC<SingleChoiceDialogProps> = ({
  options,
  onSelect,
  isOpen,
  onClose,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    onSelect(option); // Pass the selected option to the parent via the callback
    onClose(); // Close the modal after selecting an option
  };

  return (
    <View style={styles.container}>
      <Text style={styles.selectedText}>
        Selected Option: {selectedOption || 'None'}
      </Text>

      <Modal
        visible={isOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={onClose} // Close modal if the back button is pressed
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select an Option</Text>

            {/* Make the list scrollable */}
            <ScrollView
              style={styles.optionList}
              contentContainerStyle={styles.optionListContent}>
              {options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.option}
                  onPress={() => handleOptionSelect(option)}>
                  <Text style={styles.optionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedText: {
    marginBottom: 20,
    fontSize: 18,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Background overlay
  },
  modalContent: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  optionList: {
    width: '100%',
    maxHeight: 300, // Limit the height of the scrollable area
  },
  optionListContent: {
    paddingBottom: 20, // Padding for better appearance at the bottom
  },
  option: {
    padding: 10,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  optionText: {
    fontSize: 16,
  },
  cancelButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
  },
  cancelButtonText: {
    fontSize: 16,
    color: 'black',
  },
});

export default SingleChoiceDialog;
