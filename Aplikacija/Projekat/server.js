const express = require("express");
const { logger } = require("./middleware/logEvents");
const app = express();
const PORT = process.env.PORT || 3500;
const mongoose = require("mongoose");
const connectDB = require("./config/dbConn");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const User = require("./models/User");
const Stanar = require("./models/Stanar");
const Stanodavac = require("./models/Stanodavac");
const Majstor = require("./models/Majstor");
const Oglas = require("./models/Oglas");
const OglasStan = require("./models/OglasStan");
const OglasMajstor = require("./models/OglasMajstor");
const path = require("path");
const majstorController = require("./controllers/majstorController");
const ocenaController = require("./controllers/ocenaController");
const stanarController = require("./controllers/stanarController");
const stanodavacController = require("./controllers/stanodavacController");
const oglasStanController = require("./controllers/oglasStanController");
const profileController = require("./controllers/profileController");
const logoutController = require("./controllers/logoutController");
const oglasMajstorController = require("./controllers/oglasMajstorController");
const publicProfileController = require("./controllers/publicProfileController");
const imageDownloader = require("image-downloader");
const multer = require("multer");
const fs = require("fs");
const kalendarController = require("./controllers/kalendarController");
const chatController = require("./controllers/chatController.js");
const porukaController = require("./controllers/PorukaController");
const userController = require("./controllers/userController");
const corsProxy = require("cors-anywhere");
const prijateljstvoController = require("./controllers/prijateljstvoController");
const { Novu } = require("@novu/node");
const novu = new Novu("d8ba5ecb6214ec1f4a89321d33708df2");
const fetch = require("node-fetch");
const majstorRute = require("./routes/majstorRoutes");
const authverifyJWT = require("./middleware/verifyJWT");
const stanodavacRute = require("./routes/stanodavacRoutes");
const majstorOglasRute = require("./routes/majstorOglasRoutes");
const stanOglasRute = require("./routes/stanOglasRoutes");
const stanarRute = require("./routes/stanarRoutes");
const ocenaRute = require("./routes/ocenaRoutes");
const logovan = require("./middleware/verifyJWT");

connectDB();
const socketIO = require("socket.io")(4000, {
  cors: {
    origin: "http://localhost:5173",
  },
});

socketIO.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);
  socket.on("friend-request", (data) => {
    socket.emit("friend-request", data);
    console.log(data);
    //Pozovi metodu za kreiranje prijateljstva
    //prijateljstvoController.posaljiZahtev({salje:data.idStanara,prima:data.idStanodavca});
  });

  socket.on("prihvati", (data) => {
    console.log(data);
  });

  socket.on("odbij", (data) => {
    console.log(data);
  });

  socket.on("prijavi-problem", (data) => {
    socket.emit("prijavi-problem", data);
    console.log(data);
  });

  socket.on("disconnect", () => {
    socket.disconnect();
  });
});

const io = require("socket.io")(3000, {
  cors: {
    origin: "http://localhost:5173",
  },
});
let activeUsers = [];

io.on("connection", (socket) => {
  socket.on("new-user-add", (newUserId) => {
    if (!activeUsers.some((user) => user.userId === newUserId)) {
      activeUsers.push({
        userId: newUserId,
        socketId: socket.id,
      });
    }
    console.log("Connected Users", activeUsers);
    io.emit("get-users", activeUsers);
  });

  // Slanje poruka
  socket.on("send-message", (data) => {
    const { receiverId } = data;
    console.log(activeUsers);
    const user = activeUsers.find((user) => user.userId === receiverId);
    console.log("Sending from socket to:", receiverId);
    if (user) {
      io.to(user.socketId).emit("receive-message", data);
    }
  });
  socket.on("digest-workflow-example", (data) => {
    console.log(data);
  });
  socket.on("disconnect", () => {
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
    //console.log("User Disconnected", activeUsers);
    io.emit("get-users", activeUsers);
  });
});

app.use(express.urlencoded({ extended: true }));
app.use(logger);
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);
const proxyServer = corsProxy.createServer({
  originWhitelist: [], // Allow all origins
  requireHeader: ["origin", "x-requested-with"],
  removeHeaders: ["cookie", "cookie2"],
});

