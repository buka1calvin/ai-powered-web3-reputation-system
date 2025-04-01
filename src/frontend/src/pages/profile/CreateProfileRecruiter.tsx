import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import Heading from "../../appUi/components/ui/Heading";
import SelectWithErrorCustomSelect from "../../appUi/components/forms/Select";
import Input from "../../appUi/components/forms/Input";
import Button from "../../appUi/components/forms/Button";
import { ImageDropzone } from "../../appUi/components/dropzone/dropzone";
import { createProfile } from "../../api/profiles";
import { getStoredUserData } from "../../api/signin";
import { companySizes, country, industries } from "../../constants";

// Interface for the recruiter profile creation form
interface ICreateRecruiterProfile {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender?: "male" | "female" | "other";
  email: string;
  phone: string;
  country?: string;
  district?: string;
  province?: string;
  title: string;
  descriptions?: string;
  profilePic?: File;
  coverPic?: File;
  company: string;
  position: string;
  companyWebsite?: string;
  industry?: string;
  companySize?: string;
}

const RecruiterProfileCreation: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(null);
  const [coverPicPreview, setCoverPicPreview] = useState<string | null>(null);
  
  const user = getStoredUserData();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ICreateRecruiterProfile>({
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      title: user?.role === "recruiter" ? "Recruiter" : "",
    },
  });

  const handleSetValue = (name: string, value: File) => {
    setValue(name as keyof ICreateRecruiterProfile, value as any);
  };

  const onSubmit = async (data: ICreateRecruiterProfile) => {
    setIsLoading(true);
    try {
      // Structure the data to match the expected format in the createProfile function
      const profileData = {
        ...data,
        role: "recruiter", // Explicitly set the role
        recruiterInfo: {
          company: data.company,
          position: data.position,
          companyWebsite: data.companyWebsite || "",
          industry: data.industry || "",
          companySize: data.companySize || "",
          reputationScore: 50, // Default initial score
          totalHires: 0,
          activeJobPostings: 0,
        },
      };

      console.log("Submitting profile data:", profileData);
      const response = await createProfile(profileData);
      
      console.log("Profile creation response:", response);
      
      if (user) {
        const profileUrl = `/profile/${user.lastName}-${user.firstName}`.toLowerCase();
        navigate(profileUrl);
      }
    } catch (error) {
      console.error("Error creating profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const gender = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
  ];



  return (
    <div className="max-w-[650px] border bg-white p-4 rounded-md mx-auto">
      <Heading
        subTitle="Create your recruiter profile to connect with talented developers"
        className="md:text-md"
        subTitleClassName="text-base text-[16px] mt-0 mb-10"
      >
        Create Recruiter Profile
      </Heading>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="relative mb-20">
          <div>
            <ImageDropzone
              name="profilePic"
              label="Profile Picture"
              preview={profilePicPreview}
              onPreviewChange={setProfilePicPreview}
              setValue={handleSetValue}
            />
          </div>
          <ImageDropzone
            name="coverPic"
            label="Cover Picture"
            preview={coverPicPreview}
            onPreviewChange={setCoverPicPreview}
            setValue={handleSetValue}
          />
        </div>

        {/* Personal Information Section */}
        <div className="border-b pb-4 mb-4">
          <h3 className="text-lg font-medium mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              error={errors.firstName?.message}
              {...register("firstName", { required: "First name is required" })}
              label="First Name"
              placeholder="Enter your first name"
            />

            <Input
              error={errors.lastName?.message}
              {...register("lastName", { required: "Last name is required" })}
              label="Last Name"
              placeholder="Enter your last name"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Input
              type="date"
              error={errors.dateOfBirth?.message}
              {...register("dateOfBirth", { required: "Date of birth is required" })}
              label="Date of Birth"
            />

            <SelectWithErrorCustomSelect
              name="gender"
              onChange={(selectedOption) => {
                if (selectedOption?.value) {
                  setValue("gender", selectedOption.value as any);
                }
              }}
              label="Gender"
              options={gender}
              error={errors.gender?.message}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Input
              type="email"
              error={errors.email?.message}
              {...register("email", { required: "Email is required" })}
              label="Email"
              placeholder="Enter your email"
            />

            <Input
              error={errors.phone?.message}
              {...register("phone", { required: "Phone number is required" })}
              label="Phone Number"
              placeholder="Enter your phone number"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <SelectWithErrorCustomSelect
              name="country"
              onChange={(selectedOption) => {
                setValue("country", selectedOption?.value as any);
              }}
              label="Country"
              options={country}
              error={errors.country?.message}
            />

            <Input
              error={errors.district?.message}
              {...register("district")}
              label="District"
              placeholder="Enter your district"
            />
          </div>

          <Input
            error={errors.province?.message}
            {...register("province")}
            label="Province"
            placeholder="Enter your province"
            className="mt-4"
          />

          <Input
            error={errors.title?.message}
            {...register("title", { required: "Title is required" })}
            label="Professional Title"
            placeholder="e.g. Senior Technical Recruiter"
            className="mt-4"
          />
        </div>

        {/* Company Information Section */}
        <div className="border-b pb-4 mb-4">
          <h3 className="text-lg font-medium mb-4">Company Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              error={errors.company?.message}
              {...register("company", { required: "Company name is required" })}
              label="Company Name"
              placeholder="Enter your company name"
            />

            <Input
              error={errors.position?.message}
              {...register("position", { required: "Position is required" })}
              label="Position"
              placeholder="e.g. HR Manager, Recruitment Specialist"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Input
              error={errors.companyWebsite?.message}
              {...register("companyWebsite")}
              label="Company Website"
              placeholder="https://example.com"
            />

            <SelectWithErrorCustomSelect
              name="industry"
              onChange={(selectedOption) => {
                setValue("industry", selectedOption?.value as any);
              }}
              label="Industry"
              options={industries}
              error={errors.industry?.message}
            />
          </div>

          <SelectWithErrorCustomSelect
            name="companySize"
            onChange={(selectedOption) => {
              setValue("companySize", selectedOption?.value as any);
            }}
            label="Company Size"
            options={companySizes}
            error={errors.companySize?.message}
            className="mt-4"
          />
        </div>

        {/* About Section */}
        <div>
          <label
            htmlFor="descriptions"
            className="block text-sm font-medium text-gray-700"
          >
            About Me / Recruitment Specialization
          </label>
          <textarea
            id="descriptions"
            {...register("descriptions")}
            rows={4}
            placeholder="Share information about yourself, your recruitment approach, or specific roles you're looking to fill"
            className={`mt-1 block w-full border p-2 border-gray-300 rounded-md shadow-sm focus:ring-largeTextColor focus:border-largeTextColor sm:text-md ${
              errors.descriptions ? "border-red-500" : ""
            }`}
          ></textarea>
          {errors.descriptions && (
            <p className="text-red-500 text-sm mt-1">
              {errors.descriptions.message}
            </p>
          )}
        </div>

        <Button
          loadingText="Creating Profile..."
          isLoading={isLoading}
          className={`${
            isLoading ? "bg-white" : "bg-largeTextColor"
          } text-white`}
          type="submit"
        >
          Create Recruiter Profile
        </Button>
      </form>
    </div>
  );
};

export default RecruiterProfileCreation;