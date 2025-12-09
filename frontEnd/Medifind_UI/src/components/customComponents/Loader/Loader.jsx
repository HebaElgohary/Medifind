import React from 'react'
import styles from './Loader.module.css'
export  function Loader() {
  return (
    <div className={`${styles.loaderContainer} position-absolute top-0 w-100 start-0 z-2 d-flex justify-content-center align-items-center `}>
        <span className={`${styles.loader}`}></span>
    </div>
  )
}
