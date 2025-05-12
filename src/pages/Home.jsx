import React from "react";
import homeImage from "../assets/utils/1.png";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="grid place-items-center text-center h-screen bg-hero bg-cover bg-center px-4">
        <div className="w-full max-w-4xl space-y-10 p-5 rounded-lg backdrop-blur-sm bg-gradient-to-r from-white to-black bg-clip-text text-transparent hover:shadow-xl transition duration-300">
          <h1 className="font-serif text-lg sm:text-xl p-2 mb-5 bg-clip-text text-transparent">
            WELCOME TO JOB_DIARY
          </h1>
          <h1 className="text-4xl sm:text-7xl font-bold p-2 m-2 bg-gradient-to-tr from-slate-900 to-slate-400 text-transparent bg-clip-text">
            Let Bring The Gratest <br /> Opportunity For You
          </h1>
          <div className="p-2 m-1 ">Join In</div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 px-4 sm:px-8 py-8">
        <div className="hover:shadow-xl transition duration-300 p-5 rounded-lg">
          <img
            src={homeImage}
            alt="logo"
            className="max-h-[300px] dark:invert mx-auto"
          />
        </div>
        <div className="flex justify-center items-center p-5 hover:shadow-xl transition duration-300 rounded-lg">
          <div className="bg-gradient-to-tr from-slate-400 to-slate-900 text-transparent bg-clip-text text-left">
            <h1 className="text-2xl sm:text-3xl font-semibold pb-5">
              OUR STORY
            </h1>
            <h2 className="text-3xl sm:text-5xl pb-6 font-bold">
              For People Who Love Fashion
            </h2>
            <p className="pb-4 text-sm sm:text-base">
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Placeat
              ratione...
            </p>
            <p className="pb-4 text-sm sm:text-base">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Tempora...
            </p>
            <button className="p-2 mt-2 bg-slate-900 text-white rounded dark:bg-white dark:text-cyan-900">
              Read More
            </button>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-16 px-4">
        <h1 className="text-3xl sm:text-5xl p-8 text-center font-bold">
          What Our Customers Say
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {["Hnin", "Phyu", "Hnin Phyu"].map((name, i) => (
            <div
              key={i}
              className="hover:shadow-xl transition p-5 rounded-lg border bg-gradient-to-tl from-slate-900 to-slate-400 text-transparent bg-clip-text"
            >
              <h1 className="text-xl sm:text-2xl pb-5 font-semibold">{name}</h1>
              <p className="text-sm sm:text-base">
                Lorem ipsum dolor sit amet consectetur adipisicing elit...
              </p>
              <img
                src={homeImage}
                alt="logo"
                className="h-24 w-24 rounded-full mx-auto dark:invert mt-5"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Gift Card Section */}
      <section className="px-4 sm:px-8 py-12">
        <div className="backdrop-blur-sm p-5 space-y-10 rounded-lg bg-gradient-to-tr from-sky-500 to-sky-900 text-transparent bg-clip-text hover:shadow-xl transition duration-300">
          <h1 className="font-serif text-lg sm:text-xl">GIFT CARD</h1>
          <h1 className="text-4xl sm:text-7xl font-bold bg-gradient-to-tr from-slate-900 to-slate-400 text-transparent bg-clip-text">
            Give The Gift of <br /> Fashion
          </h1>
          <div className="p-3 border text-cyan-900 w-fit mx-auto hover:shadow-xl rounded-lg cursor-pointer">
            Purchase A Gift Card
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-5 text-center">
        {[
          { name: "SECURE PAYMENT" },
          { name: "DELIVER WITH CARE" },
          { name: "EXCELLENT SERVICE" },
        ].map((item, i) => (
          <div
            key={i}
            className="hover:shadow-xl transition p-5 rounded-lg border bg-gradient-to-tl from-slate-900 to-slate-400 text-transparent bg-clip-text"
          >
            <h1 className="text-xl sm:text-2xl pb-5 font-semibold">
              {item.name}
            </h1>
            <div className="flex flex-col items-center space-y-4 sm:space-y-0 sm:flex-row sm:space-x-5">
              <img
                src={homeImage}
                alt="logo"
                className="h-20 w-20 rounded-full dark:invert"
              />
              <p className="text-sm sm:text-base">
                Lorem ipsum dolor sit amet consectetur adipisicing elit...
              </p>
            </div>
          </div>
        ))}
      </section>
      <div>
        <div className="h-screen flex items-center justify-between p-8 md:p-16">
          <div className="w-1/2 ">
            <h1 className="text-4xl font-bold  mb-4">
              Unlock Your Potential Today!
            </h1>
            <p className="text-lg mb-8">
              Join thousands of satisfied users who have transformed their lives
              with our innovative solutions. Experience the difference and take
              the first step towards a brighter future.
            </p>
            <p>Job Seeker</p>
            <div className=" text-center bg-cyan-900 text-white">
              <p>xyz@mail.com</p>
              <label>Password </label>
              <p>abc</p>
            </div>
            <h3>For Employer</h3>
            <div className="bg-cyan-900 text-center text-white">
              <p>itland@mail.com</p>
              <label>Password </label>
              <p>abc</p>
            </div>
            <div className="pt-5">
              Optional Call to Action Button
              <Link
                to="/register_company"
                // className=" text-white font-bold py-3 px-6 rounded-full"
                className="underline font-bold py-3 px-6 rounded-full"
              >
                For Employer To Register
              </Link>
            </div>
          </div>
          <div className="w-1/2 flex justify-end">
            <img
              src={homeImage}
              alt="homeImage"
              className=" dark:invert-100 "
              // className="max-w-md rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Footer or Ending Section */}
      <section className="py-16 px-4 text-center">
        <h1 className="text-3xl sm:text-5xl p-8 text-center font-bold">
          Have A Good Day!
        </h1>
        <p>DEVELOP_BY_HTOO_MYAT_NYI_NYI</p>
      </section>
    </div>
  );
};

export default Home;
