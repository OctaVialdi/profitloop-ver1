
  // Method referenced in updateEmploymentDetails
  async saveEmploymentDetails(employmentDetails: any): Promise<any> {
    try {
      console.log("Saving employment details:", employmentDetails);
      
      // Make sure the employee_id exists
      if (!employmentDetails.employee_id) {
        throw new Error('Employee ID is required for saving employment details');
      }
      
      const { data, error } = await supabase
        .from('employee_employment')
        .upsert(employmentDetails, {
          onConflict: 'employee_id',
          ignoreDuplicates: false
        })
        .select();

      if (error) {
        console.error("Error in saveEmploymentDetails:", error);
        throw error;
      }

      console.log("Employment details saved successfully:", data);
      return data?.[0] || null;
    } catch (error) {
      console.error('Failed to save employment details data:', error);
      this.handleError(error, 'Failed to save employment details data');
      return null;
    }
  }
