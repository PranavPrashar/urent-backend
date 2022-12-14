const PORT = process.env.PORT || 5050;
const express = require("express");
const app = express();
const cors = require("cors");
const fs = require("fs");
const knex = require("knex")(require("./knexfile"));
const multer = require("multer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const rn = require("random-number");
const { Knex } = require("knex");
// const bodyParser = require("body-parser");
// app.use(bodyParser.urlencoded({ extended: true }));

let options = {
  min: 1000000,
  max: 10000000,
  integer: true,
};

const cloudinary = require("cloudinary").v2;

app.use(express.json());
app.use(cors());
app.use(express.static("./uploads"));
require("dotenv").config();

//multer

if (!fs.existsSync("./uploads")) {
  fs.mkdirSync("./uploads");
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

cloudinary.config({
  cloud_name: "dhx3qmyuu",
  api_key: "613528734865735",
  api_secret: "dZiWbKb3zIjfmkRPzUEgxd6sF_c",
});

async function uploadtoCloudinary(filePath) {
  const mainFolderName = "main";
  const filePathOnCloudinary = mainFolderName + "/" + filePath;

  return await cloudinary.uploader
    .upload(filePath, {
      public_id: filePathOnCloudinary,
    })
    .then((result) => {
      fs.unlinkSync(filePath);
      return {
        message: "success",
        url: result.url,
      };
    })
    .catch((error) => {
      fs.unlinkSync(filePath);
      return { message: "failed" };
    });
}

function build(urlList) {
  let response = "";
  for (let i = 0; i < urlList.length; i++) {
    response += urlList[i];
  }

  return response;
}

app.get("/", (req, res) => {
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  res.send("/ Endpoint");
});

app.get("/listings", (req, res) => {
  // get all listings
  knex("Listings").then((response) => {
    res.status(200).send(response);
  });
});

app.get("/listings/singleListing/:listingID", (req, res) => {
  knex("Listings")
    .where({ "Listings.listingID": req.params.listingID })
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      console.log(error);
    });
});

app.get("/images/listingImages/:listingID", (req, res) => {
  knex("Images")
    .where("listingImageID", req.params.listingID)
    .then((response) => {
      console.log(response);
      res.status(200).send(response);
    })
    .catch((error) => {
      res.status(400).send("Error has occured", error);
      console.log(error);
    });
});

app.get("/listings/:city", (req, res) => {
  console.log("listing endpoint");
  //select * from Listings join Images where Listings.listingID = Images.listingImageID and Listings.listingCity='toronto';
  //"Listings.listingID"
  knex("Listings")
    .join("Images", function () {
      this.on("Listings.listingID", "=", "Images.listingImageID").andOn(
        "Images.id",
        "=",
        knex.raw(
          "(select min(id) from Images where  Listings.listingID = Images.listingImageID)"
        )
      );
    })
    .andWhere("Listings.listingCity", req.params.city)
    .then((response) => {
      // console.log(response);
      res.status(200).send(response);
    })
    .catch((error) => {
      console.log("Error", error);
    });
});

app.post(
  "/profile-upload-single",
  upload.single("profile-file"),
  async (req, res) => {
    console.log("/profile-upload-single");
    // res.send(" uploadingSingle");
    let localFilePath = req.file.path;
    let result = await uploadtoCloudinary(localFilePath);
    console.log(result);
    let response = build([result.url]);
    console.log(result.url);
    // right now it is hard codded for the listingID, but how do i  dynamic listing id on a post

    knex("Images")
      .insert({ listingImageID: "84700615", listingImagePath: result.url })
      .then(() => {
        res.status(201).send("Registered successfully");
      })
      .catch((err) => {
        res
          .status(400)
          .json({ message: "Failed registration", error: err.sqlMessage });
      });

    // return res.send(result.url);
  }
);

