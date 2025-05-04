
import { useState, useEffect } from "react";
import { employeeService, Employee, EmployeeWithDetails, EmployeePersonalDetails, EmployeeIdentityAddress, EmployeeEmployment, EmployeeFamily } from "@/services/employeeService";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Define the legacy employee interface that our components expect
export interface LegacyEmployee {
  id: string;
  name: string;
  email: string;
  employeeId: string;
  organization: string;
  jobPosition: string;
  jobLevel: string;
  employmentStatus: string;
  branch: string;
  joinDate: string;
  signDate: string;
  barcode: string;
  birthDate: string;
  birthPlace: string;
  address: string; // Maps to residential_address in identityAddress
  mobilePhone: string;
  religion: string;
  gender: string;
  maritalStatus: string;
  bloodType: string;
  nik: string;
  passportNumber: string;
  passportExpiry: string;
  postalCode: string;
  citizenAddress: string;
  status: string;
  role: string;
  organization_id: string; // Required field
  employee_id: string;     // Making it required to match Employee type
}

export interface UseEmployeesResult {
  employees: EmployeeWithDetails[];
  isLoading: boolean;
  refetch: () => Promise<void>;
  addEmployee: (
    employee: Partial<Employee>, 
    personalDetails?: any, 
    identityAddress?: any, 
    employment?: any
  ) => Promise<EmployeeWithDetails | null>;
  addDummyEmployees: () => Promise<void>;
  updateEmployee: (employee: Partial<Employee> & { id: string }) => Promise<EmployeeWithDetails | null>;
  removeEmployee: (id: string) => Promise<boolean>;
  getEmployee: (id: string) => Promise<EmployeeWithDetails | null>;
}

// Helper function to convert from new database format to legacy format
export function convertToLegacyFormat(employee: EmployeeWithDetails): LegacyEmployee {
  return {
    id: employee.id,
    name: employee.name,
    email: employee.email || "",
    employeeId: employee.employee_id || "",
    organization: employee.employment?.organization || "",
    jobPosition: employee.employment?.job_position || "",
    jobLevel: employee.employment?.job_level || "",
    employmentStatus: employee.employment?.employment_status || "",
    branch: employee.employment?.branch || "",
    joinDate: employee.employment?.join_date || "",
    signDate: employee.employment?.sign_date || "",
    barcode: employee.employment?.barcode || "",
    birthDate: employee.personalDetails?.birth_date || "",
    birthPlace: employee.personalDetails?.birth_place || "",
    address: employee.identityAddress?.residential_address || "", 
    mobilePhone: employee.personalDetails?.mobile_phone || "",
    religion: employee.personalDetails?.religion || "",
    gender: employee.personalDetails?.gender || "",
    maritalStatus: employee.personalDetails?.marital_status || "",
    bloodType: employee.personalDetails?.blood_type || "",
    nik: employee.identityAddress?.nik || "",
    passportNumber: employee.identityAddress?.passport_number || "",
    passportExpiry: employee.identityAddress?.passport_expiry || "",
    postalCode: employee.identityAddress?.postal_code || "",
    citizenAddress: employee.identityAddress?.citizen_address || "",
    status: employee.status || "Active",
    role: employee.role || "employee",
    organization_id: employee.organization_id,
    employee_id: employee.employee_id || ""
  };
}

// Helper function to convert from legacy format to new database format
export function convertFromLegacyFormat(legacyEmployee: Partial<LegacyEmployee>): Partial<Employee> {
  // Basic employee data
  const employeeData: Partial<Employee> = {
    id: legacyEmployee.id,
    name: legacyEmployee.name,
    email: legacyEmployee.email,
    employee_id: legacyEmployee.employeeId || legacyEmployee.employee_id,
    organization_id: legacyEmployee.organization_id,
    status: legacyEmployee.status,
    role: legacyEmployee.role
  };

  return employeeData;
}

// Re-export the employeeService from the service for convenience
export { employeeService } from "@/services/employeeService";

