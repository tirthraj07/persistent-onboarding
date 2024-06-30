import Image from "next/image";
import defaultProfile from "../../../public/default_profile.png"
import favicon from "../../../public/favicon.png"

interface MyCardPageProps {
    data: {
        employee_id: string;
        full_name: string;
        email: string;

        gender: string | null;
        address: string | null;
        blood_group:string | null,
        education_qualification: string | null,
        profilePicture: string | null; 
    }
}

export default function Card(
    {
        data
    }: MyCardPageProps

){
    return (
        <>
            <div className="w-full max-w-sm bg-white shadow-lg rounded-lg overflow-hidden border border-gray-300">
                <div className="flex justify-center mt-8">
                    <Image 
                        src={data.profilePicture || defaultProfile}
                        alt="Profile Picture"
                        className="w-24 h-24 rounded-full"
                    />
                </div>
                <div className="px-6 py-4">
                    <div className="font-bold text-3xl md:text-xl text-center mb-2">{data.full_name}</div>
                    <div className="flex justify-center items-center my-5">
                    <Image 
                        src={favicon.src}
                        alt="Persistent Systems"
                        width={30}
                        height={30}
                    />
                    </div>
                    <p className="text-gray-700 text-lg md:text-base text-start my-5">
                        <strong>Employee ID:</strong> {data.employee_id}
                    </p>
                    <p className="text-gray-700 text-lg md:text-base mb-3 text-start">
                        <strong>Email:</strong> {data.email}
                    </p>
                    <p className="text-gray-700 text-lg md:text-base mb-3 text-start">
                        <strong>Address:</strong> {data.address}
                    </p>
                    <p className="text-gray-700 text-lg md:text-base mb-3 text-start">
                        <strong>Gender:</strong> {data.gender}
                    </p>
                    <p className="text-gray-700 text-lg md:text-base mb-3 text-start">
                        <strong>Blood Group:</strong> {data.blood_group}
                    </p>
                    <p className="text-gray-700 text-lg md:text-base mb-3 text-start">
                        <strong>Educational Qualification:</strong> {data.education_qualification}
                    </p>
                </div>
            </div>
        
        </>
    )
}