app.post(
  "/profile-upload-multiple",
  upload.array("profile-files", 12),
  async (req, res) => {
    console.log("/profile-upload-multiple");
    let imageURL_LIST = [];
    for (let i = 0; i < req.files.length; i++) {
      let localFilePath = req.files[i].path;
      let result = uploadtoCloudinary(localFilePath); // This is a promise which needs to be resolved

      imageURL_LIST.push(result.url + " ");
    }

    let response = build(imageURL_LIST);
    console.log(response);

    return res.send(response);
  }
);

// app.post(
//   "/createlisting",
//   upload.array("profile-files", 12),
//   async (req, res) => {
//     console.log("/profile-upload-multiple");
//     let imageURL_LIST = [];
//     for (let i = 0; i < req.files.length; i++) {
//       let localFilePath = req.files[i].path;
//       let result = await uploadtoCloudinary(localFilePath); // This is a promise which needs to be resolved

//       imageURL_LIST.push(result.url + " ");
//     }

//     let response = build(imageURL_LIST);
//     console.log(response);
//     // knex("Images").insert();
//     return res.send(response);
//   }
// );

app.post("/postlisting", upload.array("files", 12), async (req, res) => {
  console.log("post listing called");
  console.log("Body", req.body);
  let randomListingId = rn(options);

  const {
    listingPrice,
    listingAddress,
    listingCity,
    listingSize,
    listingBathrooms,
    listingBedrooms,
    listingDescription,
    email,
    phoneNumber,
    userId,
  } = req.body;
  const { files } = req;

  const postingObject = {
    listingId: randomListingId,
    price: listingPrice,
    userId: userId,
    size: listingSize,
    listingAddress: listingAddress,
    listingBedrooms: listingBedrooms,
    listingBathrooms: listingBathrooms,
    listingCity: listingCity,
    listingDescription: listingDescription,
    email: email,
    phonenumber: phoneNumber,
    // files: files,
  };
  knex("Listings")
    .insert(postingObject)
    .then((response) => {
      res.status(200).send(response);
      console.log(postingObject.listingId);
      return postingObject.listingId;
    })
    .then(async (response) => {
      console.log(response);
      let imageURL_LIST = [];
      for (let i = 0; i < files.length; i++) {
        let localFilePath = req.files[i].path;
        let result = await uploadtoCloudinary(localFilePath); // This is a promise which needs to be resolved

        imageURL_LIST.push(result.url + " ");
      }

      let responseBuild = build(imageURL_LIST);
      let values = responseBuild.split(" ");
      console.log(values);

      console.log(responseBuild);
      for (let i = 0; i < values.length - 1; i++) {
        knex("Images")
          .insert({
            listingImageID: response,
            listingImagePath: values[i],
          })
          .then((responseImages) => {
            console.log(responseImages);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    })
    .catch((error) => {
      res.status(401).send(error);
      console.log(error);
    });
});

app.post("/register", (req, res) => {
  console.log("/register called");
  const { name, userName, password } = req.body;
  if (!name || !userName || !password) {
    return res.status(400).send("Please enter required fields");
  }

  const hashedPassword = bcrypt.hashSync(password, 8);
  knex("Users")
    .insert({
      name: name,
      userName: userName,
      password: hashedPassword,
    })
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      res
        .status(400)
        .json({ message: "Failed Registration", error: error.sqlMessage });
    });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body; // this is the result which is being posted
  if (!username || !password) {
    // in the case that either are not given or are null
    return res.status(400).send("Please enter valid fields");
  }

  knex("Users")
    .where({ userName: username })
    .then((user) => {
      if (!user.length) {
        return res.status(400).send("Email and password are not valid");
      }
      const passwordCheck = bcrypt.compareSync(password, user[0].password);
      if (!passwordCheck) {
        return res.status(400).send("Email and password are not valid");
      }

      const token = jwt.sign(
        {
          userId: user[0].userId,
          userName: user[0].userName,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "24h",
        }
      );

      res.status(200).json({ token: token }); // sending the token if all is good
    })
    .catch(() => {
      return res.status(401).send("Email and password are not valid");
    });
});

app.post("/uploadingSingle", (req, res) => {
  res.send("uploadingSingle");
});

app.get("/image", (req, res) => {
  // const id = req.params.listingID;

  knex("Images")
    // .where({ listingID: id })
    .then((image) => {
      console.log(image);
      console.log("called");
      res.status(200).send(image);
    })
    .catch((error) => {
      console.log(error);
    });
});

app.get("/current", (req, res) => {
  if (!req.headers.authorization) {
    return res.status(401).send("Please login");
  }

  const authToken = req.headers.authorization.split(" ")[1];
  jwt.verify(authToken, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      res.status(403).send("Invalid auth token");
    } else {
      knex("Users")
        .where({ userName: payload.userName })
        .then((users) => {
          // console.log("Found user:", users[0]);
          res.status(200).send(users[0]);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  });
});

app.get("/getuser/:userName", (req, res) => {
  // console.log("called getuser");
  console.log(req.params.userName);
});

app.get("/mylistings/:userId", (req, res) => {
  console.log("mylisting endpoint reached");
  // console.log(req.params.userId);
  knex("Listings")
    .join("Images", function () {
      this.on("Listings.listingID", "=", "Images.listingImageID").andOn(
        "Images.id",
        "=",
        knex.raw(
          "(select min(id) from Images where  Listings.listingID = Images.listingImageID)"
        )
      );
    })
    .andWhere("Listings.userId", req.params.userId)
    .then((response) => {
      // console.log(response);
      res.status(200).send(response);
    })
    .catch((error) => {
      console.log("Error", error);
    });
});
app.post("/updateListing/:listingID", (req, res) => {
  console.log("Update endpoint called");
  console.log(req.body);
  console.log(req.params.listingID);

  const {
    // listingData,
    listingPrice,
    listingPhoneNumber,
    listingCity,
    listingSize,
    listingBathrooms,
    listingBedrooms,
    listingDescription,
  } = req.body;
  knex("Listings")
    .where({ "Listings.listingID": req.params.listingID })
    .update({
      price: listingPrice,
      phonenumber: listingPhoneNumber,
      listingCity: listingCity,
      size: listingSize,
      listingBathrooms: listingBathrooms,
      listingBedrooms: listingBedrooms,
      listingDescription: listingDescription,
    })
    .then((response) => {
      console.log(response);
      res.sendStatus(200).send(response);
    })
    .catch((error) => {
      console.log(error);
      res.sendStatus(400).send(error);
    });
});

app.delete("/deletelisting/:listingID", (req, res) => {
  console.log("delete endpoint called");
  console.log(req.params.listingID);
  knex("Images")
    .where({ listingImageID: req.params.listingID })
    .del()
    .then((result) => {
      knex("Listings")
        .where({ "Listings.listingID": req.params.listingID })
        .del()
        .then((response) => {
          console.log("Succsess", response);
        });
      res.send(result);
    })
    .catch((error) => {
      console.log("Error", error);
    });
});

app.post("/favouriteCheck/:listingId", (req, res) => {
  // console.log(req.body);
  const { userId, name, userName, password } = req.body;
  // console.log(userId, name, userName, password);
  knex("Favourites")
    .where({ userID: userId })
    .andWhere({ listingID: req.params.listingId })
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      res.status(400).send(false);
      console.log(error);
    });
});

app.post("/addFavourite", (req, res) => {
  const { userID, listingID } = req.body;
  console.log(userID, listingID);
  knex("Favourites")
    .insert({ userID: userID, listingID: listingID })
    .then(() => {
      res.status(201).send("Registered successfully");
    })
    .catch((error) => {
      res
        .status(400)
        .json({ message: "Something went wrong", error: error.sqlMessage });
    });
});

app.post("/deleteFavourite", (req, res) => {
  console.log("deleteFavourite");
  const { userID, listingID } = req.body;

  knex("Favourites")
    .where({ userID: userID, listingID: listingID })
    .del()
    .then((result) => {
      res.status(201).json({ message: "Successfully Deleted" });
    })
    .catch((error) => {
      console.log("Error", error);
    });
  console.log(req.body);
});
app.listen(PORT, function () {
  console.log(` ???? Server ${PORT} Started`);
});
