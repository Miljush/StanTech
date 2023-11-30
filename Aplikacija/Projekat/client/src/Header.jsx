import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "./UserContext";
import { useLocation } from "react-router-dom";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";

import {
  NovuProvider,
  PopoverNotificationCenter,
  NotificationBell,
  useUpdateAction,
  useNotifications,
  useSocket,
  MessageActionStatusEnum,
} from "@novu/notification-center";
import axios from "axios";
import LoadingPage from "./pages/LoadingPage";
import Chat from "./pages/Chat/Chat";

const Header = ({ socket }) => {
  const { username, ready } = useContext(UserContext);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;
  const [isWideScreen, setIsWideScreen] = useState(false);
  const [requests, setRequests] = useState([]);
  const [isChatVisible, setIsChatVisible] = useState(false);

  useEffect(() => {
    const checkScreenWidth = () => {
      setIsWideScreen(window.innerWidth > 992);
    };

    checkScreenWidth();

    window.addEventListener("resize", checkScreenWidth);

    return () => {
      window.removeEventListener("resize", checkScreenWidth);
    };
  }, [socket]);

  function MyPopoverNotification() {
    const { updateAction } = useUpdateAction();
    const notifications = useNotifications();

    return (
      <PopoverNotificationCenter
        // tabs={[
        //   { name: 'Zahtevi', storeId: 'zahtevi' },
        //   { name: 'Problemi', storeId: 'problemi' },
        // ]}
        onNotificationClick={handlerOnNotificationClick}
        onActionClick={(templateIdentifier, type, message) =>
          handlerOnActionClick(
            templateIdentifier,
            type,
            message,
            updateAction,
            notifications
          )
        }
        colorScheme="white"
      >
        {({ unseenCount }) => {
          return <NotificationBell unseenCount={unseenCount} />;
        }}
      </PopoverNotificationCenter>
    );
  }

  async function handlerOnActionClick(
    templateIdentifier,
    type,
    message,
    updateAction,
    notifications
  ) {
    if (templateIdentifier === "friend-request") {
      const usernameStanara = message.content.replace(
        " Vam je poslao zahtev za prijateljstvo!",
        ""
      );
      if (type === "primary") {
        await axios.post("/primiZahtev", {
          salje: usernameStanara,
          prima: username.username,
        });
        await updateAction({
          messageId: message._id,
          actionButtonType: "primary",
          status: MessageActionStatusEnum.DONE,
        });
        socket.emit("prihvati", {
          usernameStanodavca: username.username,
          usernameStanara: usernameStanara,
        });
        await prihvatiFun(usernameStanara);
      } else if (type === "secondary") {
        await axios.post("/odbijZahtev", {
          salje: usernameStanara,
          prima: username.username,
        });
        await updateAction({
          messageId: message._id,
          actionButtonType: "secondary",
          status: MessageActionStatusEnum.DONE,
        });
        socket.emit("odbij", {
          usernameStanodavca: username.username,
          usernameStanara: usernameStanara,
        });
        await odbijFun(usernameStanara);
      }
    }
  }

  async function prihvatiFun(usernameStanara) {
    try {
      const sendNotification = await fetch("http://localhost:3500/prihvati", {
        method: "POST",
        body: JSON.stringify({
          usernameStanodavca: username.username,
          usernameStanara: usernameStanara,
        }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      await sendNotification.json();
    } catch (err) {
      console.error(err);
    }
  }

  async function odbijFun(usernameStanara) {
    try {
      const sendNotification = await fetch("http://localhost:3500/odbij", {
        method: "POST",
        body: JSON.stringify({
          usernameStanodavca: username.username,
          usernameStanara: usernameStanara,
        }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      await sendNotification.json();
    } catch (err) {
      console.error(err);
    }
  }

  function handlerOnNotificationClick(message) {
    const stanar = message.content.replace(
      " Vam je poslao zahtev za prijateljstvo!",
      ""
    );
    if (message.content.includes(" Vam je poslao zahtev za prijateljstvo")) {
      window.open(`http://localhost:5173/profile/${stanar}`, "_blank");
    }
    
    if (message?.cta?.data?.url) {
      window.location.href = message.cta.data.url;
    }
  }

  const headerStyle = isScrolled ? "bg-[#212429]" : "bg-white";
  const textcolor = isScrolled ? "text-white" : "";
  const strokecolor = isScrolled ? "white" : "currentColor";
  const strokecolorinvert = isScrolled ? "currentColor" : "white";
  const shadow = isScrolled ? "" : "shadow-md shadow-gray-300";
  const mobilebutton = isScrolled ? "bg-white" : "bg-gray-600";
  const bordermobilebtn = isScrolled ? "" : "border-gray-600";
  const headerHight = isMobileMenuOpen ? "container" : "hidden";
  const dugme = isMobileMenuOpen ? "" : "collapsed";
  const logomob = isMobileMenuOpen ? "hidden" : "";
  const widelogo = isWideScreen ? "hidden" : "";
  const promeni = isWideScreen ? "container" : "hidden";
  const flexdodaj = isWideScreen ? "flex" : "";

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  function onNotificationClick(message) {
    if (message?.cta?.data?.url) {
      window.location.href = message.cta.data.url;
    }
  }

  const toggleChat = () => {
    setIsChatVisible(!isChatVisible);
  };

  return (
    <>
      <nav className="grid grid-cols-1 navbar navbar-default navbar-trans navbar-expand-lg fixed-top">
        <div>
          <button
            onClick={toggleMobileMenu}
            className={`w-12 navbar-toggler ${dugme}`}
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarDefault"
            aria-controls="navbarDefault"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          <a
            className={`pl-2 navbar-brand text-brand ${logomob} ${widelogo}`}
            href="/"
          >
            Stan<span className="color-b">Tech</span>
          </a>
        </div>

        <div className={`${headerHight} ${promeni} `}>
          <Link
            to={"/"}
            href=""
            className={`flex items-center gap-1 nav-link-hover `}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z"
              />
            </svg>
          </Link>
          <a className=" navbar-brand text-brand " href="/">
            Stan<span className="color-b">Tech</span>
          </a>
          <div className={`navbar-collapse  justify-content-center`}>
            <ul className="navbar-nav">
              <li className={`nav-item ${currentPath === "/" ? "active" : ""}`}>
                <a className="nav-link" href="/">
                  Glavna
                </a>
              </li>
              {username?.role == "Majstor" && (
                <li
                  className={`nav-item ${
                    currentPath === "/MajstorOglasi" ? "active" : ""
                  }`}
                >
                  <a className="nav-link" href="/MajstorOglasi">
                    Majstor Oglasi
                  </a>
                </li>
              )}
              <li
                className={`nav-item ${
                  currentPath === "/SviOglasi" ? "active" : ""
                }`}
              >
                <a className="nav-link" href="/SviOglasi">
                  Svi Oglasi
                </a>
              </li>
              <li
                className={`nav-item ${
                  currentPath === "/Onama" ? "active" : ""
                }`}
              >
                <a className="nav-link" href="/Onama">
                  O nama
                </a>
              </li>
            </ul>
          </div>
          <div className="flex items-center">
            <Link
              to={username ? "/account" : "/login"}
              className={`flex gap-2 border border-gray-300 rounded-full py-2 px-4 ${shadow}`}
            >
              <div className="bg-gray-500 text-white rounded-full border border-gray-500 oberflow-hidden">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="sm:w-6 h-6 relative top-1"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.25 6.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM15.75 9.75a3 3 0 116 0 3 3 0 01-6 0zM2.25 9.75a3 3 0 116 0 3 3 0 01-6 0zM6.31 15.117A6.745 6.745 0 0112 12a6.745 6.745 0 016.709 7.498.75.75 0 01-.372.568A12.696 12.696 0 0112 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 01-.372-.568 6.787 6.787 0 011.019-4.38z"
                    clipRule="evenodd"
                  />
                  <path d="M5.082 14.254a8.287 8.287 0 00-1.308 5.135 9.687 9.687 0 01-1.764-.44l-.115-.04a.563.563 0 01-.373-.487l-.01-.121a3.75 3.75 0 013.57-4.047zM20.226 19.389a8.287 8.287 0 00-1.308-5.135 3.75 3.75 0 013.57 4.047l-.01.121a.563.563 0 01-.373.486l-.115.04c-.567.2-1.156.349-1.764.441z" />
                </svg>
              </div>
              {!!username && (
                <div className={`color-b font-bold`}>{username.ime}</div>
              )}
            </Link>
            {username && (
              <div className="mx-2.5">
                <NovuProvider
                  // stores={[
                  //   { storeId: 'zahtevi', query: { feedIdentifier: 'zahtevi' } },
                  //   { storeId: 'problemi', query: { feedIdentifier: 'problemi' } },
                  // ]}
                  subscriberId={`${username.username}`}
                  applicationIdentifier={"kH7LyznVor9k"}
                  initialFetchingStrategy={{ fetchNotifications: true }}
                  i18n={{
                    lang: "sr",
                    translations: {
                      markAllAsRead: "Označi sve kao pročitano",
                      notifications: "Obaveštenja",
                      settings: "Podešavanja",
                    },
                  }}
                >
                  <MyPopoverNotification />
                </NovuProvider>
              </div>
            )}
            {username && (
              <button className="nav-link-hover bg-transparent">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="gray"
                  className="w-6 h-6 mx-2.5"
                  onClick={toggleChat}
                >
                  {" "}
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </nav>
      {isChatVisible && (
        <div className="fixed right-0 ml-20px bottom-0 z-50 max-w-[500px] min-w-[200px] border-r-[5px] border-r-green-500 border-l-[5px] border-l-green-500 border-t-[5px] border-t-green-500 rounded-tl-md rounded-tr-md ">
          {isChatVisible && username && <Chat className="z-20" />}
        </div>
      )}
    </>
  );
};

export default Header;
