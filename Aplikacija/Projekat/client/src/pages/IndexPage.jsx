import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../Header";
import { BsChevronCompactLeft, BsChevronCompactRight } from 'react-icons/bs';
import { RxDotFilled } from 'react-icons/rx';
import axios from "axios";
import LoadingPage from "./LoadingPage";
import Footer from "../Footer";

const IndexPage = ({socket}) => {
  const [oglasi, setOglasi] = useState([]);
  const [ready, setReady] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    axios.get("/stanOglas/vratiNaslovneOglase").then((response) => {
      setOglasi(response.data);
      setReady(true);
    });
  }, []);
  useEffect(() => {
    const slideInterval = setInterval(() => {
      const isLastSlide = currentIndex === 2;
      const newIndex = isLastSlide ? 0 : currentIndex + 1;
      setCurrentIndex(newIndex);
    }, 3500);

    return () => clearInterval(slideInterval);
  }, [currentIndex, oglasi.length]);
  if (!oglasi[2]?.putanja_slike?.[0]) {
    return <LoadingPage />;
  } else {
    const prevSlide = () => {
      const isFirstSlide = currentIndex === 0;
      const newIndex = isFirstSlide ? oglasi.length - 1 : currentIndex - 1;
      setCurrentIndex(newIndex);
    };

    const nextSlide = () => {
      const isLastSlide = currentIndex === oglasi.length - 1;
      const newIndex = isLastSlide ? 0 : currentIndex + 1;
      setCurrentIndex(newIndex);
    };

    const goToSlide = (slideIndex) => {
      setCurrentIndex(slideIndex);
    };
    return (
      <>
        <Header socket={socket}/>
        <div className="intro  position-relative mt-5 ">
          
          <div className="">
            {/* <div className=" absolute top-50% translate-x-5 -translate-y-[-1000%] left-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer z-50">
            <BsChevronCompactLeft onClick={prevSlide} size={30} />
            </div>
            <div className=" absolute top-50% -translate-x-5 -translate-y-[-1000%] right-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer z-50">
            <BsChevronCompactRight onClick={nextSlide} size={30} />
            </div> */}
            <div
              className="swiper-slide carousel-item-a intro-item bg-image duration-500"
              style={{
                backgroundImage: `url(http://localhost:3500/uploads/${oglasi[currentIndex]?.putanja_slike?.[0]})`,
              }}
            >
              <div className="overlay overlay-a"></div>
              <div className="intro-content display-table">
                <div className="table-cell">
                  <div className="container">
                    <div className="row">
                      <div className="col-lg-8">
                        <div className="intro-body">
                          <p className="intro-title-top">{oglasi[currentIndex]?.ime}</p>
                          <h1 className="intro-title mb-4 ">
                            <span className="color-b">
                              {oglasi[currentIndex]?.adresa.replace(/^\D+/g, "")}
                            </span>{" "}
                            {oglasi[currentIndex]?.adresa.replace(/[0-9]/g, "")}
                            <br /> {oglasi[currentIndex]?.brojSoba}
                          </h1>
                          <p className="intro-subtitle intro-price">
                            <a href={"/oglas/" + oglasi[currentIndex]?._id}>
                              <span className="price-a">iznajmi | € {oglasi[currentIndex]?.cena}</span>
                            </a>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
            </div>
            <div className="-translate-y-[300%] flex top-4 justify-center py-2 z-50">
          {oglasi.map((oglas, slideIndex) => (
            <div key={slideIndex} onClick={() => goToSlide(slideIndex)} className="text-2xl cursor-pointer">
              {slideIndex === currentIndex ? <RxDotFilled size={20} /> : <RxDotFilled />}
            </div>
          ))}
        </div>
          </div>
          
        </div>
        <Footer/>
      </>
    );
  }
};

export default IndexPage;
