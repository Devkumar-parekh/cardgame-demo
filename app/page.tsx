import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div>
        {/* <div>
          <Link className="hover:text-gray-400" href={"/games/matchthecard"}>
            Match The Card
          </Link>
        </div> */}
        <div>
          <Link className="hover:text-gray-400" href={"/games/demo"}>
            Demo
          </Link>
        </div>
      </div>
    </div>
  );
}
