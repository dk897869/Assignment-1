import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

interface Option {
  label: string;
  value: string;
}

interface FormInputProps {
  type: 'text' | 'email' | 'password' | 'textarea' | 'dropdown' | 'radio' | 'checkbox' | 'checkbox-group' | 'date';
  name: string;
  label: string;
  value: any;
  onChange: (name: string, value: any) => void;
  placeholder?: string;
  options?: Option[];
  multiple?: boolean;
  error?: string;
  required?: boolean;
}

export const FormInput: React.FC<FormInputProps> = ({
  type,
  name,
  label,
  value,
  onChange,
  placeholder,
  options = [],
  multiple = false,
  error,
  required = false,
}) => {
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      onChange(name, selectedDate);
    }
  };

  const renderInput = () => {
    switch (type) {
      case 'text':
      case 'email':
        return (
          <TextInput
            style={[styles.textInput, error && styles.inputError]}
            value={value || ''}
            onChangeText={(text) => onChange(name, text)}
            placeholder={placeholder}
            keyboardType={type === 'email' ? 'email-address' : 'default'}
            autoCapitalize={type === 'email' ? 'none' : 'sentences'}
            autoCorrect={false}
          />
        );

      case 'password':
        return (
          <TextInput
            style={[styles.textInput, error && styles.inputError]}
            value={value || ''}
            onChangeText={(text) => onChange(name, text)}
            placeholder={placeholder}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />
        );

      case 'textarea':
        return (
          <TextInput
            style={[styles.textInput, styles.textArea, error && styles.inputError]}
            value={value || ''}
            onChangeText={(text) => onChange(name, text)}
            placeholder={placeholder}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        );

      case 'dropdown':
        return (
          <View>
            <TouchableOpacity
              style={[styles.dropdown, error && styles.inputError]}
              onPress={() => setDropdownOpen(!dropdownOpen)}
            >
              <Text style={value ? styles.dropdownText : styles.dropdownPlaceholder}>
                {value ? options.find((opt) => opt.value === value)?.label : placeholder}
              </Text>
            </TouchableOpacity>
            {dropdownOpen && (
              <View style={styles.dropdownOptions}>
                {options.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={styles.dropdownOption}
                    onPress={() => {
                      onChange(name, option.value);
                      setDropdownOpen(false);
                    }}
                  >
                    <Text style={styles.dropdownOptionText}>{option.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        );

      case 'radio':
        return (
          <View style={styles.radioGroup}>
            {options.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={styles.radioOption}
                onPress={() => onChange(name, option.value)}
              >
                <View style={styles.radioCircle}>
                  {value === option.value && <View style={styles.radioSelected} />}
                </View>
                <Text style={styles.radioText}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        );

      case 'checkbox':
        return (
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => onChange(name, !value)}
          >
            <View style={[styles.checkbox, value && styles.checkboxChecked]}>
              {value && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkboxText}>{placeholder}</Text>
          </TouchableOpacity>
        );

      case 'checkbox-group':
        return (
          <View style={styles.checkboxGroup}>
            {options.map((option) => {
              const isChecked = Array.isArray(value) && value.includes(option.value);
              return (
                <TouchableOpacity
                  key={option.value}
                  style={styles.checkboxContainer}
                  onPress={() => {
                    const currentValues = Array.isArray(value) ? value : [];
                    const newValues = isChecked
                      ? currentValues.filter((v) => v !== option.value)
                      : [...currentValues, option.value];
                    onChange(name, newValues);
                  }}
                >
                  <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
                    {isChecked && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  <Text style={styles.checkboxText}>{option.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        );

      case 'date':
        return (
          <View>
            <TouchableOpacity
              style={[styles.dateInput, error && styles.inputError]}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={value ? styles.dateText : styles.datePlaceholder}>
                {value ? value.toLocaleDateString() : placeholder}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={value || new Date()}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>
      {renderInput()}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  required: {
    color: '#e74c3c',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 100,
  },
  inputError: {
    borderColor: '#e74c3c',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
  dropdownPlaceholder: {
    fontSize: 16,
    color: '#999',
  },
  dropdownOptions: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderTopWidth: 0,
    borderRadius: 8,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    backgroundColor: '#fff',
    maxHeight: 200,
  },
  dropdownOption: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dropdownOptionText: {
    fontSize: 16,
    color: '#333',
  },
  radioGroup: {
    flexDirection: 'column',
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  radioSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#007AFF',
  },
  radioText: {
    fontSize: 16,
    color: '#333',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkboxGroup: {
    flexDirection: 'column',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    backgroundColor: '#fff',
  },
  checkboxChecked: {
    backgroundColor: '#007AFF',
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  checkboxText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  datePlaceholder: {
    fontSize: 16,
    color: '#999',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 14,
    marginTop: 4,
  },
});