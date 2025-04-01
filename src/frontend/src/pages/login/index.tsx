import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import Input from "../../appUi/components/forms/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ISignIn, loginSchema } from "../../schemas/user.schema";
import { getStoredUserData, loginUser } from "../../api/signin";
import Button from "../../appUi/components/forms/Button";
import Heading from "../../appUi/components/ui/Heading";
import { useAuth } from "../../context/AuthContext";
import { getProfile } from "../../api/profiles";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<boolean>(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ISignIn>({
    resolver: zodResolver(loginSchema),
  });
  
  const onSubmit = async (data: ISignIn) => {
    setIsLoading(true);
    try {
      const loginResponse = await loginUser(data);
      console.log("loginResponse+++++++++++", loginResponse);
      
      if (loginResponse && loginResponse.sessionId) {
        login(btoa(JSON.stringify(loginResponse)));
        
        try {
          const profile = await getProfile();
          console.log("profile+++++++++++", profile);
          if (profile) {
            const userData = getStoredUserData();
            const profileUrl =
              `/profile/${userData.lastName}-${userData.firstName}`.toLowerCase();
            navigate(profileUrl);
          }
        } catch (error: any) {
          console.log("error+++++++++++", error);
          const checkProfileNotFound = error.response?.data?.message;
          if (checkProfileNotFound === "Profile not found") {
            // Check user role for redirection
            const userData = getStoredUserData();
            if (userData.role === "recruiter") {
              navigate("/profile/create-recruiter");
            } else {
              navigate("/profile/create");
            }
          }
        }
      }
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="max-w-[450px] border bg-white p-4 rounded-md mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <Heading
          subTitle={"Sign in to manage your account activities"}
          className="md:text-md"
          subTitleClassName="text-base mt-0"
        >
          Welcome, back!
        </Heading>
        <Input
          error={errors.email?.message}
          {...register("email")}
          label="Email"
        />
        <Input
          error={errors.password?.message}
          label="Password"
          {...register("password")}
          type="password"
        />
        <Button
          loadingText="Signing in..."
          isLoading={isLoading}
          className={`${
            isLoading ? "bg-white" : "bg-largeTextColor"
          } text-white`}
        >
          Sign in
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
            <p className="mt-auto font-normal text-sm pt-4">
              Don't have an Account ?{" "}
              <a href="/signup" className="underline text-primaryBlueColor">
                Create Account
              </a>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;