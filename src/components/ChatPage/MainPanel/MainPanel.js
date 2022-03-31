import { child, onValue, ref } from "firebase/database";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getReatimeDB } from "../../../firebase";
import Message from "./Message";
import MessageForm from "./MessageForm";
import MessageHeader from "./MessageHeader";

export default function MainPanel() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const currentChatroom = useSelector(
    (state) => state.chatroom.currentChatroom
  );
  const currentUser = useSelector((state) => state.user.currentUser);

  const messagesRef = ref(getReatimeDB, "messages/");

  const handleSearchMessages = () => {
    const chatroomMessages = [...messages];
    const regex = new RegExp(searchTerm, "gi");
    const searchResults = chatroomMessages.reduce((acc, message) => {
      if (
        (message.message[1].content &&
          message.message[1].content.match(regex)) ||
        message.message[1].user.displayName.match(regex)
      ) {
        acc.push(message);
      }
      return acc;
    }, []);
    setSearchResult(searchResults);
  };
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setSearchLoading(true);
    handleSearchMessages();
  };

  const addMessageListener = (chatroomId) => {
    let messagesArr = [];
    onValue(child(messagesRef, chatroomId), (snapshot) => {
      messagesArr.push(Object.entries(snapshot.val()));
    });
    setMessages(messagesArr[0]); // depth 하나 벗겨주기
    setLoading(false);
    // console.log(messages, "메세지 정보");
  };

  useEffect(() => {
    // console.log("메인패널 렌더링");
    // console.log(currentChatroom, "채팅방 정보");
    if (currentChatroom) addMessageListener(currentChatroom.id);
  }, []);

  return (
    <div style={{ padding: "2rem 2rem 0 2rem" }}>
      <MessageHeader handleSearchChange={handleSearchChange} />
      {/* 메세지 표현되는 부분 */}
      <div
        style={{
          width: "100%",
          height: "450px",
          border: ".2rem solid #ececec",
          borderRadius: "4px",
          padding: "1rem",
          marginBottom: "1rem",
          overflowY: "scroll",
        }}
      >
        {/* !데이터 렌더링 되는 시간동안 비어있는 문제 해결! */}
        {searchTerm ? (
          searchResult?.length > 0 ? (
            searchResult.map((sear) => (
              <Message
                key={sear[1].timestamp}
                message={sear}
                user={currentUser}
              />
            ))
          ) : (
            <h5>메세지가 없습니다.</h5>
          )
        ) : messages?.length > 0 ? (
          messages.map((msg) => (
            <Message key={msg[1].timestamp} message={msg} user={currentUser} />
          ))
        ) : (
          <h5>메세지가 없습니다.</h5>
        )}
      </div>
      <MessageForm />
    </div>
  );
}
