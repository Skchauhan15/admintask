var FCM = require("fcm-push");
const { handleCatch, handleSuccess } = require("./handler");

var serverKey =
  "AAAAfRF9oec:APA91bHVt3sYU5QFpYg3mcHHSqQ_yY4v3TBnJ-Dza9dyo7_a1LBTaBQ4BYQSEm4OiMk_Oubiqy_GE3os5dFCQhm4LvfKv6y5VD3zOyWMnftjb4vLQn006KKBOtPvXZF743a9mIsWvk5Y";
var fcm = new FCM(serverKey);
const send_notification = async (data:any, fcm_token:any) => {
  var message = {
    to: fcm_token, // "registration_token_or_topics_name_with_prefix", // required fill with device token or `/topics/${topicName}` fcm_token
    // collapse_key: "your_collapse_key",
    data: data, // {
    //   your_custom_data_key: "your_custom_data_value",
    // },
    notification: {
      type: data.type,
      title: data.title, //"Title of your push notification",
      body: data.message, //"Body of your push notification",
      notif_type: data.notif_type,
      sound: "default",
      badge: 0,
      priority: "high",
      content_available: true,
      foreground: true,
      show_in_foreground: true,
    },
  };

  //callback style
  fcm.send(message, function (err:any , response: any ) {
    if (err) {
      console.log(handleCatch);
    } else {
      console.log(handleSuccess);
    }
  });

  //promise style
  // fcm
  //   .send(message)
  //   .then(function (response) {
  //     console.log("Successfully sent with response: ", response);
  //   })
  //   .catch(function (err) {
  //     console.log("Something has gone wrong!");
  //     console.error(err);
  // });
};
export default send_notification;
