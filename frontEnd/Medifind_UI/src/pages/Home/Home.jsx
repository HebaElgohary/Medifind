import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css"
import {AddBtn} from "../../components/customComponents/Addbtn"
import { Post } from "../../components/customComponents/Post/Post";
import {  useState, useCallback } from "react";
import { FaSearch } from 'react-icons/fa';
import giftBox from '../../assets/gift-box.png';

export function Home() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [totalPage, setTotalPage] = useState(1);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    setSearchTimeout(setTimeout(() => {
      setPage(1);
    }, 500));
  };

  const nextPage = useCallback(() => {
    if (page < totalPage) {
      setPage(prev => prev + 1);
    }
  }, [page, totalPage]);

  const prevPage = useCallback(() => {
    if (page > 1) {
      setPage(prev => prev - 1);
    }
  }, [page]);

  const getTotalPage = useCallback((total) => {
    setTotalPage(Math.max(1, total));
  }, []);

  const goToAddMedicine = () => {
    navigate("/AddMedicine");
  }; 

  return (
    <>
      <main className={styles.heroSection}>
        <div className={styles.blobShape}></div>
        <div className={styles.heroContent}>
          <div className={styles.leftContent}>
            <h1 className={styles.title}>
              <span style={{ color: "var(--main-color)" }}>Give</span> the Gift of Health: Donate{" "}
              <span style={{ color: "var(--main-color)" }}>Medicine</span> Today!
            </h1>
            <p className={styles.description}>
              Every donated pill is a beacon of hope for someone in need. Join us in our mission to provide essential medicines to underserved 
              communities. By giving the gift of health, you&apos;re offering more than just medicine - you&apos;re offering a chance at a healthier, 
              brighter future. Donate today and become a vital part of our healing mission.
            </p>
            <AddBtn className={styles.donateButton} onClick={goToAddMedicine}>
              Donate
            </AddBtn>
          </div>
          <div className={styles.rightContent}>
            <div className={styles.imageWrapper}>
              <img src={giftBox} alt="Gift Box" className={styles.giftImage} />
            </div>
          </div>
        </div>
      </main>

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

      <section className="container-lg  mb-5">
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

      {totalPage > 1 && (
        <section className="mt-5 mb-5 d-flex justify-content-center align-items-center">
          <div className={styles.paginationContainer}>
            <button
              className={`${styles.paginationBtn} ${page === 1 ? styles.disabled : ""}`}
              onClick={prevPage}
              disabled={page === 1}
            >
              Previous
            </button>
            <span className={styles.pageNumber}>{page} of {totalPage}</span>
            <button
              className={`${styles.paginationBtn} ${page === totalPage ? styles.disabled : ""}`}
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