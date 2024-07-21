"use client"

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import favicon from "../../../../public/favicon.png";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function PasswordPage({
  handlePassword,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword
}: {
  handlePassword: (password: string) => void,
  password: string,
  setPassword: React.Dispatch<React.SetStateAction<string>>,
  confirmPassword: string,
  setConfirmPassword: React.Dispatch<React.SetStateAction<string>>
}) {
    // const [password, setPassword] = useState<string>("");
    // const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [isButtonDisabled, setButtonDisabled] = useState<boolean>(true);

    useEffect(()=>{
        if(password === "" || confirmPassword === ""){
            setButtonDisabled(true);
        }
        else if(password === confirmPassword){ 
            setButtonDisabled(false)    
        }
        else{ 
            setButtonDisabled(true);
        }
    }, [password, confirmPassword])

    function handleSubmit(){
        handlePassword(password);
    }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle className="flex flex-col justify-center items-center gap-3 mb-2">
          <div>
            <Image src={favicon.src} alt="favicon" width={30} height={30} />
          </div>
          <div>Credentials Change</div>
        </CardTitle>
        <CardDescription className="text-center">
          Change the default password to a more secure password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="off"
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setPassword(e.target.value)} 
              defaultValue={password}
              required
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="confirm_password">Confirm New Password</Label>
            <Input
              id="confirm_password"
              name="confirm_password"
              type="password"
              autoComplete="off"
              onChange={(e): void =>
                setConfirmPassword(e.target.value)
              }
              defaultValue={confirmPassword}
              required
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button disabled={isButtonDisabled} onClick={handleSubmit}>
          Next
        </Button>
      </CardFooter>
    </Card>
  );
}
