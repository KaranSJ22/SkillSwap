import React from 'react';
import DevProfileCard from '../Components/DevProfileCard/DevprofileCard';
import pic1  from '../assets/1.jpg';
const users=[
  {
    id:1,
    name:"Karan SJ",
    year:"2nd Year",
    email:"karansj@gmail.com",
    profileImage:""
  },
  {
    id:3,
    name:"K Akshay",
    year:"2nd Year",
    email:"kakshay@gmail.com",
    profileImage:{pic1}
  },
  {
    id:2,
    name:"Goutam Kulkarni",
    year:"2nd Year",
    email:"goutamk@gmail.com",
    profileImage:""
  },
  
  {
    id:4,
    name:"K Hitheswara Rao",
    year:"2nd Year",
    email:"hitheswara@gmail.com",
    profileImage:"",
  }

]
const Contact = () => {
  return (
    <>
    <div>
      <h1>Contact Us</h1>
      <p>Feel free to reach out for any queries or collaborations.</p>
    </div>
    <hr />
    <div className="profile-card-grid">
        {users.map((user) => (
          <DevProfileCard
            key={user.id}
            name={user.name}
            year={user.year}
            email={user.email}
            profileImage={user.profileImage}
          />
        ))}
      </div>    
    </>

    
  );
};

export default Contact;
