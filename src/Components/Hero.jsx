import React from "react";
import dp1 from "../assets/profile1.png";
import dp2 from "../assets/profile2.jpg";
import dp3 from "../assets/profile3.jpg";
import dp4 from "../assets/profile4.png";
import dp5 from "../assets/profile5.jpg";

const Hero = () => {
  const cards = [
    {
      id: 1,
      title: "Home Cleaning",
      content: "Get your home deep cleaned by professionals for a spotless space.",
      imgSrc:
        "https://www.dirtblastercleaningservices.com/wp-content/uploads/2021/05/Apartment-Cleaning-Services-Pune.jpg",
    },
    {
      id: 2,
      title: "AC Repair",
      content: "Expert AC repair and servicing to keep your cooling efficient.",
      imgSrc:
        "https://content.jdmagicbox.com/comp/def_content_category/ac-cleaning-services/360-f-288995585-4gmh9yorrie0zisc8dtqnl3d4dbhgeka-ac-cleaning-services-1-qs6s0.jpg",
    },
    {
      id: 3,
      title: "Electrician",
      content: "Reliable electrician services for repairs, wiring, and installation.",
      imgSrc:
        "https://esub.com/wp-content/uploads/2020/06/shutterstock_1469712527-e1593014532674.jpg",
    },
    {
      id: 4,
      title: "Plumber",
      content: "Quick plumbing solutions for leaks, installations, and repairs.",
      imgSrc:
        "https://www.serviceonwheel.com/uploads/service/834431670584630.jpg",
    },
    {
      id: 5,
      title: "Carpenter",
      content: "Skilled carpentry services for furniture, repairs, and fittings.",
      imgSrc:
        "https://3.imimg.com/data3/NE/TD/MY-10964064/carpentry-services-500x500.jpg",
    },
    {
      id: 6,
      title: "Gardener",
      content: "Professional gardening services for lawn care and landscaping.",
      imgSrc:
        "https://www.local-gardeners.co.uk/wp-content/uploads/2018/10/shrub-maintenance-mistakes.jpg",
    },
  ];
  
  

  const teamMembers = [
    {
      name: "Vishal Gupta",
      role: "Mentor",
      image: dp1,
    },
    {
      name: "Dia Ahuja",
      role: "Mentee",
      image: dp2,
    },
    {
      name: "Divyanshi Sharma",
      role: "Mentee",
      image: dp3,
    },
    {
      name: "Hemambika Reddy",
      role: "Mentee",
      image: dp4,
    },
    {
      name: "Mishka Thakur",
      role: "Mentee",
      image: dp5,
    },
  ];

  return (
    <div className="-mt-40 p-6 md:p-12">
      {/* Services Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-x-20 transform scale-80">
        <h1 className="-mt-10 mb-2 text-4xl font-bold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-black flex whitespace-nowrap">
          Your{" "}
          <span className="text-blue-600 dark:text-blue-500">&nbsp;Home</span>,
          Our Priority.
        </h1>
        <p className="col-span-full -mt-8 text-gray-700 text-xl text-left">
          Browse our expertly curated services designed for your convenience.
        </p>
        {cards.map((card) => (
          <a
            key={card.id}
            href="/services"
            className="flex flex-col bg-white border border-gray-200 rounded-lg shadow-md hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            <img
              className="object-cover w-full h-32 rounded-t-lg md:h-48"
              src={card.imgSrc}
              alt={card.title}
            />
            <div className="flex flex-col justify-between p-3 leading-normal">
              <h5 className="mb-1 text-lg font-bold tracking-tight text-gray-900 dark:text-white">
                {card.title}
              </h5>
              <p className="mb-2 font-normal text-gray-700 dark:text-gray-400">
                {card.content}
              </p>
            </div>
          </a>
        ))}
        <h1 className="mt-8 mb-2 text-4xl font-bold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-black flex whitespace-nowrap">
          About Us
        </h1>
        <p className="col-span-full -mt-2 text-gray-800 text-2xl text-left">
          At{" "}
          <span className="text-blue-600 dark:text-blue-500">&nbsp;Fixly</span>,
          we make home maintenance effortless by connecting you with top
          professionals for cleaning, repairs, and essential services. Whether
          you need an expert electrician, a reliable plumber, or a skilled
          carpenter, we've got you covered with trusted, high-quality service
          providers.
        </p>
        <p className="col-span-full -mt-2 text-gray-800 text-3xl text-left">
          Our Mission
        </p>
        <p className=" col-span-full -mt-8 text-gray-800 text-2xl text-left">
          We aim to simplify home care by offering seamless access to skilled
          professionals, ensuring quality service, affordability, and
          convenience—all at your fingertips.
        </p>
        <p className="col-span-full -mt-2 text-gray-800 text-3xl text-left">
          Our Vision
        </p>
        <p className=" col-span-full -mt-8 text-gray-800 text-2xl text-left">
          To become the most trusted home service platform, where every
          household can find reliable, hassle-free solutions with just a few
          clicks.
        </p>
        <p className="col-span-full -mt-2 text-gray-800 text-3xl text-left">
          Our Values
        </p>
        <div className="col-span-full -mt-8 text-gray-800 text-2xl text-left space-y-2">
          <p>✔ Customer-Centric Approach – Your satisfaction drives us.</p>
          <p>
            ✔ Trust & Reliability – Verified professionals, guaranteed quality.
          </p>
          <p>
            ✔ Efficiency & Convenience – Quick, easy, and seamless service
            bookings.
          </p>
          <p>✔ Affordability – Transparent pricing with no hidden costs.</p>
        </div>
        <p className="col-span-full -mt-2 text-gray-800 text-3xl text-left">
          Our Team
        </p>
        <p className=" col-span-full -mt-8 text-gray-800 text-2xl text-left">
          We’re a dynamic group of individuals who are passionate about what we
          do and dedicated to delivering the best results for our clients.
        </p>
        <div className="w-screen py-10 text-center -ml-20">
          {/* <h2 className="text-2xl font-semibold text-gray-800 mb-6">Meet the team</h2> */}
          <div className="flex flex-wrap justify-evenly gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="flex flex-col items-cente">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-40 h-40 rounded-full object-cover border-2 border-gray-300"
                />
                <p className="mt-2 text-gray-700 font-medium">{member.name}</p>
                <p className=" text-gray-400 font-medium">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
