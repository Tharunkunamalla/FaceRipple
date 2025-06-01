import {useMutation, useQueryClient} from "@tanstack/react-query";
import React, {useState} from "react";
import toast from "react-hot-toast";

const OnboardingPage = () => {
  const {isLoading, authUser} = useAuthUser();
  const queryClient = useQueryClient();
  const {formState, setFormState} = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || "",
  });

  const {mutate: onboardingMutation, isPending} = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      toast.success("Profile Onboarding successfully");
      queryClient.invalidateQueries({queryKey: ["authUser"]});
    },
  });

  return <div></div>;
};

export default OnboardingPage;