export function useEmployees(): UseEmployeesResult {
  const [employees, setEmployees] = useState<EmployeeWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const data = await employeeService.fetchEmployees();
      setEmployees(data);
    } catch (error) {
      console.error("Error fetching employees:", error);
      toast.error("Failed to fetch employee data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Helper to generate a unique employee ID
  const generateUniqueEmployeeId = async (baseId: string): Promise<string> => {
    // Check if employee_id exists
    const { data } = await supabase
      .from('employees')
      .select('employee_id')
      .eq('employee_id', baseId);
      
    if (!data || data.length === 0) {
      return baseId; // If not exists, use the original
    }
    
    // If exists, append a random number
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    return `${baseId}-${randomSuffix}`;
  };

  // Function to create and add dummy employees to the database
  const addDummyEmployees = async () => {
    setIsLoading(true);
    
    const dummyEmployees = [
      {
        name: "John Doe",
        email: "john.doe@example.com",
        employee_id: "EMP-001",
        role: "employee",
        status: "Active",
        organization_id: "", // Will be set before creating
        personalDetails: {
          mobile_phone: "+62 812-3456-7890",
          birth_place: "Jakarta",
          birth_date: "1990-05-15",
          gender: "Male",
          marital_status: "Married",
          religion: "Islam",
          blood_type: "B+"
        },
        identityAddress: {
          nik: "3301236789012345",
          passport_number: "B1234567",
          passport_expiry: "2027-10-20",
          postal_code: "10110",
          citizen_address: "Jl. Sudirman No. 123, Jakarta Pusat",
          residential_address: "Apartment Green View No. 45, Jakarta Selatan"
        },
        employment: {
          barcode: "EMP001BARCODE",
          organization: "Sales",
          job_position: "Sales Manager",
          job_level: "Manager",
          employment_status: "Permanent",
          branch: "Jakarta HQ",
          join_date: "2018-06-01",
          sign_date: "2018-05-20",
          grade: "A",
          class: "Senior"
        },
        familyMembers: [
          {
            name: "Jane Doe",
            relationship: "Spouse",
            birth_date: "1992-08-12",
            occupation: "Teacher"
          },
          {
            name: "James Doe",
            relationship: "Child",
            birth_date: "2015-03-25",
            occupation: "Student"
          }
        ]
      },
      {
        name: "Sarah Williams",
        email: "sarah.williams@example.com",
        employee_id: "EMP-002",
        role: "employee",
        status: "Active",
        personalDetails: {
          mobile_phone: "+62 813-9876-5432",
          birth_place: "Surabaya",
          birth_date: "1988-11-23",
          gender: "Female",
          marital_status: "Single",
          religion: "Christian",
          blood_type: "O-"
        },
        identityAddress: {
          nik: "3275046709123456",
          passport_number: "C7654321",
          passport_expiry: "2028-03-15",
          postal_code: "60111",
          citizen_address: "Jl. Pemuda No. 56, Surabaya",
          residential_address: "Jl. Pemuda No. 56, Surabaya"
        },
        employment: {
          barcode: "EMP002BARCODE",
          organization: "Marketing",
          job_position: "Digital Marketing Lead",
          job_level: "Senior",
          employment_status: "Contract",
          branch: "Surabaya Branch",
          join_date: "2020-02-15",
          sign_date: "2020-01-30",
          grade: "B",
          class: "Mid"
        },
        familyMembers: [
          {
            name: "Michael Williams",
            relationship: "Father",
            birth_date: "1960-04-18",
            occupation: "Retired"
          }
        ]
      },
      {
        name: "Ahmad Fauzi",
        email: "ahmad.fauzi@example.com",
        employee_id: "EMP-003",
        role: "employee",
        status: "Active",
        personalDetails: {
          mobile_phone: "+62 857-1122-3344",
          birth_place: "Bandung",
          birth_date: "1995-08-10",
          gender: "Male",
          marital_status: "Married",
          religion: "Islam",
          blood_type: "A+"
        },
        identityAddress: {
          nik: "3273042208950006",
          passport_number: "D5566778",
          passport_expiry: "2026-12-10",
          postal_code: "40112",
          citizen_address: "Jl. Asia Afrika No. 78, Bandung",
          residential_address: "Jl. Dago No. 145, Bandung"
        },
        employment: {
          barcode: "EMP003BARCODE",
          organization: "Engineering",
          job_position: "Software Engineer",
          job_level: "Junior",
          employment_status: "Permanent",
          branch: "Bandung Branch",
          join_date: "2022-01-10",
          sign_date: "2021-12-20",
          grade: "C",
          class: "Junior"
        },
        familyMembers: [
          {
            name: "Siti Nuraini",
            relationship: "Spouse",
            birth_date: "1996-05-17",
            occupation: "Graphic Designer"
          },
          {
            name: "Aisyah Fauzi",
            relationship: "Child",
            birth_date: "2022-03-12",
            occupation: "N/A"
          }
        ]
      },
      {
        name: "Budi Santoso",
        email: "budi.santoso@example.com",
        employee_id: "EMP-004",
        role: "employee",
        status: "Active",
        personalDetails: {
          mobile_phone: "+62 821-5566-7788",
          birth_place: "Yogyakarta",
          birth_date: "1985-12-05",
          gender: "Male",
          marital_status: "Divorced",
          religion: "Catholic",
          blood_type: "AB+"
        },
        identityAddress: {
          nik: "3471112505850003",
          passport_number: "E9988776",
          passport_expiry: "2025-09-30",
          postal_code: "55281",
          citizen_address: "Jl. Malioboro No. 45, Yogyakarta",
          residential_address: "Perumahan Sejahtera Blok C3, Yogyakarta"
        },
        employment: {
          barcode: "EMP004BARCODE",
          organization: "Finance",
          job_position: "Finance Manager",
          job_level: "Senior",
          employment_status: "Permanent",
          branch: "Yogyakarta Branch",
          join_date: "2015-08-01",
          sign_date: "2015-07-15",
          grade: "A",
          class: "Senior"
        },
        familyMembers: [
          {
            name: "Dimas Santoso",
            relationship: "Child",
            birth_date: "2010-06-23",
            occupation: "Student"
          },
          {
            name: "Dewi Santoso",
            relationship: "Child",
            birth_date: "2014-09-11",
            occupation: "Student"
          }
        ]
      },
      {
        name: "Nur Hidayah",
        email: "nur.hidayah@example.com",
        employee_id: "EMP-005",
        role: "employee",
        status: "Active",
        personalDetails: {
          mobile_phone: "+62 878-8899-0011",
          birth_place: "Semarang",
          birth_date: "1992-03-17",
          gender: "Female",
          marital_status: "Married",
          religion: "Islam",
          blood_type: "O+"
        },
        identityAddress: {
          nik: "3374051703920002",
          passport_number: "F1122334",
          passport_expiry: "2026-05-20",
          postal_code: "50136",
          citizen_address: "Jl. Veteran No. 17, Semarang",
          residential_address: "Apartment Riverside Tower A-12, Semarang"
        },
        employment: {
          barcode: "EMP005BARCODE",
          organization: "Human Resources",
          job_position: "HR Specialist",
          job_level: "Mid",
          employment_status: "Permanent",
          branch: "Semarang Branch",
          join_date: "2019-04-10",
          sign_date: "2019-03-25",
          grade: "B",
          class: "Mid"
        },
        familyMembers: [
          {
            name: "Rizky Pratama",
            relationship: "Spouse",
            birth_date: "1990-08-29",
            occupation: "Architect"
          },
          {
            name: "Zahra Pratama",
            relationship: "Child",
            birth_date: "2020-11-03",
            occupation: "N/A"
          }
        ]
      }
    ];

    try {
      const existingEmployees = await employeeService.fetchEmployees();
      
      // Create a map of existing employee_ids for quick lookup
      const existingEmployeeIds = new Map();
      existingEmployees.forEach(emp => {
        if (emp.employee_id) {
          existingEmployeeIds.set(emp.employee_id, true);
        }
      });
      
      // Get current user's organization ID
      const { data: userProfile } = await supabase.auth.getUser();
      if (!userProfile?.user?.id) {
        throw new Error("User not authenticated");
      }
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', userProfile.user.id)
        .single();
      
      if (!profile?.organization_id) {
        throw new Error("User doesn't belong to an organization");
      }
      
      const organizationId = profile.organization_id;
      
      // Process each dummy employee, modifying IDs to avoid conflicts
      for (const dummyEmployee of dummyEmployees) {
        // Skip if employee with this ID already exists
        if (existingEmployeeIds.has(dummyEmployee.employee_id)) {
          console.log(`Employee with ID ${dummyEmployee.employee_id} already exists, skipping`);
          continue;
        }
        
        const { personalDetails, identityAddress, employment, familyMembers, ...employeeData } = dummyEmployee;
        
        // Set organization_id for the employee
        employeeData.organization_id = organizationId;
        
        console.log("Adding dummy employee:", employeeData.name);
        
        try {
          const newEmployee = await employeeService.createEmployee(
            employeeData,
            personalDetails,
            identityAddress,
            employment
          );
          
          if (newEmployee) {
            console.log(`Added base data for employee: ${employeeData.name} with ID: ${newEmployee.id}`);
            
            // Add family members if any
            if (familyMembers && familyMembers.length > 0) {
              for (const familyMember of familyMembers) {
                await employeeService.saveFamilyMember({
                  ...familyMember,
                  employee_id: newEmployee.id,
                  name: familyMember.name // Ensure name is passed
                });
              }
              console.log(`Added ${familyMembers.length} family members for ${employeeData.name}`);
            }
          }
        } catch (error) {
          console.error(`Error adding dummy employee ${employeeData.name}:`, error);
        }
      }
      
      // Refresh the employees list to show the new data
      await fetchEmployees();
      
    } catch (error) {
      console.error("Error adding dummy employees:", error);
      throw new Error("Failed to add dummy employees: " + (error instanceof Error ? error.message : "Unknown error"));
    } finally {
      setIsLoading(false);
    }
  };

  const addEmployee = async (
    employeeData: Partial<Employee>, 
    personalDetails?: any, 
    identityAddress?: any, 
    employment?: any
  ) => {
    try {
      console.log("Adding employee with data:", {
        employeeData,
        personalDetails,
        identityAddress,
        employment
      });

      // Get current user's organization ID
      const { data: userProfile } = await supabase.auth.getUser();
      if (!userProfile?.user?.id) {
        throw new Error("User not authenticated");
      }
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', userProfile.user.id)
        .single();
      
      if (!profile?.organization_id) {
        throw new Error("User doesn't belong to an organization");
      }
      
      // Ensure required fields are set
      const completeEmployeeData = {
        name: employeeData.name || 'New Employee', // Default name if not provided
        organization_id: profile.organization_id,
        email: employeeData.email,
        role: employeeData.role,
        status: employeeData.status,
        employee_id: employeeData.employee_id,
        profile_image: employeeData.profile_image
      };

      const newEmployee = await employeeService.createEmployee(
        completeEmployeeData, 
        personalDetails,
        identityAddress,
        employment
      );
      
      if (newEmployee) {
        setEmployees([...employees, newEmployee]);
        toast.success("Employee added successfully");
        return newEmployee;
      }
      return null;
    } catch (error) {
      console.error("Error adding employee:", error);
      toast.error("Failed to add employee: " + (error instanceof Error ? error.message : "Unknown error"));
      return null;
    }
  };

  const updateEmployee = async (updatedEmployee: Partial<Employee> & { id: string }) => {
    try {
      const result = await employeeService.updateEmployee(
        updatedEmployee.id,
        updatedEmployee
      );
      
      if (result) {
        setEmployees(
          employees.map((employee) => 
            employee.id === result.id ? result : employee
          )
        );
        toast.success("Employee updated successfully");
        return result;
      }
      return null;
    } catch (error) {
      console.error("Error updating employee:", error);
      toast.error("Failed to update employee");
      return null;
    }
  };

  const removeEmployee = async (id: string) => {
    try {
      const success = await employeeService.deleteEmployee(id);
      if (success) {
        setEmployees(employees.filter((employee) => employee.id !== id));
        toast.success("Employee removed successfully");
      }
      return success;
    } catch (error) {
      console.error("Error removing employee:", error);
      toast.error("Failed to remove employee");
      return false;
    }
  };
  
  const getEmployee = async (id: string) => {
    try {
      return await employeeService.fetchEmployeeById(id);
    } catch (error) {
      console.error("Error getting employee:", error);
      return null;
    }
  };

  return {
    employees,
    isLoading,
    refetch: fetchEmployees,
    addEmployee,
    addDummyEmployees,
    updateEmployee,
    removeEmployee,
    getEmployee
  };
}

// Re-export types from the service for convenience
export type { 
  Employee,
  EmployeeWithDetails, 
  EmployeePersonalDetails,
  EmployeeIdentityAddress,
  EmployeeEmployment,
  EmployeeFamily,
  EmployeeEmergencyContact,
  EmployeeEducation,
  EmployeeWorkExperience
} from "@/services/employeeService";
