import React from "react";
import ReactDOM from "react-dom";
import { Route, Routes } from "react-router-dom";
import IndexPage from "./pages/IndexPage";
import LoginPage from "./pages/LoginPage";
import Layout from "./Layout";
import RegisterPage from "./pages/RegisterPage";
import AccountPage from "./pages/AccountPage";
import OglasPage from "./pages/OglasPage";
import Chat from "./pages/Chat/Chat";
import SviOglasiPage from "./pages/SviOglasiPage";
import axios from "axios";
import OnamaPage from "./pages/OnamaPage";
import { UserContextProvider } from "./UserContext";
import NotFoundPage from "./pages/NotFoundPage";
import ProfilePage from "./pages/ProfilePage";
import MajstorOglasi from "./pages/MajstorOglasi";
import SingleOglasMajstor from "./pages/SingleOglasMajstor";

axios.defaults.baseURL = "http://localhost:3500";
axios.defaults.withCredentials = true;
import socketIO from "socket.io-client";
const socket = socketIO.connect("http://localhost:4000");

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route index element={<IndexPage socket={socket} />} />
        <Route path="/" element={<Layout socket={socket} />}>
          <Route path="/SviOglasi" element={<SviOglasiPage />}></Route>
          <Route path="/MajstorOglasi" element={<MajstorOglasi />}></Route>
          <Route path="/Onama" element={<OnamaPage />}></Route>
          <Route path="/login" element={<LoginPage />}></Route>
          <Route path="/register" element={<RegisterPage />}></Route>
          <Route
            path="/account/:subpage?"
            element={<AccountPage socket={socket} />}
          ></Route>
          <Route
            path="/account/:subpage/:action"
            element={<AccountPage />}
          ></Route>
          <Route path="/chat" element={<Chat />}></Route>
          <Route path="/profile/:username" element={<ProfilePage />}></Route>
          <Route path="/oglas/:id" element={<OglasPage socket={socket} />} />
          <Route path="/oglasMajstor/:id" element={<SingleOglasMajstor/>} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </UserContextProvider>
  );
}

export default App;
