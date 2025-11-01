import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const UpdateProfile = () => {
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm();
  const queryClient = useQueryClient();

  const updateProfileApi = async (formData) => {
    const res = await axios.post(
      "https://ai-interview-coach-backend-581l.onrender.com/api/v1/user/updateProfile",
      formData,
      { withCredentials: true }
    );
    return res.data;
  };

  const mutation = useMutation({
    mutationFn: updateProfileApi,
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      queryClient.invalidateQueries(["getProfile"]);
      reset();
      setOpen(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Update failed");
    },
  });

  const onSubmit = (data) => {
    const formData = new FormData();
    if (data.fullName?.trim()) formData.append("fullName", data.fullName);
    if (data.profilPhoto?.[0]) formData.append("profilPhoto", data.profilPhoto[0]);

    if (!formData.has("fullName") && !formData.has("profilPhoto")) {
      toast.error("Please provide at least one field to update.");
      return;
    }

    mutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="text-cyan-400 font-medium hover:text-cyan-300">
        Update Profile
      </DialogTrigger>
      <DialogContent className="bg-[#0f1a2d] text-zinc-100 border border-cyan-400/30 rounded-xl shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-cyan-300">
            Update Profile
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Modify your name or upload a new profile picture.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-4">
          <input
            type="text"
            {...register("fullName")}
            placeholder="Enter Full Name"
            className="border border-cyan-500/40 rounded-lg px-3 py-2 bg-transparent text-zinc-100 placeholder-zinc-400 focus:ring-2 focus:ring-cyan-400"
          />

          <input
            type="file"
            {...register("profilPhoto")}
            className="border border-cyan-500/40 rounded-lg px-3 py-2 text-zinc-300 bg-transparent file:cursor-pointer"
          />

          <Button
            type="submit"
            disabled={mutation.isPending}
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-500 hover:opacity-90 text-white rounded-lg"
          >
            {mutation.isPending ? "Updating..." : "Update"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProfile;
