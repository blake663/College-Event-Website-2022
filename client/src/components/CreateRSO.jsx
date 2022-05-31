import { useState } from 'react';


const CreateRSO = ({ email }) => {

  const [ name, setName ] = useState('');
  const [ member1, setMember1 ] = useState('');
  const [ member2, setMember2 ] = useState('');
  const [ member3, setMember3 ] = useState('');
  const [ member4, setMember4 ] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const members = [member1, member2, member3, member4];
      const body = { name, email, members };
      console.log('body is ', JSON.stringify(body));
      const response = await fetch("http://localhost:5000/rsos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
      });
      
      console.log( response.json());
      // window.location = '/';
    } catch (err) {
      console.error(err.message);
    }
  }



  return (
    <div className="my-4">
      <h3>Create a new RSO</h3>
      <form>
        <label style={{display:"block"}}>Name: 
        <input type="text" value={name} onChange={e => setName(e.target.value)} />
        </label>

        <label style={{display:"block"}}>member 1:
        <input type="email" value={member1} onChange={e => setMember1(e.target.value)} />
        </label>

        <label style={{display:"block"}}>member 2: 
        <input type="email" value={member2} onChange={e => setMember2(e.target.value)} />
        </label>

        <label style={{display:"block"}}>member 3: 
        <input type="email" value={member3} onChange={e => setMember3(e.target.value)} />
        </label>

        <label style={{display:"block"}}>member 4:
        <input type="text" value={member4} onChange={e => setMember4(e.target.value)} />
        </label>

        <input type="submit" value="Submit" onClick={handleSubmit} style={{display:"block"}} />
      </form>
    </div>
  )
}

export default CreateRSO;