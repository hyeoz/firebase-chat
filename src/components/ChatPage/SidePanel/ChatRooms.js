import { child, onValue, push, ref, update } from "firebase/database";
import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { FaPlus, FaRegSmileWink } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { getReatimeDB } from "../../../firebase";
import { setCurrentChatRoom } from "../../../redux/actions/chatroom_action";

export default function ChatRooms() {
  const [show, setShow] = useState(false);
  const [chatroomName, setChatroomName] = useState("");
  const [description, setDescription] = useState("");
  const [chatroomsDetail, setChatroomsDetail] = useState([]);
  const [isItFirst, setIsItFirst] = useState(true);
  const [activeChatroomId, setActiveChatroomId] = useState("");

  // auto generated key
  const chatroomsRefKey = push(
    child(ref(getReatimeDB, "chatrooms/"), "chatroom")
  ).key;

  const user = useSelector((state) => state.user.currentUser);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid(chatroomName, description)) {
      addChatroom();
    }
    setShow(false);
  };
  // 유효성 확인 간단하게
  const isFormValid = (name, description) => {
    return name && description;
  };
  const addChatroom = async () => {
    // user 정보와 채팅방 정보를 함께 파이어베이스에 넘겨줌
    const newChatroom = {
      id: chatroomsRefKey,
      name: chatroomName,
      description,
      createdBy: {
        name: user.displayName,
        image: user.photoURL,
      },
    };
    // console.log("들어오나요?");
    try {
      await update(
        child(ref(getReatimeDB, "chatrooms/"), chatroomsRefKey),
        newChatroom
      );
      // console.log("여기까지 들어오나요?");
    } catch (error) {
      alert(error);
    }
  };
  // console.log(chatroomsDetail, "test");
  const dispatch = useDispatch();
  const chatroomStore = (room) => {
    dispatch(setCurrentChatRoom(room));
  };

  const setFirstChatroom = () => {
    // console.log(chatroomsDetail[0][1]);
    // undefined '1' 에러 뜨는데 실행은 됨. 에러 안뜨게 하는 방법 찾기!!
    chatroomStore(chatroomsDetail[0][1]);
    setActiveChatroomId(chatroomsDetail[0][1].id);
    setIsItFirst(false);
  };

  useEffect(() => {
    // onValue 로 한 번 데이터 불러오기가 트리거 된 후 자식노드가 업데이트 될 때마다 리렌더링 됨
    onValue(ref(getReatimeDB, "chatrooms/"), async (snapshot) => {
      const rooms = snapshot.val();
      // 객채로 반환하여 배열로 바꾸기, 첫번째 선택된 chatroom store 가 가장 최근 채팅룸이 되도록 하게
      setChatroomsDetail(Object.entries(rooms));
      // console.log(chatroomsDetail);
      if (isItFirst) setFirstChatroom();
    });
  }, []);

  return (
    <div>
      <div
        style={{
          position: "relative",
          width: "100%",
          display: "flex",
          alignItems: "center",
        }}
      >
        <FaRegSmileWink style={{ marginRight: 3 }} /> Chat Rooms (
        {chatroomsDetail.length})
        <FaPlus
          style={{ position: "absolute", right: 0, cursor: "pointer" }}
          onClick={handleShow}
        />
      </div>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {chatroomsDetail
          ? chatroomsDetail.map((room) => {
              // console.log(room);
              return (
                <li
                  style={{
                    backgroundColor:
                      room[1].id === activeChatroomId && "#ffffff45",
                  }}
                  key={room[1].id}
                  onClick={() => {
                    // console.log(room[1], "채팅방 클릭");
                    chatroomStore(room[1]);
                    setActiveChatroomId(room[1].id);
                  }}
                >
                  #{room[1].name}
                </li>
              );
            })
          : null}
      </ul>

      {/* chat room 모달 */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create Chat Room</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>방 이름</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter a Room name"
                onChange={(e) => setChatroomName(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>방 설명</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter a Room description"
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Create
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
