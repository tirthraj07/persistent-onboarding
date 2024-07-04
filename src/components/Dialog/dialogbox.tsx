'use client'
import { ChevronRightIcon } from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"

import { MyCardPageProps } from "../Card/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

import { useState } from "react"

import { useRouter } from "next/navigation"


export default function DialogBox(
    {
        data
    } : MyCardPageProps
){
    const [full_name, setFullName] = useState<string>(data.full_name)
    const [gender, setGender] = useState<string|null>(data.gender);
    const [address, setAddress] = useState<string|null>(data.address);
    const [blood_group, setBloodGroup] = useState<string|null>(data.blood_group);
    const [education_qualification, setEducationQualification] = useState<string|null>(data.education_qualification);
    
    const router = useRouter();

    async function handleSubmitUpdateForm(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        const target = e.target as typeof e.target & {
            full_name: {value: string},
            gender: {value: string},
            address: {value: string},
            blood_group: {value: string},
            education_qualification: {value: string}
        }

        const full_name = target.full_name.value;
        const gender = target.gender.value;
        const address = target.address.value;
        const blood_group = target.blood_group.value;
        const education_qualification = target.education_qualification.value;
        
        const jsonPayload = {
            full_name: full_name,
            gender: gender?gender=="male"? "M":"F":null,
            address: address,
            blood_group: blood_group,
            education_qualification: education_qualification
        }

        console.log(jsonPayload);

        try{
            const response = await fetch('/api/cards/mycard', {
                method:'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(jsonPayload)
            })

            const data = await response.json();

            if(data.error) throw new Error(data.error);

            alert("Information Updated Successfully");

            window.location.reload();

        }
        catch(e){
            alert("Error occurred while updating information");
            console.error(e);
        }

    }


    return (
        <>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline">Edit Profile</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                    <DialogTitle>Edit profile</DialogTitle>
                    <DialogDescription>
                        Make changes to your profile here. Click save when you&apos;re done.
                    </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmitUpdateForm}>
                        <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="full_name" className="text-right">
                            Name
                            </Label>
                            <Input id="full_name" name="full_name" onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setFullName(e.target.value)} value={full_name} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="gender" className="text-right">
                            Gender
                            </Label>
                            <RadioGroup name="gender" defaultValue={gender? (gender==="M"? "male":"female"):""}>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="male" id="r1" />
                                    <Label htmlFor="r1">Male</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="female" id="r2" />
                                    <Label htmlFor="r2">Female</Label>
                                </div>
                            </RadioGroup>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="address" className="text-right">
                            Address
                            </Label>
                            <Input id="address" name="address" onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setAddress(e.target.value)} value={address || ""} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="blood_group" className="text-right">
                            Blood Group
                            </Label>
                            <Input id="blood_group" name="blood_group" onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setBloodGroup(e.target.value)} value={blood_group || ""} className="col-span-3" />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="education_qualification" className="text-right">
                            Education Qualification
                            </Label>
                            <Input id="education_qualification" name="education_qualification" onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setEducationQualification(e.target.value)} value={education_qualification || ""} className="col-span-3" />
                        </div>
                        </div>
                        <DialogFooter>
                        <Button type="submit">Save changes</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>


        </>
    )
}