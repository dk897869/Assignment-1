import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { FormInput } from './FormInput';
import { Toast } from './Toast';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface FormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  bio: string;
  country: string;
  gender: string;
  acceptTerms: boolean;
  hobbies: string[];
  dateOfBirth: Date | null;
}

interface FormErrors {
  [key: string]: string;
}

export const SignupForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    bio: '',
    country: '',
    gender: '',
    acceptTerms: false,
    hobbies: [],
    dateOfBirth: null,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [toast, setToast] = useState({
    visible: false,
    message: '',
    type: 'success' as 'success' | 'error' | 'info',
  });

  const countryOptions = [
    { label: 'United States', value: 'us' },
    { label: 'Canada', value: 'ca' },
    { label: 'United Kingdom', value: 'uk' },
    { label: 'Australia', value: 'au' },
    { label: 'Germany', value: 'de' },
  ];

  const genderOptions = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' },
    { label: 'Prefer not to say', value: 'prefer_not_to_say' },
  ];

  const hobbyOptions = [
    { label: 'Reading', value: 'reading' },
    { label: 'Sports', value: 'sports' },
    { label: 'Music', value: 'music' },
    { label: 'Travel', value: 'travel' },
    { label: 'Cooking', value: 'cooking' },
    { label: 'Gaming', value: 'gaming' },
  ];

  const handleInputChange = (name: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Full Name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }

    // Confirm Password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Bio validation
    if (!formData.bio.trim()) {
      newErrors.bio = 'Bio is required';
    } else if (formData.bio.trim().length < 10) {
      newErrors.bio = 'Bio must be at least 10 characters';
    }

    // Country validation
    if (!formData.country) {
      newErrors.country = 'Please select a country';
    }

    // Gender validation
    if (!formData.gender) {
      newErrors.gender = 'Please select a gender';
    }

    // Terms validation
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions';
    }

    // Date of Birth validation
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    } else {
      const age = new Date().getFullYear() - formData.dateOfBirth.getFullYear();
      if (age < 13) {
        newErrors.dateOfBirth = 'You must be at least 13 years old';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({
      visible: true,
      message,
      type,
    });
  };

  const hideToast = () => {
    setToast(prev => ({
      ...prev,
      visible: false,
    }));
  };

  const saveFormDataToStorage = async (data: FormData) => {
    try {
      const storageData = {
        ...data,
        dateOfBirth: data.dateOfBirth ? data.dateOfBirth.toISOString() : null,
      };
      const jsonData = JSON.stringify(storageData);
      await AsyncStorage.setItem('signupFormData', jsonData);
      console.log('Form data saved to storage successfully');
    } catch (error) {
      console.error('Error saving form data to storage:', error);
    }
  };

  const getStoredFormData = async () => {
    try {
      const jsonData = await AsyncStorage.getItem('signupFormData');
      return jsonData ? JSON.parse(jsonData) : null;
    } catch (error) {
      console.error('Error retrieving form data from storage:', error);
      return null;
    }
  };

  const clearStoredFormData = async () => {
    try {
      await AsyncStorage.removeItem('signupFormData');
      console.log('Stored form data cleared');
    } catch (error) {
      console.error('Error clearing stored form data:', error);
    }
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      const formattedData = {
        ...formData,
        dateOfBirth: formData.dateOfBirth?.toISOString().split('T')[0],
        submittedAt: new Date().toISOString(),
      };

      try {
        await saveFormDataToStorage(formData);
        console.log('Form submitted successfully:', JSON.stringify(formattedData, null, 2));
        showToast('Successfully registered! Data saved to storage.', 'success');

        Alert.alert(
          'Registration Successful! 🎉',
          `Welcome ${formData.fullName}!\n\nYour registration data has been saved successfully.`,
          [
            {
              text: 'View Storage',
              onPress: async () => {
                const storedData = await getStoredFormData();
                Alert.alert('Stored Data', JSON.stringify(storedData, null, 2));
              },
            },
            {
              text: 'Clear Storage',
              onPress: async () => {
                await clearStoredFormData();
                showToast('Storage cleared successfully', 'info');
              },
            },
            { text: 'OK' },
          ]
        );

        // Optionally reset form after successful submission
        // resetForm();
      } catch (error) {
        console.error('Error during form submission:', error);
        showToast('Registration failed. Please try again.', 'error');
      }
    } else {
      showToast('Please fix the errors in the form', 'error');
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      bio: '',
      country: '',
      gender: '',
      acceptTerms: false,
      hobbies: [],
      dateOfBirth: null,
    });
    setErrors({});
  };

  React.useEffect(() => {
    const loadStoredData = async () => {
      const storedData = await getStoredFormData();
      if (storedData) {
        showToast('Previous form data found in storage', 'info');
      }
    };
    loadStoredData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={hideToast}
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Fill in your information to get started</Text>
        </View>

        <View style={styles.form}>
          <FormInput
            type="text"
            name="fullName"
            label="Full Name"
            value={formData.fullName}
            onChange={handleInputChange}
            placeholder="Enter your full name"
            error={errors.fullName}
            required
          />

          <FormInput
            type="email"
            name="email"
            label="Email Address"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
            error={errors.email}
            required
          />

          <FormInput
            type="password"
            name="password"
            label="Password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Enter your password"
            error={errors.password}
            required
          />

          <FormInput
            type="password"
            name="confirmPassword"
            label="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder="Confirm your password"
            error={errors.confirmPassword}
            required
          />

          <FormInput
            type="textarea"
            name="bio"
            label="Bio"
            value={formData.bio}
            onChange={handleInputChange}
            placeholder="Tell us about yourself..."
            error={errors.bio}
            required
          />

          <FormInput
            type="dropdown"
            name="country"
            label="Country"
            value={formData.country}
            onChange={handleInputChange}
            placeholder="Select your country"
            options={countryOptions}
            error={errors.country}
            required
          />

          <FormInput
            type="radio"
            name="gender"
            label="Gender"
            value={formData.gender}
            onChange={handleInputChange}
            options={genderOptions}
            error={errors.gender}
            required
          />

          <FormInput
            type="checkbox-group"
            name="hobbies"
            label="Hobbies (Optional)"
            value={formData.hobbies}
            onChange={handleInputChange}
            options={hobbyOptions}
            multiple
          />

          <FormInput
            type="date"
            name="dateOfBirth"
            label="Date of Birth"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
            placeholder="Select your date of birth"
            error={errors.dateOfBirth}
            required
          />

          <FormInput
            type="checkbox"
            name="acceptTerms"
            label="Terms & Conditions"
            value={formData.acceptTerms}
            onChange={handleInputChange}
            placeholder="I accept the terms and conditions"
            error={errors.acceptTerms}
            required
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.secondaryButton, { marginRight: 12 }]} 
              onPress={async () => {
                const storedData = await getStoredFormData();
                if (storedData) {
                  Alert.alert(
                    'Load Stored Data',
                    'Do you want to load your previously saved form data?',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      {
                        text: 'Load',
                        onPress: () => {
                          setFormData({
                            ...storedData,
                            dateOfBirth: storedData.dateOfBirth ? new Date(storedData.dateOfBirth) : null,
                          });
                          showToast('Form data loaded from storage', 'success');
                        },
                      },
                    ]
                  );
                } else {
                  showToast('No stored data found', 'info');
                }
              }}
            >
              <Text style={styles.secondaryButtonText}>Load from Storage</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.secondaryButton, { marginLeft: 12 }]} 
              onPress={() => {
                Alert.alert(
                  'Reset Form',
                  'Are you sure you want to clear all form data?',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Reset',
                      style: 'destructive',
                      onPress: () => {
                        resetForm();
                        showToast('Form reset successfully', 'info');
                      },
                    },
                  ]
                );
              }}
            >
              <Text style={styles.secondaryButtonText}>Reset Form</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  form: {
    padding: 24,
    paddingTop: 0,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 8,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#6c757d',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});