import React from "react";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";
import Modal from "react-bootstrap/Modal";
import convertISODate from "../functions/convertISODate";
// import retrievePostings from "../functions/retrievePostings";
import updatePostOnDB from "../functions/updatePostOnDB";
// import createPostOnDB from "../functions/createPostOnDB";
import updatePostOnDataArray from "../functions/updatePostOnDataArray";
import deletePostFromDB from "../functions/deletePostFromDB";
import deletePostFromDataArray from "../functions/deletePostFromDataArray";
// import createPostOnDataArray from "../functions/createPostOnDataArray";


const MainModal = (props) => {

  // const emptyPost = props.emptyPost;
  let showMainModal = props.showMainModal;
  let currPostIndex = props.currPostIndex;
  // const setCurrPostIndex = props.setCurrPostIndex;
  // const setShowMainModal = props.setShowMainModal;
  const setPostingsDataArray = props.setPostingsDataArray;
  let postingsDataArray = props.postingsDataArray;
  let postBuffer = props.postBuffer;
  const setPostBuffer = props.setPostBuffer;
  // let showDates = props.showDates;
  let creatingPostFlag = props.creatingPostFlag;
  const cleanUpAfterMainModal = props.cleanUpAfterMainModal;


  console.log("MainModal.js Begins.");
  console.log("MainModal.js postBuffer=", postBuffer);
  console.log("MainModal.js postingsDataArray=", postingsDataArray);
  console.log("MainModal.js creatingPostFlag=", creatingPostFlag);
  // console.log("MainModal.js currPostIndex=", currPostIndex);


  // if (!(postBuffer?.title)) {   //BAD! Can't use setPostBuffer here (child). Consider putting it in a callback called from parent
  //   console.log("MainModal.js postBuffer (or at least its title) is empty! Please debug this case.")
  //   setPostBuffer(emptyPost);
  //   setShowMainModal(false); 
  // }


  const handleInputChange = (evnt) => {       //J: This could be called updatePostBuffer()
    const { name, value } = evnt.target;
    // console.log("MainModal.js: handleInputChange: value =", value);
    // console.log("MainModal.js: handleInputChange: name =", name);
    // console.log("MainModal.js: handleInputChange: old postBuffer=", postBuffer);

    setPostBuffer((currBuffer) => {
      const newPostBuffer = { ...currBuffer, [name]: value };
      // Brackets [] around 'name' are so the VALUE of name is used for the key and not just the string 'name'.
      console.log("MainModal.js: handleInputChange: setting postBuffer to", newPostBuffer);
      return newPostBuffer;
   });
  };


  return (
    <>
      <Modal size="lg" centered show={showMainModal} animation={false} onHide={() => { 
        cleanUpAfterMainModal();
        // setShowMainModal(false);

      }}>

        <Modal.Body>
          <>
            <input
              name="title"
              type="text"
              required
              className="text-xl w-full p-1 font-500 focus:bg-gray-200 hover:bg-gray-200"
              placeholder="Enter title of posting here"
              value={postBuffer.title}
              onChange={handleInputChange}            // Try onBlur ??
            />
          </>

          <div className="flex flex-row items-baseline p-1 mt-2">
            <div className="font-500">Contributors:</div>        {/* font-500 is Tailwind for bold */}
            <input
              name="contributors"
              type="text"
              required
              className="modalField"
              placeholder="Enter names of contributors here (Firstname, last Initial)"
              value={postBuffer.contributors}
              onChange={handleInputChange}
            />
          </div>

          {/* {(!creatingPostFlag.current) ? ( */}
            <div className="flex flex-row p-1 mt-2">   {/* Dates are read-only, and only shown for existing posts */}

              <div className="flex flex-row">
                <div className="font-500">Created:</div>
                <div className="ml-2 font-400">{convertISODate(postBuffer.createdAt)}</div>
              </div>

              <div className="flex flex-row ml-6">
                <div className="font-500">Modified:</div>
                <div className="ml-2 font-400">{convertISODate(postBuffer.updatedAt)}</div>
              </div>
            </div>
          {/* ) : (
            <></>
          )} */}

          <div className="flex flex-row items-baseline p-1 mt-2">
            <div className="font-500">Tags:</div>
            <input
              name="tags"
              type="text"
              required
              className="modalField"
              placeholder="Enter tags/keywords here"
              value={postBuffer.tags}
              onChange={handleInputChange}
            />
          </div>

          <input
            name="description"                              //J: I'd like to change this to 'content' 
            type="text"
            required
            className="modalField"
            placeholder="Enter content of post here"
            value={postBuffer.description}                         //J: I'd like to change this to '.content' 
            onChange={handleInputChange}
          />

          <div className="flex flex-row items-baseline p-1 mt-2">
            <div className="font-500">Content Type:</div>
            <input
              name="contentType"
              type="text"
              required
              className="modalField"
              placeholder="Enter type of content (Text, file, etc.)"
              value={postBuffer.contentType}
              onChange={handleInputChange}
            />
          </div>

          <div className="flex flex-row items-baseline p-1 mt-2">
            <Dropdown>
              <Dropdown.Toggle
                variant="success"       //J: How about we change this to checkboxes, so it's easy to select more than 1
                id="dropdown-basic"
                name="spiciness"
                required
                className="modalField"
                value={postBuffer.spiciness}
                defaultValue="0"
                onChange={handleInputChange}
              >
                Spiciness
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item href="#/action-1" value="1">Mild</Dropdown.Item>
                <Dropdown.Item href="#/action-2" value="2">Medium</Dropdown.Item>
                <Dropdown.Item href="#/action-3" value="3">Spicy</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>

          <div className="flex flex-row items-baseline p-1 mt-2">
            <div className="font-500">Upvotes:</div>          {/*J: Need to add Collin's counter code here */}
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="warning"
            onClick={ () => { 
              console.log("MainModal.js Clicked Abandon Changes")
              cleanUpAfterMainModal()
            }}
          >
            Abandon Changes
          </Button>

          <Button
            variant="danger"
            onClick={() => {      // Only delete if editing an existing post
              console.log("MainModal.js Clicked Delete Post")
              if (!creatingPostFlag.current && (currPostIndex < postingsDataArray.length) && (currPostIndex >=0)) {
                deletePostFromDB(postingsDataArray, currPostIndex);
                deletePostFromDataArray(postingsDataArray, setPostingsDataArray, currPostIndex);
              }
              cleanUpAfterMainModal();
            }}
          >
            Delete Post       {/* Add an icon? */}
          </Button>

          <Button
            color="green"
            type="submit"
            onClick={ () => {
              console.log("MainModal.js Clicked Save Post")
              updatePostOnDB(postBuffer, currPostIndex)
              updatePostOnDataArray(setPostingsDataArray, postBuffer, currPostIndex)
              cleanUpAfterMainModal();
              // setCurrPostIndex(0);
              // setShowMainModal(false);
            }}>
            Save Post         {/* Add an icon? */}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default MainModal;
