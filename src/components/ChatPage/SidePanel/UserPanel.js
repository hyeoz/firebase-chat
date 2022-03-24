import React, { useRef } from "react";
import { Dropdown, Image } from "react-bootstrap";
import { IoIosChatboxes } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { getImgStorage, getReatimeDB, getUser } from "../../../firebase";
import mime from "mime";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { ref as refDb, update } from "firebase/database";
import { updateProfile } from "firebase/auth";
import { setPhotoURL } from "../../../redux/actions/user_action";

export default function UserPanel() {
  // 스토어에 저장해둔 정보 불러오기
  const user = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();

  // console.log(user);
  const handleLogOut = () => {
    // 서버상에서는 로그아웃 되고 로그인 페이지로 넘어가지만 스토어에는 정보가 그대로 남아있음
    getUser.signOut();
  };
  const inputOpenImgRef = useRef();
  const handleOpenImgRef = () => {
    inputOpenImgRef.current.click();
  };
  const handleUploadImg = async (event) => {
    const file = event.target.files[0];
    const metadata = { contentType: mime.getType(file.name) };

    try {
      // 스토리지에 파일 저장
      let uploadTaskSnapshot = await uploadBytes(
        ref(getImgStorage, `user_image/${user.uid}`),
        file,
        metadata
      );
      // console.log(uploadTaskSnapshot);
      let downloadURL = await getDownloadURL(uploadTaskSnapshot.ref);
      // console.log(downloadURL, "download URL");
      // 유저 프로필 이미지 변경
      await updateProfile(getUser.currentUser, {
        photoURL: downloadURL,
      });
      // 스토어 이미지 변경
      dispatch(setPhotoURL(downloadURL));
      // 데이터베이스에 저장
      await update(refDb(getReatimeDB, "users/" + user.uid), {
        image: downloadURL,
      });
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div>
      <h3 style={{ color: "white" }}>
        <IoIosChatboxes /> Chat App
      </h3>
      <div style={{ display: "flex", marginBottom: "1rem" }}>
        <Image
          src={user?.photoURL}
          style={{ width: "30px", height: "30px", marginTop: "3px" }}
          roundedCircle
        />
        <input
          type="file"
          accept="image/jpeg, image/png"
          style={{ display: "none" }}
          ref={inputOpenImgRef}
          onChange={handleUploadImg}
        />
        <Dropdown>
          <Dropdown.Toggle
            style={{ background: "transparent", border: "0px" }}
            id="dropdown-basic"
          >
            {user?.displayName}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={handleOpenImgRef}>
              프로필 사진 변경
            </Dropdown.Item>
            <Dropdown.Item onClick={handleLogOut}>로그아웃</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
}
