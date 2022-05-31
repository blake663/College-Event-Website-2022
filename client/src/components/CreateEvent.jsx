import { useEffect, useState } from "react";

const CreateEvent = ({ email }) => {

  const [ name, setName ] = useState('');
  const [ dateTime, setDateTime ] = useState('');
  const [ location, setLocation ] = useState('');
  const [ description, setDescription ] = useState("");
  const [ rso_id, setRso_id ] = useState(-1);
  const [ visibility_level, setVisibility_level ] = useState(1);
  const [ locationsList, setLocationsList ] = useState([]);
  const [ rsos, setRsos ] = useState([]);


  async function getLocations() {
    const res = await fetch("http://localhost:5000/locations");

    const locations = await res.json();

    console.log(locations);

    setLocationsList(locations);
  }

  
  async function getRsos() {
    const res = await fetch("http://localhost:5000/rsos");

    const result = await res.json();

    console.log(result);

    setRsos(result);
  }

  useEffect(() => {
    getLocations();
    getRsos();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const body = { name, dateTime, location, description, rso_id, visibility_level };
      console.log(body);
      const response = await fetch("http://localhost:5000/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      window.location = '/'
    } catch (err) {
      console.error(err);
    }
  }

  function handleSetDateTime(s) {
    setDateTime(s.substr(0, s.length-2)+"00")
  }

  return (
    <>
      <div className="mb-4">
        <h3>Create Event</h3>
        <form onSubmit={handleSubmit}>
          <label style={{display:"block"}}>Event Name: 
            <input required type="text" value={name} onChange={e => setName(e.target.value)} />
          </label>

          <label style={{display:"block"}}>Date and time: 
            <input required type="datetime-local" value={dateTime} onChange={e => handleSetDateTime(e.target.value)} />
          </label>

          <label style={{display:"block"}}>Location:
            <select required value={location} onChange={e => setLocation(e.target.value)}>
              <option></option>
              {
                locationsList.map((item, index) => 
                  <option value={item.lname} key={index}>{item.lname}</option>
                )
              }
            </select>
          </label>

          <label style={{display:"block"}}>Description:
            <textarea value={description} onChange={e => setDescription(e.target.value)} style={{width:"300px"}}/>
          </label>

          <label style={{display:"block"}}>RSO:
            <select required value={rso_id} onChange={e => setRso_id(e.target.value)}>
              <option></option>
              {
                rsos.filter(x => x.Email == email).map((item, index) =>
                  <option value={item.RSO_ID} key={index}>{item.RSO_name}</option>
                )
              }
            </select>
          </label>
          <fieldset required>
            <legend>Visibility:</legend>

            <label>RSO:
              <input required type="radio" name="vis_radio" value={visibility_level} onChange={e => setVisibility_level(1)}/>
            </label>

            <label>Private:
              <input required type="radio" name="vis_radio" value={visibility_level} onChange={e => setVisibility_level(2)}/>
            </label>

            <label>Public:
              <input required type="radio" name="vis_radio" value={visibility_level} onChange={e => setVisibility_level(3)}/>
            </label>
          </fieldset>
          <button>Submit</button>
        </form>
      </div>
    </>
  )
}

export default CreateEvent;