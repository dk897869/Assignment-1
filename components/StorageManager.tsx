import AsyncStorage from '@react-native-async-storage/async-storage';

export interface StoredFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  bio: string;
  country: string;
  gender: string;
  acceptTerms: boolean;
  hobbies: string[];
  dateOfBirth: string | null;
  resume: any;
  submittedAt: string;
}

export class StorageManager {
  private static readonly FORM_DATA_KEY = 'signupFormData';
  private static readonly SUBMITTED_FORMS_KEY = 'submittedForms';

  // Save current form data (for auto-save functionality)
  static async saveFormData(data: any): Promise<void> {
    try {
      const jsonData = JSON.stringify(data);
      await AsyncStorage.setItem(this.FORM_DATA_KEY, jsonData);
      console.log('Form data saved to storage');
    } catch (error) {
      console.error('Error saving form data:', error);
      throw error;
    }
  }

  // Get saved form data
  static async getFormData(): Promise<any | null> {
    try {
      const jsonData = await AsyncStorage.getItem(this.FORM_DATA_KEY);
      return jsonData ? JSON.parse(jsonData) : null;
    } catch (error) {
      console.error('Error retrieving form data:', error);
      return null;
    }
  }

  // Save completed registration
  static async saveCompletedRegistration(data: StoredFormData): Promise<void> {
    try {
      // Get existing submitted forms
      const existingForms = await this.getSubmittedForms();
      
      // Add new form to the list
      const updatedForms = [...existingForms, data];
      
      // Save updated list
      await AsyncStorage.setItem(this.SUBMITTED_FORMS_KEY, JSON.stringify(updatedForms));
      
      // Clear the current form data since it's now submitted
      await this.clearFormData();
      
      console.log('Registration saved successfully');
    } catch (error) {
      console.error('Error saving registration:', error);
      throw error;
    }
  }

  // Get all submitted forms
  static async getSubmittedForms(): Promise<StoredFormData[]> {
    try {
      const jsonData = await AsyncStorage.getItem(this.SUBMITTED_FORMS_KEY);
      return jsonData ? JSON.parse(jsonData) : [];
    } catch (error) {
      console.error('Error retrieving submitted forms:', error);
      return [];
    }
  }

  // Clear current form data
  static async clearFormData(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.FORM_DATA_KEY);
      console.log('Form data cleared');
    } catch (error) {
      console.error('Error clearing form data:', error);
      throw error;
    }
  }

  // Clear all data
  static async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([this.FORM_DATA_KEY, this.SUBMITTED_FORMS_KEY]);
      console.log('All data cleared');
    } catch (error) {
      console.error('Error clearing all data:', error);
      throw error;
    }
  }

  // Get storage statistics
  static async getStorageStats(): Promise<{
    hasCurrentForm: boolean;
    submittedFormsCount: number;
    lastSubmissionDate: string | null;
  }> {
    try {
      const currentForm = await this.getFormData();
      const submittedForms = await this.getSubmittedForms();
      
      return {
        hasCurrentForm: !!currentForm,
        submittedFormsCount: submittedForms.length,
        lastSubmissionDate: submittedForms.length > 0 
          ? submittedForms[submittedForms.length - 1].submittedAt 
          : null,
      };
    } catch (error) {
      console.error('Error getting storage stats:', error);
      return {
        hasCurrentForm: false,
        submittedFormsCount: 0,
        lastSubmissionDate: null,
      };
    }
  }
}
