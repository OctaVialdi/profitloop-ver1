
  async updateIdentityAddress(employeeId: string, details: any): Promise<any> {
    try {
      console.log("Updating identity address for employee:", employeeId, details);
      const identityAddress = {
        employee_id: employeeId,
        ...details
      };
      
      return this.saveIdentityAddress(identityAddress);
    } catch (error) {
      handleError(error, 'Failed to update identity and address');
      return null;
    }
  }
