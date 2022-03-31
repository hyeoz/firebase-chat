import moment from "moment";
import React from "react";
import { Card } from "react-bootstrap";

export default function Message(message, user) {
  const isMine = (message, user) => {
    if (message.user.id === user.uid) return "#ececec";
  };
  // 현재로부터의 시간 계산
  const timeFromNow = (timestamp) => {
    return moment(timestamp).fromNow();
  };
  const isImage = (msg) => {
    // image 라는 데이터를 가지고 있는지 && content 가지고있지 않은지
    // console.log(msg.message[1]);
    return (
      msg.message[1].hasOwnProperty("image") &&
      !msg.message[1].hasOwnProperty("content")
    );
  };
  // console.log(message);

  return (
    <Card
      style={{
        display: "flex",
        flexDirection: "row",
        marginBottom: "5px",
        overflow: "auto",
      }}
    >
      <img
        width={64}
        height={64}
        className="mr-3"
        src={message.user.photoURL}
        alt={message.user.id}
        style={{ borderRadius: "10px", marginRight: "10px" }}
      />
      <Card.Body
        style={{
          display: "flex",
          padding: 0,
          flexDirection: "column",
          backgroundColor: isMine(message, user),
        }}
      >
        <h6>
          {message.user.displayName}
          <span style={{ fontSize: "10px", color: "grey" }}>
            {timeFromNow(message.message[1].timestamp)}
          </span>
        </h6>
        {isImage(message) ? (
          <img
            src={message.message[1].image}
            alt="image_"
            style={{ maxWidth: "300px" }}
          />
        ) : (
          <p>{message.message[1].content}</p>
        )}
      </Card.Body>
    </Card>
  );
}
