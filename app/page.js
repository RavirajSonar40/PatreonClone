
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="flex flex-col items-center gap-4 justify-center h-[44vh] text-white">
        <div className="font-bold text-3xl">Buy me a thing</div>
        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry</p>
        <div>
          <Link href={"/getposts"}>
          <button
            type="button"
            className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            >
            Start now
          </button>
            </Link>
          <Link href={"/login"} >
          <button 
            type="button"
            className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            >
            Login now
          </button>
            </Link> 
        </div>
      </div>

      <div className="bg-white h-1 opacity-10"></div>

      {/* First Section */}
      <div className="text-white container mx-auto py-16">
        <h1 className="text-2xl font-bold text-center my-10">Your Fans can give you a Vadapav</h1>
        <div className="flex gap-5 justify-around">
          <div className="item space-y-3 flex flex-col justify-center items-center">
            <Image
              className="bg-slate-500 rounded-full text-black p-2"
              width={70}
              height={70} // Specify height for proper layout
              src="/man.gif"
              alt="Fund Yourself"
            />
            <p className="text-sm">Fund Yourself</p>
            <p className="text-center">Your fans are here to help you</p>
          </div>
          <div className="item space-y-3 flex flex-col justify-center items-center">
            <Image
              className="bg-slate-500 rounded-full text-black p-2"
              width={70}
              height={70} // Specify height for proper layout
              src="/coin.gif"
              alt="Fund Yourself"
            />
            <p className="text-sm">Fund Yourself</p>
            <p className="text-center">Your fans are here to help you</p>
          </div>
          <div className="item space-y-3 flex flex-col justify-center items-center">
            <Image
              className="bg-slate-500 rounded-full text-black p-2"
              width={70}
              height={70} // Specify height for proper layout
              src="/group.gif"
              alt="Fund Yourself"
            />
            <p className="text-sm">Fund Yourself</p>
            <p className="text-center">Your fans are here to help you</p>
          </div>
        </div>
      </div>

      <div className="bg-white h-1 opacity-10"></div>

      {/* Second Section */}
      <div className="text-white container mx-auto py-16">
        <h1 className="text-2xl font-bold text-center my-10">Learn more about us</h1>
        <div className="flex gap-5 justify-around">
          <div className="item space-y-3 flex flex-col justify-center items-center">
            <Image
              className="bg-slate-500 rounded-full text-black p-2"
              width={70}
              height={70} // Specify height for proper layout
              src="/man.gif"
              alt="Learn more"
            />
            <p className="text-sm">Fund Yourself</p>
            <p className="text-center">Your fans are here to help you</p>
          </div>
          <div className="item space-y-3 flex flex-col justify-center items-center">
            <Image
              className="bg-slate-500 rounded-full text-black p-2"
              width={70}
              height={70} // Specify height for proper layout
              src="/coin.gif"
              alt="Learn more"
            />
            <p className="text-sm">Fund Yourself</p>
            <p className="text-center">Your fans are here to help you</p>
          </div>
          <div className="item space-y-3 flex flex-col justify-center items-center">
            <Image
              className="bg-slate-500 rounded-full text-black p-2"
              width={70}
              height={70} // Specify height for proper layout
              src="/group.gif"
              alt="Learn more"
            />
            <p className="text-sm">Fund Yourself</p>
            <p className="text-center">Your fans are here to help you</p>
          </div>
        </div>
      </div>
    </>
  );
}
