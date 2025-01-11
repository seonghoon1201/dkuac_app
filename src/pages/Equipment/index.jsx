import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { basicAxios, authAxios } from "../../api/axios";
import styles from "./styles";

const Equipment = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [sizes, setSizes] = useState([]);
  const [showRentPopup, setShowRentPopup] = useState(false);
  const [showReturnPopup, setShowReturnPopup] = useState(false);
  const [myRentSize, setMyRentSize] = useState(null);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response = await basicAxios.get(`/rent`);
      setSizes(response.data); // Fetch sizes from backend
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePopupOpen = async (type) => {
    setShowPopup(true);
    if (type === "rent") {
      setShowRentPopup(true);
      setShowReturnPopup(false);
    } else {
      try {
        const response = await authAxios.get(`/rent/my-rent-record`);
        setMyRentSize(response.data.data.size);
      } catch (error) {
        console.error("Failed to fetch rental record:", error);
        setShowLoginPopup(true);
      }
      setShowRentPopup(false);
      setShowReturnPopup(true);
    }
  };

  const handlePopupClose = () => {
    setShowPopup(false);
    setShowRentPopup(false);
    setShowReturnPopup(false);
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  const handleRent = async () => {
    if (selectedSize) {
      try {
        await authAxios.post(`/rent`, { size: selectedSize });
        alert("Successfully rented!");
        handlePopupClose();
        fetchData();
      } catch (error) {
        console.error("Failed to rent:", error);
        alert("Rental failed. Please try again.");
      }
    } else {
      alert("Please select a size.");
    }
  };

  const handleReturn = async () => {
    if (myRentSize) {
      try {
        await authAxios.post(`/rent/return`, { size: myRentSize });
        alert("Successfully returned!");
        handlePopupClose();
        fetchData();
      } catch (error) {
        console.error("Failed to return:", error);
        alert("Return failed. Please try again.");
      }
    } else {
      alert("No rented shoes to return.");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>암벽화 대여 시스템</h1>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.tableHeader}>사이즈</th>
            <th style={styles.tableHeader}>총 개수</th>
            <th style={styles.tableHeader}>대여 중</th>
            <th style={styles.tableHeader}>남은 개수</th>
          </tr>
        </thead>
        <tbody>
          {sizes.map((item) => (
            <tr key={item.size}>
              <td style={styles.sizeCell(item.rentable)}>{item.size}</td>
              <td style={styles.tableCell}>{item.count}</td>
              <td style={styles.tableCell}>{item.count - item.rentable}</td>
              <td style={styles.sizeCell(item.rentable)}>{item.rentable}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={styles.buttonContainer}>
        <button style={styles.button} onClick={() => handlePopupOpen("rent")}>
          대여하기
        </button>
        <button
          style={{ ...styles.button, backgroundColor: "red" }}
          onClick={() => handlePopupOpen("return")}
        >
          반납하기
        </button>
      </div>
      {showPopup && (
        <div style={styles.popupOverlay}>
          <div style={styles.popup}>
            {showRentPopup && (
              <>
                <h2 style={styles.popupTitle}>사이즈 선택</h2>
                <div style={styles.popupContent}>
                  {sizes.map((item) => (
                    <button
                      key={item.size}
                      style={{
                        ...styles.sizeButton,
                        backgroundColor:
                          selectedSize === item.size
                            ? "blue"
                            : item.rentable <= 0
                            ? "gray"
                            : "initial",
                        color:
                          selectedSize === item.size
                            ? "white"
                            : item.rentable <= 0
                            ? "lightgray"
                            : "initial",
                        cursor: item.rentable <= 0 ? "not-allowed" : "pointer",
                      }}
                      onClick={() => handleSizeSelect(item.size)}
                      disabled={item.rentable <= 0}
                    >
                      {item.size}
                    </button>
                  ))}
                </div>
                <button style={styles.rentButton} onClick={handleRent}>
                  대여하기
                </button>
                <button style={styles.closeButton} onClick={handlePopupClose}>
                  닫기
                </button>
              </>
            )}
            {showReturnPopup && (
              <>
                <p style={styles.returnMessage}>
                  반납할 사이즈: {myRentSize || "없음"}
                </p>
                <button style={styles.returnButton} onClick={handleReturn}>
                  반납하기
                </button>
                <button style={styles.closeButton} onClick={handlePopupClose}>
                  닫기
                </button>
              </>
            )}
          </div>
        </div>
      )}
      {showLoginPopup && (
        <div style={styles.popupOverlay}>
          <div style={styles.popup}>
            <h2 style={styles.warnTitle}>로그인이 필요합니다</h2>
            <p style={styles.warnContent}>로그인을 먼저 해주세요!</p>
            <button
              style={styles.closeButton}
              onClick={() => navigate("/login")}
            >
              로그인 페이지로 이동
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Equipment;
