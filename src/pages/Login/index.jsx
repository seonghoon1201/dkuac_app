import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import userInfoStore from "../stores/userInfoStore";
import { basicAxios } from "../api/axios"; // API 요청을 위한 axios
import styles from "../styles"; // 스타일 파일 import
import openEyeIcon from "../images/open_eye.png"; // 비밀번호 보기 아이콘
import closeEyeIcon from "../images/close_eye.png";

const Login = () => {
  const { setUserInfo, isLoggedIn } = userInfoStore();
  const [studentNumber, setStudentNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!studentNumber || !password) {
      alert("학번과 비밀번호를 입력해주세요.");
      return;
    }

    try {
      const { data } = await basicAxios.post("/auth/login", { studentNumber, password });
      const { user, accessToken, expiredTime } = data;

      localStorage.setItem("accessToken", accessToken);
      setUserInfo({ ...user, isLoggedIn: true, expiredTime });
      navigate("/equipment");
    } catch (error) {
      alert(error.response?.data?.message || "로그인 실패");
      setStudentNumber("");
      setPassword("");
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/equipment");
    }
  }, [isLoggedIn, navigate]);

  return (
    <div style={styles.container}>
      <h2>로그인</h2>
      <form style={styles.form} onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="학번을 입력해주세요."
          value={studentNumber}
          onChange={(e) => setStudentNumber(e.target.value)}
          style={styles.inputField}
          required
        />
        <div style={styles.password}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="비밀번호를 입력해주세요."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.inputField}
            required
          />
          <img
            src={showPassword ? closeEyeIcon : openEyeIcon}
            alt={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
            onClick={() => setShowPassword((prev) => !prev)}
            style={styles.eyeIcon}
          />
        </div>
        <button type="submit" style={styles.button}>
          로그인
        </button>
      </form>
    </div>
  );
};

export default Login;
