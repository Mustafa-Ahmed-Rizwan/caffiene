import Authentication from "./Authentication";
import Modal from "./Modal";
// 6.3 
import { useState } from "react";
import { useAuth } from '../context/AuthContext'



export default function Layout(props) {
  const { children } = props;
  //6.3 state for modal:
  // false=dont show modal until clicked on
  const [showModal, setShowModal] = useState(false);

  //15 destructure out global data:
  const { globalUser,logout} =useAuth()


  // 1.3 define header
  //2.1 working on header section and footer
  const header = (
    <header>
      <div>
        <h1 className="text-gradient">CAFFIEND</h1>
        <p>For Coffee Insatiates</p>
      </div>
      {globalUser ? (
        // 15  
        <button onClick={logout}>
          <p>Logout</p>
         
        </button>
      ) : (<button onClick={() => { setShowModal(true) }}>
        <p>Sign up free</p>
        <i className="fa-solid fa-mug-hot"></i>
      </button>)}
    </header>
  );
  const footer = (
    <footer>
      <p>
        <span className="text-gradient">Caffiend</span> was made by{" "}
        <a target="_blank" href="">
          Mustafa
        </a><br />
        Check out the  project on <a target="_blank" href="">Github</a>!
      </p>
    </footer>
  );

  function handleCloseModal(){
    setShowModal(false)
  }
  return (
    <>
      {/* 1.2 */}
      {/* children in main */}
      {/* //6.2 render out modal */}
      {/* conditional rendering */}
      {/* if true then show authentication modal */}
      {showModal && (<Modal handleCloseModal={handleCloseModal}>
        <Authentication handleCloseModal={handleCloseModal} />
      </Modal>)}
      {header}
      <main>{children}</main>

      {footer}
    </>
  );
}
