import React, { useEffect, useState } from "react";
import { fetchUsers } from "../api/userApi";

export default function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers()
      .then((data) => setUsers(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h2>User List</h2>
      {users.map((user) => (
        <p key={user.id}>{user.name}</p>
      ))}
    </div>
  );
}
