import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];


function Button({children, onClick}) {
  return (
    <button className="button" onClick={onClick}>{children}</button>
  )
}

export default function App() {
  const [showFriend, setShowFriend] = useState(false)
  const [addFriend, setAddFriend] = useState(initialFriends)
  const [selectedFriend, setSelectedFriend] = useState(null)

  function handleClick(friend) {
    setShowFriend(!showFriend)
    setSelectedFriend((cur) => (
      cur?.id === friend.id ? null : showFriend
    ))
  }

  function handleAddfriend(friend) {
    setAddFriend([...addFriend, friend])
    setShowFriend(false)
  }

  function handleSelection(friend) {
    // setSelectedFriend(friend)
    setSelectedFriend((currSelected) => (
      currSelected?.id === friend.id ? null : friend))
      setShowFriend(false) 
  }

  function handleSplitBill(value) {
    setAddFriend(addFriend => addFriend.map(friend => friend.id === selectedFriend.id ? {...friend, balance: friend.balance + value} : friend))

    setSelectedFriend(null)
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList friends={addFriend} onSelection={handleSelection} selectedFriend={selectedFriend}/>

        {showFriend && <FormAddFriend onAddFriend={handleAddfriend}/>}

        <Button onClick={handleClick}>{showFriend ? 'Close' : 'Add Friend'}</Button>
      </div>
      {selectedFriend && <FormSplitBill selectedFriend={selectedFriend} onSplitBill={handleSplitBill} />}
    </div>
  )
}

function FriendsList({friends, onSelection, selectedFriend}) {
  // const friends = initialFriends
  return (
    <ul>
      {friends.map(friend => (
        <Friend friend={friend} key={friend.id} onSelection={onSelection} selectedFriend={selectedFriend}/>
      ))}
    </ul>
  )
}

function Friend({friend, onSelection, selectedFriend}) {
  const isSelected = selectedFriend?.id === friend.id
  return (
    <li className={isSelected ? 'selected' : ''}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && <p className="red">You owe {friend.name} ₹{Math.abs(friend.balance)}</p>}
      {friend.balance > 0 && <p className="green">{friend.name} owe you ₹{Math.abs(friend.balance)}</p>}
      {friend.balance === 0 && <p>You and {friend.name} are even</p>}
      <Button onClick={()=>onSelection(friend)}>{isSelected ? 'Close' : 'Select'}</Button>
    </li>
  )
}


function FormAddFriend({onAddFriend}) {
  const [name, setName] = useState('')
  const [image, setImage] = useState('https://i.pravatar.cc/48')

  function handleSubmit(e) {
    e.preventDefault()

    if(!name || !image) return 

    const id = crypto.randomUUID()

    const newFriend = {
      name,
      id,
      image: `${image}?=${id}`,
      balance: 0,
    }

    onAddFriend(newFriend)

  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>👯‍♂️ Friend Name</label>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)}/>

      <label>🌅 Image URL</label>
      <input type="text" value={image} onChange={(e) => setImage(e.target.value)}/>

      <Button>Add</Button>
    </form>
  )
}

function FormSplitBill({selectedFriend, onSplitBill}) {
  const [bill, setBill] = useState('')
  const [paidByUser, setPaidByUser] = useState('')
  const [whoIsPaying, setWhoIsPaying] = useState('user')

  const friendsExpense = bill ? bill - paidByUser : ''

  function handleSlitSubmit(e) {
    e.preventDefault()

    if(!bill || !paidByUser) return 

    onSplitBill(whoIsPaying === 'user' ? friendsExpense : -paidByUser)
  }

  return (
    <form className="form-split-bill" onSubmit={handleSlitSubmit}>
      <h2>Split a bill with {selectedFriend.name}</h2>

      <label>💵 Bill Value</label>
      <input type="text" value={bill} onChange={(e) => setBill(+e.target.value)}/>

      <label>👱‍♂️ Your Expense</label>
      <input type="text" value={paidByUser} onChange={(e) => setPaidByUser(+e.target.value > bill ? paidByUser : +e.target.value)}/>

      <label>👯‍♂️ {selectedFriend.name} Expense</label>
      <input type="text" value={friendsExpense} disabled />

      <label>👍 Who is paying the bill</label>
      <select value={whoIsPaying} onChange={(e) => setWhoIsPaying(e.target.value)}>
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>

      <Button>Split Bill</Button>
    </form>
  )
}