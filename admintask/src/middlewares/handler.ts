import * as DAO from "../DAO/index";
import * as Models from "../models";

const handleSuccess = (reply: any, response: any) => {
  reply.send(response);
};

const handleCatch = (reply: any, error: any) => {
  console.log("-------------------error-->", error);

  let { type, status_code, error_message } = error;
  if (type == undefined) {
    type = "Bad Request";
  }
  if (status_code == undefined) {
    status_code = 400;
  }
  if (error_message == undefined) {
    error_message = error;
  }

  reply.status(status_code).send({
    error: type,
    error_description: error_message,
  });
};

// const handleCustomError = async (type: string) => {
//   try {
//     let query = { message_type: type };
//     let projection = { __v: 0 };
//     let options = { lean: true };
//     let fetch_data: any = await DAO.getData(
//       Models.ResMessages,
//       query,
//       projection,
//       options
//     );

//     if (fetch_data.length) {
//       let { message_type, status_code, message } = fetch_data[0];

//       let error_message = message;

//       return {
//         type: message_type,
//         status_code: status_code,
//         error_message: error_message,
//       };
//     } else {
//       throw new Error("Invalid error type");
//     }
//   } catch (err) {
//     throw err;
//   }
// };

export {
  handleCatch,
  handleSuccess,
  //handleCustomError,
  // handleJoiError,
  // handle_failure
};
