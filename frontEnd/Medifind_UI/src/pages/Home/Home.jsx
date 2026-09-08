
import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";
import { AddBtn } from "../../components/customComponents/Addbtn";
import { Post } from "../../components/customComponents/Post/Post";
import { useState, useCallback } from "react";
import { FaSearch } from "react-icons/fa";
import giftBox from "../../assets/gift-box.png";
import { useDecoded } from "../../customHooks/useDecode";
import { Loader } from "../../components/customComponents/Loader/Loader";

export function Home() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [totalPage, setTotalPage] = useState(1);

  const navigate = useNavigate();

  // Get decoded token
  const { decodedToken, isDecoding } = useDecoded();

  const loggedInUserId = decodedToken?.id;

  console.log(loggedInUserId);

  // Search
  const handleSearch = (e) => {
    const query = e.target.value;

    setSearchQuery(query);

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    setSearchTimeout(
      setTimeout(() => {
        setPage(1);
      }, 500)
    );
  };

  // Next page
  const nextPage = useCallback(() => {
    if (page < totalPage) {
      setPage((prev) => prev + 1);
    }
  }, [page, totalPage]);

  // Previous page
  const prevPage = useCallback(() => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  }, [page]);

  // Get total pages from Post component
  const getTotalPage = useCallback((total) => {
    setTotalPage(Math.max(1, total));
  }, []);

  // Navigate to Add Medicine
  const goToAddMedicine = () => {
    navigate("/AddMedicine");
  };

  // Wait for token decoding
  if (isDecoding) {
    return <Loader />;
  }

  return (
    <>
      {/* Hero Section */}
      <main className={styles.heroSection}>
        <div className={styles.blobShape}></div>

        <div className={styles.heroContent}>
          {/* Left Content */}
          <div className={styles.leftContent}>
            <h1 className={styles.title}>
              <span style={{ color: "var(--main-color)" }}>
                Give
              </span>{" "}
              the Gift of Health: Donate{" "}
              <span style={{ color: "var(--main-color)" }}>
                Medicine
              </span>{" "}
              Today!
            </h1>

            <p className={styles.description}>
              Every donated pill is a beacon of hope for someone
              in need. Join us in our mission to provide essential
              medicines to underserved communities. By giving the
              gift of health, you&apos;re offering more than just
              medicine - you&apos;re offering a chance at a healthier,
              brighter future. Donate today and become a vital part
              of our healing mission.
            </p>

            {/* Show Donate button only for users */}
            {decodedToken?.role?.toLowerCase() === "user" && (
              <AddBtn
                className={styles.donateButton}
                onClick={goToAddMedicine}
              >
                Donate
              </AddBtn>
            )}
          </div>

          {/* Right Content */}
          <div className={styles.rightContent}>
            <div className={styles.imageWrapper}>
              <img
                src={giftBox}
                alt="Gift Box"
                className={styles.giftImage}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Search */}
      <div className={styles.searchContainer}>
        <div className={styles.searchBar}>
          <FaSearch className={styles.searchIcon} />

          <input
            type="text"
            placeholder="Search for medicines..."
            value={searchQuery}
            onChange={handleSearch}
            className={styles.searchInput}
          />
        </div>
      </div>

      {/* Latest Donations */}
      <section className="container-lg mb-5">
        <h3 className="my-5">
          Latest Donations{" "}
          <span style={{ color: "var(--main-color)" }}>
            <i className="fa-solid fa-handshake-angle"></i>
          </span>
        </h3>

        <Post
          page={page}
          getTotalPage={getTotalPage}
          searchQuery={searchQuery}
          style={{ marginTop: "50px !important" }}
        />
      </section>

      {/* Pagination */}
      {totalPage > 1 && (
        <section className="mt-5 mb-5 d-flex justify-content-center align-items-center">
          <div className={styles.paginationContainer}>
            <button
              className={`${styles.paginationBtn} ${
                page === 1 ? styles.disabled : ""
              }`}
              onClick={prevPage}
              disabled={page === 1}
            >
              Previous
            </button>

            <span className={styles.pageNumber}>
              {page} of {totalPage}
            </span>

            <button
              className={`${styles.paginationBtn} ${
                page === totalPage ? styles.disabled : ""
              }`}
              onClick={nextPage}
              disabled={page === totalPage}
            >
              Next
            </button>
          </div>
        </section>
      )}
    </>
  );
}

