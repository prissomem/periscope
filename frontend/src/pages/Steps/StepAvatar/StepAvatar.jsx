import React, { useState } from "react";
import Card from "../../../components/shared/Card/Card";
import Button from "../../../components/shared/Button/Button";
import { useDispatch, useSelector } from "react-redux";
import styles from "./StepAvatar.module.css";
import { setAvatar } from "../../../store/activateSlice";
import { activate } from "../../../http/index";
import { setAuth } from "../../../store/authSlice";
import Loader from "../../../components/shared/Loader/Loader";
import { useEffect } from "react";

// This is one of the completed page of auth-flow.
// We are doing many complex task here like uploading image, setting it to global state (c) and then seding all of this information to the server which we

const StepAvatar = ({ onNext }) => {
  const { name, avatar } = useSelector((state) => state.activate);
  const [image, setImage] = useState("/images/YellowShirtLadyDP.png");
  const [loading, setLoading] = useState(false);
  const [unmounted, setUnmounted] = useState(false);
  const dispatch = useDispatch();

  function captureImage(e) {
    const file = e.target.files[0];
    const reader = new FileReader();

    // readAsDataURL is a function that will convert image into data URL so we can use this to display uploaded image.
    // We are not passing this image file to the image tag because we can't file as source of image tag so we pass and data URL.
    reader.readAsDataURL(file);
    // as soon as we finish reading we will set this image to global state as well as in local variable that is used for displaying the image.
    reader.onloadend = function () {
      dispatch(setAvatar(reader.result));
      setImage(reader.result);
    };
  }

  async function submit() {
    if (!avatar || !name) return;

    setLoading(true);
    // Here we will send the post request with name and avatar and wait for server to return the response containing user data.
    // From the data we will set the user to global state's user. See the auth function.
    try {
      const { data } = await activate({ name, avatar });

      if (data.auth && !unmounted) {
        dispatch(setAuth(data));
      }
      // console.log(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    return () => {
      setUnmounted(false);
    };
  }, []);

  if (loading) return <Loader message="Activating..." />;

  return (
    <div className="card shadow-3d rouded-corner bg_secondary">
      <p className="text_primary">Let's show your beautiful self!</p>
      <div className={styles.avatarSection}>
        <div className={styles.avatarWrap}>
          <img className={styles.avatar} src={image} alt="avatar" />
          <div className={styles.imgUploadButton}>
            <img
              className={styles.uploadIcon}
              src="/images/UploadtoCloud.png"
            />
          </div>
        </div>
        {/* <input
          onChange={captureImage}
          type="file"
          id="avatarInput"
          className={styles.avatarInput}
        /> */}
      </div>
      <div className={styles.buttonWrapper}>
        <Button
          text="Continue"
          onClick={submit}
          buttonColor="bg_primary"
          textColor="text_white"
        />
      </div>
    </div>
  );
};

export default StepAvatar;
