import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { getUser } from "../../firebase";

export default function LoginPage() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const [submitError, setSubmitError] = useState();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    // console.log(data); // react-hook-form 에서 만들어지는 data 라는 변수
    try {
      setLoading(true);
      await signInWithEmailAndPassword(getUser, data.email, data.password);
    } catch (error) {
      setSubmitError(error.message);
      setLoading(false);
      setTimeout(() => {
        setSubmitError("");
      }, 10000);
    }
  };

  return (
    <div className="auth-wrapper">
      <div style={{ textAlign: "center" }}>
        <h3>LOGIN</h3>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>EMAIL</label>
        <input
          name="email"
          type="email"
          {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
        />
        {errors.email && <p>This Email feild is required</p>}
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

        {submitError && <p style={{ color: "black" }}>{submitError}</p>}
        <input type="submit" disabled={loading} />
      </form>
      <Link
        style={{ color: "gray", textDecoration: "none", margin: "0 auto" }}
        to="/register"
      >
        아직 아이디가 없다면...
      </Link>
    </div>
  );
}
