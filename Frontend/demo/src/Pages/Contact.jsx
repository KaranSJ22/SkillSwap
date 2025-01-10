import React from 'react';
import DevProfileCard from '../Components/DevProfileCard/DevprofileCard';
const users=[
  {
    id:4,
    name:"Karan SJ",
    year:"2nd Year",
    email:"karansj@gmail.com",
    profileImage:"https://media.licdn.com/dms/image/v2/D5603AQHF3T8cHwSusg/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1705587748017?e=1740614400&v=beta&t=6LCdxQlu_ZFAs8nKapNlnCST-xlTZ4rVtzKWph4He54"
  },
  {
    id:4,
    name:"Goutam Kulkarni",
    year:"2nd Year",
    email:"goutamk@gmail.com",
    profileImage:"https://media.licdn.com/dms/image/v2/D5603AQHF3T8cHwSusg/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1705587748017?e=1740614400&v=beta&t=6LCdxQlu_ZFAs8nKapNlnCST-xlTZ4rVtzKWph4He54"
  },
  {
    id:4,
    name:"K Akshay",
    year:"2nd Year",
    email:"kakshay@gmail.com",
    profileImage:"https://media.licdn.com/dms/image/v2/D5603AQHF3T8cHwSusg/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1705587748017?e=1740614400&v=beta&t=6LCdxQlu_ZFAs8nKapNlnCST-xlTZ4rVtzKWph4He54"
  },
  {
    id:4,
    name:"K Hitheswara Rao",
    year:"2nd Year",
    email:"hitheswara@gmail.com",
    profileImage:"https://media.licdn.com/dms/image/v2/D5603AQHF3T8cHwSusg/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1705587748017?e=1740614400&v=beta&t=6LCdxQlu_ZFAs8nKapNlnCST-xlTZ4rVtzKWph4He54"
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
