import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

import Input from "../../appUi/components/forms/Input";
import Button from "../../appUi/components/forms/Button";
import Heading from "../../appUi/components/ui/Heading";
import { createUser } from "../../api/signup";
import { ICreateUser, signupSchema } from "../../schemas/user.schema";
import SelectWithErrorCustomSelect from "../../appUi/components/forms/Select";

type User = {
  id: string;
  email: string;
  password: string;
  role: "developer" | "recruiter";
  sessionId: string;
  firstName: string;
  lastName: string;
  phone: string;
};

const Signup: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  const roleOptions = [
    { value: "", label: "Select your role" },
    { value: "developer", label: "developer" },
    { value: "recruiter", label: "recruiter" },
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<ICreateUser>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const userData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        role: data.role,
        password: data.password,
      };
      await createUser(userData, navigate);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-[450px] bg-white p-4 border rounded-md mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <Heading
          subTitle="Create your account to get started"
          className="md:text-md"
          subTitleClassName="text-base text-[16px] mt-0"
        >
          Create Account
        </Heading>

        <SelectWithErrorCustomSelect
          options={roleOptions}
          label="Role"
          isSearchable={false}
          placeholder="Select your role"
          error={errors.role?.message?.toString()}
          value={roleOptions.find((option) => option.value === role)}
          onChange={(selectedOption: any) => {
            const value = selectedOption.value;
            setRole(value);
            reset();
            setValue("role", value);
          }}
        />

        <Input
          error={errors.firstName?.message}
          {...register("firstName")}
          label="First Name"
          placeholder="Enter your first name"
        />

        <Input
          error={errors.lastName?.message}
          {...register("lastName")}
          label="Last Name"
          placeholder="Enter your last name"
        />

        <Input
          error={errors.email?.message}
          {...register("email")}
          label="Email"
          type="email"
          placeholder="Enter your email"
        />

        <Input
          error={errors.phone?.message}
          {...register("phone")}
          label="Phone Number"
          placeholder="Enter your phone number"
        />
        <Input
          error={errors.password?.message}
          {...register("password")}
          label="Password"
          type="password"
          placeholder="Enter your password"
        />
        <Button
          loadingText="Creating account..."
          isLoading={isLoading}
          className={`${
            isLoading ? "bg-white" : "bg-largeTextColor"
          } text-white`}
        >
          Create Account
        </Button>

        <div className="pt-10">
          <p className="text-sm">
            By creating an account, you agree to F-reputation's <br></br>
            <a
              href="/"
              className="underline text-primaryBlueColor font-normal text-sm"
            >
              Conditions of Use
            </a>{" "}
            and{" "}
            <a
              href="/"
              className="underline text-primaryBlueColor font-normal text-sm"
            >
              Privacy Notice.
            </a>
          </p>
          <div className="flex flex-col shadow-md p-4 ">
            <div className="h-[1px] bg-grayColor my-4"></div>
            <h1 className="text-sm font-bold text-blackColor">
              Buying for work?
            </h1>
            <p className="text-sm text-primaryBlueColor py-1">
              Create a free business account
            </p>
          </div>

          <p className="mt-auto font-normal text-sm pt-4">
            Already have an account?{" "}
            <a href="/login" className=" underline   text-primaryBlueColor">
              Sign in
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Signup;
