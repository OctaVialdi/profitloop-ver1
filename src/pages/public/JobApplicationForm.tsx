
import React, { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useApplicationForm } from "@/hooks/useApplicationForm";
import LoadingState from "@/components/public/application/LoadingState";
import InvalidLinkState from "@/components/public/application/InvalidLinkState";
import SuccessState from "@/components/public/application/SuccessState";
import ApplicationFormTabs from "@/components/public/application/ApplicationFormTabs";

const JobApplicationForm = () => {
  const {
    activeTab,
    setActiveTab,
    formData,
    handleFormUpdate,
    familyMembers,
    setFamilyMembers,
    formalEducation,
    setFormalEducation,
    informalEducation,
    setInformalEducation,
    workExperience,
    setWorkExperience,
    isLoading,
    isSubmitting,
    linkInfo,
    invalidLink,
    submissionSuccess,
    validateRecruitmentLink,
    handleSubmit
  } = useApplicationForm();
  
  // Validate token on component mount
  useEffect(() => {
    validateRecruitmentLink();
  }, []);
  
  // Show loading state
  if (isLoading) {
    return <LoadingState />;
  }
  
  // Show invalid link state
  if (invalidLink) {
    return <InvalidLinkState />;
  }
  
  // Show application success page
  if (submissionSuccess) {
    return <SuccessState linkInfo={linkInfo} />;
  }
  
  return (
    <div className="container max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Job Application Form</h1>
        <p className="text-muted-foreground mt-2">
          {linkInfo?.job_title} at {linkInfo?.organization_name}
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Application Form</CardTitle>
          <CardDescription>
            Please fill out all sections of the application form carefully.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ApplicationFormTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            formData={formData}
            updateFormData={handleFormUpdate}
            familyMembers={familyMembers}
            setFamilyMembers={setFamilyMembers}
            formalEducation={formalEducation}
            setFormalEducation={setFormalEducation}
            informalEducation={informalEducation}
            setInformalEducation={setInformalEducation}
            workExperience={workExperience}
            setWorkExperience={setWorkExperience}
            handleSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default JobApplicationForm;
