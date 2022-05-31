import { useState } from 'react';


const InputLocation = () => {

  const [ name, setName ] = useState('');
  const [ lat, setLat ] = useState('');
  const [ lon, setLon ] = useState('');
  const [ address, setAddress ] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const body = { name, lat, lon, address };
      const response = await fetch("http://localhost:5000/locations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
      });
      
      console.log( response.json());
      window.location = '/';
    } catch (err) {
      console.error(err.message);
    }
  }



  return (
    <div className="my-4">
    <h3>Add a new location</h3>
      <form>
        <label style={{display:"block"}}>Name:
        <input type="text" value={name} onChange={e => setName(e.target.value)} />
        </label>

        <label style={{display:"block"}}>Latitude:
        <input type="number" step="any" value={lat} onChange={e => setLat(e.target.value)} />
        </label>

        <label style={{display:"block"}}>Longitude:
        <input type="number" step="any" value={lon} onChange={e => setLon(e.target.value)} />
        </label>

        <label style={{display:"block"}}>Address: 
        <input type="text" value={address} onChange={e => setAddress(e.target.value)} />
        </label>

        <input type="submit" value="Submit" onClick={handleSubmit} />
      </form>
    </div>
  )
}

export default InputLocation;