import { child, push, ref, serverTimestamp, set } from "firebase/database";
import {
  getDownloadURL,
  ref as refSt,
  uploadBytesResumable,
} from "firebase/storage";
import React, { useRef, useState } from "react";
import { Col, Form, ProgressBar, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { getImgStorage, getReatimeDB } from "../../../firebase";
import mime from "mime";

export default function MessageForm() {
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [percent, setPercent] = useState(0);
  const imageRef = useRef();

  // 스토어에서 챗룸 아이디 가져오기
  const currentChatroom = useSelector(
    (state) => state.chatroom.currentChatroom
  );
  const currentUser = useSelector((state) => state.user.currentUser);

  const messagesRef = ref(getReatimeDB, "messages/");
  // const storageRef = refSt(getImgStorage, "message_image");

  // 채팅 메세지에 파일을 첨부했다면 fileURL 로 받고 없다면 널값으로
  const createMessage = (fileURL = null) => {
    const message = {
      timestamp: serverTimestamp(),
      user: {
        id: currentUser.uid,
        name: currentUser.displayName,
        image: currentUser.photoURL,
      },
    };
    // 이미지 첨부한 경우 이미지를 담고 이미지가 없다면 텍스트만 content 에 담아서 넘겨줌
    if (fileURL !== null) {
      message["image"] = fileURL;
    } else {
      message["content"] = content;
    }
    return message;
  };

  const handleSubmit = async () => {
    if (!content) {
      setErrors((prev) => prev.concat("Type contents first!"));
      return;
    }
    setLoading(true);
    // 메시지 저장 작업 시작
    try {
      await set(push(child(messagesRef, currentChatroom.id)), createMessage());
      // await set(pushRef);
      setLoading(false);
      setContent("");
    } catch (error) {
      console.log(error);
      setErrors((prev) => prev.concat(error.message));
      setLoading(false);
      setTimeout(() => {
        setErrors([]);
      }, 5000);
    }
  };
  const handleChange = (e) => {
    setContent(e.target.value);
  };
  // input 태그 숨기고 버튼으로 사용
  const handleImageRef = () => {
    imageRef.current.click();
  };
  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    // 이미지 파일 저장
    const filePath = `/message_image/public/${file.name}`;
    const metadata = { contentType: mime.getType(file.name) };

    try {
      // 스토리지에 파일 저장
      // 스토리지는 child 없이 path 로 자식요소를 구성할 수 있음
      const uploadTask = uploadBytesResumable(
        refSt(getImgStorage, filePath),
        file,
        metadata
      );
      // on 리스너 등록. 리스너 사용할 경우 await 사용할 수 없음
      uploadTask.on(
        "state_changed",
        (snap) => {
          const percentage =
            Math.round(snap.bytesTransferred / snap.totalBytes) * 100;
          setPercent(percentage);
          // console.log(percent);
        },
        (err) => {
          console.log(err);
          setLoading(false);
        },
        async () => {
          // 이미지가 스토리지에 저장된 후 실시간 데이터베이스 메세지에도 저장해주기
          const downURL = await getDownloadURL(uploadTask.snapshot.ref);
          // console.log(downURL, "download url");
          set(
            push(child(messagesRef, currentChatroom.id)),
            createMessage(downURL)
          );
          setLoading(false);
        }
      );
    } catch (error) {
      alert(error);
      console.log(error);
    }
  };

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <Form.Group
          controlId="exampleForm.ControlTextarea1"
          style={{ marginBottom: "1rem" }}
        >
          <Form.Control
            value={content}
            as="textarea"
            rows={3}
            onChange={handleChange}
          />
        </Form.Group>
      </Form>
      {!(percent === 0 || percent === 100) && (
        <ProgressBar now={percent} variant="warning" label={`${percent}%`} />
      )}
      <div>
        {errors.map((msg) => (
          <p style={{ color: "red" }} key={msg}>
            {msg}
          </p>
        ))}
      </div>
      <Row>
        <Col>
          <button
            className="message-form-button"
            style={{ width: "100%" }}
            onClick={handleSubmit}
            disabled={loading ? true : false}
          >
            SEND
          </button>
        </Col>
        <Col>
          <button
            className="message-form-button"
            style={{ width: "100%" }}
            onClick={handleImageRef}
            disabled={loading ? true : false}
          >
            UPLOAD
          </button>
        </Col>
      </Row>
      <input
        type="file"
        accept="image/jpeg image/png"
        style={{ display: "none" }}
        ref={imageRef}
        onChange={handleUploadImage}
      />
    </div>
  );
}
