import React, { useState } from 'react';
import Navbar from '../navbar/navbar';
import { FaRegFileImage } from "react-icons/fa";
import { v4 } from 'uuid';
import Loader from '../Loader';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import './Detection.css';
import { imageDB } from '../../firebase';
import wronglogo from '../../Assests/wronglogo.jpg'
import correctlogo from '../../Assests/correctlogo.png'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Detection() {
  const [img, setImg] = useState();
  const [cancer, setCancer] = useState(true);
  const [loader, setLoader] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate()
  const filename = v4();
  document.querySelector('title').textContent = "CancerCare | Lab";
  const onChecked = async () => {
    setLoader(true);
    const imgRef = ref(imageDB, `files/${filename}`);
    await uploadBytes(imgRef, img);
    getDownloadURL(ref(imageDB, `files/${filename}`))
      .then(res => {
        axios.post('http://127.0.0.1:5000/predict', { 'image_link': res }, { headers: "application/json" })
          .then(resdata => {            
            if (resdata.data.predictions.label === "No Cancer") {
              setCancer(false);
            } else {
              setCancer(true);
            }
            setLoader(false);
            setModalOpen(true);
          });
      });
  };

  return (
    <>
      <div className={`${modalOpen ? 'blureffect' : ''}`}>
        {loader && <Loader />}
        <Navbar />
        <div className='labimg'></div>
        <div>
          <div className='d-block mx-auto mb-4' style={{ width: "85%" }}>
            <h3 className='text-center mt-4'>Cancer detection</h3>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem labore, ullam consectetur consequuntur itaque harum, alias explicabo at mollitia totam dolorum neque sed? Tempore odio modi facere at voluptatum officiis sapiente est, quo nostrum, iste dignissimos deserunt laudantium, eos perspiciatis mollitia quaerat ea repudiandae tenetur harum aperiam in. Ullam porro id illo, dolorum ratione ipsa harum enim cum quis magnam, delectus dolor tenetur amet. Sint culpa earum ab aut deleniti, distinctio tempora! Rerum a dolore tenetur, cumque eligendi nemo reprehenderit earum eaque sequi illum placeat ad labore ex recusandae. Molestiae ad ratione ipsa tempore reiciendis sapiente, recusandae exercitationem aspernatur officia quam maiores magni odio nam eius ipsum. Unde tempore distinctio porro assumenda commodi labore vitae laboriosam iste nam. Labore voluptatem nulla pariatur quibusdam, ullam iste quas reprehenderit libero delectus odit magnam accusantium? Amet ad, sunt modi, alias ea pariatur sit quas fuga ratione ducimus consequuntur non necessitatibus dolores. Possimus officia laudantium eligendi illum eos sunt libero adipisci, earum doloremque obcaecati odio provident eius minima quasi delectus quam assumenda, suscipit praesentium ex tenetur dolore? Sapiente, ex repellendus animi repudiandae accusamus sunt, hic maxime, deleniti perferendis eveniet harum dignissimos magnam! Praesentium perspiciatis velit assumenda excepturi labore exercitationem vero eveniet dignissimos veniam numquam!</p>
          </div>
          <div>
            <label htmlFor="image" className='mx-auto mb-5 drop-container'>
              <i style={{ fontSize: "60px" }}><FaRegFileImage /></i>
              <span className='drop-title'>Upload here</span>
              or
              <input type="file" id='image' accept='image/*' onChange={(e) => setImg(e.target.files[0])}/>
              <button style={{ marginTop: "20px", fontSize: "18px", width: "max-content" }} onClick={() => onChecked()} className='btn btn-outline-dark'>Check</button>
            </label>
          </div>
        </div>
      </div>
      <div className={`modal fade ${modalOpen ? 'show' : ''}`} style={{ display: modalOpen ? 'block' : 'none' }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content" style={{ boxShadow: "0 4px 15px 4px rgba(0, 0, 0, 0.2)" }}>
            <div className="modal-header">
              <button type="button" className="btn-close" aria-label="Close" onClick={() => setModalOpen(false)}></button>
            </div>
            <div className='d-block mx-auto modal-body'>
              <img src={cancer ? correctlogo : wronglogo} width={`${cancer ? "200px" : "250px"}`} height={`${cancer ? "200px" : "250px"}`} alt="" />
              {cancer === true ? <h3 className='mb-4'>Cancer Detected</h3> : <h3 className='mb-4'>No cancer detected</h3>}
            </div>
            <div className="modal-footer">
              {cancer && <button type="button" className='btn btn-success' onClick={() => navigate('/maps')}>Get Hospitals</button>}
              <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Detection;
