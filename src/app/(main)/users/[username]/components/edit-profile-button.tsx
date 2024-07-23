"use client";
import { Button } from "@/components/ui/button";
import { UserData } from "@/lib/types";
import React, { useState } from "react";
import EditProfileDialog from "./edit-profile-dialog";
interface EditPorfileButtonProps {
  user: UserData;
}
const EditPorfileButton = ({ user }: EditPorfileButtonProps) => {
  const [showDialog, setShowDialog] = useState<boolean>(false);
  return (
    <>
      <Button variant="outline" onClick={() => setShowDialog(true)}>
        Edit Profile
      </Button>
      <EditProfileDialog
        user={user}
        open={showDialog}
        onOpenChange={setShowDialog}
      />
    </>
  );
};

export default EditPorfileButton;