proxyServer.listen(8080, "localhost", () => {
  console.log("CORS Anywhere proxy server started!");
});

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
//get za indeks zbog provere
app.get("^/$|/index(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});
app.post("/notify", async (req, res) => {
  const { usernameStanara, usernameStanodavca } = req.body;
  console.log(usernameStanara);
  await novu
    .trigger("friend-request", {
      to: {
        subscriberId: `${usernameStanodavca}`,
      },
      payload: {
        usernameStanara,
        usernameStanodavca,
      },
    })
    .catch((err) => console.error(err));
});

app.post("/prijaviProblem", async (req, res) => {
  const { usernameStanara, usernameStanodavca, opisProblema } = req.body;
  await novu
    .trigger("problemi", {
      to: {
        subscriberId: `${usernameStanodavca}`,
      },
      payload: {
        usernameStanara,
        usernameStanodavca,
        opisProblema,
      },
    })
    .catch((err) => console.error(err));
});

app.post("/prihvati", async (req, res) => {
  const { usernameStanodavca, usernameStanara } = req.body;

  await novu
    .trigger("prihvati", {
      to: {
        subscriberId: `${usernameStanara}`,
      },
      payload: {
        usernameStanodavca,
      },
    })
    .catch((err) => console.error(err));
});

app.post("/odbij", async (req, res) => {
  const { usernameStanodavca, usernameStanara } = req.body;
  await novu
    .trigger("odbij", {
      to: {
        subscriberId: `${usernameStanara}`,
      },
      payload: {
        usernameStanodavca,
      },
    })
    .catch((err) => console.error(err));
});
//Register i login rute
app.use("/registerStanar", require("./routes/registerStanar"));
app.use("/registerStanodavac", require("./routes/registerStanodavac"));
app.use("/registerMajstor", require("./routes/registerMajstor"));
app.use("/login", require("./routes/login"));
app.use("/profile/:username", publicProfileController.vratiUsera);
app.use("/profile", profileController.handleUserInfo);
app.use("/logout", logoutController.handleLogout);

//PERO RESI OVOJ
app.use("/createChat", chatController.createChat);
app.use("/createChat1", chatController.createChat1);
app.use("/userChats", chatController.userChats);
app.use("/findChat", chatController.findChat);

app.use("/dodajPoruku", porukaController.dodajPoruku);
app.use("/preuzmiPoruke", porukaController.preuzmiPoruke);
app.use("/izbrisiPoruke", porukaController.izbrisiPoruke);

app.use("/getUser", userController.getUser);
//DO OVDE

//Ostale rute
app.use("/ocena", ocenaRute);
app.use("/stanar", stanarRute);
app.use("/majstor", majstorRute);
app.use("/stanodavac", stanodavacRute);
app.use("/majstorOglas", majstorOglasRute);
app.use("/stanOglas", stanOglasRute);

app.post("/dodaj-sliku-link", async (req, res) => {
  const { link } = req.body;
  const newName = Date.now() + ".jpg";
  try{
  await imageDownloader.image({
    url: link,
    dest: path.join(__dirname, "uploads", newName),
  });
}
catch(err){
  console.log(err);
}
  res.json(`${newName}`);
});

const photosMiddleware = multer({ dest: "uploads/" });
app.post("/dodaj", photosMiddleware.array("photos", 100), (req, res) => {
  const uploadedFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    const response = req.files[i];
    const parts = response.originalname.split(".");
    const ext = parts[parts.length - 1];
    const newPath = `${response.path}` + `.${ext}`;
    fs.renameSync(response.path, newPath);
    replejs = newPath.replace("\\uploads", "");
    uploadedFiles.push(replejs);
  }
  res.json(uploadedFiles);
});

const photosMiddlewareee = multer({ dest: "uploads/" });
app.post(
  "/dodajmajstor",
  photosMiddlewareee.array("photos", 100),
  (req, res) => {
    const uploadedFiles = [];
    for (let i = 0; i < req.files.length; i++) {
      const response = req.files[i];
      const parts = response.originalname.split(".");
      const ext = parts[parts.length - 1];
      const newPath = `${response.path}` + `.${ext}`;
      fs.renameSync(response.path, newPath);
      replejs = newPath.replace("uploads\\", "");
      uploadedFiles.push(replejs);
    }
    res.json(uploadedFiles);
  }
);

const photosMiddlewaree = multer({ dest: "uploads/" });
app.post(
  "/azurirajslicku",
  photosMiddlewaree.array("photos", 100),
  (req, res) => {
    const uploadedFiles = [];
    for (let i = 0; i < req.files.length; i++) {
      const response = req.files[i];
      const parts = response.originalname.split(".");
      const ext = parts[parts.length - 1];
      const newPath = `${response.path}` + `.${ext}`;
      fs.renameSync(response.path, newPath);
      replejs = newPath.replace("uploads", "");
      uploadedFiles.push(replejs);
    }
    res.json(uploadedFiles);
  }
);

const deleteFileInFolder = (req,res) => {
  fs.readdir(path.join(__dirname, "uploads"), (err, files) => {
    if (err) {
      console.error('Greška pri čitanju sadržaja foldera:', err);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(path.join(__dirname, "uploads"), file);
      if (file === req.body.link) {
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error('Greška pri brisanju fajla:', err);
          } else {
            console.log('Fajl uspešno izbrisan:', filePath);
          }
        });
      }
    });
  });
};
app.use("/deleteFileInFolder",deleteFileInFolder);

app.use("/posaljiZahtev", prijateljstvoController.posaljiZahtev);
app.use("/primiZahtev", prijateljstvoController.primiZahtev);
app.use("/odbijZahtev", prijateljstvoController.odbijZahtev);
app.use("/ukloniPrijatelja", prijateljstvoController.ukloniPrijatelja);
app.use("/vratiZahteve", prijateljstvoController.vratiZahteve);

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
