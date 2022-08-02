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
    <div className="my-4 col-md-6 mx-auto border border-2 p-3 rounded-3 shadow">
    <h3>Add a new location</h3>
      <form>
        <label className='form-label d-block'>Name:
        <input type="text" value={name} onChange={e => setName(e.target.value)} className="form-control" />
        </label>
        
        <div className="row gx-2">
          <label className='form-label col-12 col-sm-6'>Latitude:
          <input type="number" step="any" value={lat} onChange={e => setLat(e.target.value)} className="form-control" />
          </label>

          <label className='form-label col-12 col-sm-6'>Longitude:
          <input type="number" step="any" value={lon} onChange={e => setLon(e.target.value)} className="form-control" />
        </label>
        </div>

        <label className='form-label col-12'>Address: 
        <input type="text" value={address} onChange={e => setAddress(e.target.value)} className="form-control" />
        </label>

        <input type="submit" value="Submit" onClick={handleSubmit} className="btn btn-primary"/>
      </form>
    </div>
  )
}

export default InputLocation;