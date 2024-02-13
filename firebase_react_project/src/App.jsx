import { useState, useEffect } from "react";
import Auth from "./components/auth";
import { db, auth, storage } from "./config/firebase";
import {
  getDocs,
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";

function App() {
  const [movieList, setMovieList] = useState([]);
  const moviesCollectionRef = collection(db, "movies");

  //new movie state
  const [newMovieTitle, setNewMovieTitle] = useState("");
  const [newReleaseDate, setNewReleaseDate] = useState(0);
  const [gotAnOscar, setGotAnOscar] = useState(false);

  //updated title
  const [updatedTitle, setUpdatedTitle] = useState("");

  //file upload state
  // const [fileUpload, setFileUpload] = useState(null);

  //image upload
  const [imageUpload, setImageUpload] = useState(null);
  const [imageList, setImageList] = useState([]);

  const getMovieList = async () => {
    //read the data from db
    //set te=he movie list
    try {
      const data = await getDocs(moviesCollectionRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      console.log(filteredData);
      setMovieList(filteredData);
    } catch (error) {
      console.log(error);
    }
  };

  

  //create a new movie
  const onSubmitMovie = async () => {
    try {
      await addDoc(moviesCollectionRef, {
        title: newMovieTitle,
        releaseDate: newReleaseDate,
        receivedAnOscar: gotAnOscar,
        userId: auth?.currentUser?.uid,
      });

      getMovieList();
    } catch (error) {
      console.log(error);
    }
  };

  //delete a movie
  const deleteMovie = async (id) => {
    try {
      const movieDoc = doc(db, "movies", id);
      await deleteDoc(movieDoc);
      getMovieList();
    } catch (error) {
      console.log(error);
    }
  };

  //update movie title
  const updateMovieTitle = async (id) => {
    try {
      const movieDoc = doc(db, "movies", id);
      await updateDoc(movieDoc, { title: updatedTitle });
      getMovieList();
    } catch (error) {
      console.log(error);
    }
  };

  // const uploadFile = async () => {
  //   if (!fileUpload) return;
  //   const filesFolderRef = ref(storage, `projectFiles/${fileUpload.name}`);
  //   try {
  //     await uploadBytes(filesFolderRef, fileUpload);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
const imageListRef = ref(storage, "images/")
  const uploadImage = async () => {
    if (!imageUpload) return;
    const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
    uploadBytes(imageRef, imageUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url)=>{
        setImageList((prev)=> [...prev, url])
      })
      alert("image uploaded");
      
    });
  };

  useEffect(() => {
    listAll(imageListRef).then((response)=>{
     response.items.forEach((item)=>{
      getDownloadURL(item).then((url)=>{
        setImageList((prev)=> [...prev, url])
      })
     })
    })
    
    getMovieList();
  }, []);

  return (
    <>
      <Auth />
      <div>
        <h1>CREATE A NEW MOVIE</h1>
        <input
          placeholder="Movie title..."
          type="text"
          name=""
          id="title"
          onChange={(e) => setNewMovieTitle(e.target.value)}
        />
        <input
          placeholder="Release date..."
          type="number"
          name=""
          id="date"
          onChange={(e) => setNewReleaseDate(Number(e.target.value))}
        />
        <input
          placeholder="Movie title..."
          type="checkbox"
          name="oscar"
          id="oscar"
          checked={gotAnOscar}
          onChange={(e) => setGotAnOscar(e.target.checked)}
        />
        <label htmlFor="oscar">Received an Oscar???</label>
        <button onClick={onSubmitMovie}>Submit Movie</button>
      </div>
      <div>
        <h2>ALL THE MOVIES!</h2>
        {movieList.map((movie) => (
          <div key={movie.id}>
            <h1 style={{ color: movie.receivedAnOscar ? "green" : "blue" }}>
              {movie.title}
            </h1>
            <p>{movie.releaseDate}</p>
            <button
              style={{ backgroundColor: "red" }}
              onClick={() => deleteMovie(movie.id)}
            >
              Delete Movie
            </button>
            <div>
              <input
                placeholder="New title"
                type="text"
                name=""
                id="newtitle"
                onChange={(e) => setUpdatedTitle(e.target.value)}
              />
              <button onClick={() => updateMovieTitle(movie.id)}>
                Update Title
              </button>
            </div>
          </div>
        ))}
      </div>
      <hr />
      <div>
        <input
          type="file"
          name=""
          id="file"
          onChange={(e) => setImageUpload(e.target.files[0])}
        />
        <button onClick={uploadImage}>Upload Image</button>
        {
          imageList.map((url)=>{
            return <img style={{margin:'auto', width:'300px'}} src={url} alt={url} key={url}/>
          })
        }
      </div>
      {/* <div>
        <hr />
        <input
          type="file"
          name=""
          id="file"
          onChange={(e) => setFileUpload(e.target.files[0])}
        />
        <button onClick={uploadFile}>Upload File </button>
      </div> */}
    </>
  );
}

export default App;
