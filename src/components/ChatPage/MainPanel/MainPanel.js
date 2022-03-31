import { async } from "@firebase/util";
import { child, onValue, ref } from "firebase/database";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getReatimeDB } from "../../../firebase";
import Message from "./Message";
import MessageForm from "./MessageForm";
import MessageHeader from "./MessageHeader";

export default function MainPanel() {
  const [messages, setMessages] = useState([]);
  const [messageLoading, setMessageLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const currentChatroom = useSelector(
    (state) => state.chatroom.currentChatroom
  );
  const currentUser = useSelector((state) => state.user.currentUser);

  const messagesRef = ref(getReatimeDB, "messages/");

  const addMessageListener = (chatroomId) => {
    let messagesArr = [];
    onValue(child(messagesRef, chatroomId), (snapshot) => {
      if (snapshot.val() !== null && snapshot.val())
        messagesArr.push(Object.entries(snapshot.val()));
    });
    console.log(messagesArr[0], "메세지 정보");

    setMessages(messagesArr[0]); // depth 하나 벗겨주기
    setMessageLoading(false);
  };

  useEffect(() => {
    console.log(currentChatroom, "채팅방 정보");
    if (currentChatroom) addMessageListener(currentChatroom.id);
  }, []);

  const handleSearchMessages = () => {
    const chatroomMessages = [...messages];
    // !! 여기서도 setState 바로 적용 안됨!!
    // 한 박자 뒤에 실행되는 문제 해결.....
    const regex = new RegExp(searchTerm, "gi");
    const searchResults = chatroomMessages.reduce((acc, message) => {
      // console.log(acc, message[1].content, "reduce");
      if (
        (message[1].content && message[1].content.match(regex)) ||
        message[1].user.name.match(regex)
      ) {
        acc.push(message);
      }
      return acc;
    }, []);
    // console.log(searchResults, "search result");
    setSearchResult(searchResults);
  };
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setSearchLoading(true);
    handleSearchMessages();
  };
  // console.log(searchTerm, "search term");

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
        {!!searchTerm
          ? searchResult?.map((res) => (
              // console.log(res, "search result");
              <Message
                key={res[1].timestamp}
                message={res}
                user={currentUser}
              />
            ))
          : messages?.map((msg) => (
              // console.log(msg, "messages");
              <Message
                key={msg[1].timestamp}
                message={msg}
                user={currentUser}
              />
            ))}
      </div>
      <MessageForm />
    </div>
  );
}
