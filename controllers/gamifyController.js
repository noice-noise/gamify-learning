const path = require("path");
const mammoth = require("mammoth");
const fs = require("fs");

const gamify_index = (req, res) => {
  res.render("gamify/index", { title: "Gamify", blogs: result });
};

const gamify_file_post = (req, res) => {
  if (!req.files) {
    return res.status(400).send("No files were uploaded.");
  }

  const file = req.files.file;
  console.log("Requesting...");
  const extensionName = path.extname(file.name);
  const allowedExtension = [".docx"];
  const targetPath = path.join(__dirname, "..", "files/gamify", file.name);
  console.log("target path: " + targetPath);

  if (!allowedExtension.includes(extensionName)) {
    // return res.status(422).send("Invalid file.");
    return res.status(422).send({
      status: "failed",
      message: "Invalid file.",
    });
  }

  file.mv(targetPath, (err) => {
    if (err) {
      return res.status(500).send(err);
    }

    return res.send({
      status: "success",
      message: "File was uploaded successfully.",
      file: file,
      path: targetPath,
    });
  });
};

const gamify_create_get = (req, res) => {
  res.render("gamify/create", { title: "Gamify" });
};

const options = {
  // reserve  H1 for specific page titles for semantic meaning
  styleMap: ["p[style-name='Heading 1'] => h2:fresh"],
  styleMap: ["p[style-name='Heading 2'] => h3:fresh"],
  styleMap: ["p[style-name='Heading 3'] => h4:fresh"],
  styleMap: ["p[style-name='Heading 4'] => h5:fresh"],
  styleMap: ["p[style-name='Heading 5'] => h6:fresh"],
  styleMap: ["p[style-name='Heading 6'] => p:fresh"],
};

const uploadFolder = path.join(__dirname, "..", "files/gamify");
const uploadFolderContents = fs.readdirSync(uploadFolder);

const gamify_get_html = async (req, res) => {
  await parseAllHtml();
  await res.send(JSON.stringify(htmlContents));
};

var htmlContents = "";

const parseHtml = (docx) => {
  return mammoth
    .convertToHtml({ path: `${uploadFolder}/${docx}` }, options)
    .then(function (result) {
      var html = result.value;
      var messages = result.messages;
      htmlContents += html;
      // console.log(html);
      // console.log(messages);
      // return html;
    });
};

const parseAllHtml = async () => {
  for (const file of uploadFolderContents) {
    var fileInfo = await parseHtml(file);
  }

  console.log("All files have been parsed...");
  // return fileInfo;
};

module.exports = {
  gamify_index,
  gamify_create_get,
  gamify_file_post,
  gamify_get_html,
};
