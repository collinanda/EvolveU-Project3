import React, { useState, useEffect } from "react"; //, Component
import Button from "react-bootstrap/Button";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import NavBar from "./NavBar";
import MainModal from "./MainModal";
import RenderStubsDraggable from "./RenderStubsDraggable";
import RenderStubsNonDraggable from "./RenderStubsNonDraggable";
import retrievePostings from "../functions/retrievePostings";
import removeAllPostings from "../functions/removeAllPostings";
import ZoomControls from "./ZoomControls";


const emptyPost = {
  title: "",
  contributors: "",
  content: "",
  tags: "",
  contentType: "",
  spiciness: "",
  upvotes: 0,
  positionX: 0,
  positionY: 0,
};

// const stubArray = [
//   { title: "Git Merge tutorial", contributors: "Collin A, James M, Yemi O", fromTop: "78.5%", fromLeft: "19%" },
//   { title: "Git Introduction", contributors: "Granger, H", fromTop: "80%", fromLeft: "20%" },
//   { title: "Git is Sh*t", contributors: "Just Sayin", fromTop: "82%", fromLeft: "18%" },
//   { title: "VS Code Git Tools", contributors: "Smith, J", fromTop: "77%", fromLeft: "20.5%" },
//   { title: "Useful VS Code Extensions", contributors: "Murphy, J", fromTop: "73%", fromLeft: "22%" },
// ];

const PostingsList = () => {
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const [showMainModal, setShowMainModal] = useState(false);
  const [postingsDataArray, setPostingsDataArray] = useState();
  const [currPostIndex, setCurrPostIndex] = useState(0);
  const [postDraft, setPostDraft] = useState(emptyPost);
  const [creatingPostFlag, setCreatingPostFlag] = useState(false);
  const [userVoted, setUserVoted] = useState(false);
  const [dragMode, setDragMode] = useState(false);

  // console.log("PostingsList.js begins: creatingPostFlag=", creatingPostFlag);
  console.log("PostingsList.js begins: postDraft=", postDraft);

  useEffect(() => {
    // from: https://stackoverflow.com/questions/59546928/keydown-up-events-with-react-hooks-not-working-properly
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  });

  // Suppress context menu from opening
  useEffect(() => {
    window.addEventListener("contextmenu", (evnt) => evnt.preventDefault(), false);
    return () => window.removeEventListener("contextmenu", (evnt) => evnt.preventDefault(), false);
  }, []);

  // Retrive the data from DB into postingsDataArray, so postingsDataArray is never null
  if (!postingsDataArray) {
    console.log(
      "postingsDataArray is falsy so retrieving the data from the DB. And in the interim setting it to [emptyPost]"
    );
    setPostingsDataArray([emptyPost]);
    retrievePostings(setPostingsDataArray, emptyPost);
  }

  const handleKeyDown = (event) => {
    console.log("handleKeyDown event.key=", event.key);
    if (event.key === "Control") {
      setDragMode(true);
    }
  };

  const handleKeyUp = (event) => {
    if (event.key === "Control") {
      setDragMode(false);
    }
  };

  const StubsNonDraggableZoomPan = (props) => {
    let positionX = props.positionX;
    let positionY = props.positionY;
    let scale = props.scale;
    const zoomIn = props.zoomIn;
    const zoomOut = props.zoomOut;
    const setTransform = props.setTransform;

    return (
      <>
        <ZoomControls
          scale={scale}
          zoomIn={zoomIn}
          zoomOut={zoomOut}
          setTransform={setTransform}
          positionX={positionX}
          positionY={positionY}
        />

        <TransformComponent>
          <div className="backdrop">
            <RenderStubsNonDraggable
              postingsDataArray={postingsDataArray}
              currPostIndex={currPostIndex}
              setCurrPostIndex={setCurrPostIndex}
              showMainModal={showMainModal}
              setShowMainModal={setShowMainModal}
              postDraft={postDraft}
              setPostDraft={setPostDraft}
              setCreatingPostFlag={setCreatingPostFlag}
              userVoted={userVoted}
              setUserVoted={setUserVoted}
            />
          </div>
        </TransformComponent>
      </>
    );
  };

  return (
    <>
      <NavBar
        emptyPost={emptyPost}
        showWelcomeModal={showWelcomeModal}
        setShowWelcomeModal={setShowWelcomeModal}
        setShowMainModal={setShowMainModal}
        postingsDataArray={postingsDataArray}
        setPostingsDataArray={setPostingsDataArray}
        setCurrPostIndex={setCurrPostIndex}
        setCreatingPostFlag={setCreatingPostFlag}
        setPostDraft={setPostDraft}
      />

      {/* Draggable mode */}
      {dragMode && (
        <RenderStubsDraggable
          postingsDataArray={postingsDataArray}
          currPostIndex={currPostIndex}
          setCurrPostIndex={setCurrPostIndex}
          showMainModal={showMainModal}
          setShowMainModal={setShowMainModal}
          postDraft={postDraft}
          setPostDraft={setPostDraft}
          setCreatingPostFlag={setCreatingPostFlag}
          userVoted={userVoted}
          setUserVoted={setUserVoted}
        />
      )}

      {/* ZoomPan mode */}
      {!dragMode && (
        <TransformWrapper
          defaultScale={0.5}
          defaultPositionX={0}
          defaultPositionY={0}
          enablePadding={false}
          wheel={{
            step: 160,
          }}
          options={{
            // See "Options prop elements" on https://www.npmjs.com/package/react-draggable
            minScale: 0.25,
            maxScale: 15,
            centerContent: false,
            limitToBounds: false,
          }}>
          {(props) => <StubsNonDraggableZoomPan {...props} />}
        </TransformWrapper>
      )}

      {showMainModal && (
        <MainModal
          showMainModal={showMainModal}
          setShowMainModal={setShowMainModal}
          postingsDataArray={postingsDataArray}
          setPostingsDataArray={setPostingsDataArray}
          currPostIndex={currPostIndex} //C: currPostIndex points to the element in the postings array that we're interested in
          setCurrPostIndex={setCurrPostIndex}
          postDraft={postDraft}
          setPostDraft={setPostDraft}
          creatingPostFlag={creatingPostFlag}
          userVoted={userVoted}
          setUserVoted={setUserVoted}
        />
      )}

      {dragMode ? <div>DRAG TIME!</div> : <div>Zoom around</div>}

      <Button
        variant="outline-danger"
        onClick={() => {
          removeAllPostings();
          setPostingsDataArray([emptyPost]);
        }}>
        [Dev Only] Remove All
      </Button>
    </>
  );
};

export default PostingsList;
