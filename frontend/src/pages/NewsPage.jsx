// src/pages/NewsPage.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Import your images
import news1 from "../assets/Images/news/news1.png";
import news2 from "../assets/Images/news/news2.jpg";
import news3 from "../assets/Images/news/news3.png";

// Page header image
import headerImg from "../assets/Images/news/news-header.jpg";

export default function NewsPage() {
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const news = [
    {
      id: 1,
      title: "NCTHSL receives the Nigerian Air Force.",
      category: "General",
      author: "Admin",
      date: "Nov 25, 2025",
      coverImage: news1,
      galleryImages: [],
      preview: `
        NCTHSL warmly receives the Nigerian Air Force Executive Airlift Group...
      `,
      fullContent: `
        The Managing Director of NCTHSL, Captain KW. Mbaya warmly received the 
        Nigerian Air Force Executive Airlift Group team during their courtesy
        visit to our company.

        The visit, led by Commander Air Commodore O.A Oluwatayo was aimed 
        at strengthening collaboration and fostering institutional relationships.
        Discussions centered on reinforcing ties and exploring areas of mutual 
        support and cooperation.
      `
    },
    {
      id: 2,
      title: "Strengthening Partnerships for Sustainable Growth.",
      category: "partnership and Collaborations",
      author: "Admin",
      date: "Oct 15, 2025",
      coverImage: news2,
      galleryImages: [],
      preview: `
        Visitations to the Infrastructure Concession Regulatory Commission (ICRC)...
      `,
      fullContent: `
        On the 14th of October 2025, 
        DCG Bomodi (Director), The Managing Director - Captain K.W Mbaya, 
        and LACS visited the Infrastructure Concession Regulator Commission (ICRC) 
        for strategic consultations focused on  enhancing collaboration, deepening 
        partnerships, and driving sustainable growth for the Nigeria Customs 
        Technical and Hangar Services Limited (NCTHSL) and its stakeholders.

        Together, we continue to build stronger frameworks for efficiency, 
        innovation, and service excellence in the aviation sector.
      `
    },
    {
      id: 3,
      title: "NCTHSL Hosts Africair for a Two-Day Demonstration Flight at its Hangar",
      category: "Maintenance",
      author: "Admin",
      date: "Oct 8, 2025",
      coverImage: news3,
      galleryImages: [],
      preview: `
        The Comptroller General of Nigeria Customs Service, BA Adeniyi MFR...
      `,
      fullContent: `
        NCTHSL Hosts Africair for a Two-Day Demonstration Flight at its Hangar.
        The two-day demonstration flight at our state-of-the-art hangar marks 
        another milestone in our continous drive to enhance aviation excellence 
        and strengthen industry partnerships.

        The Comptroller General of the Nigeria Customs Service, BA Adeniyi MFR, 
        the Managing Director of NCTHSL, Capt. KW Mbaya, and Africair's Vice President, 
        Mr. Robert Prentice, who led his technical team on this significant visit.

        During the engagement, Africair showcased its Cessna SkyCourier aircraft's 
        cutting-edge capabilities through an impress test flight that underscored the potential 
        for advanced operational collaborations within Nigeria's rapidly evolving 
        aviation sector. The demonstration provideda an excellent platform for knowledge 
        exchange, technical evaluation, and discussions on future partnerships aimed 
        at improving efficiency and innovation across the aviation value chain.
      `
    }
  ];

  return (
    <>
      {/* Header */}
      <motion.header
        className="w-full h-72 md:h-80 bg-cover bg-center relative flex items-center justify-center"
        style={{ backgroundImage: `url(${headerImg})` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-black/60"></div>

        <motion.div
          className="relative text-center text-white px-6"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-wide">
            News & Updates
          </h1>
          <p className="mt-3 text-gray-200 text-sm md:text-base max-w-xl mx-auto">
            Stay informed about operational updates, aviation technology,
            and key developments at NCTHSL.
          </p>
        </motion.div>
      </motion.header>

      {/* Main Section */}
      <motion.section
        className="py-20 px-6 bg-gradient-to-br from-[#818589] to-[#525354] min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-5xl mx-auto">

          <motion.h1
            className="text-4xl font-bold text-[#f7f7f7] mb-10"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
          >
            Latest News
          </motion.h1>

          <motion.div
            className="space-y-10"
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.15 } },
            }}
          >
            {news.map((item) => {
              const isExpanded = expandedId === item.id;

              return (
                <motion.article
                  key={item.id}
                  className="bg-white p-8 rounded-2xl shadow-md"
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 15px 35px rgba(0,0,0,0.18)",
                  }}
                  variants={{
                    hidden: { opacity: 0, y: 40 },
                    show: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.6 },
                    },
                  }}
                >
                  {/* Image */}
                  <motion.img
                    src={item.coverImage}
                    alt={item.title}
                    className="w-full h-64 object-cover rounded-xl mb-6"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7 }}
                  />

                  {/* Meta */}
                  <motion.div
                    className="text-xs text-gray-500 mb-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {item.category} • {item.date} • {item.author}
                  </motion.div>

                  {/* Title */}
                  <motion.h2 className="text-2xl font-bold text-[#0A4D2D] mb-3">
                    {item.title}
                  </motion.h2>

                  {/* Preview or Full Content */}
                  <motion.p className="text-gray-700 whitespace-pre-line leading-relaxed">
                    {isExpanded ? item.fullContent : item.preview}
                  </motion.p>

                  {/* Expandable Section */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4 }}
                        className="mt-4"
                      ></motion.div>
                    )}
                  </AnimatePresence>

                  {/* READ MORE / SHOW LESS */}
                  <motion.button
                    onClick={() => toggleExpand(item.id)}
                    className="mt-4 text-[#0A4D2D] font-semibold hover:underline"
                    whileHover={{ x: 5 }}
                  >
                    {isExpanded ? "Show Less ←" : "Read More →"}
                  </motion.button>
                </motion.article>
              );
            })}
          </motion.div>
        </div>
      </motion.section>
    </>
  );
}
