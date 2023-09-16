import {
  Box,
  Button,
  Container,
  HStack,
  Input,
  VStack,
  background,
} from "@chakra-ui/react";
import Message from "./components/Message";

import {
  onAuthStateChanged,
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import {
  query,
  orderBy,
  onSnapshot,
  addDoc,
  collection,
  getFirestore,
  serverTimestamp,
  deleteDoc,
  doc
} from "firebase/firestore";
import { app } from "./firebase";
import { useRef, useEffect, useState } from "react";
const auth = getAuth(app);
const db = getFirestore(app);
function loginHandler() {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider);
}
function logutHandle() {
  signOut(auth);
}

function App() {
  const q = query(collection(db, "message"), orderBy("createdAt", "asc"));
  const [User, setUser] = useState(false);
  const [message, Setmessage] = useState("");
  const [messages, setmessages] = useState([]);
  const scrool = useRef(null);

  //in this we can handle  submit function
  async function onsubmit(e) {
    e.preventDefault();
    if (message.trim() === "") {
      return; // Do not submit empty messages
    }
    try {
      Setmessage("");
      await addDoc(collection(db, "message"), {
        text: message,
        uid: User.uid,
        uri: User.photoURL,
        createdAt: serverTimestamp(),
      });

      scrool.current.scrollIntoView({ behavior: "smooth" });
    } catch (error) {
      alert("error");
    }
  }
  function onchanged(e) {
    Setmessage(e.target.value);
  }
// Delete Function
const handleDeleteMessage = async (messageId) => {
  console.log("Deleting message:", messageId);
  try {
    // Delete the message from the database
    await deleteDoc(doc(db, "message", messageId));
    console.log("Message deleted successfully.");
  } catch (error) {
    console.error("Error deleting message:", error);
  }
};



  useEffect(() => {
    const remove = onAuthStateChanged(auth, (data) => {
      setUser(data);
    });

    // in this code we can render the data from database and display on the screen...

    const unsubscribe = onSnapshot(q, (snap) => {
      const messageData = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setmessages(messageData);
    });

    return () => {
      remove();
      unsubscribe();
    };
  }, []);
  return (
    <Box bg={"red.50"}>
      {User ? (
        <Container h={"100vh"} bg={"white"}>
          <VStack
            h={"full"}
            paddingy={"4"}
            css={{ "&::-webkit-scrollbar": { display: "none" } }}
          >
            <Button onClick={logutHandle} colorScheme="red" w={"full"}>
              Logout
            </Button>

            <VStack h={"full"} w={"full"} overflow={"auto"}>
              {messages.map((item) => (
                <Message
                  key={item.id}
                  text={item.text}
                  uri={item.uri}
                  user={item.uid === User.uid ? "me" : "other"}>

                    {/* //DeleteCode */}
{item.uid === User.uid && (
      <Button
        size="xs"
        colorScheme="red"
        onClick={() => handleDeleteMessage(item.id)}
      >
        Delete
      </Button>
    )}

                </Message>
              ))}

              <div ref={scrool}></div>
            </VStack>

            <form onSubmit={onsubmit} style={{ width: "100%" }}>
              <HStack>
                <Input
                  value={message}
                  onChange={onchanged}
                  placeholder="Enter Message"
                />
                <Button colorScheme="purple" type="submit">
                  Send
                </Button>
              </HStack>
            </form>
          </VStack>
        </Container>
      ) : (
        <VStack h={"100vh"} bg={"white"} justifyContent={"center"}>
          <Button onClick={loginHandler} colorScheme="purple">
            Sign With Google
          </Button>
        </VStack>
      )}
    </Box>
  );
}

export default App;
