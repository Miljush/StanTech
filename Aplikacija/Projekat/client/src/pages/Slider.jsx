import LoadingPage from "./LoadingPage";
import { BsChevronCompactLeft, BsChevronCompactRight } from 'react-icons/bs';
import { RxDotFilled } from 'react-icons/rx';
import React, { useEffect, useState } from "react";
import axios from "axios";

const Slider = ({ id }) => {
  const [oglas, setOglas] = useState([]);
  const [ready, setReady] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    axios.get("/stanOglas/vratiOglas", { params: { id: id } }).then((response) => {
      setOglas(response.data);
      setReady(true);
    });
  }, [ready]);

  

  if (!ready) {
    return <LoadingPage />;
  } else {
    const prevSlide = () => {
      const isFirstSlide = currentIndex === 0;
      const newIndex = isFirstSlide ? oglas.putanja_slike.length - 1 : currentIndex - 1;
      setCurrentIndex(newIndex);
    };

    const nextSlide = () => {
      const isLastSlide = currentIndex === oglas.putanja_slike.length - 1;
      const newIndex = isLastSlide ? 0 : currentIndex + 1;
      setCurrentIndex(newIndex);
    };

    const goToSlide = (slideIndex) => {
      setCurrentIndex(slideIndex);
    };

    return (
      <div className='max-w-[1500px] h-[780px] w-full m-auto py-16 px-4 relative group z-10'>
        <div style={{ backgroundImage: `url(http://localhost:3500/uploads/${oglas?.putanja_slike[currentIndex]})` }}
          className="w-full h-full rounded-2xl bg-center bg-cover duration-500"></div>
        {/* {Leva Strelica} */}
        <div className="hidden group-hover:block absolute top-50% translate-x-5 translate-y-[-750%] left-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer">
          <BsChevronCompactLeft onClick={prevSlide} size={30} />
        </div>
        {/* {Desna Strelica} */}
        <div className="hidden group-hover:block absolute top-50% -translate-x-5 translate-y-[-750%] right-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer">
          <BsChevronCompactRight onClick={nextSlide} size={30} />
        </div>
        <div className="flex top-4 justify-center py-2">
          {oglas?.putanja_slike?.map((slika, slideIndex) => (
            <div key={slideIndex} onClick={() => goToSlide(slideIndex)} className="text-2xl cursor-pointer">
              {slideIndex === currentIndex ? <RxDotFilled size={20} /> : <RxDotFilled />}
            </div>
          ))}
        </div>
      </div>
    );
  }
};

export default Slider;