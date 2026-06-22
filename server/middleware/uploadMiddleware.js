"use strict";
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const resumeStorage = new CloudinaryStorage({
  cloudinary,
  params: { folder: "interviewiq/resumes", resource_type: "raw", allowed_formats: ["pdf","doc","docx"] },
});

const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "interviewiq/avatars", resource_type: "image",
    allowed_formats: ["jpg","jpeg","png","webp"],
    transformation: [{ width: 400, height: 400, crop: "fill", gravity: "face" }],
  },
});

const resumeFilter = (req, file, cb) => {
  const ok = ["application/pdf","application/msword","application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
  ok.includes(file.mimetype) ? cb(null, true) : cb(new Error("Only PDF/DOCX allowed."), false);
};

const imageFilter = (req, file, cb) => {
  file.mimetype.startsWith("image/") ? cb(null, true) : cb(new Error("Images only."), false);
};

const uploadResume = multer({ storage: resumeStorage, fileFilter: resumeFilter, limits: { fileSize: 5 * 1024 * 1024 } });
const uploadAvatar = multer({ storage: avatarStorage, fileFilter: imageFilter, limits: { fileSize: 2 * 1024 * 1024 } });

module.exports = { uploadResume, uploadAvatar };
