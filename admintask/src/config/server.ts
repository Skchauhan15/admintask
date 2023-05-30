
import cors from "cors";
import express from 'express';
import { config } from "dotenv";
config();
import fileUpload from 'express-fileupload'
import connect_to_db from './connect_db';
import http from 'http'
 import swagger_ui from 'swagger-ui-express'
 import openapi_docs from "../../output.swagger.json"
 import adminRouter from "../modules/admin/admin.routes"
import uploadRouter from "../modules/uploads/upload.routes"

const app = express ();
let port = process.env.LOCAL_PORT;

connect_to_db()

let swagger_options = { customSiteTitle: "Admin Task Api Documentation" };
app.use(
  "/docs",
  swagger_ui.serve,
  swagger_ui.setup(openapi_docs, swagger_options)
);
app.use(fileUpload())
app.use(express.json());
app.use(express.urlencoded({ extended: false}))
app.use(cors({ origin: "*" }));

app.use('/admin',adminRouter)
app.use("/upload",uploadRouter)
let server: any;
server = http.createServer(app);
server.listen(port, ()=> {
    console.log(`server runnning at port at ${port}`)
})

