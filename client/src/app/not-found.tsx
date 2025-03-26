import Image from "next/image";
import Link from "next/link";
import notfound from "@/assets/notfound.svg";
import { FaTimes } from "react-icons/fa";

const NotFound = () => {
  return (
    <div className="relative flex flex-col items-center justify-center h-screen text-white text-center px-6">
      {/* Close Button */}
      <Link href="/" className="absolute top-5 right-5 text-gray-400  text-2xl">
        <FaTimes />
      </Link>

      <Image src={notfound} alt="Not Found" width={500} height={500} />

      {/* Error Message */}
      <h1 className="text-5xl font-semibold mt-[-20px] text-emerald-500">
        Oops! Page Not Found
      </h1>
      <p className="text-lg text-gray-400 mt-[10px]">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
    </div>
  );
};

export default NotFound;

