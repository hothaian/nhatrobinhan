import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

import {
  Sheet,
  Button,
  Page,
  Text,
  useNavigate,
  Input,
  Box,
  DatePicker,
  Select,
  useSnackbar,
  Picker,
} from "zmp-ui";

const firebaseConfig = {
  apiKey: "AIzaSyCs7EiDM3L4oa7PGbzsyfuvXKUD6e9AfMA",
  authDomain: "nha-tro-binh-an.firebaseapp.com",
  projectId: "nha-tro-binh-an",
  storageBucket: "nha-tro-binh-an.appspot.com",
  messagingSenderId: "878602265886",
  appId: "1:878602265886:web:5d7680d74838456795550f",
  measurementId: "G-GBQZENQQ3G",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const usersCollection = collection(db, "users"); // Replace "users" with your collection name

interface User {
  id: string;
  roomNumber: string;
  userName: string;
  birthdate: string;
  birthplace: string;
  nameOption: string;
}

export default function UserForm() {
  const { openSnackbar, setDownloadProgress, closeSnackbar } = useSnackbar();

  const [roomNumber, setRoomNumber] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [birthdate, setBirthdate] = useState<string>("");
  const [birthplace, setBirthplace] = useState<string>("");
  const [nameOption, setNameOption] = useState<string>("Binh An 1");
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // Retrieve data from Firestore and listen for updates
    const q = query(usersCollection, orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const userData: User[] = [];
      querySnapshot.forEach((doc) => {
        userData.push({
          id: doc.id,
          roomNumber: doc.data().roomNumber,
          userName: doc.data().userName,
          birthdate: doc.data().birthdate,
          birthplace: doc.data().birthplace,
          nameOption: doc.data().nameOption,
        });
      });
      setUsers(userData);
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  const handleRoomNumberChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRoomNumber(event.target.value);
  };

  const handleUserNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value);
  };

  const handleBirthdateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setBirthdate(event.target.value);
  };

  const handleBirthplaceChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setBirthplace(event.target.value);
  };

  const handleNameOptionChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setNameOption(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const docRef = await addDoc(usersCollection, {
        roomNumber: roomNumber,
        userName: userName,
        birthdate: birthdate,
        birthplace: birthplace,
        nameOption: nameOption,
        timestamp: new Date(),
      });
      console.log("Document written with ID: ", docRef.id);

      // Clear the input fields after submission
      setRoomNumber("");
      setUserName("");
      setBirthdate("");
      setBirthplace("");
      setNameOption("Binh An 1");
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="form-columns">
          <div className="form-column">
            <Picker
              label="Single Column"
              helperText="Helper text"
              placeholder="Placeholder"
              mask
              maskClosable
              title="Single Column"
              action={{
                text: "Close",
                close: true,
              }}
              // disabled
              data={[
                {
                  options: genTestData("key1", 5, "Col 1 - "),
                  name: "otp1",
                },
                {
                  options: genTestData("key2", 10, "Col 2 - "),
                  name: "otp2",
                },
                {
                  options: genTestData("key3", 15, "Col 3 - "),
                  name: "otp3",
                },
              ]}
            />

            <Input
              type="text"
              placeholder="Room Number"
              value={roomNumber}
              onChange={handleRoomNumberChange}
            />
            <Input
              type="text"
              placeholder="User Name"
              value={userName}
              onChange={handleUserNameChange}
            />
          </div>

          <div className="form-column">
            <Box mt={6}>
              <DatePicker
                label="Label"
                helperText="Helper text"
                mask
                maskClosable
                dateFormat="dd/mm/yyyy"
                title="DatePicker"
              />
            </Box>
            <Input
              placeholder="Birthdate (DD/MM/YYYY)"
              value={birthdate}
              onChange={handleBirthdateChange}
              pattern="\d{2}/\d{2}/\d{4}"
            />
            <Input
              type="text"
              placeholder="Birthplace"
              value={birthplace}
              onChange={handleBirthplaceChange}
            />
          </div>
        </div>
        <select
          placeholder="Bình An 1"
          value={nameOption}
          onChange={handleNameOptionChange}
        >
          <option value="binh_an_1" title="Bình An 1" />
          <option value="binh_an_2" title="Bình An 2" />
        </select>
        <button type="submit">Add User</button>
      </form>

      <div>
        <h2>Registered Users:</h2>
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              <p>Room Number: {user.roomNumber}</p>
              <p>User Name: {user.userName}</p>
              <p>Birthdate: {user.birthdate}</p>
              <p>Birthplace: {user.birthplace}</p>
              <p>Name Option: {user.nameOption}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
function genTestData(
  arg0: string,
  arg1: number,
  arg2: string
): import("zmp-ui/picker").PickerColumnOption[] {
  throw new Error("Function not implemented.");
}
