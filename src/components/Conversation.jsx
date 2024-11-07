import React, { useEffect, useState } from 'react';
import ConversationItem from './ConversationItem';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

const Conversation = ({ currentUserId, onSelectUser }) => { // Ensure onSelectUser is in props
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersCollection = collection(db, 'users');
                const usersSnapshot = await getDocs(usersCollection);
                const userList = usersSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                const filteredUsers = userList.filter(user => user.id !== currentUserId);
                setUsers(filteredUsers);
            } catch (error) {
                console.error("Error fetching users: ", error);
            }
        };

        fetchUsers();
    }, [currentUserId]);

    return (
        <div className="p-1">
            {users.length > 0 ? (
                users.map((user) => (
                    <div key={user.id} onClick={() => onSelectUser && onSelectUser(user)}> {/* Call onSelectUser safely */}
                        <ConversationItem name={user.userName} />
                    </div>
                ))
            ) : (
                <div className="text-gray-500">No users available.</div>
            )}
        </div>
    );
};

export default Conversation;
