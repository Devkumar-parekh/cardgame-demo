"use client";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const url = `https://cardgame-demo.vercel.app/games/demo4`;
  const text = `Checkout this cool game I made! ${url}`;
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div>
        <div className="grid grid-cols-2">
          <div>
            <Link className="hover:text-gray-400" href={"/games/demo"}>
              <Image
                className="m-2 border border-white"
                src={`/images/demo1.png`}
                alt="Demo1"
                width={300}
                height={200}
              />
            </Link>
          </div>

          <div>
            <Link className="hover:text-gray-400" href={"/games/demo2"}>
              <Image
                className="m-2 border border-white"
                src={`/images/demo2.png`}
                alt="Demo2"
                width={300}
                height={200}
              />
            </Link>
          </div>

          <div>
            <Link className="hover:text-gray-400" href={"/games/demo3"}>
              <Image
                className="m-2 border border-white"
                src={`/images/demo3.png`}
                alt="Demo3"
                width={300}
                height={200}
              />
            </Link>
          </div>

          <div>
            <Link className="hover:text-gray-400" href={"/games/demo4"}>
              <Image
                className="m-2 border border-white"
                src={`/images/demo4.png`}
                alt="Demo4"
                width={300}
                height={200}
              />
            </Link>
          </div>
        </div>

        <div
          className="cursor-pointer"
          onClick={() => {
            // Get the current page URL and title
            const pageUrl = url;
            const pageTitle = document.title;

            // URL-encode the values
            const encodedUrl = encodeURIComponent(pageUrl);
            const encodedText = encodeURIComponent(
              `Check out this page: ${pageTitle}`,
            );

            // Construct the final sharing URL
            const telegramUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;

            // Open the Telegram sharing dialog in a new window/tab
            window.open(telegramUrl, "_blank");
          }}
        >
          Share on Telegram
        </div>

        <div
          className="cursor-pointer"
          onClick={() => {
            // Get the current page URL and title
            const pageUrl = url;
            const pageTitle = document.title;

            // URL-encode the values
            const encodedUrl = encodeURIComponent(pageUrl);
            const encodedText = encodeURIComponent(
              `Check out this page: ${pageTitle}`,
            );

            // Construct the final sharing URL
            const telegramUrl = `https://api.whatsapp.com/send?text=${encodedUrl + "%20" + encodedText}`;

            // Open the Telegram sharing dialog in a new window/tab
            window.open(telegramUrl, "_blank");
          }}
        >
          Share on Whatsapp
        </div>
      </div>
    </div>
  );
}
