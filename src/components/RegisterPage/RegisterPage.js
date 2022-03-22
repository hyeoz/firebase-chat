import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, set } from "firebase/database";
import md5 from "md5";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { getReatimeDB, getUser } from "../../firebase";

export default function RegisterPage() {
  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
  } = useForm();
  // useState 사용하는 방법과 같은 원리이지만 react-hook-form 라이브러리 사용하는 경우 ref 를 쓰는게 좋다네용
  const password = useRef();
  password.current = watch("password");

  const [submitError, setSubmitError] = useState();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    // console.log(data); // react-hook-form 에서 만들어지는 data 라는 변수
    try {
      setLoading(true);
      let createdUser = await createUserWithEmailAndPassword(
        getUser,
        data.email,
        data.password
      );
      await updateProfile(createdUser.user, {
        displayName: data.name,
        photoURL: `http://gravatar.com/avatar/${md5(createdUser.user.email)}`, // 해시 암호화 모듈 사용하여 랜덤 아바타 이미지 추가
      });
      setLoading(false);
      // console.log(createdUser);

      await set(ref(getReatimeDB, "users/" + createdUser.user.uid), {
        name: createdUser.user.displayName,
        image: createdUser.user.photoURL,
      });
    } catch (error) {
      setSubmitError(error.message);
      setLoading(false);
      // !에러 계속 떠있는 부분 강제로 없애기!
      setTimeout(() => {
        setSubmitError("");
      }, 10000);
      // console.error(error.message);
    }
  };

  return (
    <div className="auth-wrapper">
      <div style={{ textAlign: "center" }}>
        <h3>Register</h3>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>EMAIL</label>
        <input
          name="email"
          type="email"
          {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
        />
        {errors.email && <p>This Email feild is required</p>}
        {/* {errors.email && <p>{errors.name}</p>} */}
        <label>NAME</label>
        <input
          name="name"
          {...register("name", { required: true, maxLength: 10 })}
        />
        {errors.name && errors.name.type === "required" && (
          <p>This Name feild is required</p>
        )}
        {errors.name && errors.name.type === "maxLength" && (
          <p>Your Name exceed maximum length</p>
        )}
        <label>PASSWORD</label>
        <input
          name="password"
          type="password"
          {...register("password", { required: true, minLength: 6 })}
        />
        {errors.password && errors.password.type === "required" && (
          <p>This Password feild is required</p>
        )}
        {errors.password && errors.password.type === "minLength" && (
          <p>Your Password must have at lease 6 characters</p>
        )}
        <label>PASSWORD CONFIRM</label>
        <input
          name="password_type"
          type="password"
          {...register("password_type", {
            required: true,
            validate: (value) => value === password.current, // password 값과 confirm 값이 같은지 확인
          })}
        />
        {errors.password && errors.password.type === "required" && (
          <p>This Password feild is required</p>
        )}
        {errors.password && errors.password.type === "validate" && (
          <p>This Password do not match</p>
        )}

        {submitError && <p style={{ color: "black" }}>{submitError}</p>}
        <input type="submit" disabled={loading} />
      </form>
      <Link
        style={{ color: "gray", textDecoration: "none", margin: "0 auto" }}
        to="/login"
      >
        이미 아이디가 있다면...
      </Link>
    </div>
  );
}
