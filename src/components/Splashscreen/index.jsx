import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import dkuacImage from "../../images/dkuac.png"; // 이미지 파일 경로

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 3000); // 3초 후 로그인 페이지로 이동

    return () => clearTimeout(timer); // 타이머 정리
  }, [navigate]);

  return (
    <div style={styles.splashContainer}>
      <img src={dkuacImage} alt="DKUAC Logo" style={styles.splashImage} />
    </div>
  );
};

const styles = {
  splashContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#3a5ba0", // 배경색
  },
  splashImage: {
    width: "200px",
    height: "200px",
  },
};

export default SplashScreen;
