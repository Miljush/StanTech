import React from "react";
import { Link } from "react-router-dom";

const handleEmailLinkClick = () => {
  window.open("https://mail.google.com/", "_blank");
};
const OnamaPage = () => {
  return (
    <div className="pt-16 ml-14">
      <div className="text-2xl items-center font-bold mb-6 text-align">
        O Nama / Kontakt
      </div>
      <div className="text-l mb-6 flex text-align">
        StanTech je web aplikacija osnovana 2023. godine od strane talentovanog
        tima StanSquad. Predstavlja prvi projekat ovog tima i donosi inovacije u
        oblasti oglašavanja stanova i olakšava pronalaženje majstora. StanTech
        je namenjen korisnicima širom Balkana koji žele brzo i efikasno postave
        oglase za nekretnine i da pronađu majstora za različite usluge. Ova
        platforma omogućava korisnicima da postave oglase za stanove i potrebne
        popravke, dok majstorima pruža jednostavan način da pronađu i
        kontaktiraju odgovarajuće oglase koje su postavili stanari. StanTech se
        ističe svojim modernim dizajnom i intuitivnim korisničkim interfejsom,
        olakšavajući proces oglašavanja i pronalaženja majstora na efikasan i
        prijatan način.
      </div>
      <div className="mt-8">
        <div className="text-xl font-bold mb-2">Čemu težimo</div>
        <div className="text-l flex">
          Posvećeni smo ostvarivanju besprekorne komunikacije između stanara,
          stanodavaca i majstora. S pažnjom slušamo korisničke potrebe i predani
          smo ispunjavanju svakog zahteva. Naš cilj je da pružimo vrhunsku
          uslugu i budemo uzor u poslovanju kako korisnicima, tako i drugim
          kompanijama.
        </div>
      </div>
      <hr className="border-t border-gray-300 my-8" />
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="text-lg font-bold mt-6">Korisnička podrška:</div>
            <div className="text-xs mt-2">Kontakt StanTech tel:</div>
            <div className="flex items-center">
              <Link to="tel:1234567891" className="text-l">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  className="w-4 h-4 inline-block"
                >
                  <path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24c-18.6 5.3-30.7 21.1-30.7 38.9 0 247.4 200.6 448 448 448 18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z" />
                </svg>
                <span className="ml-2">123456789</span>
              </Link>
            </div>
            <div className="text-xs mt-2">Kontakt mail:</div>
            <div className="justify-center items-center">
              <Link to="#" onClick={handleEmailLinkClick} className="text-l">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  className="w-4 h-4 mr-2 inline-block align-middle .back-to-top"
                >
                  <path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z" />
                </svg>
                stantech@gmail.com
              </Link>
            </div>
          </div>
          <div>
            <div className="text-lg font-bold mt-6">
              Poslovne prostorije/sedište, dokumenti, fakture:
            </div>
            <div className="text-l">
              <div className="flex">
                <div className="mr-2">Adresa:</div>
                <div className="text-l">Zlatkova 18c, Niš</div>
              </div>
              <div className="flex">
                <div className="mr-2">Maticni broj:</div>
                <div className="text-l">123456789012</div>
              </div>
              <div className="flex">
                <div className="mr-2">PIB:</div>
                <div className="text-l">1234567890</div>
              </div>
              <div className="flex">
                <div className="mr-2">Radno vreme:</div>
                <div className="text-l">09:30-17:30</div>
              </div>
            </div>
          </div>
        </div>
        <div className="items-center mt-5">
          <div className="text-lg font-bold">Kontakt za medije:</div>
          <div className="text-xs">Kontakt mail:</div>
          <div className="justify-center items-center ">
            <Link
              to="#"
              onClick={handleEmailLinkClick}
              className="text-l flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                className="w-4 h-4 mr-2 inline-block align-middle .back-to-top"
              >
                <path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z" />
              </svg>
              stantechmarketing@gmail.com
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnamaPage;
