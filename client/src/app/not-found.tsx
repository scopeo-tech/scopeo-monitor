import Image from "next/image";
import Link from "next/link";
import notfound from "@/assets/notfound.svg";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen  text-white text-center px-6">
      <Image src={notfound} alt="Not Found" width={400} height={400} />

      {/* Error Message */}
      <h1 className="text-5xl font-bold mt-[-20px] text-emerald-500">Oops! Page Not Found</h1>
<p className="text-lg text-gray-400 mt-[10px]">
  The page you&apos;re looking for doesn&apos;t exist or has been moved.
</p>


      {/* Back to Home Button */}
      <Link href="/" className="mt-6 px-6 py-3 bg-emerald-500 text-white rounded-lg shadow-lg hover:bg-emerald-600 transition">
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